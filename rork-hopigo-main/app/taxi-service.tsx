import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert, ActivityIndicator, KeyboardAvoidingView, Platform } from 'react-native';
import { useRouter, Stack } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { LocationSelector } from '@/components/LocationSelector';
import { AddressInput } from '@/components/AddressInput';
import { PaymentMethodSelector } from '@/components/PaymentMethodSelector';
import { BookingCalendar } from '@/components/BookingCalendar';
import { useMarketplaceStore } from '@/store/marketplace-store';
import { useWalletStore } from '@/store/wallet-store';
import { useLanguage } from '@/contexts/LanguageContext';
import { Location, TaxiBookingRequest, FareEstimate, RideType } from '@/types/marketplace';
import { 
  ArrowLeft, 
  MapPin, 
  Car, 
  Users, 
  Crown, 
  Zap,
  Clock,
  DollarSign,
  Navigation,
  X,
  CreditCard,
  CheckCircle,
  Calendar
} from 'lucide-react-native';
import Colors from '@/constants/colors';

const rideTypes: Array<{
  id: RideType;
  name: string;
  description: string;
  icon: React.ReactElement;
  capacity: string;
  estimatedTime: string;
}> = [
  {
    id: 'standard',
    name: 'Standard',
    description: 'Affordable rides for everyday trips',
    icon: <Car size={24} color={Colors.text} />,
    capacity: '1-4 passengers',
    estimatedTime: '3-5 min'
  },
  {
    id: 'premium',
    name: 'Premium',
    description: 'Higher-end vehicles with extra comfort',
    icon: <Crown size={24} color={Colors.warning} />,
    capacity: '1-4 passengers',
    estimatedTime: '5-8 min'
  },
  {
    id: 'xl',
    name: 'XL',
    description: 'Larger vehicles for groups',
    icon: <Users size={24} color={Colors.primary} />,
    capacity: '1-6 passengers',
    estimatedTime: '4-7 min'
  },
  {
    id: 'express',
    name: 'Express',
    description: 'Fastest pickup times',
    icon: <Zap size={24} color={Colors.success} />,
    capacity: '1-4 passengers',
    estimatedTime: '1-3 min'
  }
];

