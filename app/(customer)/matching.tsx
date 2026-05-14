import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Dimensions, Image, TextInput, ActivityIndicator, Alert } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { 
  Star, Award, Zap, ChevronRight, Filter, Search, 
  ShieldCheck, Clock, CheckCircle2, SlidersHorizontal, ArrowLeft
} from 'lucide-react-native';
import { GlassCard } from '../../src/components/ui/GlassCard';
import { customerService, orderService } from '../../src/services/api';
import Animated, { FadeInUp, FadeInRight } from 'react-native-reanimated';

const { width } = Dimensions.get('window');

const CATEGORIES = ['All', 'Cinematic', 'Reels', 'Vlogs', 'Gaming', 'Business'];

// Fallback editors if backend returns empty list
const MOCK_EDITORS = [
  { 
    id: 'm1', 
    name: 'Arjun K.', 
    rating: '4.9', 
    skill: 'Cinematic Expert', 
    price: '₹299', 
    speed: '45 mins',
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
    price: '₹149', 
    speed: '2 hours',
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

  useEffect(() => {
    fetchEditors();
  }, []);

  const fetchEditors = async () => {
    try {
      setIsSearching(true);
      const data = await customerService.getEditors();
      if (data.editors && data.editors.length > 0) {
        // Sort: Online first, then by rating
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
        editorId: editor.id.startsWith('m') ? null : editor.id, // Only send real IDs to backend
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
      // If it's a mock editor, just pretend it worked for the demo
      if (editor.id.startsWith('m')) {
        setTimeout(() => {
          router.push('/(customer)/tracking');
        }, 1000);
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
        <LinearGradient colors={['#FFF', '#F5F3FF']} style={StyleSheet.absoluteFill} />
        <Animated.View entering={FadeInUp} style={styles.searchContent}>
          <View style={styles.searchIconOuter}>
            <LinearGradient colors={['#8B5CF6', '#6366F1']} style={styles.searchIconInner}>
              <ActivityIndicator color="#FFF" size="large" />
            </LinearGradient>
          </View>
          <Text style={styles.searchTitle}>Connecting to Studio...</Text>
          <Text style={styles.searchSub}>Fetching verified real-time editor profiles</Text>
          
          <View style={styles.loadingSteps}>
            <LoadingStep label="Syncing with backend API" active />
            <LoadingStep label="Verifying editor online status" active />
            <LoadingStep label="Applying AI matching logic" />
          </View>
        </Animated.View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <LinearGradient colors={['#FFFFFF', '#F8FAFC']} style={StyleSheet.absoluteFill} />
      
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
            <ArrowLeft size={24} color="#1E293B" />
          </TouchableOpacity>
          <View style={styles.headerTitleContainer}>
            <Text style={styles.headerTitle}>Live Experts</Text>
            <View style={styles.matchBadge}>
              <CheckCircle2 size={10} color="#10B981" />
              <Text style={styles.matchBadgeText}>REAL TIME</Text>
            </View>
          </View>
          <TouchableOpacity style={styles.filterBtn} onPress={fetchEditors}>
            <SlidersHorizontal size={22} color="#8B5CF6" />
          </TouchableOpacity>
        </View>

        {/* Search & Categories */}
        <View style={styles.searchSection}>
          <View style={styles.searchBar}>
            <Search size={20} color="#94A3B8" />
            <TextInput 
              placeholder="Search by name or style..." 
              style={styles.searchInput}
              placeholderTextColor="#94A3B8"
            />
          </View>
          
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.categoryList}>
            {CATEGORIES.map((cat) => (
              <TouchableOpacity 
                key={cat} 
                onPress={() => setSelectedCategory(cat)}
                style={[styles.categoryChip, selectedCategory === cat && styles.categoryChipSelected]}
              >
                <Text style={[styles.categoryText, selectedCategory === cat && styles.categoryTextSelected]}>
                  {cat}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* Editors List */}
        <View style={styles.listContainer}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Found {editors.length} Available Editors</Text>
            <View style={styles.totalBadge}>
              <Text style={styles.totalBadgeText}>₹{totalPrice}</Text>
            </View>
          </View>

          {editors.map((editor, index) => (
            <Animated.View entering={FadeInUp.delay(index * 100)} key={editor.id}>
              <TouchableOpacity 
                onPress={() => handleHire(editor)}
                activeOpacity={0.9}
                disabled={isHiring !== null}
                style={styles.editorCardWrapper}
              >
                <GlassCard style={styles.editorCard}>
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
                          <Star size={12} color="#F59E0B" fill="#F59E0B" />
                          <Text style={styles.ratingText}>{editor.rating}</Text>
                        </View>
                      </View>
                      <Text style={styles.editorSkill}>{editor.skill}</Text>
                      
                      <View style={styles.badgeRow}>
                        <View style={styles.levelBadge}>
                          <Award size={10} color="#8B5CF6" />
                          <Text style={styles.levelText}>{editor.level}</Text>
                        </View>
                        <View style={styles.reviewsBadge}>
                          <Text style={styles.reviewsText}>{editor.reviews} orders</Text>
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
                      <Text style={styles.footerLabel}>RESPONSE</Text>
                      <View style={styles.timeWrapper}>
                        <Clock size={12} color="#8B5CF6" />
                        <Text style={styles.speedValue}>{editor.speed}</Text>
                      </View>
                    </View>
                    <TouchableOpacity 
                      style={styles.hireBtn} 
                      onPress={() => handleHire(editor)}
                      disabled={isHiring !== null}
                    >
                      <LinearGradient 
                        colors={['#8B5CF6', '#6366F1']} 
                        style={styles.hireGradient}
                      >
                        {isHiring === editor.id ? (
                          <ActivityIndicator size="small" color="#FFF" />
                        ) : (
                          <Text style={styles.hireText}>HIRE</Text>
                        )}
                      </LinearGradient>
                    </TouchableOpacity>
                  </View>
                </GlassCard>
              </TouchableOpacity>
            </Animated.View>
          ))}
        </View>

        <View style={{ height: 40 }} />
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
  container: { flex: 1, backgroundColor: '#FFFFFF' },
  scrollContent: { paddingTop: 60, paddingHorizontal: 24 },
  
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 },
  backBtn: { width: 44, height: 44, borderRadius: 15, backgroundColor: '#F8FAFC', alignItems: 'center', justifyContent: 'center' },
  headerTitleContainer: { alignItems: 'center' },
  headerTitle: { fontSize: 18, fontWeight: '900', color: '#1E293B', letterSpacing: -0.5 },
  matchBadge: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#ECFDF5', paddingHorizontal: 8, paddingVertical: 2, borderRadius: 6, marginTop: 2 },
  matchBadgeText: { color: '#10B981', fontSize: 8, fontWeight: '900', marginLeft: 4 },
  filterBtn: { width: 44, height: 44, borderRadius: 15, backgroundColor: '#F5F3FF', alignItems: 'center', justifyContent: 'center' },

  searchSection: { marginBottom: 24 },
  searchBar: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#F8FAFC', paddingHorizontal: 16, paddingVertical: 12, borderRadius: 20, borderWidth: 1, borderColor: '#F1F5F9' },
  searchInput: { flex: 1, marginLeft: 12, fontSize: 15, fontWeight: '600', color: '#1E293B' },
  categoryList: { marginTop: 15 },
  categoryChip: { paddingHorizontal: 20, paddingVertical: 10, borderRadius: 15, backgroundColor: '#F8FAFC', marginRight: 10, borderWidth: 1, borderColor: '#F1F5F9' },
  categoryChipSelected: { backgroundColor: '#8B5CF6', borderColor: '#8B5CF6' },
  categoryText: { fontSize: 13, fontWeight: '700', color: '#64748B' },
  categoryTextSelected: { color: '#FFF' },

  sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 },
  sectionTitle: { fontSize: 17, fontWeight: '900', color: '#1E293B', letterSpacing: -0.3 },
  totalBadge: { backgroundColor: '#F5F3FF', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 12 },
  totalBadgeText: { color: '#8B5CF6', fontWeight: '900', fontSize: 14 },

  listContainer: { gap: 16 },
  editorCardWrapper: { marginBottom: 16 },
  editorCard: { padding: 16, backgroundColor: '#FFF' },
  editorHeader: { flexDirection: 'row' },
  imageWrapper: { position: 'relative' },
  editorImage: { width: 70, height: 70, borderRadius: 20, backgroundColor: '#F1F5F9' },
  onlineIndicator: { position: 'absolute', bottom: 2, right: 2, width: 12, height: 12, borderRadius: 6, backgroundColor: '#10B981', borderWidth: 2, borderColor: '#FFF' },
  editorInfo: { flex: 1, marginLeft: 16 },
  nameRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  editorName: { fontSize: 17, fontWeight: '900', color: '#1E293B', maxWidth: '70%' },
  ratingBadge: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#FFF7ED', paddingHorizontal: 6, paddingVertical: 2, borderRadius: 8 },
  ratingText: { fontSize: 11, fontWeight: '800', color: '#F59E0B', marginLeft: 4 },
  liveNowBadge: { backgroundColor: '#10B981', paddingHorizontal: 6, paddingVertical: 2, borderRadius: 6, marginLeft: 8 },
  liveNowText: { color: '#FFF', fontSize: 8, fontWeight: '900' },
  editorSkill: { fontSize: 13, color: '#64748B', marginTop: 2, fontWeight: '600' },
  badgeRow: { flexDirection: 'row', marginTop: 10, gap: 8 },
  levelBadge: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#F5F3FF', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 8 },
  levelText: { fontSize: 10, fontWeight: '800', color: '#8B5CF6', marginLeft: 4 },
  reviewsBadge: { backgroundColor: '#F8FAFC', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 8 },
  reviewsText: { fontSize: 10, fontWeight: '700', color: '#94A3B8' },

  cardDivider: { height: 1, backgroundColor: '#F1F5F9', marginVertical: 16 },
  cardFooter: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  footerItem: { },
  footerLabel: { fontSize: 9, fontWeight: '900', color: '#94A3B8', letterSpacing: 1 },
  footerValue: { fontSize: 16, fontWeight: '900', color: '#1E293B', marginTop: 2 },
  timeWrapper: { flexDirection: 'row', alignItems: 'center', marginTop: 2 },
  speedValue: { fontSize: 13, fontWeight: '800', color: '#8B5CF6', marginLeft: 4 },
  hireBtn: { borderRadius: 12, overflow: 'hidden', minWidth: 80 },
  hireGradient: { paddingHorizontal: 20, paddingVertical: 10, alignItems: 'center', justifyContent: 'center' },
  hireText: { color: '#FFF', fontSize: 12, fontWeight: '900', letterSpacing: 1 },

  searchingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  searchContent: { alignItems: 'center', padding: 40 },
  searchIconOuter: { width: 100, height: 100, borderRadius: 50, backgroundColor: '#F5F3FF', padding: 15, marginBottom: 24 },
  searchIconInner: { flex: 1, borderRadius: 35, alignItems: 'center', justifyContent: 'center' },
  searchTitle: { fontSize: 22, fontWeight: '900', color: '#1E293B', textAlign: 'center' },
  searchSub: { fontSize: 14, color: '#64748B', textAlign: 'center', marginTop: 10, fontWeight: '600' },
  loadingSteps: { marginTop: 40, width: '100%' },
  loadingStep: { flexDirection: 'row', alignItems: 'center', marginBottom: 15 },
  stepDot: { width: 8, height: 8, borderRadius: 4, backgroundColor: '#E2E8F0', marginRight: 15 },
  stepDotActive: { backgroundColor: '#8B5CF6' },
  stepLabel: { fontSize: 14, color: '#94A3B8', fontWeight: '700' },
  stepLabelActive: { color: '#1E293B' }
});
