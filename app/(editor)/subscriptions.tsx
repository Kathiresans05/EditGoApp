import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, StatusBar } from 'react-native';
import { Check, Zap, Award, Crown, Shield } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { ArrowLeft } from 'lucide-react-native';

export default function SubscriptionsScreen() {
  const router = useRouter();
  
  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#4F46E5" />

      {/* Header */}
      <LinearGradient colors={['#4F46E5', '#7C3AED']} style={styles.header}>
        <View style={styles.headerRow}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
            <ArrowLeft size={22} color="#FFF" />
          </TouchableOpacity>
          <View style={styles.headerCenter}>
            <Text style={styles.title}>Go Pro</Text>
            <Text style={styles.subtitle}>Unlock unlimited orders &amp; higher visibility</Text>
          </View>
          <View style={{ width: 38 }} />
        </View>
      </LinearGradient>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scroll}>
        <PlanCard
          title="Free Plan"
          price="₹0"
          desc="Perfect for starting out as an editor"
          features={['2 Project Orders per day', 'Basic profile visibility', '20% Platform fee on payouts']}
          color="#64748B"
          bg="#F1F5F9"
          current
        />

        <PlanCard
          title="Pro Creator"
          price="₹499/mo"
          desc="Maximize your project earnings"
          features={['Unlimited Project Claims', 'Priority Creator Matchmaking', 'Reduced platform fee (15%)', 'Pro badge on client chat', 'Featured listing in Marketplace']}
          color="#4F46E5"
          bg="#EDE7F6"
          isPopular
          icon={<Award size={22} color="#FFF" />}
        />

        <PlanCard
          title="Elite Master"
          price="₹999/mo"
          desc="Uncapped workspace power"
          features={['Guaranteed top of search results', 'Lowest platform fee (10%)', 'Elite Master badge', 'Dedicated account manager', 'Early beta access to AI features']}
          color="#1E293B"
          bg="#E2E8F0"
          icon={<Crown size={22} color="#FFD700" />}
        />

        <View style={styles.trustBox}>
          <Shield size={18} color="#10B981" />
          <Text style={styles.trustText}>Secure checkout simulation. Cancel anytime.</Text>
        </View>

        <View style={{ height: 50 }} />
      </ScrollView>
    </View>
  );
}

function PlanCard({ title, price, desc, features, color, bg, isPopular, current, icon }: any) {
  return (
    <View style={[styles.card, current && styles.currentCard]}>
      {isPopular && (
        <View style={styles.popularBadge}>
          <Text style={styles.popularText}>BEST VALUE</Text>
        </View>
      )}

      <View style={styles.cardHeader}>
        <View style={[styles.iconBox, { backgroundColor: color }]}>
          {icon || <Zap size={22} color="#FFF" />}
        </View>
        <View style={{ flex: 1 }}>
          <Text style={styles.planTitle}>{title}</Text>
          <Text style={styles.planDesc}>{desc}</Text>
        </View>
        <Text style={[styles.planPrice, { color: color }]}>{price}</Text>
      </View>

      <View style={styles.divider} />

      <View style={styles.featureList}>
        {features.map((f: string, i: number) => (
          <View key={i} style={styles.featureRow}>
            <View style={[styles.checkCircle, { backgroundColor: bg }]}>
              <Check size={12} color={color} />
            </View>
            <Text style={styles.featureText}>{f}</Text>
          </View>
        ))}
      </View>

      <TouchableOpacity style={[styles.btn, { backgroundColor: color }]}>
        <Text style={styles.btnText}>{current ? 'Current Plan' : 'Upgrade Plan'}</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8FAFC' },
  scroll: { paddingBottom: 40, paddingTop: 20 },

  header: { paddingTop: 58, paddingHorizontal: 20, paddingBottom: 28, borderBottomLeftRadius: 28, borderBottomRightRadius: 28 },
  headerRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  backBtn: { width: 38, height: 38, borderRadius: 12, backgroundColor: 'rgba(255,255,255,0.2)', alignItems: 'center', justifyContent: 'center' },
  headerCenter: { alignItems: 'center', flex: 1 },
  title: { fontSize: 20, fontWeight: '900', color: '#FFF' },
  subtitle: { fontSize: 12, color: 'rgba(255,255,255,0.8)', fontWeight: '600', marginTop: 2, textAlign: 'center' },

  card: {
    backgroundColor: '#FFF', borderRadius: 24, padding: 20,
    marginHorizontal: 20, marginBottom: 20, elevation: 1,
    shadowColor: '#4F46E5', shadowOpacity: 0.04, shadowRadius: 8,
  },
  currentCard: { borderWidth: 1.5, borderColor: '#CBD5E1' },
  popularBadge: { position: 'absolute', top: -11, right: 24, backgroundColor: '#EF4444', paddingHorizontal: 12, paddingVertical: 4, borderRadius: 10 },
  popularText: { color: '#FFF', fontSize: 9, fontWeight: '900' },

  cardHeader: { flexDirection: 'row', alignItems: 'center' },
  iconBox: { width: 48, height: 48, borderRadius: 14, alignItems: 'center', justifyContent: 'center', marginRight: 12 },
  planTitle: { fontSize: 18, fontWeight: '900', color: '#1E293B' },
  planDesc: { fontSize: 11, color: '#94A3B8', fontWeight: '600', marginTop: 1 },
  planPrice: { fontSize: 18, fontWeight: '900' },

  divider: { height: 1, backgroundColor: '#F1F5F9', marginVertical: 18 },
  featureList: { gap: 12, marginBottom: 20 },
  featureRow: { flexDirection: 'row', alignItems: 'center' },
  checkCircle: { width: 22, height: 22, borderRadius: 11, alignItems: 'center', justifyContent: 'center', marginRight: 10 },
  featureText: { fontSize: 13, color: '#475569', fontWeight: '700', flex: 1 },

  btn: { paddingVertical: 15, borderRadius: 14, alignItems: 'center' },
  btnText: { color: '#FFF', fontWeight: '900', fontSize: 14 },

  trustBox: { flexDirection: 'row', justifyContent: 'center', alignItems: 'center', marginTop: 8, gap: 6 },
  trustText: { fontSize: 12, color: '#94A3B8', fontWeight: '800' }
});
