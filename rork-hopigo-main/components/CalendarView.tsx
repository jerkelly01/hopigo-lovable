import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { ChevronLeft, ChevronRight } from 'lucide-react-native';
import Colors from '@/constants/colors';

interface CalendarViewProps {
  selectedDate: Date;
  onDateChange: (date: Date) => void;
  markedDates?: {
    [date: string]: {
      marked?: boolean;
      dotColor?: string;
      selected?: boolean;
    };
  };
  minDate?: Date;
  maxDate?: Date;
}

export const CalendarView: React.FC<CalendarViewProps> = ({
  selectedDate,
  onDateChange,
  markedDates = {},
  minDate,
  maxDate,
}) => {
  const [currentMonth, setCurrentMonth] = useState(new Date(selectedDate));
  
  // Format date as YYYY-MM-DD for comparison
  const formatDateKey = (date: Date) => {
    return date.toISOString().split('T')[0];
  };
  
  // Check if a date is selected
  const isDateSelected = (date: Date) => {
    return formatDateKey(date) === formatDateKey(selectedDate);
  };
  
  // Check if a date is marked
  const isDateMarked = (date: Date) => {
    const dateKey = formatDateKey(date);
    return markedDates[dateKey] && markedDates[dateKey].marked;
  };
  
  // Get dot color for marked date
  const getDateDotColor = (date: Date) => {
    const dateKey = formatDateKey(date);
    return markedDates[dateKey]?.dotColor || Colors.primary;
  };
  
  // Check if a date is in the current month
  const isCurrentMonth = (date: Date) => {
    return date.getMonth() === currentMonth.getMonth();
  };
  
  // Check if a date is today
  const isToday = (date: Date) => {
    const today = new Date();
    return formatDateKey(date) === formatDateKey(today);
  };
  
  // Check if a date is selectable (within min and max dates)
  const isDateSelectable = (date: Date) => {
    if (minDate && date < minDate) return false;
    if (maxDate && date > maxDate) return false;
    return true;
  };
  
  // Generate days for the current month view
  const generateDays = () => {
    const days = [];
    const firstDayOfMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), 1);
    const lastDayOfMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 0);
    
    // Get the first day to display (might be from previous month)
    const firstDayToDisplay = new Date(firstDayOfMonth);
    firstDayToDisplay.setDate(firstDayToDisplay.getDate() - firstDayOfMonth.getDay());
    
    // Get the last day to display (might be from next month)
    const lastDayToDisplay = new Date(lastDayOfMonth);
    const daysToAdd = 6 - lastDayOfMonth.getDay();
    lastDayToDisplay.setDate(lastDayToDisplay.getDate() + daysToAdd);
    
    // Generate all days to display
    const currentDay = new Date(firstDayToDisplay);
    while (currentDay <= lastDayToDisplay) {
      days.push(new Date(currentDay));
      currentDay.setDate(currentDay.getDate() + 1);
    }
    
    return days;
  };
  
  // Navigate to previous month
  const goToPreviousMonth = () => {
    const newMonth = new Date(currentMonth);
    newMonth.setMonth(newMonth.getMonth() - 1);
    setCurrentMonth(newMonth);
  };
  
  // Navigate to next month
  const goToNextMonth = () => {
    const newMonth = new Date(currentMonth);
    newMonth.setMonth(newMonth.getMonth() + 1);
    setCurrentMonth(newMonth);
  };
  
  // Handle date selection
  const handleDateSelect = (date: Date) => {
    if (isDateSelectable(date)) {
      onDateChange(date);
    }
  };
  
  // Get days of the week
  const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  
  // Get all days to display
  const days = generateDays();
  
  return (
    <View style={styles.container}>
      {/* Month navigation */}
      <View style={styles.header}>
        <TouchableOpacity onPress={goToPreviousMonth} style={styles.navButton}>
          <ChevronLeft size={24} color={Colors.text} />
        </TouchableOpacity>
        
        <Text style={styles.monthTitle}>
          {currentMonth.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
        </Text>
        
        <TouchableOpacity onPress={goToNextMonth} style={styles.navButton}>
          <ChevronRight size={24} color={Colors.text} />
        </TouchableOpacity>
      </View>
      
      {/* Days of week */}
      <View style={styles.weekdaysContainer}>
        {daysOfWeek.map((day, index) => (
          <View key={index} style={styles.weekdayCell}>
            <Text style={styles.weekdayText}>{day}</Text>
          </View>
        ))}
      </View>
      
      {/* Calendar grid */}
      <View style={styles.daysContainer}>
        {days.map((date, index) => (
          <TouchableOpacity
            key={index}
            style={[
              styles.dayCell,
              !isCurrentMonth(date) && styles.otherMonthDay,
              isDateSelected(date) && styles.selectedDay,
              !isDateSelectable(date) && styles.disabledDay,
            ]}
            onPress={() => handleDateSelect(date)}
            disabled={!isDateSelectable(date)}
          >
            <Text style={[
              styles.dayText,
              isToday(date) && styles.todayText,
              isDateSelected(date) && styles.selectedDayText,
              !isCurrentMonth(date) && styles.otherMonthDayText,
              !isDateSelectable(date) && styles.disabledDayText,
            ]}>
              {date.getDate()}
            </Text>
            
            {isDateMarked(date) && (
              <View 
                style={[
                  styles.dateDot,
                  { backgroundColor: getDateDotColor(date) }
                ]} 
              />
            )}
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.white,
    borderRadius: 12,
    overflow: 'hidden',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  navButton: {
    padding: 4,
  },
  monthTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.text,
  },
  weekdaysContainer: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  weekdayCell: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 8,
  },
  weekdayText: {
    fontSize: 12,
    fontWeight: '500',
    color: Colors.textSecondary,
  },
  daysContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  dayCell: {
    width: '14.28%', // 100% / 7 days
    aspectRatio: 1,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  dayText: {
    fontSize: 14,
    color: Colors.text,
  },
  todayText: {
    fontWeight: '700',
    color: Colors.primary,
  },
  selectedDay: {
    backgroundColor: Colors.primary,
    borderRadius: 20,
  },
  selectedDayText: {
    color: Colors.white,
    fontWeight: '600',
  },
  otherMonthDay: {
    opacity: 0.5,
  },
  otherMonthDayText: {
    color: Colors.textSecondary,
  },
  disabledDay: {
    opacity: 0.3,
  },
  disabledDayText: {
    color: Colors.textSecondary,
  },
  dateDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    position: 'absolute',
    bottom: 6,
  },
});