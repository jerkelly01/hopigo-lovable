import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { Stack } from 'expo-router';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { ArrowLeft, Phone, AlertTriangle, Clock, MapPin } from 'lucide-react-native';
import Colors from '@/constants/colors';

const emergencyServices = [
  {
    id: 'police',
    name: 'Police',
    number: '911',
    icon: 'shield',
    color: '#FF6B6B',
  },
  {
    id: 'fire',
    name: 'Fire Department',
    number: '911',
    icon: 'flame',
    color: '#FF8A80',
  },
  {
    id: 'medical',
    name: 'Medical Emergency',
    number: '911',
    icon: 'heart-pulse',
    color: '#4ECDC4',
  },
  {
    id: 'roadside',
    name: 'Roadside Assistance',
    number: '+297-123-4567',
    icon: 'car',
    color: '#FFD93D',
  },
];

export default function EmergencyServicesScreen() {
  const router = useRouter();
  const [location, setLocation] = useState('');
  const [description, setDescription] = useState('');

  const handleEmergencyCall = (service: any) => {
    Alert.alert(
      `Call ${service.name}?`,
      `This will call ${service.number}`,
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Call', onPress: () => console.log(`Calling ${service.number}`) }
      ]
    );
  };

  const handleSubmitRequest = () => {
    if (!location.trim() || !description.trim()) {
      Alert.alert('Missing Information', 'Please provide your location and describe the emergency.');
      return;
    }

    Alert.alert(
      'Emergency Request Sent',
      'Your emergency request has been submitted. Help is on the way.',
      [{ text: 'OK', onPress: () => router.back() }]
    );
  };

  return (
    <>
      <Stack.Screen 
        options={{ 
          title: 'Emergency Services',
          headerStyle: { backgroundColor: '#FF6B6B' },
          headerTintColor: Colors.white,
          headerTitleStyle: { fontWeight: '600' },
          headerLeft: () => (
            <TouchableOpacity onPress={() => router.back()}>
              <ArrowLeft size={24} color={Colors.white} />
            </TouchableOpacity>
          ),
        }} 
      />
      
      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <AlertTriangle size={48} color="#FF6B6B" />
          <Text style={styles.title}>Emergency Services</Text>
          <Text style={styles.subtitle}>
            Get immediate help when you need it most
          </Text>
        </View>

        <View style={styles.emergencyGrid}>
          {emergencyServices.map((service) => (
            <TouchableOpacity
              key={service.id}
              style={[styles.emergencyCard, { borderLeftColor: service.color }]}
              onPress={() => handleEmergencyCall(service)}
            >
              <View style={styles.emergencyCardContent}>
                <Text style={styles.emergencyName}>{service.name}</Text>
                <Text style={styles.emergencyNumber}>{service.number}</Text>
              </View>
              <Phone size={24} color={service.color} />
            </TouchableOpacity>
          ))}
        </View>

        <Card style={styles.requestCard}>
          <Text style={styles.requestTitle}>Request Emergency Assistance</Text>
          <Text style={styles.requestDescription}>
            If you need immediate help, fill out this form and we will dispatch the nearest available service provider.
          </Text>

          <Input
            label="Your Location"
            value={location}
            onChangeText={setLocation}
            placeholder="Enter your current location"
            leftIcon={<MapPin size={20} color={Colors.textSecondary} />}
            containerStyle={styles.inputContainer}
          />

          <Input
            label="Emergency Description"
            value={description}
            onChangeText={setDescription}
            placeholder="Describe the emergency situation"
            multiline
            numberOfLines={4}
            leftIcon={<AlertTriangle size={20} color={Colors.textSecondary} />}
            containerStyle={styles.inputContainer}
          />

          <Button
            title="Submit Emergency Request"
            onPress={handleSubmitRequest}
            style={styles.submitButton}
          />
        </Card>

        <Card style={styles.tipsCard}>
          <Text style={styles.tipsTitle}>Emergency Tips</Text>
          <View style={styles.tipsList}>
            <View style={styles.tipItem}>
              <Clock size={16} color={Colors.primary} />
              <Text style={styles.tipText}>Stay calm and provide clear information</Text>
            </View>
            <View style={styles.tipItem}>
              <MapPin size={16} color={Colors.primary} />
              <Text style={styles.tipText}>Share your exact location</Text>
            </View>
            <View style={styles.tipItem}>
              <Phone size={16} color={Colors.primary} />
              <Text style={styles.tipText}>Keep your phone charged and accessible</Text>
            </View>
          </View>
        </Card>
      </ScrollView>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  header: {
    padding: 20,
    paddingTop: 40,
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: Colors.text,
    textAlign: 'center',
    marginTop: 16,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: Colors.textSecondary,
    textAlign: 'center',
    lineHeight: 22,
  },
  emergencyGrid: {
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  emergencyCard: {
    backgroundColor: Colors.card,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderLeftWidth: 4,
    shadowColor: Colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  emergencyCardContent: {
    flex: 1,
  },
  emergencyName: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.text,
    marginBottom: 4,
  },
  emergencyNumber: {
    fontSize: 14,
    color: Colors.textSecondary,
  },
  requestCard: {
    marginHorizontal: 20,
    marginTop: 32,
    padding: 20,
  },
  requestTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.text,
    marginBottom: 8,
  },
  requestDescription: {
    fontSize: 14,
    color: Colors.textSecondary,
    lineHeight: 20,
    marginBottom: 20,
  },
  inputContainer: {
    marginBottom: 16,
  },
  submitButton: {
    marginTop: 8,
    backgroundColor: '#FF6B6B',
  },
  tipsCard: {
    marginHorizontal: 20,
    marginTop: 20,
    marginBottom: 40,
    padding: 20,
  },
  tipsTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.text,
    marginBottom: 16,
  },
  tipsList: {
    gap: 12,
  },
  tipItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  tipText: {
    fontSize: 14,
    color: Colors.text,
    flex: 1,
  },
});