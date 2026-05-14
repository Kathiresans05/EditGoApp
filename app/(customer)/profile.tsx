import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Switch, ActivityIndicator } from 'react-native';
import { User, Bell, Shield, CreditCard, HelpCircle, LogOut, ChevronRight, Star, Briefcase } from 'lucide-react-native';
import { GlassCard } from '../../src/components/ui/GlassCard';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import * as SecureStore from 'expo-secure-store';
import { authService } from '../../src/services/api';

export default function ProfileScreen() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProfile();
  }, []);

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
      router.push('/(editor)/requests');
    } else {
      router.push('/become-editor');
    }
  };

  const getInitials = (name: string) => {
    if (!name) return '??';
    return name.split(' ').map(n => n[0]).join('').toUpperCase().substring(0, 2);
  };

  const handleLogout = async () => {
    try {
      await SecureStore.deleteItemAsync('userToken');
      await SecureStore.setItemAsync('userRole', '');
      router.replace('/login');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  if (loading) {
    return (
      <View style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
        <ActivityIndicator size="large" color="#8B5CF6" />
      </View>
    );
  }

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <LinearGradient colors={['#8B5CF6', '#3B82F6']} style={styles.header}>
        <View style={styles.profileInfo}>
          <View style={styles.avatarContainer}>
            <View style={styles.avatar}>
              <Text style={styles.avatarText}>{getInitials(user?.name)}</Text>
            </View>
            <TouchableOpacity style={styles.editBadge}>
              <Text style={styles.editIcon}>✏️</Text>
            </TouchableOpacity>
          </View>
          <Text style={styles.name}>{user?.name || 'User'}</Text>
          <Text style={styles.email}>{user?.email || user?.phone}</Text>
        </View>

        <View style={styles.statsRow}>
          <View style={styles.statItem}>
            <Text style={styles.statValue}>24</Text>
            <Text style={styles.statLabel}>Orders</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <View style={styles.ratingRow}>
              <Text style={styles.statValue}>4.9</Text>
              <Star size={14} color="#FFD700" fill="#FFD700" style={{marginLeft: 4}} />
            </View>
            <Text style={styles.statLabel}>Avg. Rating</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <Text style={styles.statValue}>₹4.5k</Text>
            <Text style={styles.statLabel}>Spent</Text>
          </View>
        </View>
      </LinearGradient>

      <View style={styles.content}>
        <Text style={styles.sectionTitle}>Account Settings</Text>
        <GlassCard style={styles.menuCard}>
          <MenuLink 
            icon={<Briefcase size={20} color="#8B5CF6" />} 
            label="Switch to Editor Mode" 
            onPress={handleSwitchToEditor}
          />
          <MenuLink icon={<User size={20} color="#8B5CF6" />} label="Personal Information" />
          <MenuLink icon={<CreditCard size={20} color="#3B82F6" />} label="Payment Methods" />
          <MenuLink icon={<Bell size={20} color="#EC4899" />} label="Notifications" hasSwitch />
        </GlassCard>

        <Text style={styles.sectionTitle}>Support & Legal</Text>
        <GlassCard style={styles.menuCard}>
          <MenuLink icon={<HelpCircle size={20} color="#F59E0B" />} label="Help Center" />
          <MenuLink icon={<Shield size={20} color="#10B981" />} label="Privacy Policy" />
        </GlassCard>

        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <LogOut size={20} color="#EF4444" />
          <Text style={styles.logoutText}>Log Out</Text>
        </TouchableOpacity>
        
        <Text style={styles.version}>EditGo v1.0.2 (Beta)</Text>
      </View>
    </ScrollView>
  );
}

function MenuLink({ icon, label, onPress, hasSwitch = false }: { icon: React.ReactNode, label: string, onPress?: () => void, hasSwitch?: boolean }) {
  return (
    <TouchableOpacity style={styles.menuItem} onPress={onPress}>
      <View style={styles.menuLeft}>
        <View style={styles.menuIcon}>{icon}</View>
        <Text style={styles.menuLabel}>{label}</Text>
      </View>
      {hasSwitch ? (
        <Switch value={true} trackColor={{ false: '#CBD5E1', true: '#8B5CF6' }} thumbColor="#FFF" />
      ) : (
        <ChevronRight size={20} color="#CBD5E1" />
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8FAFC' },
  header: { paddingBottom: 40, borderBottomLeftRadius: 40, borderBottomRightRadius: 40 },
  profileInfo: { alignItems: 'center', paddingTop: 80, marginBottom: 30 },
  avatarContainer: { position: 'relative', marginBottom: 16 },
  avatar: { width: 100, height: 100, borderRadius: 50, backgroundColor: '#FFF', alignItems: 'center', justify: 'center', shadowColor: '#000', shadowOpacity: 0.1, shadowRadius: 10 },
  avatarText: { fontSize: 36, fontWeight: '800', color: '#8B5CF6' },
  editBadge: { position: 'absolute', bottom: 0, right: 0, backgroundColor: '#FFF', width: 32, height: 32, borderRadius: 16, alignItems: 'center', justify: 'center', shadowColor: '#000', shadowOpacity: 0.1, shadowRadius: 5 },
  editIcon: { fontSize: 16 },
  name: { fontSize: 24, fontWeight: '800', color: '#FFF' },
  email: { fontSize: 14, color: 'rgba(255, 255, 255, 0.8)', marginTop: 4 },
  statsRow: { flexDirection: 'row', justifyContent: 'center', alignItems: 'center' },
  statItem: { alignItems: 'center', paddingHorizontal: 20 },
  statValue: { fontSize: 18, fontWeight: '800', color: '#FFF' },
  statLabel: { fontSize: 11, color: 'rgba(255, 255, 255, 0.7)', marginTop: 4, textTransform: 'uppercase', letterSpacing: 0.5 },
  statDivider: { width: 1, height: 25, backgroundColor: 'rgba(255, 255, 255, 0.3)' },
  ratingRow: { flexDirection: 'row', alignItems: 'center' },
  content: { padding: 24, paddingBottom: 120 },
  sectionTitle: { fontSize: 18, fontWeight: '700', color: '#1E293B', marginTop: 24, marginBottom: 16 },
  menuCard: { padding: 8, backgroundColor: '#FFF' },
  menuItem: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: 12 },
  menuLeft: { flexDirection: 'row', alignItems: 'center' },
  menuIcon: { width: 40, height: 40, borderRadius: 12, backgroundColor: '#F1F5F9', alignItems: 'center', justify: 'center', marginRight: 16 },
  menuLabel: { fontSize: 15, fontWeight: '600', color: '#1E293B' },
  logoutButton: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', padding: 20, marginTop: 40 },
  logoutText: { color: '#EF4444', fontWeight: '700', fontSize: 16, marginLeft: 10 },
  version: { textAlign: 'center', color: '#94A3B8', fontSize: 12, marginTop: 20 }
});
