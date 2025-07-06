import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useRouter, Stack } from 'expo-router';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { ArrowLeft, Clock, Calendar, Plus, X } from 'lucide-react-native';
import Colors from '@/constants/colors';

type DayKey = 'monday' | 'tuesday' | 'wednesday' | 'thursday' | 'friday' | 'saturday' | 'sunday';

type AvailabilityType = {
  [K in DayKey]: string[];
};

export default function ScheduleScreen() {
  const router = useRouter();
  const [selectedDay, setSelectedDay] = useState<DayKey>('monday');

  const daysOfWeek: { key: DayKey; label: string }[] = [
    { key: 'monday', label: 'Monday' },
    { key: 'tuesday', label: 'Tuesday' },
    { key: 'wednesday', label: 'Wednesday' },
    { key: 'thursday', label: 'Thursday' },
    { key: 'friday', label: 'Friday' },
    { key: 'saturday', label: 'Saturday' },
    { key: 'sunday', label: 'Sunday' },
  ];

  const timeSlots = [
    '8:00 AM', '9:00 AM', '10:00 AM', '11:00 AM',
    '12:00 PM', '1:00 PM', '2:00 PM', '3:00 PM',
    '4:00 PM', '5:00 PM', '6:00 PM', '7:00 PM'
  ];

  const [availability, setAvailability] = useState<AvailabilityType>({
    monday: ['9:00 AM', '10:00 AM', '2:00 PM', '3:00 PM'],
    tuesday: ['8:00 AM', '9:00 AM', '1:00 PM', '2:00 PM'],
    wednesday: ['10:00 AM', '11:00 AM', '3:00 PM', '4:00 PM'],
    thursday: ['9:00 AM', '10:00 AM', '2:00 PM', '3:00 PM'],
    friday: ['8:00 AM', '9:00 AM', '1:00 PM', '2:00 PM'],
    saturday: ['10:00 AM', '11:00 AM', '12:00 PM'],
    sunday: [],
  });

  const toggleTimeSlot = (time: string) => {
    setAvailability(prev => {
      const currentSlots = prev[selectedDay] || [];
      const updatedSlots = currentSlots.includes(time)
        ? currentSlots.filter(t => t !== time)
        : [...currentSlots, time];
      
      return {
        ...prev,
        [selectedDay]: updatedSlots
      };
    });
  };

  const isTimeSlotSelected = (time: string) => {
    return (availability[selectedDay] || []).includes(time);
  };

  return (
    <>
      <Stack.Screen 
        options={{ 
          title: 'Manage Schedule',
          headerStyle: { backgroundColor: Colors.primary },
          headerTintColor: Colors.white,
          headerTitleStyle: { fontWeight: '600' },
          headerLeft: () => (
            <TouchableOpacity onPress={() => router.back()}>
              <ArrowLeft size={24} color={Colors.white} />
            </TouchableOpacity>
          ),
          headerRight: () => (
            <TouchableOpacity onPress={() => router.back()}>
              <X size={24} color={Colors.white} />
            </TouchableOpacity>
          ),
        }} 
      />
      
      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        {/* Day Selector */}
        <Card style={styles.daySelector}>
          <Text style={styles.sectionTitle}>Select Day</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.daysScroll}>
            {daysOfWeek.map((day) => (
              <TouchableOpacity
                key={day.key}
                style={[
                  styles.dayChip,
                  selectedDay === day.key && styles.selectedDayChip
                ]}
                onPress={() => setSelectedDay(day.key)}
              >
                <Text style={[
                  styles.dayChipText,
                  selectedDay === day.key && styles.selectedDayChipText
                ]}>
                  {day.label}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </Card>

        {/* Time Slots */}
        <Card style={styles.timeSlotsCard}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Available Time Slots</Text>
            <View style={styles.dayInfo}>
              <Calendar size={16} color={Colors.primary} />
              <Text style={styles.selectedDayText}>
                {daysOfWeek.find(d => d.key === selectedDay)?.label}
              </Text>
            </View>
          </View>

          <View style={styles.timeSlotsGrid}>
            {timeSlots.map((time) => (
              <TouchableOpacity
                key={time}
                style={[
                  styles.timeSlot,
                  isTimeSlotSelected(time) && styles.selectedTimeSlot
                ]}
                onPress={() => toggleTimeSlot(time)}
              >
                <Clock size={16} color={isTimeSlotSelected(time) ? Colors.white : Colors.primary} />
                <Text style={[
                  styles.timeSlotText,
                  isTimeSlotSelected(time) && styles.selectedTimeSlotText
                ]}>
                  {time}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </Card>

        {/* Quick Actions */}
        <Card style={styles.quickActions}>
          <Text style={styles.sectionTitle}>Quick Actions</Text>
          
          <View style={styles.actionButtons}>
            <TouchableOpacity style={styles.actionButton}>
              <Plus size={20} color={Colors.primary} />
              <Text style={styles.actionButtonText}>Add Break</Text>
            </TouchableOpacity>
            
            <TouchableOpacity style={styles.actionButton}>
              <Calendar size={20} color={Colors.primary} />
              <Text style={styles.actionButtonText}>Block Day</Text>
            </TouchableOpacity>
          </View>
        </Card>

        {/* Summary */}
        <Card style={styles.summary}>
          <Text style={styles.sectionTitle}>Weekly Summary</Text>
          
          {daysOfWeek.map((day) => (
            <View key={day.key} style={styles.summaryRow}>
              <Text style={styles.summaryDay}>{day.label}</Text>
              <Text style={styles.summarySlots}>
                {availability[day.key].length} slots available
              </Text>
            </View>
          ))}
        </Card>

        <View style={styles.buttonContainer}>
          <Button
            title="Save Schedule"
            onPress={() => router.back()}
            style={styles.saveButton}
          />
        </View>

        <View style={styles.bottomSpacing} />
      </ScrollView>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
    paddingTop: 60, // Increased to lower the content more
  },
  daySelector: {
    margin: 20,
    marginBottom: 16,
    padding: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.text,
    marginBottom: 16,
  },
  daysScroll: {
    flexDirection: 'row',
  },
  dayChip: {
    backgroundColor: Colors.background,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 8,
    marginRight: 8,
  },
  selectedDayChip: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  dayChipText: {
    fontSize: 14,
    color: Colors.text,
    fontWeight: '500',
  },
  selectedDayChipText: {
    color: Colors.white,
  },
  timeSlotsCard: {
    marginHorizontal: 20,
    marginBottom: 16,
    padding: 20,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  dayInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  selectedDayText: {
    fontSize: 14,
    color: Colors.primary,
    fontWeight: '500',
  },
  timeSlotsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  timeSlot: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.background,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    gap: 6,
    minWidth: '30%',
  },
  selectedTimeSlot: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  timeSlotText: {
    fontSize: 14,
    color: Colors.text,
    fontWeight: '500',
  },
  selectedTimeSlotText: {
    color: Colors.white,
  },
  quickActions: {
    marginHorizontal: 20,
    marginBottom: 16,
    padding: 20,
  },
  actionButtons: {
    flexDirection: 'row',
    gap: 12,
  },
  actionButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.background,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: 8,
    paddingVertical: 12,
    gap: 8,
  },
  actionButtonText: {
    fontSize: 14,
    color: Colors.primary,
    fontWeight: '500',
  },
  summary: {
    marginHorizontal: 20,
    marginBottom: 16,
    padding: 20,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  summaryDay: {
    fontSize: 14,
    fontWeight: '500',
    color: Colors.text,
  },
  summarySlots: {
    fontSize: 14,
    color: Colors.textSecondary,
  },
  buttonContainer: {
    paddingHorizontal: 20,
  },
  saveButton: {
    backgroundColor: Colors.primary,
  },
  bottomSpacing: {
    height: 100,
  },
});