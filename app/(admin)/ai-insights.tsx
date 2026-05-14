import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Dimensions, Platform } from 'react-native';
import { 
  Sparkles, Brain, Cpu, TrendingUp, 
  MessageSquare, Lightbulb, Zap, ArrowRight,
  BarChart3, Target, RefreshCcw, Bot, ChevronLeft
} from 'lucide-react-native';
import Animated, { FadeInUp, FadeInRight, FadeIn, Layout } from 'react-native-reanimated';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';

const { width } = Dimensions.get('window');

export default function AIInsightsScreen() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <ChevronLeft size={24} color="#0F172A" />
        </TouchableOpacity>
        <View>
          <View style={styles.tagRow}>
            <Bot size={10} color="#6366F1" />
            <Text style={styles.tagText}>NEURAL ENGINE V4.0</Text>
          </View>
          <Text style={styles.title}>Marketplace <Text style={styles.highlight}>Intelligence</Text></Text>
        </View>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        
        {/* Predictive Stats */}
        <View style={styles.neuralGrid}>
          <NeuralCard 
            title="Predictive Volume" 
            value="₹12.4M" 
            confidence={94} 
            icon={TrendingUp} 
            color="#6366F1" 
          />
          <NeuralCard 
            title="Churn Risk" 
            value="Low (1.2%)" 
            confidence={88} 
            icon={Brain} 
            color="#10B981" 
          />
        </View>

        {/* AI Recommendations */}
        <Text style={styles.sectionTitle}>Strategic Recommendations</Text>
        <View style={styles.recoList}>
          <RecommendationItem 
            impact="High" 
            title="Increase Cinematic Payouts" 
            desc="Demand for premium 4K cinematic reels is up 45%. Increasing editor payouts by 10% could secure 50+ top-tier creators." 
            color="#EF4444"
          />
          <RecommendationItem 
            impact="Medium" 
            title="Onboard Wedding Specialists" 
            desc="Tier-2 cities are showing a 3x surge in wedding short-form content requests." 
            color="#F59E0B"
          />
        </View>

        {/* Neural Specs Card */}
        <View style={styles.specsCard}>
          <LinearGradient colors={['#1E293B', '#0F172A']} style={styles.specsGradient}>
            <View style={styles.specsHeader}>
              <Cpu size={20} color="#6366F1" />
              <Text style={styles.specsTitle}>Compute Architecture</Text>
            </View>
            <View style={styles.specRows}>
              <SpecBar label="Neural Latency" value="142ms" progress={85} />
              <SpecBar label="Model Accuracy" value="98.2%" progress={98} />
              <SpecBar label="Cluster Health" value="Optimal" progress={100} />
            </View>
          </LinearGradient>
        </View>

        {/* Ask AI Trigger */}
        <TouchableOpacity style={styles.askCard}>
          <View style={styles.askIcon}>
            <MessageSquare size={24} color="#6366F1" />
          </View>
          <View style={styles.askTextContent}>
            <Text style={styles.askTitle}>Ask Intelligence</Text>
            <Text style={styles.askDesc}>Query the neural network for custom simulations.</Text>
          </View>
          <ArrowRight size={20} color="#CBD5E1" />
        </TouchableOpacity>

        <View style={{ height: 40 }} />
      </ScrollView>
    </View>
  );
}

function NeuralCard({ title, value, confidence, icon: Icon, color }: any) {
  return (
    <View style={styles.neuralCard}>
      <View style={styles.neuralTop}>
        <View style={[styles.iconBox, { backgroundColor: color + '15' }]}>
          <Icon size={24} color={color} />
        </View>
        <View style={styles.confBox}>
          <Text style={styles.confLabel}>CONFIDENCE</Text>
          <Text style={styles.confValue}>{confidence}%</Text>
        </View>
      </View>
      <Text style={styles.neuralValue}>{value}</Text>
      <Text style={styles.neuralLabel}>{title}</Text>
    </View>
  );
}

function RecommendationItem({ impact, title, desc, color }: any) {
  return (
    <View style={styles.recoItem}>
      <View style={styles.recoHeader}>
        <View style={[styles.impactBadge, { backgroundColor: color + '15' }]}>
          <Text style={[styles.impactText, { color }]}>{impact} IMPACT</Text>
        </View>
      </View>
      <Text style={styles.recoTitle}>{title}</Text>
      <Text style={styles.recoDesc}>{desc}</Text>
    </View>
  );
}

