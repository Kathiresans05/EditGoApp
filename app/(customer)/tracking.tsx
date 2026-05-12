import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image, Dimensions } from 'react-native';
import { ChevronLeft, MessageSquare, Phone, Clock, MapPin, CheckCircle2, Circle } from 'lucide-react-native';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { GlassCard } from '../../src/components/ui/GlassCard';
import Animated, { FadeInUp, FadeInLeft } from 'react-native-reanimated';

const { width } = Dimensions.get('window');

const TRACKING_STEPS = [
  { id: 'SEARCHING', label: 'Searching Editor', done: true },
  { id: 'ACCEPTED', label: 'Editor Accepted', done: true },
  { id: 'EDITING', label: 'Editing Started', done: true, current: true },
  { id: 'VFX', label: 'Transitions & Effects', done: false },
  { id: 'COLOR', label: 'Color Grading', done: false },
  { id: 'RENDER', label: 'Rendering & Export', done: false },
  { id: 'UPLOAD', label: 'Uploading Final File', done: false },
];

export default function TrackingScreen() {
  const router = useRouter();
  const [progress, setProgress] = useState(35);

  return (
    <View style={styles.container}>
      <LinearGradient colors={['#8B5CF6', '#3B82F6']} style={styles.header}>
        <View style={styles.headerRow}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
            <ChevronLeft size={24} color="#FFF" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Live Progress</Text>
          <View style={{ width: 40 }} />
        </View>

        <View style={styles.statusMain}>
          <Text style={styles.etaLabel}>ESTIMATED DELIVERY</Text>
          <Text style={styles.etaValue}>12:45 PM (24 mins left)</Text>
          
          <View style={styles.progressContainer}>
            <View style={styles.progressBarBg}>
              <View style={[styles.progressBarFill, { width: `${progress}%` }]} />
            </View>
            <Text style={styles.progressText}>{progress}% Complete</Text>
          </View>
        </View>
      </LinearGradient>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Editor Info Card */}
        <GlassCard style={styles.editorCard}>
          <View style={styles.editorRow}>
            <View style={styles.avatar}><Text style={styles.avatarText}>AK</Text></View>
            <View style={styles.editorDetails}>
              <Text style={styles.editorName}>Arjun Kumar</Text>
              <Text style={styles.editorStatus}>Editing your Cinematic Reel</Text>
            </View>
            <View style={styles.actions}>
              <TouchableOpacity style={styles.actionIcon}><Phone size={20} color="#8B5CF6" /></TouchableOpacity>
              <TouchableOpacity style={styles.actionIcon}><MessageSquare size={20} color="#8B5CF6" /></TouchableOpacity>
            </View>
          </View>
        </GlassCard>

        {/* Live Stepper */}
        <View style={styles.stepperContainer}>
          <Text style={styles.sectionTitle}>Order Workflow</Text>
          {TRACKING_STEPS.map((step, index) => (
            <View key={step.id} style={styles.stepRow}>
              <View style={styles.stepLeft}>
                <View style={[styles.dot, step.done ? styles.dotDone : (step.current ? styles.dotCurrent : styles.dotTodo)]}>
                  {step.done && <CheckCircle2 size={16} color="#FFF" />}
                </View>
                {index < TRACKING_STEPS.length - 1 && <View style={[styles.line, step.done && styles.lineDone]} />}
              </View>
              <View style={styles.stepRight}>
                <Text style={[styles.stepLabel, step.current && styles.stepLabelCurrent]}>{step.label}</Text>
                {step.current && (
                  <Animated.Text entering={FadeInLeft} style={styles.stepSub}>
                    Editor is currently adding transitions...
                  </Animated.Text>
                )}
              </View>
            </View>
          ))}
        </View>

        {/* AI Style Tip */}
        <LinearGradient colors={['#F5F3FF', '#EDE9FE']} style={styles.aiTip}>
          <Text style={styles.aiTipTitle}>🪄 AI Studio Tip</Text>
          <Text style={styles.aiTipDesc}>"Add a neon glow effect to the transitions for a more viral aesthetic."</Text>
          <TouchableOpacity style={styles.suggestBtn}>
            <Text style={styles.suggestText}>Suggest to Editor</Text>
          </TouchableOpacity>
        </LinearGradient>

        <View style={{ height: 100 }} />
      </ScrollView>

      {/* Floating Bottom Chat Input */}
      <View style={styles.bottomBar}>
        <TouchableOpacity style={styles.chatInput}>
          <Text style={styles.chatPlaceholder}>Send instructions to Arjun...</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8FAFC' },
  header: { paddingTop: 60, paddingBottom: 40, paddingHorizontal: 24, borderBottomLeftRadius: 40, borderBottomRightRadius: 40 },
  headerRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  backBtn: { width: 40, height: 40, borderRadius: 12, backgroundColor: 'rgba(255,255,255,0.2)', alignItems: 'center', justifyContent: 'center' },
  headerTitle: { color: '#FFF', fontSize: 18, fontWeight: '800' },
  statusMain: { marginTop: 30, alignItems: 'center' },
  etaLabel: { color: 'rgba(255,255,255,0.7)', fontSize: 12, fontWeight: '700', letterSpacing: 1 },
  etaValue: { color: '#FFF', fontSize: 22, fontWeight: '900', marginTop: 8 },
  progressContainer: { width: '100%', marginTop: 24, alignItems: 'center' },
  progressBarBg: { width: '80%', height: 8, backgroundColor: 'rgba(255,255,255,0.2)', borderRadius: 4 },
  progressBarFill: { height: 8, backgroundColor: '#FFF', borderRadius: 4 },
  progressText: { color: '#FFF', fontSize: 13, fontWeight: '700', marginTop: 12 },
  content: { padding: 24 },
  editorCard: { padding: 16, backgroundColor: '#FFF', marginTop: -40, elevation: 5 },
  editorRow: { flexDirection: 'row', alignItems: 'center' },
  avatar: { width: 50, height: 50, borderRadius: 25, backgroundColor: '#F1F5F9', alignItems: 'center', justifyContent: 'center' },
  avatarText: { fontSize: 18, fontWeight: '800', color: '#8B5CF6' },
  editorDetails: { flex: 1, marginLeft: 16 },
  editorName: { fontSize: 16, fontWeight: '700', color: '#1E293B' },
  editorStatus: { fontSize: 12, color: '#64748B', marginTop: 2 },
  actions: { flexDirection: 'row' },
  actionIcon: { width: 36, height: 36, borderRadius: 18, backgroundColor: '#F5F3FF', alignItems: 'center', justifyContent: 'center', marginLeft: 8 },
  stepperContainer: { marginTop: 32 },
  sectionTitle: { fontSize: 18, fontWeight: '800', color: '#1E293B', marginBottom: 20 },
  stepRow: { flexDirection: 'row', height: 60 },
  stepLeft: { alignItems: 'center', width: 30 },
  dot: { width: 24, height: 24, borderRadius: 12, alignItems: 'center', justifyContent: 'center', zIndex: 1 },
  dotDone: { backgroundColor: '#10B981' },
  dotCurrent: { backgroundColor: '#8B5CF6', borderWidth: 4, borderColor: '#DDD6FE' },
  dotTodo: { backgroundColor: '#E2E8F0' },
  line: { width: 2, flex: 1, backgroundColor: '#E2E8F0', marginTop: -2, marginBottom: -2 },
  lineDone: { backgroundColor: '#10B981' },
  stepRight: { marginLeft: 16, flex: 1 },
  stepLabel: { fontSize: 15, fontWeight: '600', color: '#64748B' },
  stepLabelCurrent: { color: '#1E293B', fontWeight: '800' },
  stepSub: { fontSize: 12, color: '#8B5CF6', marginTop: 4, fontWeight: '600' },
  aiTip: { padding: 20, borderRadius: 24, marginTop: 32, borderLeftWidth: 4, borderLeftColor: '#8B5CF6' },
  aiTipTitle: { fontSize: 15, fontWeight: '800', color: '#8B5CF6', marginBottom: 8 },
  aiTipDesc: { fontSize: 13, color: '#475569', lineHeight: 20, marginBottom: 12 },
  suggestBtn: { backgroundColor: '#FFF', paddingHorizontal: 16, paddingVertical: 8, borderRadius: 12, alignSelf: 'flex-start' },
  suggestText: { color: '#8B5CF6', fontWeight: '800', fontSize: 12 },
  bottomBar: { position: 'absolute', bottom: 30, left: 24, right: 24 },
  chatInput: { backgroundColor: '#FFF', padding: 16, borderRadius: 20, shadowColor: '#000', shadowOpacity: 0.1, shadowRadius: 10, elevation: 5 },
  chatPlaceholder: { color: '#94A3B8', fontSize: 14 }
});
