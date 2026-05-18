import React, { useState, useEffect } from 'react';
import {
  View, Text, FlatList, StyleSheet, TouchableOpacity,
  ActivityIndicator, StatusBar, RefreshControl,
} from 'react-native';
import { ChevronRight, Clock, CheckCircle2, AlertCircle, RefreshCcw, Package, Zap } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { orderService } from '../../src/services/api';
import { useRouter } from 'expo-router';
import Animated, { FadeInUp } from 'react-native-reanimated';

const STATUS_CONFIG: Record<string, { bg: string; text: string; icon: any; label: string }> = {
  COMPLETED:  { bg: '#E8F5E9', text: '#2E7D32', icon: CheckCircle2, label: 'Completed' },
  IN_PROGRESS:{ bg: '#E3F2FD', text: '#1565C0', icon: Zap,           label: 'In Progress' },
  SEARCHING:  { bg: '#FFF3E0', text: '#E65100', icon: Clock,          label: 'Searching' },
  PENDING:    { bg: '#FFF3E0', text: '#F59E0B', icon: Clock,          label: 'Pending' },
};

const CATEGORY_COLORS = ['#E8F5E9', '#EDE7F6', '#E3F2FD', '#FFF3E0', '#FCE4EC', '#E0F7FA'];

export default function HistoryScreen() {
  const router = useRouter();
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [filter, setFilter] = useState<'ALL' | 'COMPLETED' | 'IN_PROGRESS'>('ALL');

  useEffect(() => { fetchOrders(); }, []);

  const fetchOrders = async () => {
    try {
      const data = await orderService.getMyOrders();
      setOrders(data.orders || []);
    } catch (error) {
      console.error('[History] Fetch Error:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const onRefresh = () => { setRefreshing(true); fetchOrders(); };

  const filtered = filter === 'ALL' ? orders : orders.filter(o => o.status === filter);

  const getCategoryEmoji = (category: string) => {
    const map: Record<string, string> = {
      'gaming': '🎮', 'cinematic': '🎬', 'ai animation': '🤖',
      'reels': '📱', 'wedding': '💍', 'youtube': '▶️',
    };
    return map[category?.toLowerCase()] || '✂️';
  };

  if (loading) return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#F8FAFC' }}>
      <ActivityIndicator size="large" color="#7C3AED" />
    </View>
  );

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#7C3AED" />

      {/* Header */}
      <LinearGradient colors={['#7C3AED', '#5B21B6']} style={styles.header}>
        <View style={styles.headerRow}>
          <View>
            <Text style={styles.headerTitle}>My Orders</Text>
            <Text style={styles.headerSub}>{orders.length} total projects</Text>
          </View>
          <TouchableOpacity style={styles.refreshBtn} onPress={onRefresh}>
            <RefreshCcw size={18} color="#FFF" />
          </TouchableOpacity>
        </View>

        {/* Filter Pills */}
        <View style={styles.filterRow}>
          {(['ALL', 'IN_PROGRESS', 'COMPLETED'] as const).map(f => (
            <TouchableOpacity
              key={f}
              style={[styles.filterPill, filter === f && styles.filterPillActive]}
              onPress={() => setFilter(f)}
            >
              <Text style={[styles.filterText, filter === f && styles.filterTextActive]}>
                {f === 'ALL' ? 'All' : f === 'IN_PROGRESS' ? 'Live' : 'Done'}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </LinearGradient>

      {/* Summary Cards */}
      <View style={styles.summaryRow}>
        <View style={[styles.summaryCard, { backgroundColor: '#EDE7F6' }]}>
          <Text style={[styles.summaryNum, { color: '#7C3AED' }]}>{orders.length}</Text>
          <Text style={styles.summaryLabel}>Total</Text>
        </View>
        <View style={[styles.summaryCard, { backgroundColor: '#E3F2FD' }]}>
          <Text style={[styles.summaryNum, { color: '#1565C0' }]}>
            {orders.filter(o => o.status === 'IN_PROGRESS').length}
          </Text>
          <Text style={styles.summaryLabel}>Live</Text>
        </View>
        <View style={[styles.summaryCard, { backgroundColor: '#E8F5E9' }]}>
          <Text style={[styles.summaryNum, { color: '#2E7D32' }]}>
            {orders.filter(o => o.status === 'COMPLETED').length}
          </Text>
          <Text style={styles.summaryLabel}>Done</Text>
        </View>
      </View>

      <FlatList
        data={filtered}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#7C3AED" />}
        ListEmptyComponent={
          <View style={styles.empty}>
            <Package size={52} color="#DDD6FE" />
            <Text style={styles.emptyTitle}>No orders yet</Text>
            <Text style={styles.emptyText}>Your editing orders will appear here</Text>
          </View>
        }
        renderItem={({ item, index }) => {
          const cfg = STATUS_CONFIG[item.status] || STATUS_CONFIG.PENDING;
          const StatusIcon = cfg.icon;
          const pastColor = CATEGORY_COLORS[index % CATEGORY_COLORS.length];
          return (
            <Animated.View entering={FadeInUp.delay(index * 60)}>
              <TouchableOpacity
                activeOpacity={0.85}
                style={styles.card}
                onPress={() => router.push({ pathname: '/(customer)/tracking', params: { id: item.id } })}
              >
                {/* Left icon */}
                <View style={[styles.catIcon, { backgroundColor: pastColor }]}>
                  <Text style={styles.catEmoji}>{getCategoryEmoji(item.category)}</Text>
                </View>

                {/* Info */}
                <View style={styles.cardInfo}>
                  <Text style={styles.cardTitle} numberOfLines={1}>{item.title}</Text>
                  <View style={styles.cardMeta}>
                    <Clock size={11} color="#94A3B8" />
                    <Text style={styles.cardDate}>{new Date(item.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}</Text>
                    <Text style={styles.cardCat}>• {item.category || 'Edit'}</Text>
                  </View>
                </View>

                {/* Right */}
                <View style={styles.cardRight}>
                  <Text style={styles.cardPrice}>₹{item.price}</Text>
                  <View style={[styles.badge, { backgroundColor: cfg.bg }]}>
                    <StatusIcon size={11} color={cfg.text} />
                    <Text style={[styles.badgeText, { color: cfg.text }]}>{cfg.label}</Text>
                  </View>
                </View>

                <ChevronRight size={16} color="#CBD5E1" style={{ marginLeft: 4 }} />
              </TouchableOpacity>
            </Animated.View>
          );
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8FAFC' },

  header: { paddingTop: 58, paddingHorizontal: 20, paddingBottom: 20, borderBottomLeftRadius: 28, borderBottomRightRadius: 28 },
  headerRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 },
  headerTitle: { fontSize: 24, fontWeight: '900', color: '#FFF' },
  headerSub: { fontSize: 12, color: 'rgba(255,255,255,0.75)', marginTop: 2, fontWeight: '600' },
  refreshBtn: { width: 40, height: 40, borderRadius: 12, backgroundColor: 'rgba(255,255,255,0.2)', alignItems: 'center', justifyContent: 'center' },
  filterRow: { flexDirection: 'row', gap: 8 },
  filterPill: { paddingHorizontal: 16, paddingVertical: 7, borderRadius: 20, backgroundColor: 'rgba(255,255,255,0.15)' },
  filterPillActive: { backgroundColor: '#FFF' },
  filterText: { fontSize: 13, fontWeight: '700', color: 'rgba(255,255,255,0.8)' },
  filterTextActive: { color: '#7C3AED' },

  summaryRow: { flexDirection: 'row', gap: 12, paddingHorizontal: 20, marginTop: 16, marginBottom: 8 },
  summaryCard: { flex: 1, borderRadius: 16, padding: 14, alignItems: 'center' },
  summaryNum: { fontSize: 22, fontWeight: '900' },
  summaryLabel: { fontSize: 11, color: '#64748B', fontWeight: '700', marginTop: 2 },

  list: { padding: 20, paddingBottom: 110 },
  card: {
    flexDirection: 'row', alignItems: 'center', backgroundColor: '#FFF',
    borderRadius: 18, padding: 14, marginBottom: 12,
    shadowColor: '#7C3AED', shadowOpacity: 0.05, shadowRadius: 8, elevation: 2,
  },
  catIcon: { width: 46, height: 46, borderRadius: 14, alignItems: 'center', justifyContent: 'center' },
  catEmoji: { fontSize: 22 },
  cardInfo: { flex: 1, marginLeft: 12 },
  cardTitle: { fontSize: 14, fontWeight: '800', color: '#1E293B', marginBottom: 4 },
  cardMeta: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  cardDate: { fontSize: 11, color: '#94A3B8', fontWeight: '600' },
  cardCat: { fontSize: 11, color: '#94A3B8', fontWeight: '600' },
  cardRight: { alignItems: 'flex-end', marginRight: 6 },
  cardPrice: { fontSize: 15, fontWeight: '900', color: '#7C3AED', marginBottom: 5 },
  badge: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 8, paddingVertical: 3, borderRadius: 8, gap: 4 },
  badgeText: { fontSize: 10, fontWeight: '800' },

  empty: { alignItems: 'center', paddingTop: 80 },
  emptyTitle: { fontSize: 18, fontWeight: '900', color: '#1E293B', marginTop: 16 },
  emptyText: { fontSize: 13, color: '#94A3B8', fontWeight: '600', marginTop: 6 },
});
