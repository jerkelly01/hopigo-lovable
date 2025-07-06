
import React, { useState, useEffect } from 'react';
import { AdminLayout } from '@/components/AdminLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { supabase } from '@/integrations/supabase/client';
import { 
  Settings, 
  Bell, 
  Globe, 
  Shield,
  Database,
  Server,
  Mail,
  Smartphone,
  CreditCard,
  MapPin,
  Clock,
  Users
} from 'lucide-react';

export default function AppSettingsPage() {
  const [settings, setSettings] = useState({
    // App Information
    appName: 'HopiGo',
    appVersion: '1.0.0',
    appDescription: 'Multi-service platform for Aruba',
    supportEmail: 'support@hopigo.com',
    
    // Notification Settings
    enablePushNotifications: true,
    enableEmailNotifications: true,
    enableSMSNotifications: false,
    
    // Regional Settings
    defaultLanguage: 'en',
    defaultCurrency: 'AWG',
    defaultTimezone: 'America/Aruba',
    
    // Security Settings
    requireEmailVerification: true,
    allowPublicRegistration: true,
    enableTwoFactorAuth: false,
    sessionTimeout: 24,
    
    // Payment Settings
    enablePayments: true,
    allowWalletTransfers: true,
    minimumTransferAmount: 5.00,
    maximumTransferAmount: 1000.00,
    
    // Service Settings
    enableServiceBookings: true,
    enableRideBookings: true,
    enableEventTickets: true,
    enableLoyaltyPrograms: true,
    
    // System Settings
    enableMaintenanceMode: false,
    enableDebugMode: false,
    maxUploadSize: 10,
    cacheTimeout: 3600
  });

  const [systemStats, setSystemStats] = useState({
    totalUsers: 0,
    activeUsers: 0,
    totalTransactions: 0,
    systemUptime: '99.9%'
  });

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchSystemStats();
  }, []);

  const fetchSystemStats = async () => {
    try {
      const [usersResult, paymentsResult] = await Promise.all([
        supabase.from('users').select('id, is_active', { count: 'exact' }),
        supabase.from('payments').select('id', { count: 'exact' })
      ]);

      setSystemStats({
        totalUsers: usersResult.count || 0,
        activeUsers: usersResult.data?.filter(u => u.is_active).length || 0,
        totalTransactions: paymentsResult.count || 0,
        systemUptime: '99.9%'
      });
    } catch (error) {
      console.error('Error fetching system stats:', error);
    }
  };

  const handleSaveSettings = async (category: string) => {
    setLoading(true);
    try {
      // In a real app, this would save to a settings table or configuration service
      console.log(`Saving ${category} settings:`, settings);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      alert(`${category} settings saved successfully!`);
    } catch (error) {
      console.error('Error saving settings:', error);
      alert('Error saving settings. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleResetToDefaults = () => {
    if (confirm('Are you sure you want to reset all settings to their default values?')) {
      setSettings({
        appName: 'HopiGo',
        appVersion: '1.0.0',
        appDescription: 'Multi-service platform for Aruba',
        supportEmail: 'support@hopigo.com',
        enablePushNotifications: true,
        enableEmailNotifications: true,
        enableSMSNotifications: false,
        defaultLanguage: 'en',
        defaultCurrency: 'AWG',
        defaultTimezone: 'America/Aruba',
        requireEmailVerification: true,
        allowPublicRegistration: true,
        enableTwoFactorAuth: false,
        sessionTimeout: 24,
        enablePayments: true,
        allowWalletTransfers: true,
        minimumTransferAmount: 5.00,
        maximumTransferAmount: 1000.00,
        enableServiceBookings: true,
        enableRideBookings: true,
        enableEventTickets: true,
        enableLoyaltyPrograms: true,
        enableMaintenanceMode: false,
        enableDebugMode: false,
        maxUploadSize: 10,
        cacheTimeout: 3600
      });
    }
  };

  const updateSetting = (key: string, value: any) => {
    setSettings(prev => ({ ...prev, [key]: value }));
  };

  return (
    <AdminLayout title="Application Settings" description="Configure global application settings and preferences">
      <div className="space-y-6">
        {/* System Overview Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card className="border-0 shadow-lg bg-gradient-to-br from-blue-500 to-blue-600 text-white">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-blue-100">Total Users</CardTitle>
              <Users className="h-4 w-4 text-blue-100" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">{systemStats.totalUsers}</div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg bg-gradient-to-br from-green-500 to-green-600 text-white">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-green-100">Active Users</CardTitle>
              <Users className="h-4 w-4 text-green-100" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">{systemStats.activeUsers}</div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg bg-gradient-to-br from-purple-500 to-purple-600 text-white">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-purple-100">Transactions</CardTitle>
              <CreditCard className="h-4 w-4 text-purple-100" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">{systemStats.totalTransactions}</div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg bg-gradient-to-br from-emerald-500 to-emerald-600 text-white">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-emerald-100">System Uptime</CardTitle>
              <Server className="h-4 w-4 text-emerald-100" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">{systemStats.systemUptime}</div>
            </CardContent>
          </Card>
        </div>

        {/* Settings Tabs */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Settings className="h-5 w-5" />
              Application Configuration
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="general" className="space-y-6">
              <TabsList className="grid w-full grid-cols-6">
                <TabsTrigger value="general">General</TabsTrigger>
                <TabsTrigger value="notifications">Notifications</TabsTrigger>
                <TabsTrigger value="regional">Regional</TabsTrigger>
                <TabsTrigger value="security">Security</TabsTrigger>
                <TabsTrigger value="payments">Payments</TabsTrigger>
                <TabsTrigger value="system">System</TabsTrigger>
              </TabsList>

              <TabsContent value="general" className="space-y-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="appName">Application Name</Label>
                      <Input
                        id="appName"
                        value={settings.appName}
                        onChange={(e) => updateSetting('appName', e.target.value)}
                      />
                    </div>
                    <div>
                      <Label htmlFor="appVersion">Version</Label>
                      <Input
                        id="appVersion"
                        value={settings.appVersion}
                        onChange={(e) => updateSetting('appVersion', e.target.value)}
                      />
                    </div>
                    <div>
                      <Label htmlFor="supportEmail">Support Email</Label>
                      <Input
                        id="supportEmail"
                        type="email"
                        value={settings.supportEmail}
                        onChange={(e) => updateSetting('supportEmail', e.target.value)}
                      />
                    </div>
                  </div>
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="appDescription">Description</Label>
                      <Textarea
                        id="appDescription"
                        value={settings.appDescription}
                        onChange={(e) => updateSetting('appDescription', e.target.value)}
                        rows={4}
                      />
                    </div>
                  </div>
                </div>
                <Button onClick={() => handleSaveSettings('General')} disabled={loading}>
                  Save General Settings
                </Button>
              </TabsContent>

              <TabsContent value="notifications" className="space-y-6">
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <Bell className="h-5 w-5 text-blue-500" />
                      <div>
                        <h3 className="font-medium">Push Notifications</h3>
                        <p className="text-sm text-gray-600">Send push notifications to mobile devices</p>
                      </div>
                    </div>
                    <Switch
                      checked={settings.enablePushNotifications}
                      onCheckedChange={(checked) => updateSetting('enablePushNotifications', checked)}
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <Mail className="h-5 w-5 text-green-500" />
                      <div>
                        <h3 className="font-medium">Email Notifications</h3>
                        <p className="text-sm text-gray-600">Send email notifications to users</p>
                      </div>
                    </div>
                    <Switch
                      checked={settings.enableEmailNotifications}
                      onCheckedChange={(checked) => updateSetting('enableEmailNotifications', checked)}
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <Smartphone className="h-5 w-5 text-purple-500" />
                      <div>
                        <h3 className="font-medium">SMS Notifications</h3>
                        <p className="text-sm text-gray-600">Send SMS notifications for critical updates</p>
                      </div>
                    </div>
                    <Switch
                      checked={settings.enableSMSNotifications}
                      onCheckedChange={(checked) => updateSetting('enableSMSNotifications', checked)}
                    />
                  </div>
                </div>
                <Button onClick={() => handleSaveSettings('Notification')} disabled={loading}>
                  Save Notification Settings
                </Button>
              </TabsContent>

              <TabsContent value="regional" className="space-y-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="defaultLanguage">Default Language</Label>
                      <Select value={settings.defaultLanguage} onValueChange={(value) => updateSetting('defaultLanguage', value)}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="en">English</SelectItem>
                          <SelectItem value="es">Spanish</SelectItem>
                          <SelectItem value="nl">Dutch</SelectItem>
                          <SelectItem value="pt">Papiamento</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="defaultCurrency">Default Currency</Label>
                      <Select value={settings.defaultCurrency} onValueChange={(value) => updateSetting('defaultCurrency', value)}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="AWG">AWG - Aruban Florin</SelectItem>
                          <SelectItem value="USD">USD - US Dollar</SelectItem>
                          <SelectItem value="EUR">EUR - Euro</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="defaultTimezone">Default Timezone</Label>
                      <Select value={settings.defaultTimezone} onValueChange={(value) => updateSetting('defaultTimezone', value)}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="America/Aruba">America/Aruba (AST)</SelectItem>
                          <SelectItem value="America/New_York">America/New_York (EST)</SelectItem>
                          <SelectItem value="Europe/Amsterdam">Europe/Amsterdam (CET)</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>
                <Button onClick={() => handleSaveSettings('Regional')} disabled={loading}>
                  Save Regional Settings
                </Button>
              </TabsContent>

              <TabsContent value="security" className="space-y-6">
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-medium">Require Email Verification</h3>
                      <p className="text-sm text-gray-600">Users must verify their email before accessing the platform</p>
                    </div>
                    <Switch
                      checked={settings.requireEmailVerification}
                      onCheckedChange={(checked) => updateSetting('requireEmailVerification', checked)}
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-medium">Allow Public Registration</h3>
                      <p className="text-sm text-gray-600">Allow new users to register without invitation</p>
                    </div>
                    <Switch
                      checked={settings.allowPublicRegistration}
                      onCheckedChange={(checked) => updateSetting('allowPublicRegistration', checked)}
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-medium">Enable Two-Factor Authentication</h3>
                      <p className="text-sm text-gray-600">Require 2FA for sensitive operations</p>
                    </div>
                    <Switch
                      checked={settings.enableTwoFactorAuth}
                      onCheckedChange={(checked) => updateSetting('enableTwoFactorAuth', checked)}
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="sessionTimeout">Session Timeout (hours)</Label>
                    <Input
                      id="sessionTimeout"
                      type="number"
                      value={settings.sessionTimeout}
                      onChange={(e) => updateSetting('sessionTimeout', parseInt(e.target.value) || 24)}
                      min="1"
                      max="168"
                    />
                  </div>
                </div>
                <Button onClick={() => handleSaveSettings('Security')} disabled={loading}>
                  Save Security Settings
                </Button>
              </TabsContent>

              <TabsContent value="payments" className="space-y-6">
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-medium">Enable Payments</h3>
                      <p className="text-sm text-gray-600">Allow users to make payments through the platform</p>
                    </div>
                    <Switch
                      checked={settings.enablePayments}
                      onCheckedChange={(checked) => updateSetting('enablePayments', checked)}
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-medium">Allow Wallet Transfers</h3>
                      <p className="text-sm text-gray-600">Enable peer-to-peer wallet transfers</p>
                    </div>
                    <Switch
                      checked={settings.allowWalletTransfers}
                      onCheckedChange={(checked) => updateSetting('allowWalletTransfers', checked)}
                    />
                  </div>
                  
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="minTransfer">Minimum Transfer Amount (AWG)</Label>
                      <Input
                        id="minTransfer"
                        type="number"
                        step="0.01"
                        value={settings.minimumTransferAmount}
                        onChange={(e) => updateSetting('minimumTransferAmount', parseFloat(e.target.value) || 0)}
                      />
                    </div>
                    <div>
                      <Label htmlFor="maxTransfer">Maximum Transfer Amount (AWG)</Label>
                      <Input
                        id="maxTransfer"
                        type="number"
                        step="0.01"
                        value={settings.maximumTransferAmount}
                        onChange={(e) => updateSetting('maximumTransferAmount', parseFloat(e.target.value) || 0)}
                      />
                    </div>
                  </div>
                </div>
                <Button onClick={() => handleSaveSettings('Payment')} disabled={loading}>
                  Save Payment Settings
                </Button>
              </TabsContent>

              <TabsContent value="system" className="space-y-6">
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-medium">Maintenance Mode</h3>
                      <p className="text-sm text-gray-600">Temporarily disable the platform for maintenance</p>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Switch
                        checked={settings.enableMaintenanceMode}
                        onCheckedChange={(checked) => updateSetting('enableMaintenanceMode', checked)}
                      />
                      {settings.enableMaintenanceMode && (
                        <Badge variant="destructive">Active</Badge>
                      )}
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-medium">Debug Mode</h3>
                      <p className="text-sm text-gray-600">Enable detailed logging and error reporting</p>
                    </div>
                    <Switch
                      checked={settings.enableDebugMode}
                      onCheckedChange={(checked) => updateSetting('enableDebugMode', checked)}
                    />
                  </div>
                  
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="maxUpload">Max Upload Size (MB)</Label>
                      <Input
                        id="maxUpload"
                        type="number"
                        value={settings.maxUploadSize}
                        onChange={(e) => updateSetting('maxUploadSize', parseInt(e.target.value) || 10)}
                        min="1"
                        max="100"
                      />
                    </div>
                    <div>
                      <Label htmlFor="cacheTimeout">Cache Timeout (seconds)</Label>
                      <Input
                        id="cacheTimeout"
                        type="number"
                        value={settings.cacheTimeout}
                        onChange={(e) => updateSetting('cacheTimeout', parseInt(e.target.value) || 3600)}
                        min="60"
                        max="86400"
                      />
                    </div>
                  </div>
                </div>
                <Button onClick={() => handleSaveSettings('System')} disabled={loading}>
                  Save System Settings
                </Button>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>

        {/* Action Buttons */}
        <div className="flex justify-between">
          <Button variant="outline" onClick={handleResetToDefaults}>
            Reset to Defaults
          </Button>
          <div className="space-x-4">
            <Button variant="outline" onClick={() => window.location.reload()}>
              Cancel Changes
            </Button>
            <Button onClick={() => handleSaveSettings('All')} disabled={loading}>
              Save All Settings
            </Button>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
