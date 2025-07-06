
import React from 'react';
import { AdminLayout } from '@/components/AdminLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Bell } from 'lucide-react';

export default function NotificationsPage() {
  return (
    <AdminLayout 
      title="Notifications" 
      description="Manage system notifications and alerts"
    >
      <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-gray-900">
            <Bell className="h-5 w-5" />
            Notification Management
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-600">Notification management interface will be implemented here.</p>
        </CardContent>
      </Card>
    </AdminLayout>
  );
}
