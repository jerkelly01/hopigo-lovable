
import React from 'react';
import { AdminLayout } from '@/components/AdminLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Shield } from 'lucide-react';

export default function RolesPage() {
  return (
    <AdminLayout 
      title="Roles & Permissions" 
      description="Manage user roles and permissions"
    >
      <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-gray-900">
            <Shield className="h-5 w-5" />
            Role & Permission Management
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-600">Role and permission management interface will be implemented here.</p>
        </CardContent>
      </Card>
    </AdminLayout>
  );
}
