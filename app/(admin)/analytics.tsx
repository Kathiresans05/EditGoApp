import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Dimensions, Platform } from 'react-native';
import { 
  BarChart3, TrendingUp, PieChart, Activity, 
  ChevronLeft, ArrowUpRight, ArrowDownRight,
  Target, Zap, Users, ShoppingBag, Calendar
} from 'lucide-react-native';
import Animated, { FadeInUp, FadeInRight, FadeIn, Layout } from 'react-native-reanimated';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';

const { width } = Dimensions.get('window');

export default function AnalyticsScreen() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <ChevronLeft size={24} color="#0F172A" />
        </TouchableOpacity>
        <View>
          <View style={styles.tagRow}>
            <BarChart3 size={10} color="#6366F1" />
            <Text style={styles.tagText}>DATA INTELLIGENCE</Text>
          </View>
          <Text style={styles.title}>Marketplace <Text style={styles.highlight}>Analytics</Text></Text>
        </View>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        
        {/* Core KPIs */}
        <View style={styles.kpiGrid}>
          <KPICard title="Retention" value="84%" trend="+4%" up={true} color="#6366F1" />
          <KPICard title="LTV" value="₹4,200" trend="+12%" up={true} color="#10B981" />
          <KPICard title="CAC" value="₹850" trend="-5%" up={true} color="#8B5CF6" />
          <KPICard title="ROAS" value="4.2x" trend="+0.8" up={true} color="#F59E0B" />
        </View>

        {/* User Growth Chart */}
        <View style={styles.chartCard}>
          <View style={styles.chartHeader}>
            <View>
              <Text style={styles.chartTitle}>User Acquisition</Text>
              <Text style={styles.chartSubtitle}>MONTHLY GROWTH TREND</Text>
            </View>
            <TouchableOpacity style={styles.dateBtn}>
              <Calendar size={14} color="#6366F1" />
            </TouchableOpacity>
          </View>
          <View style={styles.chartPlaceholder}>
             {[30, 45, 60, 55, 80, 95, 75, 110, 90, 130].map((h, i) => (
                <View key={i} style={[styles.chartBar, { height: h, backgroundColor: i === 9 ? '#6366F1' : '#E2E8F0' }]} />
              ))}
          </View>
          <View style={styles.chartLegend}>
            <Text style={styles.legendText}>Jan</Text>
            <Text style={styles.legendText}>Mar</Text>
            <Text style={styles.legendText}>May</Text>
            <Text style={styles.legendText}>Jul</Text>
            <Text style={styles.legendText}>Sep</Text>
            <Text style={styles.legendText}>Nov</Text>
          </View>
        </View>

        {/* Segment Breakdown */}
        <Text style={styles.sectionTitle}>Category Breakdown</Text>
        <View style={styles.segmentList}>
          <SegmentItem label="Gaming Reels" percent={45} value="₹1.2M" color="#6366F1" />
          <SegmentItem label="Wedding Clips" percent={25} value="₹850k" color="#8B5CF6" />
          <SegmentItem label="Product Ads" percent={20} value="₹640k" color="#10B981" />
          <SegmentItem label="Other" percent={10} value="₹320k" color="#CBD5E1" />
        </View>

        {/* Strategic Goals */}
        <View style={styles.goalCard}>
          <LinearGradient colors={['#6366F1', '#4F46E5']} style={styles.goalGradient}>
            <View style={styles.goalTop}>
              <Target size={24} color="#FFF" />
              <Text style={styles.goalTitle}>Quarterly Target</Text>
            </View>
            <Text style={styles.goalVal}>₹50,00,000</Text>
            <View style={styles.progressRow}>
              <View style={styles.progressBar}>
                <View style={[styles.progressFill, { width: '65%' }]} />
              </View>
              <Text style={styles.progressPercent}>65%</Text>
            </View>
            <Text style={styles.goalStatus}>You are ₹17.5M away from goal</Text>
          </LinearGradient>
        </View>

        <View style={{ height: 40 }} />
      </ScrollView>
    </View>
  );
}

