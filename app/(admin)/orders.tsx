import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { ShoppingBag, Clock, Activity, MapPin } from 'lucide-react-native';
import { GlassCard } from '../../src/components/ui/GlassCard';

export default function OrderDesk() {
  return (
    <View style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.content}>
        <Text style={styles.title}>Order Desk</Text>

        <View style={styles.tabHeader}>
          <View style={[styles.tab, styles.activeTab]}><Text style={styles.activeTabText}>LIVE (42)</Text></View>
          <View style={styles.tab}><Text style={styles.tabText}>HISTORY</Text></View>
        </View>

        {[1, 2, 3, 4].map((i) => (
          <GlassCard key={i} style={styles.orderCard}>
            <View style={styles.orderHeader}>
              <Text style={styles.orderId}>#ORD-94{i}</Text>
              <View style={styles.statusBadge}>
                <Text style={styles.statusText}>EDITING</Text>
              </View>
            </View>
            <View style={styles.orderInfo}>
              <Text style={styles.orderTitle}>Cinematic Wedding Reel</Text>
              <Text style={styles.orderSub}>Client: Rahul Sharma • Editor: Karthik R.</Text>
            </View>
            <View style={styles.footer}>
              <View style={styles.timer}>
                <Clock size={14} color="#64748B" />
                <Text style={styles.timerText}>2h 15m left</Text>
              </View>
              <Text style={styles.amount}>₹2,500</Text>
            </View>
          </GlassCard>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8FAFC' },
  content: { padding: 24, paddingTop: 60, paddingBottom: 100 },
  title: { fontSize: 28, fontWeight: '900', color: '#1E293B', marginBottom: 20 },
  tabHeader: { flexDirection: 'row', marginBottom: 24, backgroundColor: '#FFF', borderRadius: 12, padding: 4 },
  tab: { flex: 1, paddingVertical: 10, alignItems: 'center', borderRadius: 10 },
  activeTab: { backgroundColor: '#F5F3FF' },
  activeTabText: { color: '#6366F1', fontWeight: '800', fontSize: 12 },
  tabText: { color: '#94A3B8', fontWeight: '700', fontSize: 12 },
  orderCard: { padding: 16, marginBottom: 16 },
  orderHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 },
  orderId: { fontSize: 12, fontWeight: '800', color: '#64748B' },
  statusBadge: { backgroundColor: '#F5F3FF', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 6 },
  statusText: { color: '#6366F1', fontSize: 10, fontWeight: '900' },
  orderInfo: { marginBottom: 16 },
  orderTitle: { fontSize: 16, fontWeight: '700', color: '#1E293B' },
  orderSub: { fontSize: 12, color: '#64748B', marginTop: 4 },
  footer: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', borderTopWidth: 1, borderTopColor: '#F1F5F9', paddingTop: 12 },
  timer: { flexDirection: 'row', alignItems: 'center' },
  timerText: { fontSize: 12, color: '#64748B', marginLeft: 6, fontWeight: '600' },
  amount: { fontSize: 14, fontWeight: '800', color: '#1E293B' }
});
