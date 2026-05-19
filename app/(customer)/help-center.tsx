import React, { useState } from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity,
  TextInput, Alert, StatusBar, LayoutAnimation, Platform, UIManager
} from 'react-native';
import { ArrowLeft, Search, HelpCircle, MessageSquare, Mail, Phone, ChevronDown, ChevronUp, AlertCircle } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';

if (Platform.OS === 'android') {
  if (UIManager.setLayoutAnimationEnabledExperimental) {
    UIManager.setLayoutAnimationEnabledExperimental(true);
  }
}

export default function HelpCenterScreen() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedFaq, setExpandedFaq] = useState<string | null>(null);

  const faqs = [
    {
      id: '1',
      question: 'How fast is Turbo and Zap Delivery?',
      answer: 'Standard delivery takes 24-48 hours. Turbo Delivery guarantees video delivery in 4-12 hours, and Zap Delivery completes matching and editing within 45 minutes to 2 hours!'
    },
    {
      id: '2',
      question: 'Can I request revisions for my video?',
      answer: 'Yes! All plans include free revisions. If you need color adjustments, cut changes, or text corrections, you can request them directly from the Editor matching tracker screen.'
    },
    {
      id: '3',
      question: 'How do I add funds to my Creator Balance?',
      answer: 'Go to Profile -> Payment Methods -> Add Cash. You can add funds using secure UPI (GPay/PhonePe), Debit/Credit Cards, or Netbanking via Razorpay.'
    },
    {
      id: '4',
      question: 'Is my raw footage secure on EditGo?',
      answer: 'Absolutely. We use 256-bit encrypted secure cloud servers to host and transfer your raw footage. Only your assigned matched editor has encrypted access to work on your file.'
    },
    {
      id: '5',
      question: 'How do I upgrade to Creator Plus or Elite Creator?',
      answer: 'Open the App homepage or go to Profile -> Creator Tiers (Membership) to explore features and instantly activate your preferred membership tier!'
    }
  ];

  const toggleFaq = (id: string) => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    if (expandedFaq === id) {
      setExpandedFaq(null);
    } else {
      setExpandedFaq(id);
    }
  };

  const filteredFaqs = faqs.filter(faq =>
    faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
    faq.answer.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleContactSupport = (type: string) => {
    if (type === 'chat') {
      Alert.alert('Live Support', 'Opening live support chat with our dedicated team...');
    } else if (type === 'email') {
      Alert.alert('Email Support', 'Send your query to support@editgo.app. We respond within 15 minutes.');
    } else if (type === 'call') {
      Alert.alert('Call Support', 'Direct premium line is open at +91 97872 78026.');
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#7C3AED" />
      
      {/* Header */}
      <LinearGradient colors={['#7C3AED', '#5B21B6']} style={styles.header}>
        <View style={styles.headerRow}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
            <ArrowLeft size={22} color="#FFF" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Help Center</Text>
          <View style={{ width: 38 }} />
        </View>
        <Text style={styles.headerDesc}>How can we assist you today, Creator?</Text>

        {/* Search Bar */}
        <View style={styles.searchBar}>
          <Search size={18} color="#94A3B8" style={{ marginRight: 8 }} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search FAQs, payments, delivery speed..."
            placeholderTextColor="#94A3B8"
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>
      </LinearGradient>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scroll}>
        {/* Support Grid */}
        <Text style={styles.sectionTitle}>Contact Direct Support</Text>
        <View style={styles.supportGrid}>
          <TouchableOpacity style={styles.supportCard} onPress={() => handleContactSupport('chat')}>
            <LinearGradient colors={['#EDE7F6', '#D1C4E9']} style={styles.iconCircle}>
              <MessageSquare size={20} color="#7C3AED" />
            </LinearGradient>
            <Text style={styles.supportLabel}>Live Chat</Text>
            <Text style={styles.supportSub}>Start instant chat</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.supportCard} onPress={() => handleContactSupport('email')}>
            <LinearGradient colors={['#E8F5E9', '#C8E6C9']} style={styles.iconCircle}>
              <Mail size={20} color="#10B981" />
            </LinearGradient>
            <Text style={styles.supportLabel}>Email Support</Text>
            <Text style={styles.supportSub}>Get help in 15m</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.supportCard} onPress={() => handleContactSupport('call')}>
            <LinearGradient colors={['#E3F2FD', '#BBDEFB']} style={styles.iconCircle}>
              <Phone size={20} color="#1E88E5" />
            </LinearGradient>
            <Text style={styles.supportLabel}>Direct Call</Text>
            <Text style={styles.supportSub}>24/7 Premium line</Text>
          </TouchableOpacity>
        </View>

        {/* FAQ Section */}
        <Text style={[styles.sectionTitle, { marginTop: 24 }]}>Frequently Asked Questions</Text>
        
        {filteredFaqs.length === 0 ? (
          <View style={styles.noResultBox}>
            <AlertCircle size={24} color="#94A3B8" />
            <Text style={styles.noResultText}>No matching questions found.</Text>
          </View>
        ) : (
          filteredFaqs.map((faq) => {
            const isExpanded = expandedFaq === faq.id;
            return (
              <View key={faq.id} style={styles.faqCard}>
                <TouchableOpacity
                  style={styles.faqHeader}
                  onPress={() => toggleFaq(faq.id)}
                  activeOpacity={0.7}
                >
                  <Text style={styles.faqQuestion}>{faq.question}</Text>
                  {isExpanded ? (
                    <ChevronUp size={18} color="#7C3AED" />
                  ) : (
                    <ChevronDown size={18} color="#64748B" />
                  )}
                </TouchableOpacity>
                {isExpanded && (
                  <View style={styles.faqAnswerContainer}>
                    <View style={styles.divider} />
                    <Text style={styles.faqAnswer}>{faq.answer}</Text>
                  </View>
                )}
              </View>
            );
          })
        )}

        <View style={{ height: 40 }} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8FAFC' },
  scroll: { padding: 20 },
  
  header: {
    paddingTop: 55,
    paddingBottom: 35,
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
  headerDesc: { fontSize: 13, color: 'rgba(255,255,255,0.85)', fontWeight: '600', marginBottom: 18 },

  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF',
    borderRadius: 16,
    paddingHorizontal: 14,
    height: 48,
    elevation: 3,
    shadowColor: '#5B21B6',
    shadowOpacity: 0.1,
    shadowRadius: 8,
  },
  searchInput: { flex: 1, fontSize: 13, fontWeight: '600', color: '#1E293B' },

  sectionTitle: {
    fontSize: 13,
    fontWeight: '900',
    color: '#1E293B',
    marginBottom: 14,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },

  supportGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 10,
  },
  supportCard: {
    flex: 1,
    backgroundColor: '#FFF',
    borderRadius: 20,
    paddingVertical: 18,
    alignItems: 'center',
    elevation: 2,
    shadowColor: '#7C3AED',
    shadowOpacity: 0.03,
    shadowRadius: 8,
    borderWidth: 1,
    borderColor: '#F1F5F9',
  },
  iconCircle: {
    width: 44,
    height: 44,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
  },
  supportLabel: { fontSize: 12, fontWeight: '900', color: '#1E293B', marginBottom: 2 },
  supportSub: { fontSize: 9, color: '#94A3B8', fontWeight: '700' },

  faqCard: {
    backgroundColor: '#FFF',
    borderRadius: 18,
    marginBottom: 12,
    elevation: 2,
    shadowColor: '#7C3AED',
    shadowOpacity: 0.03,
    shadowRadius: 8,
    borderWidth: 1,
    borderColor: '#F1F5F9',
    overflow: 'hidden',
  },
  faqHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
  },
  faqQuestion: { fontSize: 13, fontWeight: '800', color: '#1E293B', flex: 1, marginRight: 12 },
  faqAnswerContainer: {
    paddingHorizontal: 16,
    paddingBottom: 16,
  },
  divider: { height: 1, backgroundColor: '#F1F5F9', marginBottom: 12 },
  faqAnswer: { fontSize: 12, color: '#475569', lineHeight: 18, fontWeight: '600' },

  noResultBox: {
    backgroundColor: '#FFF',
    borderRadius: 18,
    padding: 24,
    alignItems: 'center',
    gap: 8,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  noResultText: { color: '#94A3B8', fontSize: 12, fontWeight: '600' }
});
