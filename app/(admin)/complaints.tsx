import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Dimensions, Platform, TextInput } from 'react-native';
import { 
  MessageSquare, AlertCircle, Clock, CheckCircle2, 
  Search, Filter, ChevronLeft, User, MessageCircle,
  MoreVertical, ShieldAlert
} from 'lucide-react-native';
import Animated, { FadeInUp, FadeInRight, FadeIn, Layout } from 'react-native-reanimated';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';

const { width } = Dimensions.get('window');

const tickets = [
  { id: 'TKT-9428', user: 'Rahul Sharma', subject: 'Payment Failed', status: 'Open', priority: 'High', time: '10m ago' },
  { id: 'TKT-9427', user: 'Sneha K.', subject: 'Video Quality Issue', status: 'Pending', priority: 'Medium', time: '1h ago' },
  { id: 'TKT-9426', user: 'Amit S.', subject: 'Refund Request', status: 'Closed', priority: 'Low', time: '5h ago' },
];

export default function ComplaintsScreen() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <ChevronLeft size={24} color="#0F172A" />
        </TouchableOpacity>
        <View>
          <View style={styles.tagRow}>
            <MessageCircle size={10} color="#6366F1" />
            <Text style={styles.tagText}>SUPPORT OPERATIONS</Text>
          </View>
          <Text style={styles.title}>System <Text style={styles.highlight}>Support</Text></Text>
        </View>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        
        {/* Support Stats */}
        <View style={styles.statsRow}>
          <View style={styles.statBox}>
            <Text style={styles.statVal}>42</Text>
            <Text style={styles.statLab}>OPEN TICKETS</Text>
          </View>
          <View style={styles.statBox}>
            <Text style={[styles.statVal, { color: '#6366F1' }]}>12m</Text>
            <Text style={styles.statLab}>AVG. RESPONSE</Text>
          </View>
          <View style={styles.statBox}>
            <Text style={[styles.statVal, { color: '#10B981' }]}>98%</Text>
            <Text style={styles.statLab}>SATISFACTION</Text>
          </View>
        </View>

        {/* Ticket List */}
        <Text style={styles.sectionTitle}>Active Tickets</Text>
        <View style={styles.listContainer}>
          {tickets.map((item, index) => (
            <Animated.View 
              key={item.id} 
              entering={FadeInUp.delay(index * 100)} 
              style={styles.ticketCard}
            >
              <View style={styles.ticketHeader}>
                <View style={styles.userInfo}>
                  <View style={styles.avatar}><Text style={styles.avatarText}>{item.user[0]}</Text></View>
                  <View>
                    <Text style={styles.userName}>{item.user}</Text>
                    <Text style={styles.ticketId}>{item.id}</Text>
                  </View>
                </View>
                <View style={[styles.priorityBadge, { backgroundColor: getPriorityColor(item.priority) + '15' }]}>
                  <Text style={[styles.priorityText, { color: getPriorityColor(item.priority) }]}>{item.priority} PRIORITY</Text>
                </View>
              </View>

              <Text style={styles.subject}>{item.subject}</Text>
              <Text style={styles.timeText}>Requested {item.time}</Text>

              <View style={styles.footer}>
                <View style={[styles.statusBadge, { backgroundColor: getStatusColor(item.status) + '15' }]}>
                  <Text style={[styles.statusText, { color: getStatusColor(item.status) }]}>{item.status.toUpperCase()}</Text>
                </View>
                <TouchableOpacity style={styles.actionBtn}>
                  <Text style={styles.actionBtnText}>Reply</Text>
                </TouchableOpacity>
              </View>
            </Animated.View>
          ))}
        </View>

        <View style={{ height: 40 }} />
      </ScrollView>
    </View>
  );
}

const getPriorityColor = (p: string) => {
  switch(p) {
    case 'High': return '#EF4444';
    case 'Medium': return '#F59E0B';
    default: return '#6366F1';
  }
};

const getStatusColor = (s: string) => {
  switch(s) {
    case 'Open': return '#EF4444';
    case 'Pending': return '#F59E0B';
    default: return '#10B981';
  }
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FAFAFA' },
  header: { paddingHorizontal: 20, paddingTop: Platform.OS === 'ios' ? 60 : 40, paddingBottom: 20, flexDirection: 'row', alignItems: 'center' },
  backBtn: { width: 44, height: 44, borderRadius: 14, backgroundColor: '#FFF', alignItems: 'center', justifyContent: 'center', marginRight: 16, borderWidth: 1, borderColor: '#F1F5F9' },
  tagRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 4 },
  tagText: { fontSize: 10, fontWeight: '900', color: '#6366F1', letterSpacing: 2, marginLeft: 6 },
  title: { fontSize: 24, fontWeight: '900', color: '#0F172A', letterSpacing: -0.5 },
  highlight: { color: '#6366F1' },
  scrollContent: { padding: 20 },

  statsRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 32 },
  statBox: { flex: 1, backgroundColor: '#FFF', padding: 16, borderRadius: 24, borderWidth: 1, borderColor: '#F1F5F9', alignItems: 'center' },
  statVal: { fontSize: 22, fontWeight: '900', color: '#1E293B' },
  statLab: { fontSize: 8, fontWeight: '900', color: '#94A3B8', marginTop: 4, letterSpacing: 1 },

  sectionTitle: { fontSize: 20, fontWeight: '900', color: '#0F172A', marginBottom: 20 },
  listContainer: { gap: 16 },
  ticketCard: { backgroundColor: '#FFF', borderRadius: 28, borderWidth: 1, borderColor: '#F1F5F9', padding: 20 },
  ticketHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 16 },
  userInfo: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  avatar: { width: 40, height: 40, borderRadius: 14, backgroundColor: '#F1F5F9', alignItems: 'center', justifyContent: 'center' },
  avatarText: { fontSize: 14, fontWeight: '900', color: '#64748B' },
  userName: { fontSize: 15, fontWeight: '800', color: '#1E293B' },
  ticketId: { fontSize: 10, fontWeight: '700', color: '#94A3B8', marginTop: 2 },
  priorityBadge: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 8 },
  priorityText: { fontSize: 8, fontWeight: '900' },
  subject: { fontSize: 17, fontWeight: '900', color: '#1E293B', marginBottom: 6 },
  timeText: { fontSize: 12, color: '#94A3B8', marginBottom: 16 },
  footer: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingTop: 16, borderTopWidth: 1, borderTopColor: '#F1F5F9' },
  statusBadge: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 10 },
  statusText: { fontSize: 9, fontWeight: '900' },
  actionBtn: { backgroundColor: '#6366F1', paddingHorizontal: 20, paddingVertical: 10, borderRadius: 12 },
  actionBtnText: { color: '#FFF', fontSize: 12, fontWeight: '900' }
});
