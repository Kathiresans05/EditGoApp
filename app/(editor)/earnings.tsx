import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, ActivityIndicator, StatusBar } from 'react-native';
import { TrendingUp, ArrowUpRight, Wallet, History, ChevronLeft, CreditCard, Sparkles, Award } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { authService, orderService } from '../../src/services/api';
import Animated, { FadeInUp } from 'react-native-reanimated';
import { useRouter } from 'expo-router';

const CAT_COLORS = ['#EDE7F6', '#E3F2FD', '#E8F5E9', '#FFF3E0'];

export default function EarningsScreen() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [history, setHistory] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => { fetchEarningsData(); }, []);

  const fetchEarningsData = async () => {
    try {
      setLoading(true);
      const [profile, ordersData] = await Promise.all([
        authService.getMe(),
        orderService.getMyEditorOrders()
      ]);
      setUser(profile);
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
        <ActivityIndicator size="large" color="#4F46E5" />
      </View>
    );
  }

  const editor = user?.editorProfile;

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#4F46E5" />

      {/* Header */}
      <LinearGradient colors={['#4F46E5', '#7C3AED']} style={styles.header}>
        <View style={styles.headerRow}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
            <ChevronLeft size={22} color="#FFF" />
          </TouchableOpacity>
          <View style={styles.headerCenter}>
            <Text style={styles.title}>Earnings Hub</Text>
            <Text style={styles.subtitle}>Track your editing income &amp; payouts</Text>
          </View>
          <View style={{ width: 38 }} />
        </View>

        {/* Withdrawal Balance Card */}
        <Animated.View entering={FadeInUp.delay(100)} style={styles.walletCard}>
          <View>
            <Text style={styles.walletLabel}>WITHDRAWABLE BALANCE</Text>
            <Text style={styles.walletValue}>₹{editor?.balance?.toLocaleString() || '0'}</Text>
          </View>
          <TouchableOpacity style={styles.withdrawBtn}>
            <LinearGradient colors={['#FFF', '#F5F3FF']} style={styles.btnGrad}>
              <CreditCard size={14} color="#4F46E5" />
              <Text style={styles.withdrawText}>Withdraw</Text>
            </LinearGradient>
          </TouchableOpacity>
        </Animated.View>
      </LinearGradient>

      <ScrollView style={styles.scroll} showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 60 }}>
        <View style={styles.body}>

          {/* Stats Performance Grid */}
          <Text style={styles.secTitle}>Performance Grid</Text>
          <View style={styles.statsGrid}>
            <Animated.View entering={FadeInUp.delay(150)} style={[styles.statBox, { backgroundColor: '#E8F5E9' }]}>
              <View style={styles.iconCircle}>
                <TrendingUp size={16} color="#2E7D32" />
              </View>
              <Text style={[styles.statAmount, { color: '#2E7D32' }]}>₹{editor?.totalEarnings?.toLocaleString() || '0'}</Text>
              <Text style={styles.statDesc}>Life Earnings</Text>
            </Animated.View>

            <Animated.View entering={FadeInUp.delay(180)} style={[styles.statBox, { backgroundColor: '#EDE7F6' }]}>
              <View style={styles.iconCircle}>
                <History size={16} color="#4F46E5" />
              </View>
              <Text style={[styles.statAmount, { color: '#4F46E5' }]}>{editor?.totalOrders || '0'}</Text>
              <Text style={styles.statDesc}>Total Projects</Text>
            </Animated.View>
          </View>

          <View style={[styles.statsGrid, { marginTop: 12 }]}>
            <Animated.View entering={FadeInUp.delay(200)} style={[styles.statBox, { backgroundColor: '#E3F2FD' }]}>
              <View style={styles.iconCircle}>
                <Sparkles size={16} color="#1E88E5" />
              </View>
              <Text style={[styles.statAmount, { color: '#1E88E5' }]}>₹{(editor?.totalEarnings ? Math.round(editor.totalEarnings / Math.max(editor.totalOrders, 1)) : 0).toLocaleString()}</Text>
              <Text style={styles.statDesc}>Avg Per Order</Text>
            </Animated.View>

            <Animated.View entering={FadeInUp.delay(220)} style={[styles.statBox, { backgroundColor: '#FFF3E0' }]}>
              <View style={styles.iconCircle}>
                <Award size={16} color="#FB8C00" />
              </View>
              <Text style={[styles.statAmount, { color: '#FB8C00' }]}>{editor?.successRate || 100}%</Text>
              <Text style={styles.statDesc}>Success Rate</Text>
            </Animated.View>
          </View>

          {/* Completed Transactions list */}
          <Text style={styles.secTitle}>Recent Transactions</Text>
          <View style={styles.txList}>
            {history.length > 0 ? (
              history.map((item, index) => {
                const pastBg = CAT_COLORS[index % CAT_COLORS.length];
                return (
                  <Animated.View entering={FadeInUp.delay(250 + index * 60)} key={item.id} style={styles.txItem}>
                    <View style={styles.txLeft}>
                      <View style={[styles.txIconCircle, { backgroundColor: pastBg }]}>
                        <Wallet size={16} color="#4F46E5" />
                      </View>
                      <View>
                        <Text style={styles.txTitle} numberOfLines={1}>{item.title}</Text>
                        <Text style={styles.txDate}>{new Date(item.updatedAt).toLocaleDateString()}</Text>
                      </View>
                    </View>
                    <View style={styles.txRight}>
                      <Text style={styles.txAmount}>+₹{item.price}</Text>
                    </View>
                  </Animated.View>
                );
              })
            ) : (
              <View style={styles.emptyContainer}>
                <Wallet size={36} color="#CBD5E1" />
                <Text style={styles.emptyText}>No transactions recorded yet</Text>
              </View>
            )}
          </View>

        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8FAFC' },
  centerContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#F8FAFC' },

  header: { paddingTop: 58, paddingHorizontal: 20, paddingBottom: 110, borderBottomLeftRadius: 28, borderBottomRightRadius: 28 },
  headerRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 },
  backBtn: { width: 38, height: 38, borderRadius: 12, backgroundColor: 'rgba(255,255,255,0.2)', alignItems: 'center', justifyContent: 'center' },
  headerCenter: { alignItems: 'center', flex: 1 },
  title: { fontSize: 20, fontWeight: '900', color: '#FFF' },
  subtitle: { fontSize: 12, color: 'rgba(255,255,255,0.8)', fontWeight: '600', marginTop: 2 },

  walletCard: {
    backgroundColor: '#FFF', borderRadius: 24, padding: 20,
    position: 'absolute', top: 110, left: 20, right: 20, zIndex: 10,
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    elevation: 4, shadowColor: '#4F46E5', shadowOpacity: 0.1, shadowRadius: 12,
  },
  walletLabel: { fontSize: 9, fontWeight: '900', color: '#94A3B8', letterSpacing: 1 },
  walletValue: { fontSize: 30, fontWeight: '900', color: '#1E293B', marginTop: 4 },
  withdrawBtn: { borderRadius: 12, overflow: 'hidden', elevation: 2, shadowColor: '#4F46E5', shadowOpacity: 0.2, shadowRadius: 6 },
  btnGrad: { flexDirection: 'row', alignItems: 'center', gap: 6, paddingHorizontal: 16, paddingVertical: 12 },
  withdrawText: { color: '#4F46E5', fontWeight: '900', fontSize: 12 },

  scroll: { flex: 1, marginTop: 75 },
  body: { padding: 20 },

  secTitle: { fontSize: 16, fontWeight: '900', color: '#1E293B', marginBottom: 14, marginTop: 12 },
  statsGrid: { flexDirection: 'row', gap: 12 },
  statBox: { flex: 1, borderRadius: 20, padding: 16 },
  iconCircle: { width: 32, height: 32, borderRadius: 10, backgroundColor: '#FFF', alignItems: 'center', justifyContent: 'center', marginBottom: 12 },
  statAmount: { fontSize: 20, fontWeight: '900' },
  statDesc: { fontSize: 11, color: '#64748B', fontWeight: '800', marginTop: 2 },

  txList: { gap: 10 },
  txItem: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#FFF', borderRadius: 20, padding: 14, elevation: 1 },
  txLeft: { flexDirection: 'row', alignItems: 'center', gap: 12, flex: 1 },
  txIconCircle: { width: 38, height: 38, borderRadius: 19, alignItems: 'center', justifyContent: 'center' },
  txTitle: { fontSize: 14, fontWeight: '800', color: '#1E293B', maxWidth: '80%' },
  txDate: { fontSize: 11, color: '#94A3B8', fontWeight: '700', marginTop: 2 },
  txRight: { backgroundColor: '#E8F5E9', paddingHorizontal: 10, paddingVertical: 6, borderRadius: 10 },
  txAmount: { fontSize: 13, fontWeight: '900', color: '#2E7D32' },

  emptyContainer: { alignItems: 'center', justifyContent: 'center', paddingVertical: 40, gap: 10 },
  emptyText: { fontSize: 13, color: '#94A3B8', fontWeight: '800' },
});
