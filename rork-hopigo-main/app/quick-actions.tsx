import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { Stack } from 'expo-router';
import { Card } from '@/components/ui/Card';
import { FeaturedServiceCard } from '@/components/FeaturedServiceCard';
import { featuredServices } from '@/constants/featured-services';
import { ArrowLeft } from 'lucide-react-native';
import Colors from '@/constants/colors';

export default function QuickActionsScreen() {
  const router = useRouter();

  const handleServicePress = (serviceId: string) => {
    switch (serviceId) {
      case 'emergency':
        router.push('/emergency-services');
        break;
      case 'booking':
        router.push('/my-bookings');
        break;
      case 'favorites':
        router.push('/favorites');
        break;
      case 'reviews':
        router.push('/reviews');
        break;
      case 'support':
        router.push('/support');
        break;
      case 'rewards':
        router.push('/rewards');
        break;
      default:
        router.push('/marketplace');
    }
  };

  return (
    <>
      <Stack.Screen 
        options={{ 
          title: 'Quick Actions',
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
      
      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Text style={styles.title}>Quick Actions</Text>
          <Text style={styles.subtitle}>
            Access your most used features quickly and easily
          </Text>
        </View>

        <View style={styles.servicesGrid}>
          {Array.from({ length: Math.ceil(featuredServices.length / 2) }, (_, rowIndex) => (
            <View key={rowIndex} style={styles.servicesRow}>
              {featuredServices.slice(rowIndex * 2, (rowIndex + 1) * 2).map((service) => (
                <FeaturedServiceCard
                  key={service.id}
                  service={service}
                  onPress={() => handleServicePress(service.id)}
                  style={styles.serviceCard}
                />
              ))}
            </View>
          ))}
        </View>

        <Card style={styles.infoCard}>
          <Text style={styles.infoTitle}>Need Help?</Text>
          <Text style={styles.infoDescription}>
            If you cannot find what you are looking for, try using the search feature or browse through our service categories.
          </Text>
          <TouchableOpacity 
            style={styles.browseButton}
            onPress={() => router.push('/marketplace')}
          >
            <Text style={styles.browseButtonText}>Browse All Services</Text>
          </TouchableOpacity>
        </Card>
      </ScrollView>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  header: {
    padding: 20,
    paddingTop: 40,
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: Colors.text,
    textAlign: 'center',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: Colors.textSecondary,
    textAlign: 'center',
    lineHeight: 22,
  },
  servicesGrid: {
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  servicesRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  serviceCard: {
    width: '48%',
    minHeight: 120,
  },
  infoCard: {
    marginHorizontal: 20,
    marginTop: 32,
    marginBottom: 40,
    padding: 20,
    alignItems: 'center',
  },
  infoTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.text,
    marginBottom: 12,
  },
  infoDescription: {
    fontSize: 14,
    color: Colors.textSecondary,
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: 20,
  },
  browseButton: {
    backgroundColor: Colors.primary,
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
  },
  browseButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.white,
  },
});