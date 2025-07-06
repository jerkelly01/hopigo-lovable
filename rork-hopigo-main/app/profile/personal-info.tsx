import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Stack } from 'expo-router';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { useAuthStore } from '@/store/auth-store';
import { User } from 'lucide-react-native';
import colors from '@/constants/colors';

export default function PersonalInfoScreen() {
  const { user } = useAuthStore();
  
  return (
    <SafeAreaView style={styles.container} edges={['bottom']}>
      <Stack.Screen options={{ 
        title: "Personal Information",
        headerStyle: {
          backgroundColor: colors.primary,
        },
        headerTintColor: '#fff',
      }} />
      
      <ScrollView style={styles.scrollView}>
        <View style={styles.profileImageContainer}>
          <View style={styles.profileImage}>
            <User size={40} color={colors.primary} />
          </View>
          <Button 
            title="Change Photo" 
            variant="outline"
            style={styles.changePhotoButton}
          />
        </View>
        
        <View style={styles.formContainer}>
          <Text style={styles.sectionTitle}>Basic Information</Text>
          
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Full Name</Text>
            <Input 
              value={user?.name || ""}
              placeholder="Enter your full name"
            />
          </View>
          
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Email</Text>
            <Input 
              value={user?.email || ""}
              placeholder="Enter your email"
              keyboardType="email-address"
            />
          </View>
          
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Phone Number</Text>
            <Input 
              value={user?.phone || ""}
              placeholder="Enter your phone number"
              keyboardType="phone-pad"
            />
          </View>
          
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Address</Text>
            <Input 
              value={user?.address ?? ""}
              placeholder="Enter your address"
            />
          </View>
          
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Date of Birth</Text>
            <Input 
              value={user?.dob ?? ""}
              placeholder="MM/DD/YYYY"
            />
          </View>
        </View>
        
        <Button 
          title="Save Changes" 
          style={styles.saveButton}
        />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  scrollView: {
    flex: 1,
    padding: 16,
  },
  profileImageContainer: {
    alignItems: 'center',
    marginBottom: 24,
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#f0f0f0',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  changePhotoButton: {
    width: 150,
  },
  formContainer: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 16,
    color: colors.primary,
  },
  inputGroup: {
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    fontWeight: '500',
    color: colors.textSecondary,
    marginBottom: 8,
  },
  saveButton: {
    marginBottom: 24,
  },
});