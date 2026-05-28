import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image, TextInput, Alert, ActivityIndicator, Modal } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { ChevronLeft, Plus, Video as VideoIcon, Play, Trash2, Edit3, Heart, Check, X } from 'lucide-react-native';
import { useRouter } from 'expo-router';
import * as ImagePicker from 'expo-image-picker';
import { Video, ResizeMode } from 'expo-av';
import api from '../../src/services/api';

export default function EditorPortfolioScreen() {
  const router = useRouter();
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [addingItem, setAddingItem] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newCategory, setNewCategory] = useState('');
  const [selectedVideo, setSelectedVideo] = useState<any>(null);
  
  const [videoModalVisible, setVideoModalVisible] = useState(false);
  const [selectedPlayUrl, setSelectedPlayUrl] = useState('');
  const [selectedPlayTitle, setSelectedPlayTitle] = useState('');

  useEffect(() => {
    fetchProfile();
  }, []);

  const optimizeUrl = (url: string) => {
    if (url && url.includes('cloudinary.com') && !url.includes('q_auto')) {
      return url.replace('/upload/', '/upload/q_auto,f_auto/');
    }
    return url;
  };

  const fetchProfile = async () => {
    try {
      setLoading(true);
      const res = await api.get('/editor/profile');
      setProfile(res.data.editor);
    } catch (e) {
      console.log('Error fetching portfolio', e);
    } finally {
      setLoading(false);
    }
  };

  const handleSelectVideo = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ['videos'],
        allowsEditing: false,
        quality: 1,
      });
      if (!result.canceled && result.assets && result.assets.length > 0) {
        setSelectedVideo(result.assets[0]);
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to pick video');
    }
  };

  const handleAddItem = async () => {
    if (!newTitle || !newCategory || !selectedVideo) {
      Alert.alert('Missing Fields', 'Please add a title, category, and select a video.');
      return;
    }
    
    try {
      setAddingItem(true);
      
      const formData = new FormData() as any;
      formData.append('title', newTitle);
      formData.append('category', newCategory);
      
      // Get filename from URI
      const uriParts = selectedVideo.uri.split('/');
      let fileName = uriParts[uriParts.length - 1];
      if (!fileName.includes('.')) fileName += '.mp4'; // Fallback extension
      
      formData.append('video', {
        uri: selectedVideo.uri,
        name: fileName,
        type: 'video/mp4'
      });

      await api.post('/editor/portfolio', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      
      setNewTitle('');
      setNewCategory('');
      setSelectedVideo(null);
      fetchProfile();
      Alert.alert('Success', 'Portfolio item uploaded successfully!');
    } catch (e: any) {
      Alert.alert('Error', e.response?.data?.message || 'Failed to add portfolio item');
    } finally {
      setAddingItem(false);
    }
  };

  const handleDelete = (id: string) => {
    Alert.alert(
      'Delete Portfolio Item',
      'Are you sure you want to delete this video?',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Delete', 
          style: 'destructive',
          onPress: async () => {
            try {
              await api.delete(`/editor/portfolio/${id}`);
              fetchProfile();
            } catch (e) {
              Alert.alert('Error', 'Failed to delete item');
            }
          }
        }
      ]
    );
  };

  if (loading) {
    return (
      <View style={s.centerContainer}>
        <ActivityIndicator size="large" color="#4F46E5" />
      </View>
    );
  }

  return (
    <View style={s.container}>
      <LinearGradient colors={['#4F46E5', '#7C3AED']} style={s.header}>
        <TouchableOpacity onPress={() => router.back()} style={s.backBtn}>
          <ChevronLeft size={24} color="#FFF" />
        </TouchableOpacity>
        <Text style={s.title}>My Portfolio</Text>
        <View style={{width: 24}} />
      </LinearGradient>

      <ScrollView style={s.body} contentContainerStyle={{paddingBottom: 40}}>
        {/* Editor Stats Header */}
        <View style={s.statsCard}>
          <View style={s.statBox}>
            <Text style={s.statVal}>{profile?.portfolio?.length || 0}</Text>
            <Text style={s.statLabel}>Projects</Text>
          </View>
          <View style={s.divider} />
          <View style={s.statBox}>
            <Text style={s.statVal}>{profile?.rating || '0.0'} ★</Text>
            <Text style={s.statLabel}>Avg Rating</Text>
          </View>
          <View style={s.divider} />
          <View style={s.statBox}>
            <Text style={s.statVal}>{profile?.totalOrders || 0}</Text>
            <Text style={s.statLabel}>Orders Done</Text>
          </View>
        </View>

        {/* Add New Item */}
        <View style={s.addCard}>
          <Text style={s.sectionTitle}>Add New Showcase</Text>
          <TextInput 
            style={s.input} 
            placeholder="Project Title (e.g., Cyberpunk Vlog Edit)" 
            value={newTitle}
            onChangeText={setNewTitle}
          />
          <TextInput 
            style={s.input} 
            placeholder="Category (e.g., Gaming, Vlogs, Real Estate)" 
            value={newCategory}
            onChangeText={setNewCategory}
          />
          
          <TouchableOpacity style={[s.uploadBox, selectedVideo && { borderColor: '#4F46E5', backgroundColor: '#EEF2FF' }]} onPress={handleSelectVideo}>
            {selectedVideo ? (
              <>
                <Check size={24} color="#4F46E5" />
                <Text style={[s.uploadText, { color: '#4F46E5' }]}>Video Selected</Text>
              </>
            ) : (
              <>
                <VideoIcon size={24} color="#64748B" />
                <Text style={s.uploadText}>Select Video File</Text>
              </>
            )}
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={s.submitBtn} 
            onPress={handleAddItem}
            disabled={addingItem}
          >
            {addingItem ? <ActivityIndicator color="#FFF" /> : <Text style={s.submitBtnText}>Upload to Portfolio</Text>}
          </TouchableOpacity>
        </View>

        <Text style={[s.sectionTitle, {marginTop: 16, marginBottom: 12}]}>Showcase Gallery</Text>
        
        {/* Portfolio Grid */}
        <View style={s.grid}>
          {profile?.portfolio?.length === 0 && (
            <Text style={s.emptyText}>Your portfolio is empty. Upload your best edits to attract more customers!</Text>
          )}
          
          {profile?.portfolio?.map((item: any, index: number) => {
            const colors = [
              ['#4F46E5', '#7C3AED'],
              ['#F43F5E', '#E11D48'],
              ['#10B981', '#059669'],
              ['#F59E0B', '#D97706'],
              ['#3B82F6', '#2563EB']
            ];
            const itemGradient = colors[index % colors.length];

            return (
            <View key={item.id} style={s.portfolioItem}>
              <TouchableOpacity 
                style={s.imageContainer} 
                onPress={() => {
                  setSelectedPlayTitle(item.title);
                  setSelectedPlayUrl(optimizeUrl(item.videoUrl));
                  setVideoModalVisible(true);
                }}
              >
                {item.thumbnail && !item.thumbnail.includes('unsplash') ? (
                  <Image source={{uri: item.thumbnail}} style={s.thumbnail} />
                ) : (
                  <LinearGradient colors={itemGradient} style={s.thumbnailPlaceholder}>
                    <VideoIcon size={32} color="rgba(255,255,255,0.4)" />
                  </LinearGradient>
                )}
                
                <View style={s.playBtn}>
                  <Play size={20} color="#FFF" fill="#FFF" style={{marginLeft: 3}} />
                </View>
                <TouchableOpacity style={s.deleteBtn} onPress={() => handleDelete(item.id)}>
                  <Trash2 size={16} color="#FFF" />
                </TouchableOpacity>
              </TouchableOpacity>
              <View style={s.itemInfo}>
                <Text style={s.itemTitle} numberOfLines={1}>{item.title}</Text>
                <Text style={s.itemCategory}>{item.category}</Text>
                <View style={s.likeRow}>
                  <Heart size={14} color="#F43F5E" />
                  <Text style={s.likeText}>{item.likes} Likes</Text>
                </View>
              </View>
            </View>
          )})}
        </View>
      </ScrollView>

      {/* Video Player Modal */}
      <Modal visible={videoModalVisible} animationType="slide" transparent={true} onRequestClose={() => setVideoModalVisible(false)}>
        <View style={s.modalBg}>
          <View style={s.modalHeader}>
            <Text style={s.modalTitle}>{selectedPlayTitle}</Text>
            <TouchableOpacity onPress={() => setVideoModalVisible(false)} style={s.modalCloseBtn}>
              <X size={20} color="#FFF" />
            </TouchableOpacity>
          </View>
          <View style={s.videoContainer}>
            {selectedPlayUrl ? (
              <Video
                source={{ uri: selectedPlayUrl }}
                style={s.fullVideo}
                useNativeControls
                resizeMode={ResizeMode.CONTAIN}
                isLooping
                shouldPlay={true}
              />
            ) : (
              <Text style={{ color: '#FFF' }}>Loading video...</Text>
            )}
          </View>
        </View>
      </Modal>
    </View>
  );
}

