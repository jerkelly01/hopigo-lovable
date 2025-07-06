import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { Stack, useRouter, useLocalSearchParams } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ArrowLeft, AlertTriangle, MapPin, Clock } from 'lucide-react-native';
import Colors from '@/constants/colors';
import { Button } from '@/components/ui/Button';
import { useNotificationStore } from '@/store/notification-store';

export default function UrgentRequestDetailScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams();
  const { markAsRead } = useNotificationStore();
  const [isResponding, setIsResponding] = useState(false);

  // Mock data - in a real app, this would come from a backend
  const requestDetails = {
    id: id as string,
    category: 'Plumbing',
    urgency: 'Immediate',
    location: '123 Main St, Downtown',
    timeRequested: '10 minutes ago',
    description: 'Burst pipe in kitchen, water leaking everywhere. Need immediate assistance.',
    customerName: 'John Doe',
    customerRating: 4.5,
  };

  const handleAcceptRequest = () => {
    setIsResponding(true);
    // Simulate API call
    setTimeout(() => {
      Alert.alert('Request Accepted', 'You have been assigned to this urgent service request. Please contact the customer immediately.', [
        { text: 'OK', onPress: () => router.push('/provider/dashboard') }
      ]);
      setIsResponding(false);
      markAsRead(id as string);
    }, 1000);
  };

  const handleDeclineRequest = () => {
    Alert.alert('Decline Request', 'Are you sure you want to decline this urgent request?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Decline', style: 'destructive', onPress: () => {
        markAsRead(id as string);
        router.back();
      }}
    ]);
  };

  return (
    <SafeAreaView style={styles.container} edges={['bottom']}>
      <Stack.Screen 
        options={{
          title: 'Urgent Request',
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
      
      <View style={styles.contentContainer}>
        <View style={styles.headerSection}>
          <View style={styles.urgencyBadge}>
            <AlertTriangle size={16} color={Colors.white} />
            <Text style={styles.urgencyText}>URGENT - IMMEDIATE RESPONSE NEEDED</Text>
          </View>
          <Text style={styles.serviceTitle}>{requestDetails.category} Emergency</Text>
          <Text style={styles.timeText}>Requested {requestDetails.timeRequested}</Text>
        </View>
        
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Customer Details</Text>
          <View style={styles.infoCard}>
            <Text style={styles.infoPrimary}>{requestDetails.customerName}</Text>
            <Text style={styles.infoSecondary}>Rating: {requestDetails.customerRating}/5</Text>
          </View>
        </View>
        
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Location</Text>
          <View style={styles.infoCard}>
            <View style={styles.infoRow}>
              <MapPin size={20} color={Colors.primary} />
              <Text style={styles.infoPrimary}>{requestDetails.location}</Text>
            </View>
            <Text style={styles.infoSecondary}>Please arrive as soon as possible</Text>
          </View>
        </View>
        
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Problem Description</Text>
          <View style={styles.infoCard}>
            <Text style={styles.descriptionText}>{requestDetails.description}</Text>
          </View>
        </View>
        
        <View style={styles.warningSection}>
          <View style={styles.warningContainer}>
            <AlertTriangle size={20} color={Colors.error} />
            <Text style={styles.warningText}>
              Accepting this request commits you to immediate response. Only accept if you can reach the location and start work ASAP.
            </Text>
          </View>
        </View>
        
        <View style={styles.actionButtons}>
          <Button
            title="Accept Request"
            variant="primary"
            style={styles.acceptButton}
            onPress={handleAcceptRequest}
            disabled={isResponding}
            isLoading={isResponding}
          />
          <Button
            title="Decline Request"
            variant="outline"
            style={styles.declineButton}
            onPress={handleDeclineRequest}
            disabled={isResponding}
          />
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  contentContainer: {
    flex: 1,
    padding: 16,
  },
  headerSection: {
    marginBottom: 24,
    alignItems: 'center',
  },
  urgencyBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.error,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
    marginBottom: 12,
  },
  urgencyText: {
    color: Colors.white,
    fontSize: 12,
    fontWeight: '600',
    marginLeft: 6,
  },
  serviceTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: Colors.text,
    marginBottom: 6,
  },
  timeText: {
    fontSize: 14,
    color: Colors.textSecondary,
  },
  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.text,
    marginBottom: 10,
  },
  infoCard: {
    backgroundColor: Colors.card,
    borderRadius: 10,
    padding: 14,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  infoPrimary: {
    fontSize: 16,
    fontWeight: '500',
    color: Colors.text,
    marginLeft: 10,
  },
  infoSecondary: {
    fontSize: 14,
    color: Colors.textSecondary,
  },
  descriptionText: {
    fontSize: 15,
    color: Colors.text,
    lineHeight: 22,
  },
  warningSection: {
    marginTop: 20,
    marginBottom: 30,
  },
  warningContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.error + '20',
    padding: 12,
    borderRadius: 8,
  },
  warningText: {
    flex: 1,
    marginLeft: 12,
    fontSize: 14,
    color: Colors.error,
    fontWeight: '500',
  },
  actionButtons: {
    flexDirection: 'column',
    alignItems: 'center',
  },
  acceptButton: {
    width: '100%',
    paddingVertical: 16,
    borderRadius: 12,
    marginBottom: 12,
  },
  declineButton: {
    width: '100%',
    paddingVertical: 16,
    borderRadius: 12,
    borderColor: Colors.error,
  },
});