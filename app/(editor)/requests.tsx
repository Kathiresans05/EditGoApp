import React, { useState, useEffect } from 'react';
import {
  View, Text, StyleSheet, FlatList, TouchableOpacity, ActivityIndicator,
  Alert, Linking, ScrollView, Modal, TextInput, KeyboardAvoidingView,
  Platform, RefreshControl, StatusBar,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import {
  Clock, Zap, AlertCircle, RefreshCcw, Play, ChevronRight,
  X, Phone, MessageSquare, CheckCircle2, UploadCloud, Lock,
  Unlock, ShoppingBag, Film
} from 'lucide-react-native';
import Animated, { FadeInUp } from 'react-native-reanimated';
import api, { editorService, ROOT_URL, authService } from '../../src/services/api';
import ChatModal from '../../src/components/ChatModal';
import { useRouter } from 'expo-router';
import * as ImagePicker from 'expo-image-picker';
import * as FileSystem from 'expo-file-system';
import * as MediaLibrary from 'expo-media-library';
import * as Sharing from 'expo-sharing';

const CAT_COLORS = ['#EDE7F6','#E3F2FD','#E8F5E9','#FFF3E0','#FCE4EC','#E0F7FA'];

export default function RequestsScreen() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<'assigned'|'available'>('assigned');
  const [assignedOrders, setAssignedOrders] = useState<any[]>([]);
  const [availableOrders, setAvailableOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [processing, setProcessing] = useState<string|null>(null);
  const [selectedJob, setSelectedJob] = useState<any>(null);
  const [showPreviewInput, setShowPreviewInput] = useState(false);
  const [showFinalInput, setShowFinalInput] = useState(false);
  const [previewUrl, setPreviewUrl] = useState('');
  const [finalVideoUrl, setFinalVideoUrl] = useState('');
  const [isOnline, setIsOnline] = useState(false);
  const [showChat, setShowChat] = useState(false);
  const [downloadProgress, setDownloadProgress] = useState<number|null>(null);
  const [currentUser, setCurrentUser] = useState<any>(null);
  useEffect(() => { fetchData(); fetchUser(); }, []);

  const fetchUser = async () => {
    try { const d = await authService.getMe(); setCurrentUser(d); } catch {}
  };

  const fetchData = async () => {
    try {
      setLoading(true);
      const [assigned, available] = await Promise.all([
        editorService.getAssignedOrders(),
        api.get('/orders/available'),
      ]);
      setAssignedOrders(assigned.orders || []);
      setAvailableOrders(available.data.orders || []);
    } catch (e) { console.error(e); }
    finally { setLoading(false); setRefreshing(false); }
  };

  const handleClaim = async (id: string) => {
    try {
      setProcessing(id);
      await api.post(`/orders/${id}/claim`);
      Alert.alert('Claimed!', 'Check your Active Projects tab.');
      await fetchData(); setActiveTab('assigned');
    } catch (e: any) { Alert.alert('Error', e.response?.data?.message || 'Failed'); }
    finally { setProcessing(null); }
  };

  const handleAccept = async (id: string) => {
    try {
      setProcessing(id);
      await editorService.updateOrderStatus(id, 'ACCEPTED', 10);
      await fetchData();
    } catch { Alert.alert('Error', 'Failed to accept'); }
    finally { setProcessing(null); }
  };

  const handleUpdateProgress = async (item: any) => {
    try {
      setProcessing(item.id);
      const next = Math.min((item.progress||0)+20, 100);
      await editorService.updateOrderStatus(item.id, next===100?'COMPLETED':'EDITING_STARTED', next);
      const d = await editorService.getAssignedOrders();
      setAssignedOrders(d.orders||[]);
      const updated = (d.orders||[]).find((o:any)=>o.id===item.id);
      if (updated) setSelectedJob(updated);
    } catch { Alert.alert('Error','Failed'); }
    finally { setProcessing(null); }
  };

  const handleSendPreview = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') { Alert.alert('Permission Denied', 'Please grant gallery access!'); return; }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Videos,
      allowsMultipleSelection: false,
    });

    if (!result.canceled && result.assets.length > 0) {
      try {
        setProcessing(selectedJob.id);
        const videoUri = result.assets[0].uri;
        await editorService.uploadPreview(selectedJob.id, videoUri);
        Alert.alert('Sent!','Preview sent to customer!');
        await fetchData();
        setSelectedJob((prev: any) => ({ ...prev, previews: [...(prev.previews || []), videoUri] }));
      } catch { Alert.alert('Error','Failed to upload preview'); }
      finally { setProcessing(null); }
    }
  };

  const handleDeliverFinal = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') { Alert.alert('Permission Denied', 'Please grant gallery access!'); return; }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Videos,
      allowsMultipleSelection: false,
    });

    if (!result.canceled && result.assets.length > 0) {
      try {
        setProcessing(selectedJob.id);
        const videoUri = result.assets[0].uri;
        await editorService.uploadFinalWork(selectedJob.id, videoUri);
        Alert.alert('Delivered! 🚀','Client notified. Payment incoming.');
        await fetchData();
        setSelectedJob((prev: any) => ({ ...prev, finalUrl: videoUri, status: 'COMPLETED', progress: 100 }));
      } catch { Alert.alert('Error','Failed to deliver final video'); }
      finally { setProcessing(null); }
    }
  };

  const openURL = (url: string|null|undefined) => {
    if (!url) { Alert.alert('Not Available','Link missing.'); return; }
    Linking.openURL(url).catch(() => Alert.alert('Error','Could not open link.'));
  };

  if (loading && !refreshing) return (
    <View style={{flex:1,justifyContent:'center',alignItems:'center',backgroundColor:'#F8FAFC'}}>
      <ActivityIndicator size="large" color="#4F46E5" />
    </View>
  );

  const currentData = activeTab==='assigned' ? assignedOrders : availableOrders;

  return (
    <View style={s.container}>
      <StatusBar barStyle="light-content" backgroundColor="#4F46E5" />

      {/* Header */}
      <LinearGradient colors={['#4F46E5','#7C3AED']} style={s.header}>
        <View style={s.headerRow}>
          <View>
            <Text style={s.title}>Creator Workspace</Text>
            <View style={s.statusRow}>
              <View style={[s.dot, isOnline && s.dotLive]} />
              <Text style={s.statusText}>{isOnline ? 'You are LIVE' : 'Offline'}</Text>
              <TouchableOpacity style={s.toggleBtn} onPress={()=>setIsOnline(!isOnline)}>
                <Text style={s.toggleText}>{isOnline?'Go Offline':'Go Online'}</Text>
              </TouchableOpacity>
            </View>
          </View>
          <TouchableOpacity onPress={fetchData} style={s.refreshBtn}>
            <RefreshCcw size={18} color="#FFF" />
          </TouchableOpacity>
        </View>

        {/* Tabs */}
        <View style={s.tabRow}>
          {(['assigned','available'] as const).map(tab => (
            <TouchableOpacity
              key={tab}
              style={[s.tab, activeTab===tab && s.tabActive]}
              onPress={()=>setActiveTab(tab)}
            >
              <Text style={[s.tabText, activeTab===tab && s.tabTextActive]}>
                {tab==='assigned' ? `Active (${assignedOrders.length})` : `Marketplace (${availableOrders.length})`}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </LinearGradient>

      <FlatList
        data={currentData}
        keyExtractor={item=>item.id}
        contentContainerStyle={s.list}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={()=>{setRefreshing(true);fetchData();}} tintColor="#4F46E5" />}
        ListEmptyComponent={
          <View style={s.empty}>
            <ShoppingBag size={48} color="#DDD6FE" />
            <Text style={s.emptyTitle}>No {activeTab==='assigned'?'active':'available'} projects</Text>
          </View>
        }
        renderItem={({item, index}) => {
          const bgColor = CAT_COLORS[index % CAT_COLORS.length];
          return (
            <Animated.View entering={FadeInUp.delay(index*60)}>
              <TouchableOpacity
                onPress={()=>activeTab==='assigned'?setSelectedJob(item):null}
                activeOpacity={0.85}
                style={s.card}
              >
                {/* Category badge */}
                <View style={[s.catBadge, {backgroundColor: bgColor}]}>
                  <Text style={s.catText}>{item.category||'Video Edit'}</Text>
                </View>

                <View style={s.cardBody}>
                  <View style={{flex:1}}>
                    <Text style={s.clientName}>Client: {item.customer?.name||'Anonymous'}</Text>
                    <Text style={s.jobTitle} numberOfLines={1}>{item.title}</Text>
                  </View>
                  <Text style={s.price}>₹{item.price}</Text>
                </View>

                {activeTab==='assigned' ? (
                  <>
                    <View style={s.progressRow}>
                      <View style={s.progressBg}>
                        <View style={[s.progressFill, {width:`${item.progress||0}%` as any}]} />
                      </View>
                      <Text style={s.progressPct}>{item.progress||0}%</Text>
                    </View>
                    {item.status==='SEARCHING' ? (
                      <TouchableOpacity style={s.acceptBtn} onPress={()=>handleAccept(item.id)}>
                        <CheckCircle2 size={16} color="#FFF" />
                        <Text style={s.acceptText}>Start Project</Text>
                      </TouchableOpacity>
                    ) : (
                      <View style={[s.statusBadge, item.status==='COMPLETED'?s.badgeDone:s.badgeLive]}>
                        <Text style={[s.statusBadgeText, item.status==='COMPLETED'?{color:'#2E7D32'}:{color:'#4F46E5'}]}>
                          {item.status==='COMPLETED'?'✅ Delivered':'Open Workspace →'}
                        </Text>
                      </View>
                    )}
                  </>
                ) : (
                  <TouchableOpacity style={s.claimBtn} onPress={()=>handleClaim(item.id)} disabled={processing===item.id}>
                    {processing===item.id
                      ? <ActivityIndicator color="#FFF" size="small" />
                      : <><Zap size={15} color="#FFF" fill="#FFF" /><Text style={s.claimText}>Claim Project</Text></>
                    }
                  </TouchableOpacity>
                )}
              </TouchableOpacity>
            </Animated.View>
          );
        }}
      />

      {/* Workspace Modal */}
      <Modal visible={selectedJob!==null} animationType="slide" transparent onRequestClose={()=>setSelectedJob(null)}>
        <KeyboardAvoidingView behavior={Platform.OS==='ios'?'padding':undefined} style={s.modalOverlay}>
          <View style={s.modalSheet}>
            <LinearGradient colors={['#4F46E5','#7C3AED']} style={s.modalHeader}>
              <View style={s.modalHeaderRow}>
                <View style={{flex:1}}>
                  <Text style={s.modalTitle}>Project Hub</Text>
                  <Text style={s.modalSub} numberOfLines={1}>{selectedJob?.title}</Text>
                </View>
                <TouchableOpacity onPress={()=>setSelectedJob(null)} style={s.closeBtn}>
                  <X size={22} color="#FFF" />
                </TouchableOpacity>
              </View>
            </LinearGradient>

            <ScrollView style={s.modalBody} showsVerticalScrollIndicator={false}>
              {selectedJob && <>
                {/* Client */}
                <View style={s.clientCard}>
                  <View style={s.clientAvatar}>
                    <Text style={s.clientAvatarText}>{(selectedJob.customer?.name||'C')[0].toUpperCase()}</Text>
                  </View>
                  <View style={{flex:1, marginLeft:12}}>
                    <Text style={s.clientCardName}>{selectedJob.customer?.name}</Text>
                    <Text style={s.clientCardRole}>Client · Premium Member</Text>
                  </View>
                  <View style={s.contactBtns}>
                    <TouchableOpacity style={[s.contactBtn,{backgroundColor:'#EDE7F6'}]} onPress={()=>setShowChat(true)}>
                      <MessageSquare size={18} color="#4F46E5" />
                    </TouchableOpacity>
                    <TouchableOpacity style={[s.contactBtn,{backgroundColor:'#E8F5E9'}]} onPress={()=>openURL(`tel:${selectedJob.customer?.phone}`)}>
                      <Phone size={18} color="#2E7D32" />
                    </TouchableOpacity>
                  </View>
                </View>

                {/* Instructions */}
                <Text style={s.secLabel}>REQUIREMENTS</Text>
                <View style={s.infoCard}>
                  <Text style={s.infoText}>{selectedJob.instructions||'Standard cinematic edit requested.'}</Text>
                </View>

                {/* Source video */}
                <Text style={s.secLabel}>SOURCE MEDIA</Text>
                    try {
                      setDownloadProgress(0);
                      const response = await editorService.getSignedVideo(selectedJob.id);
                      const videoUrl = response.signedUrl || response.url || 'https://assets.mixkit.co/videos/preview/mixkit-girl-in-neon-sign-1232-large.mp4';
                      const fileName = `EditGo_Raw_${selectedJob.id}_${Date.now()}.mp4`;
                      const fileUri = FileSystem.documentDirectory + fileName;
                      // Use downloadAsync which is the modern API
                      const result = await FileSystem.downloadAsync(videoUrl, fileUri);
                      if (!result?.uri) throw new Error('Download failed');
                      const { status } = await MediaLibrary.requestPermissionsAsync();
                      if (status === 'granted') {
                        await MediaLibrary.saveToLibraryAsync(result.uri);
                        Alert.alert('✅ Download Complete', 'Raw footage saved to your gallery!');
                      } else {
                        if (await Sharing.isAvailableAsync()) {
                          await Sharing.shareAsync(result.uri);
                        } else {
                          Alert.alert('Downloaded', `File saved at ${result.uri}`);
                        }
                      }
                      setDownloadProgress(null);
                    } catch (e: any) {
                      console.error('Download failed', e);
                      setDownloadProgress(null);
                      Alert.alert('Download Failed', e.message || 'Could not download video');
                    }

                }}>
                  <View style={s.mediaLeft}>
                    <View style={s.iconBox}>
                      <Film size={20} color="#6366F1" />
                    </View>
                    <View>
                      <Text style={s.mediaTitle}>Raw Footage</Text>
                      <Text style={s.mediaSize}>
                        {downloadProgress !== null ? `${downloadProgress}% Downloading...` : '4.2 GB • MP4'}
                      </Text>
                    </View>
                  </View>
                  <ChevronRight size={18} color="#CBD5E1" />
                </TouchableOpacity>

                {/* Draft Previews */}
                <View style={s.secRow}>
                  <Text style={s.secLabel}>DRAFTS ({(selectedJob.previews||[]).length}/3)</Text>
                  {(selectedJob.previews||[]).length<3 && selectedJob.status!=='COMPLETED' && (
                    <TouchableOpacity onPress={handleSendPreview} disabled={processing===selectedJob.id}>
                      {processing===selectedJob.id ? <ActivityIndicator size="small" color="#4F46E5" /> : <Text style={s.addLink}>+ Upload Draft</Text>}
                    </TouchableOpacity>
                  )}
                </View>
                {(selectedJob.previews||[]).map((p:string,i:number)=>(
                  <TouchableOpacity key={i} style={s.previewItem} onPress={()=>openURL(p)}>
                    <Play size={13} color="#4F46E5" />
                    <Text style={s.previewText}>Preview v{i+1}</Text>
                    <ChevronRight size={14} color="#CBD5E1" />
                  </TouchableOpacity>
                ))}

                {/* Final Delivery */}
                <Text style={[s.secLabel,{marginTop:16}]}>FINAL DELIVERY</Text>
                {selectedJob.status==='COMPLETED' ? (
                  <View style={s.deliveredCard}>
                    {selectedJob.isPaid ? <Unlock size={18} color="#2E7D32"/> : <Lock size={18} color="#FB8C00"/>}
                    <Text style={[s.deliveredText,selectedJob.isPaid&&{color:'#2E7D32'}]}>
                      {selectedJob.isPaid?'PAYMENT RECEIVED':'WAITING FOR PAYMENT'}
                    </Text>
                    <TouchableOpacity style={s.viewFinalBtn} onPress={()=>openURL(selectedJob.finalUrl)}>
                      <Text style={s.viewFinalText}>View HD Video</Text>
                    </TouchableOpacity>
                  </View>
                ) : (
                  <TouchableOpacity style={s.deliverBtn} onPress={handleDeliverFinal} disabled={processing===selectedJob.id}>
                    <LinearGradient colors={['#4F46E5','#7C3AED']} style={s.deliverGrad}>
                      {processing===selectedJob.id ? (
                        <ActivityIndicator color="#FFF" />
                      ) : (
                        <>
                          <UploadCloud size={18} color="#FFF" />
                          <Text style={s.deliverText}>Upload Final Project</Text>
                        </>
                      )}
                    </LinearGradient>
                  </TouchableOpacity>
                )}

                {/* Progress */}
                {selectedJob.status!=='COMPLETED' && (
                  <View style={{marginTop:16, marginBottom:8}}>
                    <View style={s.secRow}>
                      <Text style={s.secLabel}>LIVE PROGRESS</Text>
                      <Text style={s.progressPctLarge}>{selectedJob.progress||0}%</Text>
                    </View>
                    <View style={s.largePbg}>
                      <View style={[s.largePfill,{width:`${selectedJob.progress||0}%` as any}]} />
                    </View>
                    <TouchableOpacity style={s.incrementBtn} onPress={()=>handleUpdateProgress(selectedJob)} disabled={processing===selectedJob.id}>
                      {processing===selectedJob.id
                        ? <ActivityIndicator color="#FFF" />
                        : <Text style={s.incrementText}>INCREMENT PROGRESS (+20%)</Text>
                      }
                    </TouchableOpacity>
                  </View>
                )}
                <View style={{height:80}} />
              </>}
            </ScrollView>
          </View>
        </KeyboardAvoidingView>
      </Modal>

      {currentUser && selectedJob && (
        <ChatModal visible={showChat} onClose={()=>setShowChat(false)} orderId={selectedJob.id} currentUser={currentUser} />
      )}
    </View>
  );
}

