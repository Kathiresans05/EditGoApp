import React, { useState } from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity,
  Switch, ActivityIndicator, Alert, StatusBar,
} from 'react-native';
import {
  User, Bell, Shield, CreditCard, HelpCircle,
  LogOut, ChevronRight, Star, Briefcase, Gift,
  AlertTriangle, Lock, ShoppingCart,
} from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter, useFocusEffect } from 'expo-router';
import * as SecureStore from 'expo-secure-store';
import { authService } from '../../src/services/api';
import Animated, { FadeInUp } from 'react-native-reanimated';

const STAT_COLORS = [
  { bg: '#EDE7F6', text: '#7C3AED' },
  { bg: '#FFF3E0', text: '#FB8C00' },
  { bg: '#E8F5E9', text: '#2E7D32' },
];

export default function ProfileScreen() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useFocusEffect(
    React.useCallback(() => {
      fetchProfile();
    }, [])
  );

  const fetchProfile = async () => {
    try {
      const userData = await authService.getMe();
      setUser(userData);
    } catch (error) {
      console.error('Error fetching profile:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSwitchToEditor = async () => {
    if (user?.role === 'EDITOR') {
      await SecureStore.setItemAsync('userRole', 'EDITOR');
      router.push('/(editor)/dashboard');
    } else {
      router.push('/become-editor');
    }
  };

  const getInitials = (name: string) => {
    const validName = name || 'User';
    return validName.split(' ').filter((n: string) => n).map((n: string) => n[0]).join('').toUpperCase().substring(0, 2);
  };

  const handleLogout = async () => {
    Alert.alert('Log Out', 'Are you sure you want to log out?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Log Out', style: 'destructive', onPress: async () => {
          await SecureStore.deleteItemAsync('userToken');
          await SecureStore.setItemAsync('userRole', '');
          router.replace('/login');
        }
      }
    ]);
  };

  if (loading) return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#F8FAFC' }}>
      <ActivityIndicator size="large" color="#7C3AED" />
    </View>
  );

  const stats = [
    { label: 'Orders', value: user?.stats?.totalOrders || 0 },
    { label: 'Completed', value: user?.stats?.completedOrders || 0 },
    { label: 'Spent', value: `₹${((user?.stats?.totalSpent || 0) / 1000).toFixed(1)}k` },
  ];

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <StatusBar barStyle="light-content" backgroundColor="#7C3AED" />

      {/* ── HEADER ── */}
      <LinearGradient colors={['#7C3AED', '#5B21B6']} style={styles.header}>
        <View style={styles.avatarWrap}>
          <View style={styles.avatarCircle}>
            <Text style={styles.avatarText}>{getInitials(user?.name)}</Text>
          </View>
          <TouchableOpacity style={styles.editBtn} onPress={() => router.push('/(customer)/personal-info')}>
            <Text style={styles.editBtnText}>✏️</Text>
          </TouchableOpacity>
        </View>
        <Text style={styles.name}>{user?.name || 'Creator'}</Text>
        <Text style={styles.email}>{user?.email || user?.phone}</Text>

        {/* Stats row */}
        <View style={styles.statsRow}>
          {stats.map((s, i) => (
            <View key={i} style={styles.statItem}>
              <Text style={styles.statValue}>{s.value}</Text>
              <Text style={styles.statLabel}>{s.label}</Text>
            </View>
          ))}
        </View>
      </LinearGradient>

      <View style={styles.body}>

        {/* ── STAT CARDS ── */}
        <Animated.View entering={FadeInUp.delay(100)} style={styles.statCardsRow}>
          {[
            { label: 'Total Orders', value: user?.stats?.totalOrders || 0, palette: STAT_COLORS[0] },
            { label: 'Reviews Given', value: user?.stats?.reviewsGiven || 0, palette: STAT_COLORS[1] },
            { label: 'Total Spent', value: `₹${((user?.stats?.totalSpent || 0) / 1000).toFixed(1)}k`, palette: STAT_COLORS[2] },
          ].map((card, i) => (
            <View key={i} style={[styles.miniCard, { backgroundColor: card.palette.bg }]}>
              <Text style={[styles.miniValue, { color: card.palette.text }]}>{card.value}</Text>
              <Text style={styles.miniLabel}>{card.label}</Text>
            </View>
          ))}
        </Animated.View>

        {/* ── ACCOUNT ── */}
        <Text style={styles.sectionTitle}>Account</Text>
        <Animated.View entering={FadeInUp.delay(150)} style={styles.menuCard}>
          <MenuLink
            icon={<Briefcase size={18} color="#7C3AED" />}
            iconBg="#EDE7F6"
            label="Switch to Editor Mode"
            onPress={handleSwitchToEditor}
          />
          <View style={styles.divider} />
          <MenuLink
            icon={<User size={18} color="#1E88E5" />}
            iconBg="#E3F2FD"
            label="Personal Information"
            onPress={() => router.push('/(customer)/personal-info')}
          />
          <View style={styles.divider} />
          <MenuLink
            icon={<CreditCard size={18} color="#FB8C00" />}
            iconBg="#FFF3E0"
            label="Payment Methods"
            onPress={() => router.push('/(customer)/payment-methods')}
          />
          <View style={styles.divider} />
          <MenuLink
            icon={<ShoppingCart size={18} color="#2E7D32" />}
            iconBg="#E8F5E9"
            label="Order History"
            onPress={() => router.push('/(customer)/profile-orders')}
          />
          <View style={styles.divider} />
          <MenuLink
            icon={<Bell size={18} color="#E91E63" />}
            iconBg="#FCE4EC"
            label="Notifications"
            hasSwitch
          />
        </Animated.View>

        {/* ── REFERRAL CARD ── */}
        <Text style={styles.sectionTitle}>Invite & Earn</Text>
        <Animated.View entering={FadeInUp.delay(200)}>
          <LinearGradient colors={['#7C3AED', '#5B21B6']} style={styles.referCard}>
            <View style={styles.referLeft}>
              <Gift size={28} color="#FFF" />
              <View style={{ marginLeft: 12 }}>
                <Text style={styles.referTitle}>Invite Friends & Get ₹{user?.settings?.REFERRAL_REWARD || '20'}</Text>
                <Text style={styles.referSub}>Share your code to earn credits</Text>
              </View>
            </View>
            <View style={styles.codeRow}>
              <Text style={styles.referCode}>{user?.referralCode || 'EG-USER'}</Text>
              <TouchableOpacity
                style={styles.copyBtn}
                onPress={() => Alert.alert('Copied!', 'Referral code copied to clipboard.')}
              >
                <Text style={styles.copyText}>COPY</Text>
              </TouchableOpacity>
            </View>
          </LinearGradient>
        </Animated.View>

        {/* ── SUPPORT ── */}
        <Text style={styles.sectionTitle}>Support</Text>
        <Animated.View entering={FadeInUp.delay(250)} style={styles.menuCard}>
          <MenuLink
            icon={<HelpCircle size={18} color="#FB8C00" />}
            iconBg="#FFF3E0"
            label="Help Center"
            onPress={() => router.push('/(customer)/help-center')}
          />
          <View style={styles.divider} />
          <MenuLink
            icon={<Shield size={18} color="#10B981" />}
            iconBg="#E8F5E9"
            label="Privacy Policy"
            onPress={() => router.push('/(customer)/privacy-policy')}
          />
          <View style={styles.divider} />
          <MenuLink
            icon={<Lock size={18} color="#4F46E5" />}
            iconBg="#EDE7F6"
            label="Privacy Settings"
            onPress={() => router.push('/(customer)/privacy-settings')}
          />
          <View style={styles.divider} />
          <MenuLink
            icon={<AlertTriangle size={18} color="#EF4444" />}
            iconBg="#FEF2F2"
            label="Report an Issue"
            onPress={() => router.push('/(customer)/report-issue')}
          />
        </Animated.View>

        {/* ── LOGOUT ── */}
        <TouchableOpacity style={styles.logoutBtn} onPress={handleLogout}>
          <LogOut size={18} color="#EF4444" />
          <Text style={styles.logoutText}>Log Out</Text>
        </TouchableOpacity>
        <Text style={styles.version}>EditGo v1.0.2 · Beta</Text>
      </View>
    </ScrollView>
  );
}

