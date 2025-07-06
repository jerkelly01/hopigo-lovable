import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Switch, TouchableOpacity, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Stack, useRouter } from 'expo-router';
import { Button } from '@/components/ui/Button';
import { useAuthStore } from '@/store/auth-store';
import { useLanguage } from '@/contexts/LanguageContext';
import { Globe, Moon, Sun, Trash2 } from 'lucide-react-native';
import colors from '@/constants/colors';
import { Language } from '@/constants/translations';

interface AppSettings {
  darkMode: boolean;
  locationServices: boolean;
  dataUsage: boolean;
}

interface SettingToggleItemProps {
  title: string;
  value: boolean;
  onToggle: () => void;
  icon?: React.ReactNode;
}

interface SettingSelectItemProps {
  title: string;
  value: string;
  onPress: () => void;
  icon?: React.ReactNode;
}

export default function SettingsScreen() {
  const router = useRouter();
  const { logout, user, updateUserLanguage, updateUserCurrency } = useAuthStore();
  const { language, setLanguage, t } = useLanguage();
  
  const [settings, setSettings] = useState<AppSettings>({
    darkMode: false,
    locationServices: true,
    dataUsage: true,
  });

  const toggleSwitch = (key: keyof AppSettings) => {
    setSettings(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  const languages = [
    { code: 'en' as Language, name: t('english') },
    { code: 'es' as Language, name: t('spanish') },
    { code: 'nl' as Language, name: t('dutch') },
  ];

  const currencies = [
    { code: 'USD', symbol: '$', name: 'US Dollar' },
    { code: 'EUR', symbol: '€', name: 'Euro' },
    { code: 'GBP', symbol: '£', name: 'British Pound' },
    { code: 'JPY', symbol: '¥', name: 'Japanese Yen' },
    { code: 'CAD', symbol: 'C$', name: 'Canadian Dollar' },
    { code: 'AWG', symbol: 'ƒ', name: 'Aruban Florin' },
  ];

  const handleLanguageSelect = async (selectedLanguage: Language) => {
    try {
      // Update language in context (this will also save to AsyncStorage)
      await setLanguage(selectedLanguage);
      
      // Update user language in auth store
      updateUserLanguage(selectedLanguage);
      
      Alert.alert(
        t('success'),
        t('languageUpdated'),
        [{ text: t('ok') }]
      );
    } catch (error) {
      console.error('Error updating language:', error);
      Alert.alert(
        t('error'),
        t('failedToUpdateLanguage'),
        [{ text: t('ok') }]
      );
    }
  };

  const handleCurrencySelect = (currency: string) => {
    try {
      updateUserCurrency(currency);
      Alert.alert(
        t('success'),
        t('currencyUpdated').replace('{currency}', currency),
        [{ text: t('ok') }]
      );
    } catch (error) {
      console.error('Error updating currency:', error);
      Alert.alert(
        t('error'),
        t('failedToUpdateCurrency'),
        [{ text: t('ok') }]
      );
    }
  };

  const handleLogout = () => {
    Alert.alert(
      t('logOut'),
      t('confirmLogout'),
      [
        {
          text: t('cancel'),
          style: "cancel"
        },
        {
          text: t('logOut'),
          style: "destructive",
          onPress: () => {
            logout();
            router.replace('/auth/login');
          }
        }
      ]
    );
  };

  const handleDeleteAccount = () => {
    Alert.alert(
      t('deleteAccount'),
      t('confirmDeleteAccount'),
      [
        {
          text: t('cancel'),
          style: "cancel"
        },
        {
          text: t('delete'),
          style: "destructive",
          onPress: () => {
            // Handle account deletion
            logout();
            router.replace('/auth/login');
          }
        }
      ]
    );
  };

  const showLanguageSelector = () => {
    Alert.alert(
      t('selectLanguage'),
      t('choosePreferredLanguage'),
      [
        ...languages.map(lang => ({
          text: `${lang.name} ${language === lang.code ? '✓' : ''}`,
          onPress: () => handleLanguageSelect(lang.code)
        })),
        {
          text: t('cancel'),
          style: 'cancel' as const
        }
      ]
    );
  };

  const showCurrencySelector = () => {
    Alert.alert(
      t('selectCurrency'),
      t('choosePreferredCurrency'),
      [
        ...currencies.map(curr => ({
          text: `${curr.symbol} ${curr.name} (${curr.code}) ${user?.currency === curr.code ? '✓' : ''}`,
          onPress: () => handleCurrencySelect(curr.code)
        })),
        {
          text: t('cancel'),
          style: 'cancel' as const
        }
      ]
    );
  };

  const SettingToggleItem = ({ title, value, onToggle, icon }: SettingToggleItemProps) => (
    <View style={styles.settingItem}>
      <View style={styles.settingLeft}>
        {icon && <View style={styles.settingIcon}>{icon}</View>}
        <Text style={styles.settingTitle}>{title}</Text>
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

  const SettingSelectItem = ({ title, value, onPress, icon }: SettingSelectItemProps) => (
    <TouchableOpacity style={styles.settingItem} onPress={onPress}>
      <View style={styles.settingLeft}>
        {icon && <View style={styles.settingIcon}>{icon}</View>}
        <Text style={styles.settingTitle}>{title}</Text>
      </View>
      <View style={styles.settingValue}>
        <Text style={styles.settingValueText}>{value}</Text>
      </View>
    </TouchableOpacity>
  );

  const getCurrentLanguageName = () => {
    const currentLang = languages.find(lang => lang.code === language);
    return currentLang ? currentLang.name : t('english');
  };

  const getCurrentCurrencyDisplay = () => {
    const currentCurrency = currencies.find(curr => curr.code === (user?.currency || 'USD'));
    return currentCurrency ? `${currentCurrency.symbol} ${currentCurrency.code}` : '$ USD';
  };

  return (
    <SafeAreaView style={styles.container} edges={['bottom']}>
      <Stack.Screen options={{ 
        title: t('settings'),
        headerStyle: {
          backgroundColor: colors.primary,
        },
        headerTintColor: '#fff',
      }} />
      
      <ScrollView style={styles.scrollView}>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>{t('appPreferences')}</Text>
          
          <SettingToggleItem
            title={t('darkMode')}
            value={settings.darkMode}
            onToggle={() => toggleSwitch('darkMode')}
            icon={settings.darkMode ? <Moon size={20} color={colors.primary} /> : <Sun size={20} color={colors.primary} />}
          />
          
          <SettingToggleItem
            title={t('locationServices')}
            value={settings.locationServices}
            onToggle={() => toggleSwitch('locationServices')}
            icon={<Globe size={20} color={colors.primary} />}
          />
          
          <SettingToggleItem
            title={t('reduceDataUsage')}
            value={settings.dataUsage}
            onToggle={() => toggleSwitch('dataUsage')}
            icon={<Globe size={20} color={colors.primary} />}
          />
        </View>
        
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>{t('regionalSettings')}</Text>
          
          <SettingSelectItem
            title={t('language')}
            value={getCurrentLanguageName()}
            onPress={showLanguageSelector}
            icon={<Globe size={20} color={colors.primary} />}
          />
          
          <SettingSelectItem
            title={t('currency')}
            value={getCurrentCurrencyDisplay()}
            onPress={showCurrencySelector}
            icon={<Globe size={20} color={colors.primary} />}
          />
        </View>
        
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>{t('about')}</Text>
          
          <TouchableOpacity style={styles.aboutItem}>
            <Text style={styles.aboutItemTitle}>{t('termsOfService')}</Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.aboutItem}>
            <Text style={styles.aboutItemTitle}>{t('privacyPolicy')}</Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.aboutItem}>
            <Text style={styles.aboutItemTitle}>{t('appVersion')}</Text>
            <Text style={styles.aboutItemValue}>1.0.0</Text>
          </TouchableOpacity>
        </View>
        
        <View style={styles.accountActions}>
          <Button 
            title={t('logOut')} 
            variant="outline"
            style={styles.logoutButton}
            onPress={handleLogout}
          />
          
          <TouchableOpacity 
            style={styles.deleteAccount}
            onPress={handleDeleteAccount}
          >
            <Trash2 size={16} color="#ff3b30" />
            <Text style={styles.deleteAccountText}>{t('deleteAccount')}</Text>
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
  settingItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  settingLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  settingIcon: {
    marginRight: 12,
  },
  settingTitle: {
    fontSize: 16,
    fontWeight: '500',
  },
  settingValue: {
    backgroundColor: '#f5f5f5',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  settingValueText: {
    fontSize: 14,
    color: '#555',
  },
  aboutItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  aboutItemTitle: {
    fontSize: 16,
    fontWeight: '500',
  },
  aboutItemValue: {
    fontSize: 14,
    color: '#777',
  },
  accountActions: {
    marginTop: 16,
    marginBottom: 32,
  },
  logoutButton: {
    marginBottom: 16,
  },
  deleteAccount: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 12,
  },
  deleteAccountText: {
    marginLeft: 8,
    fontSize: 16,
    color: '#ff3b30',
    fontWeight: '500',
  },
});