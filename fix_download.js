const fs = require('fs');
const path = 'app/(editor)/requests.tsx';
let content = fs.readFileSync(path, 'utf8');

// 1) Add imports after the ImagePicker import (line 17)
const newImports = `import * as FileSystem from 'expo-file-system';
import * as MediaLibrary from 'expo-media-library';
import * as Sharing from 'expo-sharing';`;

content = content.replace(
  "import * as ImagePicker from 'expo-image-picker';",
  "import * as ImagePicker from 'expo-image-picker';\n" + newImports
);

// 2) Add downloadProgress state after the existing states (after line ~30 area)
content = content.replace(
  "const [showPreviewInput, setShowPreviewInput] = useState(false);",
  "const [showPreviewInput, setShowPreviewInput] = useState(false);\n  const [downloadProgress, setDownloadProgress] = useState<number|null>(null);"
);

// 3) Replace the Source Media TouchableOpacity with a download button
const oldButton = `                <TouchableOpacity style={s.mediaCard} onPress={async () => {
                  try {
                    const response = await editorService.getSignedVideo(selectedJob.id);
                    const signedUrl = response.signedUrl || response.url;
                    openURL(signedUrl);
                  } catch (e) {
                    console.error('Failed to get signed video', e);
                    openURL('https://assets.mixkit.co/videos/preview/mixkit-girl-in-neon-sign-1232-large.mp4');
                  }
                }}>
                  <View style={s.mediaIcon}><Play size={18} color="#FFF" fill="#FFF" /></View>
                  <View style={{flex:1, marginLeft:12}}>
                    <Text style={s.mediaName}>Raw Footage</Text>
                    <Text style={s.mediaSub}>Download &amp; start editing</Text>
                  </View>
                  <ChevronRight size={18} color="#CBD5E1" />
                </TouchableOpacity>`;

const newButton = `                <TouchableOpacity style={s.mediaCard} onPress={async () => {
                  try {
                    setDownloadProgress(0);
                    const response = await editorService.getSignedVideo(selectedJob.id);
                    const videoUrl = response.signedUrl || response.url || 'https://assets.mixkit.co/videos/preview/mixkit-girl-in-neon-sign-1232-large.mp4';
                    
                    const fileName = 'EditGo_Raw_' + selectedJob.id + '_' + Date.now() + '.mp4';
                    const fileUri = FileSystem.documentDirectory + fileName;

                    const downloadResumable = FileSystem.createDownloadResumable(
                      videoUrl,
                      fileUri,
                      {},
                      (dp) => {
                        const pct = dp.totalBytesExpectedToWrite > 0
                          ? Math.round((dp.totalBytesWritten / dp.totalBytesExpectedToWrite) * 100)
                          : 0;
                        setDownloadProgress(pct);
                      }
                    );

                    const result = await downloadResumable.downloadAsync();
                    if (!result?.uri) throw new Error('Download failed');

                    // Save to gallery
                    const { status } = await MediaLibrary.requestPermissionsAsync();
                    if (status === 'granted') {
                      await MediaLibrary.saveToLibraryAsync(result.uri);
                      setDownloadProgress(null);
                      Alert.alert('\\u2705 Download Complete', 'Raw footage saved to your gallery! Open your gallery app to start editing.');
                    } else {
                      // If no gallery permission, use sharing
                      setDownloadProgress(null);
                      if (await Sharing.isAvailableAsync()) {
                        await Sharing.shareAsync(result.uri);
                      } else {
                        Alert.alert('Downloaded', 'File saved at: ' + result.uri);
                      }
                    }
                  } catch (e: any) {
                    console.error('Download failed', e);
                    setDownloadProgress(null);
                    Alert.alert('Download Failed', e.message || 'Could not download the video. Please try again.');
                  }
                }} disabled={downloadProgress !== null}>
                  {downloadProgress !== null ? (
                    <>
                      <View style={[s.mediaIcon, {backgroundColor:'#059669'}]}>
                        <ActivityIndicator size={16} color="#FFF" />
                      </View>
                      <View style={{flex:1, marginLeft:12}}>
                        <Text style={s.mediaName}>Downloading... {downloadProgress}%</Text>
                        <View style={{height:4, backgroundColor:'#E2E8F0', borderRadius:2, marginTop:6}}>
                          <View style={{height:4, backgroundColor:'#059669', borderRadius:2, width: downloadProgress + '%' as any}} />
                        </View>
                      </View>
                    </>
                  ) : (
                    <>
                      <View style={s.mediaIcon}><Play size={18} color="#FFF" fill="#FFF" /></View>
                      <View style={{flex:1, marginLeft:12}}>
                        <Text style={s.mediaName}>Raw Footage</Text>
                        <Text style={s.mediaSub}>Tap to download to gallery</Text>
                      </View>
                      <ChevronRight size={18} color="#CBD5E1" />
                    </>
                  )}
                </TouchableOpacity>`;

content = content.replace(oldButton, newButton);

fs.writeFileSync(path, content, 'utf8');
console.log('Done! Download feature added.');

// Verify
const lines = fs.readFileSync(path, 'utf8').split('\n');
console.log('Total lines:', lines.length);
console.log('--- Lines 295-320 ---');
for (let i = 294; i < Math.min(320, lines.length); i++) {
  console.log('[' + (i+1) + ']: ' + lines[i]);
}
