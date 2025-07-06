import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import Colors from '@/constants/colors';
import { HomeServicesIcon } from './HomeServicesIcon';
import { Category } from '@/types/marketplace';

interface CategoryCardProps {
  category: Category;
  onPress: (category: Category) => void;
  style?: any;
  isMoreButton?: boolean;
  isSelected?: boolean;
}

export function CategoryCard({ category, onPress, style, isMoreButton = false, isSelected = false }: CategoryCardProps) {
  // Split the category name into multiple lines if needed
  const displayName = category.id === 'urgent' 
    ? ['On Demand', 'Services']
    : category.name.split(' ');

  return (
    <TouchableOpacity
      style={[
        styles.container, 
        style, 
        isSelected && styles.selectedContainer,
        isSelected && styles.selectedBackground
      ]}
      onPress={() => onPress(category)}
      activeOpacity={0.8}
    >
      <View style={[
        styles.iconContainer, 
        isMoreButton && styles.moreIconContainer,
        isSelected && styles.selectedIconContainer
      ]}>
        <HomeServicesIcon
          name={category.icon}
          size={24}
          color={isSelected ? Colors.primary : (isMoreButton ? Colors.primary : Colors.primary)}
        />
      </View>
      <View style={styles.textContainer}>
        {displayName.map((line, index) => (
          <Text 
            key={index}
            style={[
              styles.categoryName, 
              isMoreButton && styles.moreCategoryName,
              isSelected && styles.selectedCategoryName
            ]} 
            numberOfLines={1}
          >
            {line}
          </Text>
        ))}
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.card,
    borderRadius: 12,
    padding: 12,
    alignItems: 'center',
    shadowColor: Colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.8)',
  },
  selectedContainer: {
    borderColor: Colors.primary,
    borderWidth: 2,
  },
  selectedBackground: {
    backgroundColor: Colors.primary,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.primary + '20',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  selectedIconContainer: {
    backgroundColor: Colors.white,
  },
  moreIconContainer: {
    backgroundColor: Colors.primary + '20',
  },
  textContainer: {
    width: '100%',
    alignItems: 'center',
  },
  categoryName: {
    fontSize: 13,
    fontWeight: '500',
    color: Colors.text,
    textAlign: 'center',
    lineHeight: 16,
  },
  selectedCategoryName: {
    color: Colors.white,
    fontWeight: '600',
  },
  moreCategoryName: {
    color: Colors.primary,
    fontWeight: '600',
  },
});