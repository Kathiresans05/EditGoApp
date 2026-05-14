import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput, Dimensions, Platform } from 'react-native';
import { 
  ChevronLeft, DollarSign, Clock, Zap, 
  Save, Edit3, Trash2, Plus, Info, TrendingUp
} from 'lucide-react-native';
import Animated, { FadeInUp, FadeInRight } from 'react-native-reanimated';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';

const { width } = Dimensions.get('window');

const initialCategories = [
  { id: '1', name: 'Insta Reels', basePrice: '79' },
  { id: '2', name: 'YT Shorts', basePrice: '149' },
  { id: '3', name: 'Cinematic', basePrice: '299' },
  { id: '4', name: 'Thumbnails', basePrice: '79' },
];

const initialSpeeds = [
  { id: 's1', name: 'Standard', time: '24-48 hrs', surcharge: '0' },
  { id: 's2', name: 'Turbo', time: '4-6 hrs', surcharge: '70' },
  { id: 's3', name: 'Zap', time: '45 mins', surcharge: '220' },
];

export default function PricingManagement() {
  const router = useRouter();
  const [categories, setCategories] = useState(initialCategories);
  const [speeds, setSpeeds] = useState(initialSpeeds);

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
          <Text style={styles.infoSub}>Prices are calculated as: [Base Category Price] + [Speed Surcharge]</Text>
        </LinearGradient>

        {/* Category Pricing */}
        <Text style={styles.sectionTitle}>Base Category Prices</Text>
        <View style={styles.listContainer}>
          {categories.map((item, index) => (
            <Animated.View key={item.id} entering={FadeInUp.delay(index * 100)} style={styles.priceItem}>
              <View style={styles.itemInfo}>
                <Text style={styles.itemName}>{item.name}</Text>
                <Text style={styles.itemSub}>Minimum entry price</Text>
              </View>
              <View style={styles.inputGroup}>
                <Text style={styles.currency}>₹</Text>
                <TextInput 
                  style={styles.priceInput}
                  value={item.basePrice}
                  keyboardType="numeric"
                  onChangeText={(val) => {
                    const newCats = [...categories];
                    newCats[index].basePrice = val;
                    setCategories(newCats);
                  }}
                />
              </View>
            </Animated.View>
          ))}
          <TouchableOpacity style={styles.addBtn}>
            <Plus size={18} color="#6366F1" />
            <Text style={styles.addBtnText}>Add New Category</Text>
          </TouchableOpacity>
        </View>

        {/* Speed Surcharges */}
        <Text style={styles.sectionTitle}>Delivery Surcharges</Text>
        <View style={styles.listContainer}>
          {speeds.map((item, index) => (
            <Animated.View key={item.id} entering={FadeInUp.delay(index * 100)} style={styles.priceItem}>
              <View style={styles.itemInfo}>
                <Text style={styles.itemName}>{item.name}</Text>
                <Text style={styles.itemSub}>{item.time}</Text>
              </View>
              <View style={styles.inputGroup}>
                <Text style={styles.currency}>+₹</Text>
                <TextInput 
                  style={styles.priceInput}
                  value={item.surcharge}
                  keyboardType="numeric"
                  onChangeText={(val) => {
                    const newSpeeds = [...speeds];
                    newSpeeds[index].surcharge = val;
                    setSpeeds(newSpeeds);
                  }}
                />
              </View>
            </Animated.View>
          ))}
        </View>

        <TouchableOpacity style={styles.saveBtn} activeOpacity={0.8}>
          <Save size={20} color="#FFF" />
          <Text style={styles.saveBtnText}>Update Marketplace Pricing</Text>
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
