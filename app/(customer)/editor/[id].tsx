import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image, ActivityIndicator } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { ChevronLeft, Star, Heart, Play, ShieldCheck, Award, MessageSquare } from 'lucide-react-native';
import api from '../../../src/services/api';

export default function PublicEditorProfile() {
  const router = useRouter();
  const { id } = useLocalSearchParams();
  const [editor, setEditor] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProfile();
  }, [id]);

  const fetchProfile = async () => {
    try {
      const res = await api.get(`/editor/${id}`);
      setEditor(res.data.editor);
    } catch (e) {
      console.log('Error fetching editor profile', e);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <View style={s.centerContainer}>
        <ActivityIndicator size="large" color="#4F46E5" />
      </View>
    );
  }

  if (!editor) {
    return (
      <View style={s.centerContainer}>
        <Text style={{color: '#64748B'}}>Editor not found.</Text>
      </View>
    );
  }

  return (
    <View style={s.container}>
      <ScrollView contentContainerStyle={{paddingBottom: 100}}>
        {/* Header Profile Section */}
        <LinearGradient colors={['#1E293B', '#0F172A']} style={s.header}>
          <View style={s.navRow}>
            <TouchableOpacity onPress={() => router.back()} style={s.backBtn}>
              <ChevronLeft size={24} color="#FFF" />
            </TouchableOpacity>
            {editor.isVerified && (
              <View style={s.verifiedBadge}>
                <ShieldCheck size={16} color="#10B981" />
                <Text style={s.verifiedText}>Verified Pro</Text>
              </View>
            )}
          </View>
          
          <View style={s.profileInfo}>
            <View style={s.avatarContainer}>
              {editor.user?.avatar ? (
                <Image source={{uri: editor.user.avatar}} style={s.avatar} />
              ) : (
                <View style={[s.avatar, {backgroundColor: '#4F46E5', alignItems: 'center', justifyContent: 'center'}]}>
                  <Text style={s.avatarText}>{(editor.user?.name || 'E')[0].toUpperCase()}</Text>
                </View>
              )}
            </View>
            <Text style={s.name}>{editor.user?.name || 'Anonymous Editor'}</Text>
            <Text style={s.level}>{editor.level?.replace('_', ' ')} LEVEL</Text>
            
            <View style={s.statsRow}>
              <View style={s.statItem}>
                <Star size={18} color="#FBBF24" fill="#FBBF24" />
                <Text style={s.statVal}>{editor.rating?.toFixed(1) || '5.0'}</Text>
                <Text style={s.statLabel}>Rating</Text>
              </View>
              <View style={s.divider} />
              <View style={s.statItem}>
                <Award size={18} color="#A78BFA" />
                <Text style={s.statVal}>{editor.totalOrders}</Text>
                <Text style={s.statLabel}>Jobs</Text>
              </View>
              <View style={s.divider} />
              <View style={s.statItem}>
                <Heart size={18} color="#F43F5E" />
                <Text style={s.statVal}>{editor.successRate}%</Text>
                <Text style={s.statLabel}>Success</Text>
              </View>
            </View>
          </View>
        </LinearGradient>

        <View style={s.body}>
          {/* Bio */}
          <Text style={s.sectionTitle}>About</Text>
          <Text style={s.bio}>{editor.bio || 'This editor hasn\'t added a bio yet, but their work speaks for itself!'}</Text>
          
          {/* Skills */}
          {editor.skills && editor.skills.length > 0 && (
            <View style={s.skillsContainer}>
              {editor.skills.map((skill: string, index: number) => (
                <View key={index} style={s.skillBadge}>
                  <Text style={s.skillText}>{skill}</Text>
                </View>
              ))}
            </View>
          )}

          {/* Portfolio */}
          <View style={s.portfolioHeader}>
            <Text style={s.sectionTitle}>Portfolio & Showcase</Text>
            <Text style={s.portfolioCount}>{editor.portfolio?.length || 0} Projects</Text>
          </View>

          {(!editor.portfolio || editor.portfolio.length === 0) ? (
            <View style={s.emptyBox}>
              <Text style={s.emptyText}>No portfolio items uploaded yet.</Text>
            </View>
          ) : (
            editor.portfolio.map((item: any) => (
              <View key={item.id} style={s.portfolioCard}>
                <View style={s.videoThumbContainer}>
                  <Image source={{uri: item.thumbnail}} style={s.videoThumb} />
                  <View style={s.playBtn}>
                    <Play size={24} color="#FFF" fill="#FFF" style={{marginLeft: 3}} />
                  </View>
                </View>
                <View style={s.portfolioInfo}>
                  <Text style={s.portfolioTitle}>{item.title}</Text>
                  <Text style={s.portfolioCategory}>{item.category}</Text>
                  <View style={s.likeRow}>
                    <Heart size={16} color="#F43F5E" />
                    <Text style={s.likeText}>{item.likes} Likes</Text>
                  </View>
                </View>
              </View>
            ))
          )}
        </View>
      </ScrollView>

      {/* Fixed Bottom Action Bar */}
      <View style={s.bottomBar}>
        <TouchableOpacity style={s.chatBtn}>
          <MessageSquare size={24} color="#4F46E5" />
        </TouchableOpacity>
        <TouchableOpacity 
          style={s.hireBtn}
          onPress={() => router.push({ pathname: '/(customer)/matching', params: { autoAssignEditorId: editor.id } })}
        >
          <LinearGradient colors={['#4F46E5', '#6366F1']} style={s.hireBtnGradient}>
            <Text style={s.hireBtnText}>Hire for Next Project</Text>
          </LinearGradient>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const s = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8FAFC' },
  centerContainer: { flex: 1, backgroundColor: '#F8FAFC', alignItems: 'center', justifyContent: 'center' },
  header: { paddingTop: 60, paddingBottom: 30, borderBottomLeftRadius: 32, borderBottomRightRadius: 32 },
  navRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 20 },
  backBtn: { width: 40, height: 40, borderRadius: 20, backgroundColor: 'rgba(255,255,255,0.1)', alignItems: 'center', justifyContent: 'center' },
  verifiedBadge: { flexDirection: 'row', alignItems: 'center', backgroundColor: 'rgba(16, 185, 129, 0.1)', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 20, borderWidth: 1, borderColor: 'rgba(16, 185, 129, 0.3)' },
  verifiedText: { color: '#10B981', fontSize: 13, fontWeight: '700', marginLeft: 6 },
  profileInfo: { alignItems: 'center', marginTop: 10 },
  avatarContainer: { width: 100, height: 100, borderRadius: 50, borderWidth: 4, borderColor: '#4F46E5', overflow: 'hidden', marginBottom: 16 },
  avatar: { width: '100%', height: '100%' },
  avatarText: { fontSize: 40, fontWeight: '800', color: '#FFF' },
  name: { fontSize: 24, fontWeight: '900', color: '#FFF' },
  level: { fontSize: 13, fontWeight: '700', color: '#A78BFA', marginTop: 4, letterSpacing: 1 },
  statsRow: { flexDirection: 'row', alignItems: 'center', backgroundColor: 'rgba(255,255,255,0.05)', paddingHorizontal: 24, paddingVertical: 16, borderRadius: 20, marginTop: 24 },
  statItem: { alignItems: 'center', paddingHorizontal: 16 },
  statVal: { fontSize: 18, fontWeight: '800', color: '#FFF', marginTop: 8 },
  statLabel: { fontSize: 12, color: '#94A3B8', marginTop: 4 },
  divider: { width: 1, height: 40, backgroundColor: 'rgba(255,255,255,0.1)' },
  body: { padding: 24 },
  sectionTitle: { fontSize: 18, fontWeight: '800', color: '#1E293B', marginBottom: 12 },
  bio: { fontSize: 15, color: '#64748B', lineHeight: 24, marginBottom: 24 },
  skillsContainer: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 32 },
  skillBadge: { backgroundColor: '#EEF2FF', paddingHorizontal: 12, paddingVertical: 8, borderRadius: 8, borderWidth: 1, borderColor: '#E0E7FF' },
  skillText: { color: '#4F46E5', fontWeight: '600', fontSize: 13 },
  portfolioHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: 16 },
  portfolioCount: { fontSize: 14, fontWeight: '700', color: '#4F46E5', marginBottom: 12 },
  emptyBox: { backgroundColor: '#FFF', padding: 32, borderRadius: 16, alignItems: 'center', borderWidth: 1, borderColor: '#E2E8F0', borderStyle: 'dashed' },
  emptyText: { color: '#94A3B8', fontWeight: '500' },
  portfolioCard: { backgroundColor: '#FFF', borderRadius: 16, overflow: 'hidden', marginBottom: 20, elevation: 2, shadowColor: '#000', shadowOffset: {width: 0, height: 4}, shadowOpacity: 0.1, shadowRadius: 8 },
  videoThumbContainer: { width: '100%', height: 200, position: 'relative' },
  videoThumb: { width: '100%', height: '100%', resizeMode: 'cover' },
  playBtn: { position: 'absolute', top: '50%', left: '50%', marginTop: -28, marginLeft: -28, width: 56, height: 56, backgroundColor: 'rgba(79, 70, 229, 0.9)', borderRadius: 28, alignItems: 'center', justifyContent: 'center' },
  portfolioInfo: { padding: 16, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  portfolioTitle: { fontSize: 16, fontWeight: '800', color: '#1E293B', marginBottom: 4 },
  portfolioCategory: { fontSize: 13, color: '#64748B' },
  likeRow: { flexDirection: 'row', alignItems: 'center', gap: 6, backgroundColor: '#FFF1F2', paddingHorizontal: 12, paddingVertical: 8, borderRadius: 20 },
  likeText: { fontSize: 13, color: '#BE123C', fontWeight: '700' },
  bottomBar: { position: 'absolute', bottom: 0, left: 0, right: 0, backgroundColor: '#FFF', paddingHorizontal: 20, paddingTop: 16, paddingBottom: 32, flexDirection: 'row', alignItems: 'center', gap: 16, borderTopWidth: 1, borderTopColor: '#E2E8F0', elevation: 10 },
  chatBtn: { width: 56, height: 56, borderRadius: 28, backgroundColor: '#EEF2FF', alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: '#E0E7FF' },
  hireBtn: { flex: 1, borderRadius: 28, overflow: 'hidden' },
  hireBtnGradient: { height: 56, alignItems: 'center', justifyContent: 'center' },
  hireBtnText: { color: '#FFF', fontSize: 16, fontWeight: '800' }
});
