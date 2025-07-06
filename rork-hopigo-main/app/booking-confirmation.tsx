import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { Stack } from 'expo-router';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { CheckCircle, ArrowLeft, CreditCard, Calendar, MapPin, User, Navigation } from 'lucide-react-native';
import Colors from '@/constants/colors';

export default function BookingConfirmationScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  
  const {
    bookingId,
    providerName,
    serviceName,
    amount,
    currency,
    dateTime,
    location,
    latitude,
    longitude,
  } = params;

  const handleDone = () => {
    router.push('/(tabs)/marketplace');
  };

  const handleViewBookings = () => {
    router.push('/my-bookings');
  };

  const handleViewLocation = () => {
    if (latitude && longitude && parseFloat(latitude as string) !== 0 && parseFloat(longitude as string) !== 0) {
      // Open in maps app
      const lat = parseFloat(latitude as string);
      const lng = parseFloat(longitude as string);
      const url = `https://maps.google.com/?q=${lat},${lng}`;
      
      // For mobile, you could use Linking.openURL(url)
      // For web, window.open works
      if (typeof window !== 'undefined') {
        window.open(url, '_blank');
      }
    }
  };

  const formatDateTime = (dateTimeString: string) => {
    const date = new Date(dateTimeString);
    return {
      date: date.toLocaleDateString('en-US', { 
        weekday: 'long', 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
      }),
      time: date.toLocaleTimeString('en-US', { 
        hour: '2-digit', 
        minute: '2-digit' 
      })
    };
  };

  const { date, time } = formatDateTime(dateTime as string);

  const hasCoordinates = latitude && longitude && 
    parseFloat(latitude as string) !== 0 && 
    parseFloat(longitude as string) !== 0;

  return (
    <>
      <Stack.Screen 
        options={{ 
          title: 'Booking Confirmation',
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
          <View style={styles.successIcon}>
            <CheckCircle size={64} color={Colors.success} />
          </View>
          <Text style={styles.title}>Booking Successful!</Text>
          <Text style={styles.subtitle}>
            Your booking request has been sent to the service provider. You will be notified when they confirm your appointment.
          </Text>
        </View>

        <Card style={styles.confirmationCard}>
          <View style={styles.cardHeader}>
            <User size={24} color={Colors.primary} />
            <Text style={styles.cardTitle}>Booking Details</Text>
          </View>
          
          <View style={styles.bookingInfo}>
            <Text style={styles.providerName}>{providerName}</Text>
            <Text style={styles.serviceName}>{serviceName}</Text>
            
            <View style={styles.bookingDetails}>
              <View style={styles.detailRow}>
                <Calendar size={16} color={Colors.textSecondary} />
                <View style={styles.detailContent}>
                  <Text style={styles.detailLabel}>Date & Time</Text>
                  <Text style={styles.detailValue}>{date}</Text>
                  <Text style={styles.detailValue}>{time}</Text>
                </View>
              </View>
              
              <View style={styles.detailRow}>
                <MapPin size={16} color={Colors.textSecondary} />
                <View style={styles.detailContent}>
                  <Text style={styles.detailLabel}>Service Location</Text>
                  <Text style={styles.detailValue}>{location}</Text>
                  {hasCoordinates && (
                    <TouchableOpacity 
                      style={styles.viewLocationButton}
                      onPress={handleViewLocation}
                    >
                      <Navigation size={14} color={Colors.primary} />
                      <Text style={styles.viewLocationText}>View on Map</Text>
                    </TouchableOpacity>
                  )}
                </View>
              </View>
              
              <View style={styles.detailRow}>
                <CreditCard size={16} color={Colors.textSecondary} />
                <View style={styles.detailContent}>
                  <Text style={styles.detailLabel}>Total Amount</Text>
                  <Text style={styles.detailValue}>{amount} {currency}</Text>
                </View>
              </View>
              
              <View style={styles.detailRow}>
                <View style={styles.detailIcon}>
                  <Text style={styles.detailIconText}>#</Text>
                </View>
                <View style={styles.detailContent}>
                  <Text style={styles.detailLabel}>Booking ID</Text>
                  <Text style={styles.detailValue}>{bookingId}</Text>
                </View>
              </View>
            </View>
          </View>
        </Card>

        <Card style={styles.statusCard}>
          <Text style={styles.statusTitle}>What happens next?</Text>
          <View style={styles.statusSteps}>
            <View style={styles.statusStep}>
              <View style={styles.statusStepNumber}>
                <Text style={styles.statusStepNumberText}>1</Text>
              </View>
              <Text style={styles.statusStepText}>
                The service provider will review your booking request and location
              </Text>
            </View>
            
            <View style={styles.statusStep}>
              <View style={styles.statusStepNumber}>
                <Text style={styles.statusStepNumberText}>2</Text>
              </View>
              <Text style={styles.statusStepText}>
                You will receive a notification when they confirm or suggest changes
              </Text>
            </View>
            
            <View style={styles.statusStep}>
              <View style={styles.statusStepNumber}>
                <Text style={styles.statusStepNumberText}>3</Text>
              </View>
              <Text style={styles.statusStepText}>
                The provider will use your location to reach you for the service
              </Text>
            </View>
            
            <View style={styles.statusStep}>
              <View style={styles.statusStepNumber}>
                <Text style={styles.statusStepNumberText}>4</Text>
              </View>
              <Text style={styles.statusStepText}>
                Payment will be processed once the service is completed
              </Text>
            </View>
          </View>
        </Card>

        <View style={styles.actions}>
          <Button
            title="View My Bookings"
            onPress={handleViewBookings}
            style={styles.viewBookingsButton}
          />
          <TouchableOpacity 
            style={styles.doneButton}
            onPress={handleDone}
          >
            <Text style={styles.doneButtonText}>Done</Text>
          </TouchableOpacity>
        </View>
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
  confirmationCard: {
    marginHorizontal: 20,
    marginBottom: 20,
    padding: 20,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.text,
    marginLeft: 12,
  },
  bookingInfo: {
    borderTopWidth: 1,
    borderTopColor: Colors.border,
    paddingTop: 20,
  },
  providerName: {
    fontSize: 20,
    fontWeight: '700',
    color: Colors.text,
    marginBottom: 4,
  },
  serviceName: {
    fontSize: 16,
    color: Colors.textSecondary,
    marginBottom: 20,
  },
  bookingDetails: {
    gap: 16,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  detailContent: {
    marginLeft: 12,
    flex: 1,
  },
  detailLabel: {
    fontSize: 14,
    color: Colors.textSecondary,
    marginBottom: 2,
  },
  detailValue: {
    fontSize: 16,
    fontWeight: '500',
    color: Colors.text,
  },
  detailIcon: {
    width: 16,
    height: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  detailIconText: {
    fontSize: 12,
    fontWeight: '600',
    color: Colors.textSecondary,
  },
  viewLocationButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
    gap: 6,
  },
  viewLocationText: {
    fontSize: 14,
    color: Colors.primary,
    fontWeight: '500',
  },
  statusCard: {
    marginHorizontal: 20,
    marginBottom: 20,
    padding: 20,
  },
  statusTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.text,
    marginBottom: 16,
  },
  statusSteps: {
    gap: 16,
  },
  statusStep: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  statusStepNumber: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: Colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  statusStepNumberText: {
    fontSize: 12,
    fontWeight: '600',
    color: Colors.white,
  },
  statusStepText: {
    fontSize: 14,
    color: Colors.text,
    lineHeight: 20,
    flex: 1,
  },
  actions: {
    paddingHorizontal: 20,
    paddingBottom: 40,
    gap: 12,
  },
  viewBookingsButton: {
    marginBottom: 8,
  },
  doneButton: {
    paddingVertical: 16,
    alignItems: 'center',
  },
  doneButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.primary,
  },
});