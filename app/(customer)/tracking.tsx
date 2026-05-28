import React, { useState, useEffect } from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity,
  ActivityIndicator, Alert, Linking, Modal, Image, TextInput,
  KeyboardAvoidingView, Platform, StatusBar,
} from 'react-native';
import {
  ChevronLeft, Clock, CheckCircle2, Phone, MessageSquare, Download,
  Play, AlertCircle, CreditCard, Lock, Unlock, ChevronRight, X,
  ShieldCheck, Smartphone, Star, Zap,
} from 'lucide-react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { orderService, authService, customerService, BASE_URL } from '../../src/services/api';
import ChatModal from '../../src/components/ChatModal';
import axios from 'axios';
import Animated, { FadeInUp } from 'react-native-reanimated';
import * as WebBrowser from 'expo-web-browser';
import { Audio, Video as ExpoVideo, ResizeMode } from 'expo-av';

export default function TrackingScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const id = params.id || params.orderId;

  const previousStatusRef = React.useRef<string | null>(null);
  const previousPreviewsLengthRef = React.useRef<number>(0);

  const [order, setOrder] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [showCheckout, setShowCheckout] = useState(false);
  const [paymentStep, setPaymentStep] = useState(1); // 1: Methods, 1.5: PIN, 2: Processing, 3: Success
  const [upiPin, setUpiPin] = useState('');
  const [showChat, setShowChat] = useState(false);
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [showReview, setShowReview] = useState(false);
  const [rating, setRating] = useState(5);
  const [reviewText, setReviewText] = useState('');
  const [isSubmittingReview, setIsSubmittingReview] = useState(false);
  const [playingPreviewUrl, setPlayingPreviewUrl] = useState<string | null>(null);

  useEffect(() => {
    const playSound = async (type: 'accept' | 'preview' | 'completed') => {
      try {
        const uris = {
          accept: 'https://assets.mixkit.co/active_storage/sfx/2013/2013-preview.mp3', // Chime
          preview: 'https://assets.mixkit.co/active_storage/sfx/2869/2869-preview.mp3', // Notification pop
          completed: 'https://assets.mixkit.co/active_storage/sfx/1435/1435-preview.mp3', // Success/Ta-da
        };
        const { sound } = await Audio.Sound.createAsync(
          { uri: uris[type] },
          { shouldPlay: true, volume: 1.0 }
        );
        setTimeout(() => sound.unloadAsync(), 4000);
      } catch (error) {
        console.log(`Error playing ${type} sound`, error);
      }
    };

    if (order) {
      // 1. Check for editor acceptance
      if (previousStatusRef.current === 'SEARCHING' && order.status === 'ACCEPTED') {
        playSound('accept');
      }
      
      // 2. Check for final video completion
      if (previousStatusRef.current !== 'COMPLETED' && order.status === 'COMPLETED') {
        playSound('completed');
      }

      // 3. Check for new previews
      const currentPreviewsCount = order.previews?.length || 0;
      // We only want to play the preview sound if there's a new preview AND it's not the first load
      // To avoid playing it on initial load if previews already exist, check if previousStatusRef is set
      if (previousStatusRef.current !== null && currentPreviewsCount > previousPreviewsLengthRef.current) {
        playSound('preview');
      }

      previousStatusRef.current = order.status;
      previousPreviewsLengthRef.current = currentPreviewsCount;
    }
  }, [order]);

  useEffect(() => {
    fetchOrder();
    fetchUser();
    const interval = setInterval(fetchOrder, 6000);

    // AI Auto-Assign Simulation
    const autoAssignTimer = setTimeout(async () => {
      if (order?.status === 'SEARCHING') {
        try {
          await axios.patch(`${BASE_URL}/orders/${id}/status`, { status: 'ACCEPTED', progress: 5 });
          fetchOrder();
        } catch (e) {}
      }
    }, 15000);

    // Listen for deep link redirections (from Razorpay WebView checkout redirect)
    const handleDeepLink = (event: { url: string }) => {
      console.log('[Tracking] Received Deep Link:', event.url);
      if (event.url.includes('editgo://payment-success')) {
        // Dismiss WebBrowser overlay
        WebBrowser.dismissBrowser();
        
        // Parse params from deep link URL
        const parsedUrl = event.url.replace('editgo://', 'http://localhost/');
        const success = parsedUrl.includes('status=success');
        const cancel = parsedUrl.includes('status=cancel');
        
        if (success) {
          Alert.alert('Payment Successful! 🎉', 'Your high-res video has been unlocked successfully.', [
            { text: 'Awesome!', onPress: () => {
              setShowCheckout(false);
              fetchOrder();
            }}
          ]);
        } else if (cancel) {
          Alert.alert('Payment Cancelled', 'Payment checkout was cancelled.');
        } else {
          Alert.alert('Payment Failed', 'Something went wrong during payment verification.');
        }
      }
    };

    const subscription = Linking.addEventListener('url', handleDeepLink);
    
    Linking.getInitialURL().then((url) => {
      if (url) handleDeepLink({ url });
    });

    return () => {
      clearInterval(interval);
      clearTimeout(autoAssignTimer);
      subscription.remove();
    };
  }, [id, order?.status]);

  const fetchUser = async () => {
    try {
      const data = await authService.getMe();
      setCurrentUser(data);
    } catch (e) {}
  };

  const fetchOrder = async () => {
    try {
      const data = await orderService.getOrderById(id as string);
      if (data && data.order) setOrder(data.order);
    } catch (error) {
      console.error('[Tracking] Fetch Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const safeOpenURL = (url: string | null | undefined) => {
    if (!url) { Alert.alert('Not Available', 'Link is missing.'); return; }
    Linking.openURL(url).catch(() => Alert.alert('Error', 'Could not open link.'));
  };

  const handleLiveRazorpay = async () => {
    try {
      const checkoutUrl = `${BASE_URL.replace('/api', '')}/api/payments/checkout/${order.id}`;
      console.log('[Tracking] Launching Live Razorpay Checkout:', checkoutUrl);
      
      // Close Checkout modal before opening WebBrowser for better UX
      setShowCheckout(false);
      
      // Open custom Razorpay Checkout in-app browser overlay
      await WebBrowser.openBrowserAsync(checkoutUrl);
    } catch (err: any) {
      console.error('[Tracking] Razorpay Launch Error:', err);
      Alert.alert('Error', 'Failed to launch Razorpay payment portal.');
    }
  };

  const handlePay = async () => {
    if (paymentStep === 1) { setPaymentStep(1.5); return; }
    if (upiPin.length < 4) { Alert.alert('Invalid PIN', 'Enter a 4-digit UPI PIN'); return; }

    setPaymentStep(2);
    try {
      setTimeout(async () => {
        const txnId = 'TXN_' + Math.random().toString(36).substr(2, 9).toUpperCase();
        await orderService.processPayment(order.id, txnId);
        setPaymentStep(3);
        fetchOrder();
      }, 2500);
    } catch (err) {
      Alert.alert('Error', 'Payment failed');
      setPaymentStep(1);
    }
  };

  if (loading) return (
    <View style={styles.centerContainer}>
      <ActivityIndicator size="large" color="#7C3AED" />
      <Text style={styles.loadingText}>Fetching live order status...</Text>
    </View>
  );

  if (!order || !order.id) return (
    <View style={styles.centerContainer}>
      <AlertCircle size={48} color="#EF4444" />
      <Text style={[styles.loadingText, { color: '#EF4444' }]}>Order not found.</Text>
      <TouchableOpacity onPress={() => router.back()} style={styles.retryBtn}>
        <Text style={styles.retryText}>Go Back</Text>
      </TouchableOpacity>
    </View>
  );

  const editor = order.editor;

  return (
    <View style={{ flex: 1, backgroundColor: '#F8FAFC' }}>
      <StatusBar barStyle="light-content" backgroundColor="#7C3AED" />

      {/* Header */}
      <LinearGradient colors={['#7C3AED', '#5B21B6']} style={styles.header}>
        <View style={styles.headerRow}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
            <ChevronLeft size={22} color="#FFF" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Live Tracking</Text>
          <View style={{ width: 38 }} />
        </View>

        {/* Progress Card */}
        <Animated.View entering={FadeInUp.delay(100)} style={styles.progressCard}>
          <View style={styles.progressHeader}>
            <Text style={styles.orderId}>ORDER #{order.id.slice(-6).toUpperCase()}</Text>
            <View style={styles.statusBadge}>
              <Text style={styles.statusBadgeText}>{(order.status || 'SEARCHING').replace('_', ' ')}</Text>
            </View>
          </View>

          <Text style={styles.jobTitle} numberOfLines={1}>{order.title || 'Video Project'}</Text>

          <View style={styles.progressContainer}>
            <View style={styles.progressBarBg}>
              <View style={[styles.progressBarFill, { width: `${order.progress || 0}%` as any }]} />
            </View>
            <View style={styles.progressStats}>
              <Text style={styles.progressPercent}>{order.progress || 0}% Done</Text>
              <View style={styles.countdownContainer}>
                <Clock size={12} color="#7C3AED" />
                <Text style={styles.etaText}>
                  {(() => {
                    if (!order.editorId || !order.acceptedAt) return 'Waiting for editor...';
                    const startTime = new Date(order.acceptedAt).getTime();
                    const initialMins = order.initialETAMins || 45;
                    const elapsedMins = (new Date().getTime() - startTime) / (1000 * 60);
                    const remaining = Math.max(0, Math.round(initialMins - elapsedMins));
                    return order.progress >= 100 ? 'Delivered' : remaining <= 0 ? 'Any second now!' : `${remaining}m remaining`;
                  })()}
                </Text>
              </View>
            </View>
          </View>
        </Animated.View>
      </LinearGradient>

      <ScrollView style={styles.scroll} showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 120 }}>
        <View style={styles.body}>

          {/* Editor Details */}
          {editor ? (
            <Animated.View entering={FadeInUp.delay(150)}>
              <Text style={styles.sectionTitle}>Assigned Expert</Text>
              <View style={styles.editorCard}>
                <TouchableOpacity 
                  style={styles.editorInfo} 
                  onPress={() => router.push(`/(customer)/editor/${editor.id}`)}
                >
                  <View style={styles.editorAvatar}>
                    <Text style={styles.avatarText}>{(editor?.user?.name || 'E').substring(0, 2).toUpperCase()}</Text>
                  </View>
                  <View style={{ marginLeft: 12 }}>
                    <Text style={styles.editorName}>{editor?.user?.name || 'Expert Editor'}</Text>
                    <Text style={styles.editorRank}>{editor?.level || 'PRO'} EDITOR • 4.9 ★</Text>
                  </View>
                </TouchableOpacity>
                <View style={styles.contactActions}>
                  <TouchableOpacity style={[styles.contactBtn, { backgroundColor: '#EDE7F6' }]} onPress={() => setShowChat(true)}>
                    <MessageSquare size={18} color="#7C3AED" />
                  </TouchableOpacity>
                  <TouchableOpacity style={[styles.contactBtn, { backgroundColor: '#E8F5E9' }]} onPress={() => safeOpenURL(`tel:${editor?.user?.phone}`)}>
                    <Phone size={18} color="#2E7D32" />
                  </TouchableOpacity>
                </View>
              </View>
            </Animated.View>
          ) : (
            <Animated.View entering={FadeInUp.delay(150)} style={styles.waitingCard}>
              <ActivityIndicator color="#7C3AED" size="small" />
              <Text style={styles.waitingText}>Finding the best rapid editor for your project...</Text>
            </Animated.View>
          )}

          {/* Draft Previews */}
          <Text style={styles.sectionTitle}>Draft Previews ({(order.previews || []).length}/3)</Text>
          {(order.previews || []).length > 0 ? (
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 12 }}>
              {order.previews.map((p: string, i: number) => (
                <TouchableOpacity key={i} style={styles.previewCard} onPress={() => setPlayingPreviewUrl(p)}>
                  <View style={styles.previewThumb}>
                    <Play size={20} color="#FFF" fill="#FFF" />
                  </View>
                  <Text style={styles.previewLabel}>Draft v{i + 1}</Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          ) : (
            <View style={styles.emptyCard}>
              <Clock size={20} color="#94A3B8" />
              <Text style={styles.emptyText}>Editor is working on your first draft...</Text>
            </View>
          )}

          {/* Final Video Deliverable */}
          {order.status === 'COMPLETED' && (
            <Animated.View entering={FadeInUp.delay(200)}>
              <View style={s.secHeader}>
                <Text style={styles.sectionTitle}>Final Deliverable</Text>
                <View style={styles.readyBadge}>
                  <Zap size={10} color="#FFF" fill="#FFF" />
                  <Text style={styles.readyText}>READY</Text>
                </View>
              </View>

              <View style={[styles.deliverCard, order.isPaid && styles.deliverCardPaid]}>
                {!order.isPaid ? (
                  <View style={styles.lockBox}>
                    <View style={styles.lockIconCircle}>
                      <Lock size={26} color="#FB8C00" />
                    </View>
                    <Text style={styles.lockedTitle}>Video Locked</Text>
                    <Text style={styles.lockedDesc}>The final HD render is ready! Pay the final amount to download your project.</Text>
                    <TouchableOpacity style={styles.payBtn} onPress={() => { setPaymentStep(1); setShowCheckout(true); }}>
                      <LinearGradient colors={['#7C3AED', '#5B21B6']} style={styles.payGrad}>
                        <CreditCard size={18} color="#FFF" />
                        <Text style={styles.payBtnText}>PAY ₹{order.price} &amp; UNLOCK</Text>
                      </LinearGradient>
                    </TouchableOpacity>
                  </View>
                ) : (
                  <View style={styles.lockBox}>
                    <View style={[styles.lockIconCircle, { backgroundColor: '#E8F5E9' }]}>
                      <CheckCircle2 size={26} color="#2E7D32" />
                    </View>
                    <Text style={[styles.lockedTitle, { color: '#2E7D32' }]}>Video Unlocked! 🚀</Text>
                    <Text style={styles.lockedDesc}>Your high-resolution video is ready to be exported. Tap download below.</Text>
                    <TouchableOpacity
                      style={styles.downloadBtn}
                      onPress={() => {
                        safeOpenURL(order.finalUrl);
                        setTimeout(() => setShowReview(true), 2500);
                      }}
                    >
                      <Download size={18} color="#FFF" />
                      <Text style={styles.downloadText}>Download HD Video</Text>
                    </TouchableOpacity>
                  </View>
                )}
              </View>
            </Animated.View>
          )}

          {/* Timeline */}
          <Text style={styles.sectionTitle}>Timeline</Text>
          <View style={styles.timeline}>
            <TimelineRow title="Order Placed" subtitle="Rapid project initialized successfully" time="10:30 AM" done />
            <TimelineRow title="Editor Assigned" subtitle={editor ? `${editor.user?.name} joined workspace` : 'Waiting for matching'} time="10:35 AM" done={!!editor} />
            <TimelineRow title="Draft Handover" subtitle="Client checking live drafts" time="Live" done={order.previews?.length > 0} active={order.status === 'EDITING_STARTED'} />
            <TimelineRow title="Quality Approval" subtitle="HD video delivery and payout clearance" time="Pending" done={order.status === 'COMPLETED'} />
          </View>

        </View>
      </ScrollView>

      {/* UPI Checkout Modal */}
      <Modal visible={showCheckout} animationType="slide" transparent>
        <View style={styles.modalOverlay}>
          <View style={styles.modalSheet}>
            {paymentStep === 1 && (
              <>
                <View style={styles.modalHeader}>
                  <View>
                    <Text style={styles.modalTitle}>Secure Checkout</Text>
                    <View style={styles.testBadge}><Text style={styles.testText}>TESTING SIMULATOR</Text></View>
                  </View>
                  <TouchableOpacity onPress={() => setShowCheckout(false)}>
                    <X size={20} color="#1E293B" />
                  </TouchableOpacity>
                </View>

                <View style={styles.priceCard}>
                  <Text style={styles.pcLabel}>Total Amount</Text>
                  <Text style={styles.pcValue}>₹{order.price}</Text>
                </View>

                {/* Live Razorpay Checkout */}
                <TouchableOpacity style={styles.livePayBtn} onPress={handleLiveRazorpay}>
                  <LinearGradient colors={['#7C3AED', '#5B21B6']} style={styles.livePayGrad}>
                    <CreditCard size={18} color="#FFF" />
                    <Text style={styles.livePayText}>PAY LIVE WITH RAZORPAY</Text>
                  </LinearGradient>
                </TouchableOpacity>

                {/* Divider */}
                <View style={styles.dividerRow}>
                  <View style={styles.dividerLine} />
                  <Text style={styles.dividerText}>OR TEST SANDBOX</Text>
                  <View style={styles.dividerLine} />
                </View>

                {/* Mock/Simulated payment method selectors */}
                <TouchableOpacity style={styles.methodCard} onPress={handlePay}>
                  <View style={styles.methodLeft}>
                    <Smartphone size={20} color="#7C3AED" />
                    <Text style={styles.methodText}>Simulated UPI (Mock Pay)</Text>
                  </View>
                  <ChevronRight size={18} color="#CBD5E1" />
                </TouchableOpacity>

                <TouchableOpacity style={styles.methodCard} onPress={handlePay}>
                  <View style={styles.methodLeft}>
                    <CreditCard size={20} color="#7C3AED" />
                    <Text style={styles.methodText}>Simulated Card (Mock Pay)</Text>
                  </View>
                  <ChevronRight size={18} color="#CBD5E1" />
                </TouchableOpacity>

                <View style={styles.infoBadge}>
                  <ShieldCheck size={16} color="#2E7D32" />
                  <Text style={styles.infoBadgeText}>Live Razorpay or simulated sandbox testing</Text>
                </View>
              </>
            )}

            {paymentStep === 1.5 && (
              <View style={{ paddingVertical: 10 }}>
                <TouchableOpacity style={styles.modalBack} onPress={() => setPaymentStep(1)}>
                  <ChevronLeft size={18} color="#64748B" />
                  <Text style={styles.modalBackText}>Back</Text>
                </TouchableOpacity>
                <View style={{ alignItems: 'center', marginBottom: 20 }}>
                  <Smartphone size={38} color="#7C3AED" />
                  <Text style={styles.pinTitle}>Enter UPI PIN</Text>
                  <Text style={styles.pinDesc}>Enter any 4-digit code to unlock</Text>
                </View>
                <TextInput
                  style={styles.pinInput}
                  placeholder="X X X X"
                  placeholderTextColor="#CBD5E1"
                  keyboardType="number-pad"
                  maxLength={4}
                  secureTextEntry
                  value={upiPin}
                  onChangeText={setUpiPin}
                  autoFocus
                />
                <TouchableOpacity style={styles.confirmBtn} onPress={handlePay}>
                  <Text style={styles.confirmText}>Confirm Payment</Text>
                </TouchableOpacity>
              </View>
            )}

            {paymentStep === 2 && (
              <View style={styles.processingBox}>
                <ActivityIndicator size="large" color="#7C3AED" />
                <Text style={styles.procTitle}>Verifying Transaction...</Text>
                <Text style={styles.procSub}>Please do not close or minimize the app</Text>
              </View>
            )}

            {paymentStep === 3 && (
              <View style={styles.processingBox}>
                <View style={styles.successCircle}>
                  <CheckCircle2 size={54} color="#2E7D32" fill="#E8F5E9" />
                </View>
                <Text style={styles.procTitleSuccess}>Payment Received! 🎉</Text>
                <Text style={styles.procSub}>HD Render has been unlocked successfully.</Text>
                <TouchableOpacity style={styles.finishBtn} onPress={() => setShowCheckout(false)}>
                  <Text style={styles.finishBtnText}>Go to Workspace</Text>
                </TouchableOpacity>
              </View>
            )}
          </View>
        </View>
      </Modal>

      {/* Chat Modal */}
      {currentUser && (
        <ChatModal visible={showChat} onClose={() => setShowChat(false)} orderId={id} currentUser={currentUser} />
      )}

      {/* Review Modal */}
      <Modal visible={showReview} animationType="slide" transparent>
        <View style={styles.reviewOverlay}>
          <View style={styles.reviewCardContent}>
            <View style={styles.revHeader}>
              <Text style={styles.revTitle}>Rate Your Editor</Text>
              <TouchableOpacity onPress={() => setShowReview(false)}>
                <X size={20} color="#64748B" />
              </TouchableOpacity>
            </View>

            <View style={styles.ratingRow}>
              {[1, 2, 3, 4, 5].map(s => (
                <TouchableOpacity key={s} onPress={() => setRating(s)}>
                  <Star size={36} color={s <= rating ? '#FB8C00' : '#E2E8F0'} fill={s <= rating ? '#FB8C00' : 'transparent'} />
                </TouchableOpacity>
              ))}
            </View>

            <TextInput
              style={styles.reviewInput}
              placeholder="What did you like about this edit?"
              placeholderTextColor="#94A3B8"
              multiline
              value={reviewText}
              onChangeText={setReviewText}
            />

            <TouchableOpacity
              style={styles.submitRevBtn}
              onPress={async () => {
                setIsSubmittingReview(true);
                try {
                  await customerService.submitReview(order.id, rating, reviewText);
                  setShowReview(false);
                  Alert.alert('Thank You! 🙏', 'Your feedback has been delivered to the editor.');
                } catch (error: any) {
                  Alert.alert('Error', error.response?.data?.message || 'Failed to submit review');
                } finally {
                  setIsSubmittingReview(false);
                }
              }}
            >
              {isSubmittingReview ? <ActivityIndicator color="#FFF" /> : <Text style={styles.submitRevText}>Submit Review</Text>}
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Video Preview Modal */}
      <Modal visible={!!playingPreviewUrl} animationType="fade" transparent onRequestClose={() => setPlayingPreviewUrl(null)}>
        <View style={styles.videoModalOverlay}>
          <View style={styles.videoModalContent}>
            <TouchableOpacity style={styles.closeVideoBtn} onPress={() => setPlayingPreviewUrl(null)}>
              <X size={28} color="#FFF" />
            </TouchableOpacity>
            {playingPreviewUrl && (
              <ExpoVideo
                style={{ width: '100%', height: '50%', backgroundColor: '#000', borderRadius: 16 }}
                source={{ uri: playingPreviewUrl }}
                useNativeControls
                resizeMode={ResizeMode.CONTAIN}
                shouldPlay
              />
            )}
          </View>
        </View>
      </Modal>
    </View>
  );
}

