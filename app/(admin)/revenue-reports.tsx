import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Dimensions, Platform } from 'react-native';
import { 
  DollarSign, ArrowUpRight, ArrowDownRight, 
  Download, Calendar, Filter, FileText,
  CreditCard, Wallet, TrendingUp, BarChart3,
  Search, ChevronLeft, MoreHorizontal,
  Briefcase, ShoppingBag
} from 'lucide-react-native';
import Animated, { FadeInUp, FadeInRight, FadeIn, Layout } from 'react-native-reanimated';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';

const { width } = Dimensions.get('window');

import { adminService } from '../../src/services/api';
import { RefreshControl, ActivityIndicator } from 'react-native';

export default function RevenueReportsScreen() {
  const router = useRouter();
  const [data, setData] = React.useState<any>(null);
  const [loading, setLoading] = React.useState(true);
  const [refreshing, setRefreshing] = React.useState(false);

  const fetchRevenueData = async () => {
    try {
      const revenueData = await adminService.getRevenue();
      setData(revenueData);
    } catch (error) {
      console.error('Error fetching revenue data:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  React.useEffect(() => {
    fetchRevenueData();
  }, []);

  const onRefresh = () => {
    setRefreshing(true);
    fetchRevenueData();
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <ChevronLeft size={24} color="#0F172A" />
        </TouchableOpacity>
        <View>
          <View style={styles.tagRow}>
            <DollarSign size={10} color="#6366F1" />
            <Text style={styles.tagText}>FINANCIAL INTELLIGENCE</Text>
          </View>
          <Text style={styles.title}>Revenue <Text style={styles.highlight}>Analytics</Text></Text>
        </View>
      </View>

      <ScrollView 
        showsVerticalScrollIndicator={false} 
        contentContainerStyle={styles.scrollContent}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
      >
        {loading ? (
          <ActivityIndicator size="large" color="#6366F1" style={{ marginTop: 100 }} />
        ) : (
          <>
        
        {/* Financial Overview Grid */}
        <View style={styles.statsGrid}>
          <View style={styles.statsRow}>
            <FinanceCard title="Marketplace Volume" value={data?.overview?.marketplaceVolume || "₹0"} trend="+18%" up={true} icon={ShoppingBag} color="#6366F1" />
            <FinanceCard title="Platform Revenue" value={data?.overview?.platformRevenue || "₹0"} trend="+12%" up={true} icon={TrendingUp} color="#10B981" />
          </View>
          <View style={styles.statsRow}>
            <FinanceCard title="Creator Payouts" value={data?.overview?.creatorPayouts || "₹0"} trend="+22%" up={true} icon={Wallet} color="#8B5CF6" />
            <FinanceCard title="Processing Fees" value={data?.overview?.processingFees || "₹0"} trend="-2%" up={false} icon={CreditCard} color="#F59E0B" />
          </View>
        </View>

        {/* Velocity Chart */}
        <View style={styles.chartCard}>
          <View style={styles.chartHeader}>
            <View>
              <Text style={styles.chartTitle}>Velocity Analysis</Text>
              <Text style={styles.chartSubtitle}>REVENUE GROWTH TREND</Text>
            </View>
            <TouchableOpacity style={styles.exportBtn}>
              <Download size={14} color="#6366F1" />
            </TouchableOpacity>
          </View>
          <View style={styles.chartWrapper}>
            <LinearGradient colors={['rgba(99, 102, 241, 0.1)', 'transparent']} style={styles.chartArea}>
              <View style={styles.chartBars}>
                {data?.chartData?.map((d: any, i: number) => (
                  <View key={i} style={[styles.bar, { height: d.amount }]} />
                ))}
              </View>
            </LinearGradient>
          </View>
        </View>

        {/* Recent Ledger */}
        <Text style={styles.sectionTitle}>Recent Ledger</Text>
        <View style={styles.ledgerList}>
          {data?.ledger?.length > 0 ? data.ledger.map((item: any) => (
            <LedgerItem 
              key={item.id}
              type={item.type} 
              user={item.user} 
              amount={item.amount} 
              status={item.status} 
              color={item.color} 
            />
          )) : (
            <Text style={styles.noDataText}>No recent transactions</Text>
          )}
        </View>

        {/* Liquidity Card */}
        <View style={styles.liquidityCard}>
          <View style={styles.liqHeader}>
            <Wallet size={20} color="#6366F1" />
            <Text style={styles.liqTitle}>Reserve Liquidity</Text>
          </View>
          <Text style={styles.liqValue}>{data?.overview?.liquidity || "₹0"}</Text>
          <TouchableOpacity style={styles.manageBtn}>
            <Text style={styles.manageBtnText}>MANAGE LIQUIDITY</Text>
          </TouchableOpacity>
        </View>
      </>
    )}

        <View style={{ height: 40 }} />
      </ScrollView>
    </View>
  );
}

function FinanceCard({ title, value, trend, up, icon: Icon, color }: any) {
  return (
    <View style={styles.fCard}>
      <View style={styles.fCardTop}>
        <View style={[styles.fIcon, { backgroundColor: color + '15' }]}>
          <Icon size={20} color={color} />
        </View>
        <View style={[styles.fTrend, { backgroundColor: up ? '#F0FDF4' : '#FEF2F2' }]}>
          <Text style={[styles.fTrendText, { color: up ? '#10B981' : '#EF4444' }]}>{trend}</Text>
        </View>
      </View>
      <Text style={styles.fValue}>{value}</Text>
      <Text style={styles.fLabel}>{title}</Text>
    </View>
  );
}

function LedgerItem({ type, user, amount, status, color }: any) {
  return (
    <View style={styles.lItem}>
      <View style={styles.lLeft}>
        <View style={[styles.lDot, { backgroundColor: color }]} />
        <View>
          <Text style={styles.lType}>{type}</Text>
          <Text style={styles.lUser}>{user}</Text>
        </View>
      </View>
      <View style={styles.lRight}>
        <Text style={[styles.lAmount, { color: amount.startsWith('+') ? '#10B981' : '#EF4444' }]}>{amount}</Text>
        <Text style={styles.lStatus}>{status}</Text>
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
  scrollContent: { padding: 20 },

  statsGrid: { gap: 12, marginBottom: 24 },
  statsRow: { flexDirection: 'row', justifyContent: 'space-between', gap: 12 },
  fCard: { flex: 1, backgroundColor: '#FFF', padding: 20, borderRadius: 28, borderWidth: 1, borderColor: '#F1F5F9' },
  fCardTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 },
  fIcon: { width: 44, height: 44, borderRadius: 14, alignItems: 'center', justifyContent: 'center' },
  fTrend: { paddingHorizontal: 8, paddingVertical: 4, borderRadius: 8 },
  fTrendText: { fontSize: 9, fontWeight: '900' },
  fValue: { fontSize: 20, fontWeight: '900', color: '#1E293B' },
  fLabel: { fontSize: 10, fontWeight: '800', color: '#94A3B8', textTransform: 'uppercase', marginTop: 4 },

  chartCard: { backgroundColor: '#FFF', padding: 24, borderRadius: 32, marginBottom: 32, borderWidth: 1, borderColor: '#F1F5F9' },
  chartHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 },
  chartTitle: { fontSize: 18, fontWeight: '900', color: '#1E293B' },
  chartSubtitle: { fontSize: 9, fontWeight: '800', color: '#94A3B8', letterSpacing: 1.5, marginTop: 2 },
  exportBtn: { width: 40, height: 40, borderRadius: 12, backgroundColor: '#EEF2FF', alignItems: 'center', justifyContent: 'center' },
  chartWrapper: { height: 150, overflow: 'hidden' },
  chartArea: { ...StyleSheet.absoluteFillObject, borderRadius: 20 },
  chartBars: { flexDirection: 'row', alignItems: 'flex-end', justifyContent: 'space-between', height: '100%', paddingHorizontal: 10 },
  bar: { width: 24, backgroundColor: '#6366F1', borderRadius: 6, opacity: 0.3 },

  sectionTitle: { fontSize: 20, fontWeight: '900', color: '#0F172A', marginBottom: 20 },
  ledgerList: { gap: 12, marginBottom: 32 },
  lItem: { backgroundColor: '#FFF', padding: 16, borderRadius: 24, borderWidth: 1, borderColor: '#F1F5F9', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  lLeft: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  lDot: { width: 8, height: 8, borderRadius: 4 },
  lType: { fontSize: 14, fontWeight: '800', color: '#1E293B' },
  lUser: { fontSize: 11, fontWeight: '700', color: '#94A3B8' },
  lRight: { alignItems: 'flex-end' },
  lAmount: { fontSize: 15, fontWeight: '900' },
  lStatus: { fontSize: 9, fontWeight: '900', color: '#CBD5E1', marginTop: 2 },

  liquidityCard: { backgroundColor: '#0F172A', padding: 24, borderRadius: 32 },
  liqHeader: { flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 16 },
  liqTitle: { color: 'rgba(255,255,255,0.6)', fontSize: 11, fontWeight: '900', letterSpacing: 1.5 },
  liqValue: { color: '#FFF', fontSize: 32, fontWeight: '900', marginBottom: 24 },
  manageBtn: { backgroundColor: '#6366F1', paddingVertical: 16, borderRadius: 16, alignItems: 'center' },
  manageBtnText: { color: '#FFF', fontSize: 11, fontWeight: '900', letterSpacing: 2 },
  noDataText: { fontSize: 14, color: '#94A3B8', textAlign: 'center', marginVertical: 40, fontWeight: '600' }
});
