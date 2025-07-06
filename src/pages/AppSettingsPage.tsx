
import React, { useState } from 'react';
import { AdminLayout } from '@/components/AdminLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Settings, Save, RefreshCw, Globe, Shield, Bell } from 'lucide-react';

export default function AppSettingsPage() {
  const [settings, setSettings] = useState({
    appName: 'Hopigo',
    appVersion: '1.0.0',
    maintenanceMode: false,
    allowRegistration: true,
    requireEmailVerification: true,
    enableNotifications: true,
    defaultLanguage: 'en',
    defaultCurrency: 'AWG',
    sessionTimeout: '30',
    maxFileSize: '10'
  });

  const handleSettingChange = (key: string, value: any) => {
    setSettings(prev => ({ ...prev, [key]: value }));
  };

  const saveSettings = () => {
    console.log('Saving settings:', settings);
    // Settings save logic would go here
  };

  return (
    <AdminLayout title="App Settings" description="Configure global application settings and preferences">
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card className="border-0 shadow-lg bg-gradient-to-br from-blue-500 to-blue-600 text-white">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-blue-100">App Version</CardTitle>
              <Settings className="h-4 w-4 text-blue-100" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">{settings.appVersion}</div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg bg-gradient-to-br from-green-500 to-green-600 text-white">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-green-100">Status</CardTitle>
              <Globe className="h-4 w-4 text-green-100" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">
                {settings.maintenanceMode ? 'Maintenance' : 'Online'}
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg bg-gradient-to-br from-purple-500 to-purple-600 text-white">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-purple-100">Security</CardTitle>
              <Shield className="h-4 w-4 text-purple-100" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">
                {settings.requireEmailVerification ? 'High' : 'Medium'}
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg bg-gradient-to-br from-orange-500 to-orange-600 text-white">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-orange-100">Notifications</CardTitle>
              <Bell className="h-4 w-4 text-orange-100" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">
                {settings.enableNotifications ? 'Enabled' : 'Disabled'}
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>General Settings</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="appName">Application Name</Label>
                <Input
                  id="appName"
                  value={settings.appName}
                  onChange={(e) => handleSettingChange('appName', e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="appVersion">Application Version</Label>
                <Input
                  id="appVersion"
                  value={settings.appVersion}
                  onChange={(e) => handleSettingChange('appVersion', e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="defaultLanguage">Default Language</Label>
                <Select value={settings.defaultLanguage} onValueChange={(value) => handleSettingChange('defaultLanguage', value)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="en">English</SelectItem>
                    <SelectItem value="es">Spanish</SelectItem>
                    <SelectItem value="nl">Dutch</SelectItem>
                    <SelectItem value="pt">Portuguese</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="defaultCurrency">Default Currency</Label>
                <Select value={settings.defaultCurrency} onValueChange={(value) => handleSettingChange('defaultCurrency', value)}>
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
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Security & Access</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="maintenanceMode">Maintenance Mode</Label>
                  <p className="text-sm text-gray-600">Temporarily disable app access</p>
                </div>
                <Switch
                  id="maintenanceMode"
                  checked={settings.maintenanceMode}
                  onCheckedChange={(checked) => handleSettingChange('maintenanceMode', checked)}
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="allowRegistration">Allow Registration</Label>
                  <p className="text-sm text-gray-600">Enable new user signups</p>
                </div>
                <Switch
                  id="allowRegistration"
                  checked={settings.allowRegistration}
                  onCheckedChange={(checked) => handleSettingChange('allowRegistration', checked)}
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="requireEmailVerification">Email Verification</Label>
                  <p className="text-sm text-gray-600">Require email verification for new accounts</p>
                </div>
                <Switch
                  id="requireEmailVerification"
                  checked={settings.requireEmailVerification}
                  onCheckedChange={(checked) => handleSettingChange('requireEmailVerification', checked)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="sessionTimeout">Session Timeout (minutes)</Label>
                <Input
                  id="sessionTimeout"
                  type="number"
                  value={settings.sessionTimeout}
                  onChange={(e) => handleSettingChange('sessionTimeout', e.target.value)}
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Notifications</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="enableNotifications">Enable Notifications</Label>
                  <p className="text-sm text-gray-600">Allow system notifications</p>
                </div>
                <Switch
                  id="enableNotifications"
                  checked={settings.enableNotifications}
                  onCheckedChange={(checked) => handleSettingChange('enableNotifications', checked)}
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>File & Media Settings</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="maxFileSize">Max File Size (MB)</Label>
                <Input
                  id="maxFileSize"
                  type="number"
                  value={settings.maxFileSize}
                  onChange={(e) => handleSettingChange('maxFileSize', e.target.value)}
                />
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="flex justify-end space-x-4">
          <Button variant="outline">
            <RefreshCw className="h-4 w-4 mr-2" />
            Reset to Defaults
          </Button>
          <Button onClick={saveSettings}>
            <Save className="h-4 w-4 mr-2" />
            Save Settings
          </Button>
        </div>
      </div>
    </AdminLayout>
  );
}
