import React, { useState, useEffect, useRef } from 'react';
import { View, Modal, StyleSheet, TouchableOpacity, SafeAreaView, Platform, Text, TextInput, FlatList, KeyboardAvoidingView, Animated, PermissionsAndroid } from 'react-native';
import { X, Send, Mic, MicOff, Video, VideoOff, PhoneOff, Volume2, User } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';
import io from 'socket.io-client';
import { BASE_URL } from '../services/api';
import { Audio } from 'expo-av';
import {
  RTCPeerConnection,
  RTCIceCandidate,
  RTCSessionDescription,
  RTCView,
  MediaStream,
  mediaDevices,
} from 'react-native-webrtc';

const SOCKET_URL = BASE_URL.replace('/api', '');

const configuration = {
  iceServers: [
    { urls: 'stun:stun.l.google.com:19302' },
    { urls: 'stun:stun1.l.google.com:19302' },
  ],
};

interface LiveStreamModalProps {
  visible: boolean;
  onClose: () => void;
  roomId: string;
  orderId?: string;
  currentUser?: any;
  recipientName?: string;
  isIncoming?: boolean;
}

export default function LiveStreamModal({ visible, onClose, roomId, orderId, currentUser, recipientName, isIncoming }: LiveStreamModalProps) {
  const [messages, setMessages] = useState<any[]>([]);
  const [inputText, setInputText] = useState('');
  const [callStatus, setCallStatus] = useState<'ringing' | 'connected' | 'ended'>('ringing');
  const [callDuration, setCallDuration] = useState(0);
  const [isMuted, setIsMuted] = useState(false);
  const [isVideoOn, setIsVideoOn] = useState(false);
  const [isSpeaker, setIsSpeaker] = useState(true);

  const [localStream, setLocalStream] = useState<MediaStream | null>(null);
  const [remoteStream, setRemoteStream] = useState<MediaStream | null>(null);

  const socketRef = useRef<any>(null);
  const peerConnectionRef = useRef<RTCPeerConnection | null>(null);
  const flatListRef = useRef<any>(null);
  const timerRef = useRef<any>(null);
  const pulseAnim = useRef(new Animated.Value(1)).current;

  const localStreamRef = useRef<MediaStream | null>(null);

  useEffect(() => {
    localStreamRef.current = localStream;
  }, [localStream]);

  // Configure audio session and speaker route for WebRTC call
  useEffect(() => {
    if (callStatus === 'connected') {
      Audio.setAudioModeAsync({
        allowsRecordingIOS: true,
        playsInSilentModeIOS: true,
        playThroughEarpieceAndroid: !isSpeaker,
        staysActiveInBackground: true,
      }).catch(err => console.log('Error setting audio mode for call:', err));
    } else if (callStatus === 'ended') {
      Audio.setAudioModeAsync({
        allowsRecordingIOS: false,
        playsInSilentModeIOS: true,
        playThroughEarpieceAndroid: true,
        staysActiveInBackground: false,
      }).catch(err => console.log('Error restoring audio mode:', err));
    }
  }, [callStatus, isSpeaker]);

  // Init local stream
  useEffect(() => {
    let stream: MediaStream | null = null;

    const initLocalStream = async () => {
      if (Platform.OS === 'android') {
        try {
          const granted = await PermissionsAndroid.requestMultiple([
            PermissionsAndroid.PERMISSIONS.RECORD_AUDIO,
            PermissionsAndroid.PERMISSIONS.CAMERA,
          ]);
          if (
            granted['android.permission.RECORD_AUDIO'] !== PermissionsAndroid.RESULTS.GRANTED ||
            granted['android.permission.CAMERA'] !== PermissionsAndroid.RESULTS.GRANTED
          ) {
            console.warn("Permissions not granted");
          }
        } catch (err) {
          console.warn(err);
        }
      }

      try {
        const s = await mediaDevices.getUserMedia({
          audio: true,
          video: false, // Start with audio only for P2P calling
        });
        setLocalStream(s);
        stream = s;
      } catch (err) {
        console.error("Failed to get local stream", err);
      }
    };

    if (visible) {
      initLocalStream();
    }

    return () => {
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
    };
  }, [visible]);

  // Setup Ringing Animation and Sound
  useEffect(() => {
    let soundObj: Audio.Sound | null = null;

    const playRinging = async () => {
      try {
        const { sound } = await Audio.Sound.createAsync(
          { uri: isIncoming 
            ? 'https://assets.mixkit.co/active_storage/sfx/2869/2869-preview.mp3' // Incoming ringtone
            : 'https://assets.mixkit.co/active_storage/sfx/2870/2870-preview.mp3' // Outgoing ringing
          },
          { shouldPlay: true, isLooping: true, volume: 1.0 }
        );
        soundObj = sound;
      } catch (error) {
        console.error("Error playing ringtone", error);
      }
    };

    if (visible && callStatus === 'ringing') {
      playRinging();
      Animated.loop(
        Animated.sequence([
          Animated.timing(pulseAnim, { toValue: 1.2, duration: 800, useNativeDriver: true }),
          Animated.timing(pulseAnim, { toValue: 1, duration: 800, useNativeDriver: true })
        ])
      ).start();
    } else {
      pulseAnim.stopAnimation();
      if (soundObj) {
        soundObj.stopAsync();
        soundObj.unloadAsync();
      }
    }

    return () => {
      if (soundObj) {
        soundObj.stopAsync();
        soundObj.unloadAsync();
      }
    };
  }, [visible, callStatus, isIncoming]);

  // Call duration timer
  useEffect(() => {
    if (callStatus === 'connected') {
      timerRef.current = setInterval(() => {
        setCallDuration(prev => prev + 1);
      }, 1000);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [callStatus]);

  const setupPeerConnection = (stream: MediaStream | null) => {
    const pc = new RTCPeerConnection(configuration);
    
    const activeStream = stream || localStreamRef.current;
    if (activeStream) {
      activeStream.getTracks().forEach((track) => pc.addTrack(track, activeStream));
    }

    pc.ontrack = (event) => {
      if (event.streams && event.streams[0]) {
        setRemoteStream(event.streams[0]);
      }
    };

    pc.onicecandidate = (event) => {
      if (event.candidate && socketRef.current) {
        socketRef.current.emit('webrtc_ice_candidate', {
          orderId,
          senderId: currentUser.id,
          candidate: event.candidate,
        });
      }
    };

    peerConnectionRef.current = pc;
    return pc;
  };

  const startWebRTC = async () => {
    const pc = setupPeerConnection(localStreamRef.current);
    try {
      const offer = await pc.createOffer();
      await pc.setLocalDescription(offer);
      socketRef.current.emit('webrtc_offer', {
        orderId,
        senderId: currentUser.id,
        offer,
      });
    } catch (e) {
      console.error(e);
    }
  };

  // Socket for chat and signaling
  useEffect(() => {
    if (visible && orderId && currentUser) {
      socketRef.current = io(SOCKET_URL);
      
      socketRef.current.on('connect', () => {
        socketRef.current.emit('join_order', orderId);
        if (!isIncoming) {
          socketRef.current.emit('send_message', { orderId, message: '__CALL_RINGING__', senderId: currentUser.id });
        }
      });
      
      socketRef.current.on('receive_message', (data: any) => {
        // Always process system call signals
        if (data.message === '__CALL_ACCEPTED__') {
          setCallStatus('connected');
          setCallDuration(0);
          startWebRTC();
          return;
        }
        if (data.message === '__CALL_DECLINED__') {
          handleCleanUpAndClose();
          return;
        }
        if (data.message === '__CALL_ENDED__') {
          handleCleanUpAndClose();
          return;
        }
        if (data.message === '__CALL_RINGING__') {
          return; // Handled globally to open modal
        }

        if (data.senderId !== currentUser.id) {
          setMessages(prev => [...prev, {
            id: Date.now().toString(),
            text: data.message,
            senderId: data.senderId,
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
          }]);
        }
      });

      // WebRTC Listeners
      socketRef.current.on('webrtc_offer', async (data: any) => {
        if (data.senderId !== currentUser.id) {
          const pc = setupPeerConnection(localStreamRef.current);
          try {
            await pc.setRemoteDescription(new RTCSessionDescription(data.offer));
            const answer = await pc.createAnswer();
            await pc.setLocalDescription(answer);
            socketRef.current.emit('webrtc_answer', {
              orderId,
              senderId: currentUser.id,
              answer,
            });
          } catch (e) {
            console.error(e);
          }
        }
      });

      socketRef.current.on('webrtc_answer', async (data: any) => {
        if (data.senderId !== currentUser.id && peerConnectionRef.current) {
          try {
            await peerConnectionRef.current.setRemoteDescription(new RTCSessionDescription(data.answer));
          } catch (e) {
            console.error(e);
          }
        }
      });

      socketRef.current.on('webrtc_ice_candidate', async (data: any) => {
        if (data.senderId !== currentUser.id && peerConnectionRef.current) {
          try {
            await peerConnectionRef.current.addIceCandidate(new RTCIceCandidate(data.candidate));
          } catch (e) {
            console.error(e);
          }
        }
      });

      return () => {
        if (socketRef.current) {
          socketRef.current.disconnect();
          socketRef.current = null;
        }
      };
    } else {
      setCallStatus('ringing');
      setCallDuration(0);
    }
  }, [visible, orderId, currentUser, isIncoming]);

  const handleSend = () => {
    if (!inputText.trim() || !socketRef.current) return;
    const messageData = { orderId, message: inputText, senderId: currentUser.id };
    socketRef.current.emit('send_message', messageData);
    setMessages(prev => [...prev, {
      id: Date.now().toString(),
      text: inputText,
      senderId: currentUser.id,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }]);
    setInputText('');
  };

  const handleCleanUpAndClose = () => {
    setCallStatus('ended');
    if (peerConnectionRef.current) {
      peerConnectionRef.current.close();
      peerConnectionRef.current = null;
    }
    setTimeout(onClose, 1500);
  };

  const handleEndCall = () => {
    if (socketRef.current) {
      socketRef.current.emit('send_message', { orderId, message: '__CALL_ENDED__', senderId: currentUser.id });
    }
    handleCleanUpAndClose();
  };

  const handleAccept = () => {
    setCallStatus('connected');
    setCallDuration(0);
    if (socketRef.current) {
      socketRef.current.emit('send_message', { orderId, message: '__CALL_ACCEPTED__', senderId: currentUser.id });
    }
  };

  const handleDecline = () => {
    if (socketRef.current) {
      socketRef.current.emit('send_message', { orderId, message: '__CALL_DECLINED__', senderId: currentUser.id });
    }
    handleCleanUpAndClose();
  };

  const toggleMute = () => {
    if (localStream) {
      localStream.getAudioTracks().forEach(track => {
        track.enabled = !track.enabled;
      });
      setIsMuted(!isMuted);
    }
  };

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  if (!visible) return null;

  return (
    <Modal visible={visible} animationType="slide" transparent onRequestClose={handleEndCall}>
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={{ flex: 1 }}>
        <LinearGradient colors={['#1e1b4b', '#312e81', '#1e1b4b']} style={styles.container}>
          <SafeAreaView style={styles.safeArea}>
            
            {/* Hidden RTC View for remote audio playback */}
            {remoteStream && (
              <RTCView streamURL={remoteStream.toURL()} style={{ width: 0, height: 0 }} />
            )}

            {/* Header */}
            <View style={styles.header}>
              <TouchableOpacity onPress={handleEndCall} style={styles.iconBtn}>
                <X size={24} color="#FFF" />
              </TouchableOpacity>
              <View style={styles.headerTitleContainer}>
                <Text style={styles.headerTitle}>End-to-End Encrypted</Text>
              </View>
              <View style={{ width: 40 }} />
            </View>

            {/* Call Info / Avatar Area */}
            <View style={styles.callInfoArea}>
              <Animated.View style={[styles.avatarContainer, callStatus === 'ringing' && { transform: [{ scale: pulseAnim }] }]}>
                <LinearGradient colors={['#8B5CF6', '#4F46E5']} style={styles.avatarGradient}>
                  <Text style={styles.avatarText}>{(recipientName || 'E').substring(0, 1).toUpperCase()}</Text>
                </LinearGradient>
              </Animated.View>
              
              <Text style={styles.callerName}>{recipientName || 'Edit Go User'}</Text>
              <Text style={styles.callStatusText}>
                {callStatus === 'ringing' 
                  ? (isIncoming ? 'Incoming Call...' : 'Calling...') 
                  : callStatus === 'ended' 
                    ? 'Call Ended' 
                    : formatTime(callDuration)}
              </Text>
            </View>

            {/* In-Call Controls */}
            {callStatus === 'ringing' && isIncoming ? (
              <View style={styles.controlsContainer}>
                <TouchableOpacity style={[styles.endCallBtn, { backgroundColor: '#EF4444', marginRight: 20 }]} onPress={handleDecline}>
                  <PhoneOff size={28} color="#FFF" />
                </TouchableOpacity>
                <TouchableOpacity style={[styles.endCallBtn, { backgroundColor: '#10B981', marginLeft: 20 }]} onPress={handleAccept}>
                  <Volume2 size={28} color="#FFF" />
                </TouchableOpacity>
              </View>
            ) : (
              <View style={styles.controlsContainer}>
                <TouchableOpacity style={[styles.controlBtn, isMuted && styles.controlBtnActive]} onPress={toggleMute}>
                  {isMuted ? <MicOff size={24} color="#FFF" /> : <Mic size={24} color="#FFF" />}
                </TouchableOpacity>
                
                <TouchableOpacity style={[styles.controlBtn, isVideoOn && styles.controlBtnActive]} onPress={() => setIsVideoOn(!isVideoOn)}>
                  {isVideoOn ? <Video size={24} color="#FFF" /> : <VideoOff size={24} color="#FFF" />}
                </TouchableOpacity>

                <TouchableOpacity style={[styles.controlBtn, isSpeaker && styles.controlBtnActive]} onPress={() => setIsSpeaker(!isSpeaker)}>
                  <Volume2 size={24} color="#FFF" />
                </TouchableOpacity>

                <TouchableOpacity style={styles.endCallBtn} onPress={handleEndCall}>
                  <PhoneOff size={28} color="#FFF" />
                </TouchableOpacity>
              </View>
            )}

            {/* Chat Area */}
            <View style={styles.chatSection}>
              <BlurView intensity={20} tint="dark" style={styles.chatBlur}>
                <FlatList
                  ref={flatListRef}
                  data={messages}
                  keyExtractor={item => item.id}
                  contentContainerStyle={styles.messageList}
                  onContentSizeChange={() => flatListRef.current?.scrollToEnd()}
                  renderItem={({ item }) => {
                    const isMe = item.senderId === currentUser?.id;
                    return (
                      <View style={[styles.messageRow, isMe ? styles.myMessageRow : styles.theirMessageRow]}>
                        <View style={[styles.bubble, isMe ? styles.myBubble : styles.theirBubble]}>
                          <Text style={[styles.messageText, isMe ? styles.myText : styles.theirText]}>{item.text}</Text>
                        </View>
                      </View>
                    );
                  }}
                  showsVerticalScrollIndicator={false}
                />
                <View style={styles.inputArea}>
                  <TextInput
                    style={styles.input}
                    placeholder="Send a message..."
                    placeholderTextColor="rgba(255,255,255,0.5)"
                    value={inputText}
                    onChangeText={setInputText}
                  />
                  <TouchableOpacity style={styles.sendBtn} onPress={handleSend}>
                    <Send size={18} color="#FFF" />
                  </TouchableOpacity>
                </View>
              </BlurView>
            </View>

          </SafeAreaView>
        </LinearGradient>
      </KeyboardAvoidingView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  safeArea: { flex: 1, paddingTop: Platform.OS === 'android' ? 40 : 0 },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 20, paddingTop: 10 },
  iconBtn: { padding: 8, backgroundColor: 'rgba(255,255,255,0.1)', borderRadius: 20 },
  headerTitleContainer: { alignItems: 'center' },
  headerTitle: { color: 'rgba(255,255,255,0.6)', fontSize: 12, fontWeight: '600' },
  
  callInfoArea: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  avatarContainer: { width: 120, height: 120, borderRadius: 60, elevation: 10, shadowColor: '#8B5CF6', shadowOffset: { width: 0, height: 10 }, shadowOpacity: 0.5, shadowRadius: 20 },
  avatarGradient: { width: '100%', height: '100%', borderRadius: 60, alignItems: 'center', justifyContent: 'center' },
  avatarText: { fontSize: 48, fontWeight: 'bold', color: '#FFF' },
  callerName: { fontSize: 28, fontWeight: '700', color: '#FFF', marginTop: 24, marginBottom: 8 },
  callStatusText: { fontSize: 16, color: 'rgba(255,255,255,0.8)', fontWeight: '500' },

  controlsContainer: { flexDirection: 'row', justifyContent: 'space-evenly', alignItems: 'center', paddingVertical: 30, paddingHorizontal: 20 },
  controlBtn: { width: 56, height: 56, borderRadius: 28, backgroundColor: 'rgba(255,255,255,0.15)', alignItems: 'center', justifyContent: 'center' },
  controlBtnActive: { backgroundColor: 'rgba(255,255,255,0.3)' },
  endCallBtn: { width: 64, height: 64, borderRadius: 32, backgroundColor: '#EF4444', alignItems: 'center', justifyContent: 'center', elevation: 5 },

  chatSection: { height: 250, borderTopLeftRadius: 24, borderTopRightRadius: 24, overflow: 'hidden' },
  chatBlur: { flex: 1 },
  messageList: { padding: 16 },
  messageRow: { marginBottom: 12, flexDirection: 'row' },
  myMessageRow: { justifyContent: 'flex-end' },
  theirMessageRow: { justifyContent: 'flex-start' },
  bubble: { maxWidth: '80%', paddingHorizontal: 16, paddingVertical: 10, borderRadius: 20 },
  myBubble: { backgroundColor: '#8B5CF6', borderBottomRightRadius: 4 },
  theirBubble: { backgroundColor: 'rgba(255,255,255,0.15)', borderBottomLeftRadius: 4 },
  messageText: { fontSize: 14, fontWeight: '500' },
  myText: { color: '#FFF' },
  theirText: { color: '#FFF' },
  
  inputArea: { flexDirection: 'row', padding: 12, paddingBottom: Platform.OS === 'ios' ? 24 : 12, alignItems: 'center' },
  input: { flex: 1, backgroundColor: 'rgba(255,255,255,0.1)', paddingHorizontal: 20, paddingVertical: 12, borderRadius: 24, fontSize: 14, color: '#FFF' },
  sendBtn: { width: 44, height: 44, borderRadius: 22, backgroundColor: '#8B5CF6', marginLeft: 12, alignItems: 'center', justifyContent: 'center' },
});
