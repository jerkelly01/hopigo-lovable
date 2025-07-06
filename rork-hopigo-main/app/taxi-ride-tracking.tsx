import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert, ActivityIndicator } from 'react-native';
import { useRouter, Stack } from 'expo-router';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { useMarketplaceStore } from '@/store/marketplace-store';
import { useWalletStore } from '@/store/wallet-store';
import { 
  ArrowLeft, 
  MapPin, 
  Car, 
  Phone, 
  MessageCircle,
  Navigation,
  Clock,
  User,
  Star,
  X,
  CreditCard,
  Wallet
} from 'lucide-react-native';
import Colors from '@/constants/colors';

export default function TaxiRideTrackingScreen() {
  const router = useRouter();
  const { 
    currentTaxiRide, 
    taxiDrivers, 
    cancelTaxiRide, 
    updateRideStatus,
    completeRide 
  } = useMarketplaceStore();
  const { paymentMethods } = useWalletStore();
  
  const [isLoading, setIsLoading] = useState(false);
  const [estimatedArrival, setEstimatedArrival] = useState<string>('');

  // If no current ride, redirect back
  useEffect(() => {
    if (!currentTaxiRide) {
      router.replace('/taxi-service');
    }
  }, [currentTaxiRide]);

  // Get driver information
  const driver = currentTaxiRide?.driverId 
    ? taxiDrivers.find(d => d.id === currentTaxiRide.driverId)
    : null;

  // Get payment method information
  const getPaymentMethodInfo = () => {
    if (!currentTaxiRide?.paymentMethodId) return null;
    
    if (currentTaxiRide.paymentMethodId === 'wallet') {
      return { name: 'HopiGo Wallet', icon: <Wallet size={16} color={Colors.primary} /> };
    }
    
    const paymentMethod = paymentMethods.find(pm => pm.id === currentTaxiRide.paymentMethodId);
    if (paymentMethod) {
      return { 
        name: `${paymentMethod.name} ****${paymentMethod.last4}`, 
        icon: <CreditCard size={16} color={Colors.primary} /> 
      };
    }
    
    return null;
  };

  // Update estimated arrival time
  useEffect(() => {
    if (currentTaxiRide) {
      const updateEstimatedTime = () => {
        switch (currentTaxiRide.status) {
          case 'requesting':
            setEstimatedArrival('Finding driver...');
            break;
          case 'driver_assigned':
            setEstimatedArrival('5-8 minutes');
            break;
          case 'driver_arriving':
            setEstimatedArrival('2-3 minutes');
            break;
          case 'pickup':
            setEstimatedArrival('Driver has arrived');
            break;
          case 'in_transit':
            setEstimatedArrival(`${currentTaxiRide.estimatedDuration} minutes`);
            break;
          default:
            setEstimatedArrival('');
        }
      };

      updateEstimatedTime();
      
      // Update every 30 seconds
      const interval = setInterval(updateEstimatedTime, 30000);
      return () => clearInterval(interval);
    }
  }, [currentTaxiRide]);

  const handleCancelRide = () => {
    if (!currentTaxiRide) return;

    Alert.alert(
      'Cancel Ride',
      'Are you sure you want to cancel this ride? You may be charged a cancellation fee.',
      [
        { text: 'Keep Ride', style: 'cancel' },
        { 
          text: 'Cancel Ride', 
          style: 'destructive',
          onPress: async () => {
            setIsLoading(true);
            try {
              await cancelTaxiRide(currentTaxiRide.id, 'User cancelled');
              router.replace('/taxi-service');
            } catch (error) {
              console.error('Error cancelling ride:', error);
              Alert.alert('Error', 'Unable to cancel ride. Please try again.');
            } finally {
              setIsLoading(false);
            }
          }
        }
      ]
    );
  };

  const handleCallDriver = () => {
    if (driver?.phoneNumber) {
      // In a real app, you would use Linking.openURL(`tel:${driver.phoneNumber}`)
      Alert.alert('Call Driver', `Calling ${driver.name} at ${driver.phoneNumber}`);
    }
  };

  const handleMessageDriver = () => {
    Alert.alert('Message Driver', 'Opening chat with your driver...');
  };

  const getStatusMessage = () => {
    if (!currentTaxiRide) return '';

    switch (currentTaxiRide.status) {
      case 'requesting':
        return 'Looking for a nearby driver...';
      case 'driver_assigned':
        return `${driver?.name || 'Your driver'} is on the way to pick you up`;
      case 'driver_arriving':
        return `${driver?.name || 'Your driver'} is arriving at your location`;
      case 'pickup':
        return `${driver?.name || 'Your driver'} has arrived. Please get in the vehicle.`;
      case 'in_transit':
        return 'You are on your way to the destination';
      default:
        return 'Ride in progress';
    }
  };

  const getStatusColor = () => {
    if (!currentTaxiRide) return Colors.textSecondary;

    switch (currentTaxiRide.status) {
      case 'requesting':
        return Colors.warning;
      case 'driver_assigned':
      case 'driver_arriving':
        return Colors.primary;
      case 'pickup':
        return Colors.success;
      case 'in_transit':
        return Colors.success;
      default:
        return Colors.textSecondary;
    }
  };

  if (!currentTaxiRide) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={Colors.primary} />
        <Text style={styles.loadingText}>Loading ride information...</Text>
      </View>
    );
  }

  const paymentMethodInfo = getPaymentMethodInfo();

  return (
    <>
      <Stack.Screen 
        options={{ 
          title: 'Your Ride',
          headerStyle: { backgroundColor: Colors.background },
          headerTintColor: Colors.text,
          headerTitleStyle: { fontWeight: '600' },
          headerLeft: () => (
            <TouchableOpacity onPress={() => router.back()}>
              <ArrowLeft size={24} color={Colors.text} />
            </TouchableOpacity>
          ),
          headerRight: () => (
            <TouchableOpacity onPress={handleCancelRide}>
              <X size={24} color={Colors.error} />
            </TouchableOpacity>
          ),
        }} 
      />
      
      <View style={styles.container}>
        {/* Status Card */}
        <Card style={styles.statusCard}>
          <View style={styles.statusHeader}>
            <View style={[styles.statusIndicator, { backgroundColor: getStatusColor() }]} />
            <Text style={styles.statusText}>{getStatusMessage()}</Text>
          </View>
          
          {estimatedArrival && (
            <View style={styles.estimatedTimeContainer}>
              <Clock size={16} color={Colors.textSecondary} />
              <Text style={styles.estimatedTimeText}>{estimatedArrival}</Text>
            </View>
          )}
        </Card>

        {/* Map Placeholder */}
        <Card style={styles.mapCard}>
          <View style={styles.mapPlaceholder}>
            <Navigation size={48} color={Colors.primary} />
            <Text style={styles.mapPlaceholderText}>
              Map view would show here
            </Text>
            <Text style={styles.mapPlaceholderSubtext}>
              Real-time tracking of your ride
            </Text>
          </View>
        </Card>

        {/* Driver Information */}
        {driver && currentTaxiRide.status !== 'requesting' && (
          <Card style={styles.driverCard}>
            <View style={styles.driverHeader}>
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
                </View>
              </View>
              
              <View style={styles.driverActions}>
                <TouchableOpacity 
                  style={styles.actionButton}
                  onPress={handleCallDriver}
                >
                  <Phone size={20} color={Colors.white} />
                </TouchableOpacity>
                <TouchableOpacity 
                  style={styles.actionButton}
                  onPress={handleMessageDriver}
                >
                  <MessageCircle size={20} color={Colors.white} />
                </TouchableOpacity>
              </View>
            </View>
            
            <View style={styles.vehicleInfo}>
              <Car size={16} color={Colors.textSecondary} />
              <Text style={styles.vehicleText}>
                {driver.vehicleInfo.color} {driver.vehicleInfo.make} {driver.vehicleInfo.model}
              </Text>
              <Text style={styles.licensePlate}>{driver.vehicleInfo.licensePlate}</Text>
            </View>
          </Card>
        )}

        {/* Trip Details */}
        <Card style={styles.tripCard}>
          <Text style={styles.tripTitle}>Trip Details</Text>
          
          <View style={styles.tripRoute}>
            <View style={styles.routePoint}>
              <View style={[styles.routeDot, { backgroundColor: Colors.success }]} />
              <View style={styles.routeInfo}>
                <Text style={styles.routeLabel}>Pickup</Text>
                <Text style={styles.routeAddress} numberOfLines={2}>
                  {currentTaxiRide.pickupLocation.address}
                </Text>
              </View>
            </View>
            
            <View style={styles.routeLine} />
            
            <View style={styles.routePoint}>
              <View style={[styles.routeDot, { backgroundColor: Colors.error }]} />
              <View style={styles.routeInfo}>
                <Text style={styles.routeLabel}>Dropoff</Text>
                <Text style={styles.routeAddress} numberOfLines={2}>
                  {currentTaxiRide.dropoffLocation.address}
                </Text>
              </View>
            </View>
          </View>
          
          <View style={styles.tripMeta}>
            <View style={styles.tripMetaItem}>
              <Text style={styles.tripMetaLabel}>Estimated Fare</Text>
              <Text style={styles.tripMetaValue}>
                {currentTaxiRide.estimatedFare} {currentTaxiRide.currency}
              </Text>
            </View>
            <View style={styles.tripMetaItem}>
              <Text style={styles.tripMetaLabel}>Distance</Text>
              <Text style={styles.tripMetaValue}>
                {currentTaxiRide.estimatedDistance} km
              </Text>
            </View>
          </View>
          
          {/* Payment Method Info */}
          {paymentMethodInfo && (
            <View style={styles.paymentMethodContainer}>
              <View style={styles.paymentMethodHeader}>
                {paymentMethodInfo.icon}
                <Text style={styles.paymentMethodLabel}>Payment Method</Text>
              </View>
              <Text style={styles.paymentMethodText}>{paymentMethodInfo.name}</Text>
            </View>
          )}
        </Card>

        {/* Action Buttons */}
        <View style={styles.actionSection}>
          {currentTaxiRide.status === 'requesting' && (
            <Button
              title={isLoading ? "Cancelling..." : "Cancel Request"}
              variant="secondary"
              onPress={handleCancelRide}
              disabled={isLoading}
            />
          )}
          
          {['driver_assigned', 'driver_arriving', 'pickup'].includes(currentTaxiRide.status) && (
            <Button
              title={isLoading ? "Cancelling..." : "Cancel Ride"}
              variant="secondary"
              onPress={handleCancelRide}
              disabled={isLoading}
            />
          )}
        </View>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
    padding: 16,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.background,
  },
  loadingText: {
    fontSize: 16,
    color: Colors.textSecondary,
    marginTop: 16,
  },
  statusCard: {
    padding: 20,
    marginBottom: 16,
  },
  statusHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  statusIndicator: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 12,
  },
  statusText: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.text,
    flex: 1,
  },
  estimatedTimeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  estimatedTimeText: {
    fontSize: 14,
    color: Colors.textSecondary,
  },
  mapCard: {
    marginBottom: 16,
    overflow: 'hidden',
  },
  mapPlaceholder: {
    height: 200,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.background,
  },
  mapPlaceholderText: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.text,
    marginTop: 12,
  },
  mapPlaceholderSubtext: {
    fontSize: 14,
    color: Colors.textSecondary,
    marginTop: 4,
  },
  driverCard: {
    padding: 16,
    marginBottom: 16,
  },
  driverHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  driverInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  driverAvatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: Colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
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
  driverActions: {
    flexDirection: 'row',
    gap: 8,
  },
  actionButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  vehicleInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
  },
  vehicleText: {
    fontSize: 14,
    color: Colors.text,
    flex: 1,
  },
  licensePlate: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.primary,
    backgroundColor: Colors.primary + '20',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  tripCard: {
    padding: 16,
    marginBottom: 16,
  },
  tripTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.text,
    marginBottom: 16,
  },
  tripRoute: {
    marginBottom: 16,
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
  tripMeta: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
    marginBottom: 16,
  },
  tripMetaItem: {
    alignItems: 'center',
  },
  tripMetaLabel: {
    fontSize: 12,
    color: Colors.textSecondary,
    marginBottom: 4,
  },
  tripMetaValue: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.text,
  },
  paymentMethodContainer: {
    backgroundColor: Colors.primary + '10',
    borderRadius: 8,
    padding: 12,
  },
  paymentMethodHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 4,
  },
  paymentMethodLabel: {
    fontSize: 12,
    color: Colors.textSecondary,
    textTransform: 'uppercase',
    fontWeight: '600',
  },
  paymentMethodText: {
    fontSize: 14,
    color: Colors.primary,
    fontWeight: '500',
  },
  actionSection: {
    marginTop: 'auto',
    paddingBottom: 20,
  },
});