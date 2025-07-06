import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { Availability } from '@/types/marketplace';
import Colors from '@/constants/colors';
import { Clock } from 'lucide-react-native';

interface TimeSlotPickerProps {
  timeSlots: Availability[];
  selectedSlot: string | null;
  onSelectTimeSlot: (slot: string) => void;
}

export const TimeSlotPicker: React.FC<TimeSlotPickerProps> = ({
  timeSlots,
  selectedSlot,
  onSelectTimeSlot,
}) => {
  // Format time from ISO string to readable format (e.g., "9:00 AM")
  const formatTime = (isoString: string) => {
    const date = new Date(isoString);
    return date.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
    });
  };
  
  // Check if there are any available time slots
  const hasAvailableSlots = timeSlots.some(slot => slot.available);
  
  if (timeSlots.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <Clock size={24} color={Colors.textSecondary} />
        <Text style={styles.emptyText}>No time slots available for this date</Text>
      </View>
    );
  }
  
  if (!hasAvailableSlots) {
    return (
      <View style={styles.emptyContainer}>
        <Clock size={24} color={Colors.textSecondary} />
        <Text style={styles.emptyText}>All time slots are booked for this date</Text>
      </View>
    );
  }
  
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Available Time Slots</Text>
      
      <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.timeSlotsContainer}
      >
        {timeSlots.map((slot, index) => (
          slot.available && (
            <TouchableOpacity
              key={index}
              style={[
                styles.timeSlot,
                selectedSlot === slot.startTime && styles.selectedTimeSlot
              ]}
              onPress={() => onSelectTimeSlot(slot.startTime)}
            >
              <Text style={[
                styles.timeText,
                selectedSlot === slot.startTime && styles.selectedTimeText
              ]}>
                {formatTime(slot.startTime)}
              </Text>
            </TouchableOpacity>
          )
        ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: 16,
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.text,
    marginBottom: 12,
    paddingHorizontal: 16,
  },
  timeSlotsContainer: {
    paddingHorizontal: 16,
    paddingBottom: 8,
  },
  timeSlot: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    backgroundColor: Colors.card,
    marginRight: 8,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  selectedTimeSlot: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  timeText: {
    fontSize: 14,
    color: Colors.text,
    fontWeight: '500',
  },
  selectedTimeText: {
    color: Colors.white,
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
    backgroundColor: Colors.card,
    borderRadius: 8,
    marginVertical: 16,
    marginHorizontal: 16,
  },
  emptyText: {
    fontSize: 14,
    color: Colors.textSecondary,
    textAlign: 'center',
    marginTop: 8,
  },
});