function TimelineRow({ title, subtitle, time, done, active }: any) {
  return (
    <View style={styles.tlRow}>
      <View style={styles.tlPoint}>
        <View style={[styles.tlDot, done && styles.tlDotDone, active && styles.tlDotActive]} />
        <View style={styles.tlLine} />
      </View>
      <View style={{ flex: 1, paddingBottom: 20 }}>
        <View style={styles.tlHeader}>
          <Text style={[styles.tlTitle, !done && !active && { color: '#94A3B8' }]}>{title}</Text>
          <Text style={styles.tlTime}>{time}</Text>
        </View>
        <Text style={styles.tlSub}>{subtitle}</Text>
      </View>
    </View>
  );
}

const s = StyleSheet.create({
  secHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 },
});

const styles = StyleSheet.create({
  centerContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#F8FAFC' },
  loadingText: { marginTop: 12, color: '#64748B', fontWeight: '700', fontSize: 14 },
  retryBtn: { marginTop: 20, paddingHorizontal: 24, paddingVertical: 12, backgroundColor: '#EF4444', borderRadius: 12 },
  retryText: { color: '#FFF', fontWeight: '800' },

  header: { paddingTop: 58, paddingHorizontal: 20, paddingBottom: 110, borderBottomLeftRadius: 32, borderBottomRightRadius: 32 },
  headerRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 },
  backBtn: { width: 38, height: 38, borderRadius: 12, backgroundColor: 'rgba(255,255,255,0.2)', alignItems: 'center', justifyContent: 'center' },
  headerTitle: { fontSize: 18, fontWeight: '900', color: '#FFF' },

  progressCard: {
    backgroundColor: '#FFF', borderRadius: 24, padding: 20,
    position: 'absolute', top: 110, left: 20, right: 20, zIndex: 10,
    elevation: 4, shadowColor: '#7C3AED', shadowOpacity: 0.1, shadowRadius: 12,
  },
  progressHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 },
  orderId: { fontSize: 11, fontWeight: '900', color: '#94A3B8' },
  statusBadge: { backgroundColor: '#EDE7F6', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 8 },
  statusBadgeText: { color: '#7C3AED', fontSize: 10, fontWeight: '800', textTransform: 'uppercase' },
  jobTitle: { fontSize: 18, fontWeight: '900', color: '#1E293B', marginBottom: 16 },
  progressContainer: {},
  progressBarBg: { height: 7, backgroundColor: '#F1F5F9', borderRadius: 4, overflow: 'hidden' },
  progressBarFill: { height: '100%', backgroundColor: '#7C3AED', borderRadius: 4 },
  progressStats: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 10 },
  progressPercent: { fontSize: 13, fontWeight: '800', color: '#1E293B' },
  countdownContainer: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#EDE7F6', paddingHorizontal: 10, paddingVertical: 5, borderRadius: 8, gap: 5 },
  etaText: { fontSize: 12, fontWeight: '800', color: '#7C3AED' },

  scroll: { flex: 1, marginTop: 100 },
  body: { padding: 20 },
  sectionTitle: { fontSize: 16, fontWeight: '900', color: '#1E293B', marginTop: 24, marginBottom: 12 },

  editorCard: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#FFF', borderRadius: 20, padding: 14, elevation: 1 },
  editorInfo: { flexDirection: 'row', alignItems: 'center' },
  editorAvatar: { width: 44, height: 44, borderRadius: 22, backgroundColor: '#EDE7F6', alignItems: 'center', justifyContent: 'center' },
  avatarText: { fontSize: 16, fontWeight: '900', color: '#7C3AED' },
  editorName: { fontSize: 15, fontWeight: '800', color: '#1E293B' },
  editorRank: { fontSize: 10, fontWeight: '800', color: '#94A3B8', marginTop: 2 },
  contactActions: { flexDirection: 'row', gap: 8 },
  contactBtn: { width: 38, height: 38, borderRadius: 12, alignItems: 'center', justifyContent: 'center' },

  waitingCard: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#FFF', borderRadius: 20, padding: 16, borderStyle: 'dashed', borderWidth: 1.5, borderColor: '#CBD5E1', gap: 10 },
  waitingText: { fontSize: 12, color: '#64748B', fontWeight: '700', flex: 1 },

  previewCard: { width: 110, alignItems: 'center' },
  previewThumb: { width: 110, height: 140, borderRadius: 18, backgroundColor: '#7C3AED', alignItems: 'center', justifyContent: 'center', elevation: 2 },
  previewLabel: { fontSize: 11, color: '#64748B', fontWeight: '800', marginTop: 6 },
  emptyCard: { padding: 24, backgroundColor: '#FFF', borderRadius: 20, alignItems: 'center', borderStyle: 'dashed', borderWidth: 1.5, borderColor: '#CBD5E1' },
  emptyText: { fontSize: 12, color: '#94A3B8', fontWeight: '700', marginTop: 10 },

  readyBadge: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#10B981', paddingHorizontal: 8, paddingVertical: 3, borderRadius: 6, gap: 3 },
  readyText: { color: '#FFF', fontSize: 9, fontWeight: '900' },
  deliverCard: { backgroundColor: '#FFF', borderRadius: 24, padding: 24, elevation: 2 },
  deliverCardPaid: { borderColor: '#10B981', borderWidth: 1.5 },
  lockBox: { alignItems: 'center' },
  lockIconCircle: { width: 56, height: 56, borderRadius: 28, backgroundColor: '#FFF3E0', alignItems: 'center', justifyContent: 'center', marginBottom: 12 },
  lockedTitle: { fontSize: 17, fontWeight: '900', color: '#1E293B' },
  lockedDesc: { fontSize: 12, color: '#64748B', fontWeight: '600', textAlign: 'center', marginTop: 6, lineHeight: 18, paddingHorizontal: 8, marginBottom: 18 },
  payBtn: { width: '100%', borderRadius: 16, overflow: 'hidden' },
  payGrad: { flexDirection: 'row', justifyContent: 'center', alignItems: 'center', paddingVertical: 15, gap: 8 },
  payBtnText: { color: '#FFF', fontSize: 14, fontWeight: '900', letterSpacing: 0.5 },
  downloadBtn: { flexDirection: 'row', justifyContent: 'center', alignItems: 'center', backgroundColor: '#2E7D32', paddingVertical: 15, borderRadius: 16, gap: 8, width: '100%' },
  downloadText: { color: '#FFF', fontSize: 14, fontWeight: '900' },

  tlRow: { flexDirection: 'row', gap: 14 },
  tlPoint: { alignItems: 'center' },
  tlDot: { width: 10, height: 10, borderRadius: 5, backgroundColor: '#E2E8F0', marginTop: 4 },
  tlDotDone: { backgroundColor: '#10B981' },
  tlDotActive: { backgroundColor: '#7C3AED', borderWidth: 2.5, borderColor: '#EDE7F6' },
  tlLine: { width: 2, flex: 1, backgroundColor: '#E2E8F0', marginTop: 4 },
  tlHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 3 },
  tlTitle: { fontSize: 14, fontWeight: '800', color: '#1E293B' },
  tlTime: { fontSize: 11, color: '#94A3B8', fontWeight: '700' },
  tlSub: { fontSize: 12, color: '#64748B', fontWeight: '600' },

  // UPI MODAL
  modalOverlay: { flex: 1, backgroundColor: 'rgba(15,23,42,0.6)', justifyContent: 'flex-end' },
  modalSheet: { backgroundColor: '#FFF', borderTopLeftRadius: 28, borderTopRightRadius: 28, padding: 24, minHeight: 380 },
  modalHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 },
  modalTitle: { fontSize: 18, fontWeight: '900', color: '#1E293B' },
  testBadge: { backgroundColor: '#FEF3C7', paddingHorizontal: 6, paddingVertical: 2, borderRadius: 4, marginTop: 4, alignSelf: 'flex-start' },
  testText: { color: '#D97706', fontSize: 8, fontWeight: '900' },
  priceCard: { backgroundColor: '#F8FAFC', padding: 18, borderRadius: 16, alignItems: 'center', marginBottom: 20 },
  pcLabel: { fontSize: 11, fontWeight: '700', color: '#64748B' },
  pcValue: { fontSize: 28, fontWeight: '900', color: '#7C3AED', marginTop: 2 },
  secSubTitle: { fontSize: 13, fontWeight: '900', color: '#1E293B', marginBottom: 12 },
  methodCard: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 14, borderRadius: 14, backgroundColor: '#FFF', borderWidth: 1, borderColor: '#F1F5F9', marginBottom: 10 },
  methodLeft: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  methodText: { fontSize: 13, fontWeight: '800', color: '#475569' },
  infoBadge: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6, marginTop: 18 },
  infoBadgeText: { fontSize: 11, fontWeight: '800', color: '#2E7D32' },

  modalBack: { flexDirection: 'row', alignItems: 'center', gap: 4, marginBottom: 16 },
  modalBackText: { fontSize: 13, color: '#64748B', fontWeight: '800' },
  pinTitle: { fontSize: 20, fontWeight: '900', color: '#1E293B', marginTop: 10 },
  pinDesc: { fontSize: 13, color: '#64748B', fontWeight: '600', marginTop: 2 },
  pinInput: { fontSize: 32, letterSpacing: 18, textAlign: 'center', backgroundColor: '#F8FAFC', padding: 16, borderRadius: 16, color: '#7C3AED', fontWeight: '900', marginVertical: 20 },
  confirmBtn: { backgroundColor: '#7C3AED', paddingVertical: 16, borderRadius: 16, alignItems: 'center' },
  confirmText: { color: '#FFF', fontSize: 15, fontWeight: '900' },

  processingBox: { alignItems: 'center', justifyContent: 'center', paddingVertical: 32 },
  procTitle: { fontSize: 18, fontWeight: '900', color: '#1E293B', marginTop: 14 },
  procTitleSuccess: { fontSize: 20, fontWeight: '900', color: '#2E7D32', marginTop: 14 },
  procSub: { fontSize: 13, color: '#64748B', fontWeight: '600', textAlign: 'center', marginTop: 6 },
  successCircle: { width: 72, height: 72, borderRadius: 36, backgroundColor: '#E8F5E9', alignItems: 'center', justifyContent: 'center' },
  finishBtn: { backgroundColor: '#2E7D32', paddingVertical: 14, paddingHorizontal: 32, borderRadius: 14, marginTop: 24 },
  finishBtnText: { color: '#FFF', fontSize: 14, fontWeight: '900' },

  // REVIEW MODAL
  reviewOverlay: { flex: 1, backgroundColor: 'rgba(15,23,42,0.6)', justifyContent: 'center', alignItems: 'center', padding: 20 },
  reviewCardContent: { backgroundColor: '#FFF', borderRadius: 28, padding: 20, width: '100%', alignItems: 'center' },
  revHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', width: '100%', marginBottom: 20 },
  revTitle: { fontSize: 18, fontWeight: '900', color: '#1E293B' },
  ratingRow: { flexDirection: 'row', gap: 8, marginBottom: 20 },
  reviewInput: { width: '100%', backgroundColor: '#F8FAFC', borderRadius: 14, padding: 14, height: 90, fontSize: 14, color: '#1E293B', textAlignVertical: 'top', fontWeight: '600', marginBottom: 20, borderWidth: 1, borderColor: '#E2E8F0' },
  submitRevBtn: { width: '100%', backgroundColor: '#7C3AED', paddingVertical: 16, borderRadius: 14, alignItems: 'center' },
  submitRevText: { color: '#FFF', fontSize: 15, fontWeight: '900' },

  livePayBtn: { width: '100%', borderRadius: 16, overflow: 'hidden', marginBottom: 16, marginTop: 4, elevation: 4, shadowColor: '#7C3AED', shadowOpacity: 0.2, shadowRadius: 8 },
  livePayGrad: { flexDirection: 'row', justifyContent: 'center', alignItems: 'center', paddingVertical: 16, gap: 8 },
  livePayText: { color: '#FFF', fontSize: 14, fontWeight: '900', letterSpacing: 0.5 },

  dividerRow: { flexDirection: 'row', alignItems: 'center', marginVertical: 14, gap: 10 },
  dividerLine: { flex: 1, height: 1, backgroundColor: '#E2E8F0' },
  dividerText: { fontSize: 10, fontWeight: '800', color: '#94A3B8' },

  videoModalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.95)', justifyContent: 'center', alignItems: 'center', padding: 20 },
  videoModalContent: { width: '100%', alignItems: 'center', justifyContent: 'center' },
  closeVideoBtn: { position: 'absolute', top: -50, right: 0, zIndex: 10, padding: 10 },
});
