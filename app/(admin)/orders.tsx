import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Platform } from 'react-native';
import { ShoppingBag, Clock, Activity, MapPin, Search, Filter, ChevronRight, Hash } from 'lucide-react-native';
import Animated, { FadeInUp, Layout } from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';

import { adminService } from '../../src/services/api';
import { RefreshControl, ActivityIndicator } from 'react-native';

export default function OrderDesk() {
  const [orders, setOrders] = React.useState<any[]>([]);
  const [totalOrders, setTotalOrders] = React.useState(0);
  const [loading, setLoading] = React.useState(true);
  const [refreshing, setRefreshing] = React.useState(false);

  const fetchOrders = async () => {
    try {
      const data = await adminService.getOrders();
      setOrders(data.orders);
      setTotalOrders(data.totalCount);
    } catch (error) {
      console.error('Error fetching orders:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  React.useEffect(() => {
    fetchOrders();
  }, []);

  const onRefresh = () => {
    setRefreshing(true);
    fetchOrders();
  };
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.tagRow}>
          <Activity size={10} color="#6366F1" />
          <Text style={styles.tagText}>REAL-TIME OPERATIONS</Text>
        </View>
        <Text style={styles.title}>Global <Text style={styles.highlight}>Order Desk</Text></Text>
      </View>

      <ScrollView 
        showsVerticalScrollIndicator={false} 
        contentContainerStyle={styles.scrollContent}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
      >
        
        {/* Operations Hub */}
        <View style={styles.opsHub}>
          <OpsStat label="IN PRODUCTION" value={orders.filter(o => o.status !== 'COMPLETED').length.toString()} color="#6366F1" />
          <OpsStat label="TOTAL" value={totalOrders.toString()} color="#F59E0B" />
          <OpsStat label="DELIVERED" value={orders.filter(o => o.status === 'COMPLETED').length.toString()} color="#10B981" />
        </View>

        {/* Tab Switcher */}
        <View style={styles.tabContainer}>
          <TouchableOpacity style={[styles.tab, styles.activeTab]}>
            <Text style={styles.activeTabText}>LIVE QUEUE</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.tab}>
            <Text style={styles.tabText}>HISTORY</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.tab}>
            <Text style={styles.tabText}>DISPUTES</Text>
          </TouchableOpacity>
        </View>

        {/* Search & Filter */}
        <View style={styles.searchRow}>
          <View style={styles.searchBar}>
            <Search size={18} color="#94A3B8" />
            <Text style={styles.searchPlaceholder}>Search order ID, client or editor...</Text>
          </View>
          <TouchableOpacity style={styles.filterBtn}>
            <Filter size={18} color="#6366F1" />
          </TouchableOpacity>
        </View>

        {/* Order Feed */}
        <View style={styles.orderFeed}>
          {loading ? (
            <ActivityIndicator size="large" color="#6366F1" style={{ marginTop: 40 }} />
          ) : orders.length > 0 ? orders.map((order, i) => (
            <Animated.View 
              key={order.id} 
              entering={FadeInUp.delay(i * 100)} 
              layout={Layout.springify()}
              style={styles.orderCard}
            >
              <View style={styles.cardHeader}>
                <View style={styles.idGroup}>
                  <Hash size={14} color="#6366F1" />
                  <Text style={styles.orderId}>ORD-{order.id.slice(-6).toUpperCase()}</Text>
                </View>
                <View style={[styles.statusBadge, { backgroundColor: '#F5F3FF' }]}>
                  <Text style={styles.statusText}>{order.status}</Text>
                </View>
              </View>

              <Text style={styles.orderTitle}>{order.title}</Text>
              
              <View style={styles.userSection}>
                <View style={styles.userRow}>
                  <View style={styles.uIcon}><Text style={styles.uIconTxt}>C</Text></View>
                  <Text style={styles.uName}>{order.customer} <Text style={styles.uRole}>(Client)</Text></Text>
                </View>
                <View style={styles.userRow}>
                  <View style={[styles.uIcon, { backgroundColor: '#F0FDF4' }]}><Text style={[styles.uIconTxt, { color: '#10B981' }]}>E</Text></View>
                  <Text style={styles.uName}>{order.editor} <Text style={styles.uRole}>(Editor)</Text></Text>
                </View>
              </View>

              <View style={styles.cardFooter}>
                <View style={styles.timerRow}>
                  <Clock size={12} color="#6366F1" />
                  <Text style={[styles.timerText, { color: '#6366F1' }]}>{order.time}</Text>
                </View>
                <View style={styles.priceGroup}>
                  <Text style={styles.priceLabel}>VOLUME</Text>
                  <Text style={styles.priceVal}>{order.price}</Text>
                </View>
                <TouchableOpacity style={styles.viewBtn}>
                  <ChevronRight size={20} color="#6366F1" />
                </TouchableOpacity>
              </View>
            </Animated.View>
          )) : (
            <Text style={styles.noDataText}>No orders in queue</Text>
          )}
        </View>

        <View style={{ height: 100 }} />
      </ScrollView>
    </View>
  );
}

