import React from 'react';
import { View, Text, ScrollView, StyleSheet, TextInput, TouchableOpacity, Image, Dimensions } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Search, Bell, Star, TrendingUp, Zap, Sparkles, ChevronRight, LayoutGrid, Crown } from 'lucide-react-native';
import { GlassCard } from '../../src/components/ui/GlassCard';
import { useRouter } from 'expo-router';
import Animated, { FadeInUp, FadeInRight } from 'react-native-reanimated';

const { width } = Dimensions.get('window');

const CATEGORIES = [
  { id: '1', title: 'Insta Reels', icon: '📱', price: '79', trend: true },
  { id: '2', title: 'YT Shorts', icon: '🎥', price: '149' },
  { id: '3', title: 'Cinematic', icon: '🎬', price: '299', trend: true },
  { id: '4', title: 'Thumbnails', icon: '🖼️', price: '79' },
  { id: '5', title: 'AI Style', icon: '🤖', price: '199' },
  { id: '6', title: 'Slow Motion', icon: '❄️', price: '129' },
];

export default function CustomerHome() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        
        {/* 1. Premium Header with Gradient Background */}
        <LinearGradient 
          colors={['#8B5CF6', '#6366F1']} 
          start={{x: 0, y: 0}} 
          end={{x: 1, y: 0}} 
          style={styles.headerWrapper}
        >
          <View style={styles.header}>
            <View style={styles.headerLeft}>
              <View style={styles.logoBg}>
                <Image 
                  source={require('../../assets/editgo_logo.png')} 
                  style={styles.homeLogo} 
                  resizeMode="contain"
                />
              </View>
              <View>
                <Text style={styles.greeting}>Hey, Arjun! ✨</Text>
                <Text style={styles.subGreeting}>Level: Pro Creator</Text>
              </View>
            </View>
            <TouchableOpacity style={styles.iconButtonHeader}>
              <Bell size={20} color="#FFF" />
              <View style={styles.dotHeader} />
            </TouchableOpacity>
          </View>
        </LinearGradient>

        {/* 2. Search Bar (Floating over header) */}
        <View style={styles.searchSection}>

          <GlassCard style={styles.searchCard}>
            <Search size={20} color="#94A3B8" />
            <TextInput 
              placeholder="Search cinematic, AI, vlog edits..." 
              style={styles.searchInput}
              placeholderTextColor="#94A3B8"
            />
          </GlassCard>
        </View>

        {/* 3. Active Order (Floating Action) */}
        <Animated.View entering={FadeInUp.delay(100)} style={styles.activeOrderContainer}>
          <TouchableOpacity onPress={() => router.push('/(customer)/tracking')}>
            <LinearGradient colors={['#8B5CF6', '#3B82F6']} start={{x:0, y:0}} end={{x:1, y:0}} style={styles.activeOrderCard}>
              <View style={styles.orderLeft}>
                <View style={styles.pulseContainer}>
                  <Zap size={18} color="#8B5CF6" fill="#8B5CF6" />
                </View>
                <View style={styles.orderInfo}>
                  <Text style={styles.orderStatus}>EDITING IN PROGRESS (35%)</Text>
                  <Text style={styles.orderName}>Cinematic Reel • 12 mins left</Text>
                </View>
              </View>
              <ChevronRight size={20} color="#FFF" />
            </LinearGradient>
          </TouchableOpacity>
        </Animated.View>

        {/* 4. Quick Access (AI Studio & Membership) */}
        <View style={styles.quickAccessRow}>
          <TouchableOpacity style={styles.quickCard} onPress={() => router.push('/(customer)/ai-studio')}>
            <LinearGradient colors={['#F5F3FF', '#EDE9FE']} style={styles.quickGradient}>
              <Sparkles size={20} color="#8B5CF6" />
              <Text style={styles.quickText}>AI Studio</Text>
            </LinearGradient>
          </TouchableOpacity>
          <TouchableOpacity style={styles.quickCard} onPress={() => router.push('/(customer)/membership')}>
            <LinearGradient colors={['#FFF7ED', '#FFEDD5']} style={styles.quickGradient}>
              <Crown size={20} color="#F59E0B" />
              <Text style={styles.quickText}>Upgrade</Text>
            </LinearGradient>
          </TouchableOpacity>
          <TouchableOpacity style={styles.quickCard}>
            <LinearGradient colors={['#F0FDF4', '#DCFCE7']} style={styles.quickGradient}>
              <TrendingUp size={20} color="#10B981" />
              <Text style={styles.quickText}>Rewards</Text>
            </LinearGradient>
          </TouchableOpacity>
        </View>

        {/* 5. Featured Banner */}
        <Animated.View entering={FadeInUp.delay(200)} style={styles.bannerContainer}>
          <LinearGradient colors={['#8B5CF6', '#EC4899']} style={styles.banner}>
            <View style={styles.bannerLeft}>
              <Text style={styles.bannerTitle}>AI Cinematic Pro</Text>
              <Text style={styles.bannerDesc}>Convert reels to 4K cinematic movies instantly.</Text>
              <TouchableOpacity style={styles.bannerBtn}>
                <Text style={styles.bannerBtnText}>Try Now</Text>
              </TouchableOpacity>
            </View>
            <Sparkles size={60} color="rgba(255,255,255,0.2)" />
          </LinearGradient>
        </Animated.View>

        {/* 6. Partner Banner (Join as Editor) */}
        <Animated.View entering={FadeInUp.delay(250)} style={styles.partnerBannerContainer}>
          <TouchableOpacity onPress={() => router.push('/become-editor')}>
            <LinearGradient colors={['#0F172A', '#1E293B']} style={styles.partnerBanner}>
              <View style={styles.partnerInfo}>
                <Text style={styles.partnerTag}>EARN MONEY</Text>
                <Text style={styles.partnerTitle}>Become an Editor</Text>
                <Text style={styles.partnerDesc}>Join our team and get paid for your creative skills.</Text>
              </View>
              <ChevronRight size={24} color="#8B5CF6" />
            </LinearGradient>
          </TouchableOpacity>
        </Animated.View>

        {/* 7. Categories */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Edit Categories</Text>
          <TouchableOpacity><Text style={styles.seeAll}>See All</Text></TouchableOpacity>
        </View>
        <View style={styles.categoriesGrid}>
          {CATEGORIES.map((item, index) => (
            <Animated.View key={item.id} entering={FadeInUp.delay(300 + index * 50)} style={styles.catWrapper}>
              <TouchableOpacity onPress={() => router.push('/(customer)/upload')} activeOpacity={0.9}>
                <GlassCard style={styles.catCard}>
                  <View style={styles.catIconBox}><Text style={styles.catIcon}>{item.icon}</Text></View>
                  <Text style={styles.catTitle}>{item.title}</Text>
                  <Text style={styles.catPrice}>From ₹{item.price}</Text>
                </GlassCard>
              </TouchableOpacity>
            </Animated.View>
          ))}
        </View>

        <View style={{ height: 120 }} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8FAFC' },
  scrollContent: { paddingTop: 0 },
  headerWrapper: { 
    paddingTop: 60, 
    paddingBottom: 40, 
    borderBottomLeftRadius: 32, 
    borderBottomRightRadius: 32,
    marginBottom: -25, // Overlap with search
  },
  header: { 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    alignItems: 'center', 
    paddingHorizontal: 24 
  },
  headerLeft: { flexDirection: 'row', alignItems: 'center' },
  logoBg: { 
    width: 50, 
    height: 50, 
    borderRadius: 15, 
    backgroundColor: 'rgba(255,255,255,0.2)', 
    alignItems: 'center', 
    justifyContent: 'center', 
    marginRight: 12 
  },
  homeLogo: { width: 35, height: 35 },
  greeting: { fontSize: 20, fontWeight: '900', color: '#FFF' },
  subGreeting: { fontSize: 12, color: 'rgba(255,255,255,0.8)', fontWeight: '700', marginTop: 2 },
  iconButtonHeader: { 
    width: 44, 
    height: 44, 
    borderRadius: 12, 
    backgroundColor: 'rgba(255,255,255,0.2)', 
    alignItems: 'center', 
    justifyContent: 'center' 
  },
  dotHeader: { 
    position: 'absolute', 
    top: 10, 
    right: 10, 
    width: 8, 
    height: 8, 
    borderRadius: 4, 
    backgroundColor: '#EF4444', 
    borderWidth: 2, 
    borderColor: '#8B5CF6' 
  },
  searchSection: { paddingHorizontal: 24, marginBottom: 20, zIndex: 10 },
  searchCard: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, paddingVertical: 14, backgroundColor: '#FFF', borderRadius: 20 },
  searchInput: { flex: 1, marginLeft: 12, fontSize: 15, color: '#1E293B' },
  activeOrderContainer: { paddingHorizontal: 24, marginBottom: 20 },
  activeOrderCard: { padding: 16, borderRadius: 24, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', elevation: 4 },
  orderLeft: { flexDirection: 'row', alignItems: 'center' },
  pulseContainer: { width: 36, height: 36, borderRadius: 18, backgroundColor: '#FFF', alignItems: 'center', justifyContent: 'center' },
  orderInfo: { marginLeft: 12 },
  orderStatus: { fontSize: 9, fontWeight: '900', color: 'rgba(255,255,255,0.8)' },
  orderName: { fontSize: 14, fontWeight: '700', color: '#FFF', marginTop: 2 },
  quickAccessRow: { flexDirection: 'row', paddingHorizontal: 24, justifyContent: 'space-between', marginBottom: 24 },
  quickCard: { width: '30%', borderRadius: 20, overflow: 'hidden' },
  quickGradient: { padding: 12, alignItems: 'center', justifyContent: 'center' },
  quickText: { fontSize: 11, fontWeight: '800', color: '#1E293B', marginTop: 8 },
  bannerContainer: { paddingHorizontal: 24, marginBottom: 32 },
  banner: { borderRadius: 32, padding: 24, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  bannerLeft: { flex: 1 },
  bannerTitle: { fontSize: 20, fontWeight: '900', color: '#FFF', marginBottom: 4 },
  bannerDesc: { fontSize: 12, color: 'rgba(255,255,255,0.8)', marginBottom: 16 },
  bannerBtn: { backgroundColor: '#FFF', paddingHorizontal: 16, paddingVertical: 8, borderRadius: 10, alignSelf: 'flex-start' },
  bannerBtnText: { color: '#8B5CF6', fontWeight: '800', fontSize: 12 },
  sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 24, marginBottom: 16 },
  sectionTitle: { fontSize: 18, fontWeight: '800', color: '#1E293B' },
  seeAll: { color: '#8B5CF6', fontWeight: '700', fontSize: 14 },
  categoriesGrid: { flexDirection: 'row', flexWrap: 'wrap', paddingHorizontal: 24, justifyContent: 'space-between' },
  catWrapper: { width: '48%', marginBottom: 16 },
  catCard: { padding: 16, height: 140, justifyContent: 'space-between', backgroundColor: '#FFF' },
  catIconBox: { width: 40, height: 40, borderRadius: 12, backgroundColor: '#F8FAFC', alignItems: 'center', justifyContent: 'center' },
  catIcon: { fontSize: 20 },
  catTitle: { fontSize: 14, fontWeight: '700', color: '#1E293B', marginTop: 12 },
  catPrice: { fontSize: 11, color: '#8B5CF6', fontWeight: '600', marginTop: 4 },
  partnerBannerContainer: { paddingHorizontal: 24, marginBottom: 32 },
  partnerBanner: { borderRadius: 24, padding: 20, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', borderWidth: 1, borderColor: 'rgba(255,255,255,0.1)' },
  partnerInfo: { flex: 1 },
  partnerTag: { fontSize: 10, fontWeight: '900', color: '#8B5CF6', letterSpacing: 1, marginBottom: 4 },
  partnerTitle: { fontSize: 18, fontWeight: '800', color: '#FFF', marginBottom: 2 },
  partnerDesc: { fontSize: 12, color: '#94A3B8' }
});
