import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Dimensions, Platform } from 'react-native';
import { 
  Activity, ShoppingBag, Users, Zap, 
  Globe, Clock, ArrowUpRight,
  ShieldCheck, DollarSign, Search, ChevronLeft
} from 'lucide-react-native';
import Animated, { FadeInUp, FadeInRight, FadeIn, Layout } from 'react-native-reanimated';
import { useRouter } from 'expo-router';
import { BlurView } from 'expo-blur';
import { LinearGradient } from 'expo-linear-gradient';

const { width } = Dimensions.get('window');

interface ActivityItem {
  id: string;
  type: 'order' | 'user' | 'system' | 'payment';
  title: string;
  desc: string;
  time: string;
  location: string;
  status: 'success' | 'warning' | 'processing';
}

const initialActivities: ActivityItem[] = [
  {
    id: '1',
    type: 'order',
    title: 'New Enterprise Order',
    desc: 'Cinematic commercial project by BrandX Media',
    time: 'JUST NOW',
    location: 'New York, US',
    status: 'success'
  },
  {
    id: '2',
    type: 'payment',
    title: 'Payout Dispatched',
    desc: '₹45,000 sent to editor @alex_vfx',
    time: '2m ago',
    location: 'Mumbai, IN',
    status: 'success'
  },
  {
    id: '3',
    type: 'system',
    title: 'AI Node Scaling',
    desc: 'Adding 4 new GPU instances for rendering',
    time: '5m ago',
    location: 'AWS-East-1',
    status: 'processing'
  },
  {
    id: '4',
    type: 'user',
    title: 'Editor Verified',
    desc: 'Sarah Jenkins completed Master level',
    time: '12m ago',
    location: 'London, UK',
    status: 'success'
  }
];

