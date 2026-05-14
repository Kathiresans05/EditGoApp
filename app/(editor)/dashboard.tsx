import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Switch, Dimensions, ActivityIndicator } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { 
  Zap, TrendingUp, Star, Award, 
  ArrowUpRight, Clock, ShieldCheck, 
  ChevronRight, BarChart3, AlertCircle,
  CheckCircle, Zap as ZapIcon, Bell,
  UserCircle
} from 'lucide-react-native';
import { GlassCard } from '../../src/components/ui/GlassCard';
import Animated, { FadeInUp, FadeInRight } from 'react-native-reanimated';
import { useRouter } from 'expo-router';
import { authService, orderService } from '../../src/services/api';

const { width } = Dimensions.get('window');

export default function EditorDashboard() {
  const router = useRouter();
  const [isOnline, setIsOnline] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [activeJobs, setActiveJobs] = useState<any[]>([]);
  const [requests, setRequests] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const [profile, ordersData] = await Promise.all([
        authService.getMe(),
        orderService.getMyOrders()
      ]);
      
      setUser(profile);
      setIsOnline(profile.editorProfile?.isOnline || false);
      
      const allOrders = ordersData.orders || [];
      setActiveJobs(allOrders.filter((o: any) => o.status !== 'SEARCHING' && o.status !== 'COMPLETED'));
      setRequests(allOrders.filter((o: any) => o.status === 'SEARCHING'));
      
    } catch (error) {
      console.error('[EditorDashboard] Data Fetch Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const toggleOnline = async (value: boolean) => {
    setIsOnline(value);
    // TODO: Connect to real API to update online status
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
      {/* 1. Editor Portal Header */}
      <LinearGradient colors={['#6366F1', '#4F46E5', '#3B82F6']} style={styles.header}>
        <View style={styles.headerTop}>
          <View>
            <Text style={styles.welcome}>Editor Portal</Text>
            <Text style={styles.subWelcome}>Hello, {user?.name || 'Pro Editor'}</Text>
          </View>
          <View style={styles.headerActions}>
            <TouchableOpacity 
              style={styles.switchBtn} 
              onPress={() => router.push('/(customer)/home')}
            >
              <UserCircle size={18} color="#8B5CF6" />
              <Text style={styles.switchText}>Switch</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.bellBtn}>
              <Bell size={20} color="#FFF" />
              {requests.length > 0 && <View style={styles.dot} />}
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.headerBottom}>
          <View style={styles.levelBadge}>
            <Award size={14} color="#FFD700" fill="#FFD700" />
            <Text style={styles.levelText}>{editor?.level || 'BEGINNER'} EDITOR</Text>
          </View>
          <View style={styles.onlineToggle}>
            <Text style={styles.onlineStatusText}>{isOnline ? 'ONLINE' : 'OFFLINE'}</Text>
            <Switch 
              value={isOnline} 
              onValueChange={toggleOnline} 
              trackColor={{ false: '#FFFFFF40', true: '#10B981' }}
              thumbColor="#FFF"
            />
          </View>
        </View>

        {/* Progress Bar */}
        <View style={styles.progressContainer}>
          <View style={styles.progressHeader}>
            <Text style={styles.progressTitle}>Progress to Next Level</Text>
            <Text style={styles.progressPercent}>{editor?.totalOrders % 10 * 10}%</Text>
          </View>
          <View style={styles.progressBarBg}>
            <View style={[styles.progressBarFill, { width: `${(editor?.totalOrders % 10 * 10) || 10}%` }]} />
          </View>
        </View>
      </LinearGradient>

      <View style={styles.content}>
        {/* 2. Stats Grid */}
        <View style={styles.statsGrid}>
          <Animated.View entering={FadeInUp.delay(200)} style={styles.statBox}>
            <GlassCard style={styles.statCard}>
              <Text style={styles.statLabel}>Total Earnings</Text>
              <Text style={styles.statValue}>₹{editor?.totalEarnings?.toLocaleString() || '0'}</Text>
              <View style={styles.trendContainer}>
                <ArrowUpRight size={12} color="#10B981" />
                <Text style={styles.trendGreen}>Live from wallet</Text>
              </View>
            </GlassCard>
          </Animated.View>

          <Animated.View entering={FadeInUp.delay(300)} style={styles.statBox}>
            <GlassCard style={styles.statCard}>
              <Text style={styles.statLabel}>Success Rate</Text>
              <Text style={styles.statValue}>{editor?.successRate || '100'}%</Text>
              <View style={styles.trendContainer}>
                <Star size={12} color="#F59E0B" fill="#F59E0B" />
                <Text style={styles.trendText}>{editor?.rating?.toFixed(1) || '0.0'} Rating</Text>
              </View>
            </GlassCard>
          </Animated.View>
        </View>

        {/* 3. New Requests Section */}
        {requests.length > 0 && (
          <>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>New Requests ({requests.length})</Text>
              <View style={styles.onlineIndicator}>
                <View style={styles.greenDot} />
                <Text style={styles.onlineLabel}>ACTIVE</Text>
              </View>
            </View>
            {requests.map((req, idx) => (
              <Animated.View entering={FadeInUp.delay(400 + idx * 100)} key={req.id} style={{ marginBottom: 12 }}>
                <GlassCard style={styles.requestCard}>
                  <View style={styles.requestInfo}>
                    <Text style={styles.requestTitle}>{req.title}</Text>
                    <Text style={styles.requestSubtitle}>Budget: ₹{req.price} • {req.category}</Text>
                  </View>
                  <TouchableOpacity style={styles.acceptBtn} onPress={() => router.push('/(editor)/requests')}>
                    <Text style={styles.acceptText}>View</Text>
                  </TouchableOpacity>
                </GlassCard>
              </Animated.View>
            ))}
          </>
        )}

        {/* 4. Active Job Card */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>In Progress ({activeJobs.length})</Text>
        </View>
        {activeJobs.length > 0 ? activeJobs.map((job, idx) => (
          <Animated.View entering={FadeInUp.delay(500 + idx * 100)} key={job.id} style={{ marginBottom: 12 }}>
            <View style={styles.activeJobCard}>
              <View style={styles.jobHeader}>
                <Clock size={20} color="#EF4444" />
                <Text style={styles.jobHeaderText}>{job.status} • {job.progress}% DONE</Text>
              </View>
              <Text style={styles.jobTitle}>{job.title} for {job.customer?.name || 'Client'}</Text>
              <TouchableOpacity style={styles.workspaceBtn} onPress={() => router.push('/(editor)/requests')}>
                <Text style={styles.workspaceBtnText}>Update Progress</Text>
                <ChevronRight size={18} color="#FFF" />
              </TouchableOpacity>
            </View>
          </Animated.View>
        )) : (
          <View style={styles.emptyContainer}>
            <AlertCircle size={32} color="#CBD5E1" />
            <Text style={styles.emptyText}>No active jobs at the moment</Text>
          </View>
        )}

        {/* 5. Performance Analytics */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Performance Analytics</Text>
          <TouchableOpacity onPress={() => router.push('/(editor)/earnings')}>
            <Text style={styles.detailsText}>Details</Text>
          </TouchableOpacity>
        </View>
        <GlassCard style={styles.analyticsCard}>
          <BarChart3 size={32} color="#CBD5E1" />
          <Text style={styles.loadingText}>Orders History: {editor?.totalOrders || 0} Projects</Text>
        </GlassCard>

        <View style={{ height: 100 }} />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8FAFC' },
  centerContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  emptyContainer: { alignItems: 'center', justifyContent: 'center', padding: 40, backgroundColor: '#FFF', borderRadius: 24, borderStyle: 'dashed', borderWidth: 2, borderColor: '#E2E8F0' },
  emptyText: { marginTop: 12, color: '#94A3B8', fontWeight: '600' },
  
  header: { paddingTop: 60, paddingBottom: 30, paddingHorizontal: 24, borderBottomLeftRadius: 40, borderBottomRightRadius: 40 },
  headerTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 },
  welcome: { fontSize: 28, fontWeight: '900', color: '#FFF' },
  subWelcome: { fontSize: 13, color: 'rgba(255,255,255,0.8)', fontWeight: '600' },
  headerActions: { flexDirection: 'row', alignItems: 'center' },
  switchBtn: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#F5F3FF', paddingHorizontal: 12, paddingVertical: 8, borderRadius: 16, marginRight: 12 },
  switchText: { fontSize: 13, fontWeight: '800', color: '#8B5CF6', marginLeft: 6 },
  bellBtn: { width: 44, height: 44, borderRadius: 14, backgroundColor: 'rgba(255,255,255,0.2)', alignItems: 'center', justifyContent: 'center' },
  dot: { position: 'absolute', top: 12, right: 12, width: 8, height: 8, borderRadius: 4, backgroundColor: '#EF4444', borderWidth: 2, borderColor: '#4F46E5' },
  headerBottom: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 10 },
  levelBadge: { flexDirection: 'row', alignItems: 'center', backgroundColor: 'rgba(255,255,255,0.2)', paddingHorizontal: 12, paddingVertical: 8, borderRadius: 12 },
  levelText: { color: '#FFF', fontSize: 10, fontWeight: '800', marginLeft: 6 },
  onlineToggle: { flexDirection: 'row', alignItems: 'center' },
  onlineStatusText: { fontSize: 10, fontWeight: '900', color: '#FFF', marginRight: 8, letterSpacing: 1 },
  progressContainer: { marginTop: 20 },
  progressHeader: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8 },
  progressTitle: { color: 'rgba(255,255,255,0.8)', fontSize: 12, fontWeight: '600' },
  progressPercent: { color: '#FFF', fontSize: 12, fontWeight: '900' },
  progressBarBg: { height: 6, backgroundColor: 'rgba(255,255,255,0.2)', borderRadius: 3 },
  progressBarFill: { height: 6, backgroundColor: '#FFF', borderRadius: 3 },
  content: { padding: 20 },
  statsGrid: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 24 },
  statBox: { width: '48%' },
  statCard: { padding: 16, backgroundColor: '#FFF', borderRadius: 24 },
  statLabel: { fontSize: 11, color: '#64748B', fontWeight: '600' },
  statValue: { fontSize: 22, fontWeight: '900', color: '#1E293B', marginVertical: 6 },
  trendContainer: { flexDirection: 'row', alignItems: 'center' },
  trendGreen: { fontSize: 10, color: '#10B981', fontWeight: '700', marginLeft: 4 },
  trendText: { fontSize: 10, color: '#64748B', fontWeight: '700', marginLeft: 4 },
  sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16, marginTop: 10 },
  sectionTitle: { fontSize: 18, fontWeight: '800', color: '#1E293B' },
  onlineIndicator: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#F0FDF4', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 8 },
  greenDot: { width: 6, height: 6, borderRadius: 3, backgroundColor: '#10B981', marginRight: 6 },
  onlineLabel: { fontSize: 9, fontWeight: '900', color: '#10B981' },
  requestCard: { padding: 16, backgroundColor: '#FFF', borderRadius: 24, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  requestInfo: { flex: 1 },
  requestTitle: { fontSize: 15, fontWeight: '700', color: '#1E293B' },
  requestSubtitle: { fontSize: 12, color: '#64748B', marginTop: 4 },
  acceptBtn: { backgroundColor: '#8B5CF6', paddingHorizontal: 16, paddingVertical: 8, borderRadius: 12 },
  acceptText: { color: '#FFF', fontWeight: '800', fontSize: 13 },
  activeJobCard: { backgroundColor: '#F5F3FF', padding: 20, borderRadius: 24, borderWidth: 1, borderColor: '#DDD6FE' },
  jobHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 10 },
  jobHeaderText: { fontSize: 11, fontWeight: '900', color: '#8B5CF6', marginLeft: 8 },
  jobTitle: { fontSize: 15, fontWeight: '700', color: '#1E293B', marginBottom: 16, lineHeight: 22 },
  workspaceBtn: { backgroundColor: '#8B5CF6', paddingVertical: 12, borderRadius: 12, flexDirection: 'row', justifyContent: 'center', alignItems: 'center' },
  workspaceBtnText: { color: '#FFF', fontWeight: '800', fontSize: 14, marginRight: 8 },
  detailsText: { fontSize: 13, color: '#6366F1', fontWeight: '700' },
  analyticsCard: { height: 120, backgroundColor: '#FFF', borderRadius: 24, alignItems: 'center', justifyContent: 'center', marginBottom: 30 },
  loadingText: { fontSize: 13, color: '#94A3B8', marginTop: 12, fontWeight: '600' }
});
