import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Switch, Dimensions } from 'react-native';
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

const { width } = Dimensions.get('window');

export default function EditorDashboard() {
  const [isOnline, setIsOnline] = useState(true);
  const router = useRouter();

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* 1. Editor Portal Header */}
      <LinearGradient colors={['#6366F1', '#4F46E5', '#3B82F6']} style={styles.header}>
        <View style={styles.headerTop}>
          <View>
            <Text style={styles.welcome}>Editor Portal</Text>
            <Text style={styles.subWelcome}>Ready for new projects</Text>
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
              <View style={styles.dot} />
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.headerBottom}>
          <View style={styles.levelBadge}>
            <Award size={14} color="#FFD700" fill="#FFD700" />
            <Text style={styles.levelText}>PRO EDITOR • RANK #42</Text>
          </View>
          <View style={styles.onlineToggle}>
            <Text style={styles.onlineStatusText}>ONLINE</Text>
            <Switch 
              value={isOnline} 
              onValueChange={setIsOnline} 
              trackColor={{ false: '#FFFFFF40', true: '#10B981' }}
              thumbColor="#FFF"
            />
          </View>
        </View>

        {/* Progress Bar */}
        <View style={styles.progressContainer}>
          <View style={styles.progressHeader}>
            <Text style={styles.progressTitle}>Progress to Elite Editor</Text>
            <Text style={styles.progressPercent}>75%</Text>
          </View>
          <View style={styles.progressBarBg}>
            <View style={[styles.progressBarFill, { width: '75%' }]} />
          </View>
        </View>
      </LinearGradient>

      <View style={styles.content}>
        {/* 2. Stats Grid */}
        <View style={styles.statsGrid}>
          <Animated.View entering={FadeInUp.delay(200)} style={styles.statBox}>
            <GlassCard style={styles.statCard}>
              <Text style={styles.statLabel}>Earnings (Today)</Text>
              <Text style={styles.statValue}>₹4,250</Text>
              <View style={styles.trendContainer}>
                <ArrowUpRight size={12} color="#10B981" />
                <Text style={styles.trendGreen}>+12% vs yest.</Text>
              </View>
            </GlassCard>
          </Animated.View>

          <Animated.View entering={FadeInUp.delay(300)} style={styles.statBox}>
            <GlassCard style={styles.statCard}>
              <Text style={styles.statLabel}>Success Rate</Text>
              <Text style={styles.statValue}>98.5%</Text>
              <View style={styles.trendContainer}>
                <Star size={12} color="#F59E0B" fill="#F59E0B" />
                <Text style={styles.trendText}>Top 1% Editor</Text>
              </View>
            </GlassCard>
          </Animated.View>
        </View>

        {/* 3. New Requests Section (From old design) */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>New Requests</Text>
          <View style={styles.onlineIndicator}>
            <View style={styles.greenDot} />
            <Text style={styles.onlineLabel}>ONLINE</Text>
          </View>
        </View>
        <Animated.View entering={FadeInUp.delay(400)}>
          <GlassCard style={styles.requestCard}>
            <View style={styles.requestInfo}>
              <Text style={styles.requestTitle}>Cinematic Wedding Teaser</Text>
              <Text style={styles.requestSubtitle}>Budget: ₹2,500 • Deadline: 24h</Text>
            </View>
            <TouchableOpacity style={styles.acceptBtn}>
              <Text style={styles.acceptText}>Accept</Text>
            </TouchableOpacity>
          </GlassCard>
        </Animated.View>

        {/* 4. Active Job Card */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>In Progress</Text>
        </View>
        <Animated.View entering={FadeInUp.delay(500)}>
          <View style={styles.activeJobCard}>
            <View style={styles.jobHeader}>
              <Clock size={20} color="#EF4444" />
              <Text style={styles.jobHeaderText}>ACTIVE JOB • 00:24:12 LEFT</Text>
            </View>
            <Text style={styles.jobTitle}>Project: Cinematic Wedding Reel for @sarah_vlogs</Text>
            <TouchableOpacity style={styles.workspaceBtn}>
              <Text style={styles.workspaceBtnText}>Go to Workspace</Text>
              <ChevronRight size={18} color="#FFF" />
            </TouchableOpacity>
          </View>
        </Animated.View>

        {/* 5. Performance Analytics */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Performance Analytics</Text>
          <TouchableOpacity><Text style={styles.detailsText}>Details</Text></TouchableOpacity>
        </View>
        <GlassCard style={styles.analyticsCard}>
          <BarChart3 size={32} color="#CBD5E1" />
          <Text style={styles.loadingText}>Earnings Graph loading...</Text>
        </GlassCard>

        <View style={{ height: 100 }} />
      </View>
    </ScrollView>
  );
}

function BenefitCard({ icon, title, desc }: any) {
  return (
    <GlassCard style={styles.benefitCard}>
      <View style={styles.benefitIconBox}>{icon}</View>
      <Text style={styles.benefitTitle}>{title}</Text>
      <Text style={styles.benefitDesc}>{desc}</Text>
    </GlassCard>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8FAFC' },
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
  activeJobCard: { backgroundColor: '#FFF5F5', padding: 20, borderRadius: 24, borderWidth: 1, borderColor: '#FEE2E2' },
  jobHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 10 },
  jobHeaderText: { fontSize: 11, fontWeight: '900', color: '#EF4444', marginLeft: 8 },
  jobTitle: { fontSize: 15, fontWeight: '700', color: '#1E293B', marginBottom: 16, lineHeight: 22 },
  workspaceBtn: { backgroundColor: '#EF4444', paddingVertical: 12, borderRadius: 12, flexDirection: 'row', justifyContent: 'center', alignItems: 'center' },
  workspaceBtnText: { color: '#FFF', fontWeight: '800', fontSize: 14, marginRight: 8 },
  detailsText: { fontSize: 13, color: '#6366F1', fontWeight: '700' },
  analyticsCard: { height: 180, backgroundColor: '#FFF', borderRadius: 24, alignItems: 'center', justifyContent: 'center', marginBottom: 30 },
  loadingText: { fontSize: 13, color: '#94A3B8', marginTop: 12, fontWeight: '600' },
  benefitCard: { width: 180, padding: 16, backgroundColor: '#FFF', marginRight: 16, borderRadius: 24 },
  benefitIconBox: { width: 44, height: 44, borderRadius: 14, backgroundColor: '#F8FAFC', alignItems: 'center', justifyContent: 'center', marginBottom: 16 },
  benefitTitle: { fontSize: 15, fontWeight: '700', color: '#1E293B' },
  benefitDesc: { fontSize: 12, color: '#64748B', marginTop: 4, lineHeight: 18 }
});
