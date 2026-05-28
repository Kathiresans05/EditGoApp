import React from 'react';
import { View, Modal, StyleSheet, TouchableOpacity, SafeAreaView, Platform } from 'react-native';
import { WebView } from 'react-native-webview';
import { X } from 'lucide-react-native';

interface LiveStreamModalProps {
  visible: boolean;
  onClose: () => void;
  roomId: string;
}

export default function LiveStreamModal({ visible, onClose, roomId }: LiveStreamModalProps) {
  // Using Jitsi Meet which provides a free, instant WebRTC video conference room.
  const jitsiUrl = `https://meet.jit.si/${roomId}#config.prejoinPageEnabled=false&config.disableDeepLinking=true&config.startWithAudioMuted=true&config.startWithVideoMuted=true`;

  return (
    <Modal visible={visible} animationType="slide" onRequestClose={onClose}>
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={onClose} style={styles.closeBtn}>
            <X size={24} color="#FFF" />
          </TouchableOpacity>
        </View>
        <WebView
          source={{ uri: jitsiUrl }}
          style={styles.webview}
          javaScriptEnabled={true}
          domStorageEnabled={true}
          allowsInlineMediaPlayback={true}
          mediaPlaybackRequiresUserAction={false}
          originWhitelist={['*']}
          userAgent="Mozilla/5.0 (Linux; Android 10; SM-G981B) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/80.0.3987.162 Mobile Safari/537.36"
        />
      </SafeAreaView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    padding: 16,
    paddingTop: Platform.OS === 'android' ? 40 : 16,
    backgroundColor: '#1E293B',
  },
  closeBtn: {
    padding: 8,
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: 8,
  },
  webview: {
    flex: 1,
  }
});
