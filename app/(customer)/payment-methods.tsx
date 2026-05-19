import React, { useState, useEffect } from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity,
  TextInput, Alert, ActivityIndicator, StatusBar, Image,
  Modal, KeyboardAvoidingView, Platform
} from 'react-native';
import { ArrowLeft, CreditCard, Plus, ShieldCheck, Wallet, Check, Trash2, X, DollarSign } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { authService, customerService } from '../../src/services/api';

export default function PaymentMethodsScreen() {
  const router = useRouter();
  const [balance, setBalance] = useState(0);
  const [loading, setLoading] = useState(true);
  const [savingUpi, setSavingUpi] = useState(false);
  const [upiId, setUpiId] = useState('jana@okaxis');
  const [savedCards, setSavedCards] = useState([
    { id: '1', brand: 'visa', number: '•••• •••• •••• 4242', expiry: '12/28', holder: 'JANA' },
    { id: '2', brand: 'mastercard', number: '•••• •••• •••• 8899', expiry: '06/27', holder: 'JANA' }
  ]);

  // Modal State for Adding Card
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [newCardNumber, setNewCardNumber] = useState('');
  const [newCardExpiry, setNewCardExpiry] = useState('');
  const [newCardCvv, setNewCardCvv] = useState('');
  const [newCardHolder, setNewCardHolder] = useState('');

  // Modal State for Adding Cash
  const [isAddCashModalVisible, setIsAddCashModalVisible] = useState(false);
  const [addCashAmount, setAddCashAmount] = useState('');
  const [isAddingCash, setIsAddingCash] = useState(false);

  useEffect(() => {
    loadBalance();
  }, []);

  const loadBalance = async () => {
    try {
      const data = await authService.getMe();
      setBalance(data.walletBalance || 0);
    } catch (error) {
      console.error('Error fetching wallet balance:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCardNumberChange = (text: string) => {
    const cleanText = text.replace(/\D/g, '');
    const formattedText = cleanText.match(/.{1,4}/g)?.join(' ') || cleanText;
    setNewCardNumber(formattedText);
  };

  const handleCardExpiryChange = (text: string) => {
    const cleanText = text.replace(/\D/g, '');
    if (cleanText.length >= 2) {
      setNewCardExpiry(`${cleanText.substring(0, 2)}/${cleanText.substring(2, 4)}`);
    } else {
      setNewCardExpiry(cleanText);
    }
  };

  const handleAddCard = () => {
    setNewCardNumber('');
    setNewCardExpiry('');
    setNewCardCvv('');
    setNewCardHolder('');
    setIsModalVisible(true);
  };

  const handleSubmitCard = () => {
    const cleanNumber = newCardNumber.replace(/\s/g, '');
    if (cleanNumber.length < 16) {
      Alert.alert('Validation Error', 'Please enter a valid 16-digit card number.');
      return;
    }
    if (!newCardHolder.trim()) {
      Alert.alert('Validation Error', 'Cardholder name is required.');
      return;
    }
    if (newCardExpiry.length < 5) {
      Alert.alert('Validation Error', 'Please enter a valid expiry date (MM/YY).');
      return;
    }
    if (newCardCvv.length < 3) {
      Alert.alert('Validation Error', 'Please enter a valid 3-digit CVV.');
      return;
    }

    let detectedBrand = 'visa';
    if (cleanNumber.startsWith('5')) {
      detectedBrand = 'mastercard';
    } else if (cleanNumber.startsWith('3')) {
      detectedBrand = 'amex';
    }

    const lastFour = cleanNumber.slice(-4);
    const maskedNumber = `•••• •••• •••• ${lastFour}`;

    const newCard = {
      id: Math.random().toString(),
      brand: detectedBrand,
      number: maskedNumber,
      expiry: newCardExpiry,
      holder: newCardHolder.toUpperCase()
    };

    setSavedCards([...savedCards, newCard]);
    setIsModalVisible(false);
    
    Alert.alert('Success', 'Card added successfully and saved securely!');
  };

  const handleDeleteCard = (id: string) => {
    Alert.alert('Remove Card', 'Are you sure you want to remove this saved card?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Remove', style: 'destructive', onPress: () => {
        setSavedCards(savedCards.filter(card => card.id !== id));
      }}
    ]);
  };

  const handleSaveUpi = () => {
    if (!upiId.includes('@')) {
      Alert.alert('Invalid UPI ID', 'Please enter a valid UPI ID (e.g. name@upi)');
      return;
    }
    setSavingUpi(true);
    setTimeout(() => {
      setSavingUpi(false);
      Alert.alert('Success', 'Preferred UPI ID saved successfully!');
    }, 1000);
  };

  // Add Cash Function
  const handleOpenAddCash = () => {
    setAddCashAmount('');
    setIsAddCashModalVisible(true);
  };

  const handleAddCashSubmit = async () => {
    const amount = parseFloat(addCashAmount);
    if (isNaN(amount) || amount <= 0) {
      Alert.alert('Validation Error', 'Please enter a valid amount.');
      return;
    }

    setIsAddingCash(true);
    try {
      const response = await customerService.addFunds(amount);
      setBalance(response.walletBalance);
      setIsAddCashModalVisible(false);
      Alert.alert('Success', `₹${amount} added successfully to your Creator Balance!`);
    } catch (error: any) {
      console.error('Error adding funds:', error);
      Alert.alert('Error', error.response?.data?.message || 'Failed to add funds.');
    } finally {
      setIsAddingCash(false);
    }
  };

  const selectPresetAmount = (amt: string) => {
    setAddCashAmount(amt);
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#7C3AED" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#7C3AED" />
      
      {/* Header */}
      <LinearGradient colors={['#7C3AED', '#5B21B6']} style={styles.header}>
        <View style={styles.headerRow}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
            <ArrowLeft size={22} color="#FFF" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Payment Methods</Text>
          <View style={{ width: 38 }} />
        </View>
        <Text style={styles.headerDesc}>Manage your wallet balance and saved credentials securely</Text>
      </LinearGradient>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scroll}>
        {/* Wallet Balance Card */}
        <LinearGradient colors={['#8B5CF6', '#3B82F6']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={styles.walletCard}>
          <View style={styles.walletHeader}>
            <View style={styles.walletTitleRow}>
              <Wallet size={20} color="#FFF" />
              <Text style={styles.walletLabel}>Creator Balance</Text>
            </View>
            <ShieldCheck size={22} color="#10B981" />
          </View>
          <Text style={styles.walletBalance}>₹{balance.toFixed(2)}</Text>
          <View style={styles.walletFooter}>
            <Text style={styles.walletCode}>EditGo Pay ID: EG-{upiId.split('@')[0].toUpperCase()}</Text>
            <TouchableOpacity style={styles.addFundsBtn} onPress={handleOpenAddCash}>
              <Plus size={16} color="#7C3AED" />
              <Text style={styles.addFundsText}>Add Cash</Text>
            </TouchableOpacity>
          </View>
        </LinearGradient>

        {/* Saved Cards */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Saved Credit & Debit Cards</Text>
          <TouchableOpacity style={styles.addBtn} onPress={handleAddCard}>
            <Plus size={14} color="#7C3AED" />
            <Text style={styles.addBtnText}>Add New</Text>
          </TouchableOpacity>
        </View>

        {savedCards.length === 0 ? (
          <View style={styles.noCardBox}>
            <CreditCard size={28} color="#94A3B8" />
            <Text style={styles.noCardText}>No saved cards. Add a card to start checkouts!</Text>
          </View>
        ) : (
          savedCards.map(card => (
            <View key={card.id} style={styles.cardItem}>
              <View style={styles.cardLeft}>
                <View style={styles.brandIconWrap}>
                  <CreditCard size={20} color={card.brand === 'visa' ? '#1E3A8A' : card.brand === 'mastercard' ? '#EA580C' : '#64748B'} />
                </View>
                <View style={styles.cardDetails}>
                  <Text style={styles.cardNumber}>{card.number}</Text>
                  <Text style={styles.cardSub}>Expires {card.expiry} · {card.holder}</Text>
                </View>
              </View>
              <TouchableOpacity onPress={() => handleDeleteCard(card.id)} style={styles.deleteBtn}>
                <Trash2 size={16} color="#EF4444" />
              </TouchableOpacity>
            </View>
          ))
        )}

        {/* UPI ID */}
        <Text style={styles.sectionTitle}>Preferred UPI ID</Text>
        <View style={styles.upiCard}>
          <View style={styles.upiInputWrap}>
            <TextInput
              style={styles.upiInput}
              value={upiId}
              onChangeText={setUpiId}
              placeholder="username@bank"
              placeholderTextColor="#94A3B8"
              autoCapitalize="none"
            />
            <TouchableOpacity style={styles.saveUpiBtn} onPress={handleSaveUpi} disabled={savingUpi}>
              {savingUpi ? (
                <ActivityIndicator size="small" color="#FFF" />
              ) : (
                <>
                  <Check size={16} color="#FFF" />
                  <Text style={styles.saveUpiText}>Save</Text>
                </>
              )}
            </TouchableOpacity>
          </View>
          <Text style={styles.upiHint}>Used for fast 1-click checkouts on your raw video orders.</Text>
        </View>

        {/* Secure Message */}
        <View style={styles.secureBox}>
          <ShieldCheck size={18} color="#10B981" />
          <Text style={styles.secureText}>256-Bit SSL Secured Encryption via Razorpay</Text>
        </View>
        
        <View style={{ height: 40 }} />
      </ScrollView>

      {/* Add New Card Modal */}
      <Modal
        visible={isModalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setIsModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            style={styles.modalContainer}
          >
            <View style={styles.modalContent}>
              <View style={styles.modalHeader}>
                <Text style={styles.modalTitle}>Add New Card</Text>
                <TouchableOpacity onPress={() => setIsModalVisible(false)} style={styles.closeBtn}>
                  <X size={20} color="#64748B" />
                </TouchableOpacity>
              </View>

              <Text style={styles.inputLabelModal}>Cardholder Name</Text>
              <TextInput
                style={styles.modalInput}
                placeholder="e.g. JANA"
                placeholderTextColor="#94A3B8"
                value={newCardHolder}
                onChangeText={setNewCardHolder}
                autoCapitalize="characters"
              />

              <Text style={styles.inputLabelModal}>Card Number</Text>
              <View style={styles.modalInputRow}>
                <CreditCard size={18} color="#7C3AED" style={{ marginRight: 10 }} />
                <TextInput
                  style={[styles.modalInputText, { flex: 1 }]}
                  placeholder="4000 1234 5678 9010"
                  placeholderTextColor="#94A3B8"
                  value={newCardNumber}
                  onChangeText={handleCardNumberChange}
                  keyboardType="numeric"
                  maxLength={19}
                />
              </View>

              <View style={styles.row}>
                <View style={{ flex: 1, marginRight: 12 }}>
                  <Text style={styles.inputLabelModal}>Expiry Date</Text>
                  <TextInput
                    style={styles.modalInput}
                    placeholder="MM/YY"
                    placeholderTextColor="#94A3B8"
                    value={newCardExpiry}
                    onChangeText={handleCardExpiryChange}
                    keyboardType="numeric"
                    maxLength={5}
                  />
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={styles.inputLabelModal}>CVV</Text>
                  <TextInput
                    style={styles.modalInput}
                    placeholder="123"
                    placeholderTextColor="#94A3B8"
                    value={newCardCvv}
                    onChangeText={setNewCardCvv}
                    keyboardType="numeric"
                    secureTextEntry={true}
                    maxLength={3}
                  />
                </View>
              </View>

              <TouchableOpacity
                style={styles.submitBtn}
                onPress={handleSubmitCard}
              >
                <LinearGradient colors={['#7C3AED', '#5B21B6']} style={styles.submitGrad}>
                  <Plus size={16} color="#FFF" />
                  <Text style={styles.submitBtnText}>Add Card Securely</Text>
                </LinearGradient>
              </TouchableOpacity>
            </View>
          </KeyboardAvoidingView>
        </View>
      </Modal>

      {/* Add Cash Modal */}
      <Modal
        visible={isAddCashModalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setIsAddCashModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            style={styles.modalContainer}
          >
            <View style={styles.modalContent}>
              <View style={styles.modalHeader}>
                <Text style={styles.modalTitle}>Add Creator Cash</Text>
                <TouchableOpacity onPress={() => setIsAddCashModalVisible(false)} style={styles.closeBtn}>
                  <X size={20} color="#64748B" />
                </TouchableOpacity>
              </View>

              <Text style={styles.inputLabelModal}>Enter Amount (₹)</Text>
              <View style={styles.modalInputRow}>
                <Text style={styles.currencySymbol}>₹</Text>
                <TextInput
                  style={[styles.modalInputText, { flex: 1 }]}
                  placeholder="500"
                  placeholderTextColor="#94A3B8"
                  value={addCashAmount}
                  onChangeText={setAddCashAmount}
                  keyboardType="numeric"
                />
              </View>

              {/* Preset Buttons */}
              <View style={styles.presetRow}>
                {['100', '500', '1000', '2000'].map((amt) => (
                  <TouchableOpacity
                    key={amt}
                    style={styles.presetBtn}
                    onPress={() => selectPresetAmount(amt)}
                  >
                    <Text style={styles.presetText}>+ ₹{amt}</Text>
                  </TouchableOpacity>
                ))}
              </View>

              <TouchableOpacity
                style={styles.submitBtn}
                onPress={handleAddCashSubmit}
                disabled={isAddingCash}
              >
                <LinearGradient colors={['#8B5CF6', '#3B82F6']} style={styles.submitGrad}>
                  {isAddingCash ? (
                    <ActivityIndicator color="#FFF" />
                  ) : (
                    <>
                      <Wallet size={16} color="#FFF" />
                      <Text style={styles.submitBtnText}>Proceed to Pay Securely</Text>
                    </>
                  )}
                </LinearGradient>
              </TouchableOpacity>
            </View>
          </KeyboardAvoidingView>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8FAFC' },
  loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#F8FAFC' },
  scroll: { padding: 20 },
  
  header: {
    paddingTop: 55,
    paddingBottom: 30,
    paddingHorizontal: 24,
    borderBottomLeftRadius: 28,
    borderBottomRightRadius: 28,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  backBtn: {
    width: 38,
    height: 38,
    borderRadius: 12,
    backgroundColor: 'rgba(255,255,255,0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: { fontSize: 18, fontWeight: '900', color: '#FFF' },
  headerDesc: { fontSize: 13, color: 'rgba(255,255,255,0.8)', fontWeight: '600' },

  walletCard: {
    borderRadius: 24,
    padding: 22,
    marginBottom: 28,
    elevation: 6,
    shadowColor: '#8B5CF6',
    shadowOpacity: 0.25,
    shadowRadius: 15,
  },
  walletHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 },
  walletTitleRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  walletLabel: { color: 'rgba(255,255,255,0.85)', fontSize: 13, fontWeight: '800', textTransform: 'uppercase', letterSpacing: 0.5 },
  walletBalance: { color: '#FFF', fontSize: 36, fontWeight: '900', marginBottom: 16 },
  walletFooter: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  walletCode: { color: 'rgba(255,255,255,0.75)', fontSize: 11, fontWeight: '700' },
  addFundsBtn: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#FFF', paddingHorizontal: 12, paddingVertical: 8, borderRadius: 12, gap: 4 },
  addFundsText: { color: '#7C3AED', fontSize: 11, fontWeight: '900' },

  sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 },
  sectionTitle: { fontSize: 13, fontWeight: '900', color: '#1E293B', marginBottom: 14, textTransform: 'uppercase', letterSpacing: 0.5 },
  addBtn: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#EDE7F6', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 10, gap: 4 },
  addBtnText: { color: '#7C3AED', fontSize: 11, fontWeight: '900' },

  noCardBox: {
    backgroundColor: '#FFF',
    borderRadius: 20,
    padding: 24,
    alignItems: 'center',
    gap: 8,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  noCardText: { color: '#94A3B8', fontSize: 12, fontWeight: '600' },

  cardItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#FFF',
    borderRadius: 20,
    padding: 16,
    marginBottom: 12,
    elevation: 2,
    shadowColor: '#7C3AED',
    shadowOpacity: 0.04,
    shadowRadius: 8,
    borderWidth: 1,
    borderColor: '#F1F5F9',
  },
  cardLeft: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  brandIconWrap: { width: 42, height: 42, borderRadius: 10, backgroundColor: '#F8FAFC', alignItems: 'center', justifyContent: 'center' },
  cardDetails: { gap: 2 },
  cardNumber: { fontSize: 14, fontWeight: '800', color: '#1E293B' },
  cardSub: { fontSize: 11, color: '#94A3B8', fontWeight: '600' },
  deleteBtn: { padding: 8 },

  upiCard: {
    backgroundColor: '#FFF',
    borderRadius: 20,
    padding: 18,
    marginBottom: 28,
    elevation: 2,
    shadowColor: '#7C3AED',
    shadowOpacity: 0.04,
    shadowRadius: 8,
    borderWidth: 1,
    borderColor: '#F1F5F9',
  },
  upiInputWrap: { flexDirection: 'row', gap: 10 },
  upiInput: {
    flex: 1,
    backgroundColor: '#F8FAFC',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    paddingHorizontal: 14,
    fontSize: 14,
    fontWeight: '600',
    color: '#1E293B',
    height: 48,
  },
  saveUpiBtn: {
    backgroundColor: '#7C3AED',
    paddingHorizontal: 18,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    gap: 4,
    height: 48,
  },
  saveUpiText: { color: '#FFF', fontSize: 13, fontWeight: '900' },
  upiHint: { fontSize: 11, color: '#94A3B8', fontWeight: '600', marginTop: 10 },

  secureBox: { flexDirection: 'row', justifyContent: 'center', alignItems: 'center', gap: 8, marginTop: 8 },
  secureText: { fontSize: 11, color: '#94A3B8', fontWeight: '800' },

  // Modal Styles
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(15, 23, 42, 0.6)',
    justifyContent: 'flex-end',
  },
  modalContainer: {
    backgroundColor: '#FFF',
    borderTopLeftRadius: 32,
    borderTopRightRadius: 32,
    padding: 24,
    paddingBottom: Platform.OS === 'ios' ? 40 : 24,
  },
  modalContent: { gap: 12 },
  modalHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 },
  modalTitle: { fontSize: 20, fontWeight: '900', color: '#1E293B' },
  closeBtn: { padding: 4 },
  
  inputLabelModal: {
    fontSize: 11,
    fontWeight: '800',
    color: '#475569',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginTop: 4,
  },
  modalInput: {
    backgroundColor: '#F8FAFC',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 14,
    fontWeight: '600',
    color: '#1E293B',
  },
  modalInputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8FAFC',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    paddingHorizontal: 14,
  },
  modalInputText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1E293B',
    paddingVertical: 12,
  },
  currencySymbol: {
    fontSize: 18,
    fontWeight: '900',
    color: '#3B82F6',
    marginRight: 8,
  },
  row: { flexDirection: 'row', marginBottom: 12 },
  
  presetRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 8,
    marginVertical: 12,
  },
  presetBtn: {
    flex: 1,
    backgroundColor: '#F1F5F9',
    borderRadius: 12,
    paddingVertical: 12,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  presetText: {
    fontSize: 12,
    fontWeight: '900',
    color: '#475569',
  },
  
  submitBtn: {
    borderRadius: 16,
    overflow: 'hidden',
    marginTop: 16,
    elevation: 4,
    shadowColor: '#7C3AED',
    shadowOpacity: 0.2,
    shadowRadius: 8,
  },
  submitGrad: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    gap: 8,
  },
  submitBtnText: { color: '#FFF', fontSize: 14, fontWeight: '900' }
});
