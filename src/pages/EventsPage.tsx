
import React from 'react';
import { AdminLayout } from '@/components/AdminLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Calendar } from 'lucide-react';

export default function EventsPage() {
  return (
    <AdminLayout 
      title="Events" 
      description="Manage events and ticket sales"
    >
      <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-gray-900">
            <Calendar className="h-5 w-5" />
            Event Management
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-600">Event management interface will be implemented here.</p>
        </CardContent>
      </Card>
    </AdminLayout>
  );
}
