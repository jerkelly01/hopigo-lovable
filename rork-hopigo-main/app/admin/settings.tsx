import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Switch, Alert } from 'react-native';
import { Stack, useRouter } from 'expo-router';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { useRequireRole } from '@/hooks/useRequireRole';
import { ArrowLeft, Settings, Bell, Globe, Shield, Database, Server } from 'lucide-react-native';
import Colors from '@/constants/colors';

export default function AppSettingsScreen() {
  const router = useRouter();
  const { hasRequiredRole } = useRequireRole('admin', '/(tabs)');
  
  const [settings, setSettings] = useState({
    // App settings
    appName: 'HopiGo',
    appVersion: '1.0.0',
    
    // Notification settings
    enablePushNotifications: true,
    enableEmailNotifications: true,
    
    // Regional settings
    defaultLanguage: 'en',
    defaultCurrency: 'AWG',
    
    // Security settings
    requireEmailVerification: true,
    allowPublicRegistration: true,
    
    // Database settings
    enableRLS: true,
    enableAuditLogs: true,
  });
  
  const handleToggleSetting = (key: keyof typeof settings) => {
    setSettings(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };
  
  const handleTextChange = (key: keyof typeof settings, value: string) => {
    setSettings(prev => ({
      ...prev,
      [key]: value
    }));
  };
  
  const handleSaveSettings = () => {
    // In a real app, this would save to Supabase
    Alert.alert('Success', 'Settings saved successfully');
  };
  
  return (
    <>
      <Stack.Screen 
        options={{ 
          title: 'App Settings',
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
      
      <ScrollView style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>Application Settings</Text>
          <Text style={styles.subtitle}>
            Configure global settings for the HopiGo application
          </Text>
        </View>
        
        <Card style={styles.settingsCard}>
          <View style={styles.settingHeader}>
            <Settings size={20} color={Colors.primary} />
            <Text style={styles.settingTitle}>General Settings</Text>
          </View>
          
          <View style={styles.settingGroup}>
            <Text style={styles.settingLabel}>Application Name</Text>
            <Input
              value={settings.appName}
              onChangeText={(value) => handleTextChange('appName', value)}
              containerStyle={styles.settingInput}
            />
          </View>
          
          <View style={styles.settingGroup}>
            <Text style={styles.settingLabel}>Application Version</Text>
            <Input
              value={settings.appVersion}
              onChangeText={(value) => handleTextChange('appVersion', value)}
              containerStyle={styles.settingInput}
            />
          </View>
        </Card>
        
        <Card style={styles.settingsCard}>
          <View style={styles.settingHeader}>
            <Bell size={20} color={Colors.primary} />
            <Text style={styles.settingTitle}>Notification Settings</Text>
          </View>
          
          <View style={styles.toggleSetting}>
            <Text style={styles.toggleLabel}>Enable Push Notifications</Text>
            <Switch
              value={settings.enablePushNotifications}
              onValueChange={() => handleToggleSetting('enablePushNotifications')}
              trackColor={{ false: Colors.border, true: Colors.primary }}
              thumbColor={Colors.white}
            />
          </View>
          
          <View style={styles.toggleSetting}>
            <Text style={styles.toggleLabel}>Enable Email Notifications</Text>
            <Switch
              value={settings.enableEmailNotifications}
              onValueChange={() => handleToggleSetting('enableEmailNotifications')}
              trackColor={{ false: Colors.border, true: Colors.primary }}
              thumbColor={Colors.white}
            />
          </View>
        </Card>
        
        <Card style={styles.settingsCard}>
          <View style={styles.settingHeader}>
            <Globe size={20} color={Colors.primary} />
            <Text style={styles.settingTitle}>Regional Settings</Text>
          </View>
          
          <View style={styles.settingGroup}>
            <Text style={styles.settingLabel}>Default Language</Text>
            <View style={styles.selectContainer}>
              <TouchableOpacity
                style={styles.selectButton}
                onPress={() => Alert.alert('Not Implemented', 'Language selection is not yet implemented')}
              >
                <Text style={styles.selectButtonText}>
                  {settings.defaultLanguage === 'en' ? 'English' : 
                   settings.defaultLanguage === 'es' ? 'Spanish' : 
                   settings.defaultLanguage === 'nl' ? 'Dutch' : 
                   'Unknown'}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
          
          <View style={styles.settingGroup}>
            <Text style={styles.settingLabel}>Default Currency</Text>
            <View style={styles.selectContainer}>
              <TouchableOpacity
                style={styles.selectButton}
                onPress={() => Alert.alert('Not Implemented', 'Currency selection is not yet implemented')}
              >
                <Text style={styles.selectButtonText}>{settings.defaultCurrency}</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Card>
        
        <Card style={styles.settingsCard}>
          <View style={styles.settingHeader}>
            <Shield size={20} color={Colors.primary} />
            <Text style={styles.settingTitle}>Security Settings</Text>
          </View>
          
          <View style={styles.toggleSetting}>
            <Text style={styles.toggleLabel}>Require Email Verification</Text>
            <Switch
              value={settings.requireEmailVerification}
              onValueChange={() => handleToggleSetting('requireEmailVerification')}
              trackColor={{ false: Colors.border, true: Colors.primary }}
              thumbColor={Colors.white}
            />
          </View>
          
          <View style={styles.toggleSetting}>
            <Text style={styles.toggleLabel}>Allow Public Registration</Text>
            <Switch
              value={settings.allowPublicRegistration}
              onValueChange={() => handleToggleSetting('allowPublicRegistration')}
              trackColor={{ false: Colors.border, true: Colors.primary }}
              thumbColor={Colors.white}
            />
          </View>
        </Card>
        
        <Card style={styles.settingsCard}>
          <View style={styles.settingHeader}>
            <Database size={20} color={Colors.primary} />
            <Text style={styles.settingTitle}>Database Settings</Text>
          </View>
          
          <View style={styles.toggleSetting}>
            <Text style={styles.toggleLabel}>Enable Row Level Security</Text>
            <Switch
              value={settings.enableRLS}
              onValueChange={() => handleToggleSetting('enableRLS')}
              trackColor={{ false: Colors.border, true: Colors.primary }}
              thumbColor={Colors.white}
            />
          </View>
          
          <View style={styles.toggleSetting}>
            <Text style={styles.toggleLabel}>Enable Audit Logs</Text>
            <Switch
              value={settings.enableAuditLogs}
              onValueChange={() => handleToggleSetting('enableAuditLogs')}
              trackColor={{ false: Colors.border, true: Colors.primary }}
              thumbColor={Colors.white}
            />
          </View>
        </Card>
        
        <View style={styles.actionButtons}>
          <Button
            title="Save Settings"
            onPress={handleSaveSettings}
            style={styles.saveButton}
          />
          <Button
            title="Reset to Defaults"
            variant="outline"
            onPress={() => Alert.alert('Confirm Reset', 'Are you sure you want to reset all settings to their default values?')}
            style={styles.resetButton}
          />
        </View>
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
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: Colors.textSecondary,
    textAlign: 'center',
    lineHeight: 22,
  },
  settingsCard: {
    marginHorizontal: 20,
    marginBottom: 16,
    padding: 20,
  },
  settingHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  settingTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.text,
    marginLeft: 12,
  },
  settingGroup: {
    marginBottom: 16,
  },
  settingLabel: {
    fontSize: 16,
    fontWeight: '500',
    color: Colors.text,
    marginBottom: 8,
  },
  settingInput: {
    marginBottom: 0,
  },
  toggleSetting: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  toggleLabel: {
    fontSize: 16,
    color: Colors.text,
  },
  selectContainer: {
    marginTop: 8,
  },
  selectButton: {
    backgroundColor: Colors.background,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: 8,
    padding: 12,
  },
  selectButtonText: {
    fontSize: 16,
    color: Colors.text,
  },
  actionButtons: {
    padding: 20,
    paddingBottom: 40,
  },
  saveButton: {
    marginBottom: 12,
  },
  resetButton: {
    borderColor: Colors.error,
  },
});