
import React from 'react';
import { AdminLayout } from '@/components/AdminLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Settings } from 'lucide-react';

export default function SettingsPage() {
  return (
    <AdminLayout 
      title="App Settings" 
      description="Configure application settings and preferences"
    >
      <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-gray-900">
            <Settings className="h-5 w-5" />
            Application Settings
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-600">Application settings interface will be implemented here.</p>
        </CardContent>
      </Card>
    </AdminLayout>
  );
}
