import React, { useState } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, ScrollView } from 'react-native';
import { useRouter, useFocusEffect } from 'expo-router';
import { useAuthStore } from '@/store/auth-store';
import { useLanguage } from '@/contexts/LanguageContext';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { 
  User, 
  Settings, 
  CreditCard, 
  Bell, 
  Shield, 
  HelpCircle, 
  LogOut,
  ChevronRight,
  Calendar
} from 'lucide-react-native';
import Colors from '@/constants/colors';
import { BookingsSection } from '@/components/BookingsSection';

export default function ProfileScreen() {
  const router = useRouter();
  const { t } = useLanguage();
  const { user, logout } = useAuthStore();
  const [activeTab, setActiveTab] = useState('profile'); // 'profile' or 'bookings'
  
  const menuItems = [
    {
      icon: <User size={20} color={Colors.primary} />,
      title: t('personalInformation'),
      onPress: () => router.push('/profile/personal-info'),
    },
    {
      icon: <CreditCard size={20} color={Colors.primary} />,
      title: t('paymentMethods'),
      onPress: () => router.push('/wallet/payment-methods'),
    },
    {
      icon: <Bell size={20} color={Colors.primary} />,
      title: t('notifications'),
      onPress: () => router.push('/profile/notifications'),
    },
    {
      icon: <Shield size={20} color={Colors.primary} />,
      title: t('security'),
      onPress: () => router.push('/profile/security'),
    },
    {
      icon: <HelpCircle size={20} color={Colors.primary} />,
      title: t('helpSupport'),
      onPress: () => router.push('/profile/support'),
    },
    {
      icon: <Settings size={20} color={Colors.primary} />,
      title: t('settings'),
      onPress: () => router.push('/profile/settings'),
    },
  ];

  // Handle screen focus - removed scroll position reset
  useFocusEffect(
    React.useCallback(() => {
      // Any cleanup or reset logic can go here if needed
      const timer = setTimeout(() => {
        // Minimal cleanup without resetting scroll position
      }, 50);

      return () => {
        clearTimeout(timer);
      };
    }, [])
  );
  
  const handleLogout = () => {
    logout();
    router.replace('/auth/login');
  };
  
  if (!user) {
    return (
      <View style={styles.container}>
        <View style={styles.notLoggedInContainer}>
          <Text style={styles.notLoggedInText}>{t('notLoggedIn')}</Text>
          <Button 
            title={t('logIn')} 
            onPress={() => router.push('/auth/login')}
            style={styles.loginButton}
          />
        </View>
      </View>
    );
  }
  
  return (
    <View style={styles.container}>
      {/* Profile Header */}
      <View style={styles.header}>
        <View style={styles.profileInfo}>
          <Image 
            source={{ uri: user.avatar || 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&auto=format&fit=crop&q=60&ixlib=rb-4.0.3' }} 
            style={styles.avatar} 
          />
          <View style={styles.nameContainer}>
            <Text style={styles.name}>{user.name}</Text>
            <Text style={styles.email}>{user.email}</Text>
          </View>
        </View>
        <Button 
          title={t('editProfile')} 
          variant="outline"
          size="small"
          onPress={() => router.push('/profile/edit')}
        />
      </View>
      
      {/* Tab Selector */}
      <View style={styles.tabSelector}>
        <TouchableOpacity 
          style={[
            styles.tabButton, 
            activeTab === 'profile' && styles.activeTabButton
          ]}
          onPress={() => setActiveTab('profile')}
        >
          <User size={20} color={activeTab === 'profile' ? Colors.primary : Colors.textSecondary} />
          <Text style={[
            styles.tabButtonText,
            activeTab === 'profile' && styles.activeTabButtonText
          ]}>{t('profile')}</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={[
            styles.tabButton, 
            activeTab === 'bookings' && styles.activeTabButton
          ]}
          onPress={() => setActiveTab('bookings')}
        >
          <Calendar size={20} color={activeTab === 'bookings' ? Colors.primary : Colors.textSecondary} />
          <Text style={[
            styles.tabButtonText,
            activeTab === 'bookings' && styles.activeTabButtonText
          ]}>{t('bookings')}</Text>
        </TouchableOpacity>
      </View>
      
      {activeTab === 'profile' ? (
        <ScrollView 
          style={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          scrollEventThrottle={16}
          decelerationRate="normal"
          bounces={true}
          bouncesZoom={false}
          alwaysBounceVertical={false}
          removeClippedSubviews={false}
        >
          {/* Provider Status */}
          {user.isServiceProvider ? (
            <Card style={styles.providerCard}>
              <Text style={styles.providerTitle}>{t('serviceProviderDashboard')}</Text>
              <Text style={styles.providerDescription}>
                {t('manageServicesBookings')}
              </Text>
              <Button 
                title={t('goToDashboard')} 
                onPress={() => router.push('/provider/dashboard')}
                style={styles.providerButton}
              />
            </Card>
          ) : (
            <Card style={styles.providerCard}>
              <Text style={styles.providerTitle}>{t('becomeServiceProvider')}</Text>
              <Text style={styles.providerDescription}>
                {t('offerServicesEarn')}
              </Text>
              <Button 
                title={t('getStarted')} 
                onPress={() => router.push('/provider-signup')}
                style={styles.providerButton}
              />
            </Card>
          )}
          
          {/* Menu Items */}
          <Card style={styles.menuCard}>
            {menuItems.map((item, index) => (
              <TouchableOpacity 
                key={index}
                style={[
                  styles.menuItem,
                  index < menuItems.length - 1 && styles.menuItemBorder
                ]}
                onPress={item.onPress}
              >
                <View style={styles.menuItemLeft}>
                  {item.icon}
                  <Text style={styles.menuItemTitle}>{item.title}</Text>
                </View>
                <ChevronRight size={20} color={Colors.textSecondary} />
              </TouchableOpacity>
            ))}
          </Card>
          
          {/* Logout Button */}
          <TouchableOpacity 
            style={styles.logoutButton}
            onPress={handleLogout}
          >
            <LogOut size={20} color={Colors.error} />
            <Text style={styles.logoutText}>{t('logOut')}</Text>
          </TouchableOpacity>
          
          <View style={styles.footer}>
            <Text style={styles.version}>{t('version')}</Text>
          </View>
        </ScrollView>
      ) : (
        <BookingsSection />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  notLoggedInContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 40,
  },
  notLoggedInText: {
    fontSize: 17,
    color: Colors.textSecondary,
    marginBottom: 16,
  },
  loginButton: {
    width: 200,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
  },
  profileInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
  },
  nameContainer: {
    marginLeft: 12,
  },
  name: {
    fontSize: 19,
    fontWeight: '600',
    color: Colors.text,
  },
  email: {
    fontSize: 15,
    color: Colors.textSecondary,
    marginTop: 2,
  },
  tabSelector: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
    marginHorizontal: 16,
  },
  tabButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    marginRight: 16,
  },
  activeTabButton: {
    borderBottomWidth: 2,
    borderBottomColor: Colors.primary,
  },
  tabButtonText: {
    fontSize: 17,
    fontWeight: '500',
    color: Colors.textSecondary,
    marginLeft: 8,
  },
  activeTabButtonText: {
    color: Colors.primary,
  },
  scrollContent: {
    flex: 1,
  },
  providerCard: {
    margin: 16,
    marginTop: 8,
    padding: 16,
  },
  providerTitle: {
    fontSize: 17,
    fontWeight: '600',
    color: Colors.text,
  },
  providerDescription: {
    fontSize: 15,
    color: Colors.textSecondary,
    marginTop: 4,
    marginBottom: 12,
  },
  providerButton: {
    alignSelf: 'flex-start',
  },
  menuCard: {
    margin: 16,
    marginTop: 8,
    padding: 0,
  },
  menuItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 16,
  },
  menuItemBorder: {
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  menuItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  menuItemTitle: {
    fontSize: 17,
    color: Colors.text,
    marginLeft: 12,
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 16,
    marginHorizontal: 16,
    paddingVertical: 16,
    borderRadius: 8,
    backgroundColor: Colors.card,
  },
  logoutText: {
    fontSize: 17,
    fontWeight: '500',
    color: Colors.error,
    marginLeft: 8,
  },
  footer: {
    alignItems: 'center',
    marginTop: 24,
    marginBottom: 40,
  },
  version: {
    fontSize: 13,
    color: Colors.textSecondary,
  },
});