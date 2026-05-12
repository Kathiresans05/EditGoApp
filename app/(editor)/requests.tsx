import React from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { GlassCard } from '../../src/components/ui/GlassCard';
import { Clock, Zap, MapPin } from 'lucide-react-native';
import Animated, { FadeInUp } from 'react-native-reanimated';

const REQUESTS = [
  { id: '1', type: 'Cinematic Reel', customer: '@vlog_king', price: '₹299', time: '45 mins', urgent: true },
  { id: '2', type: 'YouTube Short', customer: '@tech_guy', price: '₹149', time: '3 hours', urgent: false },
  { id: '3', type: 'Wedding Highlights', customer: '@wedding_vibes', price: '₹499', time: '24 hours', urgent: false },
];

export default function RequestsScreen() {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>New Requests</Text>
        <Text style={styles.subtitle}>Accept jobs before they expire</Text>
      </View>

      <FlatList
        data={REQUESTS}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.list}
        renderItem={({ item, index }) => (
          <Animated.View entering={FadeInUp.delay(index * 100)}>
            <GlassCard style={styles.card}>
              <View style={styles.cardHeader}>
                <View style={styles.typeBox}>
                  <Text style={styles.typeText}>{item.type}</Text>
                  {item.urgent && <Zap size={14} color="#F59E0B" fill="#F59E0B" />}
                </View>
                <Text style={styles.price}>{item.price}</Text>
              </View>
              
              <Text style={styles.customer}>From: {item.customer}</Text>
              
              <View style={styles.detailsRow}>
                <View style={styles.detail}>
                  <Clock size={14} color="#64748B" />
                  <Text style={styles.detailText}>Delivery: {item.time}</Text>
                </View>
              </View>

              <View style={styles.actions}>
                <TouchableOpacity style={styles.declineBtn}>
                  <Text style={styles.declineText}>Decline</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.acceptBtn}>
                  <Text style={styles.acceptText}>Accept Job</Text>
                </TouchableOpacity>
              </View>
            </GlassCard>
          </Animated.View>
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
  card: { padding: 20, marginBottom: 16, backgroundColor: '#FFF' },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 },
  typeBox: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#F5F3FF', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 8 },
  typeText: { color: '#8B5CF6', fontWeight: '700', fontSize: 12, marginRight: 6 },
  price: { fontSize: 20, fontWeight: '800', color: '#1E293B' },
  customer: { fontSize: 16, fontWeight: '600', color: '#475569', marginBottom: 16 },
  detailsRow: { flexDirection: 'row', marginBottom: 20 },
  detail: { flexDirection: 'row', alignItems: 'center', marginRight: 16 },
  detailText: { fontSize: 13, color: '#64748B', marginLeft: 6 },
  actions: { flexDirection: 'row' },
  declineBtn: { flex: 1, paddingVertical: 12, alignItems: 'center', borderRadius: 12, borderWidth: 1, borderColor: '#E2E8F0', marginRight: 12 },
  declineText: { color: '#64748B', fontWeight: '700' },
  acceptBtn: { flex: 2, backgroundColor: '#10B981', paddingVertical: 12, alignItems: 'center', borderRadius: 12 },
  acceptText: { color: '#FFF', fontWeight: '700' }
});
