import React, { useState, useEffect } from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity, Switch,
  Dimensions, ActivityIndicator, Modal, Alert, Image, StatusBar,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import {
  Zap, TrendingUp, Star, Award, Clock, ChevronRight,
  AlertCircle, CheckCircle, Bell, UserCircle, BarChart3, X, Play,
} from 'lucide-react-native';
import Animated, { FadeInUp } from 'react-native-reanimated';
import { useRouter } from 'expo-router';
import api, { authService, orderService, editorService, BASE_URL } from '../../src/services/api';
import { Audio, Video, ResizeMode } from 'expo-av';
import io from 'socket.io-client';
import * as SecureStore from 'expo-secure-store';
import ChatModal from '../../src/components/ChatModal';
import LiveStreamModal from '../../src/components/LiveStreamModal';
import { useIsFocused } from '@react-navigation/native';

const { width } = Dimensions.get('window');

// Global cache to strictly prevent ignored orders from showing up across component re-renders
const globalIgnoredRequests = new Set<string>();

const STAT_CARDS = [
  { key: 'earnings', label: 'Total Earnings', prefix: '₹', bg: '#EDE7F6', text: '#7C3AED', accent: '#7C3AED' },
  { key: 'successRate', label: 'Success Rate', suffix: '%', bg: '#E8F5E9', text: '#2E7D32', accent: '#10B981' },
  { key: 'totalOrders', label: 'Projects Done', bg: '#E3F2FD', text: '#1565C0', accent: '#1E88E5' },
  { key: 'rating', label: 'Avg Rating', suffix: '⭐', bg: '#FFF3E0', text: '#E65100', accent: '#FB8C00' },
];