function SpecBar({ label, value, progress }: any) {
  return (
    <View style={styles.specBarContainer}>
      <View style={styles.specBarTop}>
        <Text style={styles.specBarLabel}>{label}</Text>
        <Text style={styles.specBarValue}>{value}</Text>
      </View>
      <View style={styles.barTrack}>
        <View style={[styles.barFill, { width: `${progress}%` }]} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FAFAFA' },
  header: { paddingHorizontal: 20, paddingTop: Platform.OS === 'ios' ? 60 : 40, paddingBottom: 20, flexDirection: 'row', alignItems: 'center' },
  backBtn: { width: 44, height: 44, borderRadius: 14, backgroundColor: '#FFF', alignItems: 'center', justifyContent: 'center', marginRight: 16, borderWidth: 1, borderColor: '#F1F5F9' },
  tagRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 4 },
  tagText: { fontSize: 10, fontWeight: '900', color: '#6366F1', letterSpacing: 2, marginLeft: 6 },
  title: { fontSize: 24, fontWeight: '900', color: '#0F172A', letterSpacing: -0.5 },
  highlight: { color: '#6366F1' },
  scrollContent: { padding: 20 },

  neuralGrid: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 32 },
  neuralCard: { width: '48.5%', backgroundColor: '#FFF', borderRadius: 28, padding: 20, borderWidth: 1, borderColor: '#F1F5F9', elevation: 4, shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 15 },
  neuralTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 20 },
  iconBox: { width: 48, height: 48, borderRadius: 16, alignItems: 'center', justifyContent: 'center' },
  confBox: { alignItems: 'flex-end' },
  confLabel: { fontSize: 8, fontWeight: '900', color: '#94A3B8' },
  confValue: { fontSize: 14, fontWeight: '900', color: '#1E293B' },
  neuralValue: { fontSize: 24, fontWeight: '900', color: '#1E293B' },
  neuralLabel: { fontSize: 11, fontWeight: '800', color: '#94A3B8', textTransform: 'uppercase', marginTop: 4 },

  sectionTitle: { fontSize: 20, fontWeight: '900', color: '#0F172A', marginBottom: 20 },
  recoList: { gap: 16, marginBottom: 32 },
  recoItem: { backgroundColor: '#FFF', padding: 24, borderRadius: 32, borderWidth: 1, borderColor: '#F1F5F9' },
  impactBadge: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 10, alignSelf: 'flex-start', marginBottom: 12 },
  impactText: { fontSize: 9, fontWeight: '900' },
  recoTitle: { fontSize: 18, fontWeight: '800', color: '#1E293B', marginBottom: 8 },
  recoDesc: { fontSize: 13, color: '#64748B', lineHeight: 20 },

  specsCard: { borderRadius: 32, overflow: 'hidden', marginBottom: 24 },
  specsGradient: { padding: 24 },
  specsHeader: { flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 24 },
  specsTitle: { color: '#FFF', fontSize: 16, fontWeight: '800' },
  specRows: { gap: 20 },
  specBarContainer: { gap: 8 },
  specBarTop: { flexDirection: 'row', justifyContent: 'space-between' },
  specBarLabel: { fontSize: 10, fontWeight: '800', color: '#94A3B8', textTransform: 'uppercase' },
  specBarValue: { fontSize: 12, fontWeight: '800', color: '#FFF' },
  barTrack: { height: 6, backgroundColor: 'rgba(255,255,255,0.1)', borderRadius: 3 },
  barFill: { height: '100%', backgroundColor: '#6366F1', borderRadius: 3 },

  askCard: { backgroundColor: '#FFF', padding: 20, borderRadius: 28, borderWidth: 1, borderColor: '#F1F5F9', flexDirection: 'row', alignItems: 'center', gap: 16 },
  askIcon: { width: 56, height: 56, borderRadius: 18, backgroundColor: '#EEF2FF', alignItems: 'center', justifyContent: 'center' },
  askTextContent: { flex: 1 },
  askTitle: { fontSize: 16, fontWeight: '800', color: '#1E293B' },
  askDesc: { fontSize: 12, color: '#64748B', marginTop: 2 }
});
