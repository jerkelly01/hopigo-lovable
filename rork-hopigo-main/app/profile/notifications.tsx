import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Switch } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Stack } from 'expo-router';
import colors from '@/constants/colors';

interface NotificationSettings {
  pushNotifications: boolean;
  emailNotifications: boolean;
  bookingReminders: boolean;
  paymentAlerts: boolean;
  promotions: boolean;
  newProviders: boolean;
  appUpdates: boolean;
}

interface NotificationItemProps {
  title: string;
  description: string;
  value: boolean;
  onToggle: () => void;
}

export default function NotificationsScreen() {
  const [notificationSettings, setNotificationSettings] = useState<NotificationSettings>({
    pushNotifications: true,
    emailNotifications: true,
    bookingReminders: true,
    paymentAlerts: true,
    promotions: false,
    newProviders: true,
    appUpdates: true,
  });

  const toggleSwitch = (key: keyof NotificationSettings) => {
    setNotificationSettings(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  const NotificationItem = ({ title, description, value, onToggle }: NotificationItemProps) => (
    <View style={styles.notificationItem}>
      <View style={styles.notificationInfo}>
        <Text style={styles.notificationTitle}>{title}</Text>
        <Text style={styles.notificationDescription}>{description}</Text>
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
        title: "Notifications",
        headerStyle: {
          backgroundColor: colors.primary,
        },
        headerTintColor: '#fff',
      }} />
      
      <ScrollView style={styles.scrollView}>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>General Notifications</Text>
          
          <NotificationItem
            title="Push Notifications"
            description="Receive notifications on your device"
            value={notificationSettings.pushNotifications}
            onToggle={() => toggleSwitch('pushNotifications')}
          />
          
          <NotificationItem
            title="Email Notifications"
            description="Receive notifications via email"
            value={notificationSettings.emailNotifications}
            onToggle={() => toggleSwitch('emailNotifications')}
          />
        </View>
        
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Booking & Payments</Text>
          
          <NotificationItem
            title="Booking Reminders"
            description="Get reminded about upcoming bookings"
            value={notificationSettings.bookingReminders}
            onToggle={() => toggleSwitch('bookingReminders')}
          />
          
          <NotificationItem
            title="Payment Alerts"
            description="Get notified about payments and transactions"
            value={notificationSettings.paymentAlerts}
            onToggle={() => toggleSwitch('paymentAlerts')}
          />
        </View>
        
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Marketing & Updates</Text>
          
          <NotificationItem
            title="Promotions & Offers"
            description="Receive special offers and discounts"
            value={notificationSettings.promotions}
            onToggle={() => toggleSwitch('promotions')}
          />
          
          <NotificationItem
            title="New Providers"
            description="Get notified when new providers join the platform"
            value={notificationSettings.newProviders}
            onToggle={() => toggleSwitch('newProviders')}
          />
          
          <NotificationItem
            title="App Updates"
            description="Get notified about new features and updates"
            value={notificationSettings.appUpdates}
            onToggle={() => toggleSwitch('appUpdates')}
          />
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
  notificationItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  notificationInfo: {
    flex: 1,
    marginRight: 16,
  },
  notificationTitle: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 4,
  },
  notificationDescription: {
    fontSize: 14,
    color: '#777',
  },
});