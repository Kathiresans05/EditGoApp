import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Dimensions, Platform, TextInput } from 'react-native';
import { 
  Wallet, ArrowDownRight, Clock, CheckCircle2, 
  Search, Filter, Download, MoreHorizontal,
  Banknote, CreditCard, Landmark, ArrowUpRight, ChevronLeft
} from 'lucide-react-native';
import Animated, { FadeInUp, FadeInRight, FadeIn, Layout } from 'react-native-reanimated';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';

const { width } = Dimensions.get('window');

const withdrawals = [
  {
    id: 'WTH-9428',
    editor: 'Alex Vance',
    amount: '₹45,000',
    method: 'HDFC Bank',
    status: 'Processing',
    time: '10m ago'
  },
  {
    id: 'WTH-9427',
    editor: 'Sneha Kapoor',
    amount: '₹12,800',
    method: 'UPI (GPay)',
    status: 'Success',
    time: '1h ago'
  },
  {
    id: 'WTH-9426',
    editor: 'Amit Singh',
    amount: '₹8,900',
    method: 'PayPal',
    status: 'Success',
    time: '4h ago'
  }
];

export default function WithdrawalsScreen() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <ChevronLeft size={24} color="#0F172A" />
        </TouchableOpacity>
        <View>
          <View style={styles.tagRow}>
            <Wallet size={10} color="#6366F1" />
            <Text style={styles.tagText}>PAYOUT CENTER</Text>
          </View>
          <Text style={styles.title}>Withdrawal <Text style={styles.highlight}>Management</Text></Text>
        </View>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        
        {/* Quick Stats */}
        <View style={styles.statsGrid}>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.statsScroll} contentContainerStyle={styles.statsScrollContent}>
            <QuickStatCard title="Pending" value="₹2,42,800" count="14" icon={Clock} color="#F59E0B" />
            <QuickStatCard title="Disbursed" value="₹8,12,400" count="42" icon={CheckCircle2} color="#10B981" />
            <QuickStatCard title="Reserve" value="₹45.0M" icon={Landmark} color="#6366F1" />
          </ScrollView>
        </View>

        {/* Search & Filter */}
        <View style={styles.searchBar}>
          <Search size={20} color="#94A3B8" />
          <TextInput placeholder="Search withdrawals..." style={styles.input} placeholderTextColor="#94A3B8" />
          <TouchableOpacity style={styles.filterBtn}>
            <Filter size={18} color="#6366F1" />
          </TouchableOpacity>
        </View>

        {/* Withdrawal List */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Withdrawal Requests</Text>
          <TouchableOpacity><Text style={styles.viewAll}>BULK APPROVE</Text></TouchableOpacity>
        </View>

        <View style={styles.listContainer}>
          {withdrawals.map((item, index) => (
            <Animated.View 
              key={item.id} 
              entering={FadeInUp.delay(index * 100)} 
              style={styles.wthCard}
            >
              <View style={styles.wthHeader}>
                <View style={styles.editorInfo}>
                  <View style={styles.avatar}><Text style={styles.avatarText}>{item.editor[0]}</Text></View>
                  <View>
                    <Text style={styles.editorName}>{item.editor}</Text>
                    <Text style={styles.wthId}>{item.id}</Text>
                  </View>
                </View>
                <View style={[styles.statusBadge, { backgroundColor: item.status === 'Processing' ? '#FEF3C7' : '#DCFCE7' }]}>
                  <Text style={[styles.statusText, { color: item.status === 'Processing' ? '#B45309' : '#15803D' }]}>{item.status.toUpperCase()}</Text>
                </View>
              </View>

              <View style={styles.wthDivider} />

              <View style={styles.wthFooter}>
                <View>
                  <Text style={styles.amountLabel}>Amount</Text>
                  <Text style={styles.amountValue}>{item.amount}</Text>
                </View>
                <View style={styles.methodInfo}>
                  <CreditCard size={14} color="#94A3B8" />
                  <Text style={styles.methodText}>{item.method}</Text>
                </View>
                {item.status === 'Processing' ? (
                  <TouchableOpacity style={styles.approveBtn}>
                    <Text style={styles.approveText}>Approve</Text>
                  </TouchableOpacity>
                ) : (
                  <Text style={styles.timeText}>{item.time}</Text>
                )}
              </View>
            </Animated.View>
          ))}
        </View>

        <View style={{ height: 40 }} />
      </ScrollView>
    </View>
  );
}

