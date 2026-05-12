import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity, KeyboardAvoidingView, Platform, Image, ScrollView, Alert, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { GradientButton } from '../src/components/ui/GradientButton';
import { GlassCard } from '../src/components/ui/GlassCard';
import { ChevronLeft, Phone, Lock, Eye, EyeOff, LogIn } from 'lucide-react-native';
import Animated, { FadeInUp } from 'react-native-reanimated';
import { authService } from '../src/services/api';

export default function LoginScreen() {
  const router = useRouter();
  const [role, setRole] = useState<'customer' | 'editor' | 'admin'>('customer');
  const [showPassword, setShowPassword] = useState(false);
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    if (!phone || !password) {
      Alert.alert('Error', 'Please enter both phone and password');
      return;
    }

    setLoading(true);
    try {
      const response = await authService.login(phone, password);
      const userRole = response.user.role; // Get role from backend
      
      if (userRole === 'ADMIN') {
        router.push('/(admin)/dashboard');
      } else if (userRole === 'EDITOR') {
        router.push('/(editor)/dashboard');
      } else {
        router.push('/(customer)/home');
      }
    } catch (error: any) {
      const msg = error.response?.data?.message || 'Login failed. Please check your credentials.';
      Alert.alert('Login Failed', msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <LinearGradient
        colors={['#F8FAFC', '#F1F5F9']}
        style={StyleSheet.absoluteFill}
      />

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
            <ChevronLeft size={24} color="#1E293B" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Login</Text>
          <View style={{ width: 40 }} />
        </View>

        <Animated.View entering={FadeInUp.duration(600)} style={styles.content}>
          <View style={styles.logoSection}>
            <Image 
              source={require('../assets/editgo_logo.png')} 
              style={styles.logo} 
              resizeMode="contain"
            />
            <Text style={styles.title}>Welcome Back</Text>
            <Text style={styles.subtitle}>Enter your phone and password to access your account</Text>
          </View>

          <View style={styles.form}>
            <GlassCard style={styles.inputCard}>
              <View style={styles.inputWrapper}>
                <Phone size={20} color="#8B5CF6" />
                <Text style={styles.countryCode}>+91</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Phone Number"
                  placeholderTextColor="#94A3B8"
                  keyboardType="phone-pad"
                  maxLength={10}
                  value={phone}
                  onChangeText={setPhone}
                />
              </View>
            </GlassCard>

            <GlassCard style={styles.inputCard}>
              <View style={styles.inputWrapper}>
                <Lock size={20} color="#8B5CF6" />
                <TextInput
                  style={styles.input}
                  placeholder="Password"
                  placeholderTextColor="#94A3B8"
                  secureTextEntry={!showPassword}
                  value={password}
                  onChangeText={setPassword}
                />
                <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
                  {showPassword ? <EyeOff size={20} color="#94A3B8" /> : <Eye size={20} color="#94A3B8" />}
                </TouchableOpacity>
              </View>
            </GlassCard>
            
            <TouchableOpacity style={styles.forgotPass}>
              <Text style={styles.forgotText}>Forgot Password?</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.buttonContainer}>
            {loading ? (
              <ActivityIndicator size="large" color="#8B5CF6" />
            ) : (
              <GradientButton 
                title="Login" 
                onPress={handleLogin} 
              />
            )}
          </View>

          <View style={styles.footer}>
            <Text style={styles.footerText}>Don't have an account? </Text>
            <TouchableOpacity onPress={() => router.push('/register')}>
              <Text style={styles.linkText}>Register Now</Text>
            </TouchableOpacity>
          </View>
        </Animated.View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  scrollContent: { paddingBottom: 40 },
  header: {
    paddingTop: 60,
    paddingHorizontal: 24,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  headerTitle: { fontSize: 18, fontWeight: '700', color: '#1E293B' },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 2,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  content: { padding: 24 },
  logoSection: { alignItems: 'center', marginBottom: 32 },
  logo: { width: 80, height: 80, marginBottom: 16 },
  title: { fontSize: 28, fontWeight: '800', color: '#1E293B', marginBottom: 8 },
  subtitle: { fontSize: 16, color: '#64748B', textAlign: 'center' },
  roleContainer: {
    flexDirection: 'row',
    backgroundColor: '#F1F5F9',
    borderRadius: 16,
    padding: 4,
    marginBottom: 32,
  },
  roleBtn: { flex: 1, paddingVertical: 12, alignItems: 'center', borderRadius: 12 },
  activeRoleBtn: { backgroundColor: '#FFFFFF', elevation: 2 },
  roleText: { fontSize: 14, fontWeight: '600', color: '#64748B' },
  activeRoleText: { color: '#8B5CF6' },
  form: { gap: 16 },
  inputCard: { padding: 0, borderRadius: 16, backgroundColor: '#FFF' },
  inputWrapper: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, paddingVertical: 14 },
  input: { flex: 1, marginLeft: 12, fontSize: 15, color: '#1E293B', fontWeight: '500' },
  countryCode: { marginLeft: 12, fontSize: 15, fontWeight: '600', color: '#1E293B' },
  forgotPass: { alignSelf: 'flex-end' },
  forgotText: { color: '#8B5CF6', fontSize: 12, fontWeight: '600' },
  buttonContainer: { marginTop: 32 },
  footer: { marginTop: 24, flexDirection: 'row', justifyContent: 'center' },
  footerText: { color: '#64748B', fontSize: 14 },
  linkText: { color: '#8B5CF6', fontSize: 14, fontWeight: '700' }
});

