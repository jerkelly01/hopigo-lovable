
import React from 'react';
import { AdminLayout } from '@/components/AdminLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { FileText } from 'lucide-react';

export default function ServicesPage() {
  return (
    <AdminLayout 
      title="Services" 
      description="Manage all services offered on the platform"
    >
      <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-gray-900">
            <FileText className="h-5 w-5" />
            Service Management
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-600">Service management interface will be implemented here.</p>
        </CardContent>
      </Card>
    </AdminLayout>
  );
}
