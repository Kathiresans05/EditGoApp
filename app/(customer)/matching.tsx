import React, { useState, useEffect } from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity,
  Dimensions, Image, TextInput, ActivityIndicator, Alert, StatusBar,
} from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { Star, Award, Zap, Clock, CheckCircle2, Search, SlidersHorizontal, ArrowLeft } from 'lucide-react-native';
import { customerService, orderService } from '../../src/services/api';
import Animated, { FadeInUp } from 'react-native-reanimated';

const { width } = Dimensions.get('window');

const CATEGORIES = ['All', 'Cinematic', 'Reels', 'Vlogs', 'Gaming', 'Business'];
const CATEGORY_COLORS = ['#EDE7F6', '#E3F2FD', '#E8F5E9', '#FFF3E0', '#FCE4EC', '#E0F7FA'];

const MOCK_EDITORS = [
  {
    id: 'm1',
    name: 'Arjun K.',
    rating: '4.9',
    skill: 'Cinematic Expert',
    price: '₹49 Base',
    speed: '45m Rapid',
    reviews: '124',
    level: 'MASTER',
    isOnline: true,
    image: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=400&h=400&fit=crop'
  },
  {
    id: 'm2',
    name: 'Sana R.',
    rating: '4.8',
    skill: 'Viral Reels',
    price: '₹49 Base',
    speed: '2h Express',
    reviews: '89',
    level: 'PRO',
    isOnline: true,
    image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&h=400&fit=crop'
  }
];

