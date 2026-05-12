import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, Image, TouchableOpacity, Dimensions, Alert, ActivityIndicator } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { GradientButton } from '../src/components/ui/GradientButton';
import { CheckCircle, Zap, DollarSign, Award, ArrowLeft } from 'lucide-react-native';
import Animated, { FadeInUp, FadeInDown } from 'react-native-reanimated';
import { authService } from '../src/services/api';

const { width } = Dimensions.get('window');

export default function BecomeEditorScreen() {
  const router = useRouter();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    checkLogin();
  }, []);

  const checkLogin = async () => {
    const auth = await authService.isAuthenticated();
    setIsLoggedIn(auth);
  };

  const handleEditorAction = async () => {
    if (isLoggedIn) {
      setLoading(true);
      try {
        await authService.becomeEditor();
        Alert.alert('Success', 'You are now an Editor! Welcome to the team.', [
          { text: 'Go to Dashboard', onPress: () => router.push('/(editor)/dashboard') }
        ]);
      } catch (error: any) {
        Alert.alert('Error', error.response?.data?.message || 'Failed to upgrade account');
      } finally {
        setLoading(false);
      }
    } else {
      router.push({ pathname: '/register', params: { role: 'editor' } });
    }
  };

  const benefits = [
    { title: 'Flexible Work', desc: 'Work from anywhere, anytime.', icon: Zap },
    { title: 'High Payouts', desc: 'Get paid per project instantly.', icon: DollarSign },
    { title: 'Growth', desc: 'Rank up from Beginner to Master.', icon: Award },
  ];

  return (
    <View style={styles.container}>
      <LinearGradient colors={['#1E293B', '#0F172A']} style={StyleSheet.absoluteFill} />
      
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        {/* Back Button */}
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <ArrowLeft size={24} color="#FFF" />
        </TouchableOpacity>

        <Animated.View entering={FadeInUp.delay(200)} style={styles.header}>
          <Text style={styles.tagline}>EditGo Partner</Text>
          <Text style={styles.title}>Turn Your Skills into Earnings</Text>
          <Text style={styles.subtitle}>Join our elite community of editors and work on projects for top creators.</Text>
        </Animated.View>

        {/* Benefits */}
        <View style={styles.benefitsContainer}>
          {benefits.map((item, index) => (
            <Animated.View key={index} entering={FadeInUp.delay(400 + index * 100)} style={styles.benefitCard}>
              <View style={styles.iconCircle}>
                <item.icon size={24} color="#8B5CF6" />
              </View>
              <View style={styles.benefitText}>
                <Text style={styles.benefitTitle}>{item.title}</Text>
                <Text style={styles.benefitDesc}>{item.desc}</Text>
              </View>
            </Animated.View>
          ))}
        </View>

        {/* How it works */}
        <Animated.View entering={FadeInDown.delay(800)} style={styles.ctaCard}>
          <Text style={styles.ctaTitle}>Ready to start?</Text>
          <Text style={styles.ctaDesc}>Set up your editor profile, upload your portfolio, and start receiving orders today.</Text>
          {loading ? (
            <ActivityIndicator size="large" color="#8B5CF6" />
          ) : (
            <GradientButton 
              title={isLoggedIn ? "Upgrade to Editor" : "Register as Editor"} 
              onPress={handleEditorAction} 
            />
          )}
        </Animated.View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  scrollContent: { padding: 24, paddingTop: 60, paddingBottom: 40 },
  backBtn: { width: 44, height: 44, borderRadius: 22, backgroundColor: '#FFFFFF20', alignItems: 'center', justifyContent: 'center', marginBottom: 32 },
  header: { marginBottom: 40 },
  tagline: { fontSize: 16, fontWeight: '700', color: '#8B5CF6', textTransform: 'uppercase', letterSpacing: 1.5, marginBottom: 8 },
  title: { fontSize: 32, fontWeight: '800', color: '#FFF', marginBottom: 16, lineHeight: 40 },
  subtitle: { fontSize: 16, color: '#94A3B8', lineHeight: 24 },
  benefitsContainer: { marginBottom: 40 },
  benefitCard: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#FFFFFF10', padding: 20, borderRadius: 24, marginBottom: 16, borderWidth: 1, borderColor: '#FFFFFF10' },
  iconCircle: { width: 48, height: 48, borderRadius: 16, backgroundColor: '#8B5CF615', alignItems: 'center', justifyContent: 'center', marginRight: 16 },
  benefitText: { flex: 1 },
  benefitTitle: { fontSize: 18, fontWeight: '700', color: '#FFF', marginBottom: 4 },
  benefitDesc: { fontSize: 14, color: '#94A3B8' },
  ctaCard: { backgroundColor: '#FFFFFF', padding: 32, borderRadius: 32, alignItems: 'center' },
  ctaTitle: { fontSize: 24, fontWeight: '800', color: '#1E293B', marginBottom: 8 },
  ctaDesc: { fontSize: 15, color: '#64748B', textAlign: 'center', marginBottom: 24, lineHeight: 22 }
});
