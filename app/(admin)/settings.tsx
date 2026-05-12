import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Switch } from 'react-native';
import { Settings, Shield, DollarSign, Bell, Megaphone, ChevronRight, Power } from 'lucide-react-native';
import { GlassCard } from '../../src/components/ui/GlassCard';

export default function AdminSettings() {
  return (
    <View style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.content}>
        <Text style={styles.title}>System Setup</Text>

        <Text style={styles.sectionTitle}>Platform Controls</Text>
        <GlassCard style={styles.menuCard}>
          <SettingItem icon={<Power size={20} color="#EF4444" />} label="Emergency Maintenance" hasSwitch={true} />
          <SettingItem icon={<Shield size={20} color="#6366F1" />} label="Fraud Detection AI" hasSwitch={true} />
        </GlassCard>

        <Text style={styles.sectionTitle}>Financials</Text>
        <GlassCard style={styles.menuCard}>
          <SettingItem icon={<DollarSign size={20} color="#10B981" />} label="Commission Rates (20%)" />
          <SettingItem icon={<Bell size={20} color="#F59E0B" />} label="Payout Schedule" />
        </GlassCard>

        <Text style={styles.sectionTitle}>Marketing</Text>
        <GlassCard style={styles.menuCard}>
          <SettingItem icon={<Megaphone size={20} color="#EC4899" />} label="Promo Campaigns" />
          <SettingItem icon={<Bell size={20} color="#6366F1" />} label="Push Notifications" />
        </GlassCard>

        <TouchableOpacity style={styles.logoutBtn}>
          <Text style={styles.logoutText}>Platform Logout</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}

function SettingItem({ icon, label, hasSwitch }: any) {
  return (
    <View style={styles.item}>
      <View style={styles.left}>
        <View style={styles.iconBox}>{icon}</View>
        <Text style={styles.label}>{label}</Text>
      </View>
      {hasSwitch ? <Switch value={false} /> : <ChevronRight size={20} color="#CBD5E1" />}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8FAFC' },
  content: { padding: 24, paddingTop: 60, paddingBottom: 100 },
  title: { fontSize: 28, fontWeight: '900', color: '#1E293B', marginBottom: 20 },
  sectionTitle: { fontSize: 14, fontWeight: '800', color: '#94A3B8', marginTop: 24, marginBottom: 12, textTransform: 'uppercase', letterSpacing: 1 },
  menuCard: { padding: 8, borderRadius: 24 },
  item: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 12 },
  left: { flexDirection: 'row', alignItems: 'center' },
  iconBox: { width: 40, height: 40, borderRadius: 12, backgroundColor: '#F8FAFC', alignItems: 'center', justifyContent: 'center', marginRight: 16 },
  label: { fontSize: 15, fontWeight: '600', color: '#1E293B' },
  logoutBtn: { marginTop: 40, alignItems: 'center', padding: 20, backgroundColor: '#FEE2E2', borderRadius: 20 },
  logoutText: { color: '#EF4444', fontWeight: '800' }
});
