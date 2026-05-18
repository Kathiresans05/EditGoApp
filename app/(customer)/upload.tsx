import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput, Dimensions, Alert, Image, Platform } from 'react-native';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { 
  Upload, Video, ChevronLeft, Clock, Sparkles, X, 
  Play, Timer, Zap, TrendingUp, UserCheck, Share2, 
  Cpu, Activity, ChevronRight, Mic
} from 'lucide-react-native';
import * as ImagePicker from 'expo-image-picker';
import { Audio } from 'expo-av';
import { GlassCard } from '../../src/components/ui/GlassCard';
import Animated, { 
  FadeInUp, useSharedValue, useAnimatedStyle, 
  withSpring, withRepeat, withTiming
} from 'react-native-reanimated';

const { width } = Dimensions.get('window');

const RAPID_PRICING = [
  { maxDuration: 30, price: 49, deliveryMins: 35, label: 'Super Fast' },
  { maxDuration: 120, price: 89, deliveryMins: 45, label: 'Quick Edit' },
  { maxDuration: 300, price: 149, deliveryMins: 55, label: 'Express' },
  { maxDuration: 600, price: 249, deliveryMins: 60, label: 'Rapid Max' },
];

export default function UploadScreen() {
  const router = useRouter();
  
  // State
  const [detectedDuration, setDetectedDuration] = useState(0); // in seconds
  const [totalPrice, setTotalPrice] = useState(49);
  const [deliveryTime, setDeliveryTime] = useState(35);
  const [selectedMedia, setSelectedMedia] = useState<any[]>([]);
  const [demoMedia, setDemoMedia] = useState<any[]>([]);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisProgress, setAnalysisProgress] = useState(0);
  const [instructions, setInstructions] = useState('');
  
  // Reanimated values
  const priceScale = useSharedValue(1);
  const aiPulse = useSharedValue(1);
  
  useEffect(() => {
    aiPulse.value = withRepeat(withTiming(1.1, { duration: 1000 }), -1, true);
  }, []);

  useEffect(() => {
    // Price Calculation based on detected duration
    if (detectedDuration > 0) {
      // ADVANCED PIECEWISE DYNAMIC FORMULA
      let calculatedPrice = 0;
      
      if (detectedDuration <= 30) {
        calculatedPrice = 25 + (detectedDuration * 0.8);
      } else if (detectedDuration <= 120) { // Up to 2 mins
        calculatedPrice = 49 + ((detectedDuration - 30) * 0.55);
      } else if (detectedDuration <= 300) { // Up to 5 mins
        calculatedPrice = 99 + ((detectedDuration - 120) * 0.27);
      } else { // Up to 10 mins+
        calculatedPrice = 149 + ((detectedDuration - 300) * 0.16);
      }
      
      const calculatedTime = Math.round(30 + (detectedDuration / 20));
      
      setTotalPrice(Math.round(calculatedPrice));
      setDeliveryTime(calculatedTime);
      
      priceScale.value = withSpring(1.2, {}, () => {
        priceScale.value = withSpring(1);
      });
    }
  }, [detectedDuration]);

  const animatedPriceStyle = useAnimatedStyle(() => ({
    transform: [{ scale: priceScale.value }]
  }));

  const pickMedia = async (isDemo = false) => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission Denied', 'Please grant gallery access!');
      return;
    }

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
        // Auto-detect duration from metadata
        const durationSecs = (asset.duration || 0) / 1000;
        setDetectedDuration(durationSecs);
        startAIAnalysis();
      }
    }
  };

  const startAIAnalysis = () => {
    setIsAnalyzing(true);
    setAnalysisProgress(0);
    const interval = setInterval(() => {
      setAnalysisProgress(prev => {
        if (prev >= 1) {
          clearInterval(interval);
          setIsAnalyzing(false);
          return 1;
        }
        return prev + 0.1;
      });
    }, 200);
  };

  return (
    <View style={styles.container}>
      <LinearGradient colors={['#FFFFFF', '#F8FAFC']} style={StyleSheet.absoluteFill} />
      
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
            <ChevronLeft size={24} color="#1E293B" />
          </TouchableOpacity>
          <View style={styles.headerTitleContainer}>
            <Text style={styles.headerTitle}>Rapid Studio</Text>
            <View style={styles.aiBadge}>
              <Zap size={10} color="#FFF" fill="#FFF" />
              <Text style={styles.aiBadgeText}>CHEAPEST & FASTEST</Text>
            </View>
          </View>
          <View style={{ width: 44 }} />
        </View>

        {/* 1. Main Video Scanner */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>1. Upload Video to Edit</Text>
          
          {selectedMedia.length > 0 ? (
            <View style={styles.mainPreview}>
              <Image source={{ uri: selectedMedia[0].uri }} style={styles.largePreview} />
              <TouchableOpacity style={styles.changeMediaBtn} onPress={() => pickMedia(false)}>
                <Share2 size={16} color="#FFF" />
                <Text style={styles.changeMediaText}>Replace</Text>
              </TouchableOpacity>
              <View style={styles.detectedBadge}>
                <Timer size={14} color="#FFF" />
                <Text style={styles.detectedText}>
                  Length: {Math.round(detectedDuration)}s
                </Text>
              </View>
            </View>
          ) : (
            <TouchableOpacity style={styles.uploadBox} onPress={() => pickMedia(false)}>
              <GlassCard style={styles.uploadGlass}>
                <View style={styles.uploadIconCircle}>
                  <Video size={32} color="#8B5CF6" />
                </View>
                <Text style={styles.uploadText}>Select Main Video</Text>
                <Text style={styles.uploadSub}>We'll auto-calculate price based on length</Text>
              </GlassCard>
            </TouchableOpacity>
          )}
        </View>

        {/* 2. Analysis Progress */}
        {selectedMedia.length > 0 && (
          <Animated.View entering={FadeInUp} style={styles.aiAnalysisCard}>
            <LinearGradient colors={['#10B981', '#059669']} style={styles.aiAnalysisGradient}>
              <View style={styles.analysisHeader}>
                <Activity size={20} color="#FFF" />
                <Text style={styles.analysisTitle}>{isAnalyzing ? 'DETECTING LENGTH...' : 'LENGTH DETECTED!'}</Text>
              </View>
              <View style={styles.progressContainer}>
                <View style={[styles.progressBar, { width: `${analysisProgress * 100}%` }]} />
              </View>
              {!isAnalyzing && (
                <View style={styles.insightsRow}>
                  <View style={styles.insightItem}>
                    <Clock size={16} color="#FFF" />
                    <Text style={styles.insightText}>{deliveryTime} Mins Delivery</Text>
                  </View>
                  <View style={styles.insightItem}>
                    <TrendingUp size={16} color="#FFF" />
                    <Text style={styles.insightText}>Smart Pricing: ₹{totalPrice}</Text>
                  </View>
                </View>
              )}
            </LinearGradient>
          </Animated.View>
        )}

        {/* 3. Demo Video (Optional) */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>2. Upload Demo/Reference (Optional)</Text>
          {demoMedia.length > 0 ? (
            <View style={styles.demoPreview}>
              <Image source={{ uri: demoMedia[0].uri }} style={styles.demoImage} />
              <TouchableOpacity style={styles.removeDemo} onPress={() => setDemoMedia([])}>
                <X size={16} color="#FFF" />
              </TouchableOpacity>
              <Text style={styles.demoLabel}>Demo Uploaded</Text>
            </View>
          ) : (
            <TouchableOpacity style={styles.demoUploadBox} onPress={() => pickMedia(true)}>
              <Upload size={20} color="#64748B" />
              <Text style={styles.demoUploadText}>Click to add reference video</Text>
            </TouchableOpacity>
          )}
        </View>

        {/* 4. Vision */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>3. Editing Instructions</Text>
          <GlassCard style={styles.inputCard}>
            <TextInput 
              placeholder="Tell us how to edit this video..."
              multiline numberOfLines={3} 
              style={styles.textInput} 
              placeholderTextColor="#94A3B8"
              value={instructions}
              onChangeText={setInstructions}
            />
            <View style={styles.voiceSection}>
              <TouchableOpacity style={styles.voiceBtn}>
                <Mic size={18} color="#8B5CF6" />
                <Text style={styles.voiceText}>Record Voice Instructions</Text>
              </TouchableOpacity>
            </View>
          </GlassCard>
        </View>

        <View style={{ height: 130 }} />
      </ScrollView>

      {/* Bottom Bar */}
      <View style={styles.bottomBar}>
        <LinearGradient colors={['rgba(255,255,255,0.95)', '#FFF']} style={styles.bottomBarGradient}>
          <View style={styles.bottomMainRow}>
            <View style={styles.priceContainer}>
              <Text style={styles.totalLabel}>RAPID PRICE</Text>
              <Animated.Text style={[styles.totalVal, animatedPriceStyle]}>₹{totalPrice}</Animated.Text>
            </View>

            <TouchableOpacity 
              style={[styles.continueBtn, selectedMedia.length === 0 && styles.disabledBtn]}
              onPress={() => {
                if (selectedMedia.length === 0) { pickMedia(false); } 
                else {
                  router.push({
                    pathname: '/(customer)/matching',
                    params: { totalPrice, deliveryMins: deliveryTime, type: 'RAPID' }
                  });
                }
              }}
            >
              <LinearGradient colors={selectedMedia.length > 0 ? ['#10B981', '#059669'] : ['#F1F5F9', '#E2E8F0']} style={styles.btnGradient}>
                <Text style={[styles.continueText, selectedMedia.length === 0 && { color: '#94A3B8' }]}>
                  {selectedMedia.length > 0 ? 'Find Rapid Editor' : 'Select Video'}
                </Text>
                <Zap size={18} color={selectedMedia.length > 0 ? "#FFF" : "#94A3B8"} />
              </LinearGradient>
            </TouchableOpacity>
          </View>
          
          {selectedMedia.length > 0 && (
            <View style={styles.deliveryTagRow}>
              <Clock size={12} color="#059669" />
              <Text style={styles.deliveryTagText}>
                Guaranteed Delivery in {deliveryTime} Mins
              </Text>
            </View>
          )}
        </LinearGradient>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFFFFF' },
  scrollContent: { paddingTop: 60, paddingHorizontal: 24, paddingBottom: 20 },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 25 },
  backBtn: { width: 44, height: 44, borderRadius: 15, backgroundColor: '#F8FAFC', alignItems: 'center', justifyContent: 'center' },
  headerTitleContainer: { alignItems: 'center' },
  headerTitle: { fontSize: 18, fontWeight: '900', color: '#1E293B' },
  aiBadge: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#10B981', paddingHorizontal: 8, paddingVertical: 2, borderRadius: 6, marginTop: 2 },
  aiBadgeText: { color: '#FFF', fontSize: 8, fontWeight: '900', marginLeft: 4 },
  
  section: { marginBottom: 30 },
  sectionTitle: { fontSize: 16, fontWeight: '800', color: '#1E293B', marginBottom: 15 },
  
  uploadBox: { borderRadius: 30, overflow: 'hidden', height: 160, backgroundColor: '#F8FAFC', borderWidth: 2, borderColor: '#F1F5F9', borderStyle: 'dashed' },
  uploadGlass: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  uploadIconCircle: { width: 60, height: 60, borderRadius: 30, backgroundColor: '#ECFDF5', alignItems: 'center', justifyContent: 'center', marginBottom: 12 },
  uploadText: { fontSize: 17, fontWeight: '800', color: '#1E293B' },
  uploadSub: { fontSize: 12, color: '#94A3B8', marginTop: 6, fontWeight: '600' },
  
  mainPreview: { height: 200, borderRadius: 32, overflow: 'hidden', backgroundColor: '#F1F5F9' },
  largePreview: { width: '100%', height: '100%' },
  changeMediaBtn: { position: 'absolute', top: 15, right: 15, backgroundColor: 'rgba(0,0,0,0.6)', paddingHorizontal: 12, paddingVertical: 8, borderRadius: 15, flexDirection: 'row', alignItems: 'center' },
  changeMediaText: { color: '#FFF', fontSize: 11, fontWeight: '800', marginLeft: 6 },
  detectedBadge: { position: 'absolute', bottom: 15, left: 15, backgroundColor: '#10B981', paddingHorizontal: 12, paddingVertical: 8, borderRadius: 15, flexDirection: 'row', alignItems: 'center' },
  detectedText: { color: '#FFF', fontSize: 12, fontWeight: '900', marginLeft: 6 },

  aiAnalysisCard: { borderRadius: 24, overflow: 'hidden', marginBottom: 30 },
  aiAnalysisGradient: { padding: 20 },
  analysisHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 15 },
  analysisTitle: { color: '#FFF', fontSize: 12, fontWeight: '900', marginLeft: 10 },
  progressContainer: { height: 6, backgroundColor: 'rgba(255,255,255,0.2)', borderRadius: 3, marginBottom: 15, overflow: 'hidden' },
  progressBar: { height: '100%', backgroundColor: '#FFF', borderRadius: 3 },
  insightsRow: { flexDirection: 'row', gap: 15 },
  insightItem: { flexDirection: 'row', alignItems: 'center', backgroundColor: 'rgba(255,255,255,0.15)', paddingHorizontal: 10, paddingVertical: 6, borderRadius: 12 },
  insightText: { color: '#FFF', fontSize: 11, fontWeight: '700', marginLeft: 6 },

  demoUploadBox: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#F8FAFC', padding: 16, borderRadius: 20, borderWidth: 1, borderColor: '#E2E8F0', borderStyle: 'dashed' },
  demoUploadText: { marginLeft: 10, fontSize: 14, color: '#64748B', fontWeight: '600' },
  demoPreview: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#F0FDF4', padding: 12, borderRadius: 20, borderWidth: 1, borderColor: '#DCFCE7' },
  demoImage: { width: 40, height: 40, borderRadius: 10, backgroundColor: '#E2E8F0' },
  demoLabel: { marginLeft: 12, fontSize: 14, fontWeight: '700', color: '#059669' },
  removeDemo: { position: 'absolute', top: -5, right: -5, backgroundColor: '#EF4444', borderRadius: 10, padding: 4 },

  inputCard: { padding: 20, backgroundColor: '#FFF' },
  textInput: { fontSize: 15, color: '#1E293B', height: 80, textAlignVertical: 'top', fontWeight: '600' },
  voiceSection: { marginTop: 15, borderTopWidth: 1, borderTopColor: '#F1F5F9', paddingTop: 15 },
  voiceBtn: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#F8FAFC', padding: 12, borderRadius: 18 },
  voiceText: { marginLeft: 10, fontSize: 13, fontWeight: '700', color: '#10B981' },

  bottomBar: { position: 'absolute', bottom: 0, left: 0, right: 0, zIndex: 1000 },
  bottomBarGradient: { paddingHorizontal: 24, paddingTop: 15, paddingBottom: Platform.OS === 'ios' ? 110 : 90, borderTopWidth: 1, borderTopColor: '#F1F5F9' },
  bottomMainRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 },
  priceContainer: { flex: 1 },
  totalLabel: { fontSize: 10, fontWeight: '900', color: '#10B981' },
  totalVal: { fontSize: 32, fontWeight: '900', color: '#1E293B' },
  continueBtn: { flex: 1.8, borderRadius: 20, overflow: 'hidden', marginLeft: 20 },
  disabledBtn: { opacity: 0.8 },
  btnGradient: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', paddingVertical: 18, gap: 8 },
  continueText: { color: '#FFF', fontSize: 16, fontWeight: '900' },
  deliveryTagRow: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#DCFCE7', alignSelf: 'flex-start', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 8 },
  deliveryTagText: { fontSize: 10, fontWeight: '800', color: '#059669', marginLeft: 4 },
});