const s = StyleSheet.create({
  container: {flex:1, backgroundColor:'#F8FAFC'},
  header: {paddingTop:55, paddingHorizontal:20, paddingBottom:20, borderBottomLeftRadius:28, borderBottomRightRadius:28},
  headerRow: {flexDirection:'row', justifyContent:'space-between', alignItems:'center', marginBottom:16},
  title: {fontSize:22, fontWeight:'900', color:'#FFF'},
  statusRow: {flexDirection:'row', alignItems:'center', marginTop:4, gap:6},
  dot: {width:8, height:8, borderRadius:4, backgroundColor:'rgba(255,255,255,0.4)'},
  dotLive: {backgroundColor:'#4ADE80'},
  statusText: {fontSize:12, color:'rgba(255,255,255,0.8)', fontWeight:'600'},
  toggleBtn: {backgroundColor:'rgba(255,255,255,0.15)', paddingHorizontal:10, paddingVertical:4, borderRadius:8},
  toggleText: {fontSize:10, fontWeight:'900', color:'#FFF'},
  refreshBtn: {width:38, height:38, borderRadius:12, backgroundColor:'rgba(255,255,255,0.2)', alignItems:'center', justifyContent:'center'},
  tabRow: {flexDirection:'row', gap:10},
  tab: {flex:1, paddingVertical:10, alignItems:'center', borderRadius:14, backgroundColor:'rgba(255,255,255,0.15)'},
  tabActive: {backgroundColor:'#FFF'},
  tabText: {fontSize:11, fontWeight:'800', color:'rgba(255,255,255,0.8)'},
  tabTextActive: {color:'#4F46E5'},
  list: {padding:20, paddingBottom:100},
  card: {backgroundColor:'#FFF', borderRadius:20, padding:16, marginBottom:12, elevation:2, shadowColor:'#4F46E5', shadowOpacity:0.06, shadowRadius:8},
  catBadge: {alignSelf:'flex-start', paddingHorizontal:10, paddingVertical:4, borderRadius:10, marginBottom:10},
  catText: {fontSize:11, fontWeight:'800', color:'#475569'},
  cardBody: {flexDirection:'row', justifyContent:'space-between', alignItems:'flex-start', marginBottom:12},
  clientName: {fontSize:12, color:'#94A3B8', fontWeight:'600'},
  jobTitle: {fontSize:15, fontWeight:'800', color:'#1E293B', marginTop:2},
  price: {fontSize:18, fontWeight:'900', color:'#4F46E5'},
  progressRow: {flexDirection:'row', alignItems:'center', gap:10, marginBottom:12},
  progressBg: {flex:1, height:6, backgroundColor:'#EDE7F6', borderRadius:3},
  progressFill: {height:6, backgroundColor:'#4F46E5', borderRadius:3},
  progressPct: {fontSize:11, fontWeight:'900', color:'#4F46E5'},
  acceptBtn: {flexDirection:'row', alignItems:'center', justifyContent:'center', backgroundColor:'#059669', borderRadius:14, paddingVertical:12, gap:8},
  acceptText: {color:'#FFF', fontWeight:'800', fontSize:14},
  statusBadge: {paddingVertical:10, alignItems:'center', borderRadius:14},
  badgeDone: {backgroundColor:'#E8F5E9'},
  badgeLive: {backgroundColor:'#EDE7F6'},
  statusBadgeText: {fontSize:13, fontWeight:'800'},
  claimBtn: {flexDirection:'row', alignItems:'center', justifyContent:'center', backgroundColor:'#4F46E5', borderRadius:14, paddingVertical:12, gap:8, marginTop:4},
  claimText: {color:'#FFF', fontWeight:'800', fontSize:14},
  empty: {alignItems:'center', paddingTop:80},
  emptyTitle: {fontSize:16, fontWeight:'800', color:'#94A3B8', marginTop:14},
  // Modal
  modalOverlay: {flex:1, backgroundColor:'rgba(0,0,0,0.45)', justifyContent:'flex-end'},
  modalSheet: {borderTopLeftRadius:32, borderTopRightRadius:32, height:'92%', backgroundColor:'#F8FAFC', overflow:'hidden'},
  modalHeader: {padding:22, borderTopLeftRadius:32, borderTopRightRadius:32},
  modalHeaderRow: {flexDirection:'row', justifyContent:'space-between', alignItems:'center'},
  modalTitle: {fontSize:20, fontWeight:'900', color:'#FFF'},
  modalSub: {fontSize:13, color:'rgba(255,255,255,0.75)', fontWeight:'600', marginTop:3},
  closeBtn: {width:36, height:36, borderRadius:10, backgroundColor:'rgba(255,255,255,0.2)', alignItems:'center', justifyContent:'center'},
  modalBody: {padding:20},
  clientCard: {flexDirection:'row', alignItems:'center', backgroundColor:'#FFF', borderRadius:18, padding:14, marginBottom:20, elevation:1},
  clientAvatar: {width:46, height:46, borderRadius:14, backgroundColor:'#EDE7F6', alignItems:'center', justifyContent:'center'},
  clientAvatarText: {fontSize:20, fontWeight:'900', color:'#4F46E5'},
  clientCardName: {fontSize:16, fontWeight:'800', color:'#1E293B'},
  clientCardRole: {fontSize:12, color:'#64748B', fontWeight:'600'},
  contactBtns: {flexDirection:'row', gap:8},
  contactBtn: {width:40, height:40, borderRadius:12, alignItems:'center', justifyContent:'center'},
  secLabel: {fontSize:10, fontWeight:'900', color:'#94A3B8', letterSpacing:1.2, marginBottom:10},
  secRow: {flexDirection:'row', justifyContent:'space-between', alignItems:'center', marginBottom:10},
  addLink: {fontSize:12, fontWeight:'800', color:'#4F46E5'},
  infoCard: {backgroundColor:'#FFF', borderRadius:16, padding:14, marginBottom:18, elevation:1},
  infoText: {fontSize:14, color:'#475569', lineHeight:22, fontWeight:'600'},
  mediaCard: {flexDirection:'row', alignItems:'center', backgroundColor:'#FFF', borderRadius:18, padding:14, marginBottom:20, elevation:1},
  mediaIcon: {width:42, height:42, borderRadius:12, backgroundColor:'#4F46E5', alignItems:'center', justifyContent:'center'},
  mediaName: {fontSize:14, fontWeight:'700', color:'#1E293B'},
  mediaSub: {fontSize:12, color:'#94A3B8', marginTop:2},
  previewItem: {flexDirection:'row', alignItems:'center', backgroundColor:'#FFF', borderRadius:14, padding:14, marginBottom:8, elevation:1},
  previewText: {flex:1, marginLeft:10, fontSize:14, fontWeight:'700', color:'#475569'},
  inputBox: {backgroundColor:'#EDE7F6', borderRadius:18, padding:14, marginBottom:14},
  inputLabel: {fontSize:11, fontWeight:'700', color:'#4F46E5', marginBottom:8},
  textInput: {backgroundColor:'#FFF', padding:12, borderRadius:12, fontSize:14, borderWidth:1, borderColor:'#DDD6FE'},
  inputBtns: {flexDirection:'row', justifyContent:'flex-end', alignItems:'center', marginTop:10, gap:12},
  cancelBtn: {paddingVertical:8},
  cancelText: {fontSize:14, color:'#64748B', fontWeight:'700'},
  actionBtn: {paddingHorizontal:18, paddingVertical:10, borderRadius:12},
  actionBtnText: {color:'#FFF', fontWeight:'800', fontSize:13},
  deliveredCard: {backgroundColor:'#E8F5E9', borderRadius:18, padding:16, marginBottom:16, alignItems:'center', gap:8},
  deliveredText: {fontSize:12, fontWeight:'900', color:'#FB8C00', letterSpacing:0.5},
  viewFinalBtn: {backgroundColor:'#FFF', paddingHorizontal:20, paddingVertical:10, borderRadius:12, marginTop:4},
  viewFinalText: {color:'#4F46E5', fontWeight:'800'},
  deliverBtn: {borderRadius:18, overflow:'hidden', marginBottom:16, elevation:4, shadowColor:'#4F46E5', shadowOpacity:0.2, shadowRadius:8},
  deliverGrad: {flexDirection:'row', alignItems:'center', justifyContent:'center', paddingVertical:16, gap:10},
  deliverText: {color:'#FFF', fontSize:15, fontWeight:'900'},
  progressPctLarge: {fontSize:16, fontWeight:'900', color:'#4F46E5'},
  largePbg: {height:8, backgroundColor:'#EDE7F6', borderRadius:4, marginBottom:16, overflow:'hidden'},
  largePfill: {height:8, backgroundColor:'#4F46E5', borderRadius:4},
  incrementBtn: {backgroundColor:'#4F46E5', paddingVertical:16, borderRadius:16, alignItems:'center'},
  incrementText: {color:'#FFF', fontSize:14, fontWeight:'900'},
});
