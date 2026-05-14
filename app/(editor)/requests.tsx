import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, ActivityIndicator, Alert, Linking, ScrollView, Modal, TextInput, KeyboardAvoidingView, Platform, RefreshControl } from 'react-native';
import { GlassCard } from '../../src/components/ui/GlassCard';
import { 
  Clock, Zap, AlertCircle, RefreshCcw, 
  Play, FileText, ChevronRight, X, 
  Phone, MessageSquare, Send, CheckCircle2,
  UploadCloud, Lock, Unlock, ShoppingBag
} from 'lucide-react-native';
import Animated, { FadeInUp } from 'react-native-reanimated';
import { editorService, ROOT_URL, api } from '../../src/services/api';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';

export default function RequestsScreen() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<'assigned' | 'available'>('assigned');
  const [assignedOrders, setAssignedOrders] = useState<any[]>([]);
  const [availableOrders, setAvailableOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [processing, setProcessing] = useState<string | null>(null);
  const [selectedJob, setSelectedJob] = useState<any>(null);
  
  // Input States
  const [showPreviewInput, setShowPreviewInput] = useState(false);
  const [showFinalInput, setShowFinalInput] = useState(false);
  const [previewUrl, setPreviewUrl] = useState('');
  const [finalVideoUrl, setFinalVideoUrl] = useState('');
  const [isOnline, setIsOnline] = useState(false);

  useEffect(() => {
    fetchData();
    checkOnlineStatus();
  }, []);

  const checkOnlineStatus = async () => {
    try {
      const me = await editorService.getMe();
      if (me.editorProfile) {
        setIsOnline(me.editorProfile.isOnline);
      }
    } catch (error) {}
  };

  const handleToggleOnline = async () => {
    try {
      const newStatus = !isOnline;
      setIsOnline(newStatus);
      await editorService.toggleOnline(newStatus);
    } catch (error) {
      setIsOnline(!isOnline); // Rollback
      Alert.alert('Error', 'Failed to update status');
    }
  };

  const fetchData = async () => {
    try {
      setLoading(true);
      await Promise.all([fetchAssigned(), fetchAvailable()]);
    } catch (error) {
      console.error('[Requests] Fetch Data Error:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const fetchAssigned = async (refreshSelectedId?: string) => {
    try {
      const data = await editorService.getAssignedOrders();
      const allOrders = data.orders || [];
      setAssignedOrders(allOrders);
      
      if (refreshSelectedId) {
        const updated = allOrders.find((o: any) => o.id === refreshSelectedId);
        if (updated) setSelectedJob(updated);
      }
    } catch (error) {
      console.error('[Requests] Assigned Fetch Error:', error);
    }
  };

  const fetchAvailable = async () => {
    try {
      // Fetch orders in SEARCHING status
      const response = await api.get('/orders/available');
      setAvailableOrders(response.data.orders || []);
    } catch (error) {
      console.error('[Requests] Available Fetch Error:', error);
    }
  };

  const handleClaim = async (orderId: string) => {
    try {
      setProcessing(orderId);
      // Claiming an order assigns the editor and sets status to ACCEPTED
      await api.post(`/orders/${orderId}/claim`);
      Alert.alert('Success', 'Project claimed! Check your Assigned tab.');
      await fetchData();
      setActiveTab('assigned');
    } catch (error: any) {
      Alert.alert('Error', error.response?.data?.message || 'Failed to claim project');
    } finally {
      setProcessing(null);
    }
  };

  const handleAccept = async (orderId: string) => {
    try {
      setProcessing(orderId);
      await editorService.updateOrderStatus(orderId, 'ACCEPTED', 10);
      Alert.alert('Success', 'Project accepted! Opening Workspace...');
      await fetchAssigned(orderId);
    } catch (error: any) {
      Alert.alert('Error', error.message || 'Failed to accept order');
    } finally {
      setProcessing(null);
    }
  };

  const handleUpdateProgress = async (item: any) => {
    try {
      const nextProgress = Math.min((item.progress || 0) + 20, 100);
      const nextStatus = nextProgress === 100 ? 'COMPLETED' : 'EDITING_STARTED';
      setProcessing(item.id);
      await editorService.updateOrderStatus(item.id, nextStatus, nextProgress);
      await fetchAssigned(item.id);
    } catch (error) {
      Alert.alert('Error', 'Failed to update progress');
    } finally {
      setProcessing(null);
    }
  };

  const handleSendPreview = async () => {
    if (!selectedJob || !previewUrl) {
      Alert.alert('Error', 'Please enter a valid link');
      return;
    }
    
    try {
      setProcessing(selectedJob.id);
      await editorService.uploadPreview(selectedJob.id, previewUrl);
      Alert.alert('Success', 'Preview sent to customer!');
      setPreviewUrl('');
      setShowPreviewInput(false);
      await fetchAssigned(selectedJob.id);
    } catch (err: any) {
      Alert.alert('Error', 'Failed to send preview');
    } finally {
      setProcessing(null);
    }
  };

  const handleDeliverFinal = async () => {
    if (!selectedJob || !finalVideoUrl) {
      Alert.alert('Error', 'Please enter the HD video link');
      return;
    }

    try {
      setProcessing(selectedJob.id);
      await editorService.uploadFinalWork(selectedJob.id, finalVideoUrl);
      Alert.alert('Project Delivered!', 'The client can now pay to unlock the HD download.');
      setFinalVideoUrl('');
      setShowFinalInput(false);
      await fetchAssigned(selectedJob.id);
    } catch (err: any) {
      Alert.alert('Error', 'Failed to deliver final work');
    } finally {
      setProcessing(null);
    }
  };

  const getFullVideoUrl = (path: string) => {
    if (!path) return null;
    if (path.startsWith('http')) return path;
    return `${ROOT_URL}/uploads/${path}`;
  };

  const safeOpenURL = (url: string | null | undefined) => {
    if (!url) {
      Alert.alert('Not Available', 'Link is missing or invalid.');
      return;
    }
    Linking.openURL(url).catch(() => {
      Alert.alert('Error', 'Could not open this link.');
    });
  };

  if (loading && !refreshing) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color="#8B5CF6" />
      </View>
    );
  }

  const currentData = activeTab === 'assigned' ? assignedOrders : availableOrders;

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.headerRow}>
          <View>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <Text style={styles.title}>Creator Workspace</Text>
              <TouchableOpacity style={styles.switchBtn} onPress={() => router.replace('/(customer)/home')}>
                <Text style={styles.switchText}>Switch to Customer</Text>
              </TouchableOpacity>
            </View>
            <View style={styles.statusHeaderRow}>
              <View style={[styles.onlineDot, isOnline && styles.dotLive]} />
              <Text style={styles.subtitle}>{isOnline ? 'You are LIVE' : 'You are Offline'}</Text>
              <TouchableOpacity style={styles.toggleBtn} onPress={handleToggleOnline}>
                <Text style={styles.toggleText}>{isOnline ? 'Go Offline' : 'Go Online'}</Text>
              </TouchableOpacity>
            </View>
          </View>
          <TouchableOpacity onPress={() => fetchData()} style={styles.refreshBtn}>
            <RefreshCcw size={20} color="#8B5CF6" />
          </TouchableOpacity>
        </View>

        <View style={styles.tabBar}>
          <TouchableOpacity 
            style={[styles.tab, activeTab === 'assigned' && styles.activeTab]}
            onPress={() => setActiveTab('assigned')}
          >
            <Text style={[styles.tabText, activeTab === 'assigned' && styles.activeTabText]}>Active Projects ({assignedOrders.length})</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={[styles.tab, activeTab === 'available' && styles.activeTab]}
            onPress={() => setActiveTab('available')}
          >
            <Text style={[styles.tabText, activeTab === 'available' && styles.activeTabText]}>Marketplace ({availableOrders.length})</Text>
          </TouchableOpacity>
        </View>
      </View>

      <FlatList
        data={currentData}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.list}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={() => { setRefreshing(true); fetchData(); }} />}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <ShoppingBag size={48} color="#CBD5E1" />
            <Text style={styles.emptyText}>No {activeTab} projects found</Text>
          </View>
        }
        renderItem={({ item, index }) => (
          <Animated.View entering={FadeInUp.delay(index * 100)}>
            <TouchableOpacity 
              onPress={() => activeTab === 'assigned' ? setSelectedJob(item) : null} 
              activeOpacity={activeTab === 'assigned' ? 0.9 : 1}
            >
              <GlassCard style={styles.card}>
                <View style={styles.cardHeader}>
                  <View style={styles.typeBox}>
                    <Text style={styles.typeText}>{item.category || 'Video Edit'}</Text>
                    <Zap size={14} color="#F59E0B" fill="#F59E0B" />
                  </View>
                  <Text style={styles.price}>₹{item.price}</Text>
                </View>
                
                <Text style={styles.customer}>Client: {item.customer?.name || 'Anonymous'}</Text>
                <Text style={styles.jobTitle} numberOfLines={1}>{item.title}</Text>
                
                {activeTab === 'assigned' ? (
                  <>
                    <View style={styles.progressRow}>
                      <View style={styles.progressBarBg}>
                        <View style={[styles.progressBarFill, { width: `${item.progress}%` }]} />
                      </View>
                      <Text style={styles.progressLabel}>{item.progress}%</Text>
                    </View>

                    <View style={styles.actions}>
                      {item.status === 'SEARCHING' ? (
                        <TouchableOpacity 
                          style={styles.acceptBtn} 
                          onPress={() => handleAccept(item.id)}
                        >
                          <Text style={styles.acceptText}>Start Project</Text>
                        </TouchableOpacity>
                      ) : (
                        <View style={styles.activeActions}>
                          <View style={[styles.viewDetailsBtn, item.status === 'COMPLETED' && styles.completedBadge]}>
                            <Text style={[styles.viewDetailsText, item.status === 'COMPLETED' && {color: '#10B981'}]}>
                              {item.status === 'COMPLETED' ? 'Project Delivered ✓' : 'Open Workspace'}
                            </Text>
                          </View>
                        </View>
                      )}
                    </View>
                  </>
                ) : (
                  <TouchableOpacity 
                    style={styles.claimBtn} 
                    onPress={() => handleClaim(item.id)}
                    disabled={processing === item.id}
                  >
                    {processing === item.id ? <ActivityIndicator color="#FFF" /> : <Text style={styles.claimText}>Claim Project</Text>}
                  </TouchableOpacity>
                )}
              </GlassCard>
            </TouchableOpacity>
          </Animated.View>
        )}
      />

      <Modal
        visible={selectedJob !== null}
        animationType="slide"
        transparent={true}
        onRequestClose={() => {
          setSelectedJob(null);
          setShowPreviewInput(false);
          setShowFinalInput(false);
        }}
      >
        <KeyboardAvoidingView 
          behavior={Platform.OS === 'ios' ? 'padding' : undefined} 
          style={styles.modalOverlay}
        >
          <View style={styles.modalContent}>
            <LinearGradient colors={['#8B5CF6', '#6366F1']} style={styles.modalHeader}>
              <View style={styles.modalHeaderRow}>
                <View style={{ flex: 1 }}>
                  <Text style={styles.modalTitle}>Project Hub</Text>
                  <Text style={styles.modalSubtitle} numberOfLines={1}>{selectedJob?.title}</Text>
                </View>
                <TouchableOpacity onPress={() => setSelectedJob(null)} style={styles.closeBtn}>
                  <X size={24} color="#FFF" />
                </TouchableOpacity>
              </View>
            </LinearGradient>

            <ScrollView style={styles.modalBody} showsVerticalScrollIndicator={false}>
              {selectedJob && (
                <>
                  {/* Client Contact */}
                  <View style={styles.contactCard}>
                    <View style={styles.contactInfo}>
                      <Text style={styles.contactName}>{selectedJob.customer?.name}</Text>
                      <Text style={styles.contactRole}>Client • Premium Member</Text>
                    </View>
                    <View style={styles.contactActions}>
                      <TouchableOpacity style={styles.contactIcon} onPress={() => safeOpenURL(`tel:${selectedJob.customer?.phone}`)}>
                        <Phone size={20} color="#10B981" />
                      </TouchableOpacity>
                      <TouchableOpacity style={styles.contactIcon} onPress={() => safeOpenURL(`sms:${selectedJob.customer?.phone}`)}>
                        <MessageSquare size={20} color="#8B5CF6" />
                      </TouchableOpacity>
                    </View>
                  </View>

                  {/* Requirements & Media */}
                  <View style={styles.section}>
                    <Text style={styles.sectionLabel}>REQUIREMENTS</Text>
                    <GlassCard style={styles.requirementCard}>
                      <Text style={styles.requirementText}>{selectedJob.instructions || "Standard cinematic edit requested."}</Text>
                    </GlassCard>
                  </View>

                  <View style={styles.section}>
                    <Text style={styles.sectionLabel}>SOURCE MEDIA</Text>
                    <TouchableOpacity 
                      style={styles.mediaCard} 
                      onPress={() => {
                        const url = getFullVideoUrl(selectedJob.videoUrl);
                        safeOpenURL(url);
                      }}
                    >
                      <View style={styles.mediaIconBox}>
                        <Play size={20} color="#FFF" fill="#FFF" />
                      </View>
                      <View style={styles.mediaInfo}>
                        <Text style={styles.mediaName}>Raw Footage</Text>
                        <Text style={styles.mediaSize}>Download & start editing</Text>
                      </View>
                      <ChevronRight size={20} color="#CBD5E1" />
                    </TouchableOpacity>
                  </View>

                  {/* Previews Flow */}
                  <View style={styles.section}>
                    <View style={styles.sectionHeaderRow}>
                      <Text style={styles.sectionLabel}>DRAFT PREVIEWS ({(selectedJob.previews || []).length}/3)</Text>
                      {!showPreviewInput && (selectedJob.previews || []).length < 3 && selectedJob.status !== 'COMPLETED' && (
                        <TouchableOpacity onPress={() => setShowPreviewInput(true)}>
                          <Text style={styles.addText}>+ Send Draft</Text>
                        </TouchableOpacity>
                      )}
                    </View>

                    {showPreviewInput && (
                      <View style={styles.inputBox}>
                        <TextInput 
                          style={styles.textInput}
                          placeholder="Paste GDrive/Dropbox Link"
                          value={previewUrl}
                          onChangeText={setPreviewUrl}
                        />
                        <View style={styles.inputActions}>
                          <TouchableOpacity onPress={() => setShowPreviewInput(false)} style={styles.cancelBtn}><Text>Cancel</Text></TouchableOpacity>
                          <TouchableOpacity onPress={handleSendPreview} style={styles.sendBtn}><Text style={styles.sendBtnText}>Send Draft</Text></TouchableOpacity>
                        </View>
                      </View>
                    )}

                    {(selectedJob.previews || []).map((p: string, i: number) => (
                      <TouchableOpacity key={i} style={styles.previewItem} onPress={() => safeOpenURL(p)}>
                        <Play size={14} color="#8B5CF6" />
                        <Text style={styles.previewText}>Preview v{i + 1}</Text>
                        <ChevronRight size={16} color="#CBD5E1" />
                      </TouchableOpacity>
                    ))}
                  </View>

                  {/* Final Delivery Flow */}
                  <View style={styles.section}>
                    <Text style={styles.sectionLabel}>FINAL DELIVERY</Text>
                    {selectedJob.status === 'COMPLETED' ? (
                      <GlassCard style={styles.deliveryCard}>
                        <View style={styles.deliveryHeader}>
                          {selectedJob.isPaid ? <Unlock size={20} color="#10B981" /> : <Lock size={20} color="#F59E0B" />}
                          <Text style={[styles.deliveryStatus, selectedJob.isPaid && {color: '#10B981'}]}>
                            {selectedJob.isPaid ? 'PAYMENT RECEIVED' : 'WAITING FOR PAYMENT'}
                          </Text>
                        </View>
                        <TouchableOpacity style={styles.finalLinkBtn} onPress={() => safeOpenURL(selectedJob.finalUrl)}>
                          <Text style={styles.finalLinkText}>View Final HD Video</Text>
                        </TouchableOpacity>
                      </GlassCard>
                    ) : (
                      <>
                        {!showFinalInput ? (
                          <TouchableOpacity style={styles.deliverBtn} onPress={() => setShowFinalInput(true)}>
                            <UploadCloud size={20} color="#FFF" />
                            <Text style={styles.deliverText}>Deliver Final Project</Text>
                          </TouchableOpacity>
                        ) : (
                          <View style={styles.inputBox}>
                            <Text style={styles.inputLabel}>Final HD Video Link (Unlocked after payment)</Text>
                            <TextInput 
                              style={styles.textInput}
                              placeholder="Paste Final HD Link Here"
                              value={finalVideoUrl}
                              onChangeText={setFinalVideoUrl}
                            />
                            <View style={styles.inputActions}>
                              <TouchableOpacity onPress={() => setShowFinalInput(false)} style={styles.cancelBtn}><Text>Cancel</Text></TouchableOpacity>
                              <TouchableOpacity onPress={handleDeliverFinal} style={styles.finalSendBtn}><Text style={styles.sendBtnText}>Finish Project</Text></TouchableOpacity>
                            </View>
                          </View>
                        )}
                      </>
                    )}
                  </View>

                  {/* Progress Control */}
                  {selectedJob.status !== 'COMPLETED' && (
                    <View style={styles.section}>
                      <Text style={styles.sectionLabel}>LIVE PROGRESS</Text>
                      <View style={styles.progressStats}>
                        <Text style={styles.progressStatusText}>{selectedJob.status.replace('_', ' ')}</Text>
                        <Text style={styles.progressPercentText}>{selectedJob.progress}%</Text>
                      </View>
                      <View style={styles.largeProgressBarBg}>
                        <View style={[styles.largeProgressBarFill, { width: `${selectedJob.progress}%` }]} />
                      </View>
                      <TouchableOpacity 
                        style={styles.updateMainBtn}
                        onPress={() => handleUpdateProgress(selectedJob)}
                        disabled={processing === selectedJob.id}
                      >
                        {processing === selectedJob.id ? <ActivityIndicator color="#FFF" /> : <Text style={styles.updateMainText}>INCREMENT PROGRESS (+20%)</Text>}
                      </TouchableOpacity>
                    </View>
                  )}
                  <View style={{ height: 100 }} />
                </>
              )}
            </ScrollView>
          </View>
        </KeyboardAvoidingView>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8FAFC' },
  centerContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  header: { paddingTop: 60, paddingHorizontal: 24, paddingBottom: 12, backgroundColor: '#FFF' },
  headerRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  refreshBtn: { width: 44, height: 44, borderRadius: 14, backgroundColor: '#F5F3FF', alignItems: 'center', justifyContent: 'center' },
  title: { fontSize: 24, fontWeight: '900', color: '#1E293B' },
  switchBtn: { backgroundColor: '#F5F3FF', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 8, marginLeft: 12 },
  switchText: { fontSize: 10, fontWeight: '800', color: '#8B5CF6' },
  subtitle: { fontSize: 12, color: '#64748B', marginTop: 2, fontWeight: '600' },
  statusHeaderRow: { flexDirection: 'row', alignItems: 'center', marginTop: 4 },
  onlineDot: { width: 8, height: 8, borderRadius: 4, backgroundColor: '#94A3B8', marginRight: 6 },
  dotLive: { backgroundColor: '#10B981', shadowColor: '#10B981', shadowOpacity: 0.5, shadowRadius: 4 },
  toggleBtn: { marginLeft: 12, backgroundColor: '#F1F5F9', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 8 },
  toggleText: { fontSize: 10, fontWeight: '800', color: '#8B5CF6' },
  tabBar: { flexDirection: 'row', marginTop: 20, gap: 10 },
  tab: { flex: 1, paddingVertical: 10, alignItems: 'center', borderRadius: 12, backgroundColor: '#F1F5F9' },
  activeTab: { backgroundColor: '#8B5CF6' },
  tabText: { fontSize: 11, fontWeight: '800', color: '#64748B' },
  activeTabText: { color: '#FFF' },
  list: { paddingHorizontal: 24, paddingBottom: 100, paddingTop: 20 },
  card: { padding: 16, marginBottom: 16, backgroundColor: '#FFF', borderRadius: 24 },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 },
  typeBox: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#F5F3FF', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 8 },
  typeText: { color: '#8B5CF6', fontWeight: '800', fontSize: 11, marginRight: 6 },
  price: { fontSize: 18, fontWeight: '900', color: '#1E293B' },
  customer: { fontSize: 13, color: '#94A3B8', fontWeight: '700' },
  jobTitle: { fontSize: 15, fontWeight: '800', color: '#1E293B', marginTop: 4, marginBottom: 12 },
  progressRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 16 },
  progressBarBg: { flex: 1, height: 6, backgroundColor: '#F1F5F9', borderRadius: 3, marginRight: 10 },
  progressBarFill: { height: 6, backgroundColor: '#8B5CF6', borderRadius: 3 },
  progressLabel: { fontSize: 11, fontWeight: '800', color: '#64748B' },
  actions: { marginTop: 4 },
  acceptBtn: { backgroundColor: '#10B981', paddingVertical: 12, alignItems: 'center', borderRadius: 12 },
  acceptText: { color: '#FFF', fontWeight: '800', fontSize: 14 },
  activeActions: { flexDirection: 'row' },
  viewDetailsBtn: { flex: 1, backgroundColor: '#F5F3FF', paddingVertical: 12, alignItems: 'center', borderRadius: 12 },
  viewDetailsText: { color: '#8B5CF6', fontWeight: '800', fontSize: 14 },
  completedBadge: { backgroundColor: '#F0FDF4' },
  claimBtn: { backgroundColor: '#8B5CF6', paddingVertical: 12, alignItems: 'center', borderRadius: 12, marginTop: 4 },
  claimText: { color: '#FFF', fontWeight: '800', fontSize: 14 },

  // Modal
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.4)', justifyContent: 'flex-end' },
  modalContent: { backgroundColor: '#FFF', borderTopLeftRadius: 32, borderTopRightRadius: 32, height: '90%' },
  modalHeader: { padding: 24, borderTopLeftRadius: 32, borderTopRightRadius: 32 },
  modalHeaderRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  modalTitle: { color: '#FFF', fontSize: 20, fontWeight: '900' },
  modalSubtitle: { color: 'rgba(255,255,255,0.8)', fontSize: 13, fontWeight: '600', marginTop: 4 },
  closeBtn: { padding: 4 },
  modalBody: { padding: 24 },
  contactCard: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#F8FAFC', padding: 16, borderRadius: 24, marginBottom: 24 },
  contactInfo: { },
  contactName: { fontSize: 17, fontWeight: '800', color: '#1E293B' },
  contactRole: { fontSize: 12, color: '#64748B', marginTop: 2, fontWeight: '600' },
  contactActions: { flexDirection: 'row' },
  contactIcon: { width: 44, height: 44, borderRadius: 14, backgroundColor: '#FFF', alignItems: 'center', justifyContent: 'center', marginLeft: 10 },
  section: { marginBottom: 24 },
  sectionLabel: { fontSize: 11, fontWeight: '900', color: '#94A3B8', letterSpacing: 1, marginBottom: 12 },
  sectionHeaderRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 },
  addText: { fontSize: 12, fontWeight: '800', color: '#8B5CF6' },
  requirementCard: { padding: 16, backgroundColor: '#F8FAFC', borderRadius: 16 },
  requirementText: { fontSize: 14, color: '#475569', lineHeight: 22, fontWeight: '600' },
  mediaCard: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#FFF', padding: 16, borderRadius: 20, borderWidth: 1, borderColor: '#F1F5F9' },
  mediaIconBox: { width: 44, height: 44, borderRadius: 12, backgroundColor: '#8B5CF6', alignItems: 'center', justifyContent: 'center' },
  mediaInfo: { flex: 1, marginLeft: 16 },
  mediaName: { fontSize: 15, fontWeight: '700', color: '#1E293B' },
  mediaSize: { fontSize: 12, color: '#94A3B8', marginTop: 2 },
  previewItem: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#F8FAFC', padding: 16, borderRadius: 16, marginBottom: 10 },
  previewText: { flex: 1, marginLeft: 12, fontSize: 14, fontWeight: '700', color: '#475569' },
  inputBox: { backgroundColor: '#F5F3FF', padding: 16, borderRadius: 20, marginBottom: 16 },
  inputLabel: { fontSize: 12, fontWeight: '700', color: '#8B5CF6', marginBottom: 8 },
  textInput: { backgroundColor: '#FFF', padding: 14, borderRadius: 12, fontSize: 14, borderWidth: 1, borderColor: '#DDD6FE' },
  inputActions: { flexDirection: 'row', justifyContent: 'flex-end', marginTop: 12, alignItems: 'center' },
  cancelBtn: { marginRight: 16 },
  sendBtn: { backgroundColor: '#8B5CF6', paddingHorizontal: 20, paddingVertical: 10, borderRadius: 10 },
  finalSendBtn: { backgroundColor: '#10B981', paddingHorizontal: 20, paddingVertical: 10, borderRadius: 10 },
  sendBtnText: { color: '#FFF', fontWeight: '800' },
  deliverBtn: { backgroundColor: '#8B5CF6', paddingVertical: 16, borderRadius: 16, flexDirection: 'row', justifyContent: 'center', alignItems: 'center', shadowColor: '#8B5CF6', shadowOpacity: 0.3, shadowRadius: 10, elevation: 5 },
  deliverText: { color: '#FFF', fontSize: 16, fontWeight: '900', marginLeft: 10 },
  deliveryCard: { padding: 20, backgroundColor: '#FFF', borderLeftWidth: 4, borderLeftColor: '#10B981' },
  deliveryHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 12 },
  deliveryStatus: { fontSize: 12, fontWeight: '900', color: '#F59E0B', marginLeft: 8 },
  finalLinkBtn: { backgroundColor: '#F5F3FF', padding: 14, borderRadius: 12, alignItems: 'center' },
  finalLinkText: { color: '#8B5CF6', fontWeight: '800' },
  progressStats: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 10 },
  progressStatusText: { fontSize: 14, fontWeight: '800', color: '#8B5CF6' },
  progressPercentText: { fontSize: 14, fontWeight: '900', color: '#1E293B' },
  largeProgressBarBg: { height: 10, backgroundColor: '#F1F5F9', borderRadius: 5, marginBottom: 24 },
  largeProgressBarFill: { height: 10, backgroundColor: '#8B5CF6', borderRadius: 5 },
  updateMainBtn: { backgroundColor: '#8B5CF6', paddingVertical: 16, borderRadius: 16, alignItems: 'center' },
  updateMainText: { color: '#FFF', fontSize: 15, fontWeight: '900' },
  emptyContainer: { alignItems: 'center', padding: 60 },
  emptyText: { marginTop: 16, color: '#94A3B8', fontWeight: '700' }
});
