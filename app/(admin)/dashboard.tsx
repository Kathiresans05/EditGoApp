import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Dimensions, Platform, Image } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { 
  Users, ShoppingBag, DollarSign, TrendingUp, 
  Bell, Search, LogOut, Activity,
  Zap, ArrowUpRight, BarChart3,
  Sparkles, ChevronRight, Globe
} from 'lucide-react-native';
import Animated, { FadeInUp, FadeInRight, FadeIn, Layout } from 'react-native-reanimated';
import { useRouter } from 'expo-router';
import * as SecureStore from 'expo-secure-store';

const { width } = Dimensions.get('window');

export default function AdminDashboard() {
  const router = useRouter();

  const handleLogout = async () => {
    await SecureStore.deleteItemAsync('userToken');
    await SecureStore.setItemAsync('userRole', '');
    router.replace('/login');
  };

  return (
    <View style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        
        {/* 1. Linear-Style Minimal Header */}
        <Animated.View entering={FadeIn.duration(800)} style={styles.header}>
          <View>
            <Text style={styles.adminTitle}>ECOSYSTEM OVERVIEW</Text>
            <View style={styles.statusRow}>
              <View style={styles.pulseContainer}>
                <View style={styles.pulseDot} />
                <View style={styles.pulseRing} />
              </View>
              <Text style={styles.statusText}>Systems Live</Text>
            </View>
          </View>
          <View style={styles.headerActions}>
            <TouchableOpacity style={styles.searchBtn}>
              <Search size={18} color="#64748B" />
            </TouchableOpacity>
            <TouchableOpacity style={styles.avatarBtn} onPress={handleLogout}>
              <View style={styles.avatar}><Text style={styles.avatarText}>KV</Text></View>
            </TouchableOpacity>
          </View>
        </Animated.View>

        {/* 2. Notion-AI Insights Card */}
        <Animated.View entering={FadeInUp.delay(200)} layout={Layout.springify()}>
          <LinearGradient 
            colors={['#6366F1', '#A855F7']} 
            start={{x: 0, y: 0}} 
            end={{x: 1, y: 0}} 
            style={styles.aiInsightCard}
          >
            <View style={styles.aiHeader}>
              <Sparkles size={20} color="#FFF" fill="#FFF" />
              <Text style={styles.aiTitle}>AI INSIGHTS</Text>
            </View>
            <Text style={styles.aiMessage}>
              Revenue is up <Text style={styles.boldText}>18%</Text> this week. High demand detected in <Text style={styles.boldText}>Gaming Reels</Text>. Suggestion: Onboard 5 more editors.
            </Text>
            <TouchableOpacity style={styles.aiAction}>
              <Text style={styles.aiActionText}>Execute Recommendation</Text>
              <ChevronRight size={14} color="#6366F1" />
            </TouchableOpacity>
          </LinearGradient>
        </Animated.View>

        {/* 3. Stripe-Inspired Metrics */}
        <View style={styles.metricsGrid}>
          <MetricCard 
            label="Gross Volume" 
            value="₹1,24,500" 
            trend="+12.4%" 
            icon={DollarSign} 
            color="#6366F1"
            delay={300}
          />
          <MetricCard 
            label="Active Users" 
            value="3,842" 
            trend="+8.2%" 
            icon={Users} 
            color="#8B5CF6"
            delay={400}
          />
        </View>

        {/* 4. Futuristic Chart Section */}
        <Animated.View entering={FadeInUp.delay(500)} style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Performance Curve</Text>
            <View style={styles.chartLegend}>
              <View style={[styles.legendDot, { backgroundColor: '#6366F1' }]} />
              <Text style={styles.legendText}>Growth</Text>
            </View>
          </View>
          <View style={styles.chartWrapper}>
            <View style={styles.chartMockup}>
              {[40, 70, 55, 90, 65, 80, 50, 100, 75, 85].map((h, i) => (
                <View key={i} style={[styles.chartBar, { height: h }]} />
              ))}
            </View>
            <LinearGradient 
              colors={['rgba(99, 102, 241, 0.1)', 'transparent']} 
              style={styles.chartGradient} 
            />
          </View>
        </Animated.View>

        {/* 5. Live Activity Feed (Airbnb Style) */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Live Feed</Text>
          <View style={styles.liveBadge}>
            <Text style={styles.liveBadgeText}>42 ONLINE</Text>
          </View>
        </View>

        <View style={styles.activityList}>
          <ActivityItem 
            icon="🎬" 
            title="Gaming Reel Accepted" 
            desc="Editor Rahul V. started ORD-942" 
            time="Now" 
          />
          <ActivityItem 
            icon="✅" 
            title="Payout Processed" 
            desc="₹4,200 sent to Sneha K." 
            time="2m ago" 
          />
          <ActivityItem 
            icon="🚀" 
            title="New VIP User" 
            desc="Creative Studio signed up" 
            time="5m ago" 
          />
        </View>

        <View style={{ height: 100 }} />
      </ScrollView>
    </View>
  );
}

function MetricCard({ label, value, trend, icon: Icon, color, delay }: any) {
  return (
    <Animated.View entering={FadeInUp.delay(delay)} style={styles.metricCard}>
      <View style={styles.metricTop}>
        <View style={[styles.iconContainer, { backgroundColor: color + '10' }]}>
          <Icon size={20} color={color} />
        </View>
        <View style={styles.trendBadge}>
          <ArrowUpRight size={12} color="#10B981" />
          <Text style={styles.trendValue}>{trend}</Text>
        </View>
      </View>
      <Text style={styles.metricValue}>{value}</Text>
      <Text style={styles.metricLabel}>{label}</Text>
    </Animated.View>
  );
}

function ActivityItem({ icon, title, desc, time }: any) {
  return (
    <Animated.View entering={FadeInRight} style={styles.activityItem}>
      <View style={styles.activityIcon}><Text style={styles.iconTxt}>{icon}</Text></View>
      <View style={styles.activityContent}>
        <Text style={styles.activityTitle}>{title}</Text>
        <Text style={styles.activityDesc}>{desc}</Text>
      </View>
      <Text style={styles.activityTime}>{time}</Text>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFFFFF' },
  scrollContent: { padding: 24, paddingTop: Platform.OS === 'ios' ? 70 : 50 },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 32 },
  adminTitle: { fontSize: 10, fontWeight: '900', color: '#94A3B8', letterSpacing: 2, textTransform: 'uppercase' },
  statusRow: { flexDirection: 'row', alignItems: 'center', marginTop: 6 },
  pulseContainer: { width: 20, height: 20, alignItems: 'center', justifyContent: 'center', marginRight: 8 },
  pulseDot: { width: 8, height: 8, borderRadius: 4, backgroundColor: '#10B981', zIndex: 2 },
  pulseRing: { position: 'absolute', width: 16, height: 16, borderRadius: 8, backgroundColor: 'rgba(16, 185, 129, 0.4)', opacity: 0.6 },
  statusText: { fontSize: 24, fontWeight: '800', color: '#1E293B', letterSpacing: -0.5 },
  headerActions: { flexDirection: 'row', alignItems: 'center' },
  searchBtn: { width: 42, height: 42, borderRadius: 12, backgroundColor: '#F1F5F9', alignItems: 'center', justifyContent: 'center', marginRight: 12 },
  avatarBtn: { elevation: 4, shadowColor: '#6366F1', shadowOpacity: 0.2, shadowRadius: 10 },
  avatar: { width: 42, height: 42, borderRadius: 14, backgroundColor: '#6366F1', alignItems: 'center', justifyContent: 'center' },
  avatarText: { color: '#FFF', fontWeight: '800', fontSize: 14 },
  
  aiInsightCard: { padding: 24, borderRadius: 32, marginBottom: 32, elevation: 15, shadowColor: '#6366F1', shadowOpacity: 0.3, shadowRadius: 20 },
  aiHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 12 },
  aiTitle: { color: 'rgba(255,255,255,0.7)', fontSize: 10, fontWeight: '900', marginLeft: 8, letterSpacing: 2 },
  aiMessage: { color: '#FFF', fontSize: 17, fontWeight: '500', lineHeight: 26, marginBottom: 20 },
  boldText: { fontWeight: '900' },
  aiAction: { alignSelf: 'flex-start', backgroundColor: '#FFF', paddingHorizontal: 16, paddingVertical: 10, borderRadius: 16, flexDirection: 'row', alignItems: 'center' },
  aiActionText: { color: '#6366F1', fontWeight: '800', fontSize: 12, marginRight: 6 },

  metricsGrid: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 32 },
  metricCard: { width: '48%', backgroundColor: '#FFF', padding: 20, borderRadius: 28, borderWidth: 1, borderColor: '#F1F5F9', elevation: 4, shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 15 },
  metricTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 },
  iconContainer: { width: 44, height: 44, borderRadius: 14, alignItems: 'center', justifyContent: 'center' },
  trendBadge: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#F0FDF4', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 10 },
  trendValue: { color: '#10B981', fontSize: 10, fontWeight: '900', marginLeft: 4 },
  metricValue: { fontSize: 24, fontWeight: '900', color: '#1E293B', letterSpacing: -1 },
  metricLabel: { fontSize: 12, color: '#94A3B8', fontWeight: '700', marginTop: 4, textTransform: 'uppercase', letterSpacing: 1 },

  section: { marginBottom: 32 },
  sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 },
  sectionTitle: { fontSize: 20, fontWeight: '800', color: '#1E293B', letterSpacing: -0.5 },
  chartLegend: { flexDirection: 'row', alignItems: 'center' },
  legendDot: { width: 8, height: 8, borderRadius: 4, marginRight: 6 },
  legendText: { fontSize: 12, color: '#64748B', fontWeight: '600' },
  chartWrapper: { height: 180, backgroundColor: '#F8FAFC', borderRadius: 32, padding: 24, overflow: 'hidden' },
  chartMockup: { flexDirection: 'row', alignItems: 'flex-end', justifyContent: 'space-between', height: '100%', zIndex: 2 },
  chartBar: { width: width / 15, backgroundColor: '#6366F1', borderRadius: 6, opacity: 0.2 },
  chartGradient: { ...StyleSheet.absoluteFillObject, opacity: 0.5 },

  liveBadge: { backgroundColor: '#F1F5F9', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 12 },
  liveBadgeText: { fontSize: 10, fontWeight: '900', color: '#64748B' },
  activityList: { gap: 16 },
  activityItem: { flexDirection: 'row', alignItems: 'center', padding: 16, backgroundColor: '#FFF', borderRadius: 24, borderWidth: 1, borderColor: '#F1F5F9' },
  activityIcon: { width: 48, height: 48, borderRadius: 16, backgroundColor: '#F8FAFC', alignItems: 'center', justifyContent: 'center', marginRight: 16 },
  iconTxt: { fontSize: 20 },
  activityContent: { flex: 1 },
  activityTitle: { fontSize: 15, fontWeight: '700', color: '#1E293B' },
  activityDesc: { fontSize: 13, color: '#64748B', marginTop: 2 },
  activityTime: { fontSize: 11, fontWeight: '800', color: '#CBD5E1', textTransform: 'uppercase' }
});
