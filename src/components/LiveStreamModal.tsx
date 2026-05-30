import React, { useState, useEffect, useRef } from 'react';
import { View, Modal, StyleSheet, TouchableOpacity, SafeAreaView, Platform, Text, TextInput, FlatList, KeyboardAvoidingView } from 'react-native';
import { WebView } from 'react-native-webview';
import { X, Send, User } from 'lucide-react-native';
import io from 'socket.io-client';
import { BASE_URL } from '../services/api';

const SOCKET_URL = BASE_URL.replace('/api', '');

interface LiveStreamModalProps {
  visible: boolean;
  onClose: () => void;
  roomId: string;
  orderId?: string;
  currentUser?: any;
}

export default function LiveStreamModal({ visible, onClose, roomId, orderId, currentUser }: LiveStreamModalProps) {
  const [messages, setMessages] = useState<any[]>([]);
  const [inputText, setInputText] = useState('');
  const socketRef = useRef<any>(null);
  const flatListRef = useRef<any>(null);

  const jitsiUrl = `https://meet.jit.si/${roomId}#config.prejoinPageEnabled=false&config.disableDeepLinking=true&config.startWithAudioMuted=true&config.startWithVideoMuted=true`;

  useEffect(() => {
    if (visible && orderId && currentUser) {
      socketRef.current = io(SOCKET_URL);
      socketRef.current.emit('join_order', orderId);
      
      socketRef.current.on('receive_message', (data: any) => {
        setMessages(prev => [...prev, {
          id: Date.now().toString(),
          text: data.message,
          senderId: data.senderId,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }]);
      });

      return () => {
        if (socketRef.current) socketRef.current.disconnect();
      };
    }
  }, [visible, orderId, currentUser]);

  const handleSend = () => {
    if (!inputText.trim() || !socketRef.current) return;

    const messageData = {
      orderId,
      message: inputText,
      senderId: currentUser.id
    };

    socketRef.current.emit('send_message', messageData);
    
    setMessages(prev => [...prev, {
      id: Date.now().toString(),
      text: inputText,
      senderId: currentUser.id,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }]);

    setInputText('');
  };

  return (
    <Modal visible={visible} animationType="slide" onRequestClose={onClose}>
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Studio Live Stream</Text>
          <TouchableOpacity onPress={onClose} style={styles.closeBtn}>
            <X size={24} color="#FFF" />
          </TouchableOpacity>
        </View>

        <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={{ flex: 1 }}>
          {/* Top Half: Stream */}
          <View style={styles.streamContainer}>
            <WebView
              source={{ uri: jitsiUrl }}
              style={styles.webview}
              javaScriptEnabled={true}
              domStorageEnabled={true}
              allowsInlineMediaPlayback={true}
              mediaPlaybackRequiresUserAction={false}
              originWhitelist={['*']}
            />
          </View>

          {/* Bottom Half: Chat */}
          {orderId && currentUser ? (
            <View style={styles.chatContainer}>
              <FlatList
                ref={flatListRef}
                data={messages}
                keyExtractor={item => item.id}
                contentContainerStyle={styles.messageList}
                onContentSizeChange={() => flatListRef.current?.scrollToEnd()}
                renderItem={({ item }) => {
                  const isMe = item.senderId === currentUser.id;
                  return (
                    <View style={[styles.messageRow, isMe ? styles.myMessageRow : styles.theirMessageRow]}>
                      <View style={[styles.bubble, isMe ? styles.myBubble : styles.theirBubble]}>
                        <Text style={[styles.messageText, isMe ? styles.myText : styles.theirText]}>{item.text}</Text>
                        <Text style={[styles.timeText, isMe ? styles.myTime : styles.theirTime]}>{item.timestamp}</Text>
                      </View>
                    </View>
                  );
                }}
                ListEmptyComponent={
                  <View style={styles.emptyChat}>
                    <Text style={styles.emptyText}>No messages yet. Say hi!</Text>
                  </View>
                }
              />
              <View style={styles.inputArea}>
                <TextInput
                  style={styles.input}
                  placeholder="Chat here..."
                  placeholderTextColor="#94A3B8"
                  value={inputText}
                  onChangeText={setInputText}
                />
                <TouchableOpacity style={styles.sendBtn} onPress={handleSend}>
                  <Send size={18} color="#FFF" />
                </TouchableOpacity>
              </View>
            </View>
          ) : null}
        </KeyboardAvoidingView>
      </SafeAreaView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0F172A' },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 16, paddingTop: Platform.OS === 'android' ? 40 : 16, backgroundColor: '#1E293B' },
  headerTitle: { color: '#FFF', fontSize: 16, fontWeight: '800' },
  closeBtn: { padding: 8, backgroundColor: 'rgba(255,255,255,0.1)', borderRadius: 8 },
  streamContainer: { flex: 0.5, backgroundColor: '#000' },
  webview: { flex: 1 },
  chatContainer: { flex: 0.5, backgroundColor: '#FFF' },
  messageList: { padding: 16 },
  messageRow: { marginBottom: 12, flexDirection: 'row' },
  myMessageRow: { justifyContent: 'flex-end' },
  theirMessageRow: { justifyContent: 'flex-start' },
  bubble: { maxWidth: '85%', padding: 12, borderRadius: 16 },
  myBubble: { backgroundColor: '#8B5CF6', borderBottomRightRadius: 4 },
  theirBubble: { backgroundColor: '#F1F5F9', borderBottomLeftRadius: 4 },
  messageText: { fontSize: 14, fontWeight: '600' },
  myText: { color: '#FFF' },
  theirText: { color: '#1E293B' },
  timeText: { fontSize: 9, marginTop: 4, fontWeight: '700' },
  myTime: { color: 'rgba(255,255,255,0.7)', textAlign: 'right' },
  theirTime: { color: '#94A3B8' },
  inputArea: { flexDirection: 'row', padding: 12, borderTopWidth: 1, borderTopColor: '#E2E8F0', alignItems: 'center', backgroundColor: '#FFF' },
  input: { flex: 1, backgroundColor: '#F8FAFC', paddingHorizontal: 16, paddingVertical: 10, borderRadius: 20, fontSize: 14, color: '#1E293B' },
  sendBtn: { width: 40, height: 40, borderRadius: 20, backgroundColor: '#8B5CF6', marginLeft: 10, alignItems: 'center', justifyContent: 'center' },
  emptyChat: { alignItems: 'center', marginTop: 40 },
  emptyText: { color: '#94A3B8', fontSize: 13, fontWeight: '600' },
});
