import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Switch, Alert } from 'react-native';
import { useRouter, Stack } from 'expo-router';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { 
  ArrowLeft, 
  Bell, 
  DollarSign, 
  Clock, 
  MapPin, 
  Shield, 
  HelpCircle,
  ChevronRight,
  LogOut,
  X
} from 'lucide-react-native';
import Colors from '@/constants/colors';

export default function ProviderSettingsScreen() {
  const router = useRouter();
  const [notifications, setNotifications] = useState({
    newBookings: true,
    reminders: true,
    promotions: false,
    reviews: true,
  });

  const [autoAccept, setAutoAccept] = useState(false);
  const [instantBooking, setInstantBooking] = useState(true);

  const handleLogout = () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Logout', 
          style: 'destructive',
          onPress: () => {
            // Handle logout logic here
            router.replace('/auth/login');
          }
        }
      ]
    );
  };

  const settingSections = [
    {
      title: 'Business Settings',
      items: [
        {
          icon: <DollarSign size={20} color={Colors.primary} />,
          title: 'Pricing & Services',
          subtitle: 'Manage your service rates',
          onPress: () => router.push('/provider/pricing'),
        },
        {
          icon: <Clock size={20} color={Colors.primary} />,
          title: 'Working Hours',
          subtitle: 'Set your availability',
          onPress: () => router.push('/provider/schedule'),
        },
        {
          icon: <MapPin size={20} color={Colors.primary} />,
          title: 'Service Areas',
          subtitle: 'Define where you work',
          onPress: () => router.push('/provider/service-areas'),
        },
      ]
    },
    {
      title: 'Account & Security',
      items: [
        {
          icon: <Shield size={20} color={Colors.primary} />,
          title: 'Privacy & Security',
          subtitle: 'Manage your account security',
          onPress: () => router.push('/profile/security'),
        },
        {
          icon: <HelpCircle size={20} color={Colors.primary} />,
          title: 'Help & Support',
          subtitle: 'Get help or contact us',
          onPress: () => router.push('/profile/support'),
        },
      ]
    }
  ];

  return (
    <>
      <Stack.Screen 
        options={{ 
          title: 'Provider Settings',
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
        {/* Notification Settings */}
        <Card style={styles.card}>
          <View style={styles.cardHeader}>
            <Bell size={20} color={Colors.primary} />
            <Text style={styles.cardTitle}>Notifications</Text>
          </View>
          
          <View style={styles.settingRow}>
            <View style={styles.settingInfo}>
              <Text style={styles.settingTitle}>New Bookings</Text>
              <Text style={styles.settingSubtitle}>Get notified of new booking requests</Text>
            </View>
            <Switch
              value={notifications.newBookings}
              onValueChange={(value) => setNotifications(prev => ({ ...prev, newBookings: value }))}
              trackColor={{ false: Colors.border, true: Colors.primary }}
              thumbColor={Colors.white}
            />
          </View>
          
          <View style={styles.settingRow}>
            <View style={styles.settingInfo}>
              <Text style={styles.settingTitle}>Reminders</Text>
              <Text style={styles.settingSubtitle}>Upcoming appointment reminders</Text>
            </View>
            <Switch
              value={notifications.reminders}
              onValueChange={(value) => setNotifications(prev => ({ ...prev, reminders: value }))}
              trackColor={{ false: Colors.border, true: Colors.primary }}
              thumbColor={Colors.white}
            />
          </View>
          
          <View style={styles.settingRow}>
            <View style={styles.settingInfo}>
              <Text style={styles.settingTitle}>Promotions</Text>
              <Text style={styles.settingSubtitle}>Marketing and promotional updates</Text>
            </View>
            <Switch
              value={notifications.promotions}
              onValueChange={(value) => setNotifications(prev => ({ ...prev, promotions: value }))}
              trackColor={{ false: Colors.border, true: Colors.primary }}
              thumbColor={Colors.white}
            />
          </View>
          
          <View style={styles.settingRow}>
            <View style={styles.settingInfo}>
              <Text style={styles.settingTitle}>Reviews</Text>
              <Text style={styles.settingSubtitle}>New customer reviews and ratings</Text>
            </View>
            <Switch
              value={notifications.reviews}
              onValueChange={(value) => setNotifications(prev => ({ ...prev, reviews: value }))}
              trackColor={{ false: Colors.border, true: Colors.primary }}
              thumbColor={Colors.white}
            />
          </View>
        </Card>

        {/* Booking Settings */}
        <Card style={styles.card}>
          <Text style={styles.cardTitle}>Booking Preferences</Text>
          
          <View style={styles.settingRow}>
            <View style={styles.settingInfo}>
              <Text style={styles.settingTitle}>Auto-Accept Bookings</Text>
              <Text style={styles.settingSubtitle}>Automatically accept new requests</Text>
            </View>
            <Switch
              value={autoAccept}
              onValueChange={setAutoAccept}
              trackColor={{ false: Colors.border, true: Colors.primary }}
              thumbColor={Colors.white}
            />
          </View>
          
          <View style={styles.settingRow}>
            <View style={styles.settingInfo}>
              <Text style={styles.settingTitle}>Instant Booking</Text>
              <Text style={styles.settingSubtitle}>Allow customers to book instantly</Text>
            </View>
            <Switch
              value={instantBooking}
              onValueChange={setInstantBooking}
              trackColor={{ false: Colors.border, true: Colors.primary }}
              thumbColor={Colors.white}
            />
          </View>
        </Card>

        {/* Settings Sections */}
        {settingSections.map((section, sectionIndex) => (
          <Card key={sectionIndex} style={styles.card}>
            <Text style={styles.cardTitle}>{section.title}</Text>
            
            {section.items.map((item, itemIndex) => (
              <TouchableOpacity
                key={itemIndex}
                style={styles.settingRow}
                onPress={item.onPress}
              >
                <View style={styles.settingIcon}>
                  {item.icon}
                </View>
                <View style={styles.settingInfo}>
                  <Text style={styles.settingTitle}>{item.title}</Text>
                  <Text style={styles.settingSubtitle}>{item.subtitle}</Text>
                </View>
                <ChevronRight size={20} color={Colors.textSecondary} />
              </TouchableOpacity>
            ))}
          </Card>
        ))}

        {/* Logout Button */}
        <View style={styles.logoutContainer}>
          <TouchableOpacity
            style={styles.logoutButton}
            onPress={handleLogout}
          >
            <LogOut size={20} color={Colors.error} />
            <Text style={styles.logoutButtonText}>Logout</Text>
          </TouchableOpacity>
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
  card: {
    margin: 20,
    marginBottom: 16,
    padding: 20,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    gap: 8,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.text,
    marginBottom: 16,
  },
  settingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  settingIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.primary + '20',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  settingInfo: {
    flex: 1,
  },
  settingTitle: {
    fontSize: 16,
    fontWeight: '500',
    color: Colors.text,
    marginBottom: 2,
  },
  settingSubtitle: {
    fontSize: 14,
    color: Colors.textSecondary,
  },
  logoutContainer: {
    paddingHorizontal: 20,
    marginTop: 20,
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.background,
    borderWidth: 1,
    borderColor: Colors.error,
    borderRadius: 8,
    paddingVertical: 14,
    paddingHorizontal: 20,
    gap: 8,
  },
  logoutButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.error,
  },
  bottomSpacing: {
    height: 100,
  },
});