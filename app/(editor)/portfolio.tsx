import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Image, ScrollView, ActivityIndicator } from 'react-native';
import { Plus, Play, Trash2, Edit3, Image as ImageIcon, Eye, AlertCircle } from 'lucide-react-native';
import { GlassCard } from '../../src/components/ui/GlassCard';
import { LinearGradient } from 'expo-linear-gradient';
import { authService } from '../../src/services/api';

export default function PortfolioScreen() {
  const [portfolio, setPortfolio] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPortfolio();
  }, []);

  const fetchPortfolio = async () => {
    try {
      setLoading(true);
      const user = await authService.getMe();
      setPortfolio(user.editorProfile?.portfolio || []);
    } catch (error) {
      console.error('[Portfolio] Fetch Error:', error);
    } finally {
      setLoading(false);
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
        <View>
          <Text style={styles.title}>Showcase</Text>
          <Text style={styles.subtitle}>Your best work on display</Text>
        </View>
        <TouchableOpacity style={styles.addBtn}>
          <Plus size={24} color="#FFF" />
        </TouchableOpacity>
      </View>

      <FlatList
        data={portfolio}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.list}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <AlertCircle size={48} color="#CBD5E1" />
            <Text style={styles.emptyTitle}>Empty Portfolio</Text>
            <Text style={styles.emptySubtitle}>Add your first video to start attracting high-paying clients.</Text>
            <TouchableOpacity style={styles.addInitialBtn}>
              <Text style={styles.addInitialText}>Upload Now</Text>
            </TouchableOpacity>
          </View>
        }
        renderItem={({ item }) => (
          <GlassCard style={styles.card}>
            <View style={styles.imagePlaceholder}>
              {item.thumbnailUrl ? (
                <Image source={{ uri: item.thumbnailUrl }} style={StyleSheet.absoluteFill} />
              ) : (
                <LinearGradient colors={['#F5F3FF', '#EDE9FE']} style={StyleSheet.absoluteFill} />
              )}
              <View style={styles.playIcon}><Play size={20} color="#FFF" fill="#FFF" /></View>
              <View style={styles.badge}><Text style={styles.badgeText}>{item.category || 'Reel'}</Text></View>
            </View>
            
            <View style={styles.cardInfo}>
              <Text style={styles.itemTitle}>{item.title}</Text>
              <View style={styles.statsRow}>
                <View style={styles.stat}>
                  <Eye size={14} color="#94A3B8" />
                  <Text style={styles.statText}>{item.views || 0}</Text>
                </View>
                <View style={styles.stat}>
                  <Text style={styles.statText}>❤️ {item.likes || 0}</Text>
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
  centerContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  header: { paddingTop: 80, paddingHorizontal: 24, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 },
  title: { fontSize: 28, fontWeight: '800', color: '#1E293B' },
  subtitle: { fontSize: 14, color: '#64748B', marginTop: 4 },
  addBtn: { width: 50, height: 50, borderRadius: 25, backgroundColor: '#8B5CF6', alignItems: 'center', justifyContent: 'center', shadowColor: '#8B5CF6', shadowOpacity: 0.3, shadowRadius: 10, elevation: 5 },
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
  actionBtn: { padding: 8, marginLeft: 8 },
  emptyContainer: { alignItems: 'center', padding: 100, justifyContent: 'center' },
  emptyTitle: { fontSize: 20, fontWeight: '800', color: '#1E293B', marginTop: 16 },
  emptySubtitle: { fontSize: 14, color: '#64748B', textAlign: 'center', marginTop: 8, lineHeight: 20 },
  addInitialBtn: { marginTop: 24, backgroundColor: '#F5F3FF', paddingHorizontal: 24, paddingVertical: 12, borderRadius: 14 },
  addInitialText: { color: '#8B5CF6', fontWeight: '800' }
});
