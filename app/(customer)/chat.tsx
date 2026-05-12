import React, { useState } from 'react';
import { View, Text, StyleSheet, FlatList, TextInput, TouchableOpacity, KeyboardAvoidingView, Platform } from 'react-native';
import { Send, ChevronLeft, Phone, MoreVertical } from 'lucide-react-native';
import { useRouter } from 'expo-router';

export default function ChatScreen() {
  const [message, setMessage] = useState('');
  const router = useRouter();

  const messages = [
    { id: '1', text: 'Hi! I started working on your cinematic reel.', sender: 'editor', time: '10:02 AM' },
    { id: '2', text: 'Great! Can you add some fast transitions and color grading?', sender: 'customer', time: '10:05 AM' },
    { id: '3', text: 'Sure thing! I will use the premium beat-sync style.', sender: 'editor', time: '10:06 AM' },
  ];

  return (
    <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={styles.container}>
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <TouchableOpacity onPress={() => router.back()} style={styles.iconButton}>
            <ChevronLeft size={24} color="#1E293B" />
          </TouchableOpacity>
          <View style={styles.userInfo}>
            <Text style={styles.userName}>Arjun Kumar</Text>
            <Text style={styles.userStatus}>Editing your project...</Text>
          </View>
        </View>
        <View style={styles.headerRight}>
          <TouchableOpacity style={styles.iconButton}><Phone size={20} color="#8B5CF6" /></TouchableOpacity>
          <TouchableOpacity style={styles.iconButton}><MoreVertical size={20} color="#64748B" /></TouchableOpacity>
        </View>
      </View>

      <FlatList
        data={messages}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.chatList}
        renderItem={({ item }) => (
          <View style={[styles.messageBubble, item.sender === 'customer' ? styles.customerBubble : styles.editorBubble]}>
            <Text style={[styles.messageText, item.sender === 'customer' && styles.customerText]}>{item.text}</Text>
            <Text style={[styles.messageTime, item.sender === 'customer' && styles.customerTime]}>{item.time}</Text>
          </View>
        )}
      />

      <View style={styles.inputArea}>
        <View style={styles.inputContainer}>
          <TextInput 
            style={styles.input} 
            placeholder="Type a message..." 
            placeholderTextColor="#94A3B8"
            value={message}
            onChangeText={setMessage}
          />
          <TouchableOpacity style={styles.sendButton}>
            <Send size={20} color="#FFF" />
          </TouchableOpacity>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8FAFC' },
  header: { 
    paddingTop: 60, 
    paddingBottom: 16, 
    paddingHorizontal: 20, 
    backgroundColor: '#FFF', 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9'
  },
  headerLeft: { flexDirection: 'row', alignItems: 'center' },
  headerRight: { flexDirection: 'row' },
  iconButton: { padding: 8, marginLeft: 4 },
  userInfo: { marginLeft: 12 },
  userName: { fontSize: 16, fontWeight: '700', color: '#1E293B' },
  userStatus: { fontSize: 12, color: '#10B981', fontWeight: '600' },
  chatList: { padding: 20 },
  messageBubble: { maxWidth: '80%', padding: 14, borderRadius: 20, marginBottom: 16 },
  customerBubble: { 
    alignSelf: 'flex-end', 
    backgroundColor: '#8B5CF6',
    borderBottomRightRadius: 4,
  },
  editorBubble: { 
    alignSelf: 'flex-start', 
    backgroundColor: '#FFF', 
    borderBottomLeftRadius: 4,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 5,
    elevation: 2,
  },
  messageText: { fontSize: 15, color: '#1E293B', lineHeight: 20 },
  customerText: { color: '#FFF' },
  messageTime: { fontSize: 10, color: '#94A3B8', marginTop: 4, textAlign: 'right' },
  customerTime: { color: 'rgba(255, 255, 255, 0.7)' },
  inputArea: { 
    paddingHorizontal: 20, 
    paddingBottom: Platform.OS === 'ios' ? 40 : 20, 
    paddingTop: 12, 
    backgroundColor: '#FFF' 
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F1F5F9',
    borderRadius: 25,
    paddingLeft: 16,
    paddingRight: 6,
    paddingVertical: 6,
  },
  input: { flex: 1, fontSize: 15, color: '#1E293B', height: 40 },
  sendButton: { 
    backgroundColor: '#8B5CF6', 
    width: 40, 
    height: 40, 
    borderRadius: 20, 
    alignItems: 'center', 
    justifyContent: 'center' 
  }
});
