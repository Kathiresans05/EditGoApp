import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image } from 'react-native';
import { Star, Shield, Award, Clock, Settings, LogOut, ChevronRight } from 'lucide-react-native';
import { GlassCard } from '../../src/components/ui/GlassCard';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import * as SecureStore from 'expo-secure-store';

export default function EditorProfile() {
  const router = useRouter();
  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.header}>
        <View style={styles.profileBox}>
          <View style={styles.avatarContainer}>
            <View style={styles.avatar}><Text style={styles.avatarText}>AK</Text></View>
            <View style={styles.badge}><Award size={16} color="#FFF" /></View>
          </View>
          <Text style={styles.name}>Arjun Kumar</Text>
          <View style={styles.levelRow}>
            <Text style={styles.levelLabel}>MASTER EDITOR</Text>
            <View style={styles.verifiedBadge}>
              <Shield size={10} color="#FFF" fill="#FFF" />
              <Text style={styles.verifiedText}>PREMIUM</Text>
            </View>
          </View>
        </View>

        <View style={styles.badgesRow}>
          <Badge icon="⚡" label="Fast Delivery" color="#F59E0B" />
          <Badge icon="🎬" label="Cinematic Expert" color="#8B5CF6" />
          <Badge icon="🎮" label="Gaming Pro" color="#3B82F6" />
        </View>

        <View style={styles.ratingBar}>
          <View style={styles.ratingItem}>
            <Text style={styles.ratingVal}>4.92</Text>
            <View style={styles.stars}>
              {[1,2,3,4,5].map(i => <Star key={i} size={10} color="#F59E0B" fill="#F59E0B" />)}
            </View>
            <Text style={styles.ratingLabel}>Overall Rating</Text>
          </View>
          <View style={styles.divider} />
          <View style={styles.ratingItem}>
            <Text style={styles.ratingVal}>1,242</Text>
            <Text style={styles.ratingLabel}>Total Edits</Text>
          </View>
        </View>
      </View>


      <View style={styles.content}>
        <Text style={styles.sectionTitle}>Editor Portfolio</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.portfolioScroll}>
          <PortfolioItem title="Cinematic Reel" color="#8B5CF6" />
          <PortfolioItem title="Gaming Montage" color="#3B82F6" />
          <PortfolioItem title="AI Style Edit" color="#EC4899" />
        </ScrollView>

        <Text style={styles.sectionTitle}>Performance Breakdown</Text>
        <GlassCard style={styles.menuCard}>
          <PerformanceItem icon={<Clock size={20} color="#8B5CF6" />} label="Average Delivery" value="1.5 Hours" />
          <PerformanceItem icon={<Star size={20} color="#F59E0B" />} label="Review Accuracy" value="4.8/5" />
          <PerformanceItem icon={<Shield size={20} color="#10B981" />} label="Completion Rate" value="98.5%" />
        </GlassCard>

        <TouchableOpacity style={styles.settingsBtn}>
          <Settings size={20} color="#64748B" />
          <Text style={styles.settingsText}>Account Settings</Text>
          <ChevronRight size={20} color="#CBD5E1" />
        </TouchableOpacity>

        <TouchableOpacity 
          style={styles.logoutBtn} 
          onPress={async () => {
            await SecureStore.deleteItemAsync('userToken');
            await SecureStore.setItemAsync('userRole', '');
            router.replace('/login');
          }}
        >
          <LogOut size={20} color="#EF4444" />
          <Text style={styles.logoutText}>Log Out & Exit</Text>
        </TouchableOpacity>
      </View>

      <View style={{ height: 120 }} />
    </ScrollView>
  );
}

function Badge({ icon, label, color }: any) {
  return (
    <View style={[styles.badgeItem, { borderColor: color + '40' }]}>
      <Text style={styles.badgeIcon}>{icon}</Text>
      <Text style={[styles.badgeLabel, { color: color }]}>{label}</Text>
    </View>
  );
}

