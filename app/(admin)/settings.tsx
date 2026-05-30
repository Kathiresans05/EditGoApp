import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Switch, TextInput, ActivityIndicator, Alert } from 'react-native';
import { Settings, Shield, DollarSign, Bell, Megaphone, ChevronRight, Power, Gift, Save } from 'lucide-react-native';
import { GlassCard } from '../../src/components/ui/GlassCard';
import { settingService } from '../../src/services/api';
import { LinearGradient } from 'expo-linear-gradient';

export default function AdminSettings() {
  const [referralReward, setReferralReward] = useState('20');
  const [platformCommission, setPlatformCommission] = useState('20');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      const res = await settingService.getSettings();
      if (res.success) {
        if (res.data.REFERRAL_REWARD) setReferralReward(res.data.REFERRAL_REWARD);
        if (res.data.PLATFORM_COMMISSION) setPlatformCommission(res.data.PLATFORM_COMMISSION);
      }
    } catch (e) {
      console.log('Error fetching settings', e);
    } finally {
      setLoading(false);
    }
  };

  const handleSaveSettings = async () => {
    setSaving(true);
    try {
      await settingService.updateSettings({ 
        REFERRAL_REWARD: referralReward,
        PLATFORM_COMMISSION: platformCommission
      });
      Alert.alert('Success', 'Settings updated successfully!');
    } catch (e) {
      Alert.alert('Error', 'Failed to update settings');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <View style={styles.container}><ActivityIndicator size="large" color="#4F46E5" style={{marginTop: 100}} /></View>;

  return (
    <View style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.content}>
        <Text style={styles.title}>System Setup</Text>

        <Text style={styles.sectionTitle}>Referral Program</Text>
        <GlassCard style={styles.menuCard}>
          <View style={styles.inputItem}>
            <View style={styles.left}>
              <View style={styles.iconBox}><Gift size={20} color="#8B5CF6" /></View>
              <Text style={styles.label}>Referral Reward (₹)</Text>
            </View>
            <TextInput
              style={styles.textInput}
              value={referralReward}
              onChangeText={setReferralReward}
              keyboardType="numeric"
            />
          </View>
          <TouchableOpacity style={styles.saveBtn} onPress={handleSaveSettings} disabled={saving}>
            {saving ? <ActivityIndicator color="#FFF" size="small" /> : <Save size={18} color="#FFF" />}
            <Text style={styles.saveBtnText}>Save Settings</Text>
          </TouchableOpacity>
        </GlassCard>

        <Text style={styles.sectionTitle}>Platform Controls</Text>
        <GlassCard style={styles.menuCard}>
          <SettingItem icon={<Power size={20} color="#EF4444" />} label="Emergency Maintenance" hasSwitch={true} />
          <SettingItem icon={<Shield size={20} color="#6366F1" />} label="Fraud Detection AI" hasSwitch={true} />
        </GlassCard>

        <Text style={styles.sectionTitle}>Financials</Text>
        <GlassCard style={styles.menuCard}>
          <View style={styles.inputItem}>
            <View style={styles.left}>
              <View style={styles.iconBox}><DollarSign size={20} color="#10B981" /></View>
              <Text style={styles.label}>Platform Commission (%)</Text>
            </View>
            <TextInput
              style={styles.textInput}
              value={platformCommission}
              onChangeText={setPlatformCommission}
              keyboardType="numeric"
            />
          </View>
          <SettingItem icon={<Bell size={20} color="#F59E0B" />} label="Payout Schedule" />
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
  menuCard: { padding: 8, borderRadius: 24, backgroundColor: '#FFF' },
  item: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 12 },
  inputItem: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 12 },
  left: { flexDirection: 'row', alignItems: 'center' },
  iconBox: { width: 40, height: 40, borderRadius: 12, backgroundColor: '#F8FAFC', alignItems: 'center', justifyContent: 'center', marginRight: 16 },
  label: { fontSize: 15, fontWeight: '600', color: '#1E293B' },
  textInput: { backgroundColor: '#F1F5F9', borderRadius: 8, paddingHorizontal: 16, paddingVertical: 8, fontSize: 16, fontWeight: '700', width: 80, textAlign: 'center' },
  saveBtn: { backgroundColor: '#4F46E5', flexDirection: 'row', alignItems: 'center', justifyContent: 'center', paddingVertical: 12, borderRadius: 12, margin: 12, gap: 8 },
  saveBtnText: { color: '#FFF', fontWeight: '800', fontSize: 15 },
  logoutBtn: { marginTop: 40, alignItems: 'center', padding: 20, backgroundColor: '#FEE2E2', borderRadius: 20 },
  logoutText: { color: '#EF4444', fontWeight: '800' }
});
