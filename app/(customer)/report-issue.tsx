import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput, Alert, ActivityIndicator } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { AlertTriangle, ChevronLeft, Upload, CheckCircle2 } from 'lucide-react-native';
import { useRouter } from 'expo-router';
import * as ImagePicker from 'expo-image-picker';

export default function ReportIssueScreen() {
  const router = useRouter();
  const [issueType, setIssueType] = useState('CONTENT_MISUSE');
  const [description, setDescription] = useState('');
  const [evidenceUri, setEvidenceUri] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const pickEvidence = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') return;

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 0.8,
    });

    if (!result.canceled && result.assets.length > 0) {
      setEvidenceUri(result.assets[0].uri);
    }
  };

  const handleSubmit = async () => {
    if (!description.trim()) {
      Alert.alert('Required', 'Please describe the issue in detail.');
      return;
    }

    setLoading(true);
    // Simulate API call to create ViolationReport
    setTimeout(() => {
      setLoading(false);
      setSubmitted(true);
    }, 1500);
  };

  if (submitted) {
    return (
      <View style={s.centerContainer}>
        <CheckCircle2 size={64} color="#059669" />
        <Text style={s.statusTitle}>Report Submitted</Text>
        <Text style={s.statusDesc}>
          Our security team will investigate this immediately. The editor's account may be temporarily frozen during review.
        </Text>
        <TouchableOpacity style={s.btn} onPress={() => router.back()}>
          <Text style={s.btnText}>Return to Dashboard</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={s.container}>
      <LinearGradient colors={['#DC2626', '#991B1B']} style={s.header}>
        <TouchableOpacity onPress={() => router.back()} style={s.backBtn}>
          <ChevronLeft size={24} color="#FFF" />
        </TouchableOpacity>
        <Text style={s.title}>Report Privacy Violation</Text>
        <View style={{width: 24}} />
      </LinearGradient>

      <ScrollView style={s.body} contentContainerStyle={{paddingBottom: 40}}>
        <View style={s.warningCard}>
          <AlertTriangle size={20} color="#DC2626" />
          <Text style={s.warningText}>
            We take privacy violations extremely seriously. False reports may result in account termination.
          </Text>
        </View>

        <Text style={s.label}>Type of Violation</Text>
        <View style={s.typeRow}>
          {['CONTENT_MISUSE', 'INAPPROPRIATE_BEHAVIOR', 'POOR_QUALITY'].map(type => (
            <TouchableOpacity 
              key={type}
              style={[s.typeChip, issueType === type && s.typeChipActive]}
              onPress={() => setIssueType(type)}
            >
              <Text style={[s.typeText, issueType === type && s.typeTextActive]}>
                {type.replace('_', ' ')}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        <Text style={s.label}>Detailed Description</Text>
        <TextInput
          style={s.textArea}
          placeholder="Please explain what happened in detail..."
          multiline
          numberOfLines={6}
          textAlignVertical="top"
          value={description}
          onChangeText={setDescription}
        />

        <Text style={s.label}>Upload Evidence (Optional)</Text>
        <TouchableOpacity style={s.uploadBox} onPress={pickEvidence}>
          <Upload size={24} color="#94A3B8" />
          <Text style={s.uploadText}>
            {evidenceUri ? 'Evidence Attached (Tap to change)' : 'Tap to upload screenshot'}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={s.submitBtn} 
          onPress={handleSubmit} 
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#FFF" />
          ) : (
            <Text style={s.submitText}>Submit Report</Text>
          )}
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}

const s = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8FAFC' },
  centerContainer: { flex: 1, backgroundColor: '#F8FAFC', alignItems: 'center', justifyContent: 'center', padding: 24 },
  statusTitle: { fontSize: 24, fontWeight: '900', color: '#1E293B', marginTop: 16 },
  statusDesc: { fontSize: 15, color: '#64748B', textAlign: 'center', marginTop: 8, marginBottom: 32, lineHeight: 22 },
  header: { paddingTop: 60, paddingBottom: 20, paddingHorizontal: 16, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  title: { fontSize: 18, fontWeight: '800', color: '#FFF' },
  backBtn: { width: 40, height: 40, borderRadius: 20, backgroundColor: 'rgba(255,255,255,0.2)', alignItems: 'center', justifyContent: 'center' },
  body: { padding: 20 },
  warningCard: { flexDirection: 'row', backgroundColor: '#FEE2E2', padding: 16, borderRadius: 12, marginBottom: 24, gap: 12, alignItems: 'flex-start' },
  warningText: { flex: 1, color: '#991B1B', fontSize: 13, lineHeight: 18, fontWeight: '600' },
  label: { fontSize: 14, fontWeight: '700', color: '#1E293B', marginBottom: 12 },
  typeRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 24 },
  typeChip: { backgroundColor: '#FFF', paddingHorizontal: 14, paddingVertical: 8, borderRadius: 20, borderWidth: 1, borderColor: '#E2E8F0' },
  typeChipActive: { backgroundColor: '#FEE2E2', borderColor: '#DC2626' },
  typeText: { fontSize: 12, fontWeight: '700', color: '#64748B' },
  typeTextActive: { color: '#DC2626' },
  textArea: { backgroundColor: '#FFF', padding: 16, borderRadius: 12, borderWidth: 1, borderColor: '#E2E8F0', marginBottom: 24, fontSize: 15, minHeight: 120 },
  uploadBox: { height: 80, backgroundColor: '#FFF', borderRadius: 12, borderWidth: 2, borderColor: '#E2E8F0', borderStyle: 'dashed', alignItems: 'center', justifyContent: 'center', flexDirection: 'row', gap: 12, marginBottom: 32 },
  uploadText: { color: '#64748B', fontWeight: '600' },
  submitBtn: { backgroundColor: '#DC2626', padding: 18, borderRadius: 16, alignItems: 'center' },
  submitText: { color: '#FFF', fontSize: 16, fontWeight: '800' },
  btn: { backgroundColor: '#1E293B', paddingHorizontal: 24, paddingVertical: 16, borderRadius: 12 },
  btnText: { color: '#FFF', fontWeight: '700', fontSize: 16 },
});
