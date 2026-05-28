import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image, ActivityIndicator, StatusBar, Modal } from 'react-native';
import { Star, Shield, Award, Clock, Settings, LogOut, ChevronRight, AlertCircle, Film, User, CheckCircle2, CreditCard, Wallet, ShieldCheck, FileBadge, X } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import * as SecureStore from 'expo-secure-store';
import { authService } from '../../src/services/api';
import Animated, { FadeInUp } from 'react-native-reanimated';
import { Video, ResizeMode } from 'expo-av';

const CAT_COLORS = ['#EDE7F6', '#E3F2FD', '#E8F5E9', '#FFF3E0'];

export default function EditorProfile() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [videoModalVisible, setVideoModalVisible] = useState(false);
  const [selectedVideoTitle, setSelectedVideoTitle] = useState('');
  const [selectedVideoUrl, setSelectedVideoUrl] = useState('');

  useEffect(() => { fetchProfile(); }, []);

  const optimizeUrl = (url: string) => {
    if (url && url.includes('cloudinary.com') && !url.includes('q_auto')) {
      return url.replace('/upload/', '/upload/q_auto,f_auto/');
    }
    return url;
  };

  const fetchProfile = async () => {
    try {
      setLoading(true);
      const data = await authService.getMe();
      setUser(data);
    } catch (error) {
      console.error('[EditorProfile] Fetch Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    await SecureStore.deleteItemAsync('userToken');
    await SecureStore.setItemAsync('userRole', '');
    router.replace('/login');
  };

  if (loading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color="#4F46E5" />
      </View>
    );
  }

  if (!user) {
    return (
      <View style={styles.centerContainer}>
        <AlertCircle size={40} color="#EF4444" />
        <Text style={styles.errorText}>Failed to load profile</Text>
        <TouchableOpacity onPress={handleLogout} style={styles.logoutBtnSmall}>
          <Text style={styles.logoutTextSmall}>Log Out</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const editor = user.editorProfile;

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#4F46E5" />
      
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 60 }}>
        
        {/* Header section with Indigo Gradient */}
        <LinearGradient colors={['#4F46E5', '#7C3AED']} style={styles.header}>
          <View style={styles.profileRow}>
            <View style={styles.avatarContainer}>
              <View style={styles.avatar}>
                <Text style={styles.avatarText}>
                  {user.name ? user.name.substring(0, 2).toUpperCase() : 'AE'}
                </Text>
              </View>
              <View style={styles.badge}><Award size={14} color="#FFF" /></View>
            </View>
            <View style={styles.userInfo}>
              <Text style={styles.name}>{user.name || 'Anonymous Editor'}</Text>
              <View style={styles.levelRow}>
                <Text style={styles.levelLabel}>{editor?.level || 'PRO'} EDITOR</Text>
                <View style={styles.verifiedBadge}>
                  <Shield size={10} color="#FFF" fill="#FFF" />
                  <Text style={styles.verifiedText}>PREMIUM</Text>
                </View>
              </View>
            </View>
          </View>

          {/* Overall Rating and Edits bar */}
          <View style={styles.ratingBar}>
            <View style={styles.ratingItem}>
              <Text style={styles.ratingVal}>{editor?.rating ? editor.rating.toFixed(1) : '0.0'}</Text>
              <View style={styles.stars}>
                {[1,2,3,4,5].map(i => (
                  <Star 
                    key={i} 
                    size={10} 
                    color={i <= (editor?.rating || 0) ? "#F59E0B" : "#E2E8F0"} 
                    fill={i <= (editor?.rating || 0) ? "#F59E0B" : "#E2E8F0"} 
                  />
                ))}
              </View>
              <Text style={styles.ratingLabel}>Overall Rating</Text>
            </View>
            <View style={styles.divider} />
            <View style={styles.ratingItem}>
              <Text style={styles.ratingVal}>{editor?.totalOrders?.toLocaleString() || '0'}</Text>
              <Text style={styles.ratingLabel}>Total Edits</Text>
            </View>
          </View>
        </LinearGradient>

        <View style={styles.body}>
          
          {/* Skill Tag list */}
          <Text style={styles.secTitle}>My Specializations</Text>
          <View style={styles.badgesRow}>
            <Badge icon="⚡" label="Rapid Deliveries" color="#4F46E5" bg="#EDE7F6" />
            <Badge icon="🎬" label="Cinematic Video" color="#2E7D32" bg="#E8F5E9" />
            <Badge icon="🎥" label="Shorts & Reels" color="#FB8C00" bg="#FFF3E0" />
          </View>

          {/* Portfolio Showcases */}
          <Text style={styles.secTitle}>Portfolio Showcase</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.portfolioScroll}>
            {editor?.portfolio && editor.portfolio.length > 0 ? (
              editor.portfolio.map((item: any, index: number) => {
                const color = CAT_COLORS[index % CAT_COLORS.length];
                return (
                  <PortfolioItem 
                    key={item.id} 
                    title={item.title} 
                    tag={item.category || "VIDEO"} 
                    color="#4F46E5" 
                    bg={color} 
                    onPress={() => { 
                      setSelectedVideoTitle(item.title); 
                      setSelectedVideoUrl(optimizeUrl(item.videoUrl)); 
                      setVideoModalVisible(true); 
                    }} 
                  />
                )
              })
            ) : (
              <View style={styles.emptyPortfolioContainer}>
                <Text style={styles.emptyPortfolioText}>No portfolio items added yet.</Text>
              </View>
            )}
          </ScrollView>

          {/* Performance stats summary */}
          <Text style={styles.secTitle}>Performance Summary</Text>
          <View style={styles.perfCard}>
            <PerformanceRow icon={<Clock size={18} color="#4F46E5" />} label="Average Speed" value={editor?.responseSpeed || "Unknown"} />
            <PerformanceRow icon={<Star size={18} color="#FB8C00" />} label="Review Rate" value={editor?.rating ? `${editor.rating.toFixed(1)} / 5` : 'New'} />
            <PerformanceRow icon={<CheckCircle2 size={18} color="#2E7D32" />} label="Successful delivery" value={`${editor?.successRate || 100}%`} />
          </View>

          {/* Recent Reviews */}
          <Text style={styles.secTitle}>Recent Client Feedback</Text>
          {editor?.reviews && editor.reviews.length > 0 ? (
            editor.reviews.map((review: any) => (
              <View key={review.id} style={styles.reviewCard}>
                <View style={styles.reviewHeader}>
                  <View style={styles.reviewUser}>
                    {review.customer?.avatar ? (
                      <Image source={{ uri: review.customer.avatar }} style={styles.reviewAvatar} />
                    ) : (
                      <View style={[styles.reviewAvatar, { backgroundColor: '#E2E8F0', alignItems: 'center', justifyContent: 'center' }]}>
                        <Text style={{ fontWeight: '700', color: '#64748B' }}>{(review.customer?.name || 'C')[0].toUpperCase()}</Text>
                      </View>
                    )}
                    <Text style={styles.reviewName}>{review.customer?.name || 'Customer'}</Text>
                  </View>
                  <View style={styles.ratingBadge}>
                    <Star size={14} color="#FBBF24" fill="#FBBF24" />
                    <Text style={styles.ratingText}>{review.rating}.0</Text>
                  </View>
                </View>
                <Text style={styles.reviewComment}>{review.comment || 'No comment provided.'}</Text>
              </View>
            ))
          ) : (
            <View style={styles.emptyCard}>
              <Text style={styles.emptyText}>You haven't received any reviews yet.</Text>
            </View>
          )}

          {/* Account Hub Actions */}
          <Text style={styles.secTitle}>Account Hub</Text>

          <TouchableOpacity style={styles.menuItem} onPress={() => router.push('/(editor)/subscriptions')}>
            <View style={styles.menuLeft}>
              <View style={[styles.menuIcon, { backgroundColor: '#E0E7FF' }]}><CreditCard size={18} color="#4F46E5" /></View>
              <Text style={styles.menuText}>Subscription Plan</Text>
            </View>
            <ChevronRight size={18} color="#CBD5E1" />
          </TouchableOpacity>

          <TouchableOpacity style={styles.menuItem} onPress={() => router.push('/(editor)/wallet')}>
            <View style={styles.menuLeft}>
              <View style={[styles.menuIcon, { backgroundColor: '#ECFCCB' }]}><Wallet size={18} color="#65A30D" /></View>
              <Text style={styles.menuText}>My Wallet & Earnings</Text>
            </View>
            <ChevronRight size={18} color="#CBD5E1" />
          </TouchableOpacity>

          <TouchableOpacity style={styles.menuItem} onPress={() => router.push('/(editor)/trust-dashboard')}>
            <View style={styles.menuLeft}>
              <View style={[styles.menuIcon, { backgroundColor: '#FFEDD5' }]}><ShieldCheck size={18} color="#EA580C" /></View>
              <Text style={styles.menuText}>Trust & Security Hub</Text>
            </View>
            <ChevronRight size={18} color="#CBD5E1" />
          </TouchableOpacity>

          <TouchableOpacity style={styles.menuItem} onPress={() => router.push('/(editor)/kyc-verification')}>
            <View style={styles.menuLeft}>
              <View style={[styles.menuIcon, { backgroundColor: '#DCFCE7' }]}><FileBadge size={18} color="#16A34A" /></View>
              <Text style={styles.menuText}>KYC Verification</Text>
            </View>
            <ChevronRight size={18} color="#CBD5E1" />
          </TouchableOpacity>

          <TouchableOpacity style={styles.menuItem}>
            <View style={styles.menuLeft}>
              <View style={[styles.menuIcon, { backgroundColor: '#F1F5F9' }]}><Settings size={18} color="#475569" /></View>
              <Text style={styles.menuText}>Account Settings</Text>
            </View>
            <ChevronRight size={18} color="#CBD5E1" />
          </TouchableOpacity>

          <TouchableOpacity style={styles.logoutBtn} onPress={handleLogout}>
            <LogOut size={18} color="#EF4444" />
            <Text style={styles.logoutText}>Log Out &amp; Exit</Text>
          </TouchableOpacity>
        </View>

      </ScrollView>

      {/* Video Player Modal for Portfolio */}
      <Modal visible={videoModalVisible} animationType="slide" transparent={true} onRequestClose={() => setVideoModalVisible(false)}>
        <View style={styles.modalBg}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>{selectedVideoTitle}</Text>
            <TouchableOpacity onPress={() => setVideoModalVisible(false)} style={styles.modalCloseBtn}>
              <X size={20} color="#FFF" />
            </TouchableOpacity>
          </View>
          <View style={styles.videoContainer}>
            {selectedVideoUrl ? (
              <Video
                source={{ uri: selectedVideoUrl }}
                style={styles.fullVideo}
                useNativeControls
                resizeMode={ResizeMode.CONTAIN}
                isLooping
                shouldPlay={videoModalVisible}
              />
            ) : (
              <Text style={{ color: '#FFF' }}>No video URL provided.</Text>
            )}
          </View>
        </View>
      </Modal>
    </View>
  );
}

