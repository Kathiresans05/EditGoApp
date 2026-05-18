import { DefaultTheme, DarkTheme, ThemeProvider } from '@react-navigation/native';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useEffect, useState } from 'react';
import * as SplashScreen from 'expo-splash-screen';
import { useColorScheme } from 'react-native';
import 'react-native-reanimated';
import '../global.css';

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

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

