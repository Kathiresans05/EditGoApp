import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput, Dimensions, Platform, ActivityIndicator, Alert } from 'react-native';
import { 
  ChevronLeft, DollarSign, Clock, Zap, 
  Save, Edit3, Trash2, Plus, Info, TrendingUp
} from 'lucide-react-native';
import Animated, { FadeInUp, FadeInRight } from 'react-native-reanimated';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { pricingService } from '../../src/services/api';

const { width } = Dimensions.get('window');

export default function PricingManagement() {
  const router = useRouter();
  const [configs, setConfigs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchConfigs();
  }, []);

  const EXPECTED_CATEGORIES = [
    'Insta Reels (0-30s)', 'Insta Reels (30-60s)', 'Insta Reels (1-2m)', 'Insta Reels (2-3m)',
    'YT Shorts (0-30s)', 'YT Shorts (30-60s)', 'YT Shorts (1-2m)', 'YT Shorts (2-3m)',
    'Cinematic (0-2m)', 'Cinematic (2-5m)', 'Cinematic (5-10m)', 'Cinematic (10-15m)', 'Cinematic (15-20m)',
    'AI Style (0-30s)', 'AI Style (30s-2m)', 'AI Style (2-4m)', 'AI Style (4-5m)',
    'Slow Motion (0-30s)', 'Slow Motion (30-60s)', 'Slow Motion (1-2m)', 'Slow Motion (2-3m)',
    'Thumbnails'
  ];

  const fetchConfigs = async () => {
    try {
      const res = await pricingService.getConfigs();
      let dbConfigs = res.success && res.data ? res.data : [];
      
      // Ensure all expected categories exist in the UI even if not in DB yet
      const mergedConfigs = EXPECTED_CATEGORIES.map(catName => {
        const existing = dbConfigs.find((c: any) => c.category === catName);
        if (existing) return existing;
        
        let targetSecs = 30;
        if (catName.includes('(30-60s)')) targetSecs = 60;
        else if (catName.includes('(1-2m)') || catName.includes('(0-2m)')) targetSecs = 120;
        else if (catName.includes('(2-3m)')) targetSecs = 180;
        else if (catName.includes('(2-5m)')) targetSecs = 300;
        else if (catName.includes('(5-10m)')) targetSecs = 600;
        else if (catName.includes('(10-15m)')) targetSecs = 900;
        else if (catName.includes('(15-20m)')) targetSecs = 1200;
        else if (catName.includes('(30s-2m)')) targetSecs = 120;
        else if (catName.includes('(2-4m)')) targetSecs = 240;
        else if (catName.includes('(4-5m)')) targetSecs = 300;
        
        return {
          category: catName,
          basePrice: 40,
          targetPrice: 69,
          targetSeconds: targetSecs,
          baseDeliveryMins: 30,
          targetDeliveryMins: 55
        };
      });
      
      setConfigs(mergedConfigs);
    } catch (e) {
      console.error(e);
      Alert.alert('Error', 'Failed to fetch pricing config');
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      for (const conf of configs) {
        await pricingService.updateConfig(conf);
      }
      Alert.alert('Success', 'Marketplace Pricing updated successfully!');
    } catch (e) {
      console.error(e);
      Alert.alert('Error', 'Failed to update pricing');
    } finally {
      setSaving(false);
    }
  };

  const updateConfigVal = (index: number, field: string, val: string) => {
    const newConfigs = [...configs];
    newConfigs[index][field] = Number(val) || 0;
    setConfigs(newConfigs);
  };

  if (loading) return <View style={{ flex: 1, justifyContent: 'center' }}><ActivityIndicator size="large" color="#6366F1" /></View>;

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <ChevronLeft size={24} color="#0F172A" />
        </TouchableOpacity>
        <View>
          <View style={styles.tagRow}>
            <DollarSign size={10} color="#6366F1" />
            <Text style={styles.tagText}>FINANCIAL REVENUE</Text>
          </View>
          <Text style={styles.title}>Pricing <Text style={styles.highlight}>Console</Text></Text>
        </View>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        
        {/* Revenue Info */}
        <LinearGradient colors={['#6366F1', '#8B5CF6']} style={styles.infoCard}>
          <View style={styles.infoTop}>
            <TrendingUp size={20} color="#FFF" />
            <Text style={styles.infoTitle}>Marketplace Yield</Text>
          </View>
          <Text style={styles.infoValue}>Dynamic Pricing Active</Text>
          <Text style={styles.infoSub}>Rates per second are auto-calculated from targets.</Text>
        </LinearGradient>

        {configs.map((config, index) => (
          <Animated.View key={index} entering={FadeInUp.delay(index * 100)}>
            <Text style={styles.sectionTitle}>{config.category} Formula</Text>
            <View style={styles.listContainer}>
              
              <View style={styles.priceItem}>
                <View style={styles.itemInfo}>
                  <Text style={styles.itemName}>Base Price</Text>
                  <Text style={styles.itemSub}>Minimum starting cost</Text>
                </View>
                <View style={styles.inputGroup}>
                  <Text style={styles.currency}>₹</Text>
                  <TextInput 
                    style={styles.priceInput} value={String(config.basePrice)} keyboardType="numeric"
                    onChangeText={(v) => updateConfigVal(index, 'basePrice', v)}
                  />
                </View>
              </View>

              <View style={styles.priceItem}>
                <View style={styles.itemInfo}>
                  <Text style={styles.itemName}>Target Price</Text>
                  <Text style={styles.itemSub}>For {config.targetSeconds} seconds</Text>
                </View>
                <View style={styles.inputGroup}>
                  <Text style={styles.currency}>₹</Text>
                  <TextInput 
                    style={styles.priceInput} value={String(config.targetPrice)} keyboardType="numeric"
                    onChangeText={(v) => updateConfigVal(index, 'targetPrice', v)}
                  />
                </View>
              </View>

              <View style={styles.priceItem}>
                <View style={styles.itemInfo}>
                  <Text style={styles.itemName}>Base Delivery Mins</Text>
                  <Text style={styles.itemSub}>Fixed extra time</Text>
                </View>
                <View style={styles.inputGroup}>
                  <Text style={styles.currency}>+</Text>
                  <TextInput 
                    style={styles.priceInput} value={String(config.baseDeliveryMins)} keyboardType="numeric"
                    onChangeText={(v) => updateConfigVal(index, 'baseDeliveryMins', v)}
                  />
                </View>
              </View>

              <View style={[styles.priceItem, { borderBottomWidth: 0 }]}>
                <View style={styles.itemInfo}>
                  <Text style={styles.itemName}>Target Delivery</Text>
                  <Text style={styles.itemSub}>Total mins for {config.targetSeconds} seconds</Text>
                </View>
                <View style={styles.inputGroup}>
                  <Text style={styles.currency}></Text>
                  <TextInput 
                    style={styles.priceInput} value={String(config.targetDeliveryMins)} keyboardType="numeric"
                    onChangeText={(v) => updateConfigVal(index, 'targetDeliveryMins', v)}
                  />
                </View>
              </View>

            </View>
          </Animated.View>
        ))}

        <TouchableOpacity style={styles.saveBtn} activeOpacity={0.8} onPress={handleSave} disabled={saving}>
          {saving ? <ActivityIndicator color="#FFF" /> : <Save size={20} color="#FFF" />}
          <Text style={styles.saveBtnText}>{saving ? 'Saving...' : 'Update Marketplace Pricing'}</Text>
        </TouchableOpacity>

        <View style={{ height: 40 }} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FAFAFA' },
  header: { paddingHorizontal: 20, paddingTop: Platform.OS === 'ios' ? 60 : 40, paddingBottom: 20, flexDirection: 'row', alignItems: 'center' },
  backBtn: { width: 44, height: 44, borderRadius: 14, backgroundColor: '#FFF', alignItems: 'center', justifyContent: 'center', marginRight: 16, borderWidth: 1, borderColor: '#F1F5F9' },
  tagRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 4 },
  tagText: { fontSize: 10, fontWeight: '900', color: '#6366F1', letterSpacing: 2, marginLeft: 6 },
  title: { fontSize: 24, fontWeight: '900', color: '#0F172A', letterSpacing: -0.5 },
  highlight: { color: '#6366F1' },
  scrollContent: { padding: 20 },

  infoCard: { padding: 20, borderRadius: 28, marginBottom: 32 },
  infoTop: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 12 },
  infoTitle: { color: 'rgba(255,255,255,0.8)', fontSize: 11, fontWeight: '900', letterSpacing: 1.5 },
  infoValue: { color: '#FFF', fontSize: 22, fontWeight: '900', marginBottom: 4 },
  infoSub: { color: 'rgba(255,255,255,0.7)', fontSize: 12, fontWeight: '600' },

  sectionTitle: { fontSize: 20, fontWeight: '900', color: '#0F172A', marginBottom: 16 },
  listContainer: { backgroundColor: '#FFF', borderRadius: 32, padding: 16, borderWidth: 1, borderColor: '#F1F5F9', marginBottom: 32 },
  priceItem: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 16, borderBottomWidth: 1, borderBottomColor: '#F8FAFC' },
  itemInfo: { flex: 1 },
  itemName: { fontSize: 15, fontWeight: '800', color: '#1E293B' },
  itemSub: { fontSize: 11, fontWeight: '600', color: '#94A3B8', marginTop: 2 },
  inputGroup: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#F8FAFC', paddingHorizontal: 12, paddingVertical: 8, borderRadius: 12, borderWidth: 1, borderColor: '#F1F5F9' },
  currency: { fontSize: 14, fontWeight: '900', color: '#6366F1', marginRight: 4 },
  priceInput: { fontSize: 15, fontWeight: '900', color: '#1E293B', width: 60, textAlign: 'right' },
  addBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', paddingVertical: 16, gap: 8 },
  addBtnText: { fontSize: 13, fontWeight: '800', color: '#6366F1' },

  saveBtn: { backgroundColor: '#6366F1', flexDirection: 'row', alignItems: 'center', justifyContent: 'center', paddingVertical: 18, borderRadius: 24, gap: 12 },
  saveBtnText: { color: '#FFF', fontSize: 16, fontWeight: '900' }
});
