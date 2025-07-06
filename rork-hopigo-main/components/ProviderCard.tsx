import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, ViewStyle } from 'react-native';
import { Card } from '@/components/ui/Card';
import { ServiceProvider } from '@/types/marketplace';
import { Star, CheckCircle } from 'lucide-react-native';
import Colors from '@/constants/colors';

interface ProviderCardProps {
  provider: ServiceProvider;
  onPress: (provider: ServiceProvider) => void;
  serviceId?: string;
  style?: ViewStyle;
}

export const ProviderCard: React.FC<ProviderCardProps> = ({
  provider,
  onPress,
  serviceId,
  style,
}) => {
  // Safely check if pricing exists and is an object
  const hasPricing = provider.pricing && 
                     typeof provider.pricing === 'object' && 
                     provider.pricing !== null &&
                     Object.keys(provider.pricing).length > 0;
  
  // Get the price for the selected service if serviceId is provided
  const servicePrice = serviceId && hasPricing && provider.pricing![serviceId] 
    ? provider.pricing![serviceId] 
    : null;

  // If no specific service is selected, show the first available service price
  const defaultPrice = !servicePrice && hasPricing
    ? provider.pricing![Object.keys(provider.pricing!)[0]]
    : null;

  const displayPrice = servicePrice || defaultPrice;

  // Get all available services with prices for display
  const allServices = hasPricing 
    ? Object.entries(provider.pricing!).map(([id, price]) => ({
        id,
        price
      }))
    : [];

  // Show up to 3 services with prices
  const servicesToShow = allServices.slice(0, 3);
  
  return (
    <TouchableOpacity
      onPress={() => onPress(provider)}
      activeOpacity={0.7}
      style={style}
    >
      <Card style={styles.card}>
        <View style={styles.header}>
          <Image 
            source={{ uri: provider.image }} 
            style={styles.avatar} 
          />
          <View style={styles.headerInfo}>
            <View style={styles.nameContainer}>
              <Text style={styles.name}>{provider.name}</Text>
              {provider.verified && (
                <CheckCircle size={16} color={Colors.primary} style={styles.verifiedIcon} />
              )}
            </View>
            <View style={styles.ratingContainer}>
              <Star size={14} color="#FFC107" fill="#FFC107" />
              <Text style={styles.rating}>
                {provider.rating.toFixed(1)} ({provider.reviewCount})
              </Text>
            </View>
            <Text style={styles.location}>{provider.location}</Text>
          </View>
          {displayPrice && (
            <View style={styles.priceContainer}>
              <Text style={styles.priceLabel}>Starting from</Text>
              <Text style={styles.price}>
                {displayPrice.amount} {displayPrice.currency}
              </Text>
            </View>
          )}
        </View>
        
        <View style={styles.divider} />
        
        <Text style={styles.description} numberOfLines={2}>
          {provider.description}
        </Text>

        {/* Service Pricing Section */}
        {servicesToShow.length > 0 && (
          <View style={styles.servicesSection}>
            <Text style={styles.servicesTitle}>Services & Pricing:</Text>
            {servicesToShow.map((service, index) => (
              <View key={service.id} style={styles.serviceItem}>
                <Text style={styles.serviceName}>
                  • {service.price.description}
                </Text>
                <Text style={styles.servicePrice}>
                  {service.price.amount} {service.price.currency}
                </Text>
              </View>
            ))}
            {allServices.length > 3 && (
              <Text style={styles.moreServices}>
                +{allServices.length - 3} more services
              </Text>
            )}
          </View>
        )}
        
        <View style={styles.footer}>
          <Text style={styles.responseTime}>
            Response time: {provider.responseTime}
          </Text>
          {displayPrice && (
            <View style={styles.footerPriceContainer}>
              <Text style={styles.footerPrice}>
                From {displayPrice.amount} {displayPrice.currency}
              </Text>
            </View>
          )}
        </View>
      </Card>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    padding: 16,
    marginHorizontal: 16,
    marginVertical: 8,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    marginRight: 12,
  },
  headerInfo: {
    flex: 1,
  },
  nameContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  name: {
    fontSize: 17,
    fontWeight: '600',
    color: Colors.text,
    marginRight: 4,
  },
  verifiedIcon: {
    marginLeft: 4,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
  },
  rating: {
    fontSize: 13,
    color: Colors.textSecondary,
    marginLeft: 4,
  },
  location: {
    fontSize: 13,
    color: Colors.textSecondary,
    marginTop: 2,
  },
  priceContainer: {
    alignItems: 'flex-end',
    marginLeft: 8,
  },
  priceLabel: {
    fontSize: 11,
    color: Colors.textSecondary,
    marginBottom: 2,
  },
  price: {
    fontSize: 16,
    fontWeight: '700',
    color: Colors.primary,
  },
  divider: {
    height: 1,
    backgroundColor: Colors.border,
    marginVertical: 12,
  },
  description: {
    fontSize: 15,
    color: Colors.text,
    marginBottom: 12,
  },
  servicesSection: {
    backgroundColor: Colors.background,
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
  },
  servicesTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.text,
    marginBottom: 8,
  },
  serviceItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  serviceName: {
    fontSize: 13,
    color: Colors.textSecondary,
    flex: 1,
  },
  servicePrice: {
    fontSize: 13,
    fontWeight: '600',
    color: Colors.primary,
  },
  moreServices: {
    fontSize: 12,
    color: Colors.textSecondary,
    fontStyle: 'italic',
    marginTop: 4,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  responseTime: {
    fontSize: 13,
    color: Colors.textSecondary,
  },
  footerPriceContainer: {
    alignItems: 'flex-end',
  },
  footerPrice: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.primary,
  },
});