function MenuLink({
  icon, iconBg, label, onPress, hasSwitch = false
}: { icon: React.ReactNode; iconBg: string; label: string; onPress?: () => void; hasSwitch?: boolean }) {
  return (
    <TouchableOpacity style={styles.menuItem} onPress={onPress} activeOpacity={0.7}>
      <View style={styles.menuLeft}>
        <View style={[styles.menuIconWrap, { backgroundColor: iconBg }]}>{icon}</View>
        <Text style={styles.menuLabel}>{label}</Text>
      </View>
      {hasSwitch
        ? <Switch value={true} trackColor={{ false: '#CBD5E1', true: '#7C3AED' }} thumbColor="#FFF" />
        : <ChevronRight size={18} color="#CBD5E1" />
      }
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8FAFC' },

  header: {
    paddingTop: 60, paddingBottom: 32, alignItems: 'center',
    borderBottomLeftRadius: 36, borderBottomRightRadius: 36,
  },
  avatarWrap: { position: 'relative', marginBottom: 12 },
  avatarCircle: {
    width: 90, height: 90, borderRadius: 45,
    backgroundColor: 'rgba(255,255,255,0.25)',
    alignItems: 'center', justifyContent: 'center',
    borderWidth: 3, borderColor: 'rgba(255,255,255,0.5)',
  },
  avatarText: { fontSize: 32, fontWeight: '900', color: '#FFF' },
  editBtn: {
    position: 'absolute', bottom: 0, right: 0,
    backgroundColor: '#FFF', width: 30, height: 30,
    borderRadius: 15, alignItems: 'center', justifyContent: 'center',
    elevation: 4,
  },
  editBtnText: { fontSize: 14 },
  name: { fontSize: 22, fontWeight: '900', color: '#FFF', marginBottom: 4 },
  email: { fontSize: 13, color: 'rgba(255,255,255,0.75)', fontWeight: '600', marginBottom: 20 },
  statsRow: { flexDirection: 'row', width: '100%', justifyContent: 'center', gap: 0 },
  statItem: { flex: 1, alignItems: 'center', paddingVertical: 10, borderRightWidth: 1, borderRightColor: 'rgba(255,255,255,0.2)' },
  statValue: { fontSize: 17, fontWeight: '900', color: '#FFF' },
  statLabel: { fontSize: 10, color: 'rgba(255,255,255,0.7)', fontWeight: '700', marginTop: 2, textTransform: 'uppercase' },

  body: { padding: 20, paddingBottom: 120 },

  statCardsRow: { flexDirection: 'row', gap: 10, marginBottom: 24, marginTop: 8 },
  miniCard: { flex: 1, borderRadius: 16, padding: 12, alignItems: 'center' },
  miniValue: { fontSize: 16, fontWeight: '900' },
  miniLabel: { fontSize: 10, color: '#64748B', fontWeight: '700', marginTop: 2, textAlign: 'center' },

  sectionTitle: { fontSize: 16, fontWeight: '900', color: '#1E293B', marginBottom: 12, marginTop: 8 },
  menuCard: { backgroundColor: '#FFF', borderRadius: 20, overflow: 'hidden', marginBottom: 20, elevation: 2, shadowColor: '#7C3AED', shadowOpacity: 0.05, shadowRadius: 8 },
  menuItem: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: 16 },
  menuLeft: { flexDirection: 'row', alignItems: 'center' },
  menuIconWrap: { width: 38, height: 38, borderRadius: 12, alignItems: 'center', justifyContent: 'center', marginRight: 14 },
  menuLabel: { fontSize: 14, fontWeight: '700', color: '#1E293B' },
  divider: { height: 1, backgroundColor: '#F1F5F9', marginHorizontal: 16 },

  referCard: { borderRadius: 20, padding: 18, marginBottom: 20 },
  referLeft: { flexDirection: 'row', alignItems: 'center', marginBottom: 14 },
  referTitle: { fontSize: 15, fontWeight: '900', color: '#FFF' },
  referSub: { fontSize: 12, color: 'rgba(255,255,255,0.75)', marginTop: 2, fontWeight: '600' },
  codeRow: { flexDirection: 'row', alignItems: 'center', backgroundColor: 'rgba(255,255,255,0.15)', borderRadius: 14, padding: 12, justifyContent: 'space-between' },
  referCode: { color: '#FFF', fontSize: 17, fontWeight: '900', letterSpacing: 1.5 },
  copyBtn: { backgroundColor: '#FFF', paddingHorizontal: 14, paddingVertical: 6, borderRadius: 10 },
  copyText: { color: '#7C3AED', fontSize: 11, fontWeight: '900' },

  logoutBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', paddingVertical: 16, marginTop: 8 },
  logoutText: { color: '#EF4444', fontWeight: '800', fontSize: 15, marginLeft: 8 },
  version: { textAlign: 'center', color: '#CBD5E1', fontSize: 11, marginTop: 4 },
});