function Badge({ icon, label, color, bg }: any) {
  return (
    <View style={[styles.badgeItem, { backgroundColor: bg }]}>
      <Text style={styles.badgeIcon}>{icon}</Text>
      <Text style={[styles.badgeLabel, { color: color }]}>{label}</Text>
    </View>
  );
}

function PortfolioItem({ title, tag, color, bg, onPress }: any) {
  return (
    <TouchableOpacity style={[styles.pItem, { backgroundColor: bg }]} onPress={onPress}>
      <Film size={20} color={color} />
      <View>
        <Text style={[styles.pTag, { color: color }]}>{tag}</Text>
        <Text style={styles.pText} numberOfLines={2}>{title}</Text>
      </View>
    </TouchableOpacity>
  );
}

function PerformanceRow({ icon, label, value }: any) {
  return (
    <View style={styles.perfItem}>
      <View style={styles.perfLeft}>
        <View style={styles.perfIcon}>{icon}</View>
        <Text style={styles.perfLabel}>{label}</Text>
      </View>
      <Text style={styles.perfValue}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8FAFC' },
  centerContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#F8FAFC' },
  errorText: { marginTop: 10, fontSize: 15, color: '#EF4444', fontWeight: '800' },
  logoutBtnSmall: { marginTop: 20, padding: 10 },
  logoutTextSmall: { color: '#4F46E5', fontWeight: '800' },

  header: { paddingTop: 58, paddingHorizontal: 20, paddingBottom: 24, borderBottomLeftRadius: 32, borderBottomRightRadius: 32 },
  profileRow: { flexDirection: 'row', alignItems: 'center', gap: 14, marginBottom: 20 },
  avatarContainer: { position: 'relative' },
  avatar: { width: 68, height: 68, borderRadius: 34, backgroundColor: 'rgba(255,255,255,0.2)', alignItems: 'center', justifyContent: 'center' },
  avatarText: { fontSize: 24, fontWeight: '900', color: '#FFF' },
  badge: { position: 'absolute', bottom: -2, right: -2, backgroundColor: '#4F46E5', padding: 4, borderRadius: 10, borderWidth: 2.5, borderColor: '#FFF' },
  userInfo: { flex: 1 },
  name: { fontSize: 18, fontWeight: '900', color: '#FFF' },
  levelRow: { flexDirection: 'row', alignItems: 'center', marginTop: 4, gap: 8 },
  levelLabel: { fontSize: 11, fontWeight: '800', color: 'rgba(255,255,255,0.85)', letterSpacing: 0.5 },
  verifiedBadge: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#10B981', paddingHorizontal: 6, paddingVertical: 2, borderRadius: 6, gap: 2 },
  verifiedText: { color: '#FFF', fontSize: 8, fontWeight: '900' },

  ratingBar: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#FFF', paddingVertical: 14, paddingHorizontal: 20, borderRadius: 20, elevation: 2, shadowColor: '#4F46E5', shadowOpacity: 0.05, shadowRadius: 10 },
  ratingItem: { flex: 1, alignItems: 'center' },
  ratingVal: { fontSize: 18, fontWeight: '900', color: '#1E293B' },
  stars: { flexDirection: 'row', marginTop: 2 },
  ratingLabel: { fontSize: 9, color: '#94A3B8', marginTop: 4, fontWeight: '700', textTransform: 'uppercase' },
  divider: { width: 1, height: 28, backgroundColor: '#F1F5F9' },

  body: { padding: 20 },
  secTitle: { fontSize: 15, fontWeight: '900', color: '#1E293B', marginBottom: 12, marginTop: 14 },
  badgesRow: { flexDirection: 'row', gap: 8, marginBottom: 12 },
  badgeItem: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 10, paddingVertical: 6, borderRadius: 10, gap: 5 },
  badgeIcon: { fontSize: 12 },
  badgeLabel: { fontSize: 10, fontWeight: '800' },

  portfolioScroll: { gap: 10, marginBottom: 12 },
  pItem: { width: 120, height: 120, borderRadius: 20, padding: 14, justifyContent: 'space-between' },
  pTag: { fontSize: 9, fontWeight: '900' },
  pText: { fontSize: 12, fontWeight: '800', color: '#1E293B', marginTop: 4 },

  perfCard: { backgroundColor: '#FFF', borderRadius: 20, paddingHorizontal: 14, paddingVertical: 6, marginBottom: 16, elevation: 1 },
  perfItem: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: '#F8FAFC' },
  perfLeft: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  perfIcon: { width: 32, height: 32, borderRadius: 10, backgroundColor: '#F8FAFC', alignItems: 'center', justifyContent: 'center' },
  perfLabel: { fontSize: 13, fontWeight: '800', color: '#475569' },
  perfValue: { fontSize: 13, fontWeight: '900', color: '#1E293B' },

  menuItem: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', backgroundColor: '#FFF', borderRadius: 16, padding: 14, elevation: 1, marginBottom: 12 },
  menuLeft: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  menuIcon: { width: 36, height: 36, borderRadius: 12, alignItems: 'center', justifyContent: 'center' },
  menuText: { fontSize: 14, fontWeight: '800', color: '#1E293B' },

  logoutBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', paddingVertical: 16, gap: 8, marginTop: 10 },
  logoutText: { color: '#EF4444', fontWeight: '900', fontSize: 15 },

  modalBg: { flex: 1, backgroundColor: '#0F172A', paddingTop: 60 },
  modalHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 20, paddingBottom: 20 },
  modalTitle: { color: '#FFF', fontSize: 18, fontWeight: '800' },
  modalCloseBtn: { width: 40, height: 40, borderRadius: 20, backgroundColor: 'rgba(255,255,255,0.1)', alignItems: 'center', justifyContent: 'center' },
  videoContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#000' },
  fullVideo: { width: '100%', height: '100%' },
  emptyPortfolioContainer: { padding: 20, backgroundColor: '#FFF', borderRadius: 16, alignItems: 'center', justifyContent: 'center', minWidth: 200, borderWidth: 1, borderColor: '#E2E8F0', borderStyle: 'dashed' },
  emptyPortfolioText: { color: '#94A3B8', fontSize: 13, fontWeight: '600' },
  reviewCard: { backgroundColor: '#FFF', padding: 16, borderRadius: 16, marginBottom: 16, borderWidth: 1, borderColor: '#F1F5F9' },
  reviewHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 },
  reviewUser: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  reviewAvatar: { width: 32, height: 32, borderRadius: 16 },
  reviewName: { fontSize: 14, fontWeight: '700', color: '#1E293B' },
  ratingBadge: { flexDirection: 'row', alignItems: 'center', gap: 4, backgroundColor: '#FFFBEB', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 12 },
  ratingText: { fontSize: 12, fontWeight: '700', color: '#D97706' },
  reviewComment: { fontSize: 14, color: '#475569', lineHeight: 22 },
  emptyCard: { padding: 20, alignItems: 'center', backgroundColor: '#F8FAFC', borderRadius: 16, borderWidth: 1, borderColor: '#E2E8F0', borderStyle: 'dashed', marginBottom: 24 },
  emptyText: { color: '#94A3B8', fontSize: 14, fontWeight: '500' }
});
