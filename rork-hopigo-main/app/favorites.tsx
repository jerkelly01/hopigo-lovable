import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { Stack } from 'expo-router';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { ProviderCard } from '@/components/ProviderCard';
import { useMarketplaceStore } from '@/store/marketplace-store';
import { ArrowLeft, Heart, Star } from 'lucide-react-native';
import Colors from '@/constants/colors';
import { ServiceProvider } from '@/types/marketplace';

// Mock favorite providers data - Fixed pricing structure
const favoriteProviders: ServiceProvider[] = [
  {
    id: 'provider1',
    name: 'Maria Santos',
    avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b47c?w=400&auto=format&fit=crop&q=60&ixlib=rb-4.0.3',
    serviceImage: 'https://images.unsplash.com/photo-1632823471565-1ecdf7a5906e?w=400&auto=format&fit=crop&q=60&ixlib=rb-4.0.3',
    rating: 4.9,
    reviewCount: 127,
    verified: true,
    services: ['201', '202'],
    description: 'Professional cleaning and organizing services with 8+ years of experience.',
    serviceDescription: 'House Cleaning & Organization',
    location: 'Oranjestad, Aruba',
    pricing: {
      '201': { amount: 35, currency: 'AWG', description: 'Per hour' },
      '202': { amount: 45, currency: 'AWG', description: 'Per hour' },
    },
    availability: 'Mon-Sat: 8AM-6PM',
    responseTime: '~15 min',
  },
  {
    id: 'provider2',
    name: 'Carlos Rodriguez',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&auto=format&fit=crop&q=60&ixlib=rb-4.0.3',
    serviceImage: 'https://images.unsplash.com/photo-1486754735734-325b5831c3ad?w=400&auto=format&fit=crop&q=60&ixlib=rb-4.0.3',
    rating: 4.8,
    reviewCount: 89,
    verified: true,
    services: ['103', '104'],
    description: 'Reliable car services including towing and maintenance with 24/7 availability.',
    serviceDescription: 'Auto Repair & Roadside Assistance',
    location: 'San Nicolas, Aruba',
    pricing: {
      '103': { amount: 75, currency: 'AWG', description: 'Per service' },
      '104': { amount: 25, currency: 'AWG', description: 'Per service' },
    },
    availability: 'Daily: 24/7',
    responseTime: '~10 min',
  },
];

export default function FavoritesScreen() {
  const router = useRouter();
  const [selectedTab, setSelectedTab] = useState<'providers' | 'services'>('providers');

  const handleProviderSelect = (provider: ServiceProvider) => {
    router.push({
      pathname: '/provider/[id]',
      params: { id: provider.id }
    });
  };

  const handleRemoveFavorite = (providerId: string) => {
    // In a real app, this would remove from favorites
    console.log('Remove from favorites:', providerId);
  };

  return (
    <>
      <Stack.Screen 
        options={{ 
          title: 'Favorites',
          headerStyle: { backgroundColor: Colors.background },
          headerTintColor: Colors.text,
          headerTitleStyle: { fontWeight: '600' },
          headerLeft: () => (
            <TouchableOpacity onPress={() => router.back()}>
              <ArrowLeft size={24} color={Colors.text} />
            </TouchableOpacity>
          ),
        }} 
      />
      
      <View style={styles.container}>
        <View style={styles.tabContainer}>
          <TouchableOpacity
            style={[styles.tab, selectedTab === 'providers' && styles.activeTab]}
            onPress={() => setSelectedTab('providers')}
          >
            <Text style={[styles.tabText, selectedTab === 'providers' && styles.activeTabText]}>
              Providers ({favoriteProviders.length})
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.tab, selectedTab === 'services' && styles.activeTab]}
            onPress={() => setSelectedTab('services')}
          >
            <Text style={[styles.tabText, selectedTab === 'services' && styles.activeTabText]}>
              Services (0)
            </Text>
          </TouchableOpacity>
        </View>

        <ScrollView 
          style={styles.scrollContainer} 
          showsVerticalScrollIndicator={false}
          scrollEventThrottle={16}
          decelerationRate="normal"
          bounces={true}
          bouncesZoom={false}
          alwaysBounceVertical={false}
          removeClippedSubviews={false}
        >
          {selectedTab === 'providers' ? (
            favoriteProviders.length === 0 ? (
              <View style={styles.emptyState}>
                <Heart size={48} color={Colors.textSecondary} />
                <Text style={styles.emptyTitle}>No Favorite Providers</Text>
                <Text style={styles.emptyDescription}>
                  Save your favorite service providers for quick access later.
                </Text>
                <Button
                  title="Browse Providers"
                  onPress={() => router.push('/marketplace')}
                  style={styles.browseButton}
                />
              </View>
            ) : (
              <View style={styles.providersList}>
                {favoriteProviders.map((provider) => (
                  <View key={provider.id} style={styles.favoriteProviderContainer}>
                    <ProviderCard
                      provider={provider}
                      onPress={handleProviderSelect}
                    />
                    <TouchableOpacity
                      style={styles.favoriteButton}
                      onPress={() => handleRemoveFavorite(provider.id)}
                    >
                      <Heart size={20} color="#FF6B6B" fill="#FF6B6B" />
                    </TouchableOpacity>
                  </View>
                ))}
              </View>
            )
          ) : (
            <View style={styles.emptyState}>
              <Star size={48} color={Colors.textSecondary} />
              <Text style={styles.emptyTitle}>No Favorite Services</Text>
              <Text style={styles.emptyDescription}>
                Mark services as favorites to find them easily later.
              </Text>
              <Button
                title="Browse Services"
                onPress={() => router.push('/marketplace')}
                style={styles.browseButton}
              />
            </View>
          )}
        </ScrollView>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  tabContainer: {
    flexDirection: 'row',
    backgroundColor: Colors.card,
    marginHorizontal: 20,
    marginTop: 20,
    borderRadius: 12,
    padding: 4,
  },
  tab: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
    borderRadius: 8,
  },
  activeTab: {
    backgroundColor: Colors.primary,
  },
  tabText: {
    fontSize: 14,
    fontWeight: '500',
    color: Colors.textSecondary,
  },
  activeTabText: {
    color: Colors.white,
    fontWeight: '600',
  },
  scrollContainer: {
    flex: 1,
    paddingTop: 20,
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 40,
    marginTop: 60,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.text,
    marginTop: 16,
    marginBottom: 8,
  },
  emptyDescription: {
    fontSize: 14,
    color: Colors.textSecondary,
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: 24,
  },
  browseButton: {
    paddingHorizontal: 32,
  },
  providersList: {
    paddingBottom: 40,
  },
  favoriteProviderContainer: {
    position: 'relative',
  },
  favoriteButton: {
    position: 'absolute',
    top: 16,
    right: 24,
    backgroundColor: Colors.background,
    borderRadius: 20,
    padding: 8,
    shadowColor: Colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
});