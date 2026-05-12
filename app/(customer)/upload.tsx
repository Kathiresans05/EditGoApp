import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput, Dimensions, Alert, Image } from 'react-native';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { Upload, Video, Image as ImageIcon, ChevronLeft, Mic, Clock, Sparkles, X, Play, Square } from 'lucide-react-native';
import * as ImagePicker from 'expo-image-picker';
import { Audio } from 'expo-av';
import { GlassCard } from '../../src/components/ui/GlassCard';

const { width, height } = Dimensions.get('window');

export default function UploadScreen() {
  const router = useRouter();
  const [deliverySpeed, setDeliverySpeed] = useState('standard');
  const [selectedMedia, setSelectedMedia] = useState<any[]>([]);
  const [recording, setRecording] = useState<Audio.Recording | null>(null);
  const [voiceUri, setVoiceUri] = useState<string | null>(null);
  const [isRecording, setIsRecording] = useState(false);
  const [sound, setSound] = useState<Audio.Sound | null>(null);

  useEffect(() => {
    return () => {
      if (sound) {
        sound.unloadAsync();
      }
    };
  }, [sound]);

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
    }
  };

  const removeMedia = (index: number) => {
    const newMedia = [...selectedMedia];
    newMedia.splice(index, 1);
    setSelectedMedia(newMedia);
  };

  async function startRecording() {
    try {
      const { status } = await Audio.requestPermissionsAsync();
      if (status !== 'granted') return;

      await Audio.setAudioModeAsync({
        allowsRecordingIOS: true,
        playsInSilentModeIOS: true,
      });

      const { recording } = await Audio.Recording.createAsync(
        Audio.RecordingOptionsPresets.HIGH_QUALITY
      );
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
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
            <ChevronLeft size={24} color="#1E293B" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>New Edit Request</Text>
          <View style={{ width: 40 }} />
        </View>

        {/* Upload Box */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Upload your footage</Text>
          {selectedMedia.length > 0 ? (
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.mediaPreviewList}>
              {selectedMedia.map((item, index) => (
                <View key={index} style={styles.mediaPreviewItem}>
                  <Image source={{ uri: item.uri }} style={styles.previewImage} />
                  <TouchableOpacity style={styles.removeBtn} onPress={() => removeMedia(index)}>
                    <X size={12} color="#FFF" />
                  </TouchableOpacity>
                  {item.type === 'video' && (
                    <View style={styles.videoBadge}>
                      <Video size={10} color="#FFF" />
                    </View>
                  )}
                </View>
              ))}
              <TouchableOpacity style={styles.addMoreBtn} onPress={pickMedia}>
                <Upload size={20} color="#8B5CF6" />
                <Text style={styles.addMoreText}>Add</Text>
              </TouchableOpacity>
            </ScrollView>
          ) : (
            <TouchableOpacity style={styles.uploadBox} onPress={pickMedia}>
              <LinearGradient
                colors={['#F5F3FF', '#F1F5F9']}
                style={styles.uploadGradient}
              >
                <View style={styles.uploadIconCircle}>
                  <Upload size={32} color="#8B5CF6" />
                </View>
                <Text style={styles.uploadText}>Select videos or photos</Text>
                <Text style={styles.uploadSub}>Max file size: 500MB</Text>
              </LinearGradient>
            </TouchableOpacity>
          )}
        </View>

        {/* Instructions */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Instructions</Text>
          <GlassCard style={styles.inputCard}>
            <TextInput 
              placeholder="Ex: Make it cinematic with fast transitions and sync it with beat..."
              multiline
              numberOfLines={4}
              style={styles.textInput}
              placeholderTextColor="#94A3B8"
            />
            <View style={styles.voiceSection}>
              {voiceUri ? (
                <View style={styles.voicePlayer}>
                  <TouchableOpacity style={styles.playBtn} onPress={playVoice}>
                    <Play size={16} color="#FFF" fill="#FFF" />
                    <Text style={styles.playText}>Play Voice Instruction</Text>
                  </TouchableOpacity>
                  <TouchableOpacity onPress={() => setVoiceUri(null)}>
                    <X size={20} color="#94A3B8" />
                  </TouchableOpacity>
                </View>
              ) : (
                <TouchableOpacity 
                  style={[styles.voiceBtn, isRecording && styles.recordingBtn]} 
                  onPress={isRecording ? stopRecording : startRecording}
                >
                  {isRecording ? (
                    <>
                      <Square size={20} color="#EF4444" fill="#EF4444" />
                      <Text style={[styles.voiceText, { color: '#EF4444' }]}>Stop Recording...</Text>
                    </>
                  ) : (
                    <>
                      <Mic size={20} color="#8B5CF6" />
                      <Text style={styles.voiceText}>Add Voice Instruction</Text>
                    </>
                  )}
                </TouchableOpacity>
              )}
            </View>
          </GlassCard>
        </View>

        {/* Delivery Speed */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Select Delivery Speed</Text>
          <View style={styles.speedRow}>
            <SpeedOption 
              title="Standard" 
              time="24-48 hrs" 
              price="₹79" 
              selected={deliverySpeed === 'standard'} 
              onPress={() => setDeliverySpeed('standard')} 
            />
            <SpeedOption 
              title="Turbo" 
              time="4-6 hrs" 
              price="₹149" 
              selected={deliverySpeed === 'turbo'} 
              onPress={() => setDeliverySpeed('turbo')} 
            />
            <SpeedOption 
              title="Zap" 
              time="45 mins" 
              price="₹299" 
              selected={deliverySpeed === 'zap'} 
              onPress={() => setDeliverySpeed('zap')} 
            />
          </View>
        </View>

        {/* AI Style Suggestion */}
        <LinearGradient colors={['#F5F3FF', '#EDE9FE']} style={styles.aiCard}>
          <View style={styles.aiHeader}>
            <Sparkles size={18} color="#8B5CF6" />
            <Text style={styles.aiTitle}>AI Style Suggestion</Text>
          </View>
          <Text style={styles.aiDesc}>Based on your "Reels" category, "Neon Flow" transitions would look viral!</Text>
        </LinearGradient>

        <View style={{ height: 120 }} />
      </ScrollView>

      {/* Bottom Action Bar */}
      <View style={styles.bottomBar}>
        <TouchableOpacity 
          style={[styles.continueBtn, selectedMedia.length === 0 && styles.disabledBtn]}
          onPress={() => {
            if (selectedMedia.length === 0) {
              Alert.alert('Media Required', 'Please select at least one video or photo to continue.');
            } else {
              router.push('/(customer)/matching');
            }
          }}
          activeOpacity={0.8}
        >
          <LinearGradient 
            colors={selectedMedia.length > 0 ? ['#8B5CF6', '#3B82F6'] : ['#E2E8F0', '#CBD5E1']} 
            start={{x:0, y:0}} 
            end={{x:1, y:0}} 
            style={styles.btnGradient}
          >
            <Text style={[styles.continueText, selectedMedia.length === 0 && { color: '#94A3B8' }]}>
              {selectedMedia.length > 0 ? 'Find Best Editors' : 'Select Media to Continue'}
            </Text>
          </LinearGradient>
        </TouchableOpacity>
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
      <Clock size={20} color={selected ? '#8B5CF6' : '#94A3B8'} />
      <Text style={[styles.speedTitle, selected && styles.speedTitleSelected]}>{title}</Text>
      <Text style={styles.speedTime}>{time}</Text>
      <Text style={[styles.speedPrice, selected && styles.speedPriceSelected]}>{price}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8FAFC' },
  scrollContent: { paddingTop: 60, paddingHorizontal: 24 },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 32 },
  backBtn: { width: 40, height: 40, borderRadius: 12, backgroundColor: '#FFF', alignItems: 'center', justifyContent: 'center', elevation: 2 },
  headerTitle: { fontSize: 18, fontWeight: '800', color: '#1E293B' },
  section: { marginBottom: 32 },
  sectionTitle: { fontSize: 16, fontWeight: '800', color: '#1E293B', marginBottom: 16 },
  uploadBox: { borderRadius: 24, overflow: 'hidden', height: 180 },
  uploadGradient: { flex: 1, alignItems: 'center', justifyContent: 'center', borderWidth: 2, borderColor: '#E9E4FF', borderStyle: 'dashed', borderRadius: 24 },
  uploadIconCircle: { width: 64, height: 64, borderRadius: 32, backgroundColor: '#FFF', alignItems: 'center', justifyContent: 'center', marginBottom: 12, elevation: 2 },
  uploadText: { fontSize: 16, fontWeight: '700', color: '#1E293B' },
  uploadSub: { fontSize: 12, color: '#94A3B8', marginTop: 4 },
  mediaPreviewList: { flexDirection: 'row', paddingVertical: 10 },
  mediaPreviewItem: { width: 100, height: 100, borderRadius: 16, marginRight: 12, overflow: 'hidden', backgroundColor: '#E2E8F0' },
  previewImage: { width: '100%', height: '100%' },
  removeBtn: { position: 'absolute', top: 5, right: 5, backgroundColor: 'rgba(0,0,0,0.5)', borderRadius: 10, width: 20, height: 20, alignItems: 'center', justifyContent: 'center' },
  videoBadge: { position: 'absolute', bottom: 5, right: 5, backgroundColor: 'rgba(0,0,0,0.5)', borderRadius: 4, padding: 2 },
  addMoreBtn: { width: 100, height: 100, borderRadius: 16, borderStyle: 'dashed', borderWidth: 2, borderColor: '#8B5CF6', alignItems: 'center', justifyContent: 'center', backgroundColor: '#F5F3FF' },
  addMoreText: { fontSize: 12, fontWeight: '700', color: '#8B5CF6', marginTop: 4 },
  inputCard: { padding: 16, backgroundColor: '#FFF' },
  textInput: { fontSize: 14, color: '#1E293B', lineHeight: 22, height: 100, textAlignVertical: 'top' },
  voiceSection: { marginTop: 12, borderTopWidth: 1, borderTopColor: '#F1F5F9', paddingTop: 12 },
  voiceBtn: { flexDirection: 'row', alignItems: 'center' },
  recordingBtn: { backgroundColor: '#FEF2F2', padding: 8, borderRadius: 12 },
  voiceText: { marginLeft: 8, fontSize: 14, fontWeight: '700', color: '#8B5CF6' },
  voicePlayer: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  playBtn: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#8B5CF6', paddingVertical: 8, paddingHorizontal: 16, borderRadius: 20 },
  playText: { color: '#FFF', fontSize: 12, fontWeight: '700', marginLeft: 8 },
  speedRow: { flexDirection: 'row', justifyContent: 'space-between' },
  speedCard: { width: '31%', padding: 12, borderRadius: 20, backgroundColor: '#FFF', alignItems: 'center', borderWidth: 1, borderColor: '#F1F5F9' },
  speedSelected: { borderColor: '#8B5CF6', backgroundColor: '#F5F3FF' },
  speedTitle: { fontSize: 12, fontWeight: '800', color: '#94A3B8', marginTop: 8 },
  speedTitleSelected: { color: '#8B5CF6' },
  speedTime: { fontSize: 10, color: '#94A3B8', marginTop: 2 },
  speedPrice: { fontSize: 14, fontWeight: '800', color: '#1E293B', marginTop: 8 },
  speedPriceSelected: { color: '#8B5CF6' },
  aiCard: { padding: 20, borderRadius: 24, marginBottom: 20 },
  aiHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 8 },
  aiTitle: { fontSize: 14, fontWeight: '800', color: '#8B5CF6', marginLeft: 8 },
  aiDesc: { fontSize: 12, color: '#64748B', lineHeight: 18 },
  bottomBar: { 
    paddingHorizontal: 24,
    paddingBottom: 90, // Increased to clear the tab bar
    backgroundColor: 'transparent',
  },
  continueBtn: { 
    borderRadius: 20, 
    overflow: 'hidden', 
    elevation: 10, // Higher elevation for Android
    shadowColor: '#8B5CF6', 
    shadowOffset: { width: 0, height: 10 }, 
    shadowOpacity: 0.3, 
    shadowRadius: 20,
    backgroundColor: '#FFF' // Background for shadow
  },
  disabledBtn: { elevation: 2, shadowOpacity: 0.1 },
  btnGradient: { paddingVertical: 18, alignItems: 'center' },
  continueText: { color: '#FFF', fontSize: 16, fontWeight: '800' }
});

