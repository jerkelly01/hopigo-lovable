
import React from 'react';
import { AdminLayout } from '@/components/AdminLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Database } from 'lucide-react';

export default function DatabasePage() {
  return (
    <AdminLayout 
      title="Database Management" 
      description="Manage database operations and maintenance"
    >
      <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-gray-900">
            <Database className="h-5 w-5" />
            Database Management
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-600">Database management interface will be implemented here.</p>
        </CardContent>
      </Card>
    </AdminLayout>
  );
}
