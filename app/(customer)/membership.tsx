import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, StatusBar } from 'react-native';
import { Check, Sparkles, Crown, Zap, ShieldCheck } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';

export default function MembershipScreen() {
  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#7C3AED" />

      {/* Header */}
      <LinearGradient colors={['#7C3AED', '#5B21B6']} style={styles.header}>
        <Text style={styles.title}>Creator Tiers</Text>
        <Text style={styles.subtitle}>Unlock elite video editing &amp; speed upgrades</Text>
      </LinearGradient>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scroll}>
        <PlanCard
          title="Creator Free"
          price="₹0"
          desc="Perfect for trying out EditGo"
          features={['Standard Delivery (24-48h)', '1 Active Project Order', 'Basic Studio Features']}
          color="#64748B"
          bg="#F1F5F9"
          current
        />

        <PlanCard
          title="Creator Plus"
          price="₹299/mo"
          desc="Best for active content creators"
          features={['Priority Editor Matching', 'Fast Delivery (4h-12h)', 'Premium AI Audio & Style Studio', '5 Active Project Orders', 'HD Master Exports']}
          color="#7C3AED"
          bg="#EDE7F6"
          isPopular
          icon={<Sparkles size={22} color="#FFF" />}
        />

        <PlanCard
          title="Elite Creator"
          price="₹999/mo"
          desc="Uncapped power for top influencers"
          features={['Dedicated Premium Pro Editors', 'Guaranteed Instant Delivery (45m)', 'Unlimited Concurrent Projects', 'VIP 24/7 Priority Support', 'Zero Commission Processing Fees']}
          color="#1E293B"
          bg="#E2E8F0"
          icon={<Crown size={22} color="#FFD700" />}
        />

        <View style={styles.trustBox}>
          <ShieldCheck size={18} color="#10B981" />
          <Text style={styles.trustText}>Trusted by 10,000+ influencers worldwide</Text>
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
        <Text style={styles.btnText}>{current ? 'Current Active Plan' : 'Upgrade Plan'}</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8FAFC' },
  scroll: { paddingBottom: 40, paddingTop: 20 },

  header: { paddingTop: 58, paddingHorizontal: 24, paddingBottom: 28, borderBottomLeftRadius: 28, borderBottomRightRadius: 28 },
  title: { fontSize: 24, fontWeight: '900', color: '#FFF' },
  subtitle: { fontSize: 13, color: 'rgba(255,255,255,0.85)', marginTop: 4, fontWeight: '600' },

  card: {
    backgroundColor: '#FFF', borderRadius: 24, padding: 20,
    marginHorizontal: 20, marginBottom: 20, elevation: 1,
    shadowColor: '#7C3AED', shadowOpacity: 0.04, shadowRadius: 8,
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
