import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ActivityIndicator } from 'react-native';
import { CalendarView } from '@/components/CalendarView';
import { TimeSlotPicker } from '@/components/TimeSlotPicker';
import { useMarketplaceStore } from '@/store/marketplace-store';
import { Availability } from '@/types/marketplace';
import Colors from '@/constants/colors';

interface BookingCalendarProps {
  providerId: string;
  onSelectDateTime: (dateTime: string) => void;
}

export const BookingCalendar: React.FC<BookingCalendarProps> = ({
  providerId,
  onSelectDateTime,
}) => {
  const { getProviderAvailability, bookings } = useMarketplaceStore();
  
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedTimeSlot, setSelectedTimeSlot] = useState<string | null>(null);
  const [timeSlots, setTimeSlots] = useState<Availability[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  
  // Generate marked dates for the calendar
  const getMarkedDates = () => {
    const markedDates: { [key: string]: { marked: boolean, dotColor: string } } = {};
    
    // Mark dates that have bookings for this provider
    const providerBookings = bookings.filter(
      booking => booking.providerId === providerId && 
                ['pending', 'accepted'].includes(booking.status)
    );
    
    providerBookings.forEach(booking => {
      const dateKey = new Date(booking.date).toISOString().split('T')[0];
      markedDates[dateKey] = {
        marked: true,
        dotColor: booking.status === 'accepted' ? Colors.primary : Colors.warning,
      };
    });
    
    return markedDates;
  };
  
  // Load time slots when date changes
  useEffect(() => {
    const loadTimeSlots = async () => {
      setIsLoading(true);
      setSelectedTimeSlot(null);
      
      try {
        const slots = await getProviderAvailability(providerId, selectedDate);
        setTimeSlots(slots);
      } catch (error) {
        console.error('Error loading time slots:', error);
        setTimeSlots([]);
      } finally {
        setIsLoading(false);
      }
    };
    
    loadTimeSlots();
  }, [providerId, selectedDate]);
  
  // Update parent component when date or time slot changes
  useEffect(() => {
    if (selectedTimeSlot) {
      onSelectDateTime(selectedTimeSlot);
    }
  }, [selectedTimeSlot, onSelectDateTime]);
  
  // Handle date selection
  const handleDateChange = (date: Date) => {
    setSelectedDate(date);
  };
  
  // Handle time slot selection
  const handleTimeSlotSelect = (slotTime: string) => {
    setSelectedTimeSlot(slotTime);
  };
  
  // Get min date (today)
  const getMinDate = () => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return today;
  };
  
  // Get max date (3 months from now)
  const getMaxDate = () => {
    const maxDate = new Date();
    maxDate.setMonth(maxDate.getMonth() + 3);
    return maxDate;
  };
  
  return (
    <View style={styles.container}>
      <CalendarView
        selectedDate={selectedDate}
        onDateChange={handleDateChange}
        markedDates={getMarkedDates()}
        minDate={getMinDate()}
        maxDate={getMaxDate()}
      />
      
      {isLoading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="small" color={Colors.primary} />
          <Text style={styles.loadingText}>Loading available times...</Text>
        </View>
      ) : (
        <TimeSlotPicker
          timeSlots={timeSlots}
          selectedSlot={selectedTimeSlot}
          onSelectTimeSlot={handleTimeSlotSelect}
        />
      )}
      
      {selectedTimeSlot && (
        <View style={styles.selectedTimeContainer}>
          <Text style={styles.selectedTimeLabel}>Selected Time:</Text>
          <Text style={styles.selectedTimeValue}>
            {new Date(selectedTimeSlot).toLocaleString('en-US', {
              weekday: 'long',
              month: 'long',
              day: 'numeric',
              hour: '2-digit',
              minute: '2-digit'
            })}
          </Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: 16,
  },
  loadingContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
    marginVertical: 16,
  },
  loadingText: {
    fontSize: 14,
    color: Colors.textSecondary,
    marginTop: 8,
  },
  selectedTimeContainer: {
    marginTop: 16,
    padding: 16,
    backgroundColor: Colors.primary + '10',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: Colors.primary + '30',
  },
  selectedTimeLabel: {
    fontSize: 14,
    color: Colors.textSecondary,
    marginBottom: 4,
  },
  selectedTimeValue: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.primary,
  },
});