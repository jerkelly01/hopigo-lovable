import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image } from 'react-native';
import { useRouter, Stack } from 'expo-router';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { 
  ArrowLeft, 
  Calendar, 
  Clock, 
  MapPin, 
  Phone, 
  MessageCircle,
  Check,
  X,
  Eye
} from 'lucide-react-native';
import Colors from '@/constants/colors';

export default function BookingsScreen() {
  const router = useRouter();
  const [selectedTab, setSelectedTab] = useState('pending');

  const bookings = {
    pending: [
      {
        id: '1',
        customerName: 'Sarah Johnson',
        customerAvatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=400&auto=format&fit=crop&q=60',
        service: 'House Cleaning',
        date: '2024-01-15',
        time: '10:00 AM',
        duration: '2 hours',
        amount: 85,
        address: '123 Main St, Oranjestad',
        phone: '+297 123-4567',
        notes: 'Please focus on kitchen and bathrooms'
      },
      {
        id: '2',
        customerName: 'Mike Chen',
        customerAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&auto=format&fit=crop&q=60',
        service: 'Deep Cleaning',
        date: '2024-01-16',
        time: '2:00 PM',
        duration: '3 hours',
        amount: 120,
        address: '456 Beach Rd, Palm Beach',
        phone: '+297 234-5678',
        notes: 'First time cleaning, needs thorough work'
      }
    ],
    upcoming: [
      {
        id: '3',
        customerName: 'Emma Wilson',
        customerAvatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&auto=format&fit=crop&q=60',
        service: 'Office Cleaning',
        date: '2024-01-17',
        time: '9:00 AM',
        duration: '2 hours',
        amount: 95,
        address: '789 Business Ave, Noord',
        phone: '+297 345-6789',
        notes: 'Weekly cleaning service'
      }
    ],
    completed: [
      {
        id: '4',
        customerName: 'John Smith',
        customerAvatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&auto=format&fit=crop&q=60',
        service: 'House Cleaning',
        date: '2024-01-12',
        time: '11:00 AM',
        duration: '2 hours',
        amount: 85,
        address: '321 Sunset Blvd, Eagle Beach',
        phone: '+297 456-7890',
        notes: 'Regular customer, very satisfied'
      }
    ]
  };

  const tabs = [
    { key: 'pending', label: 'Pending', count: bookings.pending.length },
    { key: 'upcoming', label: 'Upcoming', count: bookings.upcoming.length },
    { key: 'completed', label: 'Completed', count: bookings.completed.length },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return Colors.warning;
      case 'upcoming':
        return Colors.primary;
      case 'completed':
        return Colors.success;
      default:
        return Colors.textSecondary;
    }
  };

  const formatCurrency = (amount: number) => {
    return `AWG ${amount.toLocaleString()}`;
  };

  const renderBookingCard = (booking: any, status: string) => (
    <Card key={booking.id} style={styles.bookingCard}>
      {/* Header */}
      <View style={styles.bookingHeader}>
        <View style={styles.customerInfo}>
          <Image source={{ uri: booking.customerAvatar }} style={styles.customerAvatar} />
          <View style={styles.customerDetails}>
            <Text style={styles.customerName}>{booking.customerName}</Text>
            <Text style={styles.serviceType}>{booking.service}</Text>
          </View>
        </View>
        <View style={styles.bookingAmount}>
          <Text style={styles.amountText}>{formatCurrency(booking.amount)}</Text>
          <View style={[styles.statusBadge, { backgroundColor: getStatusColor(status) }]}>
            <Text style={styles.statusText}>{status}</Text>
          </View>
        </View>
      </View>

      {/* Details */}
      <View style={styles.bookingDetails}>
        <View style={styles.detailRow}>
          <Calendar size={16} color={Colors.textSecondary} />
          <Text style={styles.detailText}>{booking.date} at {booking.time}</Text>
        </View>
        
        <View style={styles.detailRow}>
          <Clock size={16} color={Colors.textSecondary} />
          <Text style={styles.detailText}>{booking.duration}</Text>
        </View>
        
        <View style={styles.detailRow}>
          <MapPin size={16} color={Colors.textSecondary} />
          <Text style={styles.detailText}>{booking.address}</Text>
        </View>
        
        {booking.notes && (
          <View style={styles.notesContainer}>
            <Text style={styles.notesLabel}>Notes:</Text>
            <Text style={styles.notesText}>{booking.notes}</Text>
          </View>
        )}
      </View>

      {/* Actions */}
      <View style={styles.bookingActions}>
        <TouchableOpacity style={styles.contactButton}>
          <Phone size={16} color={Colors.primary} />
          <Text style={styles.contactButtonText}>Call</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.contactButton}>
          <MessageCircle size={16} color={Colors.primary} />
          <Text style={styles.contactButtonText}>Message</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.viewButton}>
          <Eye size={16} color={Colors.primary} />
          <Text style={styles.viewButtonText}>View</Text>
        </TouchableOpacity>
        
        {status === 'pending' && (
          <>
            <TouchableOpacity style={styles.acceptButton}>
              <Check size={16} color={Colors.white} />
              <Text style={styles.acceptButtonText}>Accept</Text>
            </TouchableOpacity>
            
            <TouchableOpacity style={styles.declineButton}>
              <X size={16} color={Colors.white} />
              <Text style={styles.declineButtonText}>Decline</Text>
            </TouchableOpacity>
          </>
        )}
      </View>
    </Card>
  );

  return (
    <>
      <Stack.Screen 
        options={{ 
          title: 'My Bookings',
          headerStyle: { backgroundColor: Colors.primary },
          headerTintColor: Colors.white,
          headerTitleStyle: { fontWeight: '600' },
          headerLeft: () => (
            <TouchableOpacity onPress={() => router.back()}>
              <ArrowLeft size={24} color={Colors.white} />
            </TouchableOpacity>
          ),
        }} 
      />
      
      <View style={styles.container}>
        {/* Tabs */}
        <View style={styles.tabsContainer}>
          {tabs.map((tab) => (
            <TouchableOpacity
              key={tab.key}
              style={[
                styles.tab,
                selectedTab === tab.key && styles.activeTab
              ]}
              onPress={() => setSelectedTab(tab.key)}
            >
              <Text style={[
                styles.tabText,
                selectedTab === tab.key && styles.activeTabText
              ]}>
                {tab.label}
              </Text>
              {tab.count > 0 && (
                <View style={styles.tabBadge}>
                  <Text style={styles.tabBadgeText}>{tab.count}</Text>
                </View>
              )}
            </TouchableOpacity>
          ))}
        </View>

        {/* Bookings List */}
        <ScrollView 
          style={styles.bookingsList} 
          showsVerticalScrollIndicator={false}
          scrollEventThrottle={16}
          decelerationRate="normal"
          bounces={true}
          bouncesZoom={false}
          alwaysBounceVertical={false}
          removeClippedSubviews={false}
        >
          {bookings[selectedTab as keyof typeof bookings].length > 0 ? (
            bookings[selectedTab as keyof typeof bookings].map((booking) =>
              renderBookingCard(booking, selectedTab)
            )
          ) : (
            <View style={styles.emptyState}>
              <Text style={styles.emptyStateText}>No {selectedTab} bookings</Text>
              <Text style={styles.emptyStateSubtext}>
                {selectedTab === 'pending' && "New booking requests will appear here"}
                {selectedTab === 'upcoming' && "Your confirmed bookings will appear here"}
                {selectedTab === 'completed' && "Your completed jobs will appear here"}
              </Text>
            </View>
          )}
          
          <View style={styles.bottomSpacing} />
        </ScrollView>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  tabsContainer: {
    flexDirection: 'row',
    backgroundColor: Colors.card,
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  tab: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
    gap: 6,
  },
  activeTab: {
    backgroundColor: Colors.primary,
  },
  tabText: {
    fontSize: 14,
    fontWeight: '500',
    color: Colors.textSecondary,
  },
  activeTabText: {
    color: Colors.white,
  },
  tabBadge: {
    backgroundColor: Colors.error,
    borderRadius: 10,
    minWidth: 20,
    height: 20,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 6,
  },
  tabBadgeText: {
    fontSize: 12,
    fontWeight: '600',
    color: Colors.white,
  },
  bookingsList: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 16,
  },
  bookingCard: {
    marginBottom: 16,
    padding: 16,
  },
  bookingHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  customerInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  customerAvatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    marginRight: 12,
  },
  customerDetails: {
    flex: 1,
  },
  customerName: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.text,
  },
  serviceType: {
    fontSize: 14,
    color: Colors.textSecondary,
    marginTop: 2,
  },
  bookingAmount: {
    alignItems: 'flex-end',
  },
  amountText: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.text,
    marginBottom: 6,
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '500',
    color: Colors.white,
    textTransform: 'capitalize',
  },
  bookingDetails: {
    marginBottom: 16,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 8,
  },
  detailText: {
    fontSize: 14,
    color: Colors.textSecondary,
    flex: 1,
  },
  notesContainer: {
    marginTop: 8,
    padding: 12,
    backgroundColor: Colors.background,
    borderRadius: 8,
  },
  notesLabel: {
    fontSize: 12,
    fontWeight: '500',
    color: Colors.text,
    marginBottom: 4,
  },
  notesText: {
    fontSize: 14,
    color: Colors.textSecondary,
    lineHeight: 18,
  },
  bookingActions: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  contactButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.background,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    gap: 6,
  },
  contactButtonText: {
    fontSize: 12,
    color: Colors.primary,
    fontWeight: '500',
  },
  viewButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.primary + '20',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    gap: 6,
  },
  viewButtonText: {
    fontSize: 12,
    color: Colors.primary,
    fontWeight: '500',
  },
  acceptButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.success,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    gap: 6,
  },
  acceptButtonText: {
    fontSize: 12,
    color: Colors.white,
    fontWeight: '500',
  },
  declineButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.error,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    gap: 6,
  },
  declineButtonText: {
    fontSize: 12,
    color: Colors.white,
    fontWeight: '500',
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
  },
  emptyStateText: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.text,
    marginBottom: 8,
  },
  emptyStateSubtext: {
    fontSize: 14,
    color: Colors.textSecondary,
    textAlign: 'center',
    lineHeight: 20,
  },
  bottomSpacing: {
    height: 100,
  },
});