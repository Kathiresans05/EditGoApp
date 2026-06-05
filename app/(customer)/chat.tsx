import React, { useState, useEffect, useRef } from 'react';
import {
  View, Text, StyleSheet, FlatList, TextInput, TouchableOpacity,
  KeyboardAvoidingView, Platform, ActivityIndicator, StatusBar,
} from 'react-native';
import { Send, ChevronLeft, Phone, MoreVertical, MessageSquare } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter, useLocalSearchParams } from 'expo-router';
import io from 'socket.io-client';
import { authService, BASE_URL } from '../../src/services/api';
import LiveStreamModal from '../../src/components/LiveStreamModal';

const SOCKET_URL = BASE_URL.replace('/api', '');

export default function ChatScreen() {
  const router = useRouter();
  const { orderId, editorName } = useLocalSearchParams();
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState<any[]>([]);
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [isCalling, setIsCalling] = useState(false);
  const [isIncomingCall, setIsIncomingCall] = useState(false);
  const [editorOnline, setEditorOnline] = useState(false);
  const socketRef = useRef<any>(null);
  const flatListRef = useRef<any>(null);

  useEffect(() => {
    const initChat = async () => {
      try {
        const user = await authService.getMe();
        setCurrentUser(user);
        socketRef.current = io(SOCKET_URL);
        socketRef.current.emit('join_order', { orderId, role: 'Customer' });
        
        socketRef.current.on('user_joined', (data: any) => {
          setEditorOnline(true);
          setMessages(prev => [...prev, {
            id: Date.now().toString() + Math.random(),
            type: 'system',
            text: 'Editor has joined the chat',
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
          }]);
        });

        socketRef.current.on('receive_message', (data: any) => {
          if (data.message === '__CALL_RINGING__') {
            setIsIncomingCall(true);
            setIsCalling(true);
            return;
          }
          setMessages(prev => [...prev, {
            id: Date.now().toString(),
            text: data.message,
            senderId: data.senderId,
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
          }]);
        });
      } catch (error) {
        console.error('Chat Init Error:', error);
      } finally {
        setLoading(false);
      }
    };
    initChat();
    return () => { if (socketRef.current) socketRef.current.disconnect(); };
  }, [orderId]);

  const handleSend = () => {
    if (!message.trim() || !socketRef.current) return;
    const msgData = { orderId, message, senderId: currentUser.id };
    socketRef.current.emit('send_message', msgData);
    setMessages(prev => [...prev, {
      id: Date.now().toString(),
      text: message,
      senderId: currentUser.id,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }]);
    setMessage('');
  };

  if (loading) return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#F8FAFC' }}>
      <ActivityIndicator size="large" color="#7C3AED" />
    </View>
  );

  const editorInitial = ((editorName as string) || 'E')[0].toUpperCase();

  return (
    <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#7C3AED" />

      {/* Header */}
      <LinearGradient colors={['#7C3AED', '#5B21B6']} style={styles.header}>
        <View style={styles.headerRow}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
            <ChevronLeft size={22} color="#FFF" />
          </TouchableOpacity>

          {/* Editor Avatar + Name */}
          <View style={styles.editorInfo}>
            <View style={styles.editorAvatar}>
              <Text style={styles.editorAvatarText}>{editorInitial}</Text>
            </View>
            <View>
              <Text style={styles.editorName}>{editorName || 'Expert Editor'}</Text>
              <View style={styles.statusRow}>
                <View style={[styles.onlineDot, { backgroundColor: editorOnline ? '#4ADE80' : '#94A3B8' }]} />
                <Text style={styles.statusText}>{editorOnline ? 'Online' : 'Offline'}</Text>
              </View>
            </View>
          </View>

          <TouchableOpacity style={[styles.callBtn, isCalling && { backgroundColor: '#EF4444' }]} onPress={() => { setIsIncomingCall(false); setIsCalling(true); }}>
            <Phone size={18} color="#FFF" />
          </TouchableOpacity>
        </View>
      </LinearGradient>

      {/* Video Call View */}
      {isCalling && currentUser && (
        <LiveStreamModal 
          visible={isCalling} 
          onClose={() => setIsCalling(false)} 
          roomId={`EditGo-Order-${orderId}`}
          orderId={orderId as string}
          currentUser={currentUser}
          recipientName={editorName as string || 'Editor'}
          isIncoming={isIncomingCall}
        />
      )}

      {/* Messages */}
      <FlatList
        ref={flatListRef}
        data={messages}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.chatList}
        onContentSizeChange={() => flatListRef.current?.scrollToEnd()}
        renderItem={({ item }) => {
          if (item.type === 'system') {
            return (
              <View style={{ alignItems: 'center', marginVertical: 10 }}>
                <View style={{ backgroundColor: '#EDE7F6', paddingHorizontal: 12, paddingVertical: 4, borderRadius: 12 }}>
                  <Text style={{ fontSize: 12, color: '#7C3AED', fontWeight: '600' }}>{item.text}</Text>
                </View>
              </View>
            );
          }
          const isMe = item.senderId === currentUser?.id;
          return (
            <View style={[styles.bubbleWrap, isMe ? { alignItems: 'flex-end' } : { alignItems: 'flex-start' }]}>
              {!isMe && (
                <View style={styles.smallAvatar}>
                  <Text style={styles.smallAvatarText}>{editorInitial}</Text>
                </View>
              )}
              <View style={[styles.bubble, isMe ? styles.myBubble : styles.theirBubble]}>
                <Text style={[styles.bubbleText, isMe && styles.myBubbleText]}>{item.text}</Text>
                <Text style={[styles.bubbleTime, isMe && styles.myBubbleTime]}>{item.timestamp}</Text>
              </View>
            </View>
          );
        }}
        ListEmptyComponent={
          <View style={styles.empty}>
            <View style={styles.emptyIcon}>
              <MessageSquare size={36} color="#7C3AED" />
            </View>
            <Text style={styles.emptyTitle}>No messages yet</Text>
            <Text style={styles.emptyText}>Start a conversation with your editor</Text>
          </View>
        }
      />

      {/* Input */}
      <View style={styles.inputArea}>
        <View style={styles.inputRow}>
          <TextInput
            style={styles.input}
            placeholder="Type a message..."
            placeholderTextColor="#94A3B8"
            value={message}
            onChangeText={setMessage}
            multiline
          />
          <TouchableOpacity
            style={[styles.sendBtn, !message.trim() && styles.sendBtnDisabled]}
            onPress={handleSend}
            disabled={!message.trim()}
          >
            <Send size={18} color="#FFF" />
          </TouchableOpacity>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8FAFC' },

  header: {
    paddingTop: 55, paddingBottom: 16, paddingHorizontal: 16,
    borderBottomLeftRadius: 24, borderBottomRightRadius: 24,
  },
  headerRow: { flexDirection: 'row', alignItems: 'center' },
  backBtn: {
    width: 38, height: 38, borderRadius: 12,
    backgroundColor: 'rgba(255,255,255,0.2)', alignItems: 'center', justifyContent: 'center',
    marginRight: 10,
  },
  editorInfo: { flex: 1, flexDirection: 'row', alignItems: 'center', gap: 10 },
  editorAvatar: {
    width: 42, height: 42, borderRadius: 13,
    backgroundColor: 'rgba(255,255,255,0.25)',
    alignItems: 'center', justifyContent: 'center',
    borderWidth: 2, borderColor: 'rgba(255,255,255,0.4)',
  },
  editorAvatarText: { fontSize: 18, fontWeight: '900', color: '#FFF' },
  editorName: { fontSize: 15, fontWeight: '800', color: '#FFF' },
  statusRow: { flexDirection: 'row', alignItems: 'center', gap: 5, marginTop: 2 },
  onlineDot: { width: 7, height: 7, borderRadius: 4, backgroundColor: '#4ADE80' },
  statusText: { fontSize: 11, color: 'rgba(255,255,255,0.8)', fontWeight: '600' },
  callBtn: {
    width: 38, height: 38, borderRadius: 12,
    backgroundColor: 'rgba(255,255,255,0.2)', alignItems: 'center', justifyContent: 'center',
  },

  chatList: { padding: 16, paddingBottom: 20, gap: 12 },
  bubbleWrap: { flexDirection: 'row', alignItems: 'flex-end', gap: 8, marginBottom: 4 },
  smallAvatar: {
    width: 30, height: 30, borderRadius: 10,
    backgroundColor: '#EDE7F6', alignItems: 'center', justifyContent: 'center', marginBottom: 4,
  },
  smallAvatarText: { fontSize: 13, fontWeight: '900', color: '#7C3AED' },
  bubble: { maxWidth: '72%', borderRadius: 18, paddingHorizontal: 14, paddingVertical: 10 },
  myBubble: { backgroundColor: '#7C3AED', borderBottomRightRadius: 4 },
  theirBubble: {
    backgroundColor: '#FFF', borderBottomLeftRadius: 4,
    shadowColor: '#000', shadowOpacity: 0.06, shadowRadius: 6, elevation: 2,
  },
  bubbleText: { fontSize: 14, color: '#1E293B', fontWeight: '600', lineHeight: 20 },
  myBubbleText: { color: '#FFF' },
  bubbleTime: { fontSize: 10, color: '#94A3B8', marginTop: 4, fontWeight: '700', textAlign: 'right' },
  myBubbleTime: { color: 'rgba(255,255,255,0.65)' },

  empty: { alignItems: 'center', paddingTop: 80 },
  emptyIcon: {
    width: 72, height: 72, borderRadius: 22,
    backgroundColor: '#EDE7F6', alignItems: 'center', justifyContent: 'center', marginBottom: 16,
  },
  emptyTitle: { fontSize: 17, fontWeight: '900', color: '#1E293B' },
  emptyText: { fontSize: 13, color: '#94A3B8', fontWeight: '600', marginTop: 6 },

  inputArea: {
    backgroundColor: '#FFF', borderTopWidth: 1, borderTopColor: '#F1F5F9',
    paddingHorizontal: 16, paddingVertical: 10,
    paddingBottom: Platform.OS === 'ios' ? 34 : 14,
  },
  inputRow: {
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: '#F1F5F9', borderRadius: 24,
    paddingLeft: 16, paddingRight: 6, paddingVertical: 6, gap: 8,
  },
  input: { flex: 1, fontSize: 14, color: '#1E293B', maxHeight: 100, fontWeight: '600' },
  sendBtn: {
    width: 40, height: 40, borderRadius: 20,
    backgroundColor: '#7C3AED', alignItems: 'center', justifyContent: 'center',
  },
  sendBtnDisabled: { backgroundColor: '#CBD5E1' },
});