function QuickStatCard({ title, value, count, icon: Icon, color }: any) {
  return (
    <View style={styles.statCard}>
      <View style={[styles.iconBox, { backgroundColor: color + '15' }]}>
        <Icon size={20} color={color} />
      </View>
      <View style={styles.statInfo}>
        <Text style={styles.statLabel}>{title}</Text>
        <Text style={styles.statValue}>{value}</Text>
        {count && <Text style={styles.statCount}>{count} requests</Text>}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FAFAFA' },
  header: { paddingHorizontal: 20, paddingTop: Platform.OS === 'ios' ? 60 : 40, paddingBottom: 20, flexDirection: 'row', alignItems: 'center' },
  backBtn: { width: 44, height: 44, borderRadius: 14, backgroundColor: '#FFF', alignItems: 'center', justifyContent: 'center', marginRight: 16, borderWidth: 1, borderColor: '#F1F5F9' },
  tagRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 4 },
  tagText: { fontSize: 10, fontWeight: '900', color: '#6366F1', letterSpacing: 2, marginLeft: 6 },
  title: { fontSize: 24, fontWeight: '900', color: '#0F172A', letterSpacing: -0.5 },
  highlight: { color: '#6366F1' },
  scrollContent: { paddingBottom: 40 },

  statsGrid: { marginBottom: 24 },
  statsScroll: { paddingLeft: 20 },
  statsScrollContent: { paddingRight: 40, gap: 16 },
  statCard: { width: 180, backgroundColor: '#FFF', padding: 20, borderRadius: 28, borderWidth: 1, borderColor: '#F1F5F9', flexDirection: 'row', alignItems: 'center', gap: 12 },
  iconBox: { width: 44, height: 44, borderRadius: 14, alignItems: 'center', justifyContent: 'center' },
  statInfo: { flex: 1 },
  statLabel: { fontSize: 10, fontWeight: '800', color: '#94A3B8', textTransform: 'uppercase' },
  statValue: { fontSize: 18, fontWeight: '900', color: '#1E293B' },
  statCount: { fontSize: 9, fontWeight: '700', color: '#94A3B8' },

  searchBar: { marginHorizontal: 20, flexDirection: 'row', alignItems: 'center', backgroundColor: '#FFF', paddingHorizontal: 16, height: 56, borderRadius: 18, marginBottom: 32, borderWidth: 1, borderColor: '#F1F5F9' },
  input: { flex: 1, marginLeft: 12, fontSize: 14, fontWeight: '600', color: '#1E293B' },
  filterBtn: { width: 36, height: 36, borderRadius: 10, backgroundColor: '#EEF2FF', alignItems: 'center', justifyContent: 'center' },

  sectionHeader: { marginHorizontal: 20, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 },
  sectionTitle: { fontSize: 20, fontWeight: '900', color: '#0F172A' },
  viewAll: { fontSize: 12, fontWeight: '900', color: '#6366F1', letterSpacing: 1 },

  listContainer: { paddingHorizontal: 20, gap: 16 },
  wthCard: { backgroundColor: '#FFF', borderRadius: 28, borderWidth: 1, borderColor: '#F1F5F9', padding: 20 },
  wthHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' },
  editorInfo: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  avatar: { width: 44, height: 44, borderRadius: 16, backgroundColor: '#F1F5F9', alignItems: 'center', justifyContent: 'center' },
  avatarText: { fontSize: 16, fontWeight: '900', color: '#64748B' },
  editorName: { fontSize: 16, fontWeight: '800', color: '#1E293B' },
  wthId: { fontSize: 11, fontWeight: '700', color: '#94A3B8', marginTop: 2 },
  statusBadge: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 10 },
  statusText: { fontSize: 9, fontWeight: '900' },
  wthDivider: { height: 1, backgroundColor: '#F1F5F9', marginVertical: 16 },
  wthFooter: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  amountLabel: { fontSize: 10, fontWeight: '800', color: '#94A3B8', textTransform: 'uppercase' },
  amountValue: { fontSize: 20, fontWeight: '900', color: '#0F172A', marginTop: 2 },
  methodInfo: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  methodText: { fontSize: 10, fontWeight: '800', color: '#64748B', textTransform: 'uppercase' },
  approveBtn: { backgroundColor: '#6366F1', paddingHorizontal: 16, paddingVertical: 10, borderRadius: 12 },
  approveText: { color: '#FFF', fontSize: 11, fontWeight: '900' },
  timeText: { fontSize: 11, fontWeight: '800', color: '#CBD5E1' }
});
