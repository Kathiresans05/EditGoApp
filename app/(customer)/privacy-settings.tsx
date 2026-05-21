import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Shield, Lock, Eye, AlertTriangle, ChevronLeft, CheckCircle2 } from 'lucide-react-native';
import { useRouter } from 'expo-router';

export default function PrivacySettingsScreen() {
  const router = useRouter();
  const [defaultSensitivity, setDefaultSensitivity] = useState<'PUBLIC' | 'PRIVATE' | 'SENSITIVE'>('PRIVATE');

  const handleSave = () => {
    // In a real app, this would save to user profile settings
    Alert.alert('Saved', 'Your default privacy settings have been updated.');
    router.back();
  };

  return (
    <View style={s.container}>
      <LinearGradient colors={['#4F46E5', '#7C3AED']} style={s.header}>
        <TouchableOpacity onPress={() => router.back()} style={s.backBtn}>
          <ChevronLeft size={24} color="#FFF" />
        </TouchableOpacity>
        <Text style={s.title}>Privacy & Security</Text>
        <View style={{width: 24}} />
      </LinearGradient>

      <ScrollView style={s.body} contentContainerStyle={{paddingBottom: 40}}>
        <Text style={s.sectionDesc}>
          EditGo takes your privacy seriously. Choose the default sensitivity for your uploaded content.
        </Text>

        <TouchableOpacity 
          style={[s.optionCard, defaultSensitivity === 'PUBLIC' && s.optionActive]}
          onPress={() => setDefaultSensitivity('PUBLIC')}
        >
          <View style={[s.iconBox, {backgroundColor: '#E0F2FE'}]}>
            <Eye size={24} color="#0284C7" />
          </View>
          <View style={s.optionInfo}>
            <Text style={s.optionTitle}>Public / General Content</Text>
            <Text style={s.optionSub}>Best for gaming clips, vlogs, and public social media posts. Can be assigned to any editor.</Text>
          </View>
          {defaultSensitivity === 'PUBLIC' && <CheckCircle2 size={24} color="#4F46E5" />}
        </TouchableOpacity>

        <TouchableOpacity 
          style={[s.optionCard, defaultSensitivity === 'PRIVATE' && s.optionActive]}
          onPress={() => setDefaultSensitivity('PRIVATE')}
        >
          <View style={[s.iconBox, {backgroundColor: '#EDE7F6'}]}>
            <Lock size={24} color="#7C3AED" />
          </View>
          <View style={s.optionInfo}>
            <Text style={s.optionTitle}>Private Content (Recommended)</Text>
            <Text style={s.optionSub}>Standard privacy. Only assigned editors can access your files via secure temporary links.</Text>
          </View>
          {defaultSensitivity === 'PRIVATE' && <CheckCircle2 size={24} color="#4F46E5" />}
        </TouchableOpacity>

        <TouchableOpacity 
          style={[s.optionCard, defaultSensitivity === 'SENSITIVE' && s.optionActive]}
          onPress={() => setDefaultSensitivity('SENSITIVE')}
        >
          <View style={[s.iconBox, {backgroundColor: '#FEE2E2'}]}>
            <Shield size={24} color="#DC2626" />
          </View>
          <View style={s.optionInfo}>
            <Text style={s.optionTitle}>Highly Sensitive Personal Data</Text>
            <Text style={s.optionSub}>Only assigned to GOLD+ verified editors. Editors must sign an NDA before accessing.</Text>
          </View>
          {defaultSensitivity === 'SENSITIVE' && <CheckCircle2 size={24} color="#4F46E5" />}
        </TouchableOpacity>

        <View style={s.infoCard}>
          <AlertTriangle size={20} color="#B45309" />
          <Text style={s.infoText}>
            Files are automatically permanently deleted from our servers 30 days after project completion.
          </Text>
        </View>

        <TouchableOpacity style={s.saveBtn} onPress={handleSave}>
          <Text style={s.saveText}>Save Preferences</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={s.reportBtn} onPress={() => router.push('/(customer)/report-issue')}>
          <Text style={s.reportText}>Report a Privacy Violation</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}

const s = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8FAFC' },
  header: { paddingTop: 60, paddingBottom: 20, paddingHorizontal: 16, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  title: { fontSize: 18, fontWeight: '800', color: '#FFF' },
  backBtn: { width: 40, height: 40, borderRadius: 20, backgroundColor: 'rgba(255,255,255,0.2)', alignItems: 'center', justifyContent: 'center' },
  body: { padding: 20 },
  sectionDesc: { fontSize: 14, color: '#64748B', lineHeight: 22, marginBottom: 24, fontWeight: '500' },
  optionCard: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#FFF', padding: 16, borderRadius: 16, marginBottom: 16, borderWidth: 2, borderColor: 'transparent', elevation: 1 },
  optionActive: { borderColor: '#4F46E5', backgroundColor: '#F5F3FF' },
  iconBox: { width: 48, height: 48, borderRadius: 12, alignItems: 'center', justifyContent: 'center', marginRight: 16 },
  optionInfo: { flex: 1, paddingRight: 10 },
  optionTitle: { fontSize: 15, fontWeight: '800', color: '#1E293B', marginBottom: 4 },
  optionSub: { fontSize: 12, color: '#64748B', lineHeight: 18 },
  infoCard: { flexDirection: 'row', backgroundColor: '#FEF3C7', padding: 16, borderRadius: 12, marginTop: 12, marginBottom: 24, gap: 12, alignItems: 'center' },
  infoText: { flex: 1, color: '#92400E', fontSize: 13, lineHeight: 18, fontWeight: '600' },
  saveBtn: { backgroundColor: '#4F46E5', padding: 18, borderRadius: 16, alignItems: 'center' },
  saveText: { color: '#FFF', fontSize: 16, fontWeight: '800' },
  reportBtn: { marginTop: 16, padding: 16, alignItems: 'center' },
  reportText: { color: '#DC2626', fontSize: 14, fontWeight: '700', textDecorationLine: 'underline' },
});
