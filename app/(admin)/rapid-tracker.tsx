import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Platform, RefreshControl, ActivityIndicator } from 'react-native';
import { Zap, Clock, Activity, Search, Filter, ChevronRight, Hash, AlertCircle, CheckCircle2 } from 'lucide-react-native';
import Animated, { FadeInUp, Layout } from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';
import { adminService } from '../../src/services/api';

export default function RapidTracker() {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchRapidOrders = async () => {
    try {
      const data = await adminService.getOrders();
      // Filter for Rapid orders only
      const rapidOnly = data.orders.filter((o: any) => 
        o.category === 'RAPID' || o.deliverySpeed === 'RAPID'
      );
      setOrders(rapidOnly);
    } catch (error) {
      console.error('Error fetching rapid orders:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchRapidOrders();
    const interval = setInterval(fetchRapidOrders, 10000); // 10s live tracking
    return () => clearInterval(interval);
  }, []);

  const onRefresh = () => {
    setRefreshing(true);
    fetchRapidOrders();
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.tagRow}>
          <Zap size={10} color="#8B5CF6" fill="#8B5CF6" />
          <Text style={styles.tagText}>CRITICAL OPERATIONS</Text>
        </View>
        <Text style={styles.title}>Rapid <Text style={styles.highlight}>Order Tracker</Text></Text>
        <Text style={styles.subtitle}>Monitoring 35-minute delivery commitments.</Text>
      </View>

      <ScrollView 
        showsVerticalScrollIndicator={false} 
        contentContainerStyle={styles.scrollContent}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
      >
        
        {/* Status Hub */}
        <View style={styles.opsHub}>
          <View style={styles.hubStat}>
            <Text style={styles.hubValue}>{orders.filter(o => o.status !== 'COMPLETED').length}</Text>
            <Text style={styles.hubLabel}>ACTIVE</Text>
          </View>
          <View style={styles.hubDivider} />
          <View style={styles.hubStat}>
            <Text style={[styles.hubValue, { color: '#F59E0B' }]}>
              {orders.filter(o => o.status === 'SEARCHING').length}
            </Text>
            <Text style={styles.hubLabel}>UNASSIGNED</Text>
          </View>
          <View style={styles.hubDivider} />
          <View style={styles.hubStat}>
            <Text style={[styles.hubValue, { color: '#10B981' }]}>
              {orders.filter(o => o.status === 'COMPLETED').length}
            </Text>
            <Text style={styles.hubLabel}>DELIVERED</Text>
          </View>
        </View>

        {/* Live List */}
        <View style={styles.orderFeed}>
          {loading ? (
            <ActivityIndicator size="large" color="#8B5CF6" style={{ marginTop: 40 }} />
          ) : orders.length > 0 ? orders.map((order, i) => (
            <Animated.View 
              key={order.id} 
              entering={FadeInUp.delay(i * 100)} 
              layout={Layout.springify()}
              style={styles.orderCard}
            >
              <View style={styles.cardHeader}>
                <View style={styles.idGroup}>
                  <Hash size={14} color="#8B5CF6" />
                  <Text style={styles.orderId}>ORD-{order.id.slice(-6).toUpperCase()}</Text>
                </View>
                <View style={[styles.statusBadge, { backgroundColor: order.status === 'COMPLETED' ? '#DCFCE7' : '#F5F3FF' }]}>
                  <Text style={[styles.statusText, { color: order.status === 'COMPLETED' ? '#10B981' : '#8B5CF6' }]}>
                    {order.status}
                  </Text>
                </View>
              </View>

              <Text style={styles.orderTitle}>{order.title}</Text>
              
              <View style={styles.progressRow}>
                <View style={styles.progressBg}>
                  <View style={[styles.progressFill, { width: `${order.progress || 0}%`, backgroundColor: order.status === 'COMPLETED' ? '#10B981' : '#8B5CF6' }]} />
                </View>
                <Text style={styles.progressPct}>{order.progress || 0}%</Text>
              </View>

              <View style={styles.cardFooter}>
                <View style={styles.timerRow}>
                  <Clock size={14} color={order.status === 'COMPLETED' ? '#94A3B8' : '#EF4444'} />
                  <Text style={[styles.timerText, { color: order.status === 'COMPLETED' ? '#94A3B8' : '#EF4444' }]}>
                    {order.status === 'COMPLETED' ? 'Delivered' : `ETA: ${order.initialETAMins || 35}m`}
                  </Text>
                </View>
                <View style={styles.priceGroup}>
                  <Text style={styles.priceVal}>₹{order.price}</Text>
                </View>
              </View>
            </Animated.View>
          )) : (
            <View style={styles.emptyState}>
              <Activity size={48} color="#E2E8F0" />
              <Text style={styles.noDataText}>No active rapid orders</Text>
            </View>
          )}
        </View>

        <View style={{ height: 100 }} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FAFAFA' },
  header: { paddingHorizontal: 24, paddingTop: Platform.OS === 'ios' ? 70 : 50, paddingBottom: 24 },
  tagRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 4 },
  tagText: { fontSize: 10, fontWeight: '900', color: '#8B5CF6', letterSpacing: 2, marginLeft: 6 },
  title: { fontSize: 28, fontWeight: '900', color: '#0F172A', letterSpacing: -1 },
  highlight: { color: '#8B5CF6' },
  subtitle: { fontSize: 13, color: '#64748B', marginTop: 4, fontWeight: '500' },
  scrollContent: { paddingHorizontal: 20 },

  opsHub: { backgroundColor: '#1E293B', padding: 24, borderRadius: 24, flexDirection: 'row', justifyContent: 'space-between', marginBottom: 32, elevation: 4 },
  hubStat: { alignItems: 'center', flex: 1 },
  hubValue: { fontSize: 24, fontWeight: '900', color: '#FFF' },
  hubLabel: { fontSize: 8, fontWeight: '900', color: '#94A3B8', letterSpacing: 1, marginTop: 4 },
  hubDivider: { width: 1, height: '60%', backgroundColor: 'rgba(255,255,255,0.1)', alignSelf: 'center' },

  orderFeed: { gap: 16 },
  orderCard: { backgroundColor: '#FFF', borderRadius: 24, padding: 20, borderWidth: 1, borderColor: '#F1F5F9', elevation: 2, shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 10 },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 },
  idGroup: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  orderId: { fontSize: 12, fontWeight: '900', color: '#1E293B' },
  statusBadge: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 10 },
  statusText: { fontSize: 9, fontWeight: '900' },
  orderTitle: { fontSize: 16, fontWeight: '800', color: '#0F172A', marginBottom: 16 },
  
  progressRow: { flexDirection: 'row', alignItems: 'center', gap: 12, marginBottom: 20 },
  progressBg: { flex: 1, height: 6, backgroundColor: '#F1F5F9', borderRadius: 3, overflow: 'hidden' },
  progressFill: { height: '100%', borderRadius: 3 },
  progressPct: { fontSize: 12, fontWeight: '800', color: '#64748B', width: 35 },

  cardFooter: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingTop: 16, borderTopWidth: 1, borderTopColor: '#F1F5F9' },
  timerRow: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  timerText: { fontSize: 13, fontWeight: '800' },
  priceGroup: { alignItems: 'flex-end' },
  priceVal: { fontSize: 18, fontWeight: '900', color: '#0F172A' },
  
  emptyState: { alignItems: 'center', justifyContent: 'center', marginTop: 60 },
  noDataText: { fontSize: 15, color: '#94A3B8', textAlign: 'center', marginTop: 16, fontWeight: '700' }
});
