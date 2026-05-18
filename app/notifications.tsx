import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Platform } from 'react-native';
import { Bell, Zap, MessageSquare, CheckCircle2, ChevronRight, X, Clock } from 'lucide-react-native';
import Animated, { FadeInUp } from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';

export default function NotificationCenter() {
  const [notifications, setNotifications] = useState([
    { id: '1', type: 'RAPID', title: 'Editor Found! 🚀', body: 'Kiran V. has accepted your project. Delivery in 35m.', time: '2m ago', read: false },
    { id: '2', type: 'CHAT', title: 'New Message', body: 'Expert: "Draft sent, please check."', time: '15m ago', read: false },
    { id: '3', type: 'PAYMENT', title: 'Payment Successful', body: 'Unlocked HD video for Order #EDG902', time: '1h ago', read: true },
    { id: '4', type: 'SYSTEM', title: 'Welcome to Rapid Studio', body: 'Get your first edit for ₹29 using RAPID20', time: '2h ago', read: true },
  ]);

  const markAllRead = () => {
    setNotifications(notifications.map(n => ({ ...n, read: true })));
  };

  const getIcon = (type: string) => {
    switch (type) {
      case 'RAPID': return <Zap size={18} color="#8B5CF6" fill="#8B5CF6" />;
      case 'CHAT': return <MessageSquare size={18} color="#3B82F6" />;
      case 'PAYMENT': return <CheckCircle2 size={18} color="#10B981" />;
      default: return <Bell size={18} color="#94A3B8" />;
    }
  };

  return (
    <View style={styles.container}>
      <LinearGradient colors={['#F8FAFC', '#FFF']} style={styles.background} />
      
      <View style={styles.header}>
        <View style={styles.headerTop}>
          <Text style={styles.title}>Notifications</Text>
          <TouchableOpacity onPress={markAllRead}>
            <Text style={styles.markRead}>Mark all as read</Text>
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.list}>
        {notifications.map((item, i) => (
          <Animated.View key={item.id} entering={FadeInUp.delay(i * 100)} style={[styles.card, !item.read && styles.unreadCard]}>
            <View style={styles.cardIcon}>
              {getIcon(item.type)}
              {!item.read && <View style={styles.unreadDot} />}
            </View>
            <View style={styles.cardContent}>
              <View style={styles.cardHeader}>
                <Text style={styles.cardTitle}>{item.title}</Text>
                <Text style={styles.cardTime}>{item.time}</Text>
              </View>
              <Text style={styles.cardBody}>{item.body}</Text>
            </View>
          </Animated.View>
        ))}
        
        <View style={styles.emptyFooter}>
          <Clock size={40} color="#E2E8F0" />
          <Text style={styles.footerText}>That's all for today!</Text>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFF' },
  background: { ...StyleSheet.absoluteFillObject },
  header: { paddingHorizontal: 24, paddingTop: Platform.OS === 'ios' ? 70 : 50, paddingBottom: 24 },
  headerTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  title: { fontSize: 28, fontWeight: '900', color: '#1E293B' },
  markRead: { fontSize: 13, color: '#8B5CF6', fontWeight: '700' },
  list: { paddingHorizontal: 20 },
  card: { flexDirection: 'row', backgroundColor: '#FFF', padding: 16, borderRadius: 24, marginBottom: 12, borderWidth: 1, borderColor: '#F1F5F9' },
  unreadCard: { backgroundColor: '#F5F3FF', borderColor: '#DDD6FE' },
  cardIcon: { width: 48, height: 48, borderRadius: 16, backgroundColor: '#FFF', alignItems: 'center', justifyContent: 'center', elevation: 2 },
  unreadDot: { position: 'absolute', top: 0, right: 0, width: 10, height: 10, borderRadius: 5, backgroundColor: '#8B5CF6', borderWidth: 2, borderColor: '#FFF' },
  cardContent: { flex: 1, marginLeft: 16 },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 },
  cardTitle: { fontSize: 15, fontWeight: '800', color: '#1E293B' },
  cardTime: { fontSize: 11, color: '#94A3B8', fontWeight: '600' },
  cardBody: { fontSize: 13, color: '#64748B', lineHeight: 18, fontWeight: '500' },
  emptyFooter: { alignItems: 'center', marginTop: 40, marginBottom: 100 },
  footerText: { marginTop: 12, fontSize: 13, color: '#CBD5E1', fontWeight: '700' }
});
