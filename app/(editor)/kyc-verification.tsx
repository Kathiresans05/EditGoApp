import React, { useState, useEffect } from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity,
  TextInput, Alert, ActivityIndicator, Image
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Camera, Upload, CheckCircle, AlertCircle, ChevronLeft } from 'lucide-react-native';
import { useRouter } from 'expo-router';
import * as ImagePicker from 'expo-image-picker';
import api from '../../src/services/api';

export default function KYCVerificationScreen() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [aadhaar, setAadhaar] = useState('');
  const [pan, setPan] = useState('');
  const [bankAccount, setBankAccount] = useState('');
  const [idDocumentUri, setIdDocumentUri] = useState<string | null>(null);
  const [selfieUri, setSelfieUri] = useState<string | null>(null);
  const [status, setStatus] = useState<'PENDING' | 'APPROVED' | 'REJECTED' | 'SUSPENDED'>('PENDING');

  useEffect(() => {
    fetchStatus();
  }, []);

  const fetchStatus = async () => {
    try {
      const res = await api.get('/editor/kyc-status');
      setStatus(res.data.status);
    } catch (e) {
      console.log('Error fetching KYC status', e);
    }
  };

  const pickImage = async (type: 'id' | 'selfie') => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission Denied', 'Gallery access is required for KYC upload.');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 0.8,
    });

    if (!result.canceled && result.assets.length > 0) {
      if (type === 'id') setIdDocumentUri(result.assets[0].uri);
      else setSelfieUri(result.assets[0].uri);
    }
  };

  const handleSubmit = async () => {
    if (!aadhaar || !pan || !bankAccount || !idDocumentUri || !selfieUri) {
      Alert.alert('Missing Fields', 'Please complete all KYC fields and upload documents.');
      return;
    }
    
    setLoading(true);
    try {
      // In a real implementation, we would upload these URIs to S3/Firebase
      // and send the URLs to the backend. For now, we simulate success.
      await api.post('/editor/kyc', {
        aadhaar,
        pan,
        bankAccount,
        idDocumentUrl: idDocumentUri,
        selfieUrl: selfieUri
      });
      
      Alert.alert('Success', 'KYC details submitted for review!');
      fetchStatus();
    } catch (e: any) {
      Alert.alert('Error', e.response?.data?.message || 'Failed to submit KYC');
    } finally {
      setLoading(false);
    }
  };

  if (status === 'APPROVED') {
    return (
      <View style={s.centerContainer}>
        <CheckCircle size={64} color="#059669" />
        <Text style={s.statusTitle}>Verified Creator</Text>
        <Text style={s.statusDesc}>Your KYC has been approved. You are ready to earn!</Text>
        <TouchableOpacity style={s.btn} onPress={() => router.back()}>
          <Text style={s.btnText}>Return to Dashboard</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={s.container}>
      <LinearGradient colors={['#4F46E5', '#7C3AED']} style={s.header}>
        <TouchableOpacity onPress={() => router.back()} style={s.backBtn}>
          <ChevronLeft size={24} color="#FFF" />
        </TouchableOpacity>
        <Text style={s.title}>Identity Verification</Text>
        <View style={{width: 24}} />
      </LinearGradient>

      <ScrollView style={s.body} contentContainerStyle={{paddingBottom: 40}}>
        <View style={s.infoCard}>
          <AlertCircle size={20} color="#4F46E5" />
          <Text style={s.infoText}>
            To protect customer privacy and prevent fraud, all editors must complete KYC verification before claiming orders.
          </Text>
        </View>

        <Text style={s.label}>Aadhaar Number</Text>
        <TextInput
          style={s.input}
          placeholder="Enter 12-digit Aadhaar"
          keyboardType="numeric"
          value={aadhaar}
          onChangeText={setAadhaar}
          maxLength={12}
        />

        <Text style={s.label}>PAN Number</Text>
        <TextInput
          style={s.input}
          placeholder="Enter PAN (e.g. ABCDE1234F)"
          autoCapitalize="characters"
          value={pan}
          onChangeText={setPan}
          maxLength={10}
        />

        <Text style={s.label}>Bank Account Number</Text>
        <TextInput
          style={s.input}
          placeholder="For payout deposits"
          keyboardType="numeric"
          value={bankAccount}
          onChangeText={setBankAccount}
        />

        <Text style={s.label}>Upload Govt ID (Front)</Text>
        <TouchableOpacity style={s.uploadBox} onPress={() => pickImage('id')}>
          {idDocumentUri ? (
            <Image source={{uri: idDocumentUri}} style={s.previewImg} />
          ) : (
            <>
              <Upload size={24} color="#94A3B8" />
              <Text style={s.uploadText}>Tap to select image</Text>
            </>
          )}
        </TouchableOpacity>

        <Text style={s.label}>Selfie Verification</Text>
        <TouchableOpacity style={s.uploadBox} onPress={() => pickImage('selfie')}>
          {selfieUri ? (
            <Image source={{uri: selfieUri}} style={s.previewImg} />
          ) : (
            <>
              <Camera size={24} color="#94A3B8" />
              <Text style={s.uploadText}>Tap to take/select selfie</Text>
            </>
          )}
        </TouchableOpacity>

        <TouchableOpacity 
          style={s.submitBtn} 
          onPress={handleSubmit} 
          disabled={loading || status === 'PENDING'}
        >
          {loading ? (
            <ActivityIndicator color="#FFF" />
          ) : (
            <Text style={s.submitText}>
              {status === 'PENDING' && aadhaar ? 'Verification Pending' : 'Submit KYC'}
            </Text>
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
  statusDesc: { fontSize: 16, color: '#64748B', textAlign: 'center', marginTop: 8, marginBottom: 32 },
  header: { paddingTop: 60, paddingBottom: 20, paddingHorizontal: 16, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  title: { fontSize: 18, fontWeight: '800', color: '#FFF' },
  backBtn: { width: 40, height: 40, borderRadius: 20, backgroundColor: 'rgba(255,255,255,0.2)', alignItems: 'center', justifyContent: 'center' },
  body: { padding: 20 },
  infoCard: { flexDirection: 'row', backgroundColor: '#EDE7F6', padding: 16, borderRadius: 12, marginBottom: 24, gap: 12, alignItems: 'flex-start' },
  infoText: { flex: 1, color: '#4F46E5', fontSize: 13, lineHeight: 18, fontWeight: '600' },
  label: { fontSize: 14, fontWeight: '700', color: '#1E293B', marginBottom: 8, marginLeft: 4 },
  input: { backgroundColor: '#FFF', padding: 16, borderRadius: 12, borderWidth: 1, borderColor: '#E2E8F0', marginBottom: 20, fontSize: 16 },
  uploadBox: { height: 120, backgroundColor: '#FFF', borderRadius: 12, borderWidth: 2, borderColor: '#E2E8F0', borderStyle: 'dashed', alignItems: 'center', justifyContent: 'center', marginBottom: 20, overflow: 'hidden' },
  uploadText: { color: '#94A3B8', marginTop: 8, fontWeight: '600' },
  previewImg: { width: '100%', height: '100%', resizeMode: 'cover' },
  submitBtn: { backgroundColor: '#4F46E5', padding: 18, borderRadius: 16, alignItems: 'center', marginTop: 12 },
  submitText: { color: '#FFF', fontSize: 16, fontWeight: '800' },
  btn: { backgroundColor: '#4F46E5', paddingHorizontal: 24, paddingVertical: 16, borderRadius: 12 },
  btnText: { color: '#FFF', fontWeight: '700', fontSize: 16 },
});
