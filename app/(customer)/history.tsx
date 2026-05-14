import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity, ActivityIndicator } from 'react-native';
import { GlassCard } from '../../src/components/ui/GlassCard';
import { ChevronRight, Clock, CheckCircle2, AlertCircle, RefreshCcw } from 'lucide-react-native';
import { orderService } from '../../src/services/api';
import { useRouter } from 'expo-router';

export default function HistoryScreen() {
  const router = useRouter();
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const data = await orderService.getMyOrders();
      setOrders(data.orders || []);
    } catch (error) {
      console.error('[History] Fetch Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category?.toLowerCase()) {
      case 'gaming': return '🎮';
      case 'cinematic': return '🎬';
      case 'ai animation': return '🤖';
      case 'reels': return '📱';
      default: return '🎬';
    }
  };

  if (loading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color="#8B5CF6" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.headerRow}>
          <View>
            <Text style={styles.title}>Project History</Text>
            <Text style={styles.subtitle}>You have {orders.length} orders in total</Text>
          </View>
          <TouchableOpacity onPress={fetchOrders} style={styles.refreshBtn}>
            <RefreshCcw size={20} color="#8B5CF6" />
          </TouchableOpacity>
        </View>
      </View>

      <FlatList
        data={orders}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <AlertCircle size={48} color="#CBD5E1" />
            <Text style={styles.emptyText}>No orders found yet</Text>
          </View>
        }
        renderItem={({ item }) => (
          <TouchableOpacity 
            activeOpacity={0.8}
            onPress={() => router.push({
              pathname: '/(customer)/tracking',
              params: { id: item.id }
            })}
          >
            <GlassCard style={styles.card}>
              <View style={styles.cardLeft}>
                <View style={styles.iconContainer}>
                  <Text style={styles.icon}>{getCategoryIcon(item.category)}</Text>
                </View>
                <View style={styles.details}>
                  <Text style={styles.orderTitle} numberOfLines={1}>{item.title}</Text>
                  <View style={styles.dateRow}>
                    <Clock size={12} color="#94A3B8" />
                    <Text style={styles.orderDate}>{new Date(item.createdAt).toLocaleDateString()}</Text>
                  </View>
                </View>
              </View>
              <View style={styles.cardRight}>
                <Text style={styles.orderPrice}>₹{item.price}</Text>
                <View style={[
                  styles.statusBadge, 
                  item.status === 'COMPLETED' ? styles.statusCompleted : styles.statusPending
                ]}>
                  {item.status === 'COMPLETED' ? <CheckCircle2 size={12} color="#10B981" /> : <Clock size={12} color="#F59E0B" />}
                  <Text style={[
                    styles.statusText, 
                    item.status === 'COMPLETED' ? {color: '#10B981'} : {color: '#F59E0B'}
                  ]}>
                    {item.status === 'COMPLETED' ? 'Finished' : 'Live'}
                  </Text>
                </View>
              </View>
              <ChevronRight size={20} color="#CBD5E1" />
            </GlassCard>
          </TouchableOpacity>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8FAFC' },
  centerContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  header: { paddingTop: 80, paddingHorizontal: 24, marginBottom: 24 },
  headerRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  refreshBtn: { width: 44, height: 44, borderRadius: 14, backgroundColor: '#F5F3FF', alignItems: 'center', justifyContent: 'center' },
  title: { fontSize: 28, fontWeight: '800', color: '#1E293B' },
  subtitle: { fontSize: 14, color: '#64748B', marginTop: 4 },
  list: { paddingHorizontal: 24, paddingBottom: 100 },
  card: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    padding: 16, 
    marginBottom: 16, 
    backgroundColor: '#FFF' 
  },
  cardLeft: { flex: 1, flexDirection: 'row', alignItems: 'center' },
  iconContainer: { 
    width: 48, 
    height: 48, 
    borderRadius: 14, 
    backgroundColor: '#F1F5F9', 
    alignItems: 'center', 
    justifyContent: 'center' 
  },
  icon: { fontSize: 20 },
  details: { marginLeft: 16, flex: 1 },
  orderTitle: { fontSize: 16, fontWeight: '700', color: '#1E293B' },
  dateRow: { flexDirection: 'row', alignItems: 'center', marginTop: 4 },
  orderDate: { color: '#94A3B8', fontSize: 12, marginLeft: 4 },
  cardRight: { alignItems: 'flex-end', marginRight: 12 },
  orderPrice: { fontSize: 16, fontWeight: '800', color: '#8B5CF6' },
  statusBadge: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    paddingHorizontal: 8, 
    paddingVertical: 2, 
    borderRadius: 6,
    marginTop: 4
  },
  statusCompleted: { backgroundColor: '#F0FDF4' },
  statusPending: { backgroundColor: '#FFF7ED' },
  statusText: { fontSize: 11, fontWeight: '700', marginLeft: 4 },
  emptyContainer: { alignItems: 'center', padding: 100 },
  emptyText: { marginTop: 16, color: '#94A3B8', fontWeight: '700' }
});