function PortfolioItem({ title, color }: any) {
  return (
    <TouchableOpacity style={[styles.pItem, {backgroundColor: color}]}>
      <Text style={styles.pText}>{title}</Text>
    </TouchableOpacity>
  );
}

function PerformanceItem({ icon, label, value }: any) {
  return (
    <View style={styles.perfItem}>
      <View style={styles.perfLeft}>
        <View style={styles.perfIcon}>{icon}</View>
        <Text style={styles.perfLabel}>{label}</Text>
      </View>
      <Text style={styles.perfValue}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8FAFC' },
  header: { paddingTop: 80, alignItems: 'center', backgroundColor: '#FFF', paddingBottom: 32, borderBottomLeftRadius: 40, borderBottomRightRadius: 40 },
  profileBox: { alignItems: 'center', marginBottom: 20 },
  avatarContainer: { position: 'relative' },
  avatar: { width: 90, height: 90, borderRadius: 45, backgroundColor: '#F5F3FF', alignItems: 'center', justifyContent: 'center' },
  avatarText: { fontSize: 32, fontWeight: '800', color: '#8B5CF6' },
  badge: { position: 'absolute', bottom: 0, right: 0, backgroundColor: '#8B5CF6', padding: 6, borderRadius: 12, borderWidth: 3, borderColor: '#FFF' },
  name: { fontSize: 22, fontWeight: '800', color: '#1E293B', marginTop: 16 },
  levelRow: { flexDirection: 'row', alignItems: 'center', marginTop: 8 },
  levelLabel: { fontSize: 12, fontWeight: '900', color: '#8B5CF6', letterSpacing: 1 },
  verifiedBadge: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#10B981', paddingHorizontal: 8, paddingVertical: 2, borderRadius: 6, marginLeft: 8 },
  verifiedText: { color: '#FFF', fontSize: 10, fontWeight: '800', marginLeft: 4 },
  badgesRow: { flexDirection: 'row', marginBottom: 24 },
  badgeItem: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 20, borderWidth: 1, backgroundColor: '#FFF', marginHorizontal: 4 },
  badgeIcon: { fontSize: 14 },
  badgeLabel: { fontSize: 11, fontWeight: '700', marginLeft: 6 },
  ratingBar: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#F8FAFC', paddingVertical: 16, paddingHorizontal: 32, borderRadius: 20 },
  ratingItem: { alignItems: 'center', paddingHorizontal: 20 },
  ratingVal: { fontSize: 18, fontWeight: '800', color: '#1E293B' },
  stars: { flexDirection: 'row', marginTop: 4 },
  ratingLabel: { fontSize: 10, color: '#94A3B8', marginTop: 4, textTransform: 'uppercase' },
  divider: { width: 1, height: 30, backgroundColor: '#E2E8F0' },
  content: { padding: 24 },
  sectionTitle: { fontSize: 18, fontWeight: '800', color: '#1E293B', marginTop: 24, marginBottom: 16 },
  portfolioScroll: { marginBottom: 8 },
  pItem: { width: 140, height: 180, borderRadius: 20, padding: 16, justifyContent: 'flex-end', marginRight: 12 },
  pText: { color: '#FFF', fontWeight: '800', fontSize: 14 },
  menuCard: { padding: 8, backgroundColor: '#FFF' },
  perfItem: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 12 },
  perfLeft: { flexDirection: 'row', alignItems: 'center' },
  perfIcon: { width: 40, height: 40, borderRadius: 12, backgroundColor: '#F1F5F9', alignItems: 'center', justifyContent: 'center', marginRight: 16 },
  perfLabel: { fontSize: 15, fontWeight: '600', color: '#1E293B' },
  perfValue: { fontSize: 14, fontWeight: '700', color: '#8B5CF6' },
  settingsBtn: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#FFF', padding: 16, borderRadius: 20, marginTop: 24 },
  settingsText: { flex: 1, fontSize: 15, fontWeight: '600', color: '#1E293B', marginLeft: 12 },
  logoutBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', padding: 20, marginTop: 32 },
  logoutText: { color: '#EF4444', fontWeight: '700', fontSize: 16, marginLeft: 10 }
});
