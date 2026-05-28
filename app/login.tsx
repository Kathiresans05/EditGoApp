import React, { useState, useEffect } from 'react';
import {
  View, Text, TextInput, StyleSheet, TouchableOpacity,
  KeyboardAvoidingView, Platform, Image, ScrollView,
  Alert, ActivityIndicator, StatusBar,
} from 'react-native';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { Phone, Lock, Eye, EyeOff, Globe, Save, ChevronLeft, LogIn } from 'lucide-react-native';
import Animated, { FadeInUp } from 'react-native-reanimated';
import { authService, BASE_URL, initBaseUrl } from '../src/services/api';
import * as SecureStore from 'expo-secure-store';

export default function LoginScreen() {
  const router = useRouter();
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
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
      } else if (response.user.role === 'EDITOR') {
        router.replace('/(editor)/dashboard');
      } else {
        router.replace('/(customer)/home');
      }
    } catch (error: any) {
      console.error('--- LOGIN ERROR ---');
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
      <StatusBar barStyle="light-content" backgroundColor="#7C3AED" />
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scroll}>

        {/* Top Header & Logo Area */}
        <LinearGradient colors={['#7C3AED', '#5B21B6']} style={styles.topGrad}>
          <View style={styles.headerRow}>
            <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
              <ChevronLeft size={22} color="#FFF" />
            </TouchableOpacity>
            <Text style={styles.headerTitle}>Login</Text>
            <View style={{ width: 38 }} />
          </View>

          <Animated.View entering={FadeInUp.delay(100)} style={styles.logoWrap}>
            <TouchableOpacity
              onLongPress={() => setShowServerSettings(!showServerSettings)}
              delayLongPress={2000}
              activeOpacity={0.9}
              style={styles.logoBg}
            >
              <Image source={require('../assets/editgo_logo.png')} style={styles.logo} resizeMode="contain" />
            </TouchableOpacity>
            <Text style={styles.logoTitle}>Welcome Back</Text>
            <Text style={styles.logoSub}>Login to access your creator studio 🎬</Text>
          </Animated.View>
        </LinearGradient>

        <View style={styles.body}>

          {/* Server Config */}
          {showServerSettings && (
            <Animated.View entering={FadeInUp} style={styles.serverCard}>
              <View style={styles.serverHeader}>
                <Globe size={16} color="#7C3AED" />
                <Text style={styles.serverTitle}>Server Configuration</Text>
              </View>
              <View style={styles.serverInputRow}>
                <TextInput
                  style={styles.serverInput}
                  value={customUrl}
                  onChangeText={setCustomUrl}
                  placeholder="http://192.168.1.7:8000/api"
                  placeholderTextColor="#94A3B8"
                />
                <TouchableOpacity style={styles.saveBtn} onPress={saveServerUrl}>
                  <Save size={18} color="#FFF" />
                </TouchableOpacity>
              </View>
              <Text style={styles.serverTip}>Current: {BASE_URL}</Text>
            </Animated.View>
          )}

          {/* Form */}
          <Animated.View entering={FadeInUp.delay(150)} style={styles.form}>
            <View style={styles.inputWrap}>
              <View style={styles.iconWrap}>
                <Phone size={18} color="#10B981" />
              </View>
              <Text style={styles.prefix}>+91</Text>
              <TextInput
                placeholder="Phone Number"
                style={styles.input}
                value={phone}
                onChangeText={setPhone}
                keyboardType="phone-pad"
                placeholderTextColor="#94A3B8"
              />
            </View>

            <View style={styles.inputWrap}>
              <View style={styles.iconWrap}>
                <Lock size={18} color="#FB8C00" />
              </View>
              <TextInput
                placeholder="Password"
                style={styles.input}
                secureTextEntry={!showPassword}
                value={password}
                onChangeText={setPassword}
                placeholderTextColor="#94A3B8"
              />
              <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
                {showPassword ? <EyeOff size={18} color="#94A3B8" /> : <Eye size={18} color="#94A3B8" />}
              </TouchableOpacity>
            </View>

            <TouchableOpacity style={styles.forgotBtn}>
              <Text style={styles.forgotText}>Forgot Password?</Text>
            </TouchableOpacity>
          </Animated.View>

          {/* Login button */}
          <Animated.View entering={FadeInUp.delay(200)}>
            <TouchableOpacity style={styles.loginBtn} onPress={handleLogin} disabled={loading}>
              <LinearGradient colors={['#7C3AED', '#5B21B6']} style={styles.loginGrad}>
                {loading ? (
                  <ActivityIndicator color="#FFF" />
                ) : (
                  <>
                    <LogIn size={18} color="#FFF" />
                    <Text style={styles.loginText}>Sign In</Text>
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
          </Animated.View>

        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8FAFC' },
  scroll: { paddingBottom: 40 },

  topGrad: { paddingTop: 55, paddingBottom: 40, paddingHorizontal: 24, borderBottomLeftRadius: 36, borderBottomRightRadius: 36 },
  headerRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 },
  backBtn: { width: 38, height: 38, borderRadius: 12, backgroundColor: 'rgba(255,255,255,0.2)', alignItems: 'center', justifyContent: 'center' },
  headerTitle: { fontSize: 18, fontWeight: '900', color: '#FFF' },

  logoWrap: { alignItems: 'center' },
  logoBg: { width: 80, height: 80, borderRadius: 24, backgroundColor: 'rgba(255,255,255,0.2)', alignItems: 'center', justifyContent: 'center', marginBottom: 12 },
  logo: { width: 52, height: 52 },
  logoTitle: { fontSize: 26, fontWeight: '900', color: '#FFF', marginBottom: 4 },
  logoSub: { fontSize: 14, color: 'rgba(255,255,255,0.8)', fontWeight: '600' },

  body: { padding: 24 },

  serverCard: { backgroundColor: '#EDE7F6', padding: 16, borderRadius: 20, marginBottom: 20 },
  serverHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 10, gap: 8 },
  serverTitle: { fontSize: 13, fontWeight: '800', color: '#1E293B' },
  serverInputRow: { flexDirection: 'row', gap: 8 },
  serverInput: { flex: 1, backgroundColor: '#FFF', padding: 12, borderRadius: 12, fontSize: 13, color: '#1E293B', borderWidth: 1, borderColor: '#DDD6FE' },
  saveBtn: { backgroundColor: '#7C3AED', width: 44, borderRadius: 12, alignItems: 'center', justifyContent: 'center' },
  serverTip: { fontSize: 10, color: '#94A3B8', marginTop: 8, fontWeight: '600' },

  form: { gap: 12, marginBottom: 20 },
  inputWrap: {
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: '#FFF', borderRadius: 16, paddingHorizontal: 14,
    paddingVertical: 14, elevation: 1, shadowColor: '#7C3AED', shadowOpacity: 0.05, shadowRadius: 6,
  },
  iconWrap: { marginRight: 10 },
  prefix: { fontSize: 14, fontWeight: '700', color: '#1E293B', marginRight: 6 },
  input: { flex: 1, fontSize: 15, color: '#1E293B', fontWeight: '600' },
  forgotBtn: { alignSelf: 'flex-end', marginTop: 2 },
  forgotText: { fontSize: 13, fontWeight: '800', color: '#7C3AED' },

  loginBtn: { borderRadius: 18, overflow: 'hidden', elevation: 6, shadowColor: '#7C3AED', shadowOpacity: 0.3, shadowRadius: 12 },
  loginGrad: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', paddingVertical: 18, gap: 10 },
  loginText: { color: '#FFF', fontSize: 16, fontWeight: '900' },

  footer: { flexDirection: 'row', justifyContent: 'center', marginTop: 20 },
  footerText: { fontSize: 14, color: '#64748B', fontWeight: '600' },
  linkText: { fontSize: 14, fontWeight: '900', color: '#7C3AED' },
});
