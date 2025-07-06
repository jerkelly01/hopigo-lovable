import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image } from 'react-native';
import { useRouter } from 'expo-router';
import { useLanguage } from '@/contexts/LanguageContext';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { 
  Calendar, 
  Clock, 
  MapPin, 
  Star,
  ChevronRight,
  Filter
} from 'lucide-react-native';
import Colors from '@/constants/colors';

interface Booking {
  id: string;
  serviceName: string;
  providerName: string;
  providerAvatar: string;
  date: string;
  time: string;
  location: string;
  status: 'upcoming' | 'completed' | 'cancelled';
  rating?: number;
  price: number;
}

const mockBookings: Booking[] = [
  {
    id: '1',
    serviceName: 'House Cleaning',
    providerName: 'Maria Rodriguez',
    providerAvatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=400&auto=format&fit=crop&q=60',
    date: '2025-01-15',
    time: '10:00 AM',
    location: 'Downtown, San Francisco',
    status: 'upcoming',
    price: 85,
  },
  {
    id: '2',
    serviceName: 'Plumbing Repair',
    providerName: 'John Smith',
    providerAvatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&auto=format&fit=crop&q=60',
    date: '2025-01-10',
    time: '2:00 PM',
    location: 'Mission District, SF',
    status: 'completed',
    rating: 5,
    price: 120,
  },
  {
    id: '3',
    serviceName: 'Taxi Ride',
    providerName: 'Hopi Taxi',
    providerAvatar: 'https://images.unsplash.com/photo-1449824913935-59a10b8d2000?w=400&auto=format&fit=crop&q=60',
    date: '2025-01-08',
    time: '6:30 PM',
    location: 'Airport to Hotel',
    status: 'completed',
    rating: 4,
    price: 45,
  },
];

