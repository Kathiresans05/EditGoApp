import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput } from 'react-native';
import { Sparkles, MessageSquare, Hash, Music, Image as ImageIcon, Zap, ChevronRight } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { GlassCard } from '../../src/components/ui/GlassCard';

export default function AIStudioScreen() {
  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.header}>
        <Text style={styles.title}>AI Studio</Text>
        <Text style={styles.subtitle}>Supercharge your content with AI</Text>
      </View>

      {/* AI Suggestion Tools */}
      <View style={styles.grid}>
        <AIToolCard 
          icon={<MessageSquare size={24} color="#8B5CF6" />} 
          title="Viral Captions" 
          desc="Generate catchy hooks & captions"
          color="#F5F3FF"
        />
        <AIToolCard 
          icon={<Hash size={24} color="#EC4899" />} 
          title="Viral Hashtags" 
          desc="Trending tags for your niche"
          color="#FDF2F8"
        />
        <AIToolCard 
          icon={<Music size={24} color="#3B82F6" />} 
          title="Music Finder" 
          desc="Find trending audio styles"
          color="#EFF6FF"
        />
        <AIToolCard 
          icon={<ImageIcon size={24} color="#10B981" />} 
          title="Thumbnail AI" 
          desc="Auto-concept generation"
          color="#F0FDF4"
        />
      </View>

      <Text style={styles.sectionTitle}>Smart Recommendations</Text>
      <GlassCard style={styles.recommendCard}>
        <View style={styles.recHeader}>
          <Sparkles size={20} color="#8B5CF6" />
          <Text style={styles.recTitle}>AI Style Match</Text>
        </View>
        <Text style={styles.recDesc}>Based on your "Gamer" profile, we suggest the **Neon Velocity** edit style for your next reel.</Text>
        <TouchableOpacity style={styles.recBtn}>
          <Text style={styles.recBtnText}>Apply Style</Text>
          <Zap size={14} color="#FFF" fill="#FFF" />
        </TouchableOpacity>
      </GlassCard>

      <Text style={styles.sectionTitle}>Draft Analyzer</Text>
      <TouchableOpacity style={styles.analyzerBox}>
        <LinearGradient colors={['#8B5CF6', '#3B82F6']} style={styles.analyzerIcon}>
          <Zap size={24} color="#FFF" />
        </LinearGradient>
        <View style={styles.analyzerText}>
          <Text style={styles.analyzerTitle}>Analyze your draft</Text>
          <Text style={styles.analyzerSub}>AI will check retention & engagement</Text>
        </View>
        <ChevronRight size={20} color="#CBD5E1" />
      </TouchableOpacity>

      <View style={{ height: 120 }} />
    </ScrollView>
  );
}

function AIToolCard({ icon, title, desc, color }: any) {
  return (
    <TouchableOpacity style={[styles.card, { backgroundColor: color }]}>
      <View style={styles.iconBox}>{icon}</View>
      <Text style={styles.cardTitle}>{title}</Text>
      <Text style={styles.cardDesc}>{desc}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8FAFC' },
  header: { paddingTop: 80, paddingHorizontal: 24, marginBottom: 32 },
  title: { fontSize: 32, fontWeight: '900', color: '#1E293B' },
  subtitle: { fontSize: 16, color: '#64748B', marginTop: 4 },
  grid: { flexDirection: 'row', flexWrap: 'wrap', paddingHorizontal: 24, justifyContent: 'space-between' },
  card: { width: '48%', padding: 20, borderRadius: 24, marginBottom: 16 },
  iconBox: { marginBottom: 12 },
  cardTitle: { fontSize: 16, fontWeight: '800', color: '#1E293B' },
  cardDesc: { fontSize: 12, color: '#64748B', marginTop: 4, lineHeight: 18 },
  sectionTitle: { fontSize: 18, fontWeight: '800', color: '#1E293B', marginHorizontal: 24, marginTop: 24, marginBottom: 16 },
  recommendCard: { marginHorizontal: 24, padding: 24, backgroundColor: '#FFF' },
  recHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 12 },
  recTitle: { fontSize: 16, fontWeight: '800', color: '#8B5CF6', marginLeft: 8 },
  recDesc: { fontSize: 14, color: '#475569', lineHeight: 22, marginBottom: 20 },
  recBtn: { backgroundColor: '#8B5CF6', paddingVertical: 12, paddingHorizontal: 20, borderRadius: 12, flexDirection: 'row', alignItems: 'center', alignSelf: 'flex-start' },
  recBtnText: { color: '#FFF', fontWeight: '800', fontSize: 14, marginRight: 8 },
  analyzerBox: { flexDirection: 'row', alignItems: 'center', marginHorizontal: 24, backgroundColor: '#FFF', padding: 16, borderRadius: 24, shadowColor: '#000', shadowOpacity: 0.03, shadowRadius: 10, elevation: 2 },
  analyzerIcon: { width: 56, height: 56, borderRadius: 18, alignItems: 'center', justifyContent: 'center' },
  analyzerText: { flex: 1, marginLeft: 16 },
  analyzerTitle: { fontSize: 16, fontWeight: '800', color: '#1E293B' },
  analyzerSub: { fontSize: 12, color: '#94A3B8', marginTop: 2 }
});
