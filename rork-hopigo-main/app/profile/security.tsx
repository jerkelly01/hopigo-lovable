import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Switch, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Stack } from 'expo-router';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { Eye, EyeOff, Lock, Shield, Smartphone } from 'lucide-react-native';
import colors from '@/constants/colors';

interface SecuritySettings {
  biometricLogin: boolean;
  twoFactorAuth: boolean;
  appLock: boolean;
}

interface PasswordForm {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

interface SecurityToggleItemProps {
  title: string;
  description: string;
  icon: React.ReactNode;
  value: boolean;
  onToggle: () => void;
}

export default function SecurityScreen() {
  const [securitySettings, setSecuritySettings] = useState<SecuritySettings>({
    biometricLogin: true,
    twoFactorAuth: false,
    appLock: false,
  });
  
  const [passwordForm, setPasswordForm] = useState<PasswordForm>({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  const toggleSwitch = (key: keyof SecuritySettings) => {
    setSecuritySettings(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  const handlePasswordChange = (field: keyof PasswordForm, value: string) => {
    setPasswordForm(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const SecurityToggleItem = ({ title, description, icon, value, onToggle }: SecurityToggleItemProps) => (
    <View style={styles.securityItem}>
      <View style={styles.securityIconContainer}>
        {icon}
      </View>
      <View style={styles.securityInfo}>
        <Text style={styles.securityTitle}>{title}</Text>
        <Text style={styles.securityDescription}>{description}</Text>
      </View>
      <Switch
        trackColor={{ false: '#d1d1d1', true: colors.primaryLight }}
        thumbColor={value ? colors.primary : '#f4f3f4'}
        ios_backgroundColor="#d1d1d1"
        onValueChange={onToggle}
        value={value}
      />
    </View>
  );

  return (
    <SafeAreaView style={styles.container} edges={['bottom']}>
      <Stack.Screen options={{ 
        title: "Security",
        headerStyle: {
          backgroundColor: colors.primary,
        },
        headerTintColor: '#fff',
      }} />
      
      <ScrollView style={styles.scrollView}>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Change Password</Text>
          
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Current Password</Text>
            <Input
              value={passwordForm.currentPassword}
              onChangeText={(text) => handlePasswordChange('currentPassword', text)}
              placeholder="Enter current password"
              isPassword
            />
          </View>
          
          <View style={styles.inputGroup}>
            <Text style={styles.label}>New Password</Text>
            <Input
              value={passwordForm.newPassword}
              onChangeText={(text) => handlePasswordChange('newPassword', text)}
              placeholder="Enter new password"
              isPassword
            />
          </View>
          
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Confirm New Password</Text>
            <Input
              value={passwordForm.confirmPassword}
              onChangeText={(text) => handlePasswordChange('confirmPassword', text)}
              placeholder="Confirm new password"
              isPassword
            />
          </View>
          
          <Button 
            title="Update Password" 
            style={styles.updateButton}
          />
        </View>
        
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Security Options</Text>
          
          <SecurityToggleItem
            title="Biometric Login"
            description="Use fingerprint or face recognition to log in"
            icon={<Smartphone size={24} color={colors.primary} />}
            value={securitySettings.biometricLogin}
            onToggle={() => toggleSwitch('biometricLogin')}
          />
          
          <SecurityToggleItem
            title="Two-Factor Authentication"
            description="Add an extra layer of security to your account"
            icon={<Shield size={24} color={colors.primary} />}
            value={securitySettings.twoFactorAuth}
            onToggle={() => toggleSwitch('twoFactorAuth')}
          />
          
          <SecurityToggleItem
            title="App Lock"
            description="Require authentication every time you open the app"
            icon={<Lock size={24} color={colors.primary} />}
            value={securitySettings.appLock}
            onToggle={() => toggleSwitch('appLock')}
          />
        </View>
        
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Recent Activities</Text>
          <View style={styles.activityItem}>
            <Text style={styles.activityTitle}>Password Changed</Text>
            <Text style={styles.activityDate}>May 15, 2025 • 10:23 AM</Text>
          </View>
          
          <View style={styles.activityItem}>
            <Text style={styles.activityTitle}>New Login from iPhone 15</Text>
            <Text style={styles.activityDate}>May 10, 2025 • 8:45 PM</Text>
          </View>
          
          <View style={styles.activityItem}>
            <Text style={styles.activityTitle}>Two-Factor Authentication Enabled</Text>
            <Text style={styles.activityDate}>May 5, 2025 • 3:12 PM</Text>
          </View>
          
          <TouchableOpacity style={styles.viewAllButton}>
            <Text style={styles.viewAllText}>View All Activity</Text>
          </TouchableOpacity>
        </View>
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
  section: {
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
  updateButton: {
    marginTop: 8,
    marginBottom: 16,
  },
  securityItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  securityIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#f5f5f5',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  securityInfo: {
    flex: 1,
  },
  securityTitle: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 4,
  },
  securityDescription: {
    fontSize: 14,
    color: '#777',
  },
  activityItem: {
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  activityTitle: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 4,
  },
  activityDate: {
    fontSize: 14,
    color: '#777',
  },
  viewAllButton: {
    marginTop: 12,
    alignItems: 'center',
  },
  viewAllText: {
    fontSize: 16,
    color: colors.primary,
    fontWeight: '500',
  },
});