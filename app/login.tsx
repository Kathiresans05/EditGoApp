import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity, KeyboardAvoidingView, Platform, Image, ScrollView, Alert, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { GlassCard } from '../src/components/ui/GlassCard';
import { Phone, Lock, ChevronRight, Eye, EyeOff, ShieldCheck, Settings, Globe, Save, ChevronLeft } from 'lucide-react-native';
import Animated, { FadeInUp } from 'react-native-reanimated';
import { authService, BASE_URL, initBaseUrl } from '../src/services/api';
import * as SecureStore from 'expo-secure-store';

export default function LoginScreen() {
  const router = useRouter();
  const [phone, setPhone] = useState('9787278026');
  const [password, setPassword] = useState('123');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showServerSettings, setShowServerSettings] = useState(false);
  const [customUrl, setCustomUrl] = useState(BASE_URL);

  useEffect(() => {
    const init = async () => {
      await initBaseUrl();
      setCustomUrl(BASE_URL);
    };
    init();
  }, []);

  const saveServerUrl = async () => {
    await SecureStore.setItemAsync('server_url', customUrl);
    Alert.alert('Success', 'Server URL updated! Please restart the app or try login.');
    setShowServerSettings(false);
  };

  const handleLogin = async () => {
    if (!phone || !password) {
      Alert.alert('Error', 'Please enter both phone number and password');
      return;
    }

    setLoading(true);
    try {
      const response = await authService.login(phone, password);
      console.log('--- LOGIN SUCCESS ---');
      if (response.user.role === 'ADMIN') {
        router.replace('/(admin)/dashboard');
      } else {
        router.replace('/(customer)/home');
      }
    } catch (error: any) {
      console.error('--- LOGIN ERROR ---');
      console.error(error);
      if (!error.response) {
        Alert.alert(
          'Connection Error', 
          `Cannot reach the server at:\n${BASE_URL}\n\nPlease ensure the backend is running and you are on the same Wi-Fi.\n\n(Tip: Long-press the EditGo logo for settings)`,
          [{ text: 'OK' }]
        );
      } else if (error.response.status === 401) {
        Alert.alert('Login Failed', 'Invalid phone or password.');
      } else {
        const message = error.response?.data?.message || 'Login failed. Please check your credentials.';
        Alert.alert('Login Failed', message);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={styles.container}>
      <LinearGradient colors={['#F8FAFC', '#F1F5F9']} style={StyleSheet.absoluteFill} />
      
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
            <ChevronLeft size={24} color="#1E293B" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Login</Text>
          <View style={{ width: 44 }} /> 
        </View>

        <View style={styles.logoSection}>
          <TouchableOpacity 
            onLongPress={() => setShowServerSettings(!showServerSettings)}
            delayLongPress={2000}
            activeOpacity={0.9}
            style={styles.logoBadge}
          >
            <Image 
              source={require('../assets/editgo_logo.png')} 
              style={styles.logo} 
              resizeMode="contain" 
            />
          </TouchableOpacity>
        </View>

        <View style={styles.welcomeSection}>
          <Text style={styles.title}>Welcome Back</Text>
          <Text style={styles.subtitle}>Enter your phone and password to access your account</Text>
        </View>

        {showServerSettings && (
          <Animated.View entering={FadeInUp} style={styles.serverSettingsCard}>
            <View style={styles.serverHeader}>
              <Globe size={18} color="#6366F1" />
              <Text style={styles.serverTitle}>Server Configuration</Text>
              <TouchableOpacity onPress={() => setShowServerSettings(false)} style={{marginLeft: 'auto'}}>
                <Text style={{color: '#94A3B8', fontSize: 12}}>Close</Text>
              </TouchableOpacity>
            </View>
            <View style={styles.serverInputRow}>
              <TextInput 
                style={styles.serverInput}
                value={customUrl}
                onChangeText={setCustomUrl}
                placeholder="http://192.168.1.7:8000/api"
              />
              <TouchableOpacity style={styles.saveUrlBtn} onPress={saveServerUrl}>
                <Save size={18} color="#FFF" />
              </TouchableOpacity>
            </View>
            <Text style={styles.serverTip}>Current: {BASE_URL}</Text>
            <Text style={styles.serverTip}>Only change this if you are a developer or the connection fails.</Text>
          </Animated.View>
        )}

        <View style={styles.formSection}>
          <GlassCard style={styles.inputCard}>
            <View style={styles.inputWrapper}>
              <Phone size={20} color="#8B5CF6" />
              <Text style={styles.countryCode}>+91</Text>
              <TextInput 
                placeholder="Phone Number" 
                style={styles.input}
                value={phone}
                onChangeText={setPhone}
                keyboardType="phone-pad"
                placeholderTextColor="#94A3B8"
              />
            </View>
          </GlassCard>

          <GlassCard style={styles.inputCard}>
            <View style={styles.inputWrapper}>
              <Lock size={20} color="#8B5CF6" />
              <TextInput 
                placeholder="Password" 
                style={styles.input}
                secureTextEntry={!showPassword}
                value={password}
                onChangeText={setPassword}
                placeholderTextColor="#94A3B8"
              />
              <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
                {showPassword ? <EyeOff size={20} color="#94A3B8" /> : <Eye size={20} color="#94A3B8" />}
              </TouchableOpacity>
            </View>
          </GlassCard>

          <TouchableOpacity style={styles.forgotBtn}>
            <Text style={styles.forgotText}>Forgot Password?</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.loginBtn} onPress={handleLogin} disabled={loading} activeOpacity={0.8}>
            <LinearGradient colors={['#4F46E5', '#6366F1']} start={{x:0, y:0}} end={{x:1, y:0}} style={styles.loginGradient}>
              {loading ? <ActivityIndicator color="#FFF" /> : (
                <>
                  <Text style={styles.loginText}>Login</Text>
                </>
              )}
            </LinearGradient>
          </TouchableOpacity>

          <View style={styles.footer}>
            <Text style={styles.footerText}>Don't have an account? </Text>
            <TouchableOpacity onPress={() => router.push('/register')}>
              <Text style={styles.linkText}>Register Now</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8FAFC' },
  scrollContent: { padding: 24, paddingTop: 60, paddingBottom: 40 },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 40 },
  backBtn: { width: 44, height: 44, borderRadius: 14, backgroundColor: '#FFF', alignItems: 'center', justifyContent: 'center', elevation: 2 },
  settingsBtn: { width: 44, height: 44, borderRadius: 14, backgroundColor: '#F5F3FF', alignItems: 'center', justifyContent: 'center' },
  headerTitle: { fontSize: 18, fontWeight: '800', color: '#1E293B' },
  logoSection: { alignItems: 'center', marginBottom: 24 },
  logoBadge: { width: 80, height: 80, borderRadius: 24, backgroundColor: '#FFF', alignItems: 'center', justifyContent: 'center', elevation: 4 },
  logo: { width: 50, height: 50 },
  welcomeSection: { alignItems: 'center', marginBottom: 40 },
  title: { fontSize: 28, fontWeight: '900', color: '#1E293B', marginBottom: 8 },
  subtitle: { fontSize: 14, color: '#64748B', textAlign: 'center', paddingHorizontal: 40 },
  
  serverSettingsCard: { backgroundColor: '#FFF', padding: 16, borderRadius: 20, marginBottom: 24, borderWidth: 1, borderColor: '#F1F5F9' },
  serverHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 12 },
  serverTitle: { fontSize: 14, fontWeight: '800', color: '#1E293B', marginLeft: 8 },
  serverInputRow: { flexDirection: 'row', gap: 8 },
  serverInput: { flex: 1, backgroundColor: '#F8FAFC', padding: 12, borderRadius: 12, fontSize: 13, color: '#1E293B', borderWidth: 1, borderColor: '#E2E8F0' },
  saveUrlBtn: { backgroundColor: '#6366F1', width: 48, borderRadius: 12, alignItems: 'center', justifyContent: 'center' },
  serverTip: { fontSize: 10, color: '#94A3B8', marginTop: 8, fontWeight: '600' },
  
  formSection: { gap: 20 },
  inputCard: { paddingHorizontal: 16, paddingVertical: 14, backgroundColor: '#FFF' },
  inputWrapper: { flexDirection: 'row', alignItems: 'center' },
  countryCode: { marginLeft: 12, marginRight: 8, fontSize: 15, fontWeight: '700', color: '#1E293B' },
  input: { flex: 1, fontSize: 15, color: '#1E293B', fontWeight: '600' },
  forgotBtn: { alignSelf: 'flex-end', marginTop: -10 },
  forgotText: { fontSize: 14, fontWeight: '700', color: '#6366F1' },
  loginBtn: { marginTop: 20, borderRadius: 20, overflow: 'hidden', elevation: 8, shadowColor: '#6366F1', shadowOffset: { width: 0, height: 10 }, shadowOpacity: 0.3, shadowRadius: 20 },
  loginGradient: { paddingVertical: 18, alignItems: 'center', justifyContent: 'center' },
  loginText: { color: '#FFF', fontSize: 16, fontWeight: '800' },
  footer: { flexDirection: 'row', justifyContent: 'center', marginTop: 24 },
  footerText: { fontSize: 14, color: '#64748B' },
  linkText: { fontSize: 14, fontWeight: '800', color: '#6366F1' }
});
