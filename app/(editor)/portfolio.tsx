import React, { useState, useEffect } from 'react';
import {
  View, Text, StyleSheet, FlatList, TouchableOpacity,
  Image, ActivityIndicator, StatusBar, Alert,
} from 'react-native';
import { Plus, Play, Trash2, Edit3, Eye, AlertCircle, Heart, Film, ArrowLeft } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { authService } from '../../src/services/api';
import Animated, { FadeInUp } from 'react-native-reanimated';
import { useRouter } from 'expo-router';

const CAT_COLORS = ['#EDE7F6', '#E3F2FD', '#E8F5E9', '#FFF3E0'];

export default function PortfolioScreen() {
  const router = useRouter();
  const [portfolio, setPortfolio] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => { fetchPortfolio(); }, []);

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
        <ActivityIndicator size="large" color="#4F46E5" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#4F46E5" />

      {/* Header */}
      <LinearGradient colors={['#4F46E5', '#7C3AED']} style={styles.header}>
        <View style={styles.headerRow}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
            <ArrowLeft size={22} color="#FFF" />
          </TouchableOpacity>
          <View style={styles.headerCenter}>
            <Text style={styles.title}>Showcase</Text>
            <Text style={styles.subtitle}>Your best work on display</Text>
          </View>
          <TouchableOpacity style={styles.addBtn}>
            <Plus size={20} color="#4F46E5" />
          </TouchableOpacity>
        </View>
      </LinearGradient>

      <FlatList
        data={portfolio}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <View style={styles.emptyIconCircle}>
              <Film size={36} color="#4F46E5" />
            </View>
            <Text style={styles.emptyTitle}>Empty Showcase</Text>
            <Text style={styles.emptySubtitle}>Upload your past edits or reels here to stand out to premium clients.</Text>
            <TouchableOpacity style={styles.addInitialBtn}>
              <Text style={styles.addInitialText}>Upload Now</Text>
            </TouchableOpacity>
          </View>
        }
        renderItem={({ item, index }) => {
          const pastBg = CAT_COLORS[index % CAT_COLORS.length];
          return (
            <Animated.View entering={FadeInUp.delay(index * 60)} style={styles.card}>
              <View style={styles.imageWrap}>
                {item.thumbnailUrl ? (
                  <Image source={{ uri: item.thumbnailUrl }} style={StyleSheet.absoluteFill} />
                ) : (
                  <LinearGradient colors={['#EDE7F6', '#E8F5E9']} style={StyleSheet.absoluteFill} />
                )}
                <View style={styles.playOverlay}>
                  <View style={styles.playCircle}>
                    <Play size={20} color="#4F46E5" fill="#4F46E5" />
                  </View>
                </View>
                <View style={[styles.badge, { backgroundColor: pastBg }]}>
                  <Text style={styles.badgeText}>{item.category || 'REEL'}</Text>
                </View>
              </View>

              <View style={styles.cardInfo}>
                <Text style={styles.itemTitle}>{item.title}</Text>
                <View style={styles.statsRow}>
                  <View style={styles.statItem}>
                    <Eye size={13} color="#94A3B8" />
                    <Text style={styles.statVal}>{item.views || 0}</Text>
                  </View>
                  <View style={styles.statItem}>
                    <Heart size={13} color="#EF4444" fill="#EF4444" />
                    <Text style={styles.statVal}>{item.likes || 0}</Text>
                  </View>
                </View>
              </View>

              <View style={styles.cardActions}>
                <TouchableOpacity style={[styles.actionBtn, { backgroundColor: '#F1F5F9' }]}>
                  <Edit3 size={16} color="#64748B" />
                  <Text style={styles.actionBtnText}>Edit</Text>
                </TouchableOpacity>
                <TouchableOpacity style={[styles.actionBtn, { backgroundColor: '#FEF2F2' }]}>
                  <Trash2 size={16} color="#EF4444" />
                  <Text style={[styles.actionBtnText, { color: '#EF4444' }]}>Delete</Text>
                </TouchableOpacity>
              </View>
            </Animated.View>
          );
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8FAFC' },
  centerContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#F8FAFC' },

  header: { paddingTop: 58, paddingHorizontal: 20, paddingBottom: 24, borderBottomLeftRadius: 28, borderBottomRightRadius: 28 },
  headerRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  backBtn: { width: 38, height: 38, borderRadius: 12, backgroundColor: 'rgba(255,255,255,0.2)', alignItems: 'center', justifyContent: 'center' },
  headerCenter: { alignItems: 'center' },
  title: { fontSize: 20, fontWeight: '900', color: '#FFF' },
  subtitle: { fontSize: 12, color: 'rgba(255,255,255,0.8)', fontWeight: '600', marginTop: 2 },
  addBtn: { width: 38, height: 38, borderRadius: 12, backgroundColor: '#FFF', alignItems: 'center', justifyContent: 'center' },

  list: { padding: 20, paddingBottom: 60 },
  card: {
    backgroundColor: '#FFF', borderRadius: 24, overflow: 'hidden', marginBottom: 20,
    elevation: 2, shadowColor: '#4F46E5', shadowOpacity: 0.05, shadowRadius: 10,
  },
  imageWrap: { height: 180, width: '100%', position: 'relative' },
  playOverlay: { ...StyleSheet.absoluteFillObject, backgroundColor: 'rgba(0,0,0,0.25)', alignItems: 'center', justifyContent: 'center' },
  playCircle: { width: 52, height: 52, borderRadius: 26, backgroundColor: '#FFF', alignItems: 'center', justifyContent: 'center', elevation: 4 },
  badge: { position: 'absolute', top: 12, right: 12, paddingHorizontal: 12, paddingVertical: 5, borderRadius: 10 },
  badgeText: { fontSize: 10, fontWeight: '900', color: '#1E293B', letterSpacing: 0.5 },

  cardInfo: { padding: 16 },
  itemTitle: { fontSize: 16, fontWeight: '800', color: '#1E293B' },
  statsRow: { flexDirection: 'row', alignItems: 'center', marginTop: 10, gap: 14 },
  statItem: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  statVal: { fontSize: 12, color: '#64748B', fontWeight: '800' },

  cardActions: { flexDirection: 'row', paddingHorizontal: 16, paddingBottom: 16, gap: 10 },
  actionBtn: { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', paddingVertical: 10, borderRadius: 12, gap: 6 },
  actionBtnText: { fontSize: 12, fontWeight: '800', color: '#64748B' },

  emptyContainer: { alignItems: 'center', justifyContent: 'center', paddingTop: 80, paddingHorizontal: 20 },
  emptyIconCircle: { width: 80, height: 80, borderRadius: 40, backgroundColor: '#EDE7F6', alignItems: 'center', justifyContent: 'center', marginBottom: 16 },
  emptyTitle: { fontSize: 20, fontWeight: '900', color: '#1E293B' },
  emptySubtitle: { fontSize: 13, color: '#94A3B8', textAlign: 'center', marginTop: 8, lineHeight: 20, fontWeight: '600' },
  addInitialBtn: { marginTop: 24, backgroundColor: '#EDE7F6', paddingHorizontal: 24, paddingVertical: 14, borderRadius: 14 },
  addInitialText: { color: '#4F46E5', fontWeight: '900', fontSize: 13 },
});
