import React from 'react';
import {
  View, Text, ScrollView, StyleSheet, TextInput,
  TouchableOpacity, Image, Dimensions, StatusBar,
  RefreshControl, ActivityIndicator,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Search, Bell, ChevronRight, Zap, Star, CheckCircle, XCircle } from 'lucide-react-native';
import { useRouter } from 'expo-router';
import Animated, { FadeInUp, FadeInDown } from 'react-native-reanimated';
import { customerService } from '../../src/services/api';

const { width } = Dimensions.get('window');

// 8 pastel colors for the category grid (like Naukri)
const CATEGORY_PALETTES = [
  { bg: '#E8F5E9', icon: '#4CAF50' }, // green
  { bg: '#EDE7F6', icon: '#7C3AED' }, // purple
  { bg: '#E3F2FD', icon: '#1E88E5' }, // blue
  { bg: '#FFF3E0', icon: '#FB8C00' }, // orange
  { bg: '#FCE4EC', icon: '#E91E63' }, // pink
  { bg: '#F3E5F5', icon: '#AB47BC' }, // violet
  { bg: '#E0F7FA', icon: '#00ACC1' }, // cyan
  { bg: '#FFFDE7', icon: '#FDD835' }, // yellow
];

const DEFAULT_CATEGORIES = [
  { id: '1', title: 'Reels Edit', icon: '🎬', price: 199 },
  { id: '2', title: 'Wedding Film', icon: '💍', price: 999 },
  { id: '3', title: 'YouTube Edit', icon: '▶️', price: 499 },
  { id: '4', title: 'Short Film', icon: '🎞️', price: 799 },
  { id: '5', title: 'AI Cinematic', icon: '✨', price: 599 },
  { id: '6', title: 'Voice Over', icon: '🎙️', price: 299 },
  { id: '7', title: 'Color Grade', icon: '🎨', price: 349 },
  { id: '8', title: 'Thumbnail', icon: '🖼️', price: 149 },
];