function OpsStat({ label, value, color }: any) {
  return (
    <View style={styles.opsStat}>
      <Text style={styles.opsLabel}>{label}</Text>
      <Text style={[styles.opsValue, { color }]}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FAFAFA' },
  header: { paddingHorizontal: 24, paddingTop: Platform.OS === 'ios' ? 70 : 50, paddingBottom: 24 },
  tagRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 4 },
  tagText: { fontSize: 10, fontWeight: '900', color: '#6366F1', letterSpacing: 2, marginLeft: 6 },
  title: { fontSize: 28, fontWeight: '900', color: '#0F172A', letterSpacing: -1 },
  highlight: { color: '#6366F1' },
  scrollContent: { paddingHorizontal: 20 },

  opsHub: { backgroundColor: '#FFF', padding: 24, borderRadius: 32, flexDirection: 'row', justifyContent: 'space-between', marginBottom: 32, borderWidth: 1, borderColor: '#F1F5F9', elevation: 4, shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 15 },
  opsStat: { alignItems: 'center' },
  opsLabel: { fontSize: 8, fontWeight: '900', color: '#94A3B8', letterSpacing: 1, marginBottom: 4 },
  opsValue: { fontSize: 24, fontWeight: '900' },

  tabContainer: { flexDirection: 'row', backgroundColor: '#F1F5F9', padding: 4, borderRadius: 16, marginBottom: 24 },
  tab: { flex: 1, paddingVertical: 10, alignItems: 'center', borderRadius: 12 },
  activeTab: { backgroundColor: '#FFF', elevation: 2 },
  activeTabText: { fontSize: 10, fontWeight: '900', color: '#6366F1' },
  tabText: { fontSize: 10, fontWeight: '800', color: '#64748B' },

  searchRow: { flexDirection: 'row', gap: 12, marginBottom: 32 },
  searchBar: { flex: 1, flexDirection: 'row', alignItems: 'center', backgroundColor: '#FFF', paddingHorizontal: 16, height: 50, borderRadius: 16, borderWidth: 1, borderColor: '#F1F5F9' },
  searchPlaceholder: { fontSize: 12, color: '#94A3B8', marginLeft: 10, fontWeight: '600' },
  filterBtn: { width: 50, height: 50, borderRadius: 16, backgroundColor: '#FFF', alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: '#F1F5F9' },

  orderFeed: { gap: 16 },
  orderCard: { backgroundColor: '#FFF', borderRadius: 28, padding: 20, borderWidth: 1, borderColor: '#F1F5F9' },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 },
  idGroup: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  orderId: { fontSize: 12, fontWeight: '900', color: '#1E293B' },
  statusBadge: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 10 },
  statusText: { fontSize: 9, fontWeight: '900', color: '#6366F1' },
  orderTitle: { fontSize: 17, fontWeight: '900', color: '#0F172A', marginBottom: 16 },
  
  userSection: { gap: 12, marginBottom: 20 },
  userRow: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  uIcon: { width: 28, height: 28, borderRadius: 8, backgroundColor: '#EEF2FF', alignItems: 'center', justifyContent: 'center' },
  uIconTxt: { fontSize: 10, fontWeight: '900', color: '#6366F1' },
  uName: { fontSize: 13, fontWeight: '700', color: '#475569' },
  uRole: { color: '#94A3B8', fontWeight: '500' },

  cardFooter: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingTop: 16, borderTopWidth: 1, borderTopColor: '#F1F5F9' },
  timerRow: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  timerText: { fontSize: 11, fontWeight: '800', color: '#EF4444' },
  priceGroup: { alignItems: 'flex-end' },
  priceLabel: { fontSize: 8, fontWeight: '900', color: '#94A3B8', letterSpacing: 1 },
  priceVal: { fontSize: 16, fontWeight: '900', color: '#0F172A' },
  viewBtn: { width: 36, height: 36, borderRadius: 12, backgroundColor: '#F8FAFC', alignItems: 'center', justifyContent: 'center' },
  noDataText: { fontSize: 14, color: '#94A3B8', textAlign: 'center', marginVertical: 40, fontWeight: '600' }
});

