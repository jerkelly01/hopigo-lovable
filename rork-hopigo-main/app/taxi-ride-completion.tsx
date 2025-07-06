import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { useRouter, Stack } from 'expo-router';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { useMarketplaceStore } from '@/store/marketplace-store';
import { useWalletStore } from '@/store/wallet-store';
import { 
  CheckCircle, 
  Star, 
  MapPin, 
  Clock, 
  DollarSign,
  Receipt,
  User,
  CreditCard,
  Wallet
} from 'lucide-react-native';
import Colors from '@/constants/colors';

export default function TaxiRideCompletionScreen() {
  const router = useRouter();
  const { currentTaxiRide, taxiDrivers, completeRide, rateTaxiRide } = useMarketplaceStore();
  const { paymentMethods, payForTaxiRide } = useWalletStore();
  
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Get driver information
  const driver = currentTaxiRide?.driverId 
    ? taxiDrivers.find(d => d.id === currentTaxiRide.driverId)
    : null;

  // Get payment method information
  const getPaymentMethodInfo = () => {
    if (!currentTaxiRide?.paymentMethodId) return null;
    
    if (currentTaxiRide.paymentMethodId === 'wallet') {
      return { 
        name: 'HopiGo Wallet', 
        icon: <Wallet size={16} color={Colors.primary} />,
        displayName: 'HopiGo Wallet'
      };
    }
    
    const paymentMethod = paymentMethods.find(pm => pm.id === currentTaxiRide.paymentMethodId);
    if (paymentMethod) {
      return { 
        name: `${paymentMethod.name} ****${paymentMethod.last4}`, 
        icon: <CreditCard size={16} color={Colors.primary} />,
        displayName: `${paymentMethod.name} ****${paymentMethod.last4}`
      };
    }
    
    return null;
  };

  // Mock actual ride data (in real app, this would come from the completed ride)
  const actualFare = currentTaxiRide?.estimatedFare || 0;
  const actualDistance = currentTaxiRide?.estimatedDistance || 0;
  const actualDuration = currentTaxiRide?.estimatedDuration || 0;

  const handleRatingPress = (selectedRating: number) => {
    setRating(selectedRating);
  };

  const handleSubmitRating = async () => {
    if (!currentTaxiRide) return;

    if (rating === 0) {
      Alert.alert('Rating Required', 'Please rate your ride experience.');
      return;
    }

    setIsSubmitting(true);
    try {
      // Complete the ride
      await completeRide(currentTaxiRide.id, actualFare, actualDistance, actualDuration);
      
      // Submit rating
      await rateTaxiRide(currentTaxiRide.id, rating, comment);
      
      // Process payment
      if (driver) {
        await payForTaxiRide(
          currentTaxiRide.id, 
          actualFare, 
          driver.name, 
          currentTaxiRide.paymentMethodId
        );
      }
      
      Alert.alert(
        'Thank You!',
        'Your ride has been completed and payment processed.',
        [
          { 
            text: 'OK', 
            onPress: () => router.replace('/(tabs)') 
          }
        ]
      );
    } catch (error) {
      console.error('Error completing ride:', error);
      Alert.alert('Error', 'Unable to complete ride. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSkipRating = () => {
    Alert.alert(
      'Skip Rating',
      'Are you sure you want to skip rating your driver?',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Skip', 
          onPress: () => router.replace('/(tabs)') 
        }
      ]
    );
  };

  if (!currentTaxiRide) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>No ride information found</Text>
      </View>
    );
  }

  const paymentMethodInfo = getPaymentMethodInfo();

  return (
    <>
      <Stack.Screen 
        options={{ 
          title: 'Ride Completed',
          headerStyle: { backgroundColor: Colors.background },
          headerTintColor: Colors.text,
          headerTitleStyle: { fontWeight: '600' },
          headerLeft: () => null, // Prevent going back
        }} 
      />
      
      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        {/* Success Header */}
        <View style={styles.header}>
          <View style={styles.successIcon}>
            <CheckCircle size={64} color={Colors.success} />
          </View>
          <Text style={styles.title}>Ride Completed!</Text>
          <Text style={styles.subtitle}>
            Thank you for using our taxi service. We hope you had a great experience.
          </Text>
        </View>

        {/* Trip Summary */}
        <Card style={styles.summaryCard}>
          <Text style={styles.cardTitle}>Trip Summary</Text>
          
          <View style={styles.tripRoute}>
            <View style={styles.routePoint}>
              <View style={[styles.routeDot, { backgroundColor: Colors.success }]} />
              <View style={styles.routeInfo}>
                <Text style={styles.routeLabel}>From</Text>
                <Text style={styles.routeAddress} numberOfLines={2}>
                  {currentTaxiRide.pickupLocation.address}
                </Text>
              </View>
            </View>
            
            <View style={styles.routeLine} />
            
            <View style={styles.routePoint}>
              <View style={[styles.routeDot, { backgroundColor: Colors.error }]} />
              <View style={styles.routeInfo}>
                <Text style={styles.routeLabel}>To</Text>
                <Text style={styles.routeAddress} numberOfLines={2}>
                  {currentTaxiRide.dropoffLocation.address}
                </Text>
              </View>
            </View>
          </View>
          
          <View style={styles.tripStats}>
            <View style={styles.statItem}>
              <Clock size={16} color={Colors.textSecondary} />
              <Text style={styles.statLabel}>Duration</Text>
              <Text style={styles.statValue}>{actualDuration} min</Text>
            </View>
            <View style={styles.statItem}>
              <MapPin size={16} color={Colors.textSecondary} />
              <Text style={styles.statLabel}>Distance</Text>
              <Text style={styles.statValue}>{actualDistance} km</Text>
            </View>
            <View style={styles.statItem}>
              <DollarSign size={16} color={Colors.textSecondary} />
              <Text style={styles.statLabel}>Fare</Text>
              <Text style={styles.statValue}>{actualFare} {currentTaxiRide.currency}</Text>
            </View>
          </View>
        </Card>

        {/* Driver Information */}
        {driver && (
          <Card style={styles.driverCard}>
            <Text style={styles.cardTitle}>Your Driver</Text>
            
            <View style={styles.driverInfo}>
              <View style={styles.driverAvatar}>
                <User size={24} color={Colors.white} />
              </View>
              <View style={styles.driverDetails}>
                <Text style={styles.driverName}>{driver.name}</Text>
                <View style={styles.driverRating}>
                  <Star size={14} color="#FFC107" fill="#FFC107" />
                  <Text style={styles.driverRatingText}>{driver.rating}</Text>
                  <Text style={styles.driverReviewCount}>({driver.reviewCount} reviews)</Text>
                </View>
                <Text style={styles.vehicleInfo}>
                  {driver.vehicleInfo.color} {driver.vehicleInfo.make} {driver.vehicleInfo.model}
                </Text>
              </View>
            </View>
          </Card>
        )}

        {/* Rating Section */}
        <Card style={styles.ratingCard}>
          <Text style={styles.cardTitle}>Rate Your Experience</Text>
          <Text style={styles.ratingSubtitle}>
            How was your ride with {driver?.name || 'your driver'}?
          </Text>
          
          <View style={styles.starsContainer}>
            {[1, 2, 3, 4, 5].map((star) => (
              <TouchableOpacity
                key={star}
                style={styles.starButton}
                onPress={() => handleRatingPress(star)}
              >
                <Star
                  size={40}
                  color={star <= rating ? '#FFC107' : Colors.border}
                  fill={star <= rating ? '#FFC107' : 'transparent'}
                />
              </TouchableOpacity>
            ))}
          </View>
          
          {rating > 0 && (
            <Text style={styles.ratingText}>
              {rating === 1 && 'Poor'}
              {rating === 2 && 'Fair'}
              {rating === 3 && 'Good'}
              {rating === 4 && 'Very Good'}
              {rating === 5 && 'Excellent'}
            </Text>
          )}
        </Card>

        {/* Payment Summary */}
        <Card style={styles.paymentCard}>
          <View style={styles.paymentHeader}>
            <Receipt size={20} color={Colors.primary} />
            <Text style={styles.cardTitle}>Payment Summary</Text>
          </View>
          
          <View style={styles.paymentDetails}>
            <View style={styles.paymentRow}>
              <Text style={styles.paymentLabel}>Base fare</Text>
              <Text style={styles.paymentValue}>
                {(actualFare * 0.6).toFixed(2)} {currentTaxiRide.currency}
              </Text>
            </View>
            <View style={styles.paymentRow}>
              <Text style={styles.paymentLabel}>Distance & time</Text>
              <Text style={styles.paymentValue}>
                {(actualFare * 0.4).toFixed(2)} {currentTaxiRide.currency}
              </Text>
            </View>
            <View style={[styles.paymentRow, styles.totalRow]}>
              <Text style={styles.totalLabel}>Total</Text>
              <Text style={styles.totalValue}>
                {actualFare} {currentTaxiRide.currency}
              </Text>
            </View>
          </View>
          
          <View style={styles.paymentMethod}>
            <View style={styles.paymentMethodHeader}>
              {paymentMethodInfo?.icon}
              <Text style={styles.paymentMethodText}>
                Paid with {paymentMethodInfo?.displayName || 'Payment Method'}
              </Text>
            </View>
          </View>
        </Card>

        {/* Action Buttons */}
        <View style={styles.actionSection}>
          <Button
            title={isSubmitting ? "Submitting..." : "Submit Rating"}
            onPress={handleSubmitRating}
            disabled={rating === 0 || isSubmitting}
            style={styles.submitButton}
          />
          
          <TouchableOpacity 
            style={styles.skipButton}
            onPress={handleSkipRating}
            disabled={isSubmitting}
          >
            <Text style={styles.skipButtonText}>Skip for now</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.bottomSpacing} />
      </ScrollView>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  errorText: {
    fontSize: 16,
    color: Colors.error,
    textAlign: 'center',
    marginTop: 50,
  },
  header: {
    padding: 40,
    alignItems: 'center',
  },
  successIcon: {
    marginBottom: 24,
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
  summaryCard: {
    marginHorizontal: 16,
    marginBottom: 16,
    padding: 20,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.text,
    marginBottom: 16,
  },
  tripRoute: {
    marginBottom: 20,
  },
  routePoint: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  routeDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginTop: 4,
    marginRight: 12,
  },
  routeInfo: {
    flex: 1,
    marginBottom: 16,
  },
  routeLabel: {
    fontSize: 12,
    color: Colors.textSecondary,
    marginBottom: 4,
    textTransform: 'uppercase',
    fontWeight: '600',
  },
  routeAddress: {
    fontSize: 14,
    color: Colors.text,
    lineHeight: 20,
  },
  routeLine: {
    width: 2,
    height: 20,
    backgroundColor: Colors.border,
    marginLeft: 5,
    marginBottom: 8,
  },
  tripStats: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
  },
  statItem: {
    alignItems: 'center',
    gap: 4,
  },
  statLabel: {
    fontSize: 12,
    color: Colors.textSecondary,
  },
  statValue: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.text,
  },
  driverCard: {
    marginHorizontal: 16,
    marginBottom: 16,
    padding: 20,
  },
  driverInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  driverAvatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: Colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  driverDetails: {
    flex: 1,
  },
  driverName: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.text,
    marginBottom: 4,
  },
  driverRating: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginBottom: 4,
  },
  driverRatingText: {
    fontSize: 14,
    fontWeight: '500',
    color: Colors.text,
  },
  driverReviewCount: {
    fontSize: 12,
    color: Colors.textSecondary,
  },
  vehicleInfo: {
    fontSize: 14,
    color: Colors.textSecondary,
  },
  ratingCard: {
    marginHorizontal: 16,
    marginBottom: 16,
    padding: 20,
    alignItems: 'center',
  },
  ratingSubtitle: {
    fontSize: 14,
    color: Colors.textSecondary,
    textAlign: 'center',
    marginBottom: 24,
  },
  starsContainer: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 16,
  },
  starButton: {
    padding: 4,
  },
  ratingText: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.primary,
  },
  paymentCard: {
    marginHorizontal: 16,
    marginBottom: 16,
    padding: 20,
  },
  paymentHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  paymentDetails: {
    marginBottom: 16,
  },
  paymentRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  paymentLabel: {
    fontSize: 14,
    color: Colors.textSecondary,
  },
  paymentValue: {
    fontSize: 14,
    color: Colors.text,
    fontWeight: '500',
  },
  totalRow: {
    borderTopWidth: 1,
    borderTopColor: Colors.border,
    paddingTop: 8,
    marginTop: 8,
  },
  totalLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.text,
  },
  totalValue: {
    fontSize: 18,
    fontWeight: '700',
    color: Colors.primary,
  },
  paymentMethod: {
    backgroundColor: Colors.primary + '10',
    borderRadius: 8,
    padding: 12,
  },
  paymentMethodHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  paymentMethodText: {
    fontSize: 14,
    color: Colors.primary,
    fontWeight: '500',
  },
  actionSection: {
    paddingHorizontal: 16,
    paddingBottom: 16,
  },
  submitButton: {
    marginBottom: 12,
  },
  skipButton: {
    alignItems: 'center',
    paddingVertical: 12,
  },
  skipButtonText: {
    fontSize: 16,
    color: Colors.textSecondary,
  },
  bottomSpacing: {
    height: 40,
  },
});