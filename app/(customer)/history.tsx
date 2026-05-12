import React from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity } from 'react-native';
import { GlassCard } from '../../src/components/ui/GlassCard';
import { ChevronRight, Clock, CheckCircle2 } from 'lucide-react-native';

export default function HistoryScreen() {
  const orders = [
    { id: '1', title: 'Cinematic Reel Edit', date: '10 May, 2024', price: '₹299', status: 'Completed', type: '📱' },
    { id: '2', title: 'AI Avatar Animation', date: '08 May, 2024', price: '₹199', status: 'Completed', type: '🤖' },
    { id: '3', title: 'YouTube Thumbnail', date: '05 May, 2024', price: '₹79', status: 'Completed', type: '🖼️' },
  ];

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Order History</Text>
        <Text style={styles.subtitle}>You have {orders.length} completed edits</Text>
      </View>

      <FlatList
        data={orders}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
        renderItem={({ item }) => (
          <TouchableOpacity activeOpacity={0.8}>
            <GlassCard style={styles.card}>
              <View style={styles.cardLeft}>
                <View style={styles.iconContainer}>
                  <Text style={styles.icon}>{item.type}</Text>
                </View>
                <View style={styles.details}>
                  <Text style={styles.orderTitle}>{item.title}</Text>
                  <View style={styles.dateRow}>
                    <Clock size={12} color="#94A3B8" />
                    <Text style={styles.orderDate}>{item.date}</Text>
                  </View>
                </View>
              </View>
              <View style={styles.cardRight}>
                <Text style={styles.orderPrice}>{item.price}</Text>
                <View style={styles.statusBadge}>
                  <CheckCircle2 size={12} color="#10B981" />
                  <Text style={styles.statusText}>{item.status}</Text>
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
  header: { paddingTop: 80, paddingHorizontal: 24, marginBottom: 24 },
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
  details: { marginLeft: 16 },
  orderTitle: { fontSize: 16, fontWeight: '700', color: '#1E293B' },
  dateRow: { flexDirection: 'row', alignItems: 'center', marginTop: 4 },
  orderDate: { color: '#94A3B8', fontSize: 12, marginLeft: 4 },
  cardRight: { alignItems: 'flex-end', marginRight: 12 },
  orderPrice: { fontSize: 16, fontWeight: '800', color: '#8B5CF6' },
  statusBadge: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    backgroundColor: '#F0FDF4', 
    paddingHorizontal: 8, 
    paddingVertical: 2, 
    borderRadius: 6,
    marginTop: 4
  },
  statusText: { color: '#10B981', fontSize: 11, fontWeight: '700', marginLeft: 4 }
});
