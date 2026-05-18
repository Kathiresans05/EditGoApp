import React, { useState, useEffect } from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity,
  ActivityIndicator, Alert, StatusBar,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Wallet, ArrowUpRight, ArrowDownRight, Banknote, Zap, TrendingUp, Clock } from 'lucide-react-native';
import Animated, { FadeInUp, FadeInRight } from 'react-native-reanimated';
import { authService } from '../../src/services/api';

const RAPID_STATS = [
  { label: 'Avg. Payout', value: '₹45', bg: '#EDE7F6', text: '#7C3AED' },
  { label: 'Success Rate', value: '98%', bg: '#E8F5E9', text: '#2E7D32' },
  { label: 'This Month', value: '₹482', bg: '#E3F2FD', text: '#1565C0' },
  { label: 'Streak', value: '12🔥', bg: '#FFF3E0', text: '#E65100' },
];

export default function EditorWallet() {
  const [loading, setLoading] = useState(true);
  const [editor, setEditor] = useState<any>(null);
  const [transactions] = useState([
    { id: '1', title: 'Rapid Edit - 30s Video', amount: 49,  date: 'Today, 2:30 PM', type: 'EARNING' },
    { id: '2', title: 'Withdrawal to Bank',     amount: -500, date: 'Yesterday',      type: 'WITHDRAWAL' },
    { id: '3', title: 'Rapid Edit - 18s Video', amount: 39,  date: '15 May',          type: 'EARNING' },
    { id: '4', title: 'Bonus – Rapid Streak',   amount: 100, date: '14 May',          type: 'EARNING' },
  ]);

  useEffect(() => { fetchWalletData(); }, []);

  const fetchWalletData = async () => {
    try {
      const data = await authService.getMe();
      setEditor(data.editorProfile);
    } catch (e) { console.error(e); }
    finally { setLoading(false); }
  };

  const handleWithdraw = () => {
    Alert.alert('Withdrawal Request', 'Minimum withdrawal is ₹500. Processed in 24 hours.', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Confirm', onPress: () => Alert.alert('Success', 'Request sent! ✅') },
    ]);
  };

  if (loading) return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#F8FAFC' }}>
      <ActivityIndicator size="large" color="#4F46E5" />
    </View>
  );

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#4F46E5" />
      <ScrollView showsVerticalScrollIndicator={false}>

        {/* ── BALANCE HEADER ── */}
        <LinearGradient colors={['#4F46E5', '#7C3AED']} style={styles.header}>
          <Text style={styles.headerLabel}>Earnings Hub</Text>

          <View style={styles.balanceRow}>
            <View style={styles.walletIconWrap}>
              <Wallet size={28} color="#FFF" />
            </View>
            <View style={{ marginLeft: 16 }}>
              <Text style={styles.balanceLabel}>AVAILABLE BALANCE</Text>
              <Text style={styles.balanceValue}>₹{editor?.balance || '0'}</Text>
            </View>
          </View>

          <View style={styles.earningsRow}>
            <View style={styles.earningItem}>
              <Text style={styles.earningLabel}>TOTAL EARNED</Text>
              <Text style={styles.earningValue}>₹{editor?.totalEarnings || '0'}</Text>
            </View>
            <View style={styles.earningDivider} />
            <View style={styles.earningItem}>
              <Text style={styles.earningLabel}>THIS MONTH</Text>
              <Text style={styles.earningValue}>₹482</Text>
            </View>
          </View>

          <TouchableOpacity style={styles.withdrawBtn} onPress={handleWithdraw}>
            <ArrowUpRight size={18} color="#4F46E5" />
            <Text style={styles.withdrawText}>WITHDRAW TO BANK</Text>
          </TouchableOpacity>
        </LinearGradient>

        <View style={styles.body}>

          {/* ── RAPID STATS GRID ── */}
          <Animated.View entering={FadeInUp.delay(100)}>
            <View style={styles.sectionRow}>
              <Text style={styles.sectionTitle}>Rapid Performance</Text>
              <Zap size={16} color="#4F46E5" fill="#4F46E5" />
            </View>
            <View style={styles.statsGrid}>
              {RAPID_STATS.map((s, i) => (
                <View key={i} style={[styles.statCard, { backgroundColor: s.bg }]}>
                  <Text style={[styles.statValue, { color: s.text }]}>{s.value}</Text>
                  <Text style={styles.statLabel}>{s.label}</Text>
                </View>
              ))}
            </View>
          </Animated.View>

          {/* ── TRANSACTIONS ── */}
          <Text style={[styles.sectionTitle, { marginTop: 24 }]}>Recent Activity</Text>
          <View style={styles.txList}>
            {transactions.map((tx, i) => {
              const isEarning = tx.type === 'EARNING';
              return (
                <Animated.View key={tx.id} entering={FadeInRight.delay(i * 80)}>
                  <View style={styles.txCard}>
                    <View style={[styles.txIcon, { backgroundColor: isEarning ? '#E8F5E9' : '#FEE2E2' }]}>
                      {isEarning
                        ? <ArrowDownRight size={20} color="#2E7D32" />
                        : <Banknote size={20} color="#EF4444" />
                      }
                    </View>
                    <View style={styles.txInfo}>
                      <Text style={styles.txTitle}>{tx.title}</Text>
                      <View style={styles.txMeta}>
                        <Clock size={11} color="#94A3B8" />
                        <Text style={styles.txDate}>{tx.date}</Text>
                      </View>
                    </View>
                    <Text style={[styles.txAmount, { color: isEarning ? '#2E7D32' : '#EF4444' }]}>
                      {isEarning ? '+' : ''}₹{Math.abs(tx.amount)}
                    </Text>
                  </View>
                </Animated.View>
              );
            })}
          </View>

          {/* ── GROWTH TIP ── */}
          <Animated.View entering={FadeInUp.delay(400)}>
            <LinearGradient colors={['#FFF3E0', '#FFF8F0']} style={styles.tipCard}>
              <TrendingUp size={22} color="#FB8C00" />
              <View style={{ flex: 1, marginLeft: 12 }}>
                <Text style={styles.tipTitle}>💡 Earn More</Text>
                <Text style={styles.tipText}>Go online during peak hours (6–10 PM) to get 3x more rapid orders!</Text>
              </View>
            </LinearGradient>
          </Animated.View>

        </View>
        <View style={{ height: 100 }} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8FAFC' },

  header: { paddingTop: 58, paddingHorizontal: 24, paddingBottom: 32, borderBottomLeftRadius: 32, borderBottomRightRadius: 32 },
  headerLabel: { fontSize: 14, fontWeight: '800', color: 'rgba(255,255,255,0.7)', marginBottom: 20, letterSpacing: 1 },
  balanceRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 24 },
  walletIconWrap: { width: 56, height: 56, borderRadius: 18, backgroundColor: 'rgba(255,255,255,0.2)', alignItems: 'center', justifyContent: 'center' },
  balanceLabel: { fontSize: 10, fontWeight: '900', color: 'rgba(255,255,255,0.7)', letterSpacing: 1.5 },
  balanceValue: { fontSize: 40, fontWeight: '900', color: '#FFF', marginTop: 2 },
  earningsRow: { flexDirection: 'row', backgroundColor: 'rgba(255,255,255,0.1)', borderRadius: 18, padding: 16, marginBottom: 20 },
  earningItem: { flex: 1, alignItems: 'center' },
  earningLabel: { fontSize: 9, fontWeight: '900', color: 'rgba(255,255,255,0.6)', letterSpacing: 1 },
  earningValue: { fontSize: 18, fontWeight: '900', color: '#FFF', marginTop: 4 },
  earningDivider: { width: 1, backgroundColor: 'rgba(255,255,255,0.2)', marginHorizontal: 8 },
  withdrawBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', backgroundColor: '#FFF', paddingVertical: 16, borderRadius: 18, gap: 8, elevation: 2 },
  withdrawText: { color: '#4F46E5', fontSize: 14, fontWeight: '900', letterSpacing: 0.5 },

  body: { padding: 20 },
  sectionRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 },
  sectionTitle: { fontSize: 17, fontWeight: '900', color: '#1E293B', marginBottom: 14 },

  statsGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 12 },
  statCard: { width: '47%', borderRadius: 18, padding: 16 },
  statValue: { fontSize: 22, fontWeight: '900', marginBottom: 4 },
  statLabel: { fontSize: 11, color: '#64748B', fontWeight: '700' },

  txList: { gap: 10 },
  txCard: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#FFF', borderRadius: 18, padding: 14, gap: 12, elevation: 1, shadowColor: '#4F46E5', shadowOpacity: 0.04, shadowRadius: 6 },
  txIcon: { width: 46, height: 46, borderRadius: 14, alignItems: 'center', justifyContent: 'center' },
  txInfo: { flex: 1 },
  txTitle: { fontSize: 14, fontWeight: '700', color: '#1E293B' },
  txMeta: { flexDirection: 'row', alignItems: 'center', gap: 4, marginTop: 3 },
  txDate: { fontSize: 11, color: '#94A3B8', fontWeight: '600' },
  txAmount: { fontSize: 16, fontWeight: '900' },

  tipCard: { flexDirection: 'row', alignItems: 'flex-start', borderRadius: 20, padding: 18, marginTop: 8, borderWidth: 1, borderColor: '#FDDCAC' },
  tipTitle: { fontSize: 14, fontWeight: '900', color: '#1E293B', marginBottom: 4 },
  tipText: { fontSize: 12, color: '#64748B', fontWeight: '600', lineHeight: 18 },
});
