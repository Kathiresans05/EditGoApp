import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Modal, TextInput, TouchableOpacity, FlatList, KeyboardAvoidingView, Platform, ActivityIndicator, Linking } from 'react-native';
import { X, Send, User, MessageSquare, Phone } from 'lucide-react-native';
import { GlassCard } from './ui/GlassCard';
import { LinearGradient } from 'expo-linear-gradient';
import io from 'socket.io-client';
import { BASE_URL } from '../services/api';

export default function ChatModal({ visible, onClose, orderId, currentUser, recipientName, onNewMessage, recipientPhone, onCallPress, onIncomingCall }: any) {
  const [messages, setMessages] = useState<any[]>([]);
  const [inputText, setInputText] = useState('');
  const [loading, setLoading] = useState(true);
  const socketRef = useRef<any>(null);
  const flatListRef = useRef<any>(null);
  const visibleRef = useRef(visible);

  useEffect(() => {
    visibleRef.current = visible;
  }, [visible]);

  useEffect(() => {
    if (orderId) {
      // Connect socket
      const socketUrl = BASE_URL.replace('/api', '');
      socketRef.current = io(socketUrl);
      
      socketRef.current.on('connect', () => {
        socketRef.current.emit('join_order', orderId);
      });
      
      socketRef.current.on('receive_message', (data: any) => {
        console.log('[ChatModal] receive_message event received!', data);
        console.log('[ChatModal] Current User ID:', currentUser?.id);
        
        // Always process system call signals
        if (data.message === '__CALL_RINGING__') {
          console.log('[ChatModal] Processing __CALL_RINGING__. Condition: ', data.senderId, '!==', currentUser?.id, ' => ', data.senderId !== currentUser?.id);
          if (data.senderId !== currentUser.id) { 
            console.log('[ChatModal] Firing onIncomingCall!');
            if (onIncomingCall) onIncomingCall();
          }
          return;
        }
        if (data.message === '__CALL_ACCEPTED__' || data.message === '__CALL_DECLINED__' || data.message === '__CALL_ENDED__') {
          return;
        }

        // Prevent adding duplicate chat messages from self if optimistic updates are used
        if (data.senderId !== currentUser.id) {
          setMessages(prev => [...prev, {
            id: Date.now().toString(),
            text: data.message,
            senderId: data.senderId,
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
          }]);
          
          if (!visibleRef.current && onNewMessage) {
            onNewMessage();
          }
        }
      });

      socketRef.current.on('incoming_call', (data: any) => {
        if (data.senderId !== currentUser.id && onIncomingCall) {
          onIncomingCall();
        }
      });

      setLoading(false);

      return () => {
        if (socketRef.current) {
          socketRef.current.disconnect();
          socketRef.current = null;
        }
      };
    }
  }, [orderId]);

  const handleSend = () => {
    if (!inputText.trim()) return;

    const messageData = {
      orderId,
      message: inputText,
      senderId: currentUser.id
    };

    socketRef.current.emit('send_message', messageData);
    
    // Add to local UI
    setMessages(prev => [...prev, {
      id: Date.now().toString(),
      text: inputText,
      senderId: currentUser.id,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }]);

    setInputText('');
  };

  return (
    <Modal visible={visible} animationType="slide" transparent={true} onRequestClose={onClose}>
      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : undefined} 
        style={styles.overlay}
      >
        <View style={styles.container}>
          {/* Header */}
          <LinearGradient colors={['#8B5CF6', '#6366F1']} style={styles.header}>
            <View style={styles.headerRow}>
              <View style={styles.headerInfo}>
                <View style={styles.headerAvatar}>
                  <User size={20} color="#FFF" />
                </View>
                <View>
                  <Text style={styles.headerTitle}>{recipientName || "Studio Chat"}</Text>
                  {recipientName && <Text style={styles.headerSubtitle}>Active now</Text>}
                </View>
              </View>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 16 }}>
                {(recipientPhone || onCallPress) && (
                  <TouchableOpacity onPress={() => onCallPress ? onCallPress() : (recipientPhone ? Linking.openURL(`tel:${recipientPhone}`) : null)} style={styles.closeBtn}>
                    <Phone size={20} color="#FFF" />
                  </TouchableOpacity>
                )}
                <TouchableOpacity onPress={onClose} style={styles.closeBtn}>
                  <X size={24} color="#FFF" />
                </TouchableOpacity>
              </View>
            </View>
          </LinearGradient>

          {/* Chat Body */}
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
                  {!isMe && (
                    <View style={styles.avatarMini}>
                      <User size={12} color="#8B5CF6" />
                    </View>
                  )}
                  <View style={[styles.bubble, isMe ? styles.myBubble : styles.theirBubble]}>
                    <Text style={[styles.messageText, isMe ? styles.myText : styles.theirText]}>
                      {item.text}
                    </Text>
                    <Text style={[styles.timeText, isMe ? styles.myTime : styles.theirTime]}>
                      {item.timestamp}
                    </Text>
                  </View>
                </View>
              );
            }}
            ListEmptyComponent={
              <View style={styles.emptyChat}>
                <MessageSquare size={48} color="#E2E8F0" />
                <Text style={styles.emptyText}>Direct messages with your expert.</Text>
                <Text style={styles.emptySub}>Start by saying hello!</Text>
              </View>
            }
          />

          {/* Input Area */}
          <View style={styles.inputArea}>
            <TextInput
              style={styles.input}
              placeholder="Type your message..."
              value={inputText}
              onChangeText={setInputText}
              multiline
            />
            <TouchableOpacity 
              style={[styles.sendBtn, !inputText.trim() && styles.disabledSend]} 
              onPress={handleSend}
              disabled={!inputText.trim()}
            >
              <Send size={20} color="#FFF" />
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'flex-end' },
  container: { height: '80%', backgroundColor: '#FFF', borderTopLeftRadius: 32, borderTopRightRadius: 32, overflow: 'hidden' },
  header: { padding: 24, paddingBottom: 20 },
  headerRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  headerInfo: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  headerAvatar: { width: 40, height: 40, borderRadius: 20, backgroundColor: 'rgba(255,255,255,0.2)', alignItems: 'center', justifyContent: 'center' },
  headerTitle: { color: '#FFF', fontSize: 18, fontWeight: '900' },
  headerSubtitle: { color: '#E2E8F0', fontSize: 12, fontWeight: '600' },
  closeBtn: { padding: 4 },
  messageList: { padding: 20, paddingBottom: 40 },
  messageRow: { marginBottom: 16, flexDirection: 'row', alignItems: 'flex-end' },
  myMessageRow: { justifyContent: 'flex-end' },
  theirMessageRow: { justifyContent: 'flex-start' },
  avatarMini: { width: 24, height: 24, borderRadius: 12, backgroundColor: '#F5F3FF', alignItems: 'center', justifyContent: 'center', marginRight: 8 },
  bubble: { maxWidth: '80%', padding: 14, borderRadius: 20 },
  myBubble: { backgroundColor: '#8B5CF6', borderBottomRightRadius: 4 },
  theirBubble: { backgroundColor: '#F1F5F9', borderBottomLeftRadius: 4 },
  messageText: { fontSize: 15, lineHeight: 20, fontWeight: '600' },
  myText: { color: '#FFF' },
  theirText: { color: '#1E293B' },
  timeText: { fontSize: 9, marginTop: 4, fontWeight: '700' },
  myTime: { color: 'rgba(255,255,255,0.7)', textAlign: 'right' },
  theirTime: { color: '#94A3B8' },
  inputArea: { flexDirection: 'row', padding: 20, paddingBottom: Platform.OS === 'ios' ? 40 : 20, borderTopWidth: 1, borderTopColor: '#F1F5F9', alignItems: 'center' },
  input: { flex: 1, backgroundColor: '#F8FAFC', paddingHorizontal: 16, paddingVertical: 12, borderRadius: 24, fontSize: 15, color: '#1E293B', maxHeight: 100 },
  sendBtn: { width: 48, height: 48, borderRadius: 24, backgroundColor: '#8B5CF6', marginLeft: 12, alignItems: 'center', justifyContent: 'center' },
  disabledSend: { backgroundColor: '#CBD5E1' },
  emptyChat: { alignItems: 'center', justifyContent: 'center', marginTop: 100 },
  emptyText: { marginTop: 16, fontSize: 16, fontWeight: '800', color: '#64748B' },
  emptySub: { fontSize: 14, color: '#94A3B8', marginTop: 4, fontWeight: '600' }
});
