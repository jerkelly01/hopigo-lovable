import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Image, ScrollView, TouchableOpacity, Alert, Animated, LayoutChangeEvent } from 'react-native';
import { useLocalSearchParams, useRouter, Stack } from 'expo-router';
import { useMarketplaceStore } from '@/store/marketplace-store';
import { useWalletStore } from '@/store/wallet-store';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { BookingCalendar } from '@/components/BookingCalendar';
import { PaymentMethodSelector } from '@/components/PaymentMethodSelector';
import { LocationSelector } from '@/components/LocationSelector';
import { Location } from '@/types/marketplace';
import { Star, CheckCircle, MapPin, Clock, Phone, MessageCircle, ChevronDown, Receipt } from 'lucide-react-native';
import Colors from '@/constants/colors';

export default function ProviderDetailScreen() {
  const router = useRouter();
  const { id, serviceId } = useLocalSearchParams();
  const { providers, createBooking } = useMarketplaceStore();
  const { paymentMethods, defaultPaymentMethodId, setDefaultPaymentMethod, payForService } = useWalletStore();
  
  const [isLoading, setIsLoading] = useState(false);
  const [selectedDateTime, setSelectedDateTime] = useState<string | null>(null);
  const [selectedPaymentMethodId, setSelectedPaymentMethodId] = useState<string | null>(defaultPaymentMethodId);
  const [selectedLocation, setSelectedLocation] = useState<Location | null>(null);
  
  const scrollViewRef = useRef<ScrollView>(null);
  const calendarSectionY = useRef<number>(0);
  const locationSectionY = useRef<number>(0);
  const paymentSectionY = useRef<number>(0);
  const receiptSectionY = useRef<number>(0);
  
  const pulseAnim = useRef(new Animated.Value(1)).current;
  
  // Find the provider by ID
  const provider = providers.find(p => p.id === id);
  
  // Get the selected service if serviceId is provided
  const selectedService = serviceId && provider?.pricing && provider.pricing[serviceId as string]
    ? provider.pricing[serviceId as string]
    : null;
  
  // Service fee constant
  const SERVICE_FEE = 3;
  
  // Calculate total amount including service fee
  const totalAmount = selectedService ? selectedService.amount + SERVICE_FEE : 0;
  
  // Update selected payment method when default changes
  useEffect(() => {
    if (defaultPaymentMethodId) {
      setSelectedPaymentMethodId(defaultPaymentMethodId);
    }
  }, [defaultPaymentMethodId]);
  
  // Pulse animation for next step guidance
  const startPulseAnimation = () => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.1,
          duration: 800,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 800,
          useNativeDriver: true,
        }),
      ])
    ).start();
  };
  
  const stopPulseAnimation = () => {
    pulseAnim.stopAnimation();
    pulseAnim.setValue(1);
  };
  
  // Auto-scroll to specific Y position
  const scrollToPosition = (y: number) => {
    if (scrollViewRef.current) {
      scrollViewRef.current.scrollTo({ y: y - 20, animated: true });
    }
  };
  
  // Guide user to next step
  useEffect(() => {
    if (selectedService && !selectedDateTime) {
      // Guide to calendar section
      setTimeout(() => {
        scrollToPosition(calendarSectionY.current);
        startPulseAnimation();
      }, 500);
    } else if (selectedService && selectedDateTime && !selectedLocation) {
      // Guide to location section
      setTimeout(() => {
        scrollToPosition(locationSectionY.current);
        startPulseAnimation();
      }, 500);
    } else if (selectedService && selectedDateTime && selectedLocation && !selectedPaymentMethodId) {
      // Guide to payment section
      setTimeout(() => {
        scrollToPosition(paymentSectionY.current);
        startPulseAnimation();
      }, 500);
    } else if (selectedService && selectedDateTime && selectedLocation && selectedPaymentMethodId) {
      // Guide to receipt section
      setTimeout(() => {
        scrollToPosition(receiptSectionY.current);
        stopPulseAnimation();
      }, 500);
    } else {
      stopPulseAnimation();
    }
    
    return () => stopPulseAnimation();
  }, [selectedService, selectedDateTime, selectedLocation, selectedPaymentMethodId]);
  
  if (!provider) {
    return (
      <View style={styles.notFoundContainer}>
        <Text style={styles.notFoundText}>Provider not found</Text>
        <Button 
          title="Go Back" 
          onPress={() => router.back()}
          style={styles.notFoundButton}
        />
      </View>
    );
  }
  
  const handleServiceSelect = (key: string) => {
    router.setParams({ serviceId: key });
    // Auto-scroll to calendar section after service selection
    setTimeout(() => {
      scrollToPosition(calendarSectionY.current);
    }, 300);
  };
  
  const handleDateTimeSelect = (dateTime: string) => {
    setSelectedDateTime(dateTime);
    // Auto-scroll to location section after date/time selection
    setTimeout(() => {
      scrollToPosition(locationSectionY.current);
    }, 500);
  };
  
  const handleLocationSelect = (location: Location) => {
    setSelectedLocation(location);
    // Auto-scroll to payment section after location selection
    setTimeout(() => {
      scrollToPosition(paymentSectionY.current);
    }, 500);
  };
  
  const handleLocationClear = () => {
    setSelectedLocation(null);
  };
  
  const handlePaymentMethodSelect = (paymentMethodId: string) => {
    setSelectedPaymentMethodId(paymentMethodId);
    // Auto-scroll to receipt section after payment method selection
    setTimeout(() => {
      scrollToPosition(receiptSectionY.current);
    }, 500);
  };
  
  const handleBookService = async () => {
    if (!selectedService) {
      Alert.alert('Error', 'Please select a service first');
      return;
    }
    
    if (!selectedDateTime) {
      Alert.alert('Error', 'Please select a date and time for your booking');
      scrollToPosition(calendarSectionY.current);
      return;
    }
    
    if (!selectedLocation) {
      Alert.alert('Error', 'Please select your service location');
      scrollToPosition(locationSectionY.current);
      return;
    }
    
    if (!selectedPaymentMethodId) {
      Alert.alert('Error', 'Please select a payment method');
      scrollToPosition(paymentSectionY.current);
      return;
    }
    
    setIsLoading(true);
    
    try {
      // Set the selected payment method as default
      if (selectedPaymentMethodId !== defaultPaymentMethodId) {
        await setDefaultPaymentMethod(selectedPaymentMethodId);
      }
      
      // Create a booking with the total amount including service fee
      const booking = await createBooking({
        providerId: provider.id,
        providerName: provider.name,
        providerImage: provider.image,
        service: selectedService.description,
        date: selectedDateTime.split('T')[0],
        time: new Date(selectedDateTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        location: selectedLocation.address,
        price: totalAmount,
        currency: selectedService.currency,
        notes: `Service location: ${selectedLocation.address}`,
      });
      
      // Process payment with total amount
      await payForService(
        provider.id,
        serviceId as string,
        totalAmount, // Use total amount including service fee
        `${selectedService.description} - ${provider.name} (incl. service fee)`
      );
      
      // Navigate to booking confirmation page
      router.push({
        pathname: '/booking-confirmation',
        params: {
          bookingId: booking.id,
          providerName: provider.name,
          serviceName: selectedService.description,
          amount: totalAmount.toString(), // Use total amount
          currency: selectedService.currency,
          dateTime: selectedDateTime,
          location: selectedLocation.address,
          latitude: selectedLocation.latitude.toString(),
          longitude: selectedLocation.longitude.toString(),
        }
      });
    } catch (error) {
      console.error('Booking error:', error);
      Alert.alert(
        'Booking Failed', 
        error instanceof Error ? error.message : 'Failed to book service. Please try again.',
        [{ text: 'OK' }]
      );
    } finally {
      setIsLoading(false);
    }
  };
  
  const getStepStatus = (step: number) => {
    switch (step) {
      case 1:
        return selectedService ? 'completed' : 'current';
      case 2:
        return selectedDateTime ? 'completed' : selectedService ? 'current' : 'pending';
      case 3:
        return selectedLocation ? 'completed' : (selectedService && selectedDateTime) ? 'current' : 'pending';
      case 4:
        return selectedPaymentMethodId ? 'completed' : (selectedService && selectedDateTime && selectedLocation) ? 'current' : 'pending';
      default:
        return 'pending';
    }
  };
  
  const getStepStyle = (step: number) => {
    const status = getStepStatus(step);
    const isCurrentStep = status === 'current';
    
    return {
      stepNumber: [
        styles.stepNumber,
        status === 'completed' && styles.completedStep,
        status === 'current' && styles.currentStep,
      ],
      stepNumberText: [
        styles.stepNumberText,
        status === 'completed' && styles.completedStepText,
        status === 'current' && styles.currentStepText,
      ],
      transform: isCurrentStep ? [{ scale: pulseAnim }] : undefined,
    };
  };
  
  return (
    <>
      <Stack.Screen 
        options={{
          title: provider.name,
          headerTitleStyle: {
            fontWeight: '600',
          },
        }}
      />
      
      <ScrollView 
        ref={scrollViewRef}
        style={styles.container}
        showsVerticalScrollIndicator={false}
      >
        {/* Provider Header */}
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
              <Star size={16} color="#FFC107" fill="#FFC107" />
              <Text style={styles.rating}>
                {provider.rating.toFixed(1)} ({provider.reviewCount} reviews)
              </Text>
            </View>
            <View style={styles.locationContainer}>
              <MapPin size={14} color={Colors.textSecondary} />
              <Text style={styles.location}>{provider.location}</Text>
            </View>
          </View>
        </View>
        
        {/* Quick Actions */}
        <View style={styles.quickActions}>
          <TouchableOpacity style={styles.actionButton}>
            <View style={styles.actionIcon}>
              <Phone size={20} color={Colors.primary} />
            </View>
            <Text style={styles.actionText}>Call</Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.actionButton}>
            <View style={styles.actionIcon}>
              <MessageCircle size={20} color={Colors.primary} />
            </View>
            <Text style={styles.actionText}>Message</Text>
          </TouchableOpacity>
        </View>
        
        {/* About Section */}
        <Card style={styles.section}>
          <Text style={styles.sectionTitle}>About</Text>
          <Text style={styles.description}>{provider.description}</Text>
        </Card>
        
        {/* Services Section */}
        <Card style={styles.section}>
          <View style={styles.stepHeader}>
            <Animated.View style={getStepStyle(1).stepNumber}>
              <Text style={getStepStyle(1).stepNumberText}>1</Text>
            </Animated.View>
            <Text style={styles.sectionTitle}>Select Service & Pricing</Text>
            {selectedService && (
              <CheckCircle size={20} color={Colors.success} style={styles.stepCheck} />
            )}
          </View>
          
          {provider.pricing && Object.entries(provider.pricing).map(([key, value]) => (
            <TouchableOpacity 
              key={key}
              style={[
                styles.serviceItem,
                serviceId === key && styles.selectedServiceItem
              ]}
              onPress={() => handleServiceSelect(key)}
            >
              <View>
                <Text style={styles.serviceTitle}>{value.description}</Text>
              </View>
              <View style={styles.priceContainer}>
                <Text style={styles.price}>
                  {value.amount} {value.currency}
                </Text>
              </View>
            </TouchableOpacity>
          ))}
          
          {selectedService && (
            <View style={styles.nextStepHint}>
              <ChevronDown size={16} color={Colors.primary} />
              <Text style={styles.nextStepText}>Now select your preferred date and time</Text>
            </View>
          )}
        </Card>
        
        {/* Availability Section */}
        <Card style={styles.section}>
          <Text style={styles.sectionTitle}>Availability</Text>
          <View style={styles.availabilityItem}>
            <Clock size={16} color={Colors.textSecondary} />
            <Text style={styles.availabilityText}>{provider.availability}</Text>
          </View>
          <Text style={styles.responseTime}>
            Average response time: {provider.responseTime}
          </Text>
        </Card>
        
        {/* Booking Calendar - Only show if a service is selected */}
        {selectedService && (
          <Card 
            style={styles.section}
            onLayout={(event: LayoutChangeEvent) => {
              calendarSectionY.current = event.nativeEvent.layout.y;
            }}
          >
            <View style={styles.stepHeader}>
              <Animated.View style={getStepStyle(2).stepNumber}>
                <Text style={getStepStyle(2).stepNumberText}>2</Text>
              </Animated.View>
              <Text style={styles.sectionTitle}>Select Date & Time</Text>
              {selectedDateTime && (
                <CheckCircle size={20} color={Colors.success} style={styles.stepCheck} />
              )}
            </View>
            <BookingCalendar 
              providerId={provider.id}
              onSelectDateTime={handleDateTimeSelect}
            />
            
            {selectedDateTime && (
              <View style={styles.nextStepHint}>
                <ChevronDown size={16} color={Colors.primary} />
                <Text style={styles.nextStepText}>Great! Now select your service location</Text>
              </View>
            )}
          </Card>
        )}
        
        {/* Location Selector - Only show if a service and date/time are selected */}
        {selectedService && selectedDateTime && (
          <Card 
            style={styles.section}
            onLayout={(event: LayoutChangeEvent) => {
              locationSectionY.current = event.nativeEvent.layout.y;
            }}
          >
            <View style={styles.stepHeader}>
              <Animated.View style={getStepStyle(3).stepNumber}>
                <Text style={getStepStyle(3).stepNumberText}>3</Text>
              </Animated.View>
              <Text style={styles.sectionTitle}>Service Location</Text>
              {selectedLocation && (
                <CheckCircle size={20} color={Colors.success} style={styles.stepCheck} />
              )}
            </View>
            <LocationSelector
              selectedLocation={selectedLocation}
              onLocationSelect={handleLocationSelect}
              onLocationClear={handleLocationClear}
            />
            
            {selectedLocation && (
              <View style={styles.nextStepHint}>
                <ChevronDown size={16} color={Colors.primary} />
                <Text style={styles.nextStepText}>Perfect! Now choose your payment method</Text>
              </View>
            )}
          </Card>
        )}
        
        {/* Payment Method Selector - Only show if a service, date/time, and location are selected */}
        {selectedService && selectedDateTime && selectedLocation && (
          <Card 
            style={styles.section}
            onLayout={(event: LayoutChangeEvent) => {
              paymentSectionY.current = event.nativeEvent.layout.y;
            }}
          >
            <View style={styles.stepHeader}>
              <Animated.View style={getStepStyle(4).stepNumber}>
                <Text style={getStepStyle(4).stepNumberText}>4</Text>
              </Animated.View>
              <Text style={styles.sectionTitle}>Select Payment Method</Text>
              {selectedPaymentMethodId && (
                <CheckCircle size={20} color={Colors.success} style={styles.stepCheck} />
              )}
            </View>
            <PaymentMethodSelector
              paymentMethods={paymentMethods}
              selectedPaymentMethodId={selectedPaymentMethodId}
              onSelectPaymentMethod={handlePaymentMethodSelect}
              onAddPaymentMethod={() => router.push('/wallet/payment-methods')}
            />
            
            {selectedPaymentMethodId && (
              <View style={styles.nextStepHint}>
                <ChevronDown size={16} color={Colors.primary} />
                <Text style={styles.nextStepText}>Review your booking details below</Text>
              </View>
            )}
          </Card>
        )}
        
        {/* Receipt Section - Only show if all steps are completed */}
        {selectedService && selectedDateTime && selectedLocation && selectedPaymentMethodId && (
          <Card 
            style={styles.section}
            onLayout={(event: LayoutChangeEvent) => {
              receiptSectionY.current = event.nativeEvent.layout.y;
            }}
          >
            <View style={styles.stepHeader}>
              <View style={styles.receiptIcon}>
                <Receipt size={24} color={Colors.primary} />
              </View>
              <Text style={styles.sectionTitle}>Booking Summary</Text>
            </View>
            
            <View style={styles.receiptContainer}>
              <View style={styles.receiptHeader}>
                <Text style={styles.receiptTitle}>Service Receipt</Text>
                <Text style={styles.receiptSubtitle}>Review your booking details</Text>
              </View>
              
              <View style={styles.receiptDivider} />
              
              <View style={styles.receiptItem}>
                <Text style={styles.receiptLabel}>Service</Text>
                <Text style={styles.receiptValue}>{selectedService.description}</Text>
              </View>
              
              <View style={styles.receiptItem}>
                <Text style={styles.receiptLabel}>Provider</Text>
                <Text style={styles.receiptValue}>{provider.name}</Text>
              </View>
              
              <View style={styles.receiptItem}>
                <Text style={styles.receiptLabel}>Date & Time</Text>
                <Text style={styles.receiptValue}>
                  {new Date(selectedDateTime).toLocaleDateString()} at {new Date(selectedDateTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </Text>
              </View>
              
              <View style={styles.receiptItem}>
                <Text style={styles.receiptLabel}>Location</Text>
                <Text style={styles.receiptValue}>{selectedLocation.address}</Text>
              </View>
              
              <View style={styles.receiptDivider} />
              
              <View style={styles.receiptItem}>
                <Text style={styles.receiptLabel}>Service Price</Text>
                <Text style={styles.receiptValue}>{selectedService.amount} {selectedService.currency}</Text>
              </View>
              
              <View style={styles.receiptItem}>
                <Text style={styles.receiptLabel}>Service Fee</Text>
                <Text style={styles.receiptValue}>{SERVICE_FEE} {selectedService.currency}</Text>
              </View>
              
              <View style={styles.receiptDivider} />
              
              <View style={styles.receiptItem}>
                <Text style={styles.receiptTotalLabel}>Total Amount</Text>
                <Text style={styles.receiptTotalValue}>{totalAmount} {selectedService.currency}</Text>
              </View>
              
              <View style={styles.receiptDivider} />
              
              <View style={styles.receiptItem}>
                <Text style={styles.receiptLabel}>Payment Method</Text>
                <Text style={styles.receiptValue}>
                  {paymentMethods.find(pm => pm.id === selectedPaymentMethodId)?.name} ****{paymentMethods.find(pm => pm.id === selectedPaymentMethodId)?.last4}
                </Text>
              </View>
              
              <View style={styles.bookNowContainer}>
                <Button 
                  title="Confirm & Book Now" 
                  loading={isLoading}
                  onPress={handleBookService}
                  style={styles.bookNowButton}
                />
              </View>
            </View>
          </Card>
        )}
        
        {/* Reviews Section - Placeholder */}
        <Card style={styles.section}>
          <View style={styles.reviewsHeader}>
            <Text style={styles.sectionTitle}>Reviews</Text>
            <TouchableOpacity>
              <Text style={styles.viewAll}>View All</Text>
            </TouchableOpacity>
          </View>
          
          <Text style={styles.noReviews}>
            Reviews will appear here
          </Text>
        </Card>
        
        <View style={styles.footer} />
      </ScrollView>
      
      {/* Booking Bar - Only show if not all steps are completed */}
      {!(selectedService && selectedDateTime && selectedLocation && selectedPaymentMethodId) && (
        <View style={styles.bookingBar}>
          {selectedService ? (
            <View style={styles.selectedServiceContainer}>
              <Text style={styles.selectedServiceTitle}>
                {selectedService.description}
              </Text>
              <Text style={styles.selectedServicePrice}>
                {selectedService.amount} {selectedService.currency}
              </Text>
            </View>
          ) : (
            <Text style={styles.selectServiceText}>
              Select a service to book
            </Text>
          )}
          
          <Button 
            title="Continue" 
            disabled={!selectedService}
            onPress={() => {
              if (!selectedDateTime) {
                scrollToPosition(calendarSectionY.current);
              } else if (!selectedLocation) {
                scrollToPosition(locationSectionY.current);
              } else if (!selectedPaymentMethodId) {
                scrollToPosition(paymentSectionY.current);
              }
            }}
          />
        </View>
      )}
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  notFoundContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 40,
  },
  notFoundText: {
    fontSize: 16,
    color: Colors.textSecondary,
    marginBottom: 16,
  },
  notFoundButton: {
    width: 200,
  },
  header: {
    flexDirection: 'row',
    padding: 16,
    backgroundColor: Colors.white,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    marginRight: 16,
  },
  headerInfo: {
    flex: 1,
    justifyContent: 'center',
  },
  nameContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  name: {
    fontSize: 20,
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
    fontSize: 14,
    color: Colors.textSecondary,
    marginLeft: 4,
  },
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
  },
  location: {
    fontSize: 14,
    color: Colors.textSecondary,
    marginLeft: 4,
  },
  quickActions: {
    flexDirection: 'row',
    padding: 16,
    backgroundColor: Colors.white,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  actionButton: {
    alignItems: 'center',
    marginRight: 24,
  },
  actionIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.card,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 4,
  },
  actionText: {
    fontSize: 12,
    color: Colors.text,
  },
  section: {
    margin: 16,
    marginTop: 8,
    marginBottom: 8,
  },
  stepHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  stepNumber: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: Colors.border,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  currentStep: {
    backgroundColor: Colors.primary,
  },
  completedStep: {
    backgroundColor: Colors.success,
  },
  stepNumberText: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.textSecondary,
  },
  currentStepText: {
    color: Colors.white,
  },
  completedStepText: {
    color: Colors.white,
  },
  stepCheck: {
    marginLeft: 'auto',
  },
  receiptIcon: {
    marginRight: 12,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.text,
    flex: 1,
  },
  description: {
    fontSize: 14,
    color: Colors.text,
    lineHeight: 20,
  },
  serviceItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 8,
    borderRadius: 8,
    marginBottom: 8,
  },
  selectedServiceItem: {
    backgroundColor: Colors.card,
  },
  serviceTitle: {
    fontSize: 14,
    fontWeight: '500',
    color: Colors.text,
  },
  priceContainer: {
    backgroundColor: Colors.primary,
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 12,
  },
  price: {
    fontSize: 12,
    fontWeight: '600',
    color: Colors.white,
  },
  nextStepHint: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 16,
    paddingVertical: 12,
    paddingHorizontal: 16,
    backgroundColor: Colors.primary + '10',
    borderRadius: 8,
  },
  nextStepText: {
    fontSize: 14,
    color: Colors.primary,
    fontWeight: '500',
    marginLeft: 8,
  },
  availabilityItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  availabilityText: {
    fontSize: 14,
    color: Colors.text,
    marginLeft: 8,
  },
  responseTime: {
    fontSize: 14,
    color: Colors.textSecondary,
  },
  receiptContainer: {
    backgroundColor: Colors.card,
    borderRadius: 12,
    padding: 16,
  },
  receiptHeader: {
    alignItems: 'center',
    marginBottom: 16,
  },
  receiptTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.text,
    marginBottom: 4,
  },
  receiptSubtitle: {
    fontSize: 14,
    color: Colors.textSecondary,
  },
  receiptDivider: {
    height: 1,
    backgroundColor: Colors.border,
    marginVertical: 12,
  },
  receiptItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  receiptLabel: {
    fontSize: 14,
    color: Colors.textSecondary,
    flex: 1,
  },
  receiptValue: {
    fontSize: 14,
    color: Colors.text,
    fontWeight: '500',
    flex: 2,
    textAlign: 'right',
  },
  receiptTotalLabel: {
    fontSize: 16,
    color: Colors.text,
    fontWeight: '600',
    flex: 1,
  },
  receiptTotalValue: {
    fontSize: 16,
    color: Colors.primary,
    fontWeight: '700',
    flex: 2,
    textAlign: 'right',
  },
  bookNowContainer: {
    marginTop: 20,
  },
  bookNowButton: {
    backgroundColor: Colors.primary,
  },
  reviewsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  viewAll: {
    fontSize: 14,
    color: Colors.primary,
  },
  noReviews: {
    fontSize: 14,
    color: Colors.textSecondary,
    fontStyle: 'italic',
    textAlign: 'center',
    paddingVertical: 16,
  },
  footer: {
    height: 80,
  },
  bookingBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    backgroundColor: Colors.white,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
  },
  selectedServiceContainer: {
    flex: 1,
    marginRight: 16,
  },
  selectedServiceTitle: {
    fontSize: 14,
    fontWeight: '500',
    color: Colors.text,
  },
  selectedServicePrice: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.primary,
  },
  selectServiceText: {
    flex: 1,
    fontSize: 14,
    color: Colors.textSecondary,
    marginRight: 16,
  },
});