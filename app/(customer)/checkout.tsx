import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Alert, ActivityIndicator } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { ChevronLeft, CreditCard, ShieldCheck, CheckCircle2, AlertCircle } from 'lucide-react-native';
import api from '../../src/services/api';

export default function CheckoutScreen() {
  const router = useRouter();
  const { orderId } = useLocalSearchParams();
  const [loading, setLoading] = useState(false);
  const [verifying, setVerifying] = useState(false);
  const [success, setSuccess] = useState(false);
  const [orderData, setOrderData] = useState<any>(null);

  useEffect(() => {
    // In a real app, fetch order details by ID
    // For demo, we just set a mock price
    setOrderData({
      id: orderId || 'mock_order_123',
      title: 'Cinematic Reel Editing',
      price: 1500, // ₹1,500
    });
  }, [orderId]);

  const handlePayment = async () => {
    setLoading(true);
    try {
      // 1. Create Order on Backend
      const res = await api.post('/payments/create-order', {
        orderId: orderData.id,
      });

      const { id: razorpayOrderId, amount } = res.data.data;

      // 2. Open Razorpay Checkout (Simulated for Expo)
      // In a real bare RN app, you would use RazorpayCheckout.open(options)
      setTimeout(async () => {
        setLoading(false);
        setVerifying(true);
        
        // 3. Verify Payment Signature on Backend (Simulated success)
        try {
          await api.post('/payments/verify', {
            razorpay_order_id: razorpayOrderId,
            razorpay_payment_id: `pay_${Math.random().toString(36).substring(7)}`,
            razorpay_signature: 'mock_signature_from_razorpay', // Would fail backend check without disabling sig check in dev
            internal_order_id: orderData.id
          });
        } catch (verifyError) {
          // Ignore verify error for this frontend demo
          console.log('Verification simulated');
        }

        setVerifying(false);
        setSuccess(true);
      }, 2000);

    } catch (e: any) {
      setLoading(false);
      Alert.alert('Payment Failed', e.response?.data?.message || 'Could not initiate payment.');
    }
  };

  if (success) {
    return (
      <View style={s.centerContainer}>
        <CheckCircle2 size={64} color="#10B981" />
        <Text style={s.successTitle}>Payment Successful!</Text>
        <Text style={s.successDesc}>Your order is now being matched with top-rated editors.</Text>
        <TouchableOpacity style={s.successBtn} onPress={() => router.push('/(customer)/matching')}>
          <Text style={s.successBtnText}>View Matching Status</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={s.container}>
      <LinearGradient colors={['#1E293B', '#0F172A']} style={s.header}>
        <TouchableOpacity onPress={() => router.back()} style={s.backBtn}>
          <ChevronLeft size={24} color="#FFF" />
        </TouchableOpacity>
        <Text style={s.title}>Secure Checkout</Text>
        <View style={{width: 24}} />
      </LinearGradient>

      <ScrollView style={s.body} contentContainerStyle={{paddingBottom: 40}}>
        <View style={s.summaryCard}>
          <Text style={s.sectionTitle}>Order Summary</Text>
          <View style={s.row}>
            <Text style={s.rowLabel}>{orderData?.title}</Text>
            <Text style={s.rowVal}>₹{orderData?.price}</Text>
          </View>
          <View style={s.row}>
            <Text style={s.rowLabel}>Platform Fee (5%)</Text>
            <Text style={s.rowVal}>₹{orderData ? (orderData.price * 0.05).toFixed(2) : 0}</Text>
          </View>
          <View style={s.divider} />
          <View style={s.row}>
            <Text style={s.totalLabel}>Total Payable</Text>
            <Text style={s.totalVal}>₹{orderData ? (orderData.price * 1.05).toFixed(2) : 0}</Text>
          </View>
        </View>

        <View style={s.securityBanner}>
          <ShieldCheck size={24} color="#10B981" />
          <View style={s.bannerTextContainer}>
            <Text style={s.bannerTitle}>100% Secure Payment</Text>
            <Text style={s.bannerSub}>Protected by Razorpay & SSL Encryption</Text>
          </View>
        </View>

        <View style={s.methodsContainer}>
          <Text style={s.sectionTitle}>Pay Via</Text>
          <TouchableOpacity style={s.methodCard}>
            <LinearGradient colors={['#F8FAFC', '#F1F5F9']} style={s.methodBg}>
              <CreditCard size={24} color="#4F46E5" />
              <Text style={s.methodText}>UPI / Cards / NetBanking</Text>
            </LinearGradient>
          </TouchableOpacity>
        </View>

        <TouchableOpacity 
          style={s.payBtn} 
          onPress={handlePayment} 
          disabled={loading || verifying}
        >
          <LinearGradient colors={['#4F46E5', '#6366F1']} style={s.payBtnGradient} start={{x:0, y:0}} end={{x:1, y:1}}>
            {loading || verifying ? (
              <ActivityIndicator color="#FFF" />
            ) : (
              <Text style={s.payBtnText}>Pay ₹{orderData ? (orderData.price * 1.05).toFixed(2) : 0}</Text>
            )}
          </LinearGradient>
        </TouchableOpacity>
        
        {(loading || verifying) && (
          <Text style={s.verifyingText}>
            {loading ? 'Initializing Secure Gateway...' : 'Verifying Payment...'}
          </Text>
        )}
      </ScrollView>
    </View>
  );
}

const s = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8FAFC' },
  centerContainer: { flex: 1, backgroundColor: '#F8FAFC', alignItems: 'center', justifyContent: 'center', padding: 24 },
  successTitle: { fontSize: 24, fontWeight: '900', color: '#1E293B', marginTop: 16 },
  successDesc: { fontSize: 16, color: '#64748B', textAlign: 'center', marginTop: 8, marginBottom: 32 },
  successBtn: { backgroundColor: '#10B981', paddingHorizontal: 24, paddingVertical: 16, borderRadius: 16, width: '100%', alignItems: 'center' },
  successBtnText: { color: '#FFF', fontWeight: '800', fontSize: 16 },
  header: { paddingTop: 60, paddingBottom: 20, paddingHorizontal: 16, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  title: { fontSize: 18, fontWeight: '800', color: '#FFF' },
  backBtn: { width: 40, height: 40, borderRadius: 20, backgroundColor: 'rgba(255,255,255,0.1)', alignItems: 'center', justifyContent: 'center' },
  body: { padding: 20 },
  summaryCard: { backgroundColor: '#FFF', padding: 20, borderRadius: 20, marginBottom: 20, elevation: 2, shadowColor: '#000', shadowOffset: {width: 0, height: 2}, shadowOpacity: 0.05, shadowRadius: 4 },
  sectionTitle: { fontSize: 16, fontWeight: '800', color: '#1E293B', marginBottom: 16 },
  row: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 12 },
  rowLabel: { fontSize: 15, color: '#64748B', fontWeight: '500' },
  rowVal: { fontSize: 15, color: '#1E293B', fontWeight: '700' },
  divider: { height: 1, backgroundColor: '#F1F5F9', marginVertical: 12 },
  totalLabel: { fontSize: 16, color: '#1E293B', fontWeight: '800' },
  totalVal: { fontSize: 20, color: '#4F46E5', fontWeight: '900' },
  securityBanner: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#ECFDF5', padding: 16, borderRadius: 16, marginBottom: 24, borderWidth: 1, borderColor: '#D1FAE5' },
  bannerTextContainer: { marginLeft: 12 },
  bannerTitle: { fontSize: 14, fontWeight: '800', color: '#065F46' },
  bannerSub: { fontSize: 12, color: '#047857', marginTop: 2 },
  methodsContainer: { marginBottom: 32 },
  methodCard: { borderRadius: 16, overflow: 'hidden', borderWidth: 2, borderColor: '#E2E8F0' },
  methodBg: { padding: 20, flexDirection: 'row', alignItems: 'center', gap: 16 },
  methodText: { fontSize: 16, fontWeight: '700', color: '#1E293B' },
  payBtn: { borderRadius: 16, overflow: 'hidden', elevation: 4 },
  payBtnGradient: { padding: 18, alignItems: 'center' },
  payBtnText: { color: '#FFF', fontSize: 18, fontWeight: '900' },
  verifyingText: { textAlign: 'center', color: '#64748B', marginTop: 16, fontSize: 14, fontWeight: '600' }
});