export default function TaxiServiceScreen() {
  const router = useRouter();
  const { t } = useLanguage();
  const { 
    getCurrentLocation, 
    getFareEstimate, 
    findNearbyDrivers, 
    requestTaxiRide,
    requestScheduledTaxiRide,
    currentTaxiRide,
    isRequestingRide 
  } = useMarketplaceStore();
  const { balance, currency, paymentMethods, defaultPaymentMethodId } = useWalletStore();
  
  const [pickupLocation, setPickupLocation] = useState<Location | null>(null);
  const [dropoffLocation, setDropoffLocation] = useState<Location | null>(null);
  const [selectedRideType, setSelectedRideType] = useState<RideType>('standard');
  const [selectedPaymentMethodId, setSelectedPaymentMethodId] = useState<string>(defaultPaymentMethodId || '');
  const [fareEstimates, setFareEstimates] = useState<Record<RideType, FareEstimate | null>>({
    standard: null,
    premium: null,
    xl: null,
    express: null
  });
  const [isLoadingFares, setIsLoadingFares] = useState(false);
  const [isLoadingDrivers, setIsLoadingDrivers] = useState(false);
  const [nearbyDriversCount, setNearbyDriversCount] = useState(0);
  const [showPickupSelector, setShowPickupSelector] = useState(false);
  const [dropoffAddress, setDropoffAddress] = useState('');
  const [currentStep, setCurrentStep] = useState(1);
  const [showDropoffSuggestions, setShowDropoffSuggestions] = useState(false);
  const [isDropoffInputFocused, setIsDropoffInputFocused] = useState(false);
  
  // New state for scheduling
  const [isSchedulingMode, setIsSchedulingMode] = useState(false);
  const [scheduledDateTime, setScheduledDateTime] = useState<string | null>(null);
  const [showScheduleCalendar, setShowScheduleCalendar] = useState(false);

  // Scroll ref for auto-scrolling
  const scrollViewRef = useRef<ScrollView>(null);

  // Auto-get current location on mount
  useEffect(() => {
    const getInitialLocation = async () => {
      try {
        const location = await getCurrentLocation();
        if (location) {
          setPickupLocation(location);
          setCurrentStep(2);
        }
      } catch (error) {
        console.error('Error getting initial location:', error);
      }
    };
    
    getInitialLocation();
  }, []);

  // Set default payment method when available
  useEffect(() => {
    if (defaultPaymentMethodId && !selectedPaymentMethodId) {
      setSelectedPaymentMethodId(defaultPaymentMethodId);
    }
  }, [defaultPaymentMethodId]);

  // Get fare estimates for all ride types when both locations are selected
  useEffect(() => {
    if (pickupLocation && dropoffLocation) {
      handleGetAllFareEstimates();
      setCurrentStep(3);
      // Hide suggestions when moving to next step
      setShowDropoffSuggestions(false);
      setIsDropoffInputFocused(false);
      // Auto-scroll to next section
      setTimeout(() => {
        scrollViewRef.current?.scrollTo({ y: 400, animated: true });
      }, 300);
    } else {
      setFareEstimates({
        standard: null,
        premium: null,
        xl: null,
        express: null
      });
    }
  }, [pickupLocation, dropoffLocation]);

  // Find nearby drivers when pickup location is selected
  useEffect(() => {
    if (pickupLocation) {
      handleFindNearbyDrivers();
    }
  }, [pickupLocation]);

  const handleGetAllFareEstimates = async () => {
    if (!pickupLocation || !dropoffLocation) return;
    
    setIsLoadingFares(true);
    try {
      const estimates: Record<RideType, FareEstimate | null> = {
        standard: null,
        premium: null,
        xl: null,
        express: null
      };

      // Get fare estimates for all ride types
      for (const rideType of rideTypes) {
        try {
          const estimate = await getFareEstimate(pickupLocation, dropoffLocation, rideType.id);
          estimates[rideType.id] = estimate;
        } catch (error) {
          console.error(`Error getting fare estimate for ${rideType.id}:`, error);
        }
      }

      setFareEstimates(estimates);
    } catch (error) {
      console.error('Error getting fare estimates:', error);
      Alert.alert('Error', 'Unable to calculate fare estimates. Please try again.');
    } finally {
      setIsLoadingFares(false);
    }
  };

  const handleFindNearbyDrivers = async () => {
    if (!pickupLocation) return;
    
    setIsLoadingDrivers(true);
    try {
      const drivers = await findNearbyDrivers(pickupLocation, selectedRideType);
      setNearbyDriversCount(drivers.length);
    } catch (error) {
      console.error('Error finding nearby drivers:', error);
      setNearbyDriversCount(0);
    } finally {
      setIsLoadingDrivers(false);
    }
  };

  const handleBookRide = async (isScheduled: boolean = false) => {
    if (!pickupLocation || !dropoffLocation || !fareEstimates[selectedRideType]) {
      Alert.alert('Error', 'Please select both pickup and dropoff locations.');
      return;
    }

    if (!selectedPaymentMethodId) {
      Alert.alert('Error', 'Please select a payment method.');
      return;
    }

    if (isScheduled && !scheduledDateTime) {
      Alert.alert('Error', 'Please select a date and time for your scheduled ride.');
      return;
    }

    const fareEstimate = fareEstimates[selectedRideType];
    if (!fareEstimate) return;

    // Check if using wallet and has sufficient balance
    if (selectedPaymentMethodId === 'wallet' && balance < fareEstimate.totalFare) {
      Alert.alert(
        'Insufficient Balance',
        `You need at least ${fareEstimate.totalFare} ${currency} to book this ride. Please add funds to your wallet or choose a different payment method.`,
        [
          { text: 'Cancel', style: 'cancel' },
          { text: 'Add Funds', onPress: () => router.push('/wallet/add-funds') }
        ]
      );
      return;
    }

    // For immediate rides, check driver availability
    if (!isScheduled && nearbyDriversCount === 0) {
      Alert.alert(
        'No Drivers Available',
        'There are no drivers available in your area right now. Please try again later or schedule your ride for later.',
        [{ text: 'OK' }]
      );
      return;
    }

    try {
      const bookingRequest: TaxiBookingRequest = {
        pickupLocation,
        dropoffLocation,
        rideType: selectedRideType,
        paymentMethodId: selectedPaymentMethodId,
        notes: '',
        scheduledFor: isScheduled ? scheduledDateTime || undefined : undefined
      };

      if (isScheduled) {
        await requestScheduledTaxiRide(bookingRequest);
        // Navigate to booking confirmation for scheduled rides
        router.push({
          pathname: '/booking-confirmation',
          params: {
            bookingId: 'scheduled-' + Date.now(),
            providerName: 'HopiGo Taxi',
            serviceName: `${rideTypes.find(r => r.id === selectedRideType)?.name} Taxi`,
            amount: fareEstimate.totalFare.toString(),
            currency: fareEstimate.currency,
            dateTime: scheduledDateTime!,
            location: dropoffLocation.address,
            latitude: dropoffLocation.latitude.toString(),
            longitude: dropoffLocation.longitude.toString(),
          }
        });
      } else {
        await requestTaxiRide(bookingRequest);
        // Navigate to ride tracking screen for immediate rides
        router.push('/taxi-ride-tracking');
      }
    } catch (error) {
      console.error('Error booking ride:', error);
      Alert.alert('Booking Failed', 'Unable to book your ride. Please try again.');
    }
  };

  const handleSwapLocations = () => {
    const temp = pickupLocation;
    setPickupLocation(dropoffLocation);
    setDropoffLocation(temp);
    
    // Also swap the address text
    const tempAddress = dropoffAddress;
    setDropoffAddress(pickupLocation?.address || '');
    if (temp) {
      setDropoffAddress(temp.address);
    }
  };

  const handlePickupLocationSelect = (location: Location) => {
    setPickupLocation(location);
    setShowPickupSelector(false);
    setCurrentStep(2);
    // Auto-scroll to dropoff section
    setTimeout(() => {
      scrollViewRef.current?.scrollTo({ y: 200, animated: true });
    }, 300);
  };

  const handleDropoffLocationSelect = (location: Location) => {
    setDropoffLocation(location);
    setDropoffAddress(location.address);
    setShowDropoffSuggestions(false);
    setIsDropoffInputFocused(false);
    setCurrentStep(3);
    // Auto-scroll to ride selection section
    setTimeout(() => {
      scrollViewRef.current?.scrollTo({ y: 500, animated: true });
    }, 300);
  };

  const handleDropoffAddressChange = (text: string) => {
    setDropoffAddress(text);
    // Show suggestions only when user is typing (text length > 0)
    setShowDropoffSuggestions(text.length > 0 && isDropoffInputFocused);
  };

  const handleDropoffInputFocus = () => {
    setIsDropoffInputFocused(true);
    // Only show suggestions if there's text
    if (dropoffAddress.length > 0) {
      setShowDropoffSuggestions(true);
    }
  };

  const handleDropoffInputBlur = () => {
    // Delay hiding to allow for suggestion selection
    setTimeout(() => {
      setIsDropoffInputFocused(false);
      setShowDropoffSuggestions(false);
    }, 200);
  };

  const handleScheduleLater = () => {
    setIsSchedulingMode(true);
    setShowScheduleCalendar(true);
    // Auto-scroll to calendar
    setTimeout(() => {
      scrollViewRef.current?.scrollTo({ y: 800, animated: true });
    }, 300);
  };

  const handleScheduleCancel = () => {
    setIsSchedulingMode(false);
    setShowScheduleCalendar(false);
    setScheduledDateTime(null);
  };

  const handleScheduleConfirm = () => {
    if (scheduledDateTime) {
      setShowScheduleCalendar(false);
      setCurrentStep(4);
      // Auto-scroll to booking section
      setTimeout(() => {
        scrollViewRef.current?.scrollToEnd({ animated: true });
      }, 300);
    }
  };

  const getSelectedPaymentMethod = () => {
    if (selectedPaymentMethodId === 'wallet') {
      return { name: 'HopiGo Wallet', last4: '' };
    }
    return paymentMethods.find(pm => pm.id === selectedPaymentMethodId);
  };

  const canBookRide = pickupLocation && dropoffLocation && fareEstimates[selectedRideType] && selectedPaymentMethodId && !isRequestingRide;
  const canBookNow = canBookRide && nearbyDriversCount > 0;
  const canSchedule = canBookRide;

  // If user already has an active ride, redirect to tracking
  useEffect(() => {
    if (currentTaxiRide) {
      router.replace('/taxi-ride-tracking');
    }
  }, [currentTaxiRide]);

  const renderStepIndicator = () => (
    <View style={styles.stepIndicator}>
      <View style={styles.stepContainer}>
        <View style={[styles.stepCircle, currentStep >= 1 && styles.activeStep]}>
          <Text style={[styles.stepNumber, currentStep >= 1 && styles.activeStepText]}>1</Text>
        </View>
        <Text style={styles.stepLabel}>Pickup</Text>
      </View>
      
      <View style={[styles.stepLine, currentStep >= 2 && styles.activeStepLine]} />
      
      <View style={styles.stepContainer}>
        <View style={[styles.stepCircle, currentStep >= 2 && styles.activeStep]}>
          <Text style={[styles.stepNumber, currentStep >= 2 && styles.activeStepText]}>2</Text>
        </View>
        <Text style={styles.stepLabel}>Dropoff</Text>
      </View>
      
      <View style={[styles.stepLine, currentStep >= 3 && styles.activeStepLine]} />
      
      <View style={styles.stepContainer}>
        <View style={[styles.stepCircle, currentStep >= 3 && styles.activeStep]}>
          <Text style={[styles.stepNumber, currentStep >= 3 && styles.activeStepText]}>3</Text>
        </View>
        <Text style={styles.stepLabel}>Choose</Text>
      </View>
      
      <View style={[styles.stepLine, currentStep >= 4 && styles.activeStepLine]} />
      
      <View style={styles.stepContainer}>
        <View style={[styles.stepCircle, currentStep >= 4 && styles.activeStep]}>
          <Text style={[styles.stepNumber, currentStep >= 4 && styles.activeStepText]}>4</Text>
        </View>
        <Text style={styles.stepLabel}>Book</Text>
      </View>
    </View>
  );

  // Calculate dynamic bottom padding based on current step and suggestions visibility
  const getScrollContentPadding = () => {
    let basePadding = 180; // Base padding for fixed buttons (now two buttons)
    
    // Add extra padding when suggestions are visible
    if (showDropoffSuggestions) {
      basePadding += 300; // Extra space for suggestions
    }
    
    // Add extra padding for ride selection step
    if (currentStep >= 3) {
      basePadding += 100;
    }

    // Add extra padding when schedule calendar is visible
    if (showScheduleCalendar) {
      basePadding += 400;
    }
    
    return basePadding;
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <Stack.Screen 
        options={{ 
          title: t('bookATaxi'),
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
      
      <KeyboardAvoidingView 
        style={styles.keyboardAvoidingView}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
      >
        <View style={styles.header}>
          <Text style={styles.headerTitle}>{t('bookATaxi')}</Text>
          <Text style={styles.headerSubtitle}>Follow the steps below to book your taxi</Text>
          {renderStepIndicator()}
        </View>
        
        <ScrollView 
          ref={scrollViewRef}
          style={styles.container} 
          contentContainerStyle={[
            styles.scrollContent,
            { paddingBottom: getScrollContentPadding() }
          ]}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          {/* Location Selection */}
          <Card style={styles.locationCard}>
            <View style={styles.locationHeader}>
              <MapPin size={24} color={Colors.primary} />
              <Text style={styles.locationTitle}>Where to?</Text>
            </View>
            
            <View style={styles.locationInputs}>
              <View style={styles.locationInputContainer}>
                <View style={[styles.locationDot, { backgroundColor: Colors.success }]} />
                <TouchableOpacity 
                  style={styles.locationInput}
                  onPress={() => setShowPickupSelector(true)}
                >
                  <Text style={styles.locationLabel}>Pickup Location</Text>
                  {pickupLocation ? (
                    <Text style={styles.selectedLocationText} numberOfLines={2}>
                      {pickupLocation.address}
                    </Text>
                  ) : (
                    <Text style={styles.placeholderText}>Select pickup location</Text>
                  )}
                </TouchableOpacity>
                {pickupLocation && (
                  <TouchableOpacity 
                    style={styles.clearButton}
                    onPress={() => setPickupLocation(null)}
                  >
                    <X size={16} color={Colors.textSecondary} />
                  </TouchableOpacity>
                )}
              </View>
              
              <View style={styles.locationSeparator}>
                <View style={styles.separatorLine} />
                <TouchableOpacity 
                  style={styles.swapButton}
                  onPress={handleSwapLocations}
                  disabled={!pickupLocation || !dropoffLocation}
                >
                  <Navigation size={16} color={Colors.primary} />
                </TouchableOpacity>
                <View style={styles.separatorLine} />
              </View>
              
              <View style={styles.locationInputContainer}>
                <View style={[styles.locationDot, { backgroundColor: Colors.error }]} />
                <View style={styles.dropoffInputWrapper}>
                  <Text style={styles.locationLabel}>Dropoff Location</Text>
                  <AddressInput
                    value={dropoffAddress}
                    onChangeText={handleDropoffAddressChange}
                    onLocationSelect={handleDropoffLocationSelect}
                    onFocus={handleDropoffInputFocus}
                    onBlur={handleDropoffInputBlur}
                    placeholder="Where are you going?"
                    showCurrentLocationButton={false}
                    showSuggestions={showDropoffSuggestions}
                    style={styles.dropoffInput}
                  />
                </View>
                {dropoffLocation && (
                  <TouchableOpacity 
                    style={styles.clearButton}
                    onPress={() => {
                      setDropoffLocation(null);
                      setDropoffAddress('');
                      setShowDropoffSuggestions(false);
                    }}
                  >
                    <X size={16} color={Colors.textSecondary} />
                  </TouchableOpacity>
                )}
              </View>
            </View>
          </Card>

          {/* Pickup Location Selector */}
          {showPickupSelector && (
            <View style={styles.selectorContainer}>
              <LocationSelector
                selectedLocation={pickupLocation}
                onLocationSelect={handlePickupLocationSelect}
                onLocationClear={() => {
                  setPickupLocation(null);
                  setShowPickupSelector(false);
                }}
                title="Pickup Location"
                subtitle="Where should the driver pick you up?"
                placeholder="Enter pickup address"
                showCurrentLocationButton={true}
              />
              <Button
                title="Cancel"
                variant="outline"
                onPress={() => setShowPickupSelector(false)}
                style={styles.cancelSelectorButton}
              />
            </View>
          )}

          {/* Schedule Calendar */}
          {showScheduleCalendar && (
            <Card style={styles.scheduleCard}>
              <View style={styles.scheduleHeader}>
                <Calendar size={24} color={Colors.primary} />
                <Text style={styles.scheduleTitle}>Schedule Your Ride</Text>
                <TouchableOpacity onPress={handleScheduleCancel}>
                  <X size={24} color={Colors.textSecondary} />
                </TouchableOpacity>
              </View>
              
              <BookingCalendar
                providerId="taxi-service"
                onSelectDateTime={setScheduledDateTime}
              />
              
              {scheduledDateTime && (
                <View style={styles.scheduleActions}>
                  <Button
                    title="Confirm Schedule"
                    onPress={handleScheduleConfirm}
                    style={styles.confirmScheduleButton}
                  />
                </View>
              )}
            </Card>
          )}

          {/* Ride Type Selection with All Prices */}
          {pickupLocation && dropoffLocation && !showPickupSelector && !showDropoffSuggestions && !showScheduleCalendar && (
            <View style={styles.rideTypeSection}>
              <Text style={styles.sectionTitle}>Choose your ride</Text>
              
              {isLoadingFares && (
                <View style={styles.loadingContainer}>
                  <ActivityIndicator size="small" color={Colors.primary} />
                  <Text style={styles.loadingText}>Loading prices...</Text>
                </View>
              )}
              
              <View style={styles.rideTypeContainer}>
                {rideTypes.map((rideType) => (
                  <TouchableOpacity
                    key={rideType.id}
                    style={[
                      styles.rideTypeCard,
                      selectedRideType === rideType.id && styles.selectedRideTypeCard
                    ]}
                    onPress={() => {
                      setSelectedRideType(rideType.id);
                      setCurrentStep(4);
                    }}
                  >
                    <View style={styles.rideTypeIcon}>
                      {rideType.icon}
                    </View>
                    <View style={styles.rideTypeInfo}>
                      <Text style={[
                        styles.rideTypeName,
                        selectedRideType === rideType.id && styles.selectedRideTypeName
                      ]}>
                        {rideType.name}
                      </Text>
                      <Text style={styles.rideTypeDescription}>{rideType.description}</Text>
                      <Text style={styles.rideTypeCapacity}>{rideType.capacity}</Text>
                    </View>
                    <View style={styles.rideTypeDetails}>
                      <View style={styles.rideTypeTime}>
                        <Clock size={14} color={Colors.textSecondary} />
                        <Text style={styles.rideTypeTimeText}>{rideType.estimatedTime}</Text>
                      </View>
                      {fareEstimates[rideType.id] ? (
                        <Text style={styles.rideTypePrice}>
                          {fareEstimates[rideType.id]?.totalFare} {fareEstimates[rideType.id]?.currency}
                        </Text>
                      ) : (
                        <Text style={styles.rideTypePriceLoading}>
                          {isLoadingFares ? '...' : 'N/A'}
                        </Text>
                      )}
                    </View>
                    {selectedRideType === rideType.id && (
                      <View style={styles.selectedIndicator}>
                        <CheckCircle size={20} color={Colors.primary} />
                      </View>
                    )}
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          )}

          {/* Payment Method Selection */}
          {pickupLocation && dropoffLocation && !showPickupSelector && !showDropoffSuggestions && !showScheduleCalendar && (
            <View style={styles.paymentSection}>
              <View style={styles.paymentHeader}>
                <CreditCard size={20} color={Colors.primary} />
                <Text style={styles.sectionTitle}>Payment Method</Text>
              </View>
              
              <PaymentMethodSelector
                paymentMethods={[
                  { id: 'wallet', type: 'wallet', name: 'HopiGo Wallet', last4: '', isDefault: false },
                  ...paymentMethods
                ]}
                selectedPaymentMethodId={selectedPaymentMethodId}
                onSelectPaymentMethod={setSelectedPaymentMethodId}
                onAddPaymentMethod={() => router.push('/wallet/add-payment-method')}
              />
              
              {selectedPaymentMethodId === 'wallet' && (
                <View style={styles.walletBalance}>
                  <Text style={styles.walletBalanceText}>
                    Current balance: {balance} {currency}
                  </Text>
                  {fareEstimates[selectedRideType] && balance < fareEstimates[selectedRideType]!.totalFare && (
                    <Text style={styles.insufficientBalanceText}>
                      Insufficient balance for this ride
                    </Text>
                  )}
                </View>
              )}
            </View>
          )}

          {/* Driver Availability */}
          {pickupLocation && !showPickupSelector && !showDropoffSuggestions && !showScheduleCalendar && (
            <Card style={styles.driverCard}>
              <View style={styles.driverHeader}>
                <Car size={20} color={Colors.primary} />
                <Text style={styles.driverTitle}>Driver Availability</Text>
              </View>
              
              {isLoadingDrivers ? (
                <View style={styles.loadingContainer}>
                  <ActivityIndicator size="small" color={Colors.primary} />
                  <Text style={styles.loadingText}>Finding nearby drivers...</Text>
                </View>
              ) : (
                <Text style={styles.driverCount}>
                  {nearbyDriversCount > 0 
                    ? `${nearbyDriversCount} driver${nearbyDriversCount > 1 ? 's' : ''} nearby`
                    : 'No drivers available in your area'
                  }
                </Text>
              )}
            </Card>
          )}

          {/* Scheduled Ride Info */}
          {isSchedulingMode && scheduledDateTime && !showScheduleCalendar && (
            <Card style={styles.scheduledRideCard}>
              <View style={styles.scheduledRideHeader}>
                <Calendar size={20} color={Colors.primary} />
                <Text style={styles.scheduledRideTitle}>Scheduled Ride</Text>
                <TouchableOpacity onPress={handleScheduleCancel}>
                  <X size={16} color={Colors.textSecondary} />
                </TouchableOpacity>
              </View>
              <Text style={styles.scheduledDateTime}>
                {new Date(scheduledDateTime).toLocaleString('en-US', {
                  weekday: 'long',
                  month: 'long',
                  day: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit'
                })}
              </Text>
            </Card>
          )}
        </ScrollView>

        {/* Fixed Booking Section - Only show when not in input mode */}
        {!showPickupSelector && !showDropoffSuggestions && !showScheduleCalendar && (
          <View style={styles.fixedBookingSection}>
            {/* Schedule Later Button */}
            {!isSchedulingMode && (
              <Button
                title={t('scheduleLater')}
                variant="outline"
                onPress={handleScheduleLater}
                disabled={!canSchedule}
                style={[
                  styles.scheduleButton,
                  !canSchedule && styles.disabledButton
                ]}
                icon={<Calendar size={20} color={canSchedule ? Colors.primary : Colors.textSecondary} />}
              />
            )}
            
            {/* Book Now/Schedule Ride Button */}
            <Button
              title={
                isRequestingRide 
                  ? "Requesting Ride..." 
                  : isSchedulingMode 
                    ? t('scheduleRide')
                    : t('bookNow')
              }
              onPress={() => handleBookRide(isSchedulingMode)}
              disabled={isSchedulingMode ? !canSchedule || !scheduledDateTime : !canBookNow}
              style={[
                styles.bookButton,
                (isSchedulingMode ? (!canSchedule || !scheduledDateTime) : !canBookNow) && styles.disabledBookButton
              ]}
            />
            
            {selectedPaymentMethodId === 'wallet' && fareEstimates[selectedRideType] && balance < fareEstimates[selectedRideType]!.totalFare && (
              <TouchableOpacity 
                style={styles.addFundsButton}
                onPress={() => router.push('/wallet/add-funds')}
              >
                <Text style={styles.addFundsText}>
                  Insufficient balance. Add funds to wallet.
                </Text>
              </TouchableOpacity>
            )}
          </View>
        )}
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  keyboardAvoidingView: {
    flex: 1,
  },
  header: {
    backgroundColor: Colors.background,
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: Colors.text,
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: 14,
    color: Colors.textSecondary,
    marginBottom: 20,
  },
  stepIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  stepContainer: {
    alignItems: 'center',
  },
  stepCircle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: Colors.border,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 4,
  },
  activeStep: {
    backgroundColor: Colors.primary,
  },
  stepNumber: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.textSecondary,
  },
  activeStepText: {
    color: Colors.white,
  },
  stepLabel: {
    fontSize: 12,
    color: Colors.textSecondary,
    fontWeight: '500',
  },
  stepLine: {
    width: 40,
    height: 2,
    backgroundColor: Colors.border,
    marginHorizontal: 8,
  },
  activeStepLine: {
    backgroundColor: Colors.primary,
  },
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  scrollContent: {
    flexGrow: 1,
  },
  locationCard: {
    margin: 16,
    padding: 20,
  },
  locationHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  locationTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.text,
    marginLeft: 8,
  },
  locationInputs: {
    gap: 0,
  },
  locationInputContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    paddingVertical: 12,
  },
  locationDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 16,
    marginTop: 18,
  },
  locationInput: {
    flex: 1,
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
    backgroundColor: Colors.background,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  dropoffInputWrapper: {
    flex: 1,
  },
  dropoffInput: {
    zIndex: 99999,
  },
  locationLabel: {
    fontSize: 14,
    color: Colors.textSecondary,
    marginBottom: 8,
  },
  selectedLocationText: {
    fontSize: 16,
    color: Colors.text,
    fontWeight: '500',
  },
  placeholderText: {
    fontSize: 16,
    color: Colors.textSecondary,
    fontStyle: 'italic',
  },
  clearButton: {
    padding: 8,
    marginLeft: 8,
    marginTop: 18,
  },
  locationSeparator: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    paddingLeft: 28,
  },
  separatorLine: {
    flex: 1,
    height: 1,
    backgroundColor: Colors.border,
  },
  swapButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: Colors.background,
    borderWidth: 1,
    borderColor: Colors.border,
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 8,
  },
  selectorContainer: {
    paddingHorizontal: 16,
    marginBottom: 16,
  },
  cancelSelectorButton: {
    marginTop: 12,
  },
  scheduleCard: {
    marginHorizontal: 16,
    marginBottom: 16,
    padding: 20,
  },
  scheduleHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  scheduleTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.text,
    flex: 1,
    marginLeft: 8,
  },
  scheduleActions: {
    marginTop: 16,
  },
  confirmScheduleButton: {
    marginTop: 8,
  },
  rideTypeSection: {
    paddingHorizontal: 16,
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.text,
    marginBottom: 16,
  },
  loadingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 16,
  },
  loadingText: {
    fontSize: 14,
    color: Colors.textSecondary,
  },
  rideTypeContainer: {
    gap: 12,
  },
  rideTypeCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.card,
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: Colors.border,
    position: 'relative',
  },
  selectedRideTypeCard: {
    borderColor: Colors.primary,
    backgroundColor: Colors.primary + '10',
  },
  rideTypeIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: Colors.background,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  rideTypeInfo: {
    flex: 1,
  },
  rideTypeName: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.text,
    marginBottom: 4,
  },
  selectedRideTypeName: {
    color: Colors.primary,
  },
  rideTypeDescription: {
    fontSize: 14,
    color: Colors.textSecondary,
    marginBottom: 2,
  },
  rideTypeCapacity: {
    fontSize: 12,
    color: Colors.textSecondary,
  },
  rideTypeDetails: {
    alignItems: 'flex-end',
  },
  rideTypeTime: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginBottom: 4,
  },
  rideTypeTimeText: {
    fontSize: 12,
    color: Colors.textSecondary,
  },
  rideTypePrice: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.primary,
  },
  rideTypePriceLoading: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.textSecondary,
  },
  selectedIndicator: {
    position: 'absolute',
    top: 12,
    right: 12,
  },
  paymentSection: {
    paddingHorizontal: 16,
    marginBottom: 16,
  },
  paymentHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  walletBalance: {
    marginTop: 12,
    padding: 12,
    backgroundColor: Colors.primary + '10',
    borderRadius: 8,
  },
  walletBalanceText: {
    fontSize: 14,
    color: Colors.primary,
    fontWeight: '500',
  },
  insufficientBalanceText: {
    fontSize: 12,
    color: Colors.error,
    marginTop: 4,
  },
  driverCard: {
    marginHorizontal: 16,
    marginBottom: 16,
    padding: 16,
  },
  driverHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  driverTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.text,
    marginLeft: 8,
  },
  driverCount: {
    fontSize: 14,
    color: Colors.text,
  },
  scheduledRideCard: {
    marginHorizontal: 16,
    marginBottom: 16,
    padding: 16,
    backgroundColor: Colors.primary + '10',
    borderWidth: 1,
    borderColor: Colors.primary + '30',
  },
  scheduledRideHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  scheduledRideTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.primary,
    flex: 1,
    marginLeft: 8,
  },
  scheduledDateTime: {
    fontSize: 14,
    color: Colors.primary,
    fontWeight: '500',
  },
  fixedBookingSection: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: Colors.background,
    paddingHorizontal: 16,
    paddingVertical: 16,
    paddingBottom: 32,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 5,
    gap: 12,
  },
  scheduleButton: {
    marginBottom: 0,
  },
  bookButton: {
    marginBottom: 8,
  },
  disabledButton: {
    opacity: 0.5,
  },
  disabledBookButton: {
    opacity: 0.5,
  },
  addFundsButton: {
    alignItems: 'center',
    paddingVertical: 8,
  },
  addFundsText: {
    fontSize: 14,
    color: Colors.error,
    textAlign: 'center',
  },
});