function KPICard({ title, value, trend, up, color }: any) {
  return (
    <View style={styles.kpiCard}>
      <Text style={styles.kpiLabel}>{title}</Text>
      <Text style={[styles.kpiValue, { color }]}>{value}</Text>
      <View style={styles.kpiFooter}>
        {up ? <ArrowUpRight size={10} color="#10B981" /> : <ArrowDownRight size={10} color="#EF4444" />}
        <Text style={[styles.kpiTrend, { color: up ? '#10B981' : '#EF4444' }]}>{trend}</Text>
      </View>
    </View>
  );
}

function SegmentItem({ label, percent, value, color }: any) {
  return (
    <View style={styles.segItem}>
      <View style={styles.segTop}>
        <View style={styles.segInfo}>
          <View style={[styles.segDot, { backgroundColor: color }]} />
          <Text style={styles.segLabel}>{label}</Text>
        </View>
        <Text style={styles.segValue}>{value}</Text>
      </View>
      <View style={styles.segBarTrack}>
        <View style={[styles.segBarFill, { width: `${percent}%`, backgroundColor: color }]} />
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

  kpiGrid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between', gap: 12, marginBottom: 32 },
  kpiCard: { width: '22.5%', backgroundColor: '#FFF', padding: 12, borderRadius: 20, borderWidth: 1, borderColor: '#F1F5F9', alignItems: 'center' },
  kpiLabel: { fontSize: 8, fontWeight: '900', color: '#94A3B8', textTransform: 'uppercase', marginBottom: 4 },
  kpiValue: { fontSize: 16, fontWeight: '900' },
  kpiFooter: { flexDirection: 'row', alignItems: 'center', marginTop: 4 },
  kpiTrend: { fontSize: 8, fontWeight: '900', marginLeft: 2 },

  chartCard: { backgroundColor: '#FFF', padding: 24, borderRadius: 32, marginBottom: 32, borderWidth: 1, borderColor: '#F1F5F9' },
  chartHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 },
  chartTitle: { fontSize: 18, fontWeight: '900', color: '#1E293B' },
  chartSubtitle: { fontSize: 9, fontWeight: '800', color: '#94A3B8', letterSpacing: 1.5, marginTop: 2 },
  dateBtn: { width: 40, height: 40, borderRadius: 12, backgroundColor: '#F8FAFC', alignItems: 'center', justifyContent: 'center' },
  chartPlaceholder: { height: 150, flexDirection: 'row', alignItems: 'flex-end', justifyContent: 'space-between', paddingHorizontal: 10 },
  chartBar: { width: width / 25, borderRadius: 4 },
  chartLegend: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 16, paddingHorizontal: 10 },
  legendText: { fontSize: 9, fontWeight: '800', color: '#CBD5E1' },

  sectionTitle: { fontSize: 20, fontWeight: '900', color: '#0F172A', marginBottom: 20 },
  segmentList: { gap: 20, marginBottom: 32 },
  segItem: { gap: 8 },
  segTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  segInfo: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  segDot: { width: 8, height: 8, borderRadius: 4 },
  segLabel: { fontSize: 14, fontWeight: '800', color: '#1E293B' },
  segValue: { fontSize: 14, fontWeight: '900', color: '#0F172A' },
  segBarTrack: { height: 6, backgroundColor: '#F1F5F9', borderRadius: 3 },
  segBarFill: { height: '100%', borderRadius: 3 },

  goalCard: { borderRadius: 32, overflow: 'hidden' },
  goalGradient: { padding: 24 },
  goalTop: { flexDirection: 'row', alignItems: 'center', gap: 12, marginBottom: 16 },
  goalTitle: { color: 'rgba(255,255,255,0.7)', fontSize: 11, fontWeight: '900', letterSpacing: 1.5 },
  goalVal: { color: '#FFF', fontSize: 32, fontWeight: '900', marginBottom: 20 },
  progressRow: { flexDirection: 'row', alignItems: 'center', gap: 12, marginBottom: 12 },
  progressBar: { flex: 1, height: 8, backgroundColor: 'rgba(255,255,255,0.2)', borderRadius: 4 },
  progressFill: { height: '100%', backgroundColor: '#FFF', borderRadius: 4 },
  progressPercent: { color: '#FFF', fontSize: 14, fontWeight: '900' },
  goalStatus: { color: 'rgba(255,255,255,0.6)', fontSize: 11, fontWeight: '700' }
});
