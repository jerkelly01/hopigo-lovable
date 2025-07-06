
import React from 'react';
import { AdminLayout } from '@/components/AdminLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { AlertTriangle } from 'lucide-react';

export default function EmergencyPage() {
  return (
    <AdminLayout 
      title="Emergency Services" 
      description="Monitor emergency requests and services"
    >
      <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-gray-900">
            <AlertTriangle className="h-5 w-5" />
            Emergency Service Management
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-600">Emergency service management interface will be implemented here.</p>
        </CardContent>
      </Card>
    </AdminLayout>
  );
}
