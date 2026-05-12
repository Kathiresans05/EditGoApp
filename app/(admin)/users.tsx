import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput } from 'react-native';
import { Users, Search, Filter, Ban, ShieldCheck, Mail } from 'lucide-react-native';
import { GlassCard } from '../../src/components/ui/GlassCard';

export default function UserManagement() {
  const users = [
    { name: 'Rahul Sharma', email: 'rahul@gmail.com', type: 'Customer', status: 'Active' },
    { name: 'Priya Singh', email: 'priya@gmail.com', type: 'Influencer', status: 'Active' },
    { name: 'Vikas J.', email: 'vikas@gmail.com', type: 'Business', status: 'Banned', color: '#EF4444' },
  ];

  return (
    <View style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.content}>
        <Text style={styles.title}>User Management</Text>
        
        <View style={styles.searchBar}>
          <Search size={20} color="#94A3B8" />
          <TextInput placeholder="Search users by name or email..." style={styles.input} />
        </View>

        <View style={styles.statsRow}>
          <GlassCard style={styles.statBox}>
            <Text style={styles.statVal}>3,842</Text>
            <Text style={styles.statLab}>Total Users</Text>
          </GlassCard>
          <GlassCard style={styles.statBox}>
            <Text style={[styles.statVal, { color: '#EF4444' }]}>12</Text>
            <Text style={styles.statLab}>Suspended</Text>
          </GlassCard>
        </View>

        <Text style={styles.sectionTitle}>Recent Signups</Text>
        {users.map((user, i) => (
          <GlassCard key={i} style={styles.userCard}>
            <View style={styles.userLeft}>
              <View style={styles.avatar}><Text style={styles.avatarText}>{user.name[0]}</Text></View>
              <View>
                <Text style={styles.userName}>{user.name}</Text>
                <Text style={styles.userEmail}>{user.email}</Text>
              </View>
            </View>
            <View style={styles.userRight}>
              <View style={[styles.badge, { backgroundColor: user.color || '#F1F5F9' }]}>
                <Text style={[styles.badgeText, { color: user.color ? '#FFF' : '#64748B' }]}>{user.status}</Text>
              </View>
              <TouchableOpacity><Ban size={18} color="#94A3B8" /></TouchableOpacity>
            </View>
          </GlassCard>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8FAFC' },
  content: { padding: 24, paddingTop: 60, paddingBottom: 100 },
  title: { fontSize: 28, fontWeight: '900', color: '#1E293B', marginBottom: 20 },
  searchBar: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#FFF', paddingHorizontal: 16, height: 50, borderRadius: 15, marginBottom: 20, elevation: 2 },
  input: { flex: 1, marginLeft: 10, fontSize: 14 },
  statsRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 30 },
  statBox: { width: '48%', padding: 16, alignItems: 'center' },
  statVal: { fontSize: 20, fontWeight: '900', color: '#1E293B' },
  statLab: { fontSize: 12, color: '#64748B', marginTop: 4 },
  sectionTitle: { fontSize: 18, fontWeight: '800', color: '#1E293B', marginBottom: 16 },
  userCard: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 16, marginBottom: 12 },
  userLeft: { flexDirection: 'row', alignItems: 'center' },
  avatar: { width: 40, height: 40, borderRadius: 20, backgroundColor: '#F1F5F9', alignItems: 'center', justifyContent: 'center', marginRight: 12 },
  avatarText: { fontWeight: '800', color: '#64748B' },
  userName: { fontSize: 15, fontWeight: '700', color: '#1E293B' },
  userEmail: { fontSize: 12, color: '#64748B', marginTop: 2 },
  userRight: { flexDirection: 'row', alignItems: 'center' },
  badge: { paddingHorizontal: 8, paddingVertical: 4, borderRadius: 8, marginRight: 12 },
  badgeText: { fontSize: 10, fontWeight: '900' }
});
