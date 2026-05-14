import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput, Dimensions, Alert, Image, Platform, Pressable } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { 
  Upload, Video, Image as ImageIcon, ChevronLeft, Mic, Clock, Sparkles, X, 
  Play, Square, Timer, Zap, Target, TrendingUp, UserCheck, ShieldCheck,
  Gift, MessageSquare, Wand2, Star, Share2, Layers, Cpu, Activity,
  ChevronRight
} from 'lucide-react-native';
import * as ImagePicker from 'expo-image-picker';
import { Audio } from 'expo-av';
import { GlassCard } from '../../src/components/ui/GlassCard';
import Animated, { 
  FadeInUp, FadeInRight, useSharedValue, useAnimatedStyle, 
  withSpring, withRepeat, withTiming, interpolateColor, withDelay,
  FadeIn
} from 'react-native-reanimated';

const { width, height } = Dimensions.get('window');

const LENGTH_OPTIONS = [
  { id: 'short', label: '< 30s', multiplier: 1, icon: '⚡' },
  { id: 'medium', label: '30-60s', multiplier: 1.5, icon: '🔥' },
  { id: 'long', label: '1-3m', multiplier: 2.5, icon: '🎬' },
  { id: 'pro', label: '> 3m', multiplier: 4, icon: '🌟' },
];

