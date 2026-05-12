import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { Briefcase, Award, ShieldCheck, Clock, CheckCircle2, XCircle } from 'lucide-react-native';
import { GlassCard } from '../../src/components/ui/GlassCard';

export default function EditorHub() {
  return (
    <View style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.content}>
        <Text style={styles.title}>Editor Hub</Text>
        
        <GlassCard style={styles.summaryCard}>
          <View style={styles.summaryItem}>
            <Text style={styles.sumVal}>142</Text>
            <Text style={styles.sumLab}>Verified</Text>
          </View>
          <View style={styles.divider} />
          <View style={styles.summaryItem}>
            <Text style={[styles.sumVal, { color: '#EF4444' }]}>08</Text>
            <Text style={styles.sumLab}>Pending</Text>
          </View>
        </GlassCard>

        <Text style={styles.sectionTitle}>Verification Queue</Text>
        <VerificationItem name="Karthik R." expertise="Wedding" />
        <VerificationItem name="Sneha Kapoor" expertise="Reels" />
        <VerificationItem name="Arjun M." expertise="Gaming" />

        <Text style={[styles.sectionTitle, { marginTop: 24 }]}>Top Performance</Text>
        <GlassCard style={styles.perfCard}>
          <Text style={styles.perfTitle}>Pro Editor of the Month</Text>
          <Text style={styles.perfDesc}>Rahul V. - 98% Success Rate</Text>
        </GlassCard>
      </ScrollView>
    </View>
  );
}

function VerificationItem({ name, expertise }: any) {
  return (
    <GlassCard style={styles.vCard}>
      <View>
        <Text style={styles.vName}>{name}</Text>
        <Text style={styles.vSub}>{expertise} Editor</Text>
      </View>
      <View style={styles.vActions}>
        <TouchableOpacity style={styles.btnNo}><XCircle size={22} color="#EF4444" /></TouchableOpacity>
        <TouchableOpacity style={styles.btnYes}><CheckCircle2 size={22} color="#10B981" /></TouchableOpacity>
      </View>
    </GlassCard>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8FAFC' },
  content: { padding: 24, paddingTop: 60, paddingBottom: 100 },
  title: { fontSize: 28, fontWeight: '900', color: '#1E293B', marginBottom: 20 },
  summaryCard: { flexDirection: 'row', padding: 20, justifyContent: 'space-around', alignItems: 'center', marginBottom: 30 },
  summaryItem: { alignItems: 'center' },
  sumVal: { fontSize: 24, fontWeight: '900', color: '#1E293B' },
  sumLab: { fontSize: 12, color: '#64748B', marginTop: 4 },
  divider: { width: 1, height: 40, backgroundColor: '#E2E8F0' },
  sectionTitle: { fontSize: 18, fontWeight: '800', color: '#1E293B', marginBottom: 16 },
  vCard: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 16, marginBottom: 12 },
  vName: { fontSize: 15, fontWeight: '700', color: '#1E293B' },
  vSub: { fontSize: 12, color: '#64748B', marginTop: 2 },
  vActions: { flexDirection: 'row' },
  btnNo: { marginRight: 12 },
  btnYes: {},
  perfCard: { padding: 20, backgroundColor: '#6366F1' },
  perfTitle: { color: '#FFF', fontSize: 16, fontWeight: '800' },
  perfDesc: { color: 'rgba(255,255,255,0.8)', fontSize: 13, marginTop: 4 }
});
