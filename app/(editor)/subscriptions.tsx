import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { Check, Zap, Award, Crown, Shield } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { GlassCard } from '../../src/components/ui/GlassCard';

export default function SubscriptionsScreen() {
  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.header}>
        <Text style={styles.title}>Go Pro.</Text>
        <Text style={styles.subtitle}>Unlock more orders and higher visibility</Text>
      </View>

      <PlanCard 
        title="Free Plan" 
        price="₹0" 
        features={['2 Orders per day', 'Basic visibility', '20% Platform fee']} 
        color="#94A3B8"
        current
      />

      <PlanCard 
        title="Pro Creator" 
        price="₹499/mo" 
        features={['Unlimited Orders', 'Priority Matching', '15% Platform fee', 'Pro Badge', 'Featured Profile']} 
        color="#8B5CF6"
        isPopular
        icon={<Award size={24} color="#FFF" />}
      />

      <PlanCard 
        title="Elite Master" 
        price="₹999/mo" 
        features={['Top of Search Result', '10% Platform fee', 'Elite Badge', 'Dedicated Account Manager', 'Early access to AI tools']} 
        color="#1E293B"
        icon={<Crown size={24} color="#FFD700" />}
      />

      <View style={styles.trustBox}>
        <Shield size={20} color="#10B981" />
        <Text style={styles.trustText}>Secure payments by Razorpay. Cancel anytime.</Text>
      </View>

      <View style={{ height: 100 }} />
    </ScrollView>
  );
}

function PlanCard({ title, price, features, color, isPopular, current, icon }: any) {
  return (
    <GlassCard style={[styles.card, current && styles.currentCard]}>
      {isPopular && (
        <View style={styles.popularBadge}>
          <Text style={styles.popularText}>MOST POPULAR</Text>
        </View>
      )}
      <View style={styles.cardHeader}>
        <View style={[styles.iconBox, { backgroundColor: color }]}>
          {icon || <Zap size={24} color="#FFF" />}
        </View>
        <View>
          <Text style={styles.planTitle}>{title}</Text>
          <Text style={styles.planPrice}>{price}</Text>
        </View>
      </View>

      <View style={styles.divider} />

      {features.map((f: string, i: number) => (
        <View key={i} style={styles.featureRow}>
          <View style={[styles.checkCircle, { backgroundColor: color + '20' }]}>
            <Check size={12} color={color} />
          </View>
          <Text style={styles.featureText}>{f}</Text>
        </View>
      ))}

      <TouchableOpacity style={[styles.btn, { backgroundColor: color }]}>
        <Text style={styles.btnText}>{current ? 'Current Plan' : 'Upgrade Now'}</Text>
      </TouchableOpacity>
    </GlassCard>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8FAFC' },
  header: { paddingTop: 80, paddingHorizontal: 24, marginBottom: 32 },
  title: { fontSize: 32, fontWeight: '900', color: '#1E293B' },
  subtitle: { fontSize: 16, color: '#64748B', marginTop: 4 },
  card: { padding: 24, marginHorizontal: 24, marginBottom: 24, backgroundColor: '#FFF' },
  currentCard: { borderWidth: 2, borderColor: '#CBD5E1' },
  popularBadge: { position: 'absolute', top: -12, right: 24, backgroundColor: '#EC4899', paddingHorizontal: 12, paddingVertical: 4, borderRadius: 12 },
  popularText: { color: '#FFF', fontSize: 10, fontWeight: '800' },
  cardHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 24 },
  iconBox: { width: 56, height: 56, borderRadius: 16, alignItems: 'center', justifyContent: 'center', marginRight: 16 },
  planTitle: { fontSize: 20, fontWeight: '800', color: '#1E293B' },
  planPrice: { fontSize: 14, color: '#64748B', fontWeight: '600', marginTop: 2 },
  divider: { height: 1, backgroundColor: '#F1F5F9', marginBottom: 24 },
  featureRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 16 },
  checkCircle: { width: 20, height: 20, borderRadius: 10, alignItems: 'center', justifyContent: 'center', marginRight: 12 },
  featureText: { fontSize: 14, color: '#475569', fontWeight: '600' },
  btn: { paddingVertical: 14, borderRadius: 12, alignItems: 'center', marginTop: 12 },
  btnText: { color: '#FFF', fontWeight: '800', fontSize: 15 },
  trustBox: { flexDirection: 'row', justifyContent: 'center', alignItems: 'center', marginTop: 16 },
  trustText: { fontSize: 12, color: '#94A3B8', marginLeft: 8 }
});