export default function MatchingScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const totalPrice = params.totalPrice || '0';

  const [selectedCategory, setSelectedCategory] = useState('All');
  const [isSearching, setIsSearching] = useState(true);
  const [isHiring, setIsHiring] = useState<string | null>(null);
  const [editors, setEditors] = useState<any[]>([]);

  useEffect(() => { fetchEditors(); }, []);

  const fetchEditors = async () => {
    try {
      setIsSearching(true);
      const data = await customerService.getEditors();
      if (data.editors && data.editors.length > 0) {
        const sorted = data.editors.sort((a: any, b: any) => {
          if (a.isOnline === b.isOnline) return parseFloat(b.rating) - parseFloat(a.rating);
          return a.isOnline ? -1 : 1;
        });
        setEditors(sorted);
      } else {
        setEditors(MOCK_EDITORS);
      }
    } catch (err: any) {
      console.error('[Matching] Fetch Error:', err);
      setEditors(MOCK_EDITORS);
    } finally {
      setIsSearching(false);
    }
  };

  const handleHire = async (editor: any) => {
    try {
      setIsHiring(editor.id);

      const orderData = {
        title: `Edit for ${selectedCategory === 'All' ? 'Creator' : selectedCategory}`,
        category: selectedCategory === 'All' ? 'Cinematic' : selectedCategory,
        price: totalPrice,
        editorId: editor.id.startsWith('m') ? null : editor.id,
        deliverySpeed: params.deliverySpeed,
        initialETAMins: params.initialETAMins,
      };

      console.log('[Matching] Hiring editor:', orderData);
      const response = await orderService.createOrder(orderData);

      if (response.success) {
        router.push({
          pathname: '/(customer)/tracking',
          params: { orderId: response.order.id }
        });
      } else {
        Alert.alert('Error', response.message || 'Failed to hire editor');
      }
    } catch (err: any) {
      console.error('[Matching] Hire Error:', err);
      if (editor.id.startsWith('m')) {
        setTimeout(() => { router.push('/(customer)/tracking'); }, 1000);
      } else {
        Alert.alert('Connection Error', 'Please check your internet and try again.');
      }
    } finally {
      setIsHiring(null);
    }
  };

  if (isSearching) {
    return (
      <View style={styles.searchingContainer}>
        <StatusBar barStyle="light-content" backgroundColor="#7C3AED" />
        <LinearGradient colors={['#7C3AED', '#5B21B6']} style={StyleSheet.absoluteFill} />
        <Animated.View entering={FadeInUp} style={styles.searchContent}>
          <View style={styles.searchIconOuter}>
            <ActivityIndicator color="#7C3AED" size="large" />
          </View>
          <Text style={styles.searchTitle}>Connecting to Studio...</Text>
          <Text style={styles.searchSub}>Fetching verified real-time editor profiles</Text>

          <View style={styles.loadingSteps}>
            <LoadingStep label="Syncing with backend API" active />
            <LoadingStep label="Verifying editor online status" active />
            <LoadingStep label="Applying AI matching logic" active />
          </View>
        </Animated.View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#7C3AED" />

      {/* Header */}
      <LinearGradient colors={['#7C3AED', '#5B21B6']} style={styles.header}>
        <View style={styles.headerRow}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
            <ArrowLeft size={22} color="#FFF" />
          </TouchableOpacity>
          <View style={styles.headerCenter}>
            <Text style={styles.headerTitle}>Live Experts</Text>
            <View style={styles.matchBadge}>
              <CheckCircle2 size={10} color="#10B981" />
              <Text style={styles.matchBadgeText}>REAL TIME</Text>
            </View>
          </View>
          <TouchableOpacity style={styles.filterBtn} onPress={fetchEditors}>
            <SlidersHorizontal size={20} color="#FFF" />
          </TouchableOpacity>
        </View>

        {/* Search */}
        <View style={styles.searchBar}>
          <Search size={18} color="#94A3B8" />
          <TextInput
            placeholder="Search by name or style..."
            style={styles.searchInput}
            placeholderTextColor="#94A3B8"
          />
        </View>
      </LinearGradient>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scroll}>

        {/* Categories scroll */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.categoryList}>
          {CATEGORIES.map((cat, i) => {
            const isSel = selectedCategory === cat;
            const pastBg = CATEGORY_COLORS[i % CATEGORY_COLORS.length];
            return (
              <TouchableOpacity
                key={cat}
                onPress={() => setSelectedCategory(cat)}
                style={[styles.categoryChip, isSel ? { backgroundColor: '#7C3AED' } : { backgroundColor: pastBg }]}
              >
                <Text style={[styles.categoryText, isSel ? { color: '#FFF' } : { color: '#1E293B' }]}>
                  {cat}
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>

        {/* List Title */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Available Editors ({editors.length})</Text>
          <View style={styles.totalBadge}>
            <Text style={styles.totalBadgeText}>₹{totalPrice}</Text>
          </View>
        </View>

        {/* Editors Grid */}
        <View style={styles.listContainer}>
          {editors.map((editor, index) => {
            const pastBg = CATEGORY_COLORS[index % CATEGORY_COLORS.length];
            return (
              <Animated.View entering={FadeInUp.delay(index * 80)} key={editor.id} style={styles.editorCard}>
                <View style={styles.editorHeader}>
                  <View style={styles.imageWrapper}>
                    <Image source={{ uri: editor.image }} style={styles.editorImage} />
                    {editor.isOnline && <View style={styles.onlineIndicator} />}
                  </View>

                  <View style={styles.editorInfo}>
                    <View style={styles.nameRow}>
                      <View style={{ flexDirection: 'row', alignItems: 'center', flex: 1 }}>
                        <Text style={styles.editorName} numberOfLines={1}>{editor.name}</Text>
                        {editor.isOnline && (
                          <View style={styles.liveNowBadge}>
                            <Text style={styles.liveNowText}>LIVE</Text>
                          </View>
                        )}
                      </View>
                      <View style={styles.ratingBadge}>
                        <Star size={11} color="#F59E0B" fill="#F59E0B" />
                        <Text style={styles.ratingText}>{editor.rating}</Text>
                      </View>
                    </View>

                    <Text style={styles.editorSkill}>{editor.skill}</Text>

                    <View style={styles.badgeRow}>
                      <View style={[styles.levelBadge, { backgroundColor: pastBg }]}>
                        <Award size={11} color="#7C3AED" />
                        <Text style={styles.levelText}>{editor.level}</Text>
                      </View>
                      <View style={styles.reviewsBadge}>
                        <Text style={styles.reviewsText}>{editor.reviews} edits</Text>
                      </View>
                    </View>
                  </View>
                </View>

                <View style={styles.cardDivider} />

                <View style={styles.cardFooter}>
                  <View style={styles.footerItem}>
                    <Text style={styles.footerLabel}>BASE PRICE</Text>
                    <Text style={styles.footerValue}>{editor.price}</Text>
                  </View>
                  <View style={styles.footerItem}>
                    <Text style={styles.footerLabel}>SPEED</Text>
                    <View style={styles.timeWrapper}>
                      <Clock size={12} color="#7C3AED" />
                      <Text style={styles.speedValue}>{editor.speed}</Text>
                    </View>
                  </View>

                  <TouchableOpacity
                    style={styles.hireBtn}
                    onPress={() => handleHire(editor)}
                    disabled={isHiring !== null}
                  >
                    <LinearGradient colors={['#7C3AED', '#5B21B6']} style={styles.hireGradient}>
                      {isHiring === editor.id ? (
                        <ActivityIndicator size="small" color="#FFF" />
                      ) : (
                        <Text style={styles.hireText}>HIRE</Text>
                      )}
                    </LinearGradient>
                  </TouchableOpacity>
                </View>
              </Animated.View>
            );
          })}
        </View>

        <View style={{ height: 50 }} />
      </ScrollView>
    </View>
  );
}

function LoadingStep({ label, active }: any) {
  return (
    <View style={styles.loadingStep}>
      <View style={[styles.stepDot, active && styles.stepDotActive]} />
      <Text style={[styles.stepLabel, active && styles.stepLabelActive]}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8FAFC' },
  scroll: { paddingBottom: 40 },

  header: { paddingTop: 58, paddingHorizontal: 20, paddingBottom: 24, borderBottomLeftRadius: 28, borderBottomRightRadius: 28 },
  headerRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 18 },
  backBtn: { width: 38, height: 38, borderRadius: 12, backgroundColor: 'rgba(255,255,255,0.2)', alignItems: 'center', justifyContent: 'center' },
  headerCenter: { alignItems: 'center' },
  headerTitle: { fontSize: 18, fontWeight: '900', color: '#FFF' },
  matchBadge: { flexDirection: 'row', alignItems: 'center', backgroundColor: 'rgba(255,255,255,0.2)', paddingHorizontal: 8, paddingVertical: 2, borderRadius: 6, marginTop: 4, gap: 4 },
  matchBadgeText: { color: '#FFF', fontSize: 8, fontWeight: '900' },
  filterBtn: { width: 38, height: 38, borderRadius: 12, backgroundColor: 'rgba(255,255,255,0.2)', alignItems: 'center', justifyContent: 'center' },

  searchBar: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#FFF', paddingHorizontal: 14, paddingVertical: 12, borderRadius: 16, gap: 10 },
  searchInput: { flex: 1, fontSize: 14, fontWeight: '600', color: '#1E293B' },

  categoryList: { marginTop: 18, paddingLeft: 20, paddingRight: 4, flexGrow: 0, height: 42, marginBottom: 10 },
  categoryChip: { paddingHorizontal: 16, height: 36, borderRadius: 12, marginRight: 8, justifyContent: 'center' },
  categoryText: { fontSize: 12, fontWeight: '800' },

  sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 20, marginTop: 12, marginBottom: 16 },
  sectionTitle: { fontSize: 16, fontWeight: '900', color: '#1E293B' },
  totalBadge: { backgroundColor: '#EDE7F6', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 10 },
  totalBadgeText: { color: '#7C3AED', fontWeight: '900', fontSize: 13 },

  listContainer: { gap: 12, paddingHorizontal: 20 },
  editorCard: { backgroundColor: '#FFF', borderRadius: 24, padding: 16, elevation: 1, shadowColor: '#7C3AED', shadowOpacity: 0.04, shadowRadius: 6 },
  editorHeader: { flexDirection: 'row' },
  imageWrapper: { position: 'relative' },
  editorImage: { width: 68, height: 68, borderRadius: 18, backgroundColor: '#F1F5F9' },
  onlineIndicator: { position: 'absolute', bottom: 0, right: 0, width: 12, height: 12, borderRadius: 6, backgroundColor: '#10B981', borderWidth: 2, borderColor: '#FFF' },
  editorInfo: { flex: 1, marginLeft: 14 },
  nameRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  editorName: { fontSize: 16, fontWeight: '900', color: '#1E293B', maxWidth: '65%' },
  ratingBadge: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#FFF7ED', paddingHorizontal: 6, paddingVertical: 2, borderRadius: 8, gap: 3 },
  ratingText: { fontSize: 11, fontWeight: '800', color: '#F59E0B' },
  liveNowBadge: { backgroundColor: '#10B981', paddingHorizontal: 6, paddingVertical: 2, borderRadius: 6, marginLeft: 6 },
  liveNowText: { color: '#FFF', fontSize: 8, fontWeight: '900' },
  editorSkill: { fontSize: 12, color: '#64748B', marginTop: 2, fontWeight: '600' },
  badgeRow: { flexDirection: 'row', marginTop: 8, gap: 8 },
  levelBadge: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 8, gap: 4 },
  levelText: { fontSize: 9, fontWeight: '900', color: '#7C3AED' },
  reviewsBadge: { backgroundColor: '#F8FAFC', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 8 },
  reviewsText: { fontSize: 9, fontWeight: '800', color: '#94A3B8' },

  cardDivider: { height: 1, backgroundColor: '#F1F5F9', marginVertical: 14 },
  cardFooter: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  footerItem: {},
  footerLabel: { fontSize: 9, fontWeight: '900', color: '#94A3B8', letterSpacing: 0.5 },
  footerValue: { fontSize: 15, fontWeight: '900', color: '#1E293B', marginTop: 2 },
  timeWrapper: { flexDirection: 'row', alignItems: 'center', marginTop: 2, gap: 3 },
  speedValue: { fontSize: 12, fontWeight: '800', color: '#7C3AED' },
  hireBtn: { borderRadius: 12, overflow: 'hidden' },
  hireGradient: { paddingHorizontal: 18, paddingVertical: 10, alignItems: 'center', justifyContent: 'center' },
  hireText: { color: '#FFF', fontSize: 11, fontWeight: '900', letterSpacing: 0.5 },

  searchingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  searchContent: { alignItems: 'center', padding: 32 },
  searchIconOuter: { width: 72, height: 72, borderRadius: 36, backgroundColor: '#FFF', alignItems: 'center', justifyContent: 'center', marginBottom: 20 },
  searchTitle: { fontSize: 22, fontWeight: '900', color: '#FFF', textAlign: 'center' },
  searchSub: { fontSize: 14, color: 'rgba(255,255,255,0.8)', textAlign: 'center', marginTop: 8, fontWeight: '600' },
  loadingSteps: { marginTop: 32, width: '100%', gap: 10 },
  loadingStep: { flexDirection: 'row', alignItems: 'center' },
  stepDot: { width: 8, height: 8, borderRadius: 4, backgroundColor: 'rgba(255,255,255,0.3)', marginRight: 12 },
  stepDotActive: { backgroundColor: '#4ADE80' },
  stepLabel: { fontSize: 13, color: 'rgba(255,255,255,0.6)', fontWeight: '700' },
  stepLabelActive: { color: '#FFF' }
});
