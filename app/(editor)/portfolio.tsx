import React from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Image, ScrollView } from 'react-native';
import { Plus, Play, Trash2, Edit3, Image as ImageIcon, Eye } from 'lucide-react-native';
import { GlassCard } from '../../src/components/ui/GlassCard';
import { LinearGradient } from 'expo-linear-gradient';

const PORTFOLIO_ITEMS = [
  { id: '1', title: 'Cinematic Wedding Highlight', category: 'Wedding', likes: 124, views: '2.4k' },
  { id: '2', title: 'Gaming Montage - Valorant', category: 'Gaming', likes: 450, views: '8.1k' },
  { id: '3', title: 'AI Face Swap Demo', category: 'AI Video', likes: 89, views: '1.2k' },
];

export default function PortfolioScreen() {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View>
          <Text style={styles.title}>Your Portfolio</Text>
          <Text style={styles.subtitle}>Showcase your best work to clients</Text>
        </View>
        <TouchableOpacity style={styles.addBtn}>
          <Plus size={24} color="#FFF" />
        </TouchableOpacity>
      </View>

      <View style={styles.categoryFilter}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {['All', 'Reels', 'Gaming', 'Wedding', 'Cinematic', 'VFX', 'AI'].map((cat, i) => (
            <TouchableOpacity key={cat} style={[styles.filterChip, i === 0 && styles.activeChip]}>
              <Text style={[styles.filterText, i === 0 && styles.activeFilterText]}>{cat}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      <FlatList
        data={PORTFOLIO_ITEMS}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.list}
        renderItem={({ item }) => (
          <GlassCard style={styles.card}>
            <View style={styles.imagePlaceholder}>
              <LinearGradient colors={['#F1F5F9', '#E2E8F0']} style={StyleSheet.absoluteFill} />
              <View style={styles.playIcon}><Play size={20} color="#FFF" fill="#FFF" /></View>
              <View style={styles.badge}><Text style={styles.badgeText}>{item.category}</Text></View>
            </View>
            
            <View style={styles.cardInfo}>
              <Text style={styles.itemTitle}>{item.title}</Text>
              <View style={styles.statsRow}>
                <View style={styles.stat}>
                  <Eye size={14} color="#94A3B8" />
                  <Text style={styles.statText}>{item.views}</Text>
                </View>
                <View style={styles.stat}>
                  <Text style={styles.statText}>❤️ {item.likes}</Text>
                </View>
              </View>
            </View>

            <View style={styles.cardActions}>
              <TouchableOpacity style={styles.actionBtn}><Edit3 size={18} color="#64748B" /></TouchableOpacity>
              <TouchableOpacity style={styles.actionBtn}><Trash2 size={18} color="#EF4444" /></TouchableOpacity>
            </View>
          </GlassCard>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8FAFC' },
  header: { paddingTop: 80, paddingHorizontal: 24, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 },
  title: { fontSize: 28, fontWeight: '800', color: '#1E293B' },
  subtitle: { fontSize: 14, color: '#64748B', marginTop: 4 },
  addBtn: { width: 50, height: 50, borderRadius: 25, backgroundColor: '#8B5CF6', alignItems: 'center', justifyContent: 'center', shadowColor: '#8B5CF6', shadowOpacity: 0.3, shadowRadius: 10, elevation: 5 },
  categoryFilter: { paddingLeft: 24, marginBottom: 24 },
  filterChip: { paddingHorizontal: 20, paddingVertical: 10, borderRadius: 12, backgroundColor: '#FFF', marginRight: 12, borderWidth: 1, borderColor: '#F1F5F9' },
  activeChip: { backgroundColor: '#8B5CF6', borderColor: '#8B5CF6' },
  filterText: { fontSize: 14, fontWeight: '600', color: '#64748B' },
  activeFilterText: { color: '#FFF' },
  list: { paddingHorizontal: 24, paddingBottom: 100 },
  card: { padding: 0, marginBottom: 20, overflow: 'hidden', backgroundColor: '#FFF' },
  imagePlaceholder: { height: 180, width: '100%', position: 'relative' },
  playIcon: { position: 'absolute', top: '40%', left: '45%', width: 44, height: 44, borderRadius: 22, backgroundColor: 'rgba(0,0,0,0.5)', alignItems: 'center', justifyContent: 'center' },
  badge: { position: 'absolute', top: 12, right: 12, backgroundColor: 'rgba(255,255,255,0.9)', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 8 },
  badgeText: { fontSize: 10, fontWeight: '800', color: '#1E293B' },
  cardInfo: { padding: 16 },
  itemTitle: { fontSize: 16, fontWeight: '700', color: '#1E293B' },
  statsRow: { flexDirection: 'row', alignItems: 'center', marginTop: 8 },
  stat: { flexDirection: 'row', alignItems: 'center', marginRight: 16 },
  statText: { fontSize: 12, color: '#94A3B8', marginLeft: 4 },
  cardActions: { flexDirection: 'row', borderTopWidth: 1, borderTopColor: '#F1F5F9', padding: 8, justifyContent: 'flex-end' },
  actionBtn: { padding: 8, marginLeft: 8 }
});
