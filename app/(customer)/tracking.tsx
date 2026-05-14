import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, ActivityIndicator, Alert, Linking, Modal, Image, TextInput, KeyboardAvoidingView, Platform } from 'react-native';
import { 
  ChevronLeft, Clock, CheckCircle2, 
  MapPin, Phone, MessageSquare, 
  Download, Play, AlertCircle, CreditCard,
  Lock, Unlock, ChevronRight, X,
  ShieldCheck, Smartphone
} from 'lucide-react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { GlassCard } from '../../src/components/ui/GlassCard';
import { LinearGradient } from 'expo-linear-gradient';
import { orderService } from '../../src/services/api';

export default function TrackingScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const id = params.id || params.orderId;
  const [order, setOrder] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [paying, setPaying] = useState(false);
  const [showCheckout, setShowCheckout] = useState(false);
  const [paymentStep, setPaymentStep] = useState(1); // 1: Methods, 1.5: PIN, 2: Processing, 3: Success
  const [upiPin, setUpiPin] = useState('');

  useEffect(() => {
    fetchOrder();
    const interval = setInterval(fetchOrder, 10000);
    return () => clearInterval(interval);
  }, [id]);

  const fetchOrder = async () => {
    try {
      const data = await orderService.getOrderById(id as string);
      if (data && data.order) {
        setOrder(data.order);
      }
    } catch (error) {
      console.error('[Tracking] Fetch Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const safeOpenURL = (url: string | null | undefined) => {
    if (!url) {
      Alert.alert('Not Available', 'Link is missing or invalid.');
      return;
    }
    Linking.openURL(url).catch(() => {
      Alert.alert('Error', 'Could not open this link.');
    });
  };

  const handlePay = async () => {
    if (paymentStep === 1) {
      setPaymentStep(1.5);
      return;
    }

    if (upiPin.length < 4) {
      Alert.alert('Invalid PIN', 'Please enter your 4 or 6 digit UPI PIN');
      return;
    }

    setPaymentStep(2);
    try {
      // Simulate Payment Gateway Delay
      setTimeout(async () => {
        const txnId = 'TXN_' + Math.random().toString(36).substr(2, 9).toUpperCase();
        await orderService.processPayment(order.id, txnId);
        setPaymentStep(3);
        fetchOrder();
      }, 3000);
    } catch (err) {
      Alert.alert('Error', 'Payment failed');
      setPaymentStep(1);
    }
  };

  if (loading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color="#8B5CF6" />
        <Text style={styles.loadingText}>Fetching live order status...</Text>
      </View>
    );
  }

  if (!order || !order.id) {
    return (
      <View style={styles.centerContainer}>
        <AlertCircle size={48} color="#EF4444" />
        <Text style={[styles.loadingText, { color: '#EF4444' }]}>Order not found or invalid.</Text>
        <TouchableOpacity onPress={() => router.back()} style={styles.retryBtn}>
          <Text style={styles.retryText}>Go Back</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const editor = order.editor;

  return (
    <View style={{ flex: 1 }}>
      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
            <ChevronLeft size={24} color="#1E293B" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Live Tracking</Text>
          <View style={{ width: 44 }} />
        </View>

        <View style={styles.content}>
          {/* Progress Card */}
          <GlassCard style={styles.progressCard}>
            <View style={styles.progressHeader}>
              <Text style={styles.orderId}>ORDER #{order.id.slice(-6).toUpperCase()}</Text>
              <View style={styles.statusBadge}>
                <Text style={styles.statusText}>{(order.status || 'SEARCHING').replace('_', ' ')}</Text>
              </View>
            </View>
            
            <Text style={styles.jobTitle}>{order.title || 'Video Project'}</Text>

            <View style={styles.progressContainer}>
              <View style={styles.progressBarBg}>
                <View style={[styles.progressBarFill, { width: `${order.progress || 0}%` }]} />
              </View>
              <View style={styles.progressStats}>
                <Text style={styles.progressPercent}>{order.progress || 0}% Done</Text>
                <Text style={styles.etaText}>ETA: 45 mins</Text>
              </View>
            </View>
          </GlassCard>

          {/* Editor Contact Card */}
          <Text style={styles.sectionTitle}>Assigned Expert</Text>
          <GlassCard style={styles.editorCard}>
            <View style={styles.editorInfo}>
              <View style={styles.editorAvatar}>
                <Text style={styles.avatarText}>{editor?.user?.name?.substring(0, 2).toUpperCase() || 'E'}</Text>
              </View>
              <View style={styles.editorDetails}>
                <Text style={styles.editorName}>{editor?.user?.name || 'Expert Editor'}</Text>
                <Text style={styles.editorRank}>{editor?.level || 'PRO'} EDITOR • 4.9 ★</Text>
              </View>
            </View>
            <View style={styles.contactActions}>
              <TouchableOpacity style={styles.contactBtn} onPress={() => safeOpenURL(`tel:${editor?.user?.phone}`)}>
                <Phone size={20} color="#10B981" />
              </TouchableOpacity>
              <TouchableOpacity style={styles.contactBtn} onPress={() => safeOpenURL(`sms:${editor?.user?.phone}`)}>
                <MessageSquare size={20} color="#8B5CF6" />
              </TouchableOpacity>
            </View>
          </GlassCard>

          {/* 3 Previews Section */}
          <Text style={styles.sectionTitle}>Draft Previews ({(order.previews || []).length}/3)</Text>
          {(order.previews || []).length > 0 ? (
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.previewsScroll}>
              {order.previews.map((p: string, i: number) => (
                <TouchableOpacity key={i} style={styles.previewItem} onPress={() => safeOpenURL(p)}>
                  <View style={styles.previewThumb}>
                    <Play size={24} color="#FFF" fill="#FFF" />
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

          {/* Final Delivery & Payment */}
          {order.status === 'COMPLETED' && (
            <View style={styles.finalSection}>
              <Text style={styles.sectionTitle}>Final Delivery</Text>
              <GlassCard style={styles.deliveryCard}>
                {!order.isPaid ? (
                  <>
                    <View style={styles.paymentLocked}>
                      <Lock size={32} color="#F59E0B" />
                      <Text style={styles.lockedTitle}>Payment Required</Text>
                      <Text style={styles.lockedDesc}>The editor has finished your project. Pay ₹{order.price} to unlock the HD video.</Text>
                    </View>
                    <TouchableOpacity style={styles.payBtn} onPress={() => { setPaymentStep(1); setShowCheckout(true); }}>
                      <CreditCard size={20} color="#FFF" />
                      <Text style={styles.payText}>Proceed to Checkout</Text>
                    </TouchableOpacity>
                  </>
                ) : (
                  <>
                    <View style={styles.paymentUnlocked}>
                      <CheckCircle2 size={32} color="#10B981" />
                      <Text style={styles.unlockedTitle}>Payment Successful!</Text>
                      <Text style={styles.unlockedDesc}>Thank you! Your high-quality cinematic video is ready for download.</Text>
                    </View>
                    <TouchableOpacity 
                      style={styles.downloadBtn} 
                      onPress={() => safeOpenURL(order.finalUrl)}
                    >
                      <Download size={20} color="#FFF" />
                      <Text style={styles.downloadBtnText}>Download Final HD Video</Text>
                    </TouchableOpacity>
                  </>
                )}
              </GlassCard>
            </View>
          )}

          {/* Timeline */}
          <Text style={styles.sectionTitle}>Timeline</Text>
          <View style={styles.timeline}>
            <TimelineItem title="Order Placed" time="10:30 AM" status="completed" />
            <TimelineItem title="Editor Assigned" time="10:35 AM" status="completed" />
            <TimelineItem title="Editing in Progress" time="Now" status="active" />
            <TimelineItem title="Quality Check" time="Pending" status="pending" />
          </View>

          <View style={{ height: 100 }} />
        </View>
      </ScrollView>

      {/* Checkout Modal (Mock Razorpay) */}
      <Modal visible={showCheckout} animationType="slide" transparent={true}>
        <View style={styles.checkoutOverlay}>
          <View style={styles.checkoutContent}>
            {paymentStep === 1 && (
              <>
                <View style={styles.checkoutHeader}>
                  <View>
                    <Text style={styles.checkoutTitle}>Checkout</Text>
                    <View style={styles.testBadge}><Text style={styles.testBadgeText}>TEST MODE</Text></View>
                  </View>
                  <TouchableOpacity onPress={() => setShowCheckout(false)}><X size={24} color="#1E293B" /></TouchableOpacity>
                </View>
                <View style={styles.checkoutAmountBox}>
                  <Text style={styles.checkoutLabel}>Total Amount</Text>
                  <Text style={styles.checkoutAmount}>₹{order.price}</Text>
                </View>
                <Text style={styles.paymentMethodLabel}>Payment Methods</Text>
                <TouchableOpacity style={styles.paymentMethod} onPress={handlePay}>
                  <View style={styles.methodLeft}>
                    <Smartphone size={20} color="#8B5CF6" />
                    <Text style={styles.methodText}>UPI (GPay, PhonePe, Paytm)</Text>
                  </View>
                  <ChevronRight size={18} color="#94A3B8" />
                </TouchableOpacity>
                <TouchableOpacity style={styles.paymentMethod} onPress={handlePay}>
                  <View style={styles.methodLeft}>
                    <CreditCard size={20} color="#8B5CF6" />
                    <Text style={styles.methodText}>Debit / Credit Card</Text>
                  </View>
                  <ChevronRight size={18} color="#94A3B8" />
                </TouchableOpacity>
                <View style={styles.secureBadge}>
                  <ShieldCheck size={16} color="#10B981" />
                  <Text style={styles.secureText}>Simulation: No real money will be charged</Text>
                </View>
              </>
            )}

            {paymentStep === 1.5 && (
              <View style={styles.pinBox}>
                <TouchableOpacity style={styles.modalBack} onPress={() => setPaymentStep(1)}>
                  <ChevronLeft size={20} color="#64748B" />
                  <Text style={styles.modalBackText}>Back</Text>
                </TouchableOpacity>
                <View style={styles.pinHeader}>
                  <Smartphone size={40} color="#8B5CF6" />
                  <Text style={styles.pinTitle}>Enter UPI PIN</Text>
                  <Text style={styles.pinDesc}>Enter any 4-digit PIN for testing</Text>
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
                  <Text style={styles.confirmBtnText}>Confirm Payment</Text>
                </TouchableOpacity>
              </View>
            )}

            {paymentStep === 2 && (
              <View style={styles.processingBox}>
                <ActivityIndicator size="large" color="#8B5CF6" />
                <Text style={styles.processingTitle}>Processing Payment...</Text>
                <Text style={styles.processingDesc}>Please do not close the app or refresh the page.</Text>
              </View>
            )}

            {paymentStep === 3 && (
              <View style={styles.successBox}>
                <View style={styles.successCircle}>
                  <CheckCircle2 size={64} color="#10B981" fill="#DCFCE7" />
                </View>
                <Text style={styles.successTitle}>Payment Successful!</Text>
                <Text style={styles.successDesc}>Your transaction has been completed successfully.</Text>
                <TouchableOpacity style={styles.finishBtn} onPress={() => setShowCheckout(false)}>
                  <Text style={styles.finishBtnText}>Go to Workspace</Text>
                </TouchableOpacity>
              </View>
            )}
          </View>
        </View>
      </Modal>
    </View>
  );
}

function TimelineItem({ title, time, status }: any) {
  return (
    <View style={styles.timelineItem}>
      <View style={styles.timelinePoint}>
        <View style={[
          styles.pointDot, 
          status === 'completed' && styles.dotCompleted,
          status === 'active' && styles.dotActive
        ]} />
        <View style={styles.pointLine} />
      </View>
      <View style={styles.timelineContent}>
        <Text style={[styles.timelineTitle, status === 'pending' && {color: '#94A3B8'}]}>{title}</Text>
        <Text style={styles.timelineTime}>{time}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8FAFC' },
  centerContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  loadingText: { marginTop: 16, color: '#64748B', fontWeight: '600' },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingTop: 60, paddingHorizontal: 24, paddingBottom: 20 },
  backBtn: { width: 44, height: 44, borderRadius: 14, backgroundColor: '#FFF', alignItems: 'center', justifyContent: 'center' },
  headerTitle: { fontSize: 18, fontWeight: '800', color: '#1E293B' },
  content: { padding: 24 },
  progressCard: { padding: 24, backgroundColor: '#FFF', borderRadius: 32 },
  progressHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 },
  orderId: { fontSize: 12, fontWeight: '800', color: '#94A3B8' },
  statusBadge: { backgroundColor: '#F5F3FF', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 8 },
  statusText: { color: '#8B5CF6', fontSize: 10, fontWeight: '800', textTransform: 'uppercase' },
  jobTitle: { fontSize: 20, fontWeight: '800', color: '#1E293B', marginBottom: 20 },
  progressContainer: { marginTop: 10 },
  progressBarBg: { height: 8, backgroundColor: '#F1F5F9', borderRadius: 4 },
  progressBarFill: { height: 8, backgroundColor: '#8B5CF6', borderRadius: 4 },
  progressStats: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 12 },
  progressPercent: { fontSize: 13, fontWeight: '700', color: '#1E293B' },
  etaText: { fontSize: 13, fontWeight: '700', color: '#64748B' },
  sectionTitle: { fontSize: 16, fontWeight: '800', color: '#1E293B', marginTop: 32, marginBottom: 16 },
  editorCard: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 16, backgroundColor: '#FFF', borderRadius: 24 },
  editorInfo: { flexDirection: 'row', alignItems: 'center' },
  editorAvatar: { width: 48, height: 48, borderRadius: 24, backgroundColor: '#F5F3FF', alignItems: 'center', justifyContent: 'center' },
  avatarText: { fontSize: 18, fontWeight: '800', color: '#8B5CF6' },
  editorDetails: { marginLeft: 16 },
  editorName: { fontSize: 16, fontWeight: '700', color: '#1E293B' },
  editorRank: { fontSize: 11, fontWeight: '800', color: '#94A3B8', marginTop: 2 },
  contactActions: { flexDirection: 'row' },
  contactBtn: { width: 40, height: 40, borderRadius: 12, backgroundColor: '#F8FAFC', alignItems: 'center', justifyContent: 'center', marginLeft: 8 },
  previewsScroll: { flexDirection: 'row' },
  previewItem: { marginRight: 16, alignItems: 'center' },
  previewThumb: { width: 120, height: 160, borderRadius: 20, backgroundColor: '#8B5CF6', alignItems: 'center', justifyContent: 'center' },
  previewLabel: { marginTop: 8, fontSize: 12, fontWeight: '700', color: '#64748B' },
  emptyCard: { padding: 30, backgroundColor: '#FFF', borderRadius: 24, alignItems: 'center', borderStyle: 'dashed', borderWidth: 1, borderColor: '#CBD5E1' },
  emptyText: { marginTop: 12, fontSize: 13, color: '#94A3B8', textAlign: 'center', fontWeight: '600' },
  finalSection: { marginTop: 10 },
  deliveryCard: { padding: 30, backgroundColor: '#FFF', borderRadius: 32, alignItems: 'center' },
  paymentLocked: { alignItems: 'center', marginBottom: 24 },
  lockedTitle: { fontSize: 18, fontWeight: '800', color: '#1E293B', marginTop: 16 },
  lockedDesc: { fontSize: 13, color: '#64748B', textAlign: 'center', marginTop: 8, lineHeight: 20 },
  payBtn: { backgroundColor: '#8B5CF6', paddingVertical: 18, paddingHorizontal: 30, borderRadius: 20, flexDirection: 'row', alignItems: 'center', shadowColor: '#8B5CF6', shadowOpacity: 0.3, shadowRadius: 10, elevation: 5 },
  payText: { color: '#FFF', fontSize: 15, fontWeight: '900', marginLeft: 10 },
  paymentUnlocked: { alignItems: 'center', marginBottom: 24 },
  unlockedTitle: { fontSize: 18, fontWeight: '800', color: '#10B981', marginTop: 16 },
  unlockedDesc: { fontSize: 13, color: '#64748B', textAlign: 'center', marginTop: 8, lineHeight: 20 },
  downloadBtn: { backgroundColor: '#10B981', paddingVertical: 18, paddingHorizontal: 30, borderRadius: 20, flexDirection: 'row', alignItems: 'center' },
  downloadBtnText: { color: '#FFF', fontSize: 15, fontWeight: '900', marginLeft: 10 },
  timeline: { paddingLeft: 12 },
  timelineItem: { flexDirection: 'row', marginBottom: 20 },
  timelinePoint: { alignItems: 'center', marginRight: 16 },
  pointDot: { width: 12, height: 12, borderRadius: 6, backgroundColor: '#E2E2E2' },
  dotCompleted: { backgroundColor: '#10B981' },
  dotActive: { backgroundColor: '#8B5CF6', borderWidth: 3, borderColor: '#DDD6FE' },
  pointLine: { width: 2, flex: 1, backgroundColor: '#E2E2E2', marginTop: 4 },
  timelineContent: { paddingTop: -2 },
  timelineTitle: { fontSize: 14, fontWeight: '700', color: '#1E293B' },
  timelineTime: { fontSize: 12, color: '#94A3B8', marginTop: 2 },
  retryBtn: { marginTop: 24, paddingHorizontal: 32, paddingVertical: 12, backgroundColor: '#EF4444', borderRadius: 12 },
  retryText: { color: '#FFF', fontWeight: '800' },

  // Checkout Styles
  checkoutOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'flex-end' },
  checkoutContent: { backgroundColor: '#FFF', borderTopLeftRadius: 32, borderTopRightRadius: 32, padding: 24, minHeight: 400 },
  checkoutHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 },
  checkoutTitle: { fontSize: 20, fontWeight: '900', color: '#1E293B' },
  testBadge: { backgroundColor: '#FEF3C7', paddingHorizontal: 6, paddingVertical: 2, borderRadius: 4, marginTop: 4, alignSelf: 'flex-start' },
  testBadgeText: { color: '#B45309', fontSize: 8, fontWeight: '900' },
  checkoutAmountBox: { backgroundColor: '#F8FAFC', padding: 20, borderRadius: 20, marginBottom: 24, alignItems: 'center' },
  checkoutLabel: { fontSize: 12, fontWeight: '700', color: '#64748B' },
  checkoutAmount: { fontSize: 32, fontWeight: '900', color: '#8B5CF6', marginTop: 4 },
  paymentMethodLabel: { fontSize: 14, fontWeight: '800', color: '#1E293B', marginBottom: 16 },
  paymentMethod: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 16, borderRadius: 16, backgroundColor: '#FFF', borderWidth: 1, borderColor: '#F1F5F9', marginBottom: 12 },
  methodLeft: { flexDirection: 'row', alignItems: 'center' },
  methodText: { fontSize: 14, fontWeight: '700', color: '#475569', marginLeft: 12 },
  secureBadge: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', marginTop: 20 },
  secureText: { fontSize: 12, fontWeight: '700', color: '#10B981', marginLeft: 6 },
  
  pinBox: { paddingVertical: 20 },
  modalBack: { flexDirection: 'row', alignItems: 'center', marginBottom: 20 },
  modalBackText: { fontSize: 14, color: '#64748B', fontWeight: '700', marginLeft: 4 },
  pinHeader: { alignItems: 'center', marginBottom: 30 },
  pinTitle: { fontSize: 22, fontWeight: '900', color: '#1E293B', marginTop: 15 },
  pinDesc: { fontSize: 14, color: '#64748B', marginTop: 5, fontWeight: '600' },
  pinInput: { fontSize: 40, letterSpacing: 20, textAlign: 'center', backgroundColor: '#F8FAFC', padding: 20, borderRadius: 20, color: '#8B5CF6', fontWeight: '900', marginBottom: 30 },
  confirmBtn: { backgroundColor: '#8B5CF6', paddingVertical: 18, borderRadius: 20, alignItems: 'center' },
  confirmBtnText: { color: '#FFF', fontSize: 16, fontWeight: '900' },

  processingBox: { flex: 1, alignItems: 'center', justifyContent: 'center', paddingVertical: 40 },
  processingTitle: { fontSize: 20, fontWeight: '900', color: '#1E293B', marginTop: 20 },
  processingDesc: { fontSize: 14, color: '#64748B', textAlign: 'center', marginTop: 10, lineHeight: 20 },
  successBox: { flex: 1, alignItems: 'center', justifyContent: 'center', paddingVertical: 20 },
  successCircle: { marginBottom: 24 },
  successTitle: { fontSize: 24, fontWeight: '900', color: '#10B981' },
  successDesc: { fontSize: 14, color: '#64748B', textAlign: 'center', marginTop: 12, lineHeight: 22, paddingHorizontal: 20 },
  finishBtn: { backgroundColor: '#10B981', paddingVertical: 16, paddingHorizontal: 40, borderRadius: 16, marginTop: 32 },
  finishBtnText: { color: '#FFF', fontSize: 16, fontWeight: '900' }
});
