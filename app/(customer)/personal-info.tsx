import React, { useState, useEffect } from 'react';
import {
  View, Text, StyleSheet, TextInput, TouchableOpacity,
  KeyboardAvoidingView, Platform, ScrollView, Alert,
  ActivityIndicator, StatusBar
} from 'react-native';
import { ArrowLeft, User, Mail, Phone, ShieldCheck, Save } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { authService } from '../../src/services/api';

export default function PersonalInfoScreen() {
  const router = useRouter();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    loadUserData();
  }, []);

  const loadUserData = async () => {
    try {
      const data = await authService.getMe();
      setName(data.name || '');
      setEmail(data.email || '');
      setPhone(data.phone || '');
    } catch (error) {
      console.error('Error fetching user data:', error);
      Alert.alert('Error', 'Failed to load personal information.');
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (!name.trim()) {
      Alert.alert('Validation Error', 'Name cannot be empty.');
      return;
    }

    setSaving(true);
    try {
      await authService.updateProfile(name, email);
      Alert.alert('Success', 'Personal information updated successfully!');
      router.back();
    } catch (error: any) {
      console.error('Error updating profile:', error);
      Alert.alert('Error', error.response?.data?.message || 'Failed to update profile.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#7C3AED" />
      </View>
    );
  }

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <StatusBar barStyle="light-content" backgroundColor="#7C3AED" />
      
      {/* Header */}
      <LinearGradient colors={['#7C3AED', '#5B21B6']} style={styles.header}>
        <View style={styles.headerRow}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
            <ArrowLeft size={22} color="#FFF" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Personal Info</Text>
          <View style={{ width: 38 }} />
        </View>
        <Text style={styles.headerDesc}>Update your profile information and contact details</Text>
      </LinearGradient>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scroll}>
        <View style={styles.formCard}>
          {/* Name Input */}
          <Text style={styles.inputLabel}>Full Name</Text>
          <View style={styles.inputWrap}>
            <View style={styles.iconWrap}>
              <User size={18} color="#7C3AED" />
            </View>
            <TextInput
              style={styles.input}
              placeholder="Full Name"
              value={name}
              onChangeText={setName}
              placeholderTextColor="#94A3B8"
            />
          </View>

          {/* Email Input */}
          <Text style={styles.inputLabel}>Email Address</Text>
          <View style={styles.inputWrap}>
            <View style={styles.iconWrap}>
              <Mail size={18} color="#10B981" />
            </View>
            <TextInput
              style={styles.input}
              placeholder="Email Address"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
              placeholderTextColor="#94A3B8"
            />
          </View>

          {/* Phone Input (Read Only) */}
          <Text style={styles.inputLabel}>Phone Number (Verified)</Text>
          <View style={[styles.inputWrap, styles.disabledInputWrap]}>
            <View style={styles.iconWrap}>
              <Phone size={18} color="#94A3B8" />
            </View>
            <Text style={styles.prefix}>+91</Text>
            <TextInput
              style={[styles.input, styles.disabledInput]}
              value={phone}
              editable={false}
              placeholderTextColor="#94A3B8"
            />
            <ShieldCheck size={18} color="#10B981" style={{ marginLeft: 8 }} />
          </View>
        </View>

        <TouchableOpacity 
          style={styles.saveBtn} 
          onPress={handleSave} 
          disabled={saving}
        >
          <LinearGradient colors={['#7C3AED', '#5B21B6']} style={styles.saveGrad}>
            {saving ? (
              <ActivityIndicator color="#FFF" />
            ) : (
              <>
                <Save size={18} color="#FFF" />
                <Text style={styles.saveText}>Save Changes</Text>
              </>
            )}
          </LinearGradient>
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8FAFC' },
  loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#F8FAFC' },
  scroll: { padding: 20 },
  
  header: {
    paddingTop: 55,
    paddingBottom: 30,
    paddingHorizontal: 24,
    borderBottomLeftRadius: 28,
    borderBottomRightRadius: 28,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  backBtn: {
    width: 38,
    height: 38,
    borderRadius: 12,
    backgroundColor: 'rgba(255,255,255,0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: { fontSize: 18, fontWeight: '900', color: '#FFF' },
  headerDesc: { fontSize: 13, color: 'rgba(255,255,255,0.8)', fontWeight: '600' },

  formCard: {
    backgroundColor: '#FFF',
    borderRadius: 24,
    padding: 20,
    marginBottom: 24,
    elevation: 2,
    shadowColor: '#7C3AED',
    shadowOpacity: 0.05,
    shadowRadius: 8,
  },
  inputLabel: {
    fontSize: 13,
    fontWeight: '800',
    color: '#475569',
    marginBottom: 8,
    marginTop: 12,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  inputWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8FAFC',
    borderRadius: 16,
    paddingHorizontal: 14,
    paddingVertical: 14,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    marginBottom: 8,
  },
  disabledInputWrap: {
    backgroundColor: '#F1F5F9',
    borderColor: '#E2E8F0',
  },
  iconWrap: { marginRight: 10 },
  prefix: { fontSize: 15, fontWeight: '700', color: '#64748B', marginRight: 6 },
  input: { flex: 1, fontSize: 15, color: '#1E293B', fontWeight: '600', padding: 0 },
  disabledInput: { color: '#64748B' },

  saveBtn: {
    borderRadius: 18,
    overflow: 'hidden',
    elevation: 4,
    shadowColor: '#7C3AED',
    shadowOpacity: 0.2,
    shadowRadius: 8,
  },
  saveGrad: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    gap: 10,
  },
  saveText: { color: '#FFF', fontSize: 15, fontWeight: '900' },
});
