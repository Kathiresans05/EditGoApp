import React, { useEffect, useState } from 'react';
import { View, Text, Image, StyleSheet, Dimensions, TouchableOpacity, StatusBar, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { Sparkles, ArrowRight, Play, CheckCircle2 } from 'lucide-react-native';
import Animated, { FadeInUp } from 'react-native-reanimated';
import * as SecureStore from 'expo-secure-store';

const { width, height } = Dimensions.get('window');

export default function OnboardingScreen() {
  const router = useRouter();
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    const checkLoginStatus = async () => {
      try {
        const token = await SecureStore.getItemAsync('userToken');
        const role = await SecureStore.getItemAsync('userRole');
        
        if (token && role) {
          if (role === 'ADMIN') router.replace('/(admin)/dashboard');
          else if (role === 'EDITOR') router.replace('/(editor)/dashboard');
          else router.replace('/(customer)/home');
          return;
        }
      } catch (e) {
        console.log('Auto login failed', e);
      }
      setChecking(false);
    };
    checkLoginStatus();
  }, []);

  if (checking) {
    return (
      <View style={[styles.container, { justifyContent: 'center', alignItems: 'center', backgroundColor: '#7C3AED' }]}>
        <ActivityIndicator size="large" color="#FFF" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#7C3AED" />
      <LinearGradient colors={['#7C3AED', '#5B21B6']} style={StyleSheet.absoluteFill} />

      <View style={styles.content}>
        {/* Logo Section */}
        <Animated.View entering={FadeInUp.delay(100)} style={styles.logoWrap}>
          <View style={styles.logoBg}>
            <Image
              source={require('../assets/editgo_logo.png')}
              style={styles.logoImage}
              resizeMode="contain"
            />
          </View>
          <Text style={styles.brandTitle}>EditGo</Text>
          <Text style={styles.brandSub}>PROFESSIONAL CREATOR STUDIO</Text>
        </Animated.View>

        {/* Dynamic Card Area */}
        <Animated.View entering={FadeInUp.delay(200)} style={styles.introCard}>
          <View style={styles.pillRow}>
            <View style={styles.featurePill}>
              <Play size={10} color="#7C3AED" fill="#7C3AED" />
              <Text style={styles.featurePillText}>Instant Video Delivery</Text>
            </View>
            <View style={[styles.featurePill, { backgroundColor: '#E8F5E9' }]}>
              <Sparkles size={10} color="#2E7D32" />
              <Text style={[styles.featurePillText, { color: '#2E7D32' }]}>AI Powered</Text>
            </View>
          </View>

          <Text style={styles.introTitle}>Your Editor in Minutes</Text>
          <Text style={styles.introDesc}>
            Connect instantly with high-quality, verified rapid editors. Upload your raw footage and get professional edits delivered in under 45 minutes!
          </Text>

          <View style={styles.bulletList}>
            <BulletItem text="45 Minute Guaranteed Delivery Speed" />
            <BulletItem text="Live Video Previews & Real-Time Chat" />
            <BulletItem text="Fixed Pricing — Pay Only After Unlocking" />
          </View>
        </Animated.View>

        {/* Action Button */}
        <Animated.View entering={FadeInUp.delay(300)} style={styles.footer}>
          <TouchableOpacity style={styles.getStartedBtn} onPress={() => router.push('/login')}>
            <LinearGradient colors={['#FFF', '#F5F3FF']} style={styles.btnGrad}>
              <Text style={styles.btnText}>Get Started</Text>
              <ArrowRight size={18} color="#7C3AED" />
            </LinearGradient>
          </TouchableOpacity>
          <Text style={styles.joinText}>Join 10,000+ top content creators today ✨</Text>
        </Animated.View>
      </View>
    </View>
  );
}

function BulletItem({ text }: { text: string }) {
  return (
    <View style={styles.bulletRow}>
      <CheckCircle2 size={15} color="#10B981" fill="#DCFCE7" />
      <Text style={styles.bulletText}>{text}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: { flex: 1, padding: 24, justifyContent: 'space-between', paddingTop: height * 0.08, paddingBottom: height * 0.05 },

  logoWrap: { alignItems: 'center' },
  logoBg: { width: 90, height: 90, borderRadius: 28, backgroundColor: 'rgba(255,255,255,0.2)', alignItems: 'center', justifyContent: 'center', marginBottom: 12 },
  logoImage: { width: 56, height: 56 },
  brandTitle: { fontSize: 28, fontWeight: '900', color: '#FFF' },
  brandSub: { fontSize: 10, fontWeight: '900', color: 'rgba(255,255,255,0.7)', letterSpacing: 2, marginTop: 4 },

  introCard: {
    backgroundColor: '#FFF', borderRadius: 32, padding: 24,
    elevation: 6, shadowColor: '#000', shadowOpacity: 0.15, shadowRadius: 20,
  },
  pillRow: { flexDirection: 'row', gap: 8, marginBottom: 14 },
  featurePill: { flexDirection: 'row', alignItems: 'center', gap: 5, backgroundColor: '#EDE7F6', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 8 },
  featurePillText: { fontSize: 10, fontWeight: '900', color: '#7C3AED' },
  introTitle: { fontSize: 24, fontWeight: '900', color: '#1E293B', marginBottom: 10 },
  introDesc: { fontSize: 13, color: '#64748B', lineHeight: 20, fontWeight: '600', marginBottom: 18 },

  bulletList: { gap: 10 },
  bulletRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  bulletText: { fontSize: 12, color: '#475569', fontWeight: '800' },

  footer: { alignItems: 'center', width: '100%' },
  getStartedBtn: { width: '100%', borderRadius: 20, overflow: 'hidden', elevation: 6, shadowColor: '#7C3AED', shadowOpacity: 0.4, shadowRadius: 16 },
  btnGrad: { flexDirection: 'row', justifyContent: 'center', alignItems: 'center', paddingVertical: 18, gap: 8 },
  btnText: { fontSize: 16, fontWeight: '900', color: '#7C3AED' },
  joinText: { fontSize: 12, color: 'rgba(255,255,255,0.8)', fontWeight: '700', marginTop: 16 },
});