export default function EditorDashboard() {
  const router = useRouter();
  const [isOnline, setIsOnline] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [activeJobs, setActiveJobs] = useState<any[]>([]);
  const [requests, setRequests] = useState<any[]>([]);
  const [portfolioItems, setPortfolioItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [videoModalVisible, setVideoModalVisible] = useState(false);
  const [selectedVideoUrl, setSelectedVideoUrl] = useState('');
  const [selectedVideoTitle, setSelectedVideoTitle] = useState('');
  const [showStream, setShowStream] = useState(false);
  const [isIncomingCall, setIsIncomingCall] = useState(false);
  const [incomingCallData, setIncomingCallData] = useState<any>(null);
  const [incomingCallerName, setIncomingCallerName] = useState<string | null>(null);
  const isFocused = useIsFocused();
  const soundRef = React.useRef<any>(null);
  const ignoredRequestsRef = React.useRef<string[]>([]);

  const socketRef = React.useRef<any>(null);

  useEffect(() => {
    fetchDashboardData();
    const interval = setInterval(() => fetchDashboardData(true), 5000);
    return () => {
      clearInterval(interval);
      if (soundRef.current) soundRef.current.unloadAsync();
      if (socketRef.current) {
        socketRef.current.disconnect();
      }
    };
  }, []);

  useEffect(() => {
    if (user?.editorProfile?.id) {
      const socketUrl = BASE_URL.replace('/api', '');
      socketRef.current = io(socketUrl);

      socketRef.current.on('connect', () => {
        if (isOnline) {
          socketRef.current.emit('editor_online', { editorId: user.editorProfile.id });
        }
      });

      socketRef.current.on('new_order_available', (data: any) => {
        console.log('[Dashboard] Real-time new order received:', data);
        if (!globalIgnoredRequests.has(data.order.id)) {
           setRequests((prev) => {
             // Avoid duplicates
             if (!prev.find(r => r.id === data.order.id)) {
               return [data.order, ...prev];
             }
             return prev;
           });
        }
      });

      return () => {
        if (socketRef.current) {
          socketRef.current.disconnect();
          socketRef.current = null;
        }
      };
    }
  }, [user?.editorProfile?.id]);

  useEffect(() => {
    if (socketRef.current && user?.editorProfile?.id) {
      if (isOnline) {
        socketRef.current.emit('editor_online', { editorId: user.editorProfile.id });
      } else {
        socketRef.current.emit('editor_offline', { editorId: user.editorProfile.id });
      }
    }
  }, [isOnline, user?.editorProfile?.id]);

  useEffect(() => {
    if (requests.length > 0 && isOnline) playSound();
    else stopSound();
  }, [requests.length, isOnline]);

  const playSound = async () => {
    if (soundRef.current) return;
    try {
      const { sound: newSound } = await Audio.Sound.createAsync(
        { uri: 'https://assets.mixkit.co/active_storage/sfx/2358/2358-preview.mp3' },
        { shouldPlay: true, isLooping: true, volume: 1.0 }
      );
      soundRef.current = newSound;
      
      // Safety check: if requests became 0 while we were loading, stop immediately
      setRequests((currentRequests) => {
        if (currentRequests.length === 0 || !isOnline) {
          stopSound();
        }
        return currentRequests;
      });
    } catch (error) { console.error('Failed to play sound', error); }
  };

  const stopSound = async () => {
    if (soundRef.current) { 
      await soundRef.current.stopAsync(); 
      await soundRef.current.unloadAsync(); 
      soundRef.current = null; 
    }
  };

  const fetchDashboardData = async (isSilent = false) => {
    try {
      if (!isSilent) setLoading(true);
      const [profile, editorOrdersData, availableData] = await Promise.all([
        authService.getMe(),
        orderService.getMyEditorOrders(),
        editorService.getAvailableOrders()
      ]);
      setUser(profile);
      setIsOnline(profile.editorProfile?.isOnline || false);
      const editorOrders = editorOrdersData.orders || [];
      setActiveJobs(editorOrders.filter((o: any) => o.status !== 'COMPLETED' && o.status !== 'CANCELLED'));

      // Fetch real portfolio items
      try {
        const portfolioRes = await api.get('/editor/profile');
        setPortfolioItems(portfolioRes.data.editor?.portfolio || []);
      } catch (e) {
        console.log('[Dashboard] Portfolio fetch skipped', e);
      }
      
      const ignoredLocal = await SecureStore.getItemAsync('ignored_orders');
      const ignoredArr = ignoredLocal ? JSON.parse(ignoredLocal) : [];
      ignoredArr.forEach((id: string) => globalIgnoredRequests.add(id));
      
      ignoredRequestsRef.current = Array.from(globalIgnoredRequests);

      const newRequests = (availableData.orders || []).filter((r: any) => !globalIgnoredRequests.has(r.id));
      setRequests(newRequests);
    } catch (error) {
      console.error('[EditorDashboard] Fetch Error:', error);
    } finally { setLoading(false); }
  };

  if (loading) return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#F8FAFC' }}>
      <ActivityIndicator size="large" color="#4F46E5" />
    </View>
  );

  const editor = user?.editorProfile;
  const progress = (editor?.totalOrders || 0) % 10 * 10 || 10;
  const statValues: Record<string, any> = {
    earnings: (editor?.totalEarnings || 0).toLocaleString(),
    successRate: editor?.successRate || 100,
    totalOrders: editor?.totalOrders || 0,
    rating: editor?.rating?.toFixed(1) || '5.0',
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <StatusBar barStyle="light-content" backgroundColor="#4F46E5" />

      {/* ── HEADER ── */}
      <LinearGradient colors={['#4F46E5', '#7C3AED']} style={styles.header}>
        {/* Top row */}
        <View style={styles.headerTop}>
          <View>
            <Text style={styles.headerTitle}>Editor Portal</Text>
            <Text style={styles.headerSub}>Hello, {user?.name?.split(' ')[0] || 'Editor'} 🎬</Text>
          </View>
          <View style={styles.headerActions}>
            <TouchableOpacity style={styles.switchBtn} onPress={() => router.push('/(customer)/home')}>
              <UserCircle size={16} color="#4F46E5" />
              <Text style={styles.switchText}>Switch</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.bellWrap}>
              <Bell size={20} color="#FFF" />
              {requests.length > 0 && <View style={styles.dot} />}
            </TouchableOpacity>
          </View>
        </View>

        {/* Level badge + Online toggle */}
        <View style={styles.badgeRow}>
          <View style={styles.levelBadge}>
            <Award size={13} color="#FFD700" fill="#FFD700" />
            <Text style={styles.levelText}>{editor?.level || 'BEGINNER'} EDITOR</Text>
          </View>
          <View style={styles.onlineRow}>
            <Text style={styles.onlineLabel}>{isOnline ? '🟢 ONLINE' : '🔴 OFFLINE'}</Text>
            <Switch
              value={isOnline}
              onValueChange={async (val) => {
                setIsOnline(val); // Optimistic update
                try {
                  await editorService.toggleOnline(val);
                } catch (e) {
                  setIsOnline(!val); // Revert on failure
                  console.error('Failed to toggle online', e);
                }
              }}
              trackColor={{ false: 'rgba(255,255,255,0.2)', true: '#4ADE80' }}
              thumbColor="#FFF"
            />
          </View>
        </View>

        {/* Progress to next level */}
        <View style={styles.progressWrap}>
          <View style={styles.progressTop}>
            <Text style={styles.progressLabel}>Progress to Next Level</Text>
            <Text style={styles.progressPercent}>{progress}%</Text>
          </View>
          <View style={styles.progressBg}>
            <View style={[styles.progressFill, { width: `${progress}%` as any }]} />
          </View>
        </View>
      </LinearGradient>

      <View style={styles.body}>

        {/* ── STAT CARDS ── */}
        <View style={styles.statsGrid}>
          {STAT_CARDS.map((card, i) => (
            <Animated.View entering={FadeInUp.delay(100 + i * 60)} key={card.key} style={styles.statCell}>
              <TouchableOpacity
                style={[styles.statCard, { backgroundColor: card.bg }]}
                onPress={() => card.key === 'earnings' && router.push('/(editor)/wallet')}
              >
                <Text style={styles.statLabel}>{card.label}</Text>
                <Text style={[styles.statValue, { color: card.text }]}>
                  {card.prefix || ''}{statValues[card.key]}{card.suffix || ''}
                </Text>
                <View style={[styles.accentBar, { backgroundColor: card.accent }]} />
              </TouchableOpacity>
            </Animated.View>
          ))}
        </View>

        {/* ── NEW REQUESTS ── */}
        {requests.length > 0 && (
          <Animated.View entering={FadeInUp.delay(300)}>
            <View style={styles.sectionRow}>
              <Text style={styles.sectionTitle}>New Requests</Text>
              <View style={styles.livePill}>
                <View style={styles.liveDot} />
                <Text style={styles.liveText}>LIVE</Text>
              </View>
            </View>
            {requests.map((req, idx) => (
              <Animated.View entering={FadeInUp.delay(350 + idx * 60)} key={req.id} style={styles.requestCard}>
                <View style={styles.requestIconWrap}>
                  <Zap size={18} color="#4F46E5" fill="#4F46E5" />
                </View>
                <View style={styles.requestInfo}>
                  <Text style={styles.requestTitle}>{req.title}</Text>
                  <Text style={styles.requestMeta}>Budget: ₹{req.price} · {req.category}</Text>
                </View>
                <TouchableOpacity
                  style={styles.viewBtn}
                  onPress={() => router.push('/(editor)/requests')}
                >
                  <Text style={styles.viewBtnText}>View</Text>
                </TouchableOpacity>
              </Animated.View>
            ))}
          </Animated.View>
        )}

        {/* ── ACTIVE JOBS ── */}
        <View style={styles.sectionRow}>
          <Text style={styles.sectionTitle}>In Progress ({activeJobs.length})</Text>
        </View>
        {activeJobs.length > 0 ? activeJobs.map((job, idx) => (
          <Animated.View entering={FadeInUp.delay(400 + idx * 60)} key={job.id}>
            <View style={styles.jobCard}>
              <View style={styles.jobHeader}>
                <View style={styles.jobStatusBadge}>
                  <Clock size={12} color="#4F46E5" />
                  <Text style={styles.jobStatusText}>{job.status} · {job.progress}%</Text>
                </View>
              </View>
              <Text style={styles.jobTitle}>{job.title} for {job.customer?.name || 'Client'}</Text>

              {/* Progress bar */}
              <View style={styles.jobProgressBg}>
                <View style={[styles.jobProgressFill, { width: `${job.progress || 0}%` as any }]} />
              </View>

              <TouchableOpacity
                style={styles.updateBtn}
                onPress={() => router.push('/(editor)/requests')}
              >
                <LinearGradient colors={['#4F46E5', '#7C3AED']} style={styles.updateBtnGrad}>
                  <Text style={styles.updateBtnText}>Update Progress</Text>
                  <ChevronRight size={16} color="#FFF" />
                </LinearGradient>
              </TouchableOpacity>
            </View>
          </Animated.View>
        )) : (
          <View style={styles.emptyBox}>
            <AlertCircle size={28} color="#DDD6FE" />
            <Text style={styles.emptyText}>No active jobs right now</Text>
          </View>
        )}

        {/* ── PORTFOLIO SAMPLES ── */}
        <View style={styles.sectionRow}>
          <Text style={styles.sectionTitle}>My Samples</Text>
          <TouchableOpacity onPress={() => router.push('/(editor)/portfolio')}>
            <Text style={styles.addNew}>+ Add New</Text>
          </TouchableOpacity>
        </View>
        {portfolioItems.length > 0 ? (
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 12, paddingBottom: 8 }}>
            {portfolioItems.map((item, i) => (
              <TouchableOpacity key={item.id || i} style={styles.sampleCard} onPress={() => {
                if (item.videoUrl) {
                  const url = item.videoUrl.includes('cloudinary.com') && !item.videoUrl.includes('q_auto')
                    ? item.videoUrl.replace('/upload/', '/upload/q_auto,f_auto/')
                    : item.videoUrl;
                  setSelectedVideoUrl(url);
                  setSelectedVideoTitle(item.title || 'Sample');
                  setVideoModalVisible(true);
                }
              }}>
                {item.thumbnail && !item.thumbnail.includes('unsplash') ? (
                  <Image source={{ uri: item.thumbnail }} style={styles.sampleImg} />
                ) : (
                  <LinearGradient
                    colors={[
                      ['#4F46E5', '#7C3AED'],
                      ['#F43F5E', '#E11D48'],
                      ['#10B981', '#059669'],
                      ['#F59E0B', '#D97706'],
                      ['#3B82F6', '#2563EB'],
                    ][i % 5] as [string, string]}
                    style={[styles.sampleImg, { alignItems: 'center', justifyContent: 'center' }]}
                  >
                    <Zap size={24} color="rgba(255,255,255,0.5)" />
                  </LinearGradient>
                )}
                {/* Play icon overlay */}
                <View style={styles.playOverlay}>
                  <Play size={20} color="#FFF" fill="#FFF" />
                </View>
                <View style={styles.sampleTimeBadge}>
                  <Zap size={9} color="#FFF" fill="#FFF" />
                  <Text style={styles.sampleTimeText} numberOfLines={1}>{item.title || 'Sample'}</Text>
                </View>
              </TouchableOpacity>
            ))}
          </ScrollView>
        ) : (
          <TouchableOpacity
            style={[styles.emptyBox, { marginBottom: 0 }]}
            onPress={() => router.push('/(editor)/portfolio')}
          >
            <Zap size={28} color="#DDD6FE" />
            <Text style={styles.emptyText}>No samples yet — tap to add your first!</Text>
          </TouchableOpacity>
        )}

        <View style={{ height: 110 }} />
      </View>

      {/* ── VIDEO PLAYER MODAL ── */}
      <Modal visible={videoModalVisible} animationType="slide" transparent onRequestClose={() => setVideoModalVisible(false)}>
        <View style={styles.videoModalBg}>
          <View style={styles.videoModalHeader}>
            <Text style={styles.videoModalTitle} numberOfLines={1}>{selectedVideoTitle}</Text>
            <TouchableOpacity onPress={() => setVideoModalVisible(false)} style={styles.videoModalClose}>
              <X size={20} color="#FFF" />
            </TouchableOpacity>
          </View>
          <View style={styles.videoModalPlayer}>
            {selectedVideoUrl ? (
              <Video
                source={{ uri: selectedVideoUrl }}
                style={{ width: '100%', height: '100%' }}
                useNativeControls
                resizeMode={ResizeMode.CONTAIN}
                isLooping
                shouldPlay={videoModalVisible}
              />
            ) : (
              <ActivityIndicator size="large" color="#FFF" />
            )}
          </View>
        </View>
      </Modal>

      {/* ── RAPID ALERT MODAL ── */}
      <Modal visible={requests.length > 0 && isOnline} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <Animated.View entering={FadeInUp} style={styles.alertCard}>
            <LinearGradient colors={['#4F46E5', '#7C3AED']} style={styles.alertGrad}>
              <Zap size={40} color="#FFF" fill="#FFF" />
              <Text style={styles.alertBadge}>⚡ NEW RAPID ORDER</Text>
              <Text style={styles.alertTitle}>{requests[0]?.title}</Text>
              <Text style={styles.alertPrice}>₹{requests[0]?.price}</Text>
              <View style={styles.alertTimerRow}>
                <Clock size={14} color="rgba(255,255,255,0.8)" />
                <Text style={styles.alertTimerText}>Delivery in {requests[0]?.initialETAMins} mins</Text>
              </View>
              <TouchableOpacity
                style={styles.claimBtn}
                onPress={async () => {
                  try {
                    const response = await api.post(`/orders/${requests[0].id}/claim`);
                    if (response.data.success) {
                      stopSound(); // Explicitly stop the sound before navigating
                      router.push('/(editor)/requests');
                    }
                  } catch (error: any) {
                    const msg = error.response?.data?.message || 'Project already claimed or unavailable.';
                    Alert.alert('Cannot Claim Project', msg);
                    fetchDashboardData();
                  }
                }}
              >
                <Text style={styles.claimText}>ACCEPT PROJECT NOW</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={async () => {
                const ignoredId = requests[0]?.id;
                if (ignoredId) {
                  globalIgnoredRequests.add(ignoredId);
                  ignoredRequestsRef.current.push(ignoredId);
                  
                  // Optimistically update the UI to instantly remove it
                  setRequests(prev => prev.filter(r => r.id !== ignoredId));

                  const ignoredLocal = await SecureStore.getItemAsync('ignored_orders');
                  const ignoredArr = ignoredLocal ? JSON.parse(ignoredLocal) : [];
                  if (!ignoredArr.includes(ignoredId)) {
                    ignoredArr.push(ignoredId);
                    await SecureStore.setItemAsync('ignored_orders', JSON.stringify(ignoredArr));
                  }
                } else {
                  setRequests([]);
                }
              }} style={{ marginTop: 18 }}>
                <Text style={{ color: 'rgba(255,255,255,0.6)', fontWeight: '700', fontSize: 14 }}>Ignore</Text>
              </TouchableOpacity>
            </LinearGradient>
          </Animated.View>
        </View>
      </Modal>

      {/* Global Background Call Listener for Active Jobs */}
      {isFocused && user && activeJobs.map(job => (
        <ChatModal 
          key={job.id}
          visible={false} 
          onClose={() => {}} 
          orderId={job.id} 
          currentUser={user} 
          onIncomingCall={(callerName?: string) => { 
            setIncomingCallData(job);
            setIsIncomingCall(true); 
            setShowStream(true); 
            if (callerName) setIncomingCallerName(callerName);
          }} 
        />
      ))}

      {showStream && user && incomingCallData && (
        <LiveStreamModal 
          visible={showStream} 
          onClose={() => { setShowStream(false); setIncomingCallerName(null); }} 
          roomId={`EditGo-Order-${incomingCallData.id}`}
          orderId={incomingCallData.id}
          currentUser={user}
          recipientName={incomingCallerName || incomingCallData.customer?.name || 'Client'}
          isIncoming={isIncomingCall}
        />
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8FAFC' },

  header: { paddingTop: 58, paddingBottom: 28, paddingHorizontal: 20, borderBottomLeftRadius: 32, borderBottomRightRadius: 32 },
  headerTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 18 },
  headerTitle: { fontSize: 26, fontWeight: '900', color: '#FFF' },
  headerSub: { fontSize: 13, color: 'rgba(255,255,255,0.8)', fontWeight: '600', marginTop: 2 },
  headerActions: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  switchBtn: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#F5F3FF', paddingHorizontal: 12, paddingVertical: 8, borderRadius: 12, gap: 6 },
  switchText: { fontSize: 12, fontWeight: '800', color: '#4F46E5' },
  bellWrap: { width: 40, height: 40, borderRadius: 12, backgroundColor: 'rgba(255,255,255,0.2)', alignItems: 'center', justifyContent: 'center' },
  dot: { position: 'absolute', top: 8, right: 8, width: 8, height: 8, borderRadius: 4, backgroundColor: '#EF4444', borderWidth: 2, borderColor: '#4F46E5' },

  badgeRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 },
  levelBadge: { flexDirection: 'row', alignItems: 'center', backgroundColor: 'rgba(255,255,255,0.15)', paddingHorizontal: 12, paddingVertical: 7, borderRadius: 12, gap: 6 },
  levelText: { color: '#FFF', fontSize: 11, fontWeight: '900' },
  onlineRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  onlineLabel: { color: '#FFF', fontSize: 11, fontWeight: '900' },

  progressWrap: {},
  progressTop: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8 },
  progressLabel: { color: 'rgba(255,255,255,0.8)', fontSize: 12, fontWeight: '600' },
  progressPercent: { color: '#FFF', fontSize: 12, fontWeight: '900' },
  progressBg: { height: 7, backgroundColor: 'rgba(255,255,255,0.2)', borderRadius: 4 },
  progressFill: { height: 7, backgroundColor: '#FFF', borderRadius: 4 },

  body: { padding: 20 },

  statsGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 12, marginBottom: 24 },
  statCell: { width: (width - 52) / 2 },
  statCard: { borderRadius: 18, padding: 16, overflow: 'hidden', elevation: 1 },
  statLabel: { fontSize: 11, color: '#64748B', fontWeight: '700', marginBottom: 6 },
  statValue: { fontSize: 22, fontWeight: '900' },
  accentBar: { position: 'absolute', top: 0, right: 0, width: 4, height: '100%', borderTopRightRadius: 18, borderBottomRightRadius: 18, opacity: 0.5 },

  sectionRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12, marginTop: 8 },
  sectionTitle: { fontSize: 17, fontWeight: '900', color: '#1E293B' },
  livePill: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#FEF2F2', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 10, gap: 5 },
  liveDot: { width: 6, height: 6, borderRadius: 3, backgroundColor: '#EF4444' },
  liveText: { fontSize: 10, fontWeight: '900', color: '#EF4444' },
  addNew: { fontSize: 13, fontWeight: '800', color: '#4F46E5' },

  requestCard: {
    flexDirection: 'row', alignItems: 'center', backgroundColor: '#FFF',
    borderRadius: 18, padding: 14, marginBottom: 10, gap: 12,
    borderWidth: 1, borderColor: '#EDE9FE',
    elevation: 1,
  },
  requestIconWrap: { width: 40, height: 40, borderRadius: 12, backgroundColor: '#EDE7F6', alignItems: 'center', justifyContent: 'center' },
  requestInfo: { flex: 1 },
  requestTitle: { fontSize: 14, fontWeight: '800', color: '#1E293B' },
  requestMeta: { fontSize: 12, color: '#64748B', marginTop: 3, fontWeight: '600' },
  viewBtn: { backgroundColor: '#4F46E5', paddingHorizontal: 14, paddingVertical: 8, borderRadius: 12 },
  viewBtnText: { color: '#FFF', fontWeight: '800', fontSize: 13 },

  jobCard: { backgroundColor: '#EDE7F6', borderRadius: 20, padding: 18, marginBottom: 12, borderWidth: 1, borderColor: '#DDD6FE' },
  jobHeader: { marginBottom: 8 },
  jobStatusBadge: { flexDirection: 'row', alignItems: 'center', gap: 5, alignSelf: 'flex-start', backgroundColor: '#FFF', paddingHorizontal: 10, paddingVertical: 5, borderRadius: 10 },
  jobStatusText: { fontSize: 11, fontWeight: '900', color: '#4F46E5' },
  jobTitle: { fontSize: 14, fontWeight: '700', color: '#1E293B', marginBottom: 14, lineHeight: 20 },
  jobProgressBg: { height: 6, backgroundColor: 'rgba(79,70,229,0.15)', borderRadius: 3, marginBottom: 14 },
  jobProgressFill: { height: 6, backgroundColor: '#4F46E5', borderRadius: 3 },
  updateBtn: { borderRadius: 14, overflow: 'hidden', elevation: 3 },
  updateBtnGrad: { flexDirection: 'row', justifyContent: 'center', alignItems: 'center', paddingVertical: 13, gap: 6 },
  updateBtnText: { color: '#FFF', fontWeight: '800', fontSize: 14 },

  emptyBox: { alignItems: 'center', paddingVertical: 32, backgroundColor: '#F8FAFC', borderRadius: 18, borderWidth: 2, borderStyle: 'dashed', borderColor: '#E2E8F0', marginBottom: 12 },
  emptyText: { color: '#94A3B8', fontWeight: '700', marginTop: 10, fontSize: 13 },

  sampleCard: { width: 130, height: 170, borderRadius: 18, overflow: 'hidden', elevation: 3 },
  sampleImg: { width: '100%', height: '100%' },
  sampleTimeBadge: { position: 'absolute', bottom: 10, left: 10, flexDirection: 'row', alignItems: 'center', backgroundColor: 'rgba(0,0,0,0.65)', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 8, gap: 4 },
  sampleTimeText: { color: '#FFF', fontSize: 10, fontWeight: '900' },
  playOverlay: { position: 'absolute', top: '50%', left: '50%', marginTop: -18, marginLeft: -18, width: 36, height: 36, borderRadius: 18, backgroundColor: 'rgba(0,0,0,0.5)', alignItems: 'center', justifyContent: 'center' },

  videoModalBg: { flex: 1, backgroundColor: '#0F172A', paddingTop: 60 },
  videoModalHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 20, paddingBottom: 16 },
  videoModalTitle: { color: '#FFF', fontSize: 18, fontWeight: '800', flex: 1, marginRight: 12 },
  videoModalClose: { width: 40, height: 40, borderRadius: 20, backgroundColor: 'rgba(255,255,255,0.1)', alignItems: 'center', justifyContent: 'center' },
  videoModalPlayer: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#000' },

  modalOverlay: { flex: 1, backgroundColor: 'rgba(15,23,42,0.9)', justifyContent: 'center', alignItems: 'center', padding: 24 },
  alertCard: { width: '100%', borderRadius: 32, overflow: 'hidden', elevation: 12 },
  alertGrad: { padding: 32, alignItems: 'center' },
  alertBadge: { color: '#FFF', fontSize: 12, fontWeight: '900', letterSpacing: 2, marginVertical: 12 },
  alertTitle: { color: '#FFF', fontSize: 22, fontWeight: '900', textAlign: 'center' },
  alertPrice: { color: '#4ADE80', fontSize: 28, fontWeight: '900', marginVertical: 10 },
  alertTimerRow: { flexDirection: 'row', alignItems: 'center', backgroundColor: 'rgba(255,255,255,0.1)', paddingHorizontal: 14, paddingVertical: 8, borderRadius: 12, gap: 8, marginBottom: 24 },
  alertTimerText: { color: '#FFF', fontWeight: '700', fontSize: 14 },
  claimBtn: { width: '100%', backgroundColor: '#FFF', paddingVertical: 18, borderRadius: 20, alignItems: 'center' },
  claimText: { color: '#4F46E5', fontSize: 16, fontWeight: '900', letterSpacing: 0.5 },
});
