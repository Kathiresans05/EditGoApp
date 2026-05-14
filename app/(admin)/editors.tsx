import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Platform } from 'react-native';
import { Users, ShieldCheck, Star, Award, Search, Filter, ChevronRight, Zap } from 'lucide-react-native';
import Animated, { FadeInUp } from 'react-native-reanimated';

import { adminService } from '../../src/services/api';
import { RefreshControl, ActivityIndicator } from 'react-native';

export default function EditorManagement() {
  const [editors, setEditors] = React.useState<any[]>([]);
  const [totalEditors, setTotalEditors] = React.useState(0);
  const [loading, setLoading] = React.useState(true);
  const [refreshing, setRefreshing] = React.useState(false);

  const fetchEditors = async () => {
    try {
      const data = await adminService.getEditors();
      setEditors(data.editors);
      setTotalEditors(data.totalCount);
    } catch (error) {
      console.error('Error fetching editors:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  React.useEffect(() => {
    fetchEditors();
  }, []);

  const onRefresh = () => {
    setRefreshing(true);
    fetchEditors();
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.tagRow}>
          <Award size={10} color="#6366F1" />
          <Text style={styles.tagText}>TALENT INTELLIGENCE</Text>
        </View>
        <Text style={styles.title}>Creator <Text style={styles.highlight}>Network</Text></Text>
      </View>

      <ScrollView 
        showsVerticalScrollIndicator={false} 
        contentContainerStyle={styles.scrollContent}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
      >
        
        <View style={styles.statsRow}>
          <View style={styles.statBox}>
            <Text style={styles.statVal}>{totalEditors.toLocaleString()}</Text>
            <Text style={styles.statLab}>TOTAL EDITORS</Text>
          </View>
          <View style={styles.statBox}>
            <Text style={[styles.statVal, { color: '#10B981' }]}>0</Text>
            <Text style={styles.statLab}>IN VERIFICATION</Text>
          </View>
        </View>

        <View style={styles.searchRow}>
          <View style={styles.searchBar}>
            <Search size={18} color="#94A3B8" />
            <Text style={styles.searchPlaceholder}>Search by name or skill...</Text>
          </View>
        </View>

        <Text style={styles.sectionTitle}>Top Performers</Text>
        {loading ? (
          <ActivityIndicator size="large" color="#6366F1" style={{ marginTop: 40 }} />
        ) : editors.length > 0 ? editors.map((editor, i) => (
          <Animated.View key={editor.id} entering={FadeInUp.delay(i * 100)} style={styles.editorCard}>
            <View style={styles.cardTop}>
              <View style={styles.avatar}><Text style={styles.avatarText}>{editor.name[0]}</Text></View>
              <View style={styles.editorInfo}>
                <Text style={styles.editorName}>{editor.name}</Text>
                <View style={styles.badgeRow}>
                  <View style={styles.levelBadge}><Text style={styles.levelText}>{editor.level}</Text></View>
                  <View style={styles.ratingBox}><Star size={10} color="#F59E0B" fill="#F59E0B" /><Text style={styles.ratingText}>{editor.rating}</Text></View>
                </View>
              </View>
              <View style={styles.earningsBox}>
                <Text style={styles.earnLabel}>LIFETIME</Text>
                <Text style={styles.earnVal}>{editor.earnings}</Text>
              </View>
            </View>
            <View style={styles.cardFooter}>
              <View style={styles.statusRow}>
                <View style={[styles.statusDot, { backgroundColor: editor.status === 'Online' ? '#10B981' : '#CBD5E1' }]} />
                <Text style={styles.statusText}>{editor.status.toUpperCase()}</Text>
              </View>
              <TouchableOpacity style={styles.profileBtn}>
                <Text style={styles.profileBtnText}>VIEW PORTFOLIO</Text>
                <ChevronRight size={14} color="#6366F1" />
              </TouchableOpacity>
            </View>
          </Animated.View>
        )) : (
          <Text style={styles.noDataText}>No editors found</Text>
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

  searchRow: { marginBottom: 32 },
  searchBar: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#FFF', paddingHorizontal: 16, height: 50, borderRadius: 16, borderWidth: 1, borderColor: '#F1F5F9' },
  searchPlaceholder: { fontSize: 12, color: '#94A3B8', marginLeft: 10, fontWeight: '600' },

  sectionTitle: { fontSize: 20, fontWeight: '900', color: '#0F172A', marginBottom: 20 },
  editorCard: { backgroundColor: '#FFF', borderRadius: 28, padding: 20, borderWidth: 1, borderColor: '#F1F5F9', marginBottom: 16 },
  cardTop: { flexDirection: 'row', alignItems: 'center', marginBottom: 20 },
  avatar: { width: 52, height: 52, borderRadius: 18, backgroundColor: '#EEF2FF', alignItems: 'center', justifyContent: 'center', marginRight: 16 },
  avatarText: { fontSize: 20, fontWeight: '900', color: '#6366F1' },
  editorInfo: { flex: 1 },
  editorName: { fontSize: 16, fontWeight: '800', color: '#1E293B' },
  badgeRow: { flexDirection: 'row', alignItems: 'center', gap: 8, marginTop: 4 },
  levelBadge: { backgroundColor: '#F1F5F9', paddingHorizontal: 8, paddingVertical: 2, borderRadius: 6 },
  levelText: { fontSize: 9, fontWeight: '900', color: '#64748B' },
  ratingBox: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  ratingText: { fontSize: 11, fontWeight: '800', color: '#1E293B' },
  earningsBox: { alignItems: 'flex-end' },
  earnLabel: { fontSize: 8, fontWeight: '900', color: '#94A3B8', letterSpacing: 1 },
  earnVal: { fontSize: 14, fontWeight: '900', color: '#10B981' },

  cardFooter: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingTop: 16, borderTopWidth: 1, borderTopColor: '#F1F5F9' },
  statusRow: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  statusDot: { width: 8, height: 8, borderRadius: 4 },
  statusText: { fontSize: 9, fontWeight: '900', color: '#94A3B8', letterSpacing: 1 },
  profileBtn: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  profileBtnText: { fontSize: 10, fontWeight: '900', color: '#6366F1' },
  noDataText: { fontSize: 14, color: '#94A3B8', textAlign: 'center', marginVertical: 40, fontWeight: '600' }
});
