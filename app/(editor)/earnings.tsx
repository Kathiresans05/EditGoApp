import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, ActivityIndicator } from 'react-native';
import { GlassCard } from '../../src/components/ui/GlassCard';
import { TrendingUp, DollarSign, ArrowUpRight, Wallet, History } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { authService, orderService } from '../../src/services/api';

export default function EarningsScreen() {
  const [user, setUser] = useState<any>(null);
  const [history, setHistory] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchEarningsData();
  }, []);

  const fetchEarningsData = async () => {
    try {
      setLoading(true);
      const [profile, ordersData] = await Promise.all([
        authService.getMe(),
        orderService.getMyOrders()
      ]);
      setUser(profile);
      // Filter for completed orders to show in transaction history
      setHistory(ordersData.orders?.filter((o: any) => o.status === 'COMPLETED') || []);
    } catch (error) {
      console.error('[Earnings] Fetch Error:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color="#8B5CF6" />
      </View>
    );
  }

  const editor = user?.editorProfile;

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.header}>
        <Text style={styles.title}>Finance Hub</Text>
        <Text style={styles.subtitle}>Track your editing income & payouts</Text>
      </View>

      <LinearGradient colors={['#8B5CF6', '#3B82F6']} style={styles.walletCard}>
        <View>
          <Text style={styles.walletLabel}>Available for Withdrawal</Text>
          <Text style={styles.walletValue}>₹{editor?.balance?.toLocaleString() || '0'}</Text>
        </View>
        <TouchableOpacity style={styles.withdrawBtn}>
          <Text style={styles.withdrawText}>Withdraw</Text>
        </TouchableOpacity>
      </LinearGradient>

      <View style={styles.statsGrid}>
        <GlassCard style={styles.statBox}>
          <View style={styles.statHeader}>
            <View style={[styles.statIcon, {backgroundColor: '#F0FDF4'}]}><TrendingUp size={16} color="#10B981" /></View>
          </View>
          <Text style={styles.statAmount}>₹{editor?.totalEarnings?.toLocaleString() || '0'}</Text>
          <Text style={styles.statDesc}>Life Earnings</Text>
        </GlassCard>

        <GlassCard style={styles.statBox}>
          <View style={styles.statHeader}>
            <View style={[styles.statIcon, {backgroundColor: '#F5F3FF'}]}><History size={16} color="#8B5CF6" /></View>
          </View>
          <Text style={styles.statAmount}>{editor?.totalOrders || '0'}</Text>
          <Text style={styles.statDesc}>Total Projects</Text>
        </GlassCard>
      </View>

      <Text style={styles.sectionTitle}>Completed Projects</Text>
      <View style={styles.txList}>
        {history.length > 0 ? history.map((item) => (
          <TransactionItem 
            key={item.id}
            title={item.title} 
            date={new Date(item.updatedAt).toLocaleDateString()} 
            amount={`+₹${item.price}`} 
          />
        )) : (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>No completed projects yet</Text>
          </View>
        )}
      </View>

      <View style={{ height: 100 }} />
    </ScrollView>
  );
}

function TransactionItem({ title, date, amount, isDebit = false }: any) {
  return (
    <GlassCard style={styles.txItem}>
      <View style={styles.txLeft}>
        <View style={styles.txIcon}>
          <Wallet size={18} color="#64748B" />
        </View>
        <View>
          <Text style={styles.txTitle}>{title}</Text>
          <Text style={styles.txDate}>{date}</Text>
        </View>
      </View>
      <Text style={[styles.txAmount, isDebit && {color: '#EF4444'}]}>{amount}</Text>
    </GlassCard>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8FAFC' },
  centerContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  header: { paddingTop: 80, paddingHorizontal: 24, marginBottom: 24 },
  title: { fontSize: 28, fontWeight: '800', color: '#1E293B' },
  subtitle: { fontSize: 14, color: '#64748B', marginTop: 4 },
  walletCard: { marginHorizontal: 24, padding: 30, borderRadius: 32, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 },
  walletLabel: { color: 'rgba(255,255,255,0.8)', fontSize: 12, fontWeight: '600' },
  walletValue: { color: '#FFF', fontSize: 32, fontWeight: '900', marginTop: 8 },
  withdrawBtn: { backgroundColor: '#FFF', paddingHorizontal: 16, paddingVertical: 10, borderRadius: 12 },
  withdrawText: { color: '#8B5CF6', fontWeight: '800', fontSize: 13 },
  statsGrid: { flexDirection: 'row', paddingHorizontal: 24, justifyContent: 'space-between', marginBottom: 32 },
  statBox: { width: '48%', padding: 16, backgroundColor: '#FFF' },
  statHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 },
  statIcon: { padding: 8, borderRadius: 10 },
  statAmount: { fontSize: 22, fontWeight: '800', color: '#1E293B' },
  statDesc: { fontSize: 12, color: '#94A3B8', marginTop: 4 },
  sectionTitle: { fontSize: 18, fontWeight: '800', color: '#1E293B', marginHorizontal: 24, marginBottom: 16 },
  txList: { paddingHorizontal: 24 },
  txItem: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 16, marginBottom: 12, backgroundColor: '#FFF' },
  txLeft: { flexDirection: 'row', alignItems: 'center' },
  txIcon: { width: 40, height: 40, borderRadius: 20, backgroundColor: '#F1F5F9', alignItems: 'center', justifyContent: 'center', marginRight: 12 },
  txTitle: { fontSize: 15, fontWeight: '700', color: '#1E293B' },
  txDate: { fontSize: 12, color: '#94A3B8', marginTop: 2 },
  txAmount: { fontSize: 16, fontWeight: '800', color: '#10B981' },
  emptyContainer: { alignItems: 'center', padding: 40 },
  emptyText: { color: '#94A3B8', fontWeight: '600' }
});
