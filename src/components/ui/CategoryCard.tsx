import React from 'react';
import { View, Text, TouchableOpacity, Image, StyleSheet } from 'react-native';
import { GlassCard } from './GlassCard';
import { LinearGradient } from 'expo-linear-gradient';

interface CategoryCardProps {
  title: string;
  icon: string;
  price: string;
  onPress: () => void;
  colors?: string[];
}

export const CategoryCard: React.FC<CategoryCardProps> = ({ 
  title, 
  icon, 
  price, 
  onPress,
  colors = ['#FFFFFF', '#F8FAFC']
}) => {
  return (
    <TouchableOpacity onPress={onPress} activeOpacity={0.9} style={styles.container}>
      <GlassCard style={styles.card}>
        <View style={styles.iconContainer}>
          <Text style={styles.iconText}>{icon}</Text>
        </View>
        <View style={styles.content}>
          <Text style={styles.title}>{title}</Text>
          <Text style={styles.price}>Starts @ ₹{price}</Text>
        </View>
      </GlassCard>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '48%',
    marginBottom: 16,
  },
  card: {
    height: 140,
    padding: 12,
    justifyContent: 'space-between',
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 14,
    backgroundColor: '#F1F5F9',
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconText: {
    fontSize: 24,
  },
  content: {
    marginTop: 8,
  },
  title: {
    fontSize: 15,
    fontWeight: '700',
    color: '#1E293B',
  },
  price: {
    fontSize: 12,
    color: '#8B5CF6',
    fontWeight: '600',
    marginTop: 4,
  },
});
