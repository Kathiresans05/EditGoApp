import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Dimensions, Platform, Switch } from 'react-native';
import { 
  ShieldCheck, Lock, Eye, AlertTriangle, 
  UserCheck, ShieldAlert, Key, Globe,
  Fingerprint, ChevronLeft, ArrowRight
} from 'lucide-react-native';
import Animated, { FadeInUp, FadeInRight, FadeIn, Layout } from 'react-native-reanimated';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';

const { width } = Dimensions.get('window');

export default function SecurityCenterScreen() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <ChevronLeft size={24} color="#0F172A" />
        </TouchableOpacity>
        <View>
          <View style={styles.tagRow}>
            <ShieldCheck size={10} color="#6366F1" />
            <Text style={styles.tagText}>SECURITY PROTOCOL V.ALPHA</Text>
          </View>
          <Text style={styles.title}>Security <Text style={styles.highlight}>Center</Text></Text>
        </View>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        
        {/* Threat Level Hub */}
        <View style={styles.threatCard}>
          <LinearGradient colors={['#10B981', '#059669']} style={styles.threatGradient}>
            <View style={styles.threatHeader}>
              <View style={styles.shieldRing}>
                <ShieldCheck size={32} color="#FFF" />
              </View>
              <View>
                <Text style={styles.threatTitle}>Threat Level: Minimal</Text>
                <Text style={styles.threatStatus}>All systems operating under nominal parameters</Text>
              </View>
            </View>
          </LinearGradient>
        </View>

        {/* Security Modules */}
        <Text style={styles.sectionTitle}>Defense Modules</Text>
        <View style={styles.moduleGrid}>
          <SecurityModule title="Brute Force Protection" active={true} icon={Lock} />
          <SecurityModule title="AI Fraud Detection" active={true} icon={Eye} />
          <SecurityModule title="IP Rate Limiting" active={true} icon={Globe} />
          <SecurityModule title="Biometric Auth" active={false} icon={Fingerprint} />
        </View>

        {/* Recent Incidents */}
        <Text style={styles.sectionTitle}>Security Incidents</Text>
        <View style={styles.incidentList}>
          <IncidentItem 
            type="Login Attempt" 
            desc="Suspicious activity from Moscow, RU" 
            time="2h ago" 
            severity="Medium" 
            color="#F59E0B" 
          />
          <IncidentItem 
            type="Large Payout" 
            desc="₹1,24,000 flagged for manual review" 
            time="4h ago" 
            severity="Low" 
            color="#6366F1" 
          />
        </View>

        {/* System Lockdown */}
        <TouchableOpacity style={styles.lockdownBtn}>
          <ShieldAlert size={20} color="#FFF" />
          <Text style={styles.lockdownText}>INITIATE SYSTEM LOCKDOWN</Text>
        </TouchableOpacity>

        <View style={{ height: 40 }} />
      </ScrollView>
    </View>
  );
}

function SecurityModule({ title, active, icon: Icon }: any) {
  return (
    <View style={styles.moduleCard}>
      <View style={[styles.moduleIcon, { backgroundColor: active ? '#EEF2FF' : '#F8FAFC' }]}>
        <Icon size={20} color={active ? '#6366F1' : '#94A3B8'} />
      </View>
      <Text style={styles.moduleTitle}>{title}</Text>
      <View style={styles.moduleFooter}>
        <Text style={[styles.moduleStatus, { color: active ? '#10B981' : '#94A3B8' }]}>
          {active ? 'ACTIVE' : 'INACTIVE'}
        </Text>
        <Switch 
          value={active} 
          trackColor={{ false: '#E2E8F0', true: '#C7D2FE' }}
          thumbColor={active ? '#6366F1' : '#94A3B8'}
        />
      </View>
    </View>
  );
}

function IncidentItem({ type, desc, time, severity, color }: any) {
  return (
    <View style={styles.incidentItem}>
      <View style={[styles.severityBar, { backgroundColor: color }]} />
      <View style={styles.incidentContent}>
        <View style={styles.incidentTop}>
          <Text style={styles.incidentType}>{type}</Text>
          <Text style={styles.incidentTime}>{time}</Text>
        </View>
        <Text style={styles.incidentDesc}>{desc}</Text>
        <View style={[styles.sevBadge, { backgroundColor: color + '15' }]}>
          <Text style={[styles.sevText, { color }]}>{severity} SEVERITY</Text>
        </View>
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

  threatCard: { borderRadius: 32, overflow: 'hidden', marginBottom: 32, elevation: 10, shadowColor: '#10B981', shadowOpacity: 0.3, shadowRadius: 20 },
  threatGradient: { padding: 24 },
  threatHeader: { flexDirection: 'row', alignItems: 'center', gap: 20 },
  shieldRing: { width: 64, height: 64, borderRadius: 32, backgroundColor: 'rgba(255,255,255,0.2)', alignItems: 'center', justifyContent: 'center', borderWidth: 2, borderColor: 'rgba(255,255,255,0.4)' },
  threatTitle: { color: '#FFF', fontSize: 20, fontWeight: '900' },
  threatStatus: { color: 'rgba(255,255,255,0.8)', fontSize: 12, fontWeight: '600', marginTop: 4 },

  sectionTitle: { fontSize: 20, fontWeight: '900', color: '#0F172A', marginBottom: 20 },
  moduleGrid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between', gap: 12, marginBottom: 32 },
  moduleCard: { width: '48.5%', backgroundColor: '#FFF', padding: 20, borderRadius: 28, borderWidth: 1, borderColor: '#F1F5F9' },
  moduleIcon: { width: 44, height: 44, borderRadius: 14, alignItems: 'center', justifyContent: 'center', marginBottom: 16 },
  moduleTitle: { fontSize: 13, fontWeight: '800', color: '#1E293B', marginBottom: 16, height: 40 },
  moduleFooter: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  moduleStatus: { fontSize: 9, fontWeight: '900', letterSpacing: 1 },

  incidentList: { gap: 12, marginBottom: 32 },
  incidentItem: { backgroundColor: '#FFF', borderRadius: 24, borderWidth: 1, borderColor: '#F1F5F9', flexDirection: 'row', overflow: 'hidden' },
  severityBar: { width: 6 },
  incidentContent: { flex: 1, padding: 16 },
  incidentTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 },
  incidentType: { fontSize: 14, fontWeight: '800', color: '#1E293B' },
  incidentTime: { fontSize: 10, fontWeight: '800', color: '#CBD5E1' },
  incidentDesc: { fontSize: 12, color: '#64748B', marginBottom: 12 },
  sevBadge: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 10, alignSelf: 'flex-start' },
  sevText: { fontSize: 9, fontWeight: '900' },

  lockdownBtn: { backgroundColor: '#EF4444', paddingVertical: 18, borderRadius: 20, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 10, elevation: 8, shadowColor: '#EF4444', shadowOpacity: 0.3, shadowRadius: 15 },
  lockdownText: { color: '#FFF', fontSize: 12, fontWeight: '900', letterSpacing: 1 }
});
