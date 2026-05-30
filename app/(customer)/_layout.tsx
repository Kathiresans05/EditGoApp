import { Tabs, useRouter } from 'expo-router';
import { Home, MessageSquare, Clock, User, Zap } from 'lucide-react-native';
import { View, StyleSheet, Platform } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

export default function CustomerLayout() {
  const router = useRouter();
  return (
    <Tabs screenOptions={{
      headerShown: false,
      tabBarActiveTintColor: '#8B5CF6',
      tabBarInactiveTintColor: '#94A3B8',
      tabBarLabelStyle: {
        fontSize: 10,
        fontWeight: '700',
        marginBottom: 8,
      },
      tabBarStyle: {
        position: 'absolute',
        bottom: Platform.OS === 'ios' ? 30 : 15,
        left: 20,
        right: 20,
        height: 75,
        borderRadius: 24,
        backgroundColor: '#FFFFFF',
        borderTopWidth: 0,
        paddingTop: 12,
        paddingBottom: 8,
        shadowColor: '#8B5CF6',
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 0.15,
        shadowRadius: 20,
        elevation: 10,
      }
    }}>
      <Tabs.Screen 
        name="home" 
        options={{ 
          tabBarLabel: 'Home',
          tabBarIcon: ({ color, focused }) => (
            <View style={focused && styles.activeIconBg}>
              <Home size={22} color={color} />
            </View>
          ) 
        }} 
      />
      <Tabs.Screen 
        name="chat" 
        options={{ 
          tabBarLabel: 'Chat',
          tabBarIcon: ({ color, focused }) => (
            <View style={focused && styles.activeIconBg}>
              <MessageSquare size={22} color={color} />
            </View>
          ) 
        }} 
      />
      
      {/* Central Quick Upload */}
      <Tabs.Screen 
        name="upload_fab" 
        listeners={{
          tabPress: (e) => {
            e.preventDefault();
            router.push('/(customer)/rapid-studio');
          },
        }}
        options={{ 
          tabBarLabel: 'Edit',
          tabBarIcon: ({ color }) => (
            <View style={styles.fabContainer}>
              <LinearGradient
                colors={['#8B5CF6', '#3B82F6']}
                style={styles.fab}
              >
                <Zap size={24} color="#FFF" />
              </LinearGradient>
            </View>
          ) 
        }} 
      />

      <Tabs.Screen 
        name="history" 
        options={{ 
          tabBarLabel: 'Orders',
          tabBarIcon: ({ color, focused }) => (
            <View style={focused && styles.activeIconBg}>
              <Clock size={22} color={color} />
            </View>
          ) 
        }} 
      />
      <Tabs.Screen 
        name="profile" 
        options={{ 
          tabBarLabel: 'Profile',
          tabBarIcon: ({ color, focused }) => (
            <View style={focused && styles.activeIconBg}>
              <User size={22} color={color} />
            </View>
          ) 
        }} 
      />

      {/* Hiding these from tabs but keeping in group */}
      <Tabs.Screen name="rapid-studio" options={{ href: null }} />
      <Tabs.Screen name="upload" options={{ href: null }} />
      <Tabs.Screen name="matching" options={{ href: null }} />
      <Tabs.Screen name="tracking" options={{ href: null }} />
      <Tabs.Screen name="ai-studio" options={{ href: null }} />
      <Tabs.Screen name="membership" options={{ href: null }} />
      <Tabs.Screen name="personal-info" options={{ href: null }} />
      <Tabs.Screen name="payment-methods" options={{ href: null }} />
      <Tabs.Screen name="help-center" options={{ href: null }} />
      <Tabs.Screen name="privacy-policy" options={{ href: null }} />
      <Tabs.Screen name="privacy-settings" options={{ href: null }} />
      <Tabs.Screen name="report-issue" options={{ href: null }} />
      <Tabs.Screen name="checkout" options={{ href: null }} />
      <Tabs.Screen name="editor/[id]" options={{ href: null }} />
    </Tabs>

  );
}

const styles = StyleSheet.create({
  activeIconBg: {
    backgroundColor: '#F5F3FF',
    padding: 8,
    borderRadius: 12,
  },
  fabContainer: {
    top: -20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  fab: {
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#8B5CF6',
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 5,
  }
});
