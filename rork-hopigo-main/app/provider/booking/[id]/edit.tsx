import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { useRouter, useLocalSearchParams, Stack } from 'expo-router';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { 
  ArrowLeft,
  Calendar,
  Clock,
  MapPin,
  DollarSign,
  Save
} from 'lucide-react-native';
import Colors from '@/constants/colors';

export default function EditBookingScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams();

  // Mock booking data - in a real app, this would come from your backend
  const [bookingData, setBookingData] = useState({
    service: 'House Cleaning',
    description: 'Deep cleaning for 3-bedroom house including kitchen, bathrooms, and living areas.',
    date: '2024-01-15',
    time: '10:00 AM',
    endTime: '2:00 PM',
    address: '123 Main Street, Oranjestad, Aruba',
    amount: 85,
    specialInstructions: 'Please use eco-friendly cleaning products. Keys will be left under the mat.',
  });

  const handleSave = () => {
    // Handle saving booking changes
    Alert.alert(
      'Booking Updated',
      'The booking has been successfully updated.',
      [
        {
          text: 'OK',
          onPress: () => router.back(),
        },
      ]
    );
  };

  const formatCurrency = (amount: number) => {
    return `AWG ${amount.toLocaleString()}`;
  };

  return (
    <>
      <Stack.Screen 
        options={{ 
          title: 'Edit Booking',
          headerStyle: { backgroundColor: Colors.primary },
          headerTintColor: Colors.white,
          headerTitleStyle: { fontWeight: '600' },
          headerLeft: () => (
            <TouchableOpacity onPress={() => router.back()}>
              <ArrowLeft size={24} color={Colors.white} />
            </TouchableOpacity>
          ),
          headerRight: () => (
            <TouchableOpacity onPress={handleSave}>
              <Save size={24} color={Colors.white} />
            </TouchableOpacity>
          ),
        }} 
      />
      
      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        {/* Service Details */}
        <Card style={styles.section}>
          <Text style={styles.sectionTitle}>Service Details</Text>
          
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Service Name</Text>
            <Input
              value={bookingData.service}
              onChangeText={(text) => setBookingData({ ...bookingData, service: text })}
              placeholder="Enter service name"
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Description</Text>
            <Input
              value={bookingData.description}
              onChangeText={(text) => setBookingData({ ...bookingData, description: text })}
              placeholder="Enter service description"
              multiline
              numberOfLines={3}
              style={styles.textArea}
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Service Fee</Text>
            <Input
              value={bookingData.amount.toString()}
              onChangeText={(text) => setBookingData({ ...bookingData, amount: parseInt(text) || 0 })}
              placeholder="Enter amount"
              keyboardType="numeric"
              leftIcon={<DollarSign size={20} color={Colors.textSecondary} />}
            />
          </View>
        </Card>

        {/* Schedule */}
        <Card style={styles.section}>
          <Text style={styles.sectionTitle}>Schedule</Text>
          
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Date</Text>
            <TouchableOpacity style={styles.dateInput}>
              <Calendar size={20} color={Colors.textSecondary} />
              <Text style={styles.dateText}>{bookingData.date}</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.timeRow}>
            <View style={[styles.inputGroup, styles.timeInput]}>
              <Text style={styles.label}>Start Time</Text>
              <TouchableOpacity style={styles.timeButton}>
                <Clock size={20} color={Colors.textSecondary} />
                <Text style={styles.timeText}>{bookingData.time}</Text>
              </TouchableOpacity>
            </View>

            <View style={[styles.inputGroup, styles.timeInput]}>
              <Text style={styles.label}>End Time</Text>
              <TouchableOpacity style={styles.timeButton}>
                <Clock size={20} color={Colors.textSecondary} />
                <Text style={styles.timeText}>{bookingData.endTime}</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Card>

        {/* Location */}
        <Card style={styles.section}>
          <Text style={styles.sectionTitle}>Location</Text>
          
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Address</Text>
            <Input
              value={bookingData.address}
              onChangeText={(text) => setBookingData({ ...bookingData, address: text })}
              placeholder="Enter service address"
              leftIcon={<MapPin size={20} color={Colors.textSecondary} />}
            />
          </View>
        </Card>

        {/* Special Instructions */}
        <Card style={styles.section}>
          <Text style={styles.sectionTitle}>Special Instructions</Text>
          
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Instructions</Text>
            <Input
              value={bookingData.specialInstructions}
              onChangeText={(text) => setBookingData({ ...bookingData, specialInstructions: text })}
              placeholder="Enter any special instructions"
              multiline
              numberOfLines={3}
              style={styles.textArea}
            />
          </View>
        </Card>

        {/* Summary */}
        <Card style={styles.summaryCard}>
          <Text style={styles.sectionTitle}>Booking Summary</Text>
          
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Service</Text>
            <Text style={styles.summaryValue}>{bookingData.service}</Text>
          </View>
          
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Date & Time</Text>
            <Text style={styles.summaryValue}>{bookingData.date} at {bookingData.time}</Text>
          </View>
          
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Location</Text>
            <Text style={styles.summaryValue}>{bookingData.address}</Text>
          </View>
          
          <View style={[styles.summaryRow, styles.totalRow]}>
            <Text style={styles.totalLabel}>Total Amount</Text>
            <Text style={styles.totalValue}>{formatCurrency(bookingData.amount)}</Text>
          </View>
        </Card>

        {/* Action Buttons */}
        <View style={styles.actionButtons}>
          <Button
            title="Save Changes"
            onPress={handleSave}
            style={styles.saveButton}
          />
          <Button
            title="Cancel"
            onPress={() => router.back()}
            style={styles.cancelButton}
            textStyle={styles.cancelButtonText}
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
  },
  section: {
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
  inputGroup: {
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    fontWeight: '500',
    color: Colors.text,
    marginBottom: 8,
  },
  textArea: {
    height: 80,
    textAlignVertical: 'top',
  },
  dateInput: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: Colors.card,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  dateText: {
    fontSize: 16,
    color: Colors.text,
  },
  timeRow: {
    flexDirection: 'row',
    gap: 12,
  },
  timeInput: {
    flex: 1,
  },
  timeButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: Colors.card,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  timeText: {
    fontSize: 16,
    color: Colors.text,
  },
  summaryCard: {
    margin: 20,
    marginBottom: 16,
    padding: 20,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  summaryLabel: {
    fontSize: 14,
    color: Colors.textSecondary,
    flex: 1,
  },
  summaryValue: {
    fontSize: 14,
    color: Colors.text,
    fontWeight: '500',
    flex: 2,
    textAlign: 'right',
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
    flex: 1,
  },
  totalValue: {
    fontSize: 16,
    color: Colors.primary,
    fontWeight: '700',
    flex: 2,
    textAlign: 'right',
  },
  actionButtons: {
    paddingHorizontal: 20,
    gap: 12,
  },
  saveButton: {
    backgroundColor: Colors.primary,
  },
  cancelButton: {
    backgroundColor: Colors.background,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  cancelButtonText: {
    color: Colors.textSecondary,
  },
  bottomSpacing: {
    height: 100,
  },
});