export function BookingsSection() {
  const router = useRouter();
  const { t } = useLanguage();
  const [activeFilter, setActiveFilter] = useState<'all' | 'upcoming' | 'completed' | 'cancelled'>('all');
  
  const filteredBookings = mockBookings.filter(booking => {
    if (activeFilter === 'all') return true;
    return booking.status === activeFilter;
  });
  
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'upcoming':
        return Colors.primary;
      case 'completed':
        return Colors.success;
      case 'cancelled':
        return Colors.error;
      default:
        return Colors.textSecondary;
    }
  };
  
  const getStatusText = (status: string) => {
    switch (status) {
      case 'upcoming':
        return 'Upcoming';
      case 'completed':
        return 'Completed';
      case 'cancelled':
        return 'Cancelled';
      default:
        return status;
    }
  };
  
  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, index) => (
      <Star
        key={index}
        size={12}
        color={index < rating ? '#FFD700' : '#E0E0E0'}
        fill={index < rating ? '#FFD700' : 'transparent'}
      />
    ));
  };
  
  return (
    <View style={styles.container}>
      {/* Filter Tabs */}
      <View style={styles.filterContainer}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {['all', 'upcoming', 'completed', 'cancelled'].map((filter) => (
            <TouchableOpacity
              key={filter}
              style={[
                styles.filterTab,
                activeFilter === filter && styles.activeFilterTab
              ]}
              onPress={() => setActiveFilter(filter as any)}
            >
              <Text style={[
                styles.filterTabText,
                activeFilter === filter && styles.activeFilterTabText
              ]}>
                {filter.charAt(0).toUpperCase() + filter.slice(1)}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
        
        <TouchableOpacity style={styles.filterButton}>
          <Filter size={20} color={Colors.primary} />
        </TouchableOpacity>
      </View>
      
      {/* Bookings List */}
      <ScrollView 
        style={styles.bookingsList}
        showsVerticalScrollIndicator={false}
      >
        {filteredBookings.length === 0 ? (
          <View style={styles.emptyState}>
            <Calendar size={48} color={Colors.textSecondary} />
            <Text style={styles.emptyStateTitle}>No bookings found</Text>
            <Text style={styles.emptyStateDescription}>
              You don't have any {activeFilter === 'all' ? '' : activeFilter} bookings yet.
            </Text>
            <Button 
              title="Browse Services" 
              onPress={() => router.push('/(tabs)/marketplace')}
              style={styles.browseButton}
            />
          </View>
        ) : (
          filteredBookings.map((booking) => (
            <Card key={booking.id} style={styles.bookingCard}>
              <TouchableOpacity 
                style={styles.bookingContent}
                onPress={() => router.push(`/booking/${booking.id}`)}
              >
                <View style={styles.bookingHeader}>
                  <Image 
                    source={{ uri: booking.providerAvatar }} 
                    style={styles.providerAvatar} 
                  />
                  <View style={styles.bookingInfo}>
                    <Text style={styles.serviceName}>{booking.serviceName}</Text>
                    <Text style={styles.providerName}>{booking.providerName}</Text>
                    <View style={styles.statusContainer}>
                      <View style={[
                        styles.statusBadge,
                        { backgroundColor: getStatusColor(booking.status) + '20' }
                      ]}>
                        <Text style={[
                          styles.statusText,
                          { color: getStatusColor(booking.status) }
                        ]}>
                          {getStatusText(booking.status)}
                        </Text>
                      </View>
                    </View>
                  </View>
                  <View style={styles.bookingMeta}>
                    <Text style={styles.price}>${booking.price}</Text>
                    <ChevronRight size={20} color={Colors.textSecondary} />
                  </View>
                </View>
                
                <View style={styles.bookingDetails}>
                  <View style={styles.detailItem}>
                    <Calendar size={16} color={Colors.textSecondary} />
                    <Text style={styles.detailText}>{booking.date}</Text>
                  </View>
                  <View style={styles.detailItem}>
                    <Clock size={16} color={Colors.textSecondary} />
                    <Text style={styles.detailText}>{booking.time}</Text>
                  </View>
                  <View style={styles.detailItem}>
                    <MapPin size={16} color={Colors.textSecondary} />
                    <Text style={styles.detailText}>{booking.location}</Text>
                  </View>
                </View>
                
                {booking.rating && (
                  <View style={styles.ratingContainer}>
                    <Text style={styles.ratingLabel}>Your rating:</Text>
                    <View style={styles.stars}>
                      {renderStars(booking.rating)}
                    </View>
                  </View>
                )}
              </TouchableOpacity>
            </Card>
          ))
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  filterContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  filterTab: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    marginRight: 8,
    borderRadius: 20,
    backgroundColor: Colors.card,
  },
  activeFilterTab: {
    backgroundColor: Colors.primary,
  },
  filterTabText: {
    fontSize: 14,
    fontWeight: '500',
    color: Colors.textSecondary,
  },
  activeFilterTabText: {
    color: Colors.white,
  },
  filterButton: {
    marginLeft: 'auto',
    padding: 8,
  },
  bookingsList: {
    flex: 1,
    padding: 16,
  },
  emptyState: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
  },
  emptyStateTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.text,
    marginTop: 16,
    marginBottom: 8,
  },
  emptyStateDescription: {
    fontSize: 15,
    color: Colors.textSecondary,
    textAlign: 'center',
    marginBottom: 24,
    lineHeight: 22,
  },
  browseButton: {
    width: 200,
  },
  bookingCard: {
    marginBottom: 12,
    padding: 0,
  },
  bookingContent: {
    padding: 16,
  },
  bookingHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  providerAvatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    marginRight: 12,
  },
  bookingInfo: {
    flex: 1,
  },
  serviceName: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.text,
    marginBottom: 4,
  },
  providerName: {
    fontSize: 14,
    color: Colors.textSecondary,
    marginBottom: 6,
  },
  statusContainer: {
    flexDirection: 'row',
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '500',
  },
  bookingMeta: {
    alignItems: 'flex-end',
  },
  price: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.text,
    marginBottom: 4,
  },
  bookingDetails: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginBottom: 8,
  },
  detailItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 16,
  },
  detailText: {
    fontSize: 13,
    color: Colors.textSecondary,
    marginLeft: 6,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
  },
  ratingLabel: {
    fontSize: 13,
    color: Colors.textSecondary,
    marginRight: 8,
  },
  stars: {
    flexDirection: 'row',
    gap: 2,
  },
});