const TRENDING_TEMPLATES = [
  { id: 1, name: 'Cyberpunk Glitch', preview: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=200', tag: 'Trending' },
  { id: 2, name: 'Moody Cinematic', preview: 'https://images.unsplash.com/photo-1492691523567-6119e2aa9ef1?w=200', tag: 'Premium' },
  { id: 3, name: 'Vibrant Reel', preview: 'https://images.unsplash.com/photo-1478720568477-152d9b164e26?w=200', tag: 'Fast' },
];

const AI_EFFECTS = [
  { id: 'color', name: 'Auto Color', icon: <Sparkles size={16} color="#8B5CF6" /> },
  { id: 'audio', name: 'Smart Audio', icon: <Mic size={16} color="#8B5CF6" /> },
  { id: 'subs', name: 'Dynamic Subs', icon: <Layers size={16} color="#8B5CF6" /> },
  { id: 'zoom', name: 'AI Zoom', icon: <Target size={16} color="#8B5CF6" /> },
];

export default function UploadScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const basePrice = parseInt(params.basePrice as string || '79');
  
  // State
  const [deliverySpeed, setDeliverySpeed] = useState('standard');
  const [videoLength, setVideoLength] = useState('short');
  const [totalPrice, setTotalPrice] = useState(basePrice);
  const [selectedMedia, setSelectedMedia] = useState<any[]>([]);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisProgress, setAnalysisProgress] = useState(0);
  const [viralScore, setViralScore] = useState(0);
  const [showAIAssistant, setShowAIAssistant] = useState(false);
  
  // Audio State (Restored to fix "voiceUri" errors)
  const [voiceUri, setVoiceUri] = useState<string | null>(null);
  const [isRecording, setIsRecording] = useState(false);
  
  // Reanimated values
  const priceScale = useSharedValue(1);
  const aiPulse = useSharedValue(1);
  
  useEffect(() => {
    aiPulse.value = withRepeat(withTiming(1.1, { duration: 1000 }), -1, true);
  }, []);

  useEffect(() => {
    const lengthObj = LENGTH_OPTIONS.find(l => l.id === videoLength);
    const multiplier = lengthObj ? lengthObj.multiplier : 1;
    
    let speedCost = 0;
    if (deliverySpeed === 'turbo') speedCost = 100;
    if (deliverySpeed === 'zap') speedCost = 250;

    const calculatedTotal = Math.round((basePrice * multiplier) + speedCost);
    if (calculatedTotal !== totalPrice) {
      setTotalPrice(calculatedTotal);
      priceScale.value = withSpring(1.2, {}, () => {
        priceScale.value = withSpring(1);
      });
    }
  }, [videoLength, deliverySpeed, basePrice]);

  const animatedPriceStyle = useAnimatedStyle(() => ({
    transform: [{ scale: priceScale.value }]
  }));

  const pickMedia = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission Denied', 'Sorry, we need camera roll permissions to make this work!');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsMultipleSelection: true,
      quality: 1,
    });

    if (!result.canceled) {
      setSelectedMedia([...selectedMedia, ...result.assets]);
      startAIAnalysis();
    }
  };

  const [sound, setSound] = useState<Audio.Sound | null>(null);
  const [recording, setRecording] = useState<Audio.Recording | null>(null);

  useEffect(() => {
    return () => {
      if (sound) {
        sound.unloadAsync();
      }
    };
  }, [sound]);

  const startAIAnalysis = () => {
    setIsAnalyzing(true);
    setAnalysisProgress(0);
    const interval = setInterval(() => {
      setAnalysisProgress(prev => {
        if (prev >= 1) {
          clearInterval(interval);
          setIsAnalyzing(false);
          setViralScore(Math.floor(Math.random() * 20) + 75); 
          return 1;
        }
        return prev + 0.1;
      });
    }, 300);
  };

  async function startRecording() {
    try {
      const { status } = await Audio.requestPermissionsAsync();
      if (status !== 'granted') return;
      await Audio.setAudioModeAsync({ allowsRecordingIOS: true, playsInSilentModeIOS: true });
      const { recording } = await Audio.Recording.createAsync(Audio.RecordingOptionsPresets.HIGH_QUALITY);
      setRecording(recording);
      setIsRecording(true);
    } catch (err) {
      console.error('Failed to start recording', err);
    }
  }

  async function stopRecording() {
    if (!recording) return;
    setIsRecording(false);
    await recording.stopAndUnloadAsync();
    const uri = recording.getURI();
    setVoiceUri(uri);
    setRecording(null);
  }

  async function playVoice() {
    if (!voiceUri) return;
    const { sound } = await Audio.Sound.createAsync({ uri: voiceUri });
    setSound(sound);
    await sound.playAsync();
  }

  return (
    <View style={styles.container}>
      <LinearGradient colors={['#FFFFFF', '#F8FAFC']} style={StyleSheet.absoluteFill} />
      
      <ScrollView 
        showsVerticalScrollIndicator={false} 
        contentContainerStyle={styles.scrollContent}
      >
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
            <ChevronLeft size={24} color="#1E293B" />
          </TouchableOpacity>
          <View style={styles.headerTitleContainer}>
            <Text style={styles.headerTitle}>Creator Studio</Text>
            <View style={styles.aiBadge}>
              <Sparkles size={10} color="#FFF" fill="#FFF" />
              <Text style={styles.aiBadgeText}>AI POWERED</Text>
            </View>
          </View>
          <TouchableOpacity style={styles.assistantBtn} onPress={() => setShowAIAssistant(!showAIAssistant)}>
            <Animated.View style={[{ transform: [{ scale: aiPulse }] }]}>
              <Cpu size={22} color="#8B5CF6" />
            </Animated.View>
          </TouchableOpacity>
        </View>

        {/* AI Analysis Section */}
        {selectedMedia.length > 0 && (
          <Animated.View entering={FadeInUp} style={styles.aiAnalysisCard}>
            <LinearGradient colors={['#8B5CF6', '#6366F1']} style={styles.aiAnalysisGradient}>
              <View style={styles.analysisHeader}>
                <Activity size={20} color="#FFF" />
                <Text style={styles.analysisTitle}>{isAnalyzing ? 'AI ANALYZING FOOTAGE...' : 'ANALYSIS COMPLETE'}</Text>
                {!isAnalyzing && <View style={styles.checkBadge}><UserCheck size={12} color="#10B981" /></View>}
              </View>
              
              <View style={styles.progressContainer}>
                <View style={[styles.progressBar, { width: `${analysisProgress * 100}%` }]} />
              </View>
              
              {!isAnalyzing && (
                <View style={styles.insightsRow}>
                  <View style={styles.insightItem}>
                    <TrendingUp size={16} color="#FFF" />
                    <Text style={styles.insightText}>Viral Potential: {viralScore}%</Text>
                  </View>
                  <View style={styles.insightItem}>
                    <Zap size={16} color="#FFF" />
                    <Text style={styles.insightText}>Smart Cuts Enabled</Text>
                  </View>
                </View>
              )}
            </LinearGradient>
          </Animated.View>
        )}

        {/* Media Upload Section */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Raw Footage</Text>
            <TouchableOpacity onPress={pickMedia}><Text style={styles.seeAll}>Add More</Text></TouchableOpacity>
          </View>
          
          {selectedMedia.length > 0 ? (
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.mediaPreviewList}>
              {selectedMedia.map((item, index) => (
                <Animated.View entering={FadeInRight.delay(index * 100)} key={index} style={styles.mediaPreviewItem}>
                  <Image source={{ uri: item.uri }} style={styles.previewImage} />
                  <TouchableOpacity style={styles.removeBtn} onPress={() => {
                    const newMedia = [...selectedMedia];
                    newMedia.splice(index, 1);
                    setSelectedMedia(newMedia);
                  }}>
                    <X size={12} color="#FFF" />
                  </TouchableOpacity>
                  {item.type === 'video' && <View style={styles.videoBadge}><Video size={10} color="#FFF" /></View>}
                </Animated.View>
              ))}
            </ScrollView>
          ) : (
            <TouchableOpacity style={styles.uploadBox} onPress={pickMedia}>
              <GlassCard style={styles.uploadGlass}>
                <View style={styles.uploadIconCircle}>
                  <Upload size={32} color="#8B5CF6" />
                </View>
                <Text style={styles.uploadText}>Drop your magic here</Text>
                <Text style={styles.uploadSub}>AI will auto-tag your footage</Text>
              </GlassCard>
            </TouchableOpacity>
          )}
        </View>

        {/* AI Style Suggestions */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>AI Style Recommendations</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.effectsList}>
            {AI_EFFECTS.map((effect, idx) => (
              <Animated.View entering={FadeInRight.delay(idx * 150)} key={effect.id}>
                <Pressable style={styles.effectCard}>
                  <View style={styles.effectIcon}>{effect.icon}</View>
                  <Text style={styles.effectName}>{effect.name}</Text>
                  <View style={styles.plusBadge}><Sparkles size={10} color="#FFF" /></View>
                </Pressable>
              </Animated.View>
            ))}
          </ScrollView>
        </View>

        {/* Trending Templates */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Trending Templates</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.templateList}>
            {TRENDING_TEMPLATES.map((tpl, idx) => (
              <Animated.View entering={FadeInRight.delay(idx * 200)} key={tpl.id} style={styles.templateCard}>
                <Image source={{ uri: tpl.preview }} style={styles.templateImage} />
                <LinearGradient colors={['transparent', 'rgba(0,0,0,0.8)']} style={styles.templateOverlay}>
                  <View style={styles.templateTag}><Text style={styles.templateTagText}>{tpl.tag}</Text></View>
                  <Text style={styles.templateName}>{tpl.name}</Text>
                </LinearGradient>
              </Animated.View>
            ))}
          </ScrollView>
        </View>

        {/* Target Duration */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Target Duration</Text>
          <View style={styles.lengthRow}>
            {LENGTH_OPTIONS.map((item) => (
              <TouchableOpacity 
                key={item.id}
                style={[styles.lengthCard, videoLength === item.id && styles.lengthSelected]}
                onPress={() => setVideoLength(item.id)}
              >
                <Text style={styles.lengthIcon}>{item.icon}</Text>
                <Text style={[styles.lengthText, videoLength === item.id && styles.lengthTextSelected]}>{item.label}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Instructions */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Creative Instructions</Text>
          <GlassCard style={styles.inputCard}>
            <TextInput 
              placeholder="Tell us your vision... AI will refine it."
              multiline
              numberOfLines={3}
              style={styles.textInput}
              placeholderTextColor="#94A3B8"
            />
            <View style={styles.voiceSection}>
              {voiceUri ? (
                <View style={styles.voicePlayer}>
                  <TouchableOpacity style={styles.playBtn} onPress={playVoice}>
                    <Play size={16} color="#FFF" fill="#FFF" />
                    <Text style={styles.playText}>Play Instruction</Text>
                  </TouchableOpacity>
                  <TouchableOpacity onPress={() => setVoiceUri(null)} style={styles.deleteBtn}>
                    <X size={16} color="#94A3B8" />
                  </TouchableOpacity>
                </View>
              ) : (
                <TouchableOpacity 
                  style={[styles.voiceBtn, isRecording && styles.recordingBtn]} 
                  onPress={isRecording ? stopRecording : startRecording}
                >
                  <View style={styles.wavePlaceholder}>
                    <Activity size={16} color={isRecording ? "#EF4444" : "#8B5CF6"} />
                    <Text style={[styles.voiceText, isRecording && { color: '#EF4444' }]}>
                      {isRecording ? "Recording... (Tap to stop)" : "Add Voice Instruction"}
                    </Text>
                  </View>
                  <View style={[styles.micCircle, isRecording && { backgroundColor: '#EF4444' }]}>
                    {isRecording ? <Square size={16} color="#FFF" fill="#FFF" /> : <Mic size={18} color="#FFF" />}
                  </View>
                </TouchableOpacity>
              )}
            </View>
          </GlassCard>
        </View>

        {/* Delivery Speed */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Delivery Speed</Text>
            <View style={styles.liveBadge}>
              <View style={styles.pulseDot} />
              <Text style={styles.liveText}>12 Editors Live</Text>
            </View>
          </View>
          <View style={styles.speedRow}>
            <SpeedOption title="Standard" time="48h" price="+₹0" selected={deliverySpeed === 'standard'} onPress={() => setDeliverySpeed('standard')} />
            <SpeedOption title="Turbo" time="6h" price="+₹100" selected={deliverySpeed === 'turbo'} onPress={() => setDeliverySpeed('turbo')} />
            <SpeedOption title="Flash" time="45m" price="+₹250" selected={deliverySpeed === 'zap'} onPress={() => setDeliverySpeed('zap')} />
          </View>
        </View>

        {/* Rewards */}
        <Animated.View entering={FadeInUp.delay(500)} style={styles.rewardCard}>
          <Gift size={24} color="#F59E0B" />
          <View style={styles.rewardContent}>
            <Text style={styles.rewardTitle}>Creator Milestone</Text>
            <Text style={styles.rewardDesc}>You're 1 edit away from "Star Editor" badge!</Text>
          </View>
          <View style={styles.rewardProgress}>
            <Text style={styles.rewardPoints}>4/5</Text>
          </View>
        </Animated.View>

        <View style={{ height: 40 }} />
      </ScrollView>

      {/* Floating Assistant */}
      {showAIAssistant && (
        <Animated.View entering={FadeInUp} style={styles.assistantOverlay}>
          <GlassCard style={styles.assistantGlass}>
            <View style={styles.assistantHeader}>
              <Cpu size={20} color="#8B5CF6" />
              <Text style={styles.assistantTitle}>AI Assistant</Text>
              <TouchableOpacity onPress={() => setShowAIAssistant(false)}><X size={18} color="#94A3B8" /></TouchableOpacity>
            </View>
            <Text style={styles.assistantMsg}>"I've detected this footage is a high-energy vlog. I recommend the 'Flash' delivery for trending viral impact!"</Text>
            <TouchableOpacity style={styles.assistantAction}>
              <Wand2 size={16} color="#FFF" />
              <Text style={styles.assistantActionText}>Apply Recommendations</Text>
            </TouchableOpacity>
          </GlassCard>
        </Animated.View>
      )}

      {/* Bottom Bar - Redesigned for better visibility */}
      <View style={styles.bottomBar}>
        <LinearGradient 
          colors={['rgba(255,255,255,0.9)', 'rgba(255,255,255,1)']} 
          style={styles.bottomBarGradient}
        >
          <View style={styles.bottomMainRow}>
            <View style={styles.priceContainer}>
              <Text style={styles.totalLabel}>ESTIMATE</Text>
              <Animated.Text style={[styles.totalVal, animatedPriceStyle]}>₹{totalPrice}</Animated.Text>
            </View>

            <TouchableOpacity 
              style={[styles.continueBtn, selectedMedia.length === 0 && styles.disabledBtn]}
              onPress={() => {
                if (selectedMedia.length === 0) {
                  pickMedia();
                } else {
                  router.push({
                    pathname: '/(customer)/matching',
                    params: { totalPrice }
                  });
                }
              }}
              activeOpacity={0.8}
            >
              <LinearGradient 
                colors={selectedMedia.length > 0 ? ['#8B5CF6', '#3B82F6'] : ['#F1F5F9', '#E2E8F0']} 
                start={{x:0, y:0}} 
                end={{x:1, y:0}} 
                style={styles.btnGradient}
              >
                <Text style={[styles.continueText, selectedMedia.length === 0 && { color: '#94A3B8' }]}>
                  {selectedMedia.length > 0 ? 'Find Editors' : 'Add Media'}
                </Text>
                <ChevronRight size={18} color={selectedMedia.length > 0 ? "#FFF" : "#94A3B8"} />
              </LinearGradient>
            </TouchableOpacity>
          </View>
          
          <View style={styles.deliveryTagRow}>
            <Clock size={12} color="#6366F1" />
            <Text style={styles.deliveryTagText}>Est. Delivery: {deliverySpeed === 'zap' ? '45 mins' : '6 hrs'}</Text>
          </View>
        </LinearGradient>
      </View>
    </View>
  );
}

function SpeedOption({ title, time, price, selected, onPress }: any) {
  return (
    <TouchableOpacity 
      onPress={onPress}
      style={[styles.speedCard, selected && styles.speedSelected]}
    >
      <Zap size={18} color={selected ? '#8B5CF6' : '#94A3B8'} />
      <Text style={[styles.speedTitle, selected && styles.speedTitleSelected]}>{title}</Text>
      <Text style={styles.speedTime}>{time}</Text>
      <Text style={[styles.speedPrice, selected && styles.speedPriceSelected]}>{price}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFFFFF' },
  scrollContent: { paddingTop: 60, paddingHorizontal: 24, paddingBottom: 20 },
  header: { 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    alignItems: 'center', 
    marginBottom: 20,
    backgroundColor: 'rgba(255,255,255,0.9)',
    paddingVertical: 10,
  },
  backBtn: { width: 44, height: 44, borderRadius: 15, backgroundColor: '#F8FAFC', alignItems: 'center', justifyContent: 'center' },
  headerTitleContainer: { alignItems: 'center' },
  headerTitle: { fontSize: 18, fontWeight: '900', color: '#1E293B', letterSpacing: -0.5 },
  aiBadge: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#8B5CF6', paddingHorizontal: 8, paddingVertical: 2, borderRadius: 6, marginTop: 2 },
  aiBadgeText: { color: '#FFF', fontSize: 8, fontWeight: '900', marginLeft: 4 },
  assistantBtn: { width: 44, height: 44, borderRadius: 15, backgroundColor: '#F5F3FF', alignItems: 'center', justifyContent: 'center' },
  
  aiAnalysisCard: { borderRadius: 24, overflow: 'hidden', marginBottom: 24, elevation: 8, shadowColor: '#8B5CF6', shadowOpacity: 0.2, shadowRadius: 15 },
  aiAnalysisGradient: { padding: 20 },
  analysisHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 15 },
  analysisTitle: { color: '#FFF', fontSize: 12, fontWeight: '900', marginLeft: 10, letterSpacing: 1 },
  checkBadge: { marginLeft: 'auto', backgroundColor: '#FFF', padding: 2, borderRadius: 10 },
  progressContainer: { height: 6, backgroundColor: 'rgba(255,255,255,0.2)', borderRadius: 3, marginBottom: 15, overflow: 'hidden' },
  progressBar: { height: '100%', backgroundColor: '#FFF', borderRadius: 3 },
  insightsRow: { flexDirection: 'row', gap: 15 },
  insightItem: { flexDirection: 'row', alignItems: 'center', backgroundColor: 'rgba(255,255,255,0.15)', paddingHorizontal: 10, paddingVertical: 6, borderRadius: 12 },
  insightText: { color: '#FFF', fontSize: 11, fontWeight: '700', marginLeft: 6 },

  section: { marginBottom: 24 },
  sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 },
  sectionTitle: { fontSize: 17, fontWeight: '900', color: '#1E293B', letterSpacing: -0.3 },
  seeAll: { fontSize: 13, fontWeight: '700', color: '#8B5CF6' },
  
  uploadBox: { borderRadius: 30, overflow: 'hidden', height: 200, backgroundColor: '#F8FAFC', borderWidth: 2, borderColor: '#F1F5F9', borderStyle: 'dashed' },
  uploadGlass: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  uploadIconCircle: { width: 70, height: 70, borderRadius: 35, backgroundColor: '#F5F3FF', alignItems: 'center', justifyContent: 'center', marginBottom: 15 },
  uploadText: { fontSize: 18, fontWeight: '900', color: '#1E293B' },
  uploadSub: { fontSize: 13, color: '#94A3B8', marginTop: 6, fontWeight: '600' },
  
  mediaPreviewList: { flexDirection: 'row' },
  mediaPreviewItem: { width: 110, height: 110, borderRadius: 24, marginRight: 15, overflow: 'hidden', backgroundColor: '#F1F5F9' },
  previewImage: { width: '100%', height: '100%' },
  removeBtn: { position: 'absolute', top: 8, right: 8, backgroundColor: 'rgba(0,0,0,0.4)', borderRadius: 12, width: 24, height: 24, alignItems: 'center', justifyContent: 'center' },
  videoBadge: { position: 'absolute', bottom: 8, right: 8, backgroundColor: 'rgba(139, 92, 246, 0.8)', borderRadius: 6, padding: 4 },

  effectsList: { paddingLeft: 4 },
  effectCard: { width: 100, height: 110, backgroundColor: '#FFF', borderRadius: 24, padding: 15, marginRight: 15, alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: '#F1F5F9', elevation: 2 },
  effectIcon: { width: 40, height: 40, borderRadius: 15, backgroundColor: '#F5F3FF', alignItems: 'center', justifyContent: 'center', marginBottom: 10 },
  effectName: { fontSize: 11, fontWeight: '800', color: '#1E293B', textAlign: 'center' },
  plusBadge: { position: 'absolute', top: -5, right: -5, backgroundColor: '#8B5CF6', padding: 4, borderRadius: 10 },

  templateList: { paddingLeft: 4 },
  templateCard: { width: 160, height: 220, borderRadius: 28, marginRight: 18, overflow: 'hidden', elevation: 4 },
  templateImage: { width: '100%', height: '100%' },
  templateOverlay: { position: 'absolute', bottom: 0, left: 0, right: 0, padding: 15, height: '60%', justifyContent: 'flex-end' },
  templateTag: { alignSelf: 'flex-start', backgroundColor: '#8B5CF6', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 8, marginBottom: 8 },
  templateTagText: { color: '#FFF', fontSize: 9, fontWeight: '900' },
  templateName: { color: '#FFF', fontSize: 14, fontWeight: '900' },

  lengthRow: { flexDirection: 'row', justifyContent: 'space-between' },
  lengthCard: { width: '23%', paddingVertical: 18, borderRadius: 22, backgroundColor: '#FFF', alignItems: 'center', borderWidth: 1, borderColor: '#F1F5F9' },
  lengthSelected: { borderColor: '#8B5CF6', backgroundColor: '#F5F3FF', elevation: 2 },
  lengthIcon: { fontSize: 20, marginBottom: 5 },
  lengthText: { fontSize: 11, fontWeight: '800', color: '#94A3B8' },
  lengthTextSelected: { color: '#8B5CF6' },

  inputCard: { padding: 20, backgroundColor: '#FFF' },
  textInput: { fontSize: 15, color: '#1E293B', lineHeight: 22, height: 80, textAlignVertical: 'top', fontWeight: '600' },
  
  voiceSection: { marginTop: 15, borderTopWidth: 1, borderTopColor: '#F1F5F9', paddingTop: 15 },
  voiceBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', backgroundColor: '#F8FAFC', padding: 12, borderRadius: 18 },
  recordingBtn: { backgroundColor: '#FEF2F2', borderColor: '#FECACA', borderWidth: 1 },
  wavePlaceholder: { flexDirection: 'row', alignItems: 'center', flex: 1 },
  voiceText: { marginLeft: 10, fontSize: 13, fontWeight: '700', color: '#8B5CF6' },
  micCircle: { width: 36, height: 36, borderRadius: 18, backgroundColor: '#8B5CF6', alignItems: 'center', justifyContent: 'center' },
  
  voicePlayer: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', backgroundColor: '#F5F3FF', padding: 10, borderRadius: 18 },
  playBtn: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#8B5CF6', paddingHorizontal: 15, paddingVertical: 8, borderRadius: 12 },
  playText: { color: '#FFF', fontSize: 12, fontWeight: '800', marginLeft: 8 },
  deleteBtn: { padding: 8 },

  speedRow: { flexDirection: 'row', justifyContent: 'space-between' },
  speedCard: { width: '31%', padding: 15, borderRadius: 24, backgroundColor: '#FFF', alignItems: 'center', borderWidth: 1, borderColor: '#F1F5F9' },
  speedSelected: { borderColor: '#8B5CF6', backgroundColor: '#F5F3FF', elevation: 2 },
  speedTitle: { fontSize: 13, fontWeight: '900', color: '#94A3B8', marginTop: 10 },
  speedTitleSelected: { color: '#8B5CF6' },
  speedTime: { fontSize: 10, color: '#94A3B8', marginTop: 4, fontWeight: '700' },
  speedPrice: { fontSize: 15, fontWeight: '900', color: '#1E293B', marginTop: 10 },
  speedPriceSelected: { color: '#8B5CF6' },

  liveBadge: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#F0FDF4', paddingHorizontal: 10, paddingVertical: 5, borderRadius: 12 },
  pulseDot: { width: 6, height: 6, borderRadius: 3, backgroundColor: '#22C55E', marginRight: 6 },
  liveText: { fontSize: 10, fontWeight: '800', color: '#16A34A' },

  rewardCard: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#FFF8EB', padding: 20, borderRadius: 28, borderWidth: 1, borderColor: '#FEF3C7' },
  rewardContent: { flex: 1, marginLeft: 15 },
  rewardTitle: { fontSize: 15, fontWeight: '900', color: '#B45309' },
  rewardDesc: { fontSize: 11, color: '#D97706', marginTop: 2, fontWeight: '600' },
  rewardProgress: { width: 44, height: 44, borderRadius: 22, backgroundColor: '#FFF', alignItems: 'center', justifyContent: 'center', borderWidth: 2, borderColor: '#F59E0B' },
  rewardPoints: { fontSize: 13, fontWeight: '900', color: '#B45309' },

  assistantOverlay: { position: 'absolute', top: 100, right: 24, left: 24, zIndex: 100 },
  assistantGlass: { padding: 20, backgroundColor: 'rgba(255,255,255,0.95)', borderLeftWidth: 4, borderLeftColor: '#8B5CF6', elevation: 10 },
  assistantHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 12 },
  assistantTitle: { fontSize: 14, fontWeight: '900', color: '#1E293B', marginLeft: 10, flex: 1 },
  assistantMsg: { fontSize: 13, color: '#475569', lineHeight: 20, fontWeight: '600', marginBottom: 15 },
  assistantAction: { backgroundColor: '#8B5CF6', flexDirection: 'row', alignItems: 'center', justifyContent: 'center', paddingVertical: 12, borderRadius: 15 },
  assistantActionText: { color: '#FFF', fontSize: 13, fontWeight: '800', marginLeft: 8 },

  bottomBar: { 
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    zIndex: 1000,
  },
  bottomBarGradient: {
    paddingHorizontal: 24,
    paddingTop: 15,
    paddingBottom: Platform.OS === 'ios' ? 110 : 90, // Significant padding to clear Tab Bar
    borderTopWidth: 1,
    borderTopColor: '#F1F5F9',
    elevation: 25,
    shadowColor: '#000',
    shadowOpacity: 0.15,
    shadowRadius: 15,
    shadowOffset: { width: 0, height: -10 }
  },
  bottomMainRow: { 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    alignItems: 'center',
    marginBottom: 10
  },
  priceContainer: { flex: 1 },
  deliveryTagRow: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#F5F3FF', alignSelf: 'flex-start', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 8 },
  deliveryTagText: { fontSize: 10, fontWeight: '800', color: '#6366F1', marginLeft: 4 },
  
  totalLabel: { fontSize: 10, fontWeight: '900', color: '#94A3B8', letterSpacing: 1 },
  totalVal: { fontSize: 28, fontWeight: '900', color: '#1E293B', letterSpacing: -1 },
  
  continueBtn: { flex: 1.5, borderRadius: 18, overflow: 'hidden', marginLeft: 20 },
  disabledBtn: { opacity: 0.8 },
  btnGradient: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', paddingVertical: 15, gap: 8 },
  continueText: { color: '#FFF', fontSize: 15, fontWeight: '900', letterSpacing: 0.3 }
});

