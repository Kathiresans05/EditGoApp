import { Tabs } from 'expo-router';
import { LayoutDashboard, Briefcase, DollarSign, User, Image, CreditCard } from 'lucide-react-native';
import { View, StyleSheet, Platform } from 'react-native';

export default function EditorLayout() {
  return (
    <Tabs screenOptions={{
      headerShown: false,
      tabBarActiveTintColor: '#8B5CF6',
      tabBarInactiveTintColor: '#94A3B8',
      tabBarLabelStyle: { fontSize: 9, fontWeight: '700', marginBottom: 5 },
      tabBarStyle: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        height: 85,
        backgroundColor: '#FFFFFF',
        borderTopWidth: 1,
        borderTopColor: '#F1F5F9',
        paddingTop: 12,
        paddingBottom: Platform.OS === 'ios' ? 25 : 12,
      }
    }}>
      <Tabs.Screen 
        name="dashboard" 
        options={{ 
          tabBarLabel: 'Dashboard',
          tabBarIcon: ({ color }) => <LayoutDashboard size={20} color={color} /> 
        }} 
      />
      <Tabs.Screen 
        name="requests" 
        options={{ 
          tabBarLabel: 'Jobs',
          tabBarIcon: ({ color }) => <Briefcase size={20} color={color} /> 
        }} 
      />
      <Tabs.Screen 
        name="earnings" 
        options={{ 
          tabBarLabel: 'Earnings',
          tabBarIcon: ({ color }) => <DollarSign size={20} color={color} /> 
        }} 
      />
      <Tabs.Screen 
        name="profile" 
        options={{ 
          tabBarLabel: 'Profile',
          tabBarIcon: ({ color }) => <User size={20} color={color} /> 
        }} 
      />
      <Tabs.Screen 
        name="portfolio" 
        options={{ 
          tabBarLabel: 'Portfolio',
          tabBarIcon: ({ color }) => <Image size={20} color={color} /> 
        }} 
      />
      <Tabs.Screen 
        name="subscriptions" 
        options={{ 
          tabBarLabel: 'Subscription',
          tabBarIcon: ({ color }) => <CreditCard size={20} color={color} /> 
        }} 
      />
    </Tabs>
  );
}
