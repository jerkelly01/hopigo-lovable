import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import Colors from '@/constants/colors';
import { HomeServicesIcon } from './HomeServicesIcon';
import { FeaturedService } from '@/constants/featured-services';

interface FeaturedServiceCardProps {
  service: FeaturedService;
  onPress: (service: FeaturedService) => void;
  style?: any;
}

export function FeaturedServiceCard({ service, onPress, style }: FeaturedServiceCardProps) {
  return (
    <TouchableOpacity
      style={[styles.container, style]}
      onPress={() => onPress(service)}
      activeOpacity={0.8}
    >
      <View style={[styles.iconContainer, { backgroundColor: service.color + '20' }]}>
        <HomeServicesIcon
          name={service.icon}
          size={24}
          color={service.color}
        />
      </View>
      <View style={styles.textContainer}>
        <Text style={styles.serviceName} numberOfLines={1}>
          {service.name}
        </Text>
        <Text style={styles.serviceDescription} numberOfLines={2}>
          {service.description}
        </Text>
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
    minHeight: 100,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  textContainer: {
    width: '100%',
    alignItems: 'center',
    flex: 1,
  },
  serviceName: {
    fontSize: 13,
    fontWeight: '600',
    color: Colors.text,
    textAlign: 'center',
    marginBottom: 4,
  },
  serviceDescription: {
    fontSize: 11,
    color: Colors.textSecondary,
    textAlign: 'center',
    lineHeight: 14,
  },
});