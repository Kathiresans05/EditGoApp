import React, { useState, useEffect } from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput,
  Dimensions, Alert, Image, Platform, ActivityIndicator, StatusBar,
} from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { orderService } from '../../src/services/api';
import { LinearGradient } from 'expo-linear-gradient';
import {
  Upload, Video, ChevronLeft, Clock, Zap,
  X, Timer, TrendingUp, Share2, Activity, Mic, AlertCircle
} from 'lucide-react-native';
import * as ImagePicker from 'expo-image-picker';
import Animated, {
  FadeInUp, useSharedValue, useAnimatedStyle,
  withSpring,
} from 'react-native-reanimated';

const { width } = Dimensions.get('window');

export default function RapidStudioScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();

  const [detectedDuration, setDetectedDuration] = useState(0);
  const [totalPrice, setTotalPrice] = useState(49);
  const [deliveryTime, setDeliveryTime] = useState(35);
  const [selectedMedia, setSelectedMedia] = useState<any[]>([]);
  const [demoMedia, setDemoMedia] = useState<any[]>([]);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [promoCode, setPromoCode] = useState('');
  const [discount, setDiscount] = useState(0);
  const [isPromoApplied, setIsPromoApplied] = useState(false);
  const [analysisProgress, setAnalysisProgress] = useState(0);
  const [instructions, setInstructions] = useState('');
  const [isOrdering, setIsOrdering] = useState(false);

  const priceScale = useSharedValue(1);

  useEffect(() => {
    if (detectedDuration > 0) {
      let p = 0;
      if (detectedDuration <= 30)       p = 25 + detectedDuration * 0.8;
      else if (detectedDuration <= 120)  p = 49 + (detectedDuration - 30) * 0.55;
      else if (detectedDuration <= 300)  p = 99 + (detectedDuration - 120) * 0.27;
      else                               p = 149 + (detectedDuration - 300) * 0.16;

      setTotalPrice(Math.round(p));
      setDeliveryTime(Math.round(30 + detectedDuration / 20));
      priceScale.value = withSpring(1.2, {}, () => { priceScale.value = withSpring(1); });
    }
  }, [detectedDuration]);

  const animatedPrice = useAnimatedStyle(() => ({ transform: [{ scale: priceScale.value }] }));

  const pickMedia = async (isDemo = false) => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') { Alert.alert('Permission Denied', 'Please grant gallery access!'); return; }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Videos,
      allowsMultipleSelection: false,
      quality: 1,
    });

    if (!result.canceled && result.assets.length > 0) {
      const asset = result.assets[0];
      if (isDemo) {
        setDemoMedia([asset]);
      } else {
        setSelectedMedia([asset]);
        setDetectedDuration((asset.duration || 0) / 1000);
        startAIAnalysis();
      }
    }
  };

  const startAIAnalysis = () => {
    setIsAnalyzing(true);
    setAnalysisProgress(0);
    const interval = setInterval(() => {
      setAnalysisProgress(prev => {
        if (prev >= 1) { clearInterval(interval); setIsAnalyzing(false); return 1; }
        return prev + 0.1;
      });
    }, 200);
  };

  const handleOrder = async () => {
    setIsOrdering(true);
    try {
      const response = await orderService.createOrder({
        title: `Rapid Edit – ${Math.round(detectedDuration)}s Video`,
        category: 'RAPID',
        price: (totalPrice - discount).toString(),
        videoUrl: selectedMedia[0].uri,
        deliverySpeed: 'RAPID',
        initialETAMins: deliveryTime,
        instructions,
      });
      if (response.success) {
        router.push({ pathname: '/(customer)/tracking', params: { orderId: response.order.id } });
      }
    } catch (error: any) {
      Alert.alert('Order Failed', error?.message || 'Please try again.');
    } finally {
      setIsOrdering(false);
    }
  };

  const hasVideo = selectedMedia.length > 0;

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#059669" />
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scroll}>

        {/* ── HEADER ── */}
        <LinearGradient colors={['#059669', '#10B981']} style={styles.header}>
          <View style={styles.headerRow}>
            <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
              <ChevronLeft size={22} color="#FFF" />
            </TouchableOpacity>
            <View style={styles.headerCenter}>
              <Text style={styles.headerTitle}>Rapid Studio</Text>
              <View style={styles.badge}>
                <Zap size={10} color="#FFF" fill="#FFF" />
                <Text style={styles.badgeText}>PRICE &amp; SPEED FIXED</Text>
              </View>
            </View>
            <View style={{ width: 38 }} />
          </View>

          {/* Price display inside header */}
          {hasVideo && (
            <Animated.View entering={FadeInUp} style={styles.headerPriceRow}>
              <View style={styles.headerPriceCard}>
                <Text style={styles.hpLabel}>RAPID PRICE</Text>
                <Animated.Text style={[styles.hpValue, animatedPrice]}>₹{totalPrice - discount}</Animated.Text>
              </View>
              <View style={styles.headerPriceCard}>
                <Text style={styles.hpLabel}>DELIVERY</Text>
                <Text style={styles.hpValue}>{deliveryTime}m</Text>
              </View>
            </Animated.View>
          )}
        </LinearGradient>

        <View style={styles.body}>

          {/* ── STEP 1: Upload Video ── */}
          <Animated.View entering={FadeInUp.delay(100)} style={styles.section}>
            <Text style={styles.stepLabel}>Step 1</Text>
            <Text style={styles.sectionTitle}>Upload Video to Edit</Text>

            {hasVideo ? (
              <View style={styles.previewBox}>
                <Image source={{ uri: selectedMedia[0].uri }} style={styles.previewImg} />
                <TouchableOpacity style={styles.replaceBtn} onPress={() => pickMedia(false)}>
                  <Share2 size={14} color="#FFF" />
                  <Text style={styles.replaceBtnText}>Replace</Text>
                </TouchableOpacity>
                <View style={styles.durationBadge}>
                  <Timer size={12} color="#FFF" />
                  <Text style={styles.durationText}>{Math.round(detectedDuration)}s</Text>
                </View>
              </View>
            ) : (
              <TouchableOpacity style={styles.uploadBox} onPress={() => pickMedia(false)}>
                <View style={styles.uploadIconCircle}>
                  <Video size={30} color="#059669" />
                </View>
                <Text style={styles.uploadTitle}>Select Main Video</Text>
                <Text style={styles.uploadSub}>30s = ₹49 · 35 mins delivery</Text>
              </TouchableOpacity>
            )}
          </Animated.View>

          {/* ── AI ANALYSIS CARD ── */}
          {hasVideo && (
            <Animated.View entering={FadeInUp.delay(150)} style={styles.aiCard}>
              <LinearGradient colors={['#059669', '#10B981']} style={styles.aiGrad}>
                <View style={styles.aiRow}>
                  <Activity size={18} color="#FFF" />
                  <Text style={styles.aiTitle}>{isAnalyzing ? 'Detecting length...' : '✅ Length Detected!'}</Text>
                </View>
                <View style={styles.progressBg}>
                  <View style={[styles.progressFill, { width: `${analysisProgress * 100}%` as any }]} />
                </View>
                {!isAnalyzing && (
                  <View style={styles.insightRow}>
                    <View style={styles.insightPill}>
                      <Clock size={13} color="#FFF" />
                      <Text style={styles.insightText}>{deliveryTime} min delivery</Text>
                    </View>
                    <View style={styles.insightPill}>
                      <TrendingUp size={13} color="#FFF" />
                      <Text style={styles.insightText}>Smart Price: ₹{totalPrice}</Text>
                    </View>
                  </View>
                )}
              </LinearGradient>
            </Animated.View>
          )}

          {/* ── STEP 2: Demo Video ── */}
          <Animated.View entering={FadeInUp.delay(200)} style={styles.section}>
            <Text style={styles.stepLabel}>Step 2</Text>
            <Text style={styles.sectionTitle}>Reference Video (Optional)</Text>
            {demoMedia.length > 0 ? (
              <View style={styles.demoRow}>
                <Image source={{ uri: demoMedia[0].uri }} style={styles.demoThumb} />
                <View style={{ flex: 1, marginLeft: 12 }}>
                  <Text style={styles.demoUploaded}>✅ Demo Uploaded</Text>
                  <Text style={styles.demoSub}>Tap to replace</Text>
                </View>
                <TouchableOpacity onPress={() => setDemoMedia([])}>
                  <X size={18} color="#EF4444" />
                </TouchableOpacity>
              </View>
            ) : (
              <TouchableOpacity style={styles.demoBox} onPress={() => pickMedia(true)}>
                <Upload size={18} color="#94A3B8" />
                <Text style={styles.demoBoxText}>Add reference / demo video</Text>
              </TouchableOpacity>
            )}
          </Animated.View>

          {/* ── STEP 3: Instructions ── */}
          <Animated.View entering={FadeInUp.delay(250)} style={styles.section}>
            <Text style={styles.stepLabel}>Step 3</Text>
            <Text style={styles.sectionTitle}>Editing Instructions</Text>
            <View style={styles.instructCard}>
              <TextInput
                placeholder="Tell us how to edit this video — style, music, mood..."
                multiline
                numberOfLines={3}
                style={styles.instructInput}
                placeholderTextColor="#94A3B8"
                value={instructions}
                onChangeText={setInstructions}
              />
              <TouchableOpacity style={styles.voiceBtn}>
                <Mic size={16} color="#059669" />
                <Text style={styles.voiceBtnText}>Record Voice Instructions</Text>
              </TouchableOpacity>
            </View>
          </Animated.View>

          {/* ── STEP 4: Promo Code ── */}
          <Animated.View entering={FadeInUp.delay(300)} style={styles.section}>
            <Text style={styles.stepLabel}>Step 4</Text>
            <Text style={styles.sectionTitle}>Promo Code</Text>
            <View style={styles.promoRow}>
              <TextInput
                style={[styles.promoInput, isPromoApplied && { borderColor: '#059669' }]}
                placeholder="Enter Code (e.g. RAPID20)"
                value={promoCode}
                onChangeText={setPromoCode}
                autoCapitalize="characters"
              />
              <TouchableOpacity
                style={[styles.promoBtn, isPromoApplied && { backgroundColor: '#059669' }]}
                onPress={() => {
                  if (promoCode.toUpperCase() === 'RAPID20') {
                    setDiscount(20); setIsPromoApplied(true);
                    Alert.alert('🎉 Applied!', '₹20 discount applied successfully!');
                  } else {
                    Alert.alert('Invalid', 'Promo code not valid.');
                  }
                }}
              >
                <Text style={styles.promoBtnText}>{isPromoApplied ? 'Applied ✓' : 'Apply'}</Text>
              </TouchableOpacity>
            </View>
          </Animated.View>

          {/* ── STEP 5: Confirm & Book Summary Card ── */}
          <Animated.View entering={FadeInUp.delay(350)} style={styles.section}>
            <Text style={styles.stepLabel}>Step 5</Text>
            <Text style={styles.sectionTitle}>Review &amp; Place Order</Text>
            
            <View style={styles.summaryCard}>
              <View style={styles.summaryRow}>
                <Text style={styles.summaryLabel}>Video Duration:</Text>
                <Text style={styles.summaryValue}>{hasVideo ? `${Math.round(detectedDuration)} seconds` : 'Pending video select'}</Text>
              </View>
              <View style={styles.summaryRow}>
                <Text style={styles.summaryLabel}>Guaranteed ETA:</Text>
                <Text style={styles.summaryValue}>{hasVideo ? `${deliveryTime} minutes` : 'Pending length analysis'}</Text>
              </View>
              
              <View style={styles.summaryDivider} />
              
              <View style={styles.summaryRow}>
                <Text style={styles.summaryTotalLabel}>Final Amount:</Text>
                <Text style={styles.summaryTotalValue}>₹{totalPrice - discount}</Text>
              </View>

              {!hasVideo ? (
                <View style={styles.warningBox}>
                  <AlertCircle size={15} color="#D97706" />
                  <Text style={styles.warningText}>Please select a video in Step 1 to proceed with booking.</Text>
                </View>
              ) : (
                <TouchableOpacity
                  style={styles.submitBtn}
                  onPress={handleOrder}
                  disabled={isOrdering}
                >
                  <LinearGradient colors={['#059669', '#10B981']} style={styles.submitGrad}>
                    {isOrdering ? (
                      <ActivityIndicator color="#FFF" />
                    ) : (
                      <>
                        <Zap size={16} color="#FFF" />
                        <Text style={styles.submitBtnText}>CONFIRM &amp; FIND EDITOR</Text>
                      </>
                    )}
                  </LinearGradient>
                </TouchableOpacity>
              )}
            </View>
          </Animated.View>

          <View style={{ height: 120 }} />
        </View>
      </ScrollView>

      {/* ── BOTTOM BAR ── */}
      <View style={styles.bottomBar}>
        <View style={styles.bottomContent}>
          <View style={styles.bottomLeft}>
            <Text style={styles.bottomLabel}>RAPID PRICE</Text>
            <Animated.Text style={[styles.bottomPrice, animatedPrice]}>
              ₹{totalPrice - discount}
            </Animated.Text>
            {hasVideo && (
              <View style={styles.deliveryTag}>
                <Clock size={11} color="#059669" />
                <Text style={styles.deliveryTagText}>{deliveryTime} min guaranteed</Text>
              </View>
            )}
          </View>

          <TouchableOpacity
            style={[styles.orderBtn, (!hasVideo || isAnalyzing) && styles.orderBtnDisabled]}
            disabled={!hasVideo || isAnalyzing || isOrdering}
            onPress={handleOrder}
          >
            <LinearGradient
              colors={hasVideo ? ['#059669', '#10B981'] : ['#E2E8F0', '#F1F5F9']}
              style={styles.orderBtnGrad}
            >
              {isOrdering
                ? <ActivityIndicator color="#FFF" />
                : <>
                    <Zap size={18} color={hasVideo ? '#FFF' : '#94A3B8'} />
                    <Text style={[styles.orderBtnText, !hasVideo && { color: '#94A3B8' }]}>
                      {hasVideo ? 'Find Rapid Editor' : 'Select Video First'}
                    </Text>
                  </>
              }
            </LinearGradient>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8FAFC' },
  scroll: { paddingBottom: 20 },

  header: { paddingTop: 55, paddingBottom: 24, paddingHorizontal: 20, borderBottomLeftRadius: 28, borderBottomRightRadius: 28 },
  headerRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 },
  backBtn: { width: 38, height: 38, borderRadius: 12, backgroundColor: 'rgba(255,255,255,0.2)', alignItems: 'center', justifyContent: 'center' },
  headerCenter: { alignItems: 'center' },
  headerTitle: { fontSize: 18, fontWeight: '900', color: '#FFF' },
  badge: { flexDirection: 'row', alignItems: 'center', backgroundColor: 'rgba(255,255,255,0.2)', paddingHorizontal: 8, paddingVertical: 3, borderRadius: 8, marginTop: 4, gap: 4 },
  badgeText: { color: '#FFF', fontSize: 9, fontWeight: '900' },
  headerPriceRow: { flexDirection: 'row', gap: 12 },
  headerPriceCard: { flex: 1, backgroundColor: 'rgba(255,255,255,0.15)', borderRadius: 16, padding: 14, alignItems: 'center' },
  hpLabel: { fontSize: 9, fontWeight: '900', color: 'rgba(255,255,255,0.75)', letterSpacing: 1 },
  hpValue: { fontSize: 26, fontWeight: '900', color: '#FFF', marginTop: 4 },

  body: { padding: 20 },
  section: { marginBottom: 24 },
  stepLabel: { fontSize: 10, fontWeight: '900', color: '#059669', letterSpacing: 1.5, marginBottom: 4 },
  sectionTitle: { fontSize: 16, fontWeight: '900', color: '#1E293B', marginBottom: 12 },

  uploadBox: {
    height: 160, borderRadius: 24, backgroundColor: '#F0FDF4',
    alignItems: 'center', justifyContent: 'center',
    borderWidth: 2, borderStyle: 'dashed', borderColor: '#6EE7B7',
  },
  uploadIconCircle: { width: 60, height: 60, borderRadius: 30, backgroundColor: '#ECFDF5', alignItems: 'center', justifyContent: 'center', marginBottom: 10 },
  uploadTitle: { fontSize: 16, fontWeight: '800', color: '#1E293B' },
  uploadSub: { fontSize: 12, color: '#94A3B8', fontWeight: '600', marginTop: 4 },

  previewBox: { height: 200, borderRadius: 24, overflow: 'hidden', backgroundColor: '#F1F5F9' },
  previewImg: { width: '100%', height: '100%' },
  replaceBtn: { position: 'absolute', top: 12, right: 12, flexDirection: 'row', alignItems: 'center', backgroundColor: 'rgba(0,0,0,0.6)', paddingHorizontal: 10, paddingVertical: 6, borderRadius: 12, gap: 5 },
  replaceBtnText: { color: '#FFF', fontSize: 11, fontWeight: '800' },
  durationBadge: { position: 'absolute', bottom: 12, left: 12, flexDirection: 'row', alignItems: 'center', backgroundColor: '#059669', paddingHorizontal: 10, paddingVertical: 6, borderRadius: 12, gap: 5 },
  durationText: { color: '#FFF', fontSize: 12, fontWeight: '900' },

  aiCard: { borderRadius: 20, overflow: 'hidden', marginBottom: 24 },
  aiGrad: { padding: 18 },
  aiRow: { flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 12 },
  aiTitle: { color: '#FFF', fontSize: 13, fontWeight: '900' },
  progressBg: { height: 6, backgroundColor: 'rgba(255,255,255,0.2)', borderRadius: 3, marginBottom: 12, overflow: 'hidden' },
  progressFill: { height: '100%', backgroundColor: '#FFF', borderRadius: 3 },
  insightRow: { flexDirection: 'row', gap: 10 },
  insightPill: { flexDirection: 'row', alignItems: 'center', backgroundColor: 'rgba(255,255,255,0.15)', paddingHorizontal: 10, paddingVertical: 6, borderRadius: 10, gap: 6 },
  insightText: { color: '#FFF', fontSize: 11, fontWeight: '700' },

  demoBox: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#F8FAFC', borderRadius: 16, padding: 16, borderWidth: 1, borderStyle: 'dashed', borderColor: '#E2E8F0', gap: 10 },
  demoBoxText: { fontSize: 14, color: '#64748B', fontWeight: '600' },
  demoRow: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#F0FDF4', borderRadius: 16, padding: 14, borderWidth: 1, borderColor: '#DCFCE7' },
  demoThumb: { width: 44, height: 44, borderRadius: 10, backgroundColor: '#E2E8F0' },
  demoUploaded: { fontSize: 14, fontWeight: '800', color: '#059669' },
  demoSub: { fontSize: 11, color: '#94A3B8', fontWeight: '600', marginTop: 2 },

  instructCard: { backgroundColor: '#FFF', borderRadius: 20, padding: 16, elevation: 1 },
  instructInput: { fontSize: 14, color: '#1E293B', height: 80, textAlignVertical: 'top', fontWeight: '600', marginBottom: 12 },
  voiceBtn: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#F0FDF4', borderRadius: 12, padding: 12, gap: 8, borderTopWidth: 1, borderColor: '#DCFCE7' },
  voiceBtnText: { fontSize: 13, fontWeight: '700', color: '#059669' },

  promoRow: { flexDirection: 'row', gap: 10 },
  promoInput: { flex: 1, backgroundColor: '#FFF', borderRadius: 14, paddingHorizontal: 14, height: 52, fontSize: 14, fontWeight: '700', color: '#1E293B', borderWidth: 1, borderColor: '#E2E8F0' },
  promoBtn: { backgroundColor: '#059669', paddingHorizontal: 18, borderRadius: 14, justifyContent: 'center' },
  promoBtnText: { color: '#FFF', fontSize: 13, fontWeight: '900' },

  summaryCard: { backgroundColor: '#FFF', borderRadius: 20, padding: 18, elevation: 1 },
  summaryRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginVertical: 6 },
  summaryLabel: { fontSize: 13, fontWeight: '700', color: '#64748B' },
  summaryValue: { fontSize: 13, fontWeight: '800', color: '#1E293B' },
  summaryDivider: { height: 1, backgroundColor: '#F1F5F9', marginVertical: 12 },
  summaryTotalLabel: { fontSize: 14, fontWeight: '900', color: '#1E293B' },
  summaryTotalValue: { fontSize: 20, fontWeight: '900', color: '#059669' },
  warningBox: { flexDirection: 'row', alignItems: 'center', gap: 8, backgroundColor: '#FEF3C7', padding: 12, borderRadius: 12, marginTop: 14 },
  warningText: { fontSize: 11, color: '#D97706', fontWeight: '700', flex: 1 },
  submitBtn: { borderRadius: 14, overflow: 'hidden', marginTop: 16, elevation: 2 },
  submitGrad: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', paddingVertical: 15, gap: 8 },
  submitBtnText: { color: '#FFF', fontSize: 13, fontWeight: '900', letterSpacing: 0.5 },

  bottomBar: {
    position: 'absolute', bottom: 0, left: 0, right: 0,
    backgroundColor: '#FFF', borderTopWidth: 1, borderTopColor: '#F1F5F9',
    paddingHorizontal: 20, paddingTop: 14,
    paddingBottom: Platform.OS === 'ios' ? 34 : 20,
    elevation: 10,
  },
  bottomContent: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  bottomLeft: { flex: 1 },
  bottomLabel: { fontSize: 9, fontWeight: '900', color: '#059669', letterSpacing: 1 },
  bottomPrice: { fontSize: 30, fontWeight: '900', color: '#1E293B' },
  deliveryTag: { flexDirection: 'row', alignItems: 'center', gap: 4, marginTop: 2 },
  deliveryTagText: { fontSize: 11, color: '#059669', fontWeight: '700' },
  orderBtn: { flex: 1.5, borderRadius: 18, overflow: 'hidden', marginLeft: 16, elevation: 4, shadowColor: '#059669', shadowOpacity: 0.3, shadowRadius: 8 },
  orderBtnDisabled: { elevation: 0, shadowOpacity: 0 },
  orderBtnGrad: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', paddingVertical: 16, gap: 8 },
  orderBtnText: { color: '#FFF', fontSize: 15, fontWeight: '900' },
});