export default function LiveActivityScreen() {
  const router = useRouter();
  const [activities, setActivities] = useState<ActivityItem[]>(initialActivities);

  useEffect(() => {
    const interval = setInterval(() => {
      const newActivity: ActivityItem = {
        id: Math.random().toString(),
        type: Math.random() > 0.5 ? 'order' : 'payment',
        title: Math.random() > 0.5 ? 'Live Conversion' : 'Revenue Event',
        desc: `Autonomous activity detected in cluster`,
        time: 'JUST NOW',
        location: 'Global Edge',
        status: 'success'
      };
      setActivities(prev => [newActivity, ...prev.slice(0, 9)]);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <ChevronLeft size={24} color="#0F172A" />
        </TouchableOpacity>
        <View>
          <View style={styles.tagRow}>
            <Activity size={10} color="#6366F1" />
            <Text style={styles.tagText}>LIVE PULSE</Text>
          </View>
          <Text style={styles.title}>Operations <Text style={styles.highlight}>Control</Text></Text>
        </View>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        
        {/* Status Hub */}
        <View style={styles.hubCard}>
          <View style={styles.hubHeader}>
            <Text style={styles.hubTitle}>System Status</Text>
            <View style={styles.nominalBadge}>
              <View style={styles.pulseDot} />
              <Text style={styles.nominalText}>NOMINAL</Text>
            </View>
          </View>
          <View style={styles.diagRow}>
            <DiagItem label="WebSocket" value="1,242" color="#6366F1" />
            <DiagItem label="Latency" value="14ms" color="#10B981" />
            <DiagItem label="Nodes" value="42" color="#F59E0B" />
          </View>
        </View>

        {/* Live Feed */}
        <Text style={styles.sectionTitle}>Event Stream</Text>
        <View style={styles.feedContainer}>
          {activities.map((item, index) => (
            <Animated.View 
              key={item.id} 
              entering={FadeInRight.delay(index * 100)} 
              layout={Layout.springify()}
              style={styles.activityCard}
            >
              <View style={[styles.iconBox, { backgroundColor: getBgColor(item.type) }]}>
                {getIcon(item.type)}
              </View>
              <View style={styles.cardContent}>
                <View style={styles.cardTop}>
                  <Text style={styles.cardTitle}>{item.title}</Text>
                  <Text style={styles.cardTime}>{item.time}</Text>
                </View>
                <Text style={styles.cardDesc}>{item.desc}</Text>
                <View style={styles.cardFooter}>
                  <View style={styles.footerItem}>
                    <Globe size={10} color="#94A3B8" />
                    <Text style={styles.footerText}>{item.location}</Text>
                  </View>
                  <View style={styles.footerItem}>
                    <View style={[styles.statusDot, { backgroundColor: getStatusColor(item.status) }]} />
                    <Text style={styles.footerText}>{item.status}</Text>
                  </View>
                </View>
              </View>
            </Animated.View>
          ))}
        </View>

        <TouchableOpacity style={styles.auditBtn}>
          <LinearGradient colors={['#6366F1', '#4F46E5']} style={styles.auditGradient}>
            <Text style={styles.auditBtnText}>DOWNLOAD AUDIT LOG</Text>
          </LinearGradient>
        </TouchableOpacity>

        <View style={{ height: 40 }} />
      </ScrollView>
    </View>
  );
}

function DiagItem({ label, value, color }: any) {
  return (
    <View style={styles.diagItem}>
      <Text style={styles.diagLabel}>{label}</Text>
      <Text style={[styles.diagValue, { color }]}>{value}</Text>
    </View>
  );
}

const getIcon = (type: string) => {
  switch(type) {
    case 'order': return <ShoppingBag size={20} color="#6366F1" />;
    case 'payment': return <DollarSign size={20} color="#10B981" />;
    case 'system': return <Zap size={20} color="#8B5CF6" />;
    default: return <Users size={20} color="#F59E0B" />;
  }
};

const getBgColor = (type: string) => {
  switch(type) {
    case 'order': return '#EEF2FF';
    case 'payment': return '#F0FDF4';
    case 'system': return '#F5F3FF';
    default: return '#FFFBEB';
  }
};

const getStatusColor = (status: string) => {
  switch(status) {
    case 'success': return '#10B981';
    case 'processing': return '#6366F1';
    default: return '#F59E0B';
  }
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FAFAFA' },
  header: { paddingHorizontal: 20, paddingTop: Platform.OS === 'ios' ? 60 : 40, paddingBottom: 20, flexDirection: 'row', alignItems: 'center' },
  backBtn: { width: 44, height: 44, borderRadius: 14, backgroundColor: '#FFF', alignItems: 'center', justifyContent: 'center', marginRight: 16, borderWidth: 1, borderColor: '#F1F5F9' },
  tagRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 4 },
  tagText: { fontSize: 10, fontWeight: '900', color: '#6366F1', letterSpacing: 2, marginLeft: 6 },
  title: { fontSize: 24, fontWeight: '900', color: '#0F172A', letterSpacing: -0.5 },
  highlight: { color: '#6366F1' },
  scrollContent: { padding: 20 },

  hubCard: { backgroundColor: '#FFF', padding: 24, borderRadius: 32, marginBottom: 32, borderWidth: 1, borderColor: '#F1F5F9', elevation: 4, shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 15 },
  hubHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 },
  hubTitle: { fontSize: 16, fontWeight: '800', color: '#1E293B' },
  nominalBadge: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#F0FDF4', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 12 },
  pulseDot: { width: 6, height: 6, borderRadius: 3, backgroundColor: '#10B981', marginRight: 6 },
  nominalText: { fontSize: 9, fontWeight: '900', color: '#10B981', letterSpacing: 1 },
  diagRow: { flexDirection: 'row', justifyContent: 'space-between' },
  diagItem: { flex: 1 },
  diagLabel: { fontSize: 10, fontWeight: '800', color: '#94A3B8', textTransform: 'uppercase', marginBottom: 4 },
  diagValue: { fontSize: 18, fontWeight: '900' },

  sectionTitle: { fontSize: 20, fontWeight: '900', color: '#0F172A', marginBottom: 20 },
  feedContainer: { gap: 12 },
  activityCard: { backgroundColor: '#FFF', padding: 16, borderRadius: 24, borderWidth: 1, borderColor: '#F1F5F9', flexDirection: 'row' },
  iconBox: { width: 48, height: 48, borderRadius: 16, alignItems: 'center', justifyContent: 'center', marginRight: 16 },
  cardContent: { flex: 1 },
  cardTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 },
  cardTitle: { fontSize: 15, fontWeight: '800', color: '#1E293B' },
  cardTime: { fontSize: 9, fontWeight: '800', color: '#CBD5E1' },
  cardDesc: { fontSize: 13, color: '#64748B', lineHeight: 18, marginBottom: 12 },
  cardFooter: { flexDirection: 'row', gap: 16 },
  footerItem: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  footerText: { fontSize: 10, fontWeight: '800', color: '#94A3B8', textTransform: 'uppercase' },
  statusDot: { width: 6, height: 6, borderRadius: 3 },

  auditBtn: { marginTop: 32, borderRadius: 20, overflow: 'hidden', elevation: 8, shadowColor: '#6366F1', shadowOpacity: 0.3, shadowRadius: 15 },
  auditGradient: { paddingVertical: 18, alignItems: 'center' },
  auditBtnText: { color: '#FFF', fontSize: 12, fontWeight: '900', letterSpacing: 2 }
});
