import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, StatusBar } from 'react-native';
import { ArrowLeft, Shield, Eye, Lock, FileText, CheckCircle } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';

export default function PrivacyPolicyScreen() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#7C3AED" />
      
      {/* Header */}
      <LinearGradient colors={['#7C3AED', '#5B21B6']} style={styles.header}>
        <View style={styles.headerRow}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
            <ArrowLeft size={22} color="#FFF" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Privacy Policy</Text>
          <View style={{ width: 38 }} />
        </View>
        <Text style={styles.headerDesc}>Your privacy and footage safety are our highest priorities</Text>
      </LinearGradient>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scroll}>
        {/* Intro Card */}
        <View style={styles.introCard}>
          <View style={styles.introHeader}>
            <Shield size={24} color="#7C3AED" />
            <Text style={styles.introTitle}>EditGo Shield Protection</Text>
          </View>
          <Text style={styles.introText}>
            We build secure tech. Every video piece, payment detail, and credential you share with EditGo is protected under enterprise-grade encryption.
          </Text>
        </View>

        {/* Section 1 */}
        <View style={styles.sectionCard}>
          <View style={styles.sectionHeader}>
            <Eye size={18} color="#10B981" />
            <Text style={styles.sectionTitle}>1. Information We Collect</Text>
          </View>
          <Text style={styles.bodyText}>
            We collect information you provide directly to us when creating an account, upgrading creator tiers, or uploading media. This includes:
          </Text>
          <View style={styles.bulletRow}>
            <CheckCircle size={14} color="#10B981" style={styles.bulletIcon} />
            <Text style={styles.bulletText}>Account Profile: Name, phone, and email address.</Text>
          </View>
          <View style={styles.bulletRow}>
            <CheckCircle size={14} color="#10B981" style={styles.bulletIcon} />
            <Text style={styles.bulletText}>Video Content: Raw video clips and instruction files.</Text>
          </View>
          <View style={styles.bulletRow}>
            <CheckCircle size={14} color="#10B981" style={styles.bulletIcon} />
            <Text style={styles.bulletText}>Payment Logs: Secure tokenized receipts from Razorpay.</Text>
          </View>
        </View>

        {/* Section 2 */}
        <View style={styles.sectionCard}>
          <View style={styles.sectionHeader}>
            <Lock size={18} color="#3B82F6" />
            <Text style={styles.sectionTitle}>2. How We Use and Protect Data</Text>
          </View>
          <Text style={styles.bodyText}>
            Your video files are strictly loaded to secure cloud servers. Only your matched certified editor has access to download the raw clips solely for the purpose of editing your requested order. Files are automatically deleted from server logs 14 days after order completion.
          </Text>
        </View>

        {/* Section 3 */}
        <View style={styles.sectionCard}>
          <View style={styles.sectionHeader}>
            <FileText size={18} color="#F59E0B" />
            <Text style={styles.sectionTitle}>3. Cookie &amp; Platform Logs</Text>
          </View>
          <Text style={styles.bodyText}>
            We track crashes and UI load performance metrics (like transition speed, match success) to optimize app speed. We never sell your personal information or shared video templates to any third-party advertisers.
          </Text>
        </View>

        <Text style={styles.footerDate}>Last updated: May 19, 2026</Text>
        <View style={{ height: 40 }} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8FAFC' },
  scroll: { padding: 20 },
  
  header: {
    paddingTop: 55,
    paddingBottom: 30,
    paddingHorizontal: 24,
    borderBottomLeftRadius: 28,
    borderBottomRightRadius: 28,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  backBtn: {
    width: 38,
    height: 38,
    borderRadius: 12,
    backgroundColor: 'rgba(255,255,255,0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: { fontSize: 18, fontWeight: '900', color: '#FFF' },
  headerDesc: { fontSize: 13, color: 'rgba(255,255,255,0.85)', fontWeight: '600' },

  introCard: {
    backgroundColor: '#EDE7F6',
    borderRadius: 24,
    padding: 20,
    marginBottom: 20,
    borderWidth: 1.5,
    borderColor: '#D1C4E9',
  },
  introHeader: { flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 8 },
  introTitle: { fontSize: 15, fontWeight: '900', color: '#7C3AED' },
  introText: { fontSize: 12, color: '#5B21B6', lineHeight: 18, fontWeight: '600' },

  sectionCard: {
    backgroundColor: '#FFF',
    borderRadius: 24,
    padding: 20,
    marginBottom: 16,
    elevation: 2,
    shadowColor: '#7C3AED',
    shadowOpacity: 0.03,
    shadowRadius: 8,
    borderWidth: 1,
    borderColor: '#F1F5F9',
  },
  sectionHeader: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 12 },
  sectionTitle: { fontSize: 14, fontWeight: '900', color: '#1E293B' },
  bodyText: { fontSize: 12, color: '#475569', lineHeight: 20, fontWeight: '600', marginBottom: 12 },
  
  bulletRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 8, paddingLeft: 4 },
  bulletIcon: { marginRight: 8 },
  bulletText: { fontSize: 11, color: '#475569', fontWeight: '700' },

  footerDate: { textAlign: 'center', fontSize: 11, color: '#94A3B8', fontWeight: '800', marginTop: 12 }
});
