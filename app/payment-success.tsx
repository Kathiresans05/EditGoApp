import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ActivityIndicator } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { CheckCircle2, XCircle } from 'lucide-react-native';
import Animated, { FadeInUp, ZoomIn } from 'react-native-reanimated';

/**
 * This screen catches the `editgo://payment-success` deep link that Razorpay
 * redirects to after a payment attempt. It reads the status from the URL params,
 * shows a success or failure message, and then navigates back to the
 * appropriate tracking screen.
 */
export default function PaymentSuccessScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const status = params.status as string;
  const orderId = params.orderId as string;
  const [countdown, setCountdown] = useState(3);

  const isSuccess = status === 'success';
  const isCancel = status === 'cancel';

  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          // Navigate back to the tracking screen for this order
          if (orderId) {
            router.replace({ pathname: '/(customer)/tracking', params: { orderId } });
          } else {
            router.replace('/(tabs)/home');
          }
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [orderId]);

  return (
    <LinearGradient
      colors={isSuccess ? ['#059669', '#10B981'] : isCancel ? ['#64748B', '#94A3B8'] : ['#DC2626', '#EF4444']}
      style={styles.container}
    >
      <Animated.View entering={ZoomIn.delay(100)} style={styles.iconWrap}>
        {isSuccess
          ? <CheckCircle2 size={80} color="#FFF" />
          : <XCircle size={80} color="#FFF" />
        }
      </Animated.View>

      <Animated.Text entering={FadeInUp.delay(200)} style={styles.title}>
        {isSuccess ? 'Payment Successful! 🎉' : isCancel ? 'Payment Cancelled' : 'Payment Failed'}
      </Animated.Text>

      <Animated.Text entering={FadeInUp.delay(300)} style={styles.subtitle}>
        {isSuccess
          ? 'Your high-res video has been unlocked! Returning to your order...'
          : isCancel
          ? 'You cancelled the payment. Returning to your order...'
          : 'Something went wrong. Returning to your order...'}
      </Animated.Text>

      <Animated.View entering={FadeInUp.delay(400)} style={styles.countdownBox}>
        <ActivityIndicator color="#FFF" size="small" />
        <Text style={styles.countdownText}>Redirecting in {countdown}s...</Text>
      </Animated.View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 32,
  },
  iconWrap: {
    marginBottom: 24,
  },
  title: {
    fontSize: 26,
    fontWeight: '900',
    color: '#FFF',
    textAlign: 'center',
    marginBottom: 12,
  },
  subtitle: {
    fontSize: 15,
    color: 'rgba(255,255,255,0.85)',
    textAlign: 'center',
    lineHeight: 24,
    fontWeight: '600',
    marginBottom: 32,
  },
  countdownBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    backgroundColor: 'rgba(255,255,255,0.2)',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 20,
  },
  countdownText: {
    color: '#FFF',
    fontWeight: '800',
    fontSize: 14,
  },
});
