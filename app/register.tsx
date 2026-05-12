import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity, KeyboardAvoidingView, Platform, Image, ScrollView, Alert, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { GradientButton } from '../src/components/ui/GradientButton';
import { GlassCard } from '../src/components/ui/GlassCard';
import { ChevronLeft, User, Mail, Phone, Lock, Eye, EyeOff } from 'lucide-react-native';
import Animated, { FadeInUp } from 'react-native-reanimated';
import { authService } from '../src/services/api';

export default function RegisterScreen() {
  const router = useRouter();
  const [role, setRole] = useState<'customer' | 'editor'>('customer');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: ''
  });

  const handleRegister = async () => {
    if (!formData.name || !formData.phone || !formData.password) {
      Alert.alert('Error', 'Please fill all required fields');
      return;
    }

    setLoading(true);
    try {
      const response = await authService.register({
        ...formData,
        role
      });
      
      Alert.alert('Success', 'Account created successfully!');
      
      if (role === 'customer') router.push('/(customer)/home');
      else router.push('/(editor)/dashboard');
    } catch (error: any) {
      const msg = error.response?.data?.message || 'Registration failed. Please try again.';
      Alert.alert('Registration Failed', msg);
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
          <Text style={styles.headerTitle}>Create Account</Text>
          <View style={{ width: 40 }} />
        </View>

        <Animated.View entering={FadeInUp.duration(600)} style={styles.content}>
          <View style={styles.logoSection}>
            <Image 
              source={require('../assets/editgo_logo.png')} 
              style={styles.logo} 
              resizeMode="contain"
            />
            <Text style={styles.title}>Join EditGo</Text>
            <Text style={styles.subtitle}>Start your creative journey today</Text>
          </View>

          <View style={styles.form}>
            <GlassCard style={styles.inputCard}>
              <View style={styles.inputWrapper}>
                <User size={20} color="#8B5CF6" />
                <TextInput
                  style={styles.input}
                  placeholder="Full Name"
                  placeholderTextColor="#94A3B8"
                  value={formData.name}
                  onChangeText={(t) => setFormData({...formData, name: t})}
                />
              </View>
            </GlassCard>

            <GlassCard style={styles.inputCard}>
              <View style={styles.inputWrapper}>
                <Mail size={20} color="#8B5CF6" />
                <TextInput
                  style={styles.input}
                  placeholder="Email Address (Optional)"
                  placeholderTextColor="#94A3B8"
                  keyboardType="email-address"
                  autoCapitalize="none"
                  value={formData.email}
                  onChangeText={(t) => setFormData({...formData, email: t})}
                />
              </View>
            </GlassCard>

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
                  value={formData.phone}
                  onChangeText={(t) => setFormData({...formData, phone: t})}
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
                  value={formData.password}
                  onChangeText={(t) => setFormData({...formData, password: t})}
                />
                <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
                  {showPassword ? <EyeOff size={20} color="#94A3B8" /> : <Eye size={20} color="#94A3B8" />}
                </TouchableOpacity>
              </View>
            </GlassCard>
          </View>

          <View style={styles.buttonContainer}>
            {loading ? (
              <ActivityIndicator size="large" color="#8B5CF6" />
            ) : (
              <GradientButton 
                title="Create Account" 
                onPress={handleRegister} 
              />
            )}
          </View>

          <View style={styles.footer}>
            <Text style={styles.footerText}>Already have an account? </Text>
            <TouchableOpacity onPress={() => router.push('/login')}>
              <Text style={styles.linkText}>Login Now</Text>
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
  buttonContainer: { marginTop: 32 },
  footer: { marginTop: 24, flexDirection: 'row', justifyContent: 'center' },
  footerText: { color: '#64748B', fontSize: 14 },
  linkText: { color: '#8B5CF6', fontSize: 14, fontWeight: '700' }
});
