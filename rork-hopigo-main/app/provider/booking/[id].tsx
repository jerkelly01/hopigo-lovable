import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image, Linking, Platform } from 'react-native';
import { useRouter, useLocalSearchParams, Stack } from 'expo-router';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { 
  ArrowLeft,
  Calendar,
  Clock,
  MapPin,
  Phone,
  Mail,
  Star,
  DollarSign,
  User,
  MessageCircle,
  Edit3,
  CheckCircle,
  XCircle,
  Navigation,
  ExternalLink
} from 'lucide-react-native';
import Colors from '@/constants/colors';

export default function BookingDetailScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams();

  // Mock booking data - in a real app, this would come from your backend
  const booking = {
    id: id,
    customerName: 'Sarah Johnson',
    customerAvatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=400&auto=format&fit=crop&q=60',
    customerPhone: '+297 123-4567',
    customerEmail: 'sarah.johnson@email.com',
    service: 'House Cleaning',
    description: 'Deep cleaning for 3-bedroom house including kitchen, bathrooms, and living areas.',
    date: '2024-01-15',
    time: '10:00 AM - 2:00 PM',
    duration: '4 hours',
    address: '123 Main Street, Oranjestad, Aruba',
    latitude: 12.5186,
    longitude: -70.0358,
    amount: 85,
    status: 'upcoming',
    paymentStatus: 'paid',
    specialInstructions: 'Please use eco-friendly cleaning products. Keys will be left under the mat.',
    customerRating: 4.8,
    totalBookings: 12
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'upcoming':
        return Colors.warning;
      case 'completed':
        return Colors.success;
      case 'pending':
        return Colors.primary;
      case 'cancelled':
        return Colors.error;
      default:
        return Colors.textSecondary;
    }
  };

  const formatCurrency = (amount: number) => {
    return `AWG ${amount.toLocaleString()}`;
  };

  const handleCompleteBooking = () => {
    // Handle booking completion
    console.log('Complete booking:', id);
  };

  const handleCancelBooking = () => {
    // Handle booking cancellation
    console.log('Cancel booking:', id);
  };

  const handleContactCustomer = () => {
    // Handle contacting customer
    console.log('Contact customer');
  };

  const handleEditBooking = () => {
    router.push(`/provider/booking/${id}/edit`);
  };

  const handleOpenInMaps = () => {
    const { latitude, longitude, address } = booking;
    
    if (Platform.OS === 'web') {
      // For web, open Google Maps in a new tab
      const url = `https://maps.google.com/?q=${latitude},${longitude}`;
      window.open(url, '_blank');
    } else {
      // For mobile, use Linking to open the default maps app
      const url = Platform.select({
        ios: `maps:${latitude},${longitude}?q=${encodeURIComponent(address)}`,
        android: `geo:${latitude},${longitude}?q=${latitude},${longitude}(${encodeURIComponent(address)})`,
      });
      
      if (url) {
        Linking.openURL(url).catch(() => {
          // Fallback to Google Maps web if native app fails
          const fallbackUrl = `https://maps.google.com/?q=${latitude},${longitude}`;
          Linking.openURL(fallbackUrl);
        });
      }
    }
  };

  const handleGetDirections = () => {
    const { latitude, longitude } = booking;
    
    if (Platform.OS === 'web') {
      // For web, open Google Maps directions in a new tab
      const url = `https://maps.google.com/maps/dir/?api=1&destination=${latitude},${longitude}`;
      window.open(url, '_blank');
    } else {
      // For mobile, use Linking to open directions in the default maps app
      const url = Platform.select({
        ios: `maps:?daddr=${latitude},${longitude}&dirflg=d`,
        android: `google.navigation:q=${latitude},${longitude}`,
      });
      
      if (url) {
        Linking.openURL(url).catch(() => {
          // Fallback to Google Maps web if native app fails
          const fallbackUrl = `https://maps.google.com/maps/dir/?api=1&destination=${latitude},${longitude}`;
          Linking.openURL(fallbackUrl);
        });
      }
    }
  };

  return (
    <>
      <Stack.Screen 
        options={{ 
          title: 'Booking Details',
          headerStyle: { backgroundColor: Colors.primary },
          headerTintColor: Colors.white,
          headerTitleStyle: { fontWeight: '600' },
          headerLeft: () => (
            <TouchableOpacity onPress={() => router.back()}>
              <ArrowLeft size={24} color={Colors.white} />
            </TouchableOpacity>
          ),
          headerRight: () => (
            <TouchableOpacity onPress={handleEditBooking}>
              <Edit3 size={24} color={Colors.white} />
            </TouchableOpacity>
          ),
        }} 
      />
      
      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        {/* Status Header */}
        <Card style={styles.statusCard}>
          <View style={styles.statusHeader}>
            <View style={[styles.statusBadge, { backgroundColor: getStatusColor(booking.status) }]}>
              <Text style={styles.statusText}>{booking.status.toUpperCase()}</Text>
            </View>
            <Text style={styles.bookingId}>Booking #{booking.id}</Text>
          </View>
        </Card>

        {/* Customer Information */}
        <Card style={styles.customerCard}>
          <Text style={styles.sectionTitle}>Customer Information</Text>
          <View style={styles.customerInfo}>
            <Image source={{ uri: booking.customerAvatar }} style={styles.customerAvatar} />
            <View style={styles.customerDetails}>
              <Text style={styles.customerName}>{booking.customerName}</Text>
              <View style={styles.customerRating}>
                <Star size={16} color={Colors.warning} fill={Colors.warning} />
                <Text style={styles.ratingText}>{booking.customerRating}</Text>
                <Text style={styles.bookingsText}>• {booking.totalBookings} bookings</Text>
              </View>
            </View>
          </View>
          
          <View style={styles.contactButtons}>
            <TouchableOpacity style={styles.contactButton} onPress={handleContactCustomer}>
              <Phone size={20} color={Colors.primary} />
              <Text style={styles.contactButtonText}>Call</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.contactButton} onPress={handleContactCustomer}>
              <MessageCircle size={20} color={Colors.primary} />
              <Text style={styles.contactButtonText}>Message</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.contactButton} onPress={handleContactCustomer}>
              <Mail size={20} color={Colors.primary} />
              <Text style={styles.contactButtonText}>Email</Text>
            </TouchableOpacity>
          </View>
        </Card>

        {/* Service Details */}
        <Card style={styles.serviceCard}>
          <Text style={styles.sectionTitle}>Service Details</Text>
          <View style={styles.serviceInfo}>
            <Text style={styles.serviceName}>{booking.service}</Text>
            <Text style={styles.serviceDescription}>{booking.description}</Text>
          </View>
          
          <View style={styles.serviceDetails}>
            <View style={styles.detailRow}>
              <Calendar size={20} color={Colors.textSecondary} />
              <Text style={styles.detailText}>{booking.date}</Text>
            </View>
            <View style={styles.detailRow}>
              <Clock size={20} color={Colors.textSecondary} />
              <Text style={styles.detailText}>{booking.time} ({booking.duration})</Text>
            </View>
            <View style={styles.detailRow}>
              <DollarSign size={20} color={Colors.textSecondary} />
              <Text style={styles.detailText}>{formatCurrency(booking.amount)}</Text>
            </View>
          </View>
        </Card>

        {/* Location Details */}
        <Card style={styles.locationCard}>
          <Text style={styles.sectionTitle}>Service Location</Text>
          <View style={styles.locationInfo}>
            <View style={styles.locationHeader}>
              <MapPin size={20} color={Colors.primary} />
              <Text style={styles.locationAddress}>{booking.address}</Text>
            </View>
            
            <View style={styles.locationCoords}>
              <Text style={styles.coordsText}>
                Coordinates: {booking.latitude.toFixed(6)}, {booking.longitude.toFixed(6)}
              </Text>
            </View>
            
            <View style={styles.locationActions}>
              <TouchableOpacity style={styles.locationButton} onPress={handleOpenInMaps}>
                <ExternalLink size={16} color={Colors.primary} />
                <Text style={styles.locationButtonText}>View on Map</Text>
              </TouchableOpacity>
              
              <TouchableOpacity style={styles.directionsButton} onPress={handleGetDirections}>
                <Navigation size={16} color={Colors.white} />
                <Text style={styles.directionsButtonText}>Get Directions</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Card>

        {/* Special Instructions */}
        {booking.specialInstructions && (
          <Card style={styles.instructionsCard}>
            <Text style={styles.sectionTitle}>Special Instructions</Text>
            <Text style={styles.instructionsText}>{booking.specialInstructions}</Text>
          </Card>
        )}

        {/* Payment Information */}
        <Card style={styles.paymentCard}>
          <Text style={styles.sectionTitle}>Payment Information</Text>
          <View style={styles.paymentInfo}>
            <View style={styles.paymentRow}>
              <Text style={styles.paymentLabel}>Service Fee</Text>
              <Text style={styles.paymentAmount}>{formatCurrency(booking.amount)}</Text>
            </View>
            <View style={styles.paymentRow}>
              <Text style={styles.paymentLabel}>Platform Fee</Text>
              <Text style={styles.paymentAmount}>AWG 5</Text>
            </View>
            <View style={[styles.paymentRow, styles.totalRow]}>
              <Text style={styles.totalLabel}>Total</Text>
              <Text style={styles.totalAmount}>{formatCurrency(booking.amount + 5)}</Text>
            </View>
            <View style={styles.paymentStatus}>
              <CheckCircle size={16} color={Colors.success} />
              <Text style={styles.paymentStatusText}>Payment Received</Text>
            </View>
          </View>
        </Card>

        {/* Action Buttons */}
        {booking.status === 'upcoming' && (
          <View style={styles.actionButtons}>
            <Button
              title="Complete Booking"
              onPress={handleCompleteBooking}
              style={styles.completeButton}
            />
            <Button
              title="Cancel Booking"
              onPress={handleCancelBooking}
              style={styles.cancelButton}
              textStyle={styles.cancelButtonText}
            />
          </View>
        )}

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
  statusCard: {
    margin: 20,
    marginBottom: 16,
    padding: 16,
  },
  statusHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '600',
    color: Colors.white,
  },
  bookingId: {
    fontSize: 14,
    color: Colors.textSecondary,
    fontWeight: '500',
  },
  customerCard: {
    marginHorizontal: 20,
    marginBottom: 16,
    padding: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.text,
    marginBottom: 16,
  },
  customerInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  customerAvatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    marginRight: 16,
  },
  customerDetails: {
    flex: 1,
  },
  customerName: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.text,
    marginBottom: 4,
  },
  customerRating: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  ratingText: {
    fontSize: 14,
    color: Colors.text,
    marginLeft: 4,
    fontWeight: '500',
  },
  bookingsText: {
    fontSize: 14,
    color: Colors.textSecondary,
    marginLeft: 4,
  },
  contactButtons: {
    flexDirection: 'row',
    gap: 12,
  },
  contactButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 12,
    backgroundColor: Colors.primary + '20',
    borderRadius: 8,
  },
  contactButtonText: {
    fontSize: 14,
    color: Colors.primary,
    fontWeight: '500',
  },
  serviceCard: {
    marginHorizontal: 20,
    marginBottom: 16,
    padding: 20,
  },
  serviceInfo: {
    marginBottom: 16,
  },
  serviceName: {
    fontSize: 20,
    fontWeight: '600',
    color: Colors.text,
    marginBottom: 8,
  },
  serviceDescription: {
    fontSize: 14,
    color: Colors.textSecondary,
    lineHeight: 20,
  },
  serviceDetails: {
    gap: 12,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  detailText: {
    fontSize: 14,
    color: Colors.text,
    flex: 1,
  },
  locationCard: {
    marginHorizontal: 20,
    marginBottom: 16,
    padding: 20,
  },
  locationInfo: {
    gap: 12,
  },
  locationHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
  },
  locationAddress: {
    fontSize: 16,
    color: Colors.text,
    lineHeight: 22,
    flex: 1,
  },
  locationCoords: {
    paddingLeft: 32,
  },
  coordsText: {
    fontSize: 12,
    color: Colors.textSecondary,
    fontFamily: 'monospace',
  },
  locationActions: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 8,
  },
  locationButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 12,
    backgroundColor: Colors.primary + '20',
    borderRadius: 8,
  },
  locationButtonText: {
    fontSize: 14,
    color: Colors.primary,
    fontWeight: '500',
  },
  directionsButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 12,
    backgroundColor: Colors.primary,
    borderRadius: 8,
  },
  directionsButtonText: {
    fontSize: 14,
    color: Colors.white,
    fontWeight: '500',
  },
  instructionsCard: {
    marginHorizontal: 20,
    marginBottom: 16,
    padding: 20,
  },
  instructionsText: {
    fontSize: 14,
    color: Colors.text,
    lineHeight: 20,
  },
  paymentCard: {
    marginHorizontal: 20,
    marginBottom: 16,
    padding: 20,
  },
  paymentInfo: {
    gap: 12,
  },
  paymentRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  paymentLabel: {
    fontSize: 14,
    color: Colors.textSecondary,
  },
  paymentAmount: {
    fontSize: 14,
    color: Colors.text,
    fontWeight: '500',
  },
  totalRow: {
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
    marginTop: 8,
  },
  totalLabel: {
    fontSize: 16,
    color: Colors.text,
    fontWeight: '600',
  },
  totalAmount: {
    fontSize: 16,
    color: Colors.text,
    fontWeight: '700',
  },
  paymentStatus: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginTop: 8,
  },
  paymentStatusText: {
    fontSize: 14,
    color: Colors.success,
    fontWeight: '500',
  },
  actionButtons: {
    paddingHorizontal: 20,
    gap: 12,
  },
  completeButton: {
    backgroundColor: Colors.success,
  },
  cancelButton: {
    backgroundColor: Colors.background,
    borderWidth: 1,
    borderColor: Colors.error,
  },
  cancelButtonText: {
    color: Colors.error,
  },
  bottomSpacing: {
    height: 100,
  },
});