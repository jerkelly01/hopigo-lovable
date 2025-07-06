import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { Stack } from 'expo-router';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { useMarketplaceStore } from '@/store/marketplace-store';
import { ArrowLeft, Calendar, Clock, MapPin, User } from 'lucide-react-native';
import Colors from '@/constants/colors';

const statusColors = {
  pending: '#FFD93D',
  accepted: '#4ECDC4',
  rejected: '#FF6B6B',
  completed: '#A8E6CF',
  cancelled: '#FF8A80',
};

export default function MyBookingsScreen() {
  const router = useRouter();
  const { bookings, fetchBookings, cancelBooking, isLoading } = useMarketplaceStore();
  const [selectedTab, setSelectedTab] = useState<'active' | 'completed'>('active');

  useEffect(() => {
    fetchBookings();
  }, []);

  const activeBookings = bookings.filter(booking => 
    ['pending', 'accepted'].includes(booking.status)
  );

  const completedBookings = bookings.filter(booking => 
    ['completed', 'cancelled', 'rejected'].includes(booking.status)
  );

  const displayBookings = selectedTab === 'active' ? activeBookings : completedBookings;

  const handleCancelBooking = (bookingId: string) => {
    cancelBooking(bookingId);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <>
      <Stack.Screen 
        options={{ 
          title: 'My Bookings',
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
      
      <View style={styles.container}>
        <View style={styles.tabContainer}>
          <TouchableOpacity
            style={[styles.tab, selectedTab === 'active' && styles.activeTab]}
            onPress={() => setSelectedTab('active')}
          >
            <Text style={[styles.tabText, selectedTab === 'active' && styles.activeTabText]}>
              Active ({activeBookings.length})
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.tab, selectedTab === 'completed' && styles.activeTab]}
            onPress={() => setSelectedTab('completed')}
          >
            <Text style={[styles.tabText, selectedTab === 'completed' && styles.activeTabText]}>
              History ({completedBookings.length})
            </Text>
          </TouchableOpacity>
        </View>

        <ScrollView 
          style={styles.scrollContainer} 
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
          scrollEventThrottle={16}
          decelerationRate="normal"
          bounces={true}
          bouncesZoom={false}
          alwaysBounceVertical={false}
          removeClippedSubviews={false}
        >
          {displayBookings.length === 0 ? (
            <View style={styles.emptyState}>
              <Calendar size={48} color={Colors.textSecondary} />
              <Text style={styles.emptyTitle}>
                {selectedTab === 'active' ? 'No Active Bookings' : 'No Booking History'}
              </Text>
              <Text style={styles.emptyDescription}>
                {selectedTab === 'active' 
                  ? 'You do not have any active bookings at the moment.'
                  : 'You have not completed any bookings yet.'
                }
              </Text>
              <Button
                title="Browse Services"
                onPress={() => router.push('/marketplace')}
                style={styles.browseButton}
              />
            </View>
          ) : (
            <View style={styles.bookingsList}>
              {displayBookings.map((booking) => (
                <Card key={booking.id} style={styles.bookingCard}>
                  <View style={styles.bookingHeader}>
                    <View style={styles.bookingInfo}>
                      <Text style={styles.serviceTitle}>Service Booking</Text>
                      <View style={[styles.statusBadge, { backgroundColor: statusColors[booking.status] + '20' }]}>
                        <Text style={[styles.statusText, { color: statusColors[booking.status] }]}>
                          {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                        </Text>
                      </View>
                    </View>
                    <Text style={styles.bookingPrice}>
                      {booking.price} {booking.currency}
                    </Text>
                  </View>

                  <View style={styles.bookingDetails}>
                    <View style={styles.detailRow}>
                      <Calendar size={16} color={Colors.textSecondary} />
                      <Text style={styles.detailText}>{formatDate(booking.date)}</Text>
                    </View>
                    <View style={styles.detailRow}>
                      <MapPin size={16} color={Colors.textSecondary} />
                      <Text style={styles.detailText}>{booking.location}</Text>
                    </View>
                    <View style={styles.detailRow}>
                      <User size={16} color={Colors.textSecondary} />
                      <Text style={styles.detailText}>Provider ID: {booking.providerId}</Text>
                    </View>
                  </View>

                  {booking.notes && (
                    <View style={styles.notesContainer}>
                      <Text style={styles.notesLabel}>Notes:</Text>
                      <Text style={styles.notesText}>{booking.notes}</Text>
                    </View>
                  )}

                  <View style={styles.bookingActions}>
                    {booking.status === 'pending' && (
                      <Button
                        title="Cancel Booking"
                        variant="secondary"
                        size="small"
                        onPress={() => handleCancelBooking(booking.id)}
                        style={styles.actionButton}
                      />
                    )}
                    {booking.status === 'completed' && (
                      <Button
                        title="Leave Review"
                        size="small"
                        onPress={() => router.push(`/reviews/create?bookingId=${booking.id}`)}
                        style={styles.actionButton}
                      />
                    )}
                    <Button
                      title="View Details"
                      variant="primary"
                      size="small"
                      onPress={() => router.push(`/booking/${booking.id}`)}
                      style={styles.actionButton}
                    />
                  </View>
                </Card>
              ))}
            </View>
          )}
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
  tabContainer: {
    flexDirection: 'row',
    backgroundColor: Colors.card,
    marginHorizontal: 20,
    marginTop: 20,
    borderRadius: 12,
    padding: 4,
  },
  tab: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
    borderRadius: 8,
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
    fontWeight: '600',
  },
  scrollContainer: {
    flex: 1,
    paddingTop: 20,
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 40,
    marginTop: 60,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.text,
    marginTop: 16,
    marginBottom: 8,
  },
  emptyDescription: {
    fontSize: 14,
    color: Colors.textSecondary,
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: 24,
  },
  browseButton: {
    paddingHorizontal: 32,
  },
  bookingsList: {
    paddingHorizontal: 20,
    paddingBottom: 40,
  },
  bookingCard: {
    padding: 16,
    marginBottom: 16,
  },
  bookingHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  bookingInfo: {
    flex: 1,
  },
  serviceTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.text,
    marginBottom: 8,
  },
  statusBadge: {
    alignSelf: 'flex-start',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '500',
  },
  bookingPrice: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.primary,
  },
  bookingDetails: {
    marginBottom: 12,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  detailText: {
    fontSize: 14,
    color: Colors.text,
    marginLeft: 8,
  },
  notesContainer: {
    backgroundColor: Colors.background,
    padding: 12,
    borderRadius: 8,
    marginBottom: 12,
  },
  notesLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: Colors.textSecondary,
    marginBottom: 4,
  },
  notesText: {
    fontSize: 14,
    color: Colors.text,
    lineHeight: 18,
  },
  bookingActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 8,
  },
  actionButton: {
    paddingHorizontal: 16,
  },
});