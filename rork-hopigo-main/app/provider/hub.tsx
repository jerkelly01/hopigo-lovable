import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { Stack } from 'expo-router';
import { Card } from '@/components/ui/Card';
import { ProviderServiceCard } from '@/components/ProviderServiceCard';
import { providerServices } from '@/constants/provider-services';
import { ArrowLeft, Users, TrendingUp, BookOpen } from 'lucide-react-native';
import Colors from '@/constants/colors';

export default function ProviderHubScreen() {
  const router = useRouter();

  const handleProviderServicePress = (serviceId: string) => {
    switch (serviceId) {
      case 'training':
        router.push('/provider/training');
        break;
      case 'resources':
        router.push('/provider/resources');
        break;
      case 'community':
        router.push('/provider/community');
        break;
      case 'tools':
        router.push('/provider/tools');
        break;
      case 'support':
        router.push('/provider/support');
        break;
      case 'insights':
        router.push('/provider/insights');
        break;
      default:
        router.push('/provider/dashboard');
    }
  };

  return (
    <>
      <Stack.Screen 
        options={{ 
          title: 'Provider Hub',
          headerStyle: { backgroundColor: Colors.primary },
          headerTintColor: Colors.white,
          headerTitleStyle: { fontWeight: '600' },
          headerLeft: () => (
            <TouchableOpacity 
              onPress={() => router.back()}
              style={styles.backButton}
              hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            >
              <View style={styles.backButtonContent}>
                <ArrowLeft size={20} color={Colors.white} />
                <Text style={styles.backButtonText}>Back</Text>
              </View>
            </TouchableOpacity>
          ),
        }} 
      />
      
      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Text style={styles.title}>Provider Hub</Text>
          <Text style={styles.subtitle}>
            Everything you need to succeed as a service provider
          </Text>
        </View>

        <Card style={styles.statsCard}>
          <View style={styles.statsRow}>
            <View style={styles.statItem}>
              <Users size={24} color={Colors.primary} />
              <Text style={styles.statNumber}>1,247</Text>
              <Text style={styles.statLabel}>Active Providers</Text>
            </View>
            <View style={styles.statItem}>
              <TrendingUp size={24} color={Colors.primary} />
              <Text style={styles.statNumber}>89%</Text>
              <Text style={styles.statLabel}>Success Rate</Text>
            </View>
            <View style={styles.statItem}>
              <BookOpen size={24} color={Colors.primary} />
              <Text style={styles.statNumber}>24</Text>
              <Text style={styles.statLabel}>Resources</Text>
            </View>
          </View>
        </Card>

        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Provider Services</Text>
        </View>

        {/* Provider Services Grid Layout */}
        <View style={styles.servicesGrid}>
          <View style={styles.servicesRow}>
            {providerServices.slice(0, 2).map((service) => (
              <ProviderServiceCard
                key={service.id}
                service={service}
                onPress={() => handleProviderServicePress(service.id)}
                style={styles.serviceCard}
              />
            ))}
          </View>
          <View style={styles.servicesRow}>
            {providerServices.slice(2, 4).map((service) => (
              <ProviderServiceCard
                key={service.id}
                service={service}
                onPress={() => handleProviderServicePress(service.id)}
                style={styles.serviceCard}
              />
            ))}
          </View>
          <View style={styles.servicesRow}>
            {providerServices.slice(4, 6).map((service) => (
              <ProviderServiceCard
                key={service.id}
                service={service}
                onPress={() => handleProviderServicePress(service.id)}
                style={styles.serviceCard}
              />
            ))}
          </View>
        </View>

        <Card style={styles.welcomeCard}>
          <Text style={styles.welcomeTitle}>Welcome to the Provider Hub!</Text>
          <Text style={styles.welcomeDescription}>
            This is your central hub for all provider-related resources, tools, and community features. 
            Explore training courses, connect with other providers, access business tools, and get the support you need to grow your service business.
          </Text>
        </Card>

        <Card style={styles.featuresCard}>
          <Text style={styles.featuresTitle}>What you can do here:</Text>
          <View style={styles.featuresList}>
            <Text style={styles.featureItem}>📚 Take professional training courses</Text>
            <Text style={styles.featureItem}>🛠️ Access business management tools</Text>
            <Text style={styles.featureItem}>👥 Connect with the provider community</Text>
            <Text style={styles.featureItem}>📊 View performance insights and analytics</Text>
            <Text style={styles.featureItem}>📖 Download resources and templates</Text>
            <Text style={styles.featureItem}>💬 Get support when you need it</Text>
          </View>
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
  backButton: {
    padding: 8,
    marginLeft: -8,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
  },
  backButtonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  backButtonText: {
    color: Colors.white,
    fontSize: 16,
    fontWeight: '500',
  },
  header: {
    padding: 20,
    paddingTop: 60,
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
  statsCard: {
    marginHorizontal: 20,
    marginBottom: 8,
    padding: 20,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  statItem: {
    alignItems: 'center',
    gap: 8,
  },
  statNumber: {
    fontSize: 20,
    fontWeight: '700',
    color: Colors.text,
  },
  statLabel: {
    fontSize: 12,
    color: Colors.textSecondary,
    textAlign: 'center',
  },
  sectionHeader: {
    paddingHorizontal: 20,
    marginTop: 24,
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: Colors.text,
  },
  servicesGrid: {
    paddingHorizontal: 20,
  },
  servicesRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  serviceCard: {
    width: '48%',
  },
  welcomeCard: {
    marginHorizontal: 20,
    marginTop: 8,
    marginBottom: 16,
    padding: 20,
  },
  welcomeTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.text,
    marginBottom: 12,
  },
  welcomeDescription: {
    fontSize: 14,
    color: Colors.textSecondary,
    lineHeight: 20,
  },
  featuresCard: {
    marginHorizontal: 20,
    marginBottom: 40,
    padding: 20,
  },
  featuresTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.text,
    marginBottom: 16,
  },
  featuresList: {
    gap: 8,
  },
  featureItem: {
    fontSize: 14,
    color: Colors.text,
    lineHeight: 20,
  },
});