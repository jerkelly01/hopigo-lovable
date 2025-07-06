import React from 'react';
import { TouchableOpacity, Text, StyleSheet, ViewStyle, View } from 'react-native';
import { SubCategory } from '@/types/marketplace';
import Colors from '@/constants/colors';
import * as Icons from 'lucide-react-native';

interface SubCategoryCardProps {
  subCategory: SubCategory;
  onPress: (subCategory: SubCategory) => void;
  isSelected?: boolean;
  isCompact?: boolean;
  style?: ViewStyle;
}

export const SubCategoryCard: React.FC<SubCategoryCardProps> = ({
  subCategory,
  onPress,
  isSelected = false,
  isCompact = false,
  style,
}) => {
  // Dynamically get the icon component
  const IconComponent = (Icons as any)[subCategory.icon.charAt(0).toUpperCase() + subCategory.icon.slice(1)];
  
  return (
    <TouchableOpacity
      onPress={() => onPress(subCategory)}
      style={[
        isCompact ? styles.compactContainer : styles.container,
        isSelected && styles.selectedContainer,
        style
      ]}
      activeOpacity={0.7}
    >
      <View style={styles.iconContainer}>
        {IconComponent && (
          <IconComponent 
            size={isCompact ? 16 : 20} 
            color={isSelected ? Colors.white : Colors.primary} 
          />
        )}
      </View>
      <Text style={[
        isCompact ? styles.compactText : styles.text,
        isSelected && styles.selectedText
      ]} numberOfLines={2}>
        {subCategory.name}
      </Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'column',
    alignItems: 'center',
    backgroundColor: Colors.card,
    paddingVertical: 12,
    paddingHorizontal: 8,
    borderRadius: 12,
    marginBottom: 8,
    minHeight: 80,
    justifyContent: 'center',
    width: 100,
  },
  compactContainer: {
    flexDirection: 'column',
    alignItems: 'center',
    backgroundColor: Colors.card,
    paddingVertical: 12,
    paddingHorizontal: 8,
    borderRadius: 12,
    marginBottom: 8,
    minHeight: 70,
    justifyContent: 'center',
  },
  selectedContainer: {
    backgroundColor: Colors.primary,
  },
  iconContainer: {
    marginBottom: 6,
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    fontSize: 12,
    fontWeight: '500',
    color: Colors.text,
    textAlign: 'center',
    lineHeight: 14,
  },
  compactText: {
    fontSize: 12,
    fontWeight: '500',
    color: Colors.text,
    textAlign: 'center',
    marginTop: 4,
    lineHeight: 14,
  },
  selectedText: {
    color: Colors.white,
  },
});