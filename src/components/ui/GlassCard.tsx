import React from 'react';
import { View, StyleSheet, ViewStyle } from 'react-native';
import { BlurView } from 'expo-blur';
import { useTheme } from '@react-navigation/native';

interface GlassCardProps {
  children: React.ReactNode;
  style?: ViewStyle;
  intensity?: number;
}

export const GlassCard: React.FC<GlassCardProps> = ({ children, style, intensity = 40 }) => {
  const { dark } = useTheme();
  
  return (
    <BlurView 
      intensity={intensity} 
      style={[
        styles.container, 
        dark && styles.darkContainer,
        style
      ]} 
      tint={dark ? "dark" : "light"}
    >
      {children}
    </BlurView>
  );
};

const styles = StyleSheet.create({
  container: {
    borderRadius: 24,
    padding: 16,
    overflow: 'hidden',
    backgroundColor: 'rgba(255, 255, 255, 0.7)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.5)',
    shadowColor: '#8B5CF6',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.05,
    shadowRadius: 15,
    elevation: 3,
  },
  darkContainer: {
    backgroundColor: 'rgba(30, 41, 59, 0.7)',
    borderColor: 'rgba(255, 255, 255, 0.1)',
  }
});
