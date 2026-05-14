import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Platform } from 'react-native';
import { Users, Search, Filter, ShieldCheck, Mail, ChevronRight, Hash, Activity } from 'lucide-react-native';
import Animated, { FadeInUp } from 'react-native-reanimated';

import { adminService } from '../../src/services/api';
import { RefreshControl, ActivityIndicator } from 'react-native';

export default function UserManagement() {
  const [users, setUsers] = React.useState<any[]>([]);
  const [totalUsers, setTotalUsers] = React.useState(0);
  const [loading, setLoading] = React.useState(true);
  const [refreshing, setRefreshing] = React.useState(false);

  const fetchUsers = async () => {
    try {
      const data = await adminService.getUsers();
      setUsers(data.users);
      setTotalUsers(data.totalCount);
    } catch (error) {
      console.error('Error fetching users:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  React.useEffect(() => {
    fetchUsers();
  }, []);

  const onRefresh = () => {
    setRefreshing(true);
    fetchUsers();
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.tagRow}>
          <ShieldCheck size={10} color="#6366F1" />
          <Text style={styles.tagText}>IDENTITY INTELLIGENCE</Text>
        </View>
        <Text style={styles.title}>User <Text style={styles.highlight}>Management</Text></Text>
      </View>

      <ScrollView 
        showsVerticalScrollIndicator={false} 
        contentContainerStyle={styles.scrollContent}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
      >
        
        <View style={styles.statsRow}>
          <View style={styles.statBox}>
            <Text style={styles.statVal}>{totalUsers.toLocaleString()}</Text>
            <Text style={styles.statLab}>TOTAL CUSTOMERS</Text>
          </View>
          <View style={styles.statBox}>
            <Text style={[styles.statVal, { color: '#EF4444' }]}>0</Text>
            <Text style={styles.statLab}>FLAGGED ACCOUNTS</Text>
          </View>
        </View>

        <View style={styles.searchRow}>
          <View style={styles.searchBar}>
            <Search size={18} color="#94A3B8" />
            <Text style={styles.searchPlaceholder}>Search by name, email or ID...</Text>
          </View>
        </View>

        <Text style={styles.sectionTitle}>Recent Registrations</Text>
        {loading ? (
          <ActivityIndicator size="large" color="#6366F1" style={{ marginTop: 40 }} />
        ) : users.length > 0 ? users.map((user, i) => (
          <Animated.View key={user.id} entering={FadeInUp.delay(i * 100)} style={styles.userCard}>
            <View style={styles.cardTop}>
              <View style={styles.avatar}><Text style={styles.avatarText}>{user.name[0]}</Text></View>
              <View style={styles.userInfo}>
                <Text style={styles.userName}>{user.name}</Text>
                <Text style={styles.userEmail}>{user.email}</Text>
              </View>
              <View style={styles.planBox}>
                <View style={styles.planBadge}><Text style={styles.planText}>{user.plan.toUpperCase()}</Text></View>
              </View>
            </View>
            
            <View style={styles.cardFooter}>
              <View style={styles.spendingRow}>
                <Text style={styles.spendLabel}>VOLUME</Text>
                <Text style={styles.spendVal}>{user.spending}</Text>
              </View>
              <View style={styles.actions}>
                <TouchableOpacity style={styles.mailBtn}><Mail size={16} color="#6366F1" /></TouchableOpacity>
                <TouchableOpacity style={styles.profileBtn}>
                  <Text style={styles.profileBtnText}>VIEW PROFILE</Text>
                  <ChevronRight size={14} color="#6366F1" />
                </TouchableOpacity>
              </View>
            </View>
          </Animated.View>
        )) : (
          <Text style={styles.noDataText}>No users found</Text>
        )}

        <View style={{ height: 100 }} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FAFAFA' },
  header: { paddingHorizontal: 24, paddingTop: Platform.OS === 'ios' ? 70 : 50, paddingBottom: 24 },
  tagRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 4 },
  tagText: { fontSize: 10, fontWeight: '900', color: '#6366F1', letterSpacing: 2, marginLeft: 6 },
  title: { fontSize: 28, fontWeight: '900', color: '#0F172A', letterSpacing: -1 },
  highlight: { color: '#6366F1' },
  scrollContent: { paddingHorizontal: 20 },

  statsRow: { flexDirection: 'row', justifyContent: 'space-between', gap: 12, marginBottom: 32 },
  statBox: { flex: 1, backgroundColor: '#FFF', padding: 20, borderRadius: 28, borderWidth: 1, borderColor: '#F1F5F9', alignItems: 'center' },
  statVal: { fontSize: 24, fontWeight: '900', color: '#1E293B' },
  statLab: { fontSize: 8, fontWeight: '900', color: '#94A3B8', marginTop: 4, letterSpacing: 1 },

  searchBar: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#FFF', paddingHorizontal: 16, height: 50, borderRadius: 16, borderWidth: 1, borderColor: '#F1F5F9', marginBottom: 32 },
  searchPlaceholder: { fontSize: 12, color: '#94A3B8', marginLeft: 10, fontWeight: '600' },

  sectionTitle: { fontSize: 20, fontWeight: '900', color: '#0F172A', marginBottom: 20 },
  userCard: { backgroundColor: '#FFF', borderRadius: 28, padding: 20, borderWidth: 1, borderColor: '#F1F5F9', marginBottom: 16 },
  cardTop: { flexDirection: 'row', alignItems: 'center', marginBottom: 20 },
  avatar: { width: 48, height: 48, borderRadius: 16, backgroundColor: '#F8FAFC', alignItems: 'center', justifyContent: 'center', marginRight: 16, borderWidth: 1, borderColor: '#F1F5F9' },
  avatarText: { fontSize: 18, fontWeight: '900', color: '#64748B' },
  userInfo: { flex: 1 },
  userName: { fontSize: 15, fontWeight: '800', color: '#1E293B' },
  userEmail: { fontSize: 12, color: '#94A3B8', marginTop: 2 },
  planBox: { alignItems: 'flex-end' },
  planBadge: { backgroundColor: '#EEF2FF', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 8 },
  planText: { fontSize: 8, fontWeight: '900', color: '#6366F1', letterSpacing: 0.5 },

  cardFooter: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingTop: 16, borderTopWidth: 1, borderTopColor: '#F1F5F9' },
  spendingRow: { gap: 2 },
  spendLabel: { fontSize: 8, fontWeight: '900', color: '#94A3B8', letterSpacing: 1 },
  spendVal: { fontSize: 14, fontWeight: '900', color: '#0F172A' },
  actions: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  mailBtn: { width: 36, height: 36, borderRadius: 10, backgroundColor: '#F8FAFC', alignItems: 'center', justifyContent: 'center' },
  profileBtn: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  profileBtnText: { fontSize: 10, fontWeight: '900', color: '#6366F1' },
  noDataText: { fontSize: 14, color: '#94A3B8', textAlign: 'center', marginVertical: 40, fontWeight: '600' }
});

