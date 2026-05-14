import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Dimensions, Platform, Image } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import * as SecureStore from 'expo-secure-store';
import { BlurView } from 'expo-blur';
import { 
  Users, ShoppingBag, DollarSign, TrendingUp, 
  Bell, Search, LogOut, Activity,
  Zap, ArrowUpRight, ArrowDownRight, BarChart3,
  Sparkles, ChevronRight, Globe, ShieldCheck, Map,
  Home, Wallet, Brain, Shield, BarChart,
  ShoppingCart, User, Ticket, X, Menu
} from 'lucide-react-native';
import Animated, { FadeInUp, FadeInRight, FadeIn, Layout } from 'react-native-reanimated';
import { authService, adminService } from '../../src/services/api';
import { RefreshControl } from 'react-native';

const { width, height } = Dimensions.get('window');

export default function AdminDashboard() {
  const router = useRouter();
  const [isDrawerOpen, setIsDrawerOpen] = React.useState(false);
  const [stats, setStats] = React.useState<any>(null);
  const [recentActivity, setRecentActivity] = React.useState<any[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [refreshing, setRefreshing] = React.useState(false);

  const fetchStats = async () => {
    try {
      const data = await adminService.getStats();
      setStats(data.stats);
      setRecentActivity(data.recentActivity);
    } catch (error) {
      console.error('Error fetching admin stats:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  React.useEffect(() => {
    fetchStats();
  }, []);

  const onRefresh = () => {
    setRefreshing(true);
    fetchStats();
  };

  const handleLogout = async () => {
    await SecureStore.deleteItemAsync('userToken');
    await SecureStore.setItemAsync('userRole', '');
    router.replace('/login');
  };

  const navItems = [
    { name: 'Dashboard', icon: Home, route: '/(admin)/dashboard' },
    { name: 'Live Activity', icon: Activity, route: '/(admin)/live-activity' },
    { name: 'Payments', icon: Wallet, route: '/(admin)/revenue-reports' },
    { name: 'Withdrawals', icon: DollarSign, route: '/(admin)/withdrawals' },
    { name: 'AI Insights', icon: Brain, route: '/(admin)/ai-insights' },
    { name: 'Security Hub', icon: Shield, route: '/(admin)/security' },
    { name: 'Analytics', icon: BarChart, route: '/(admin)/analytics' },
    { name: 'Pricing Console', icon: DollarSign, route: '/(admin)/pricing' },
    { name: 'Orders', icon: ShoppingCart, route: '/(admin)/orders' },
    { name: 'Users', icon: Users, route: '/(admin)/users' },
    { name: 'Editors', icon: User, route: '/(admin)/editors' },
    { name: 'Complaints', icon: Ticket, route: '/(admin)/complaints' },
  ];

  return (
    <View style={styles.container}>
      {/* Side Drawer Overlay */}
      {isDrawerOpen && (
        <Animated.View 
          entering={FadeIn.duration(200)} 
          style={styles.drawerOverlay}
        >
          <TouchableOpacity 
            activeOpacity={1} 
            onPress={() => setIsDrawerOpen(false)} 
            style={StyleSheet.absoluteFill} 
          />
          <Animated.View 
            entering={FadeInRight.duration(300)} 
            style={styles.drawerContent}
          >
            <BlurView intensity={80} style={StyleSheet.absoluteFill} />
            <View style={styles.drawerHeader}>
              <View style={styles.drawerTitleGroup}>
                <Image source={require('../../assets/editgo_logo.png')} style={styles.drawerLogo} />
                <Text style={styles.drawerTitle}>EditGo <Text style={{ color: '#6366F1' }}>OS</Text></Text>
              </View>
              <TouchableOpacity onPress={() => setIsDrawerOpen(false)} style={styles.closeBtn}>
                <X size={20} color="#64748B" />
              </TouchableOpacity>
            </View>

            <ScrollView showsVerticalScrollIndicator={false} style={styles.drawerNav}>
              <Text style={styles.navSectionTitle}>MARKETPLACE OPERATING SYSTEM</Text>
              {navItems.map((item, index) => (
                <TouchableOpacity 
                  key={index} 
                  style={styles.navItem}
                  onPress={() => {
                    setIsDrawerOpen(false);
                    router.push(item.route as any);
                  }}
                >
                  <View style={styles.navIconWrapper}>
                    <item.icon size={18} color="#6366F1" />
                  </View>
                  <Text style={styles.navItemText}>{item.name}</Text>
                  <ChevronRight size={14} color="#CBD5E1" />
                </TouchableOpacity>
              ))}
              
              <View style={styles.drawerDivider} />
              <TouchableOpacity style={styles.navItem} onPress={handleLogout}>
                <View style={[styles.navIconWrapper, { backgroundColor: '#FEF2F2' }]}>
                  <LogOut size={18} color="#EF4444" />
                </View>
                <Text style={[styles.navItemText, { color: '#EF4444' }]}>Sign Out</Text>
              </TouchableOpacity>
            </ScrollView>
            
            <View style={styles.drawerFooter}>
              <Text style={styles.versionText}>VERSION 4.0.2-ENTERPRISE</Text>
            </View>
          </Animated.View>
        </Animated.View>
      )}

      <ScrollView 
        showsVerticalScrollIndicator={false} 
        contentContainerStyle={styles.scrollContent}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
      >
        
        {/* Header Section */}
        <Animated.View entering={FadeIn.duration(800)} style={styles.header}>
          <View>
            <View style={styles.tagContainer}>
              <Sparkles size={10} color="#6366F1" fill="#6366F1" />
              <Text style={styles.adminTag}>ENTERPRISE COMMAND CENTER</Text>
            </View>
            <Text style={styles.mainTitle}>Marketplace <Text style={styles.highlightText}>Intelligence</Text></Text>
          </View>
          <View style={styles.headerActions}>
            <TouchableOpacity style={styles.menuBtn} onPress={() => setIsDrawerOpen(true)}>
              <Menu size={24} color="#0F172A" />
            </TouchableOpacity>
            <TouchableOpacity style={styles.avatarBtn} onPress={handleLogout}>
              <View style={styles.avatar}><Text style={styles.avatarText}>KV</Text></View>
            </TouchableOpacity>
          </View>
        </Animated.View>

        {/* Real-time Status Card */}
        <Animated.View entering={FadeInUp.delay(200)} style={styles.statusCard}>
          <View style={styles.statusHeader}>
            <View style={styles.liveIndicator}>
              <View style={styles.pulseDot} />
              <Text style={styles.liveText}>LIVE DATA</Text>
            </View>
            <Text style={styles.statusTime}>Updated: Just Now</Text>
          </View>
          <Text style={styles.statusDescription}>
            Real-time monitoring of the global EditGo creator ecosystem.
          </Text>
        </Animated.View>

        {/* Stats Grid */}
        <View style={styles.statsGrid}>
          <View style={styles.statsRow}>
            <BigStatsCard 
              title="Gross Volume" 
              value={stats?.grossVolume || "₹0"} 
              trend={stats?.trends?.revenue || "+0%"} 
              up={true} 
              icon={DollarSign} 
              color="#6366F1"
              delay={300}
            />
            <BigStatsCard 
              title="Creators" 
              value={stats?.creators || "0"} 
              trend={stats?.trends?.creators || "+0%"} 
              up={true} 
              icon={Users} 
              color="#8B5CF6"
              delay={400}
            />
          </View>
          <View style={styles.statsRow}>
            <BigStatsCard 
              title="Workflows" 
              value={stats?.workflows || "0"} 
              trend={stats?.trends?.workflows || "+0%"} 
              up={false} 
              icon={Activity} 
              color="#10B981"
              delay={500}
            />
            <BigStatsCard 
              title="Avg. Ticket" 
              value={stats?.avgTicket || "₹0"} 
              trend={stats?.trends?.avgTicket || "+0%"} 
              up={true} 
              icon={TrendingUp} 
              color="#F59E0B"
              delay={600}
            />
          </View>
        </View>

        {/* Revenue Velocity Chart */}
        <Animated.View entering={FadeInUp.delay(700)} style={styles.chartSection}>
          <View style={styles.sectionHeader}>
            <View>
              <Text style={styles.sectionTitle}>Revenue Velocity</Text>
              <Text style={styles.sectionSubtitle}>TRANSACTION VOLUME PER HOUR</Text>
            </View>
            <TouchableOpacity style={styles.opsBtn}>
              <Text style={styles.opsBtnText}>REALTIME</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.chartWrapper}>
            <LinearGradient 
              colors={['rgba(99, 102, 241, 0.15)', 'transparent']} 
              style={styles.chartArea}
            >
              <View style={styles.chartMockup}>
                {[40, 70, 55, 90, 65, 80, 50, 100, 75, 85].map((h, i) => (
                  <View key={i} style={[styles.chartBar, { height: h }]} />
                ))}
              </View>
            </LinearGradient>
          </View>
        </Animated.View>

        {/* Live Activity Stream */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Activity Stream</Text>
          <View style={styles.streamBadge}>
            <Activity size={12} color="#6366F1" />
            <Text style={styles.streamBadgeText}>STREAMING</Text>
          </View>
        </View>

        <View style={styles.activityList}>
          {recentActivity.length > 0 ? recentActivity.map((item, index) => (
            <StreamItem 
              key={item.id}
              icon={ShoppingBag} 
              title={item.title} 
              desc={item.desc} 
              time={item.time} 
              color={index % 2 === 0 ? "#6366F1" : "#A855F7"}
              status={item.status}
            />
          )) : (
            <Text style={styles.noDataText}>No recent activity</Text>
          )}
        </View>

        {/* Enterprise Management Suite Grid */}
        <View style={[styles.sectionHeader, { marginTop: 40 }]}>
          <View>
            <Text style={styles.sectionTitle}>Management Suite</Text>
            <Text style={styles.sectionSubtitle}>ENTERPRISE OPERATIONS HUB</Text>
          </View>
        </View>

        <View style={styles.managementGrid}>
          <View style={styles.mgmtRow}>
            <MgmtCard title="Live Feed" icon={Activity} color="#6366F1" route="/(admin)/live-activity" />
            <MgmtCard title="Payments" icon={DollarSign} color="#10B981" route="/(admin)/payments" />
            <MgmtCard title="Payouts" icon={ArrowDownRight} color="#F59E0B" route="/(admin)/withdrawals" />
          </View>
          <View style={styles.mgmtRow}>
            <MgmtCard title="Analytics" icon={BarChart3} color="#8B5CF6" route="/(admin)/analytics" />
            <MgmtCard title="AI Insights" icon={Sparkles} color="#EC4899" route="/(admin)/ai-insights" />
            <MgmtCard title="Security" icon={ShieldCheck} color="#0F172A" route="/(admin)/security" />
          </View>
          <View style={styles.mgmtRow}>
            <MgmtCard title="Promotions" icon={Zap} color="#EF4444" route="/(admin)/promotions" />
            <MgmtCard title="Support" icon={Globe} color="#3B82F6" route="/(admin)/complaints" />
            <MgmtCard title="Reviews" icon={Search} color="#64748B" route="/(admin)/reviews" />
          </View>
          <View style={styles.mgmtRow}>
            <MgmtCard title="Templates" icon={ShoppingBag} color="#A855F7" route="/(admin)/templates" />
            <MgmtCard title="Subs" icon={Users} color="#0EA5E9" route="/(admin)/subscriptions" />
            <MgmtCard title="Revenue" icon={TrendingUp} color="#10B981" route="/(admin)/revenue-reports" />
          </View>
        </View>

        <View style={{ height: 120 }} />
      </ScrollView>
    </View>
  );
}

function BigStatsCard({ title, value, trend, up, icon: Icon, color, delay }: any) {
  return (
    <Animated.View entering={FadeInUp.delay(delay)} style={styles.statsCardWrapper}>
      <View style={styles.statsCardContent}>
        <View style={styles.statsTop}>
          <View style={[styles.iconBox, { backgroundColor: color + '15' }]}>
            <Icon size={24} color={color} />
          </View>
          <View style={[styles.trendPill, { backgroundColor: up ? '#F0FDF4' : '#FEF2F2' }]}>
            {up ? <ArrowUpRight size={12} color="#10B981" /> : <ArrowDownRight size={12} color="#EF4444" />}
            <Text style={[styles.trendText, { color: up ? '#10B981' : '#EF4444' }]}>{trend}</Text>
          </View>
        </View>
        <Text style={styles.statsLabel}>{title}</Text>
        <Text style={styles.statsValue}>{value}</Text>
      </View>
    </Animated.View>
  );
}

function StreamItem({ icon: Icon, title, desc, time, color, status }: any) {
  return (
    <Animated.View entering={FadeInRight} style={styles.streamItem}>
      <View style={[styles.streamIcon, { backgroundColor: color + '10', borderColor: color + '20' }]}>
        <Icon size={20} color={color} />
      </View>
      <View style={styles.streamContent}>
        <View style={styles.streamTop}>
          <Text style={styles.streamTitle}>{title}</Text>
          <Text style={styles.streamTime}>{time}</Text>
        </View>
        <Text style={styles.streamDesc}>{desc}</Text>
        <View style={styles.statusIndicator}>
          <View style={[styles.statusDot, { backgroundColor: status === 'SUCCESS' ? '#10B981' : '#6366F1' }]} />
          <Text style={styles.statusText}>{status}</Text>
        </View>
      </View>
    </Animated.View>
  );
}

function MgmtCard({ title, icon: Icon, color, route }: any) {
  const router = useRouter();
  return (
    <TouchableOpacity 
      style={styles.mgmtCard} 
      onPress={() => router.push(route)}
      activeOpacity={0.7}
    >
      <View style={[styles.mgmtIcon, { backgroundColor: color + '10' }]}>
        <Icon size={20} color={color} />
      </View>
      <Text style={styles.mgmtTitle}>{title}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FAFAFA' },
  scrollContent: { padding: 20, paddingTop: Platform.OS === 'ios' ? 60 : 40 },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 24 },
  tagContainer: { flexDirection: 'row', alignItems: 'center', marginBottom: 4 },
  adminTag: { fontSize: 10, fontWeight: '900', color: '#6366F1', letterSpacing: 2, marginLeft: 6 },
  mainTitle: { fontSize: 26, fontWeight: '900', color: '#0F172A', letterSpacing: -1, maxWidth: width * 0.6 },
  highlightText: { color: '#6366F1' },
  headerActions: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  menuBtn: { width: 44, height: 44, borderRadius: 12, backgroundColor: '#FFF', alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: '#F1F5F9' },
  avatarBtn: { width: 44, height: 44, borderRadius: 12, backgroundColor: '#6366F1', alignItems: 'center', justifyContent: 'center' },
  avatar: { width: 44, height: 44, borderRadius: 12, alignItems: 'center', justifyContent: 'center' },
  avatarText: { color: '#FFF', fontWeight: '900', fontSize: 14 },

  // Drawer Styles
  drawerOverlay: { ...StyleSheet.absoluteFillObject, zIndex: 9999, backgroundColor: 'rgba(15, 23, 42, 0.4)' },
  drawerContent: { position: 'absolute', right: 0, top: 0, bottom: 0, width: width * 0.8, backgroundColor: 'rgba(255, 255, 255, 0.95)', paddingTop: Platform.OS === 'ios' ? 60 : 40, zIndex: 10000 },
  drawerHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 24, marginBottom: 32 },
  drawerTitleGroup: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  drawerLogo: { width: 32, height: 32, borderRadius: 8 },
  drawerTitle: { fontSize: 20, fontWeight: '900', color: '#0F172A' },
  closeBtn: { width: 40, height: 40, borderRadius: 12, backgroundColor: '#F8FAFC', alignItems: 'center', justifyContent: 'center' },
  drawerNav: { flex: 1, paddingHorizontal: 16 },
  navSectionTitle: { fontSize: 10, fontWeight: '900', color: '#94A3B8', letterSpacing: 1.5, marginLeft: 8, marginBottom: 16 },
  navItem: { flexDirection: 'row', alignItems: 'center', padding: 12, borderRadius: 16, marginBottom: 8 },
  navIconWrapper: { width: 40, height: 40, borderRadius: 12, backgroundColor: '#EEF2FF', alignItems: 'center', justifyContent: 'center', marginRight: 16 },
  navItemText: { flex: 1, fontSize: 15, fontWeight: '700', color: '#334155' },
  drawerDivider: { height: 1, backgroundColor: '#F1F5F9', marginVertical: 16, marginHorizontal: 8 },
  drawerFooter: { padding: 24, borderTopWidth: 1, borderTopColor: '#F1F5F9' },
  versionText: { fontSize: 10, fontWeight: '800', color: '#CBD5E1', textAlign: 'center', letterSpacing: 1 },

  statusCard: { backgroundColor: '#FFF', padding: 20, borderRadius: 24, marginBottom: 24, borderWidth: 1, borderColor: '#F1F5F9', elevation: 2, shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 10 },
  statusHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 },
  liveIndicator: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#F0FDF4', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 12, borderWeight: 1, borderColor: '#DCFCE7' },
  pulseDot: { width: 6, height: 6, borderRadius: 3, backgroundColor: '#10B981', marginRight: 6 },
  liveText: { fontSize: 9, fontWeight: '900', color: '#10B981', letterSpacing: 1 },
  statusTime: { fontSize: 10, color: '#94A3B8', fontWeight: '700' },
  statusDescription: { fontSize: 14, color: '#64748B', fontWeight: '500', lineHeight: 20 },

  statsGrid: { marginBottom: 32 },
  statsRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 12 },
  statsCardWrapper: { width: '48.5%', backgroundColor: '#FFF', borderRadius: 28, borderWidth: 1, borderColor: '#F1F5F9', overflow: 'hidden' },
  statsCardContent: { padding: 20 },
  statsTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 },
  iconBox: { width: 48, height: 48, borderRadius: 16, alignItems: 'center', justifyContent: 'center' },
  trendPill: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 10 },
  trendText: { fontSize: 10, fontWeight: '900', marginLeft: 2 },
  statsLabel: { fontSize: 11, fontWeight: '800', color: '#94A3B8', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 4 },
  statsValue: { fontSize: 22, fontWeight: '900', color: '#1E293B', letterSpacing: -0.5 },

  chartSection: { backgroundColor: '#FFF', padding: 24, borderRadius: 32, marginBottom: 32, borderWidth: 1, borderColor: '#F1F5F9' },
  sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 },
  sectionTitle: { fontSize: 20, fontWeight: '900', color: '#0F172A', letterSpacing: -0.5 },
  sectionSubtitle: { fontSize: 9, fontWeight: '800', color: '#94A3B8', letterSpacing: 1.5, marginTop: 2 },
  opsBtn: { backgroundColor: '#F8FAFC', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 12, borderWidth: 1, borderColor: '#F1F5F9' },
  opsBtnText: { fontSize: 10, fontWeight: '900', color: '#6366F1' },
  chartWrapper: { height: 120, marginTop: 10, overflow: 'hidden' },
  chartArea: { ...StyleSheet.absoluteFillObject, borderRadius: 20 },
  chartMockup: { flexDirection: 'row', alignItems: 'flex-end', justifyContent: 'space-between', height: '100%', paddingHorizontal: 10 },
  chartBar: { width: width / 18, backgroundColor: '#6366F1', borderRadius: 4, opacity: 0.3 },

  streamBadge: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#EEF2FF', paddingHorizontal: 10, paddingVertical: 6, borderRadius: 12 },
  streamBadgeText: { fontSize: 9, fontWeight: '900', color: '#6366F1', marginLeft: 6, letterSpacing: 1 },
  activityList: { gap: 12 },
  streamItem: { flexDirection: 'row', padding: 16, backgroundColor: '#FFF', borderRadius: 24, borderWidth: 1, borderColor: '#F1F5F9' },
  streamIcon: { width: 48, height: 48, borderRadius: 16, alignItems: 'center', justifyContent: 'center', marginRight: 16, borderWidth: 1 },
  streamContent: { flex: 1 },
  streamTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 },
  streamTitle: { fontSize: 14, fontWeight: '800', color: '#1E293B' },
  streamTime: { fontSize: 9, fontWeight: '800', color: '#CBD5E1' },
  streamDesc: { fontSize: 12, color: '#64748B', lineHeight: 18 },
  statusIndicator: { flexDirection: 'row', alignItems: 'center', marginTop: 8 },
  statusDot: { width: 6, height: 6, borderRadius: 3, marginRight: 6 },
  statusText: { fontSize: 9, fontWeight: '900', color: '#94A3B8', letterSpacing: 1 },

  managementGrid: { gap: 12, marginTop: 12 },
  mgmtRow: { flexDirection: 'row', justifyContent: 'space-between', gap: 12 },
  mgmtCard: { flex: 1, backgroundColor: '#FFF', padding: 16, borderRadius: 24, borderWidth: 1, borderColor: '#F1F5F9', alignItems: 'center', justifyContent: 'center', elevation: 2, shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 10 },
  mgmtIcon: { width: 44, height: 44, borderRadius: 14, alignItems: 'center', justifyContent: 'center', marginBottom: 8 },
  mgmtTitle: { fontSize: 11, fontWeight: '800', color: '#1E293B', textAlign: 'center' },
  noDataText: { fontSize: 14, color: '#94A3B8', textAlign: 'center', marginVertical: 20, fontWeight: '600' }
});

