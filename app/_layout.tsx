import { DefaultTheme, DarkTheme, ThemeProvider } from '@react-navigation/native';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useEffect, useState } from 'react';
import * as SplashScreen from 'expo-splash-screen';
import { useColorScheme, Platform } from 'react-native';
import * as Device from 'expo-device';
import * as Notifications from 'expo-notifications';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { BASE_URL } from '../src/services/api';
import 'react-native-reanimated';
import '../global.css';

SplashScreen.preventAutoHideAsync();

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

async function registerForPushNotificationsAsync() {
  if (Platform.OS === 'android') {
    Notifications.setNotificationChannelAsync('default', {
      name: 'default',
      importance: Notifications.AndroidImportance.MAX,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: '#8B5CF6',
    });
  }

  if (Device.isDevice) {
    const { status: existingStatus } = await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;
    if (existingStatus !== 'granted') {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }
    if (finalStatus !== 'granted') return null;
    
    try {
      const token = (await Notifications.getExpoPushTokenAsync()).data;
      return token;
    } catch(e) {
      console.log('Error getting push token', e);
    }
  }
  return null;
}

export const LightTheme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    primary: '#8B5CF6',
    background: '#F8FAFC',
    card: '#FFFFFF',
    text: '#1E293B',
    border: '#E2E8F0',
    notification: '#EC4899',
  },
};

export const PremiumDarkTheme = {
  ...DarkTheme,
  colors: {
    ...DarkTheme.colors,
    primary: '#A78BFA',
    background: '#0F172A',
    card: '#1E293B',
    text: '#F8FAFC',
    border: '#334155',
    notification: '#F472B6',
  },
};

export default function RootLayout() {
  const colorScheme = useColorScheme();

  useEffect(() => {
    registerForPushNotificationsAsync().then(token => {
      if (token) {
        AsyncStorage.getItem('token').then(jwt => {
          if (jwt) {
            axios.put(`${BASE_URL}/auth/push-token`, { pushToken: token }, {
              headers: { Authorization: `Bearer ${jwt}` }
            }).catch(e => console.log('Failed to save push token'));
          }
        });
      }
    });
    SplashScreen.hideAsync();
  }, []);

  return (
    <ThemeProvider value={colorScheme === 'dark' ? PremiumDarkTheme : LightTheme}>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="index" />
        <Stack.Screen name="login" />
        <Stack.Screen name="(customer)" />
        <Stack.Screen name="(editor)" />
      </Stack>
      <StatusBar style={colorScheme === 'dark' ? "light" : "dark"} />
    </ThemeProvider>
  );
}

