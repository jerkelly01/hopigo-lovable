
import React from 'react';
import { AdminLayout } from '@/components/AdminLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { MapPin } from 'lucide-react';

export default function LocationsPage() {
  return (
    <AdminLayout 
      title="Location Management" 
      description="Manage locations and geographic data"
    >
      <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-gray-900">
            <MapPin className="h-5 w-5" />
            Location Management
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-600">Location management interface will be implemented here.</p>
        </CardContent>
      </Card>
    </AdminLayout>
  );
}
