import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Dimensions, Image } from 'react-native';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { Star, Award, Zap, ChevronRight, Filter, Search } from 'lucide-react-native';
import { GlassCard } from '../../src/components/ui/GlassCard';

const { width } = Dimensions.get('window');

const SUGGESTED_EDITORS = [
  { 
    id: '1', 
    name: 'Arjun K.', 
    rating: '4.9', 
    skill: 'Cinematic Expert', 
    price: '₹299', 
    speed: '45 mins',
    reviews: '124',
    image: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=400&h=400&fit=crop'
  },
  { 
    id: '2', 
    name: 'Sana R.', 
    rating: '4.8', 
    skill: 'Viral Reels', 
    price: '₹149', 
    speed: '2 hours',
    reviews: '89',
    image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&h=400&fit=crop'
  },
  { 
    id: '3', 
    name: 'Leo V.', 
    rating: '5.0', 
    skill: 'Gaming Pro', 
    price: '₹499', 
    speed: '1 hour',
    reviews: '210',
    image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop'
  },
  { 
    id: '4', 
    name: 'Priya M.', 
    rating: '4.7', 
    skill: 'Vlog Storytelling', 
    price: '₹199', 
    speed: '4 hours',
    reviews: '56',
    image: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&h=400&fit=crop'
  },
];

export default function MatchingScreen() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <LinearGradient colors={['#F8FAFC', '#F1F5F9']} style={StyleSheet.absoluteFill} />
      
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
          <View style={styles.headerTop}>
            <View>
              <Text style={styles.title}>Best Match</Text>
              <Text style={styles.subtitle}>Found {SUGGESTED_EDITORS.length} expert editors for you</Text>
            </View>
            <TouchableOpacity style={styles.filterBtn}>
              <Filter size={20} color="#8B5CF6" />
            </TouchableOpacity>
          </View>

          <View style={styles.searchBar}>
            <Search size={18} color="#94A3B8" />
            <Text style={styles.searchPlaceholder}>Search by name or style...</Text>
          </View>
        </View>

        <View style={styles.listContainer}>
          {SUGGESTED_EDITORS.map((editor) => (
            <TouchableOpacity 
              key={editor.id} 
              onPress={() => router.push('/(customer)/tracking')}
              activeOpacity={0.9}
            >
              <GlassCard style={styles.editorItem}>
                <View style={styles.editorMain}>
                  <View style={styles.imageContainer}>
                    <Image source={{ uri: editor.image }} style={styles.editorImage} />
                    <View style={styles.onlineBadge} />
                  </View>
                  
                  <View style={styles.infoContent}>
                    <View style={styles.nameRow}>
                      <Text style={styles.editorName}>{editor.name}</Text>
                      <View style={styles.ratingBadge}>
                        <Star size={12} color="#F59E0B" fill="#F59E0B" />
                        <Text style={styles.ratingText}>{editor.rating}</Text>
                      </View>
                    </View>
                    
                    <Text style={styles.skillText}>{editor.skill}</Text>
                    
                    <View style={styles.tagRow}>
                      <View style={styles.tag}>
                        <Award size={10} color="#8B5CF6" />
                        <Text style={styles.tagText}>Top Pro</Text>
                      </View>
                      <View style={[styles.tag, { backgroundColor: '#ECFDF5' }]}>
                        <Zap size={10} color="#10B981" />
                        <Text style={[styles.tagText, { color: '#059669' }]}>Express</Text>
                      </View>
                    </View>
                  </View>
                </View>

                <View style={styles.divider} />

                <View style={styles.footer}>
                  <View style={styles.priceSection}>
                    <Text style={styles.priceLabel}>Starting from</Text>
                    <Text style={styles.priceValue}>{editor.price}</Text>
                  </View>
                  
                  <View style={styles.speedSection}>
                    <Text style={styles.speedLabel}>Delivery in</Text>
                    <Text style={styles.speedValue}>{editor.speed}</Text>
                  </View>

                  <LinearGradient 
                    colors={['#8B5CF6', '#3B82F6']} 
                    start={{x:0, y:0}} end={{x:1, y:0}} 
                    style={styles.hireBtn}
                  >
                    <Text style={styles.hireBtnText}>Hire</Text>
                  </LinearGradient>
                </View>
              </GlassCard>
            </TouchableOpacity>
          ))}
        </View>

        <View style={{ height: 100 }} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8FAFC' },
  scrollContent: { paddingTop: 60, paddingHorizontal: 20 },
  header: { marginBottom: 24 },
  headerTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 },
  title: { fontSize: 28, fontWeight: '900', color: '#1E293B' },
  subtitle: { fontSize: 14, color: '#64748B', marginTop: 4 },
  filterBtn: { width: 44, height: 44, borderRadius: 12, backgroundColor: '#FFF', alignItems: 'center', justifyContent: 'center', elevation: 2 },
  searchBar: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#FFF', paddingHorizontal: 16, paddingVertical: 12, borderRadius: 16, borderWidth: 1, borderColor: '#F1F5F9' },
  searchPlaceholder: { marginLeft: 12, color: '#94A3B8', fontSize: 14 },
  listContainer: { gap: 16 },
  editorItem: { padding: 16, backgroundColor: '#FFF', borderRadius: 24 },
  editorMain: { flexDirection: 'row' },
  imageContainer: { position: 'relative' },
  editorImage: { width: 80, height: 80, borderRadius: 20, backgroundColor: '#E2E8F0' },
  onlineBadge: { position: 'absolute', bottom: 2, right: 2, width: 14, height: 14, borderRadius: 7, backgroundColor: '#10B981', borderWidth: 2, borderColor: '#FFF' },
  infoContent: { flex: 1, marginLeft: 16, justifyContent: 'center' },
  nameRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  editorName: { fontSize: 18, fontWeight: '800', color: '#1E293B' },
  ratingBadge: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#FFF7ED', paddingHorizontal: 6, paddingVertical: 2, borderRadius: 8 },
  ratingText: { marginLeft: 4, fontSize: 12, fontWeight: '700', color: '#F59E0B' },
  skillText: { fontSize: 14, color: '#64748B', marginTop: 4 },
  tagRow: { flexDirection: 'row', marginTop: 10, gap: 8 },
  tag: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#F5F3FF', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 8 },
  tagText: { marginLeft: 4, fontSize: 10, fontWeight: '700', color: '#8B5CF6' },
  divider: { height: 1, backgroundColor: '#F1F5F9', marginVertical: 16 },
  footer: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  priceSection: { },
  priceLabel: { fontSize: 10, color: '#94A3B8', fontWeight: '600' },
  priceValue: { fontSize: 16, fontWeight: '800', color: '#1E293B' },
  speedSection: { },
  speedLabel: { fontSize: 10, color: '#94A3B8', fontWeight: '600' },
  speedValue: { fontSize: 16, fontWeight: '800', color: '#8B5CF6' },
  hireBtn: { paddingHorizontal: 20, paddingVertical: 8, borderRadius: 12 },
  hireBtnText: { color: '#FFF', fontSize: 14, fontWeight: '800' }
});

