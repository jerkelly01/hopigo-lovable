import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { Stack } from 'expo-router';
import { Card } from '@/components/ui/Card';
import { LifestyleServiceCard } from '@/components/LifestyleServiceCard';
import { lifestyleServices } from '@/constants/lifestyle-services';
import { ArrowLeft } from 'lucide-react-native';
import Colors from '@/constants/colors';

export default function OtherServicesScreen() {
  const router = useRouter();

  const handleServicePress = (serviceId: string) => {
    switch (serviceId) {
      case 'bill-payments':
        router.push('/bill-payments');
        break;
      case 'fuel-up':
        router.push('/fuel-up');
        break;
      case 'event-tickets':
        router.push('/event-tickets');
        break;
      case 'donations':
        router.push('/donations');
        break;
      case 'loyalty-programs':
        router.push('/loyalty-programs');
        break;
      case 'deals':
        router.push('/deals');
        break;
      default:
        router.push('/marketplace');
    }
  };

  return (
    <>
      <Stack.Screen 
        options={{ 
          title: 'Other Services',
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
          <Text style={styles.title}>Other Services</Text>
          <Text style={styles.subtitle}>
            Convenient services to enhance your daily life
          </Text>
        </View>

        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.servicesContainer}
          style={styles.servicesScrollView}
        >
          {lifestyleServices.map((service) => (
            <LifestyleServiceCard
              key={service.id}
              service={service}
              onPress={() => handleServicePress(service.id)}
              style={styles.serviceCard}
            />
          ))}
        </ScrollView>

        <Card style={styles.infoCard}>
          <Text style={styles.infoTitle}>More Services Coming Soon</Text>
          <Text style={styles.infoDescription}>
            We are constantly adding new services to make your life easier. Stay tuned for more updates!
          </Text>
          <TouchableOpacity 
            style={styles.browseButton}
            onPress={() => router.push('/marketplace')}
          >
            <Text style={styles.browseButtonText}>Explore All Services</Text>
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
  servicesScrollView: {
    marginTop: 20,
  },
  servicesContainer: {
    paddingHorizontal: 20,
    paddingRight: 40,
  },
  serviceCard: {
    width: 140,
    marginRight: 16,
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