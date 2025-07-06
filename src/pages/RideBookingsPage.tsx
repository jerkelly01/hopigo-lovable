
import React from 'react';
import { AdminLayout } from '@/components/AdminLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Car } from 'lucide-react';

export default function RideBookingsPage() {
  return (
    <AdminLayout 
      title="Ride Bookings" 
      description="Manage all taxi ride bookings and track rides"
    >
      <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-gray-900">
            <Car className="h-5 w-5" />
            Ride Bookings Management
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-600">Ride bookings management interface will be implemented here.</p>
        </CardContent>
      </Card>
    </AdminLayout>
  );
}
