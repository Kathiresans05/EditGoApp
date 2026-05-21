import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Shield, ShieldCheck, ChevronLeft, Award, AlertTriangle } from 'lucide-react-native';
import { useRouter } from 'expo-router';
import api from '../../src/services/api';

export default function TrustDashboardScreen() {
  const router = useRouter();
  const [editor, setEditor] = useState<any>(null);

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const res = await api.get('/editor/profile');
      setEditor(res.data.editor);
    } catch (e) {
      console.log('Error fetching profile', e);
    }
  };

  if (!editor) return null;

  return (
    <View style={s.container}>
      <LinearGradient colors={['#1E293B', '#0F172A']} style={s.header}>
        <TouchableOpacity onPress={() => router.back()} style={s.backBtn}>
          <ChevronLeft size={24} color="#FFF" />
        </TouchableOpacity>
        <Text style={s.title}>Trust & Security Hub</Text>
        <View style={{width: 24}} />
      </LinearGradient>

      <ScrollView style={s.body} contentContainerStyle={{paddingBottom: 40}}>
        <View style={s.scoreCard}>
          <ShieldCheck size={48} color="#10B981" />
          <Text style={s.scoreTitle}>Trust Score</Text>
          <Text style={s.scoreValue}>{editor.trustScore} / 100</Text>
          <Text style={s.levelText}>Current Level: {editor.trustLevel}</Text>
          
          <View style={s.progressBg}>
            <View style={[s.progressFill, {width: `${editor.trustScore}%`}]} />
          </View>
        </View>

        <Text style={s.secLabel}>SECURITY METRICS</Text>
        
        <View style={s.metricCard}>
          <View style={s.metricRow}>
            <Award size={20} color="#4F46E5" />
            <Text style={s.metricName}>Verification Status</Text>
            <Text style={[s.metricVal, {color: editor.verificationStatus === 'APPROVED' ? '#10B981' : '#F59E0B'}]}>
              {editor.verificationStatus}
            </Text>
          </View>
          <View style={s.divider} />
          <View style={s.metricRow}>
            <AlertTriangle size={20} color="#F43F5E" />
            <Text style={s.metricName}>Policy Violations</Text>
            <Text style={s.metricVal}>{editor.violationCount}</Text>
          </View>
        </View>

        <Text style={s.secLabel}>HOW TO IMPROVE</Text>
        <View style={s.infoCard}>
          <Text style={s.infoText}>• Complete jobs on time to increase your score.</Text>
          <Text style={s.infoText}>• Maintain high customer ratings (4.5+).</Text>
          <Text style={s.infoText}>• Avoid any privacy complaints or file misuse.</Text>
          <Text style={s.infoText}>• Reaching GOLD level unlocks SENSITIVE projects.</Text>
        </View>

        {editor.verificationStatus !== 'APPROVED' && (
          <TouchableOpacity style={s.actionBtn} onPress={() => router.push('/(editor)/kyc-verification')}>
            <Text style={s.actionText}>Complete KYC Verification</Text>
          </TouchableOpacity>
        )}
      </ScrollView>
    </View>
  );
}

const s = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8FAFC' },
  header: { paddingTop: 60, paddingBottom: 20, paddingHorizontal: 16, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  title: { fontSize: 18, fontWeight: '800', color: '#FFF' },
  backBtn: { width: 40, height: 40, borderRadius: 20, backgroundColor: 'rgba(255,255,255,0.1)', alignItems: 'center', justifyContent: 'center' },
  body: { padding: 20 },
  scoreCard: { backgroundColor: '#FFF', borderRadius: 24, padding: 24, alignItems: 'center', marginBottom: 24, elevation: 2 },
  scoreTitle: { fontSize: 16, fontWeight: '700', color: '#64748B', marginTop: 12 },
  scoreValue: { fontSize: 48, fontWeight: '900', color: '#1E293B', marginVertical: 8 },
  levelText: { fontSize: 14, fontWeight: '800', color: '#10B981', backgroundColor: '#ECFDF5', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 12, overflow: 'hidden' },
  progressBg: { width: '100%', height: 8, backgroundColor: '#E2E8F0', borderRadius: 4, marginTop: 24, overflow: 'hidden' },
  progressFill: { height: '100%', backgroundColor: '#10B981', borderRadius: 4 },
  secLabel: { fontSize: 12, fontWeight: '900', color: '#94A3B8', letterSpacing: 1, marginBottom: 12 },
  metricCard: { backgroundColor: '#FFF', borderRadius: 16, padding: 16, marginBottom: 24, elevation: 1 },
  metricRow: { flexDirection: 'row', alignItems: 'center', paddingVertical: 8 },
  metricName: { flex: 1, fontSize: 15, fontWeight: '600', color: '#1E293B', marginLeft: 12 },
  metricVal: { fontSize: 15, fontWeight: '800', color: '#1E293B' },
  divider: { height: 1, backgroundColor: '#F1F5F9', marginVertical: 8 },
  infoCard: { backgroundColor: '#EFF6FF', padding: 16, borderRadius: 16, marginBottom: 24 },
  infoText: { fontSize: 14, color: '#1E3A8A', marginBottom: 8, fontWeight: '500', lineHeight: 20 },
  actionBtn: { backgroundColor: '#4F46E5', padding: 16, borderRadius: 16, alignItems: 'center' },
  actionText: { color: '#FFF', fontSize: 16, fontWeight: '800' },
});
