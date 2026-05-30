import React, { useState } from 'react';
import {
  View, Text, TextInput, StyleSheet, TouchableOpacity,
  KeyboardAvoidingView, Platform, Image, ScrollView,
  Alert, ActivityIndicator, StatusBar,
} from 'react-native';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { ChevronLeft, User, Mail, Phone, Lock, Eye, EyeOff, Briefcase, Sparkles } from 'lucide-react-native';
import Animated, { FadeInUp } from 'react-native-reanimated';
import { authService } from '../src/services/api';

const ROLES = [
  { key: 'customer', label: '🎬 I need edits', desc: 'Upload & get edited fast', bg: '#EDE7F6', border: '#7C3AED', text: '#7C3AED' },
  { key: 'editor',   label: '✂️ I am an editor', desc: 'Earn by editing projects', bg: '#E8F5E9', border: '#2E7D32', text: '#2E7D32' },
];

export default function RegisterScreen() {
  const router = useRouter();
  const [role, setRole] = useState<'customer' | 'editor'>('customer');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({ name: '', email: '', phone: '', password: '', referredBy: '' });

  const update = (key: string, value: string) => setFormData(prev => ({ ...prev, [key]: value }));

  const handleRegister = async () => {
    if (!formData.name || !formData.phone || !formData.password) {
      Alert.alert('Missing Fields', 'Please fill all required fields.');
      return;
    }
    setLoading(true);
    try {
      await authService.register({ ...formData, role });
      if (role === 'customer') router.replace('/(customer)/home');
      else router.replace('/(editor)/dashboard');
    } catch (error: any) {
      Alert.alert('Registration Failed', error.response?.data?.message || 'Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#7C3AED" />
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scroll}>

        {/* Top gradient */}
        <LinearGradient colors={['#7C3AED', '#5B21B6']} style={styles.topGrad}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
            <ChevronLeft size={22} color="#FFF" />
          </TouchableOpacity>
          <Animated.View entering={FadeInUp.delay(100)} style={styles.logoWrap}>
            <View style={styles.logoBg}>
              <Image source={require('../assets/editgo_logo.png')} style={styles.logo} resizeMode="contain" />
            </View>
            <Text style={styles.logoTitle}>Join EditGo</Text>
            <Text style={styles.logoSub}>Start your creative journey today ✨</Text>
          </Animated.View>
        </LinearGradient>

        <View style={styles.body}>

          {/* Role selector */}
          <Animated.View entering={FadeInUp.delay(150)}>
            <Text style={styles.sectionLabel}>I want to...</Text>
            <View style={styles.roleRow}>
              {ROLES.map(r => (
                <TouchableOpacity
                  key={r.key}
                  style={[styles.roleCard, { backgroundColor: r.bg, borderColor: role === r.key ? r.border : 'transparent', borderWidth: 2 }]}
                  onPress={() => setRole(r.key as 'customer' | 'editor')}
                >
                  <Text style={[styles.roleLabel, { color: r.text }]}>{r.label}</Text>
                  <Text style={styles.roleDesc}>{r.desc}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </Animated.View>

          {/* Form fields */}
          <Animated.View entering={FadeInUp.delay(200)} style={styles.form}>
            <InputField
              icon={<User size={18} color="#7C3AED" />}
              placeholder="Full Name"
              value={formData.name}
              onChangeText={v => update('name', v)}
            />
            <InputField
              icon={<Mail size={18} color="#1E88E5" />}
              placeholder="Email Address (Optional)"
              value={formData.email}
              onChangeText={v => update('email', v)}
              keyboardType="email-address"
              autoCapitalize="none"
            />
            <InputField
              icon={<Phone size={18} color="#10B981" />}
              placeholder="Phone Number"
              value={formData.phone}
              onChangeText={v => update('phone', v)}
              keyboardType="phone-pad"
              prefix="+91"
            />
            <InputField
              icon={<Sparkles size={18} color="#EC4899" />}
              placeholder="Referral Code (Optional)"
              value={formData.referredBy}
              onChangeText={v => update('referredBy', v)}
              autoCapitalize="characters"
            />
            <InputField
              icon={<Lock size={18} color="#FB8C00" />}
              placeholder="Password"
              value={formData.password}
              onChangeText={v => update('password', v)}
              secureTextEntry={!showPassword}
              suffix={
                <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
                  {showPassword ? <EyeOff size={18} color="#94A3B8" /> : <Eye size={18} color="#94A3B8" />}
                </TouchableOpacity>
              }
            />
          </Animated.View>

          {/* Register button */}
          <Animated.View entering={FadeInUp.delay(300)}>
            <TouchableOpacity style={styles.registerBtn} onPress={handleRegister} disabled={loading}>
              <LinearGradient colors={['#7C3AED', '#5B21B6']} style={styles.registerGrad}>
                {loading
                  ? <ActivityIndicator color="#FFF" />
                  : <>
                      <Sparkles size={18} color="#FFF" />
                      <Text style={styles.registerText}>Create Account</Text>
                    </>
                }
              </LinearGradient>
            </TouchableOpacity>

            <View style={styles.footer}>
              <Text style={styles.footerText}>Already have an account? </Text>
              <TouchableOpacity onPress={() => router.push('/login')}>
                <Text style={styles.linkText}>Login Now</Text>
              </TouchableOpacity>
            </View>
          </Animated.View>

        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

function InputField({ icon, placeholder, value, onChangeText, keyboardType, autoCapitalize, secureTextEntry, prefix, suffix }: any) {
  return (
    <View style={inputStyles.wrap}>
      <View style={inputStyles.iconWrap}>{icon}</View>
      {prefix && <Text style={inputStyles.prefix}>{prefix}</Text>}
      <TextInput
        style={inputStyles.input}
        placeholder={placeholder}
        placeholderTextColor="#94A3B8"
        value={value}
        onChangeText={onChangeText}
        keyboardType={keyboardType || 'default'}
        autoCapitalize={autoCapitalize || 'words'}
        secureTextEntry={secureTextEntry}
      />
      {suffix}
    </View>
  );
}

const inputStyles = StyleSheet.create({
  wrap: {
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: '#FFF', borderRadius: 16, paddingHorizontal: 14,
    paddingVertical: 14, marginBottom: 12,
    elevation: 1, shadowColor: '#7C3AED', shadowOpacity: 0.05, shadowRadius: 6,
  },
  iconWrap: { marginRight: 10 },
  prefix: { fontSize: 14, fontWeight: '700', color: '#1E293B', marginRight: 6 },
  input: { flex: 1, fontSize: 15, color: '#1E293B', fontWeight: '600' },
});

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8FAFC' },
  scroll: { paddingBottom: 40 },

  topGrad: { paddingTop: 55, paddingBottom: 40, paddingHorizontal: 24, borderBottomLeftRadius: 36, borderBottomRightRadius: 36 },
  backBtn: { width: 38, height: 38, borderRadius: 12, backgroundColor: 'rgba(255,255,255,0.2)', alignItems: 'center', justifyContent: 'center', marginBottom: 20 },
  logoWrap: { alignItems: 'center' },
  logoBg: { width: 80, height: 80, borderRadius: 24, backgroundColor: 'rgba(255,255,255,0.2)', alignItems: 'center', justifyContent: 'center', marginBottom: 12 },
  logo: { width: 52, height: 52 },
  logoTitle: { fontSize: 26, fontWeight: '900', color: '#FFF', marginBottom: 4 },
  logoSub: { fontSize: 14, color: 'rgba(255,255,255,0.8)', fontWeight: '600' },

  body: { padding: 24 },
  sectionLabel: { fontSize: 15, fontWeight: '800', color: '#1E293B', marginBottom: 12, marginTop: 8 },
  roleRow: { flexDirection: 'row', gap: 12, marginBottom: 24 },
  roleCard: { flex: 1, borderRadius: 18, padding: 16 },
  roleLabel: { fontSize: 14, fontWeight: '900', marginBottom: 4 },
  roleDesc: { fontSize: 11, color: '#64748B', fontWeight: '600' },

  form: { gap: 0, marginBottom: 24 },

  registerBtn: { borderRadius: 18, overflow: 'hidden', elevation: 6, shadowColor: '#7C3AED', shadowOpacity: 0.3, shadowRadius: 12 },
  registerGrad: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', paddingVertical: 18, gap: 10 },
  registerText: { color: '#FFF', fontSize: 16, fontWeight: '900' },

  footer: { flexDirection: 'row', justifyContent: 'center', marginTop: 20 },
  footerText: { fontSize: 14, color: '#64748B', fontWeight: '600' },
  linkText: { fontSize: 14, fontWeight: '900', color: '#7C3AED' },
});
