import React from 'react';
import { View, Text, Image, StyleSheet, Dimensions } from 'react-native';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { GradientButton } from '../src/components/ui/GradientButton';
import Animated, { FadeInUp, FadeInDown } from 'react-native-reanimated';

const { width, height } = Dimensions.get('window');

export default function OnboardingScreen() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={['#FFFFFF', '#F8FAFC', '#E0E7FF']}
        style={StyleSheet.absoluteFill}
      />
      
      <View style={styles.content}>
        <Animated.View entering={FadeInUp.delay(200).duration(1000)} style={styles.imageContainer}>
          <Image 
            source={require('../assets/editgo_logo.png')} 
            style={styles.logoImage} 
            resizeMode="contain"
          />
        </Animated.View>

        <Animated.View entering={FadeInDown.delay(400).duration(1000)} style={styles.textContainer}>
          <Text style={styles.tagline}>EditGo</Text>
          <Text style={styles.title}>Your Editor in Minutes.</Text>
          <Text style={styles.description}>
            The instant on-demand marketplace for premium video and photo editing. Get professional results, fast.
          </Text>
        </Animated.View>

        <Animated.View entering={FadeInDown.delay(600).duration(1000)} style={styles.buttonContainer}>
          <GradientButton 
            title="Get Started" 
            onPress={() => router.push('/login')} 
          />
          <Text style={styles.footerText}>
            Join 10,000+ creators today
          </Text>
        </Animated.View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    padding: 24,
    justifyContent: 'space-between',
    paddingTop: height * 0.15,
    paddingBottom: height * 0.05,
  },
  imageContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 40,
  },
  logoImage: {
    width: 180,
    height: 180,
  },
  textContainer: {
    alignItems: 'center',
  },
  tagline: {
    fontSize: 18,
    fontWeight: '600',
    color: '#8B5CF6',
    marginBottom: 8,
    letterSpacing: 2,
    textTransform: 'uppercase',
  },
  title: {
    fontSize: 36,
    fontWeight: '800',
    color: '#1E293B',
    textAlign: 'center',
    marginBottom: 16,
  },
  description: {
    fontSize: 16,
    color: '#64748B',
    textAlign: 'center',
    lineHeight: 24,
    paddingHorizontal: 20,
  },
  buttonContainer: {
    width: '100%',
    alignItems: 'center',
  },
  footerText: {
    marginTop: 16,
    color: '#94A3B8',
    fontSize: 14,
  },
});