const s = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8FAFC' },
  centerContainer: { flex: 1, backgroundColor: '#F8FAFC', alignItems: 'center', justifyContent: 'center' },
  header: { paddingTop: 60, paddingBottom: 20, paddingHorizontal: 16, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  title: { fontSize: 18, fontWeight: '800', color: '#FFF' },
  backBtn: { width: 40, height: 40, borderRadius: 20, backgroundColor: 'rgba(255,255,255,0.2)', alignItems: 'center', justifyContent: 'center' },
  body: { padding: 20 },
  statsCard: { flexDirection: 'row', backgroundColor: '#FFF', borderRadius: 16, padding: 20, marginBottom: 24, elevation: 2, shadowColor: '#000', shadowOffset: {width: 0, height: 2}, shadowOpacity: 0.05, shadowRadius: 4 },
  statBox: { flex: 1, alignItems: 'center' },
  statVal: { fontSize: 22, fontWeight: '900', color: '#1E293B', marginBottom: 4 },
  statLabel: { fontSize: 13, color: '#64748B', fontWeight: '600' },
  divider: { width: 1, backgroundColor: '#F1F5F9', marginHorizontal: 12 },
  addCard: { backgroundColor: '#FFF', borderRadius: 16, padding: 20, marginBottom: 24, borderWidth: 1, borderColor: '#E2E8F0' },
  sectionTitle: { fontSize: 18, fontWeight: '800', color: '#1E293B', marginBottom: 16 },
  input: { backgroundColor: '#F8FAFC', padding: 14, borderRadius: 12, borderWidth: 1, borderColor: '#E2E8F0', marginBottom: 12, fontSize: 15 },
  uploadBox: { height: 100, backgroundColor: '#F8FAFC', borderRadius: 12, borderWidth: 2, borderColor: '#E2E8F0', borderStyle: 'dashed', alignItems: 'center', justifyContent: 'center', marginBottom: 16, gap: 8 },
  uploadText: { color: '#64748B', fontWeight: '600' },
  submitBtn: { backgroundColor: '#4F46E5', padding: 16, borderRadius: 12, alignItems: 'center' },
  submitBtnText: { color: '#FFF', fontWeight: '800', fontSize: 16 },
  emptyText: { color: '#64748B', textAlign: 'center', paddingVertical: 24, lineHeight: 22, width: '100%' },
  grid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between' },
  portfolioItem: { width: '48%', backgroundColor: '#FFF', borderRadius: 16, marginBottom: 16, overflow: 'hidden', elevation: 1 },
  imageContainer: { width: '100%', height: 140, position: 'relative' },
  thumbnail: { width: '100%', height: '100%', resizeMode: 'cover' },
  thumbnailPlaceholder: { width: '100%', height: '100%', alignItems: 'center', justifyContent: 'center' },
  playBtn: { position: 'absolute', top: '50%', left: '50%', marginTop: -20, marginLeft: -20, width: 40, height: 40, backgroundColor: 'rgba(0,0,0,0.6)', borderRadius: 20, alignItems: 'center', justifyContent: 'center' },
  deleteBtn: { position: 'absolute', top: 8, right: 8, backgroundColor: 'rgba(220, 38, 38, 0.9)', width: 28, height: 28, borderRadius: 14, alignItems: 'center', justifyContent: 'center' },
  itemInfo: { padding: 12 },
  itemTitle: { fontSize: 14, fontWeight: '700', color: '#1E293B', marginBottom: 4 },
  itemCategory: { fontSize: 12, color: '#64748B', marginBottom: 8 },
  likeRow: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  likeText: { fontSize: 12, color: '#F43F5E', fontWeight: '600' },
  modalBg: { flex: 1, backgroundColor: '#0F172A', paddingTop: 60 },
  modalHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 20, paddingBottom: 20 },
  modalTitle: { color: '#FFF', fontSize: 18, fontWeight: '800' },
  modalCloseBtn: { width: 40, height: 40, borderRadius: 20, backgroundColor: 'rgba(255,255,255,0.1)', alignItems: 'center', justifyContent: 'center' },
  videoContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#000' },
  fullVideo: { width: '100%', height: '100%' }
});