export default function CustomerHome() {
  const router = useRouter();
  const [data, setData] = React.useState<any>(null);
  const [loading, setLoading] = React.useState(true);
  const [refreshing, setRefreshing] = React.useState(false);

  const fetchHomeData = async () => {
    try {
      const homeData = await customerService.getHomeData();
      setData(homeData);
    } catch (error) {
      console.error('Error fetching home data:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  React.useEffect(() => { fetchHomeData(); }, []);

  const onRefresh = () => { setRefreshing(true); fetchHomeData(); };

  const categories = data?.categories?.length ? data.categories : DEFAULT_CATEGORIES;

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#F8FAFC' }}>
        <ActivityIndicator size="large" color="#7C3AED" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#7C3AED" />
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#7C3AED" />}
      >
        {/* ── HEADER ── */}
        <LinearGradient colors={['#7C3AED', '#5B21B6']} style={styles.header}>
          <View style={styles.headerRow}>
            <View style={styles.headerLeft}>
              <View style={styles.avatarBg}>
                <Text style={styles.avatarText}>
                  {(data?.user?.name || 'C')[0].toUpperCase()}
                </Text>
              </View>
              <View>
                <Text style={styles.helloText}>Hello, {data?.user?.name?.split(' ')[0] || 'Creator'} 👋</Text>
                <Text style={styles.subText}>What are we editing today?</Text>
              </View>
            </View>
            <TouchableOpacity style={styles.bellBtn} onPress={() => router.push('/notifications')}>
              <Bell size={20} color="#FFF" />
              <View style={styles.bellDot} />
            </TouchableOpacity>
          </View>

          {/* Search */}
          <View style={styles.searchRow}>
            <View style={styles.searchBox}>
              <Search size={18} color="#94A3B8" />
              <TextInput
                placeholder="Search cinematic, reels, wedding..."
                placeholderTextColor="#94A3B8"
                style={styles.searchInput}
              />
            </View>
          </View>
        </LinearGradient>

        {/* ── ACTIVE ORDER PILL ── */}
        {data?.activeOrder && (
          <Animated.View entering={FadeInDown.delay(100)} style={styles.activeOrderWrap}>
            <TouchableOpacity onPress={() => router.push({ pathname: '/(customer)/tracking', params: { orderId: data.activeOrder.id } })}>
              <LinearGradient colors={['#7C3AED', '#4F46E5']} style={styles.activeOrderCard}>
                <View style={styles.pulseWrap}>
                  <Zap size={16} color="#7C3AED" fill="#7C3AED" />
                </View>
                <View style={{ flex: 1, marginLeft: 12 }}>
                  <Text style={styles.activeOrderLabel}>🔴 Live Order</Text>
                  <Text style={styles.activeOrderTitle}>{data.activeOrder.title} • {data.activeOrder.progress}% done</Text>
                </View>
                <ChevronRight size={20} color="#FFF" />
              </LinearGradient>
            </TouchableOpacity>
          </Animated.View>
        )}

        {/* ── CATEGORIES GRID ── */}
        <Animated.View entering={FadeInUp.delay(150)} style={styles.section}>
          <View style={styles.sectionRow}>
            <Text style={styles.sectionTitle}>Edit by Category</Text>
            <TouchableOpacity><Text style={styles.seeAll}>See all</Text></TouchableOpacity>
          </View>
          <View style={styles.grid}>
            {categories.slice(0, 8).map((item: any, index: number) => {
              const palette = CATEGORY_PALETTES[index % CATEGORY_PALETTES.length];
              return (
                <Animated.View key={item.id} entering={FadeInUp.delay(200 + index * 40)} style={styles.catCell}>
                  <TouchableOpacity
                    activeOpacity={0.85}
                    style={[styles.catCard, { backgroundColor: palette.bg }]}
                    onPress={() => router.push({
                      pathname: '/(customer)/rapid-studio',
                      params: { categoryId: item.id, categoryTitle: item.title, basePrice: item.price }
                    })}
                  >
                    <View style={[styles.catIconWrap, { backgroundColor: palette.bg }]}>
                      <Text style={styles.catEmoji}>{item.icon}</Text>
                    </View>
                    <Text style={[styles.catTitle, { color: '#1E293B' }]}>{item.title}</Text>
                    <Text style={[styles.catPrice, { color: palette.icon }]}>From ₹{item.price}</Text>
                  </TouchableOpacity>
                </Animated.View>
              );
            })}
          </View>
        </Animated.View>

        {/* ── PRO UPGRADE CARD (Like "Power up your job search") ── */}
        <Animated.View entering={FadeInUp.delay(400)} style={styles.section}>
          <LinearGradient
            colors={['#FFF8F0', '#FFF0D9']}
            style={styles.proCard}
          >
            {/* Decorative blob */}
            <View style={styles.proBlob} />

            <View style={styles.proTop}>
              <View style={{ flex: 1 }}>
                <Text style={styles.proTitle}>
                  <Text>Power up </Text>
                  <Text style={styles.proTitleBold}>your editing</Text>
                </Text>
              </View>
              <View style={styles.proBadge}>
                <Star size={12} color="#FFF" fill="#FFF" />
                <Text style={styles.proBadgeText}> PRO</Text>
              </View>
            </View>

            {/* Feature comparison table */}
            {[
              { label: 'Priority Editor Matching', free: false, pro: true },
              { label: 'AI-enhanced previews', free: false, pro: true },
              { label: 'Auto-approval & fast delivery', free: false, pro: true },
            ].map((feature, i) => (
              <View key={i} style={styles.featureRow}>
                <Text style={styles.featureLabel}>{feature.label}</Text>
                <View style={styles.featureCols}>
                  {feature.free
                    ? <CheckCircle size={18} color="#10B981" />
                    : <XCircle size={18} color="#CBD5E1" />
                  }
                  <View style={{ width: 32 }} />
                  {feature.pro
                    ? <CheckCircle size={18} color="#F59E0B" />
                    : <XCircle size={18} color="#CBD5E1" />
                  }
                </View>
              </View>
            ))}

            <TouchableOpacity
              style={styles.proBtn}
              onPress={() => router.push('/(customer)/membership')}
            >
              <LinearGradient colors={['#F59E0B', '#FB8C00']} style={styles.proBtnGrad}>
                <Text style={styles.proBtnText}>Become a Pro ✨</Text>
              </LinearGradient>
            </TouchableOpacity>
          </LinearGradient>
        </Animated.View>

        {/* ── BECOME EDITOR BANNER ── */}
        <Animated.View entering={FadeInUp.delay(500)} style={styles.section}>
          <TouchableOpacity onPress={() => router.push('/become-editor')}>
            <LinearGradient colors={['#0F172A', '#1E293B']} style={styles.editorBanner}>
              <View style={styles.editorBannerLeft}>
                <Text style={styles.editorTag}>💰 EARN MONEY</Text>
                <Text style={styles.editorTitle}>Become an Editor</Text>
                <Text style={styles.editorDesc}>Get paid for your creative skills. Join 500+ editors.</Text>
              </View>
              <View style={styles.editorArrow}>
                <ChevronRight size={22} color="#7C3AED" />
              </View>
            </LinearGradient>
          </TouchableOpacity>
        </Animated.View>

        <View style={{ height: 110 }} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8FAFC' },
  scrollContent: { paddingBottom: 20 },

  // HEADER
  header: {
    paddingTop: 55,
    paddingBottom: 28,
    paddingHorizontal: 20,
    borderBottomLeftRadius: 28,
    borderBottomRightRadius: 28,
  },
  headerRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 },
  headerLeft: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  avatarBg: {
    width: 46, height: 46, borderRadius: 14,
    backgroundColor: 'rgba(255,255,255,0.25)',
    alignItems: 'center', justifyContent: 'center',
  },
  avatarText: { fontSize: 20, fontWeight: '900', color: '#FFF' },
  helloText: { fontSize: 18, fontWeight: '900', color: '#FFF' },
  subText: { fontSize: 12, color: 'rgba(255,255,255,0.75)', marginTop: 2, fontWeight: '600' },
  bellBtn: {
    width: 44, height: 44, borderRadius: 13,
    backgroundColor: 'rgba(255,255,255,0.2)',
    alignItems: 'center', justifyContent: 'center',
  },
  bellDot: {
    position: 'absolute', top: 9, right: 9,
    width: 8, height: 8, borderRadius: 4,
    backgroundColor: '#F43F5E', borderWidth: 1.5, borderColor: '#7C3AED',
  },
  searchRow: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  searchBox: {
    flex: 1, flexDirection: 'row', alignItems: 'center',
    backgroundColor: '#FFF', borderRadius: 16,
    paddingHorizontal: 14, paddingVertical: 12, gap: 10,
    elevation: 2,
  },
  searchInput: { flex: 1, fontSize: 14, color: '#1E293B', fontWeight: '600' },

  // ACTIVE ORDER
  activeOrderWrap: { marginHorizontal: 20, marginTop: 16, marginBottom: 4 },
  activeOrderCard: {
    flexDirection: 'row', alignItems: 'center',
    borderRadius: 18, paddingHorizontal: 16, paddingVertical: 14,
    elevation: 4,
  },
  pulseWrap: {
    width: 34, height: 34, borderRadius: 10,
    backgroundColor: '#FFF', alignItems: 'center', justifyContent: 'center',
  },
  activeOrderLabel: { fontSize: 10, fontWeight: '900', color: 'rgba(255,255,255,0.8)', letterSpacing: 0.5 },
  activeOrderTitle: { fontSize: 14, fontWeight: '700', color: '#FFF', marginTop: 2 },

  // SECTION
  section: { marginTop: 24, paddingHorizontal: 20 },
  sectionRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 },
  sectionTitle: { fontSize: 17, fontWeight: '900', color: '#1E293B' },
  seeAll: { fontSize: 13, fontWeight: '700', color: '#7C3AED' },

  // CATEGORY GRID
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: 12,
  },
  catCell: { width: (width - 52) / 4 },
  catCard: {
    borderRadius: 16,
    padding: 10,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 90,
  },
  catIconWrap: {
    width: 42, height: 42, borderRadius: 13,
    alignItems: 'center', justifyContent: 'center',
    marginBottom: 6,
  },
  catEmoji: { fontSize: 22 },
  catTitle: { fontSize: 10, fontWeight: '800', textAlign: 'center', lineHeight: 13 },
  catPrice: { fontSize: 9, fontWeight: '700', marginTop: 3 },

  // PRO CARD
  proCard: {
    borderRadius: 24,
    padding: 20,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#FDDCAC',
  },
  proBlob: {
    position: 'absolute', right: -30, bottom: -30,
    width: 150, height: 150, borderRadius: 75,
    backgroundColor: 'rgba(251,140,0,0.08)',
  },
  proTop: { flexDirection: 'row', alignItems: 'center', marginBottom: 16 },
  proTitle: { fontSize: 18, fontWeight: '700', color: '#1E293B' },
  proTitleBold: { fontWeight: '900', color: '#1E293B' },
  proBadge: {
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: '#FB8C00', borderRadius: 8,
    paddingHorizontal: 10, paddingVertical: 5,
  },
  proBadgeText: { color: '#FFF', fontWeight: '900', fontSize: 12 },
  featureRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 8, borderBottomWidth: 1, borderColor: '#FDE68A' },
  featureLabel: { fontSize: 13, color: '#475569', fontWeight: '600', flex: 1 },
  featureCols: { flexDirection: 'row', alignItems: 'center', width: 80, justifyContent: 'flex-end' },
  proBtn: { marginTop: 18, borderRadius: 14, overflow: 'hidden', elevation: 4 },
  proBtnGrad: { paddingVertical: 14, alignItems: 'center', justifyContent: 'center' },
  proBtnText: { color: '#FFF', fontWeight: '900', fontSize: 15 },

  // EDITOR BANNER
  editorBanner: {
    borderRadius: 20, padding: 20,
    flexDirection: 'row', alignItems: 'center',
    borderWidth: 1, borderColor: 'rgba(124,58,237,0.3)',
  },
  editorBannerLeft: { flex: 1 },
  editorTag: { fontSize: 10, fontWeight: '900', color: '#7C3AED', letterSpacing: 1, marginBottom: 4 },
  editorTitle: { fontSize: 18, fontWeight: '900', color: '#FFF', marginBottom: 3 },
  editorDesc: { fontSize: 12, color: '#94A3B8', fontWeight: '500' },
  editorArrow: {
    width: 38, height: 38, borderRadius: 12,
    backgroundColor: 'rgba(124,58,237,0.15)',
    alignItems: 'center', justifyContent: 'center',
  },
});
