import React from 'react';
import { View, StyleSheet, ViewStyle, LayoutChangeEvent } from 'react-native';
import Colors from '@/constants/colors';

interface CardProps {
  children: React.ReactNode;
  style?: ViewStyle;
  elevation?: number;
  onLayout?: (event: LayoutChangeEvent) => void;
}

export const Card: React.FC<CardProps> = ({ 
  children, 
  style,
  elevation = 2,
  onLayout
}) => {
  return (
    <View style={[styles.card, { elevation }, style]} onLayout={onLayout}>
      {children}
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.white,
    borderRadius: 12,
    padding: 16,
    marginVertical: 8,
    shadowColor: Colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
});