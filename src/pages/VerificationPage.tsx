
import React from 'react';
import { AdminLayout } from '@/components/AdminLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { UserCheck } from 'lucide-react';

export default function VerificationPage() {
  return (
    <AdminLayout 
      title="Verification" 
      description="Manage user and provider verification processes"
    >
      <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-gray-900">
            <UserCheck className="h-5 w-5" />
            Verification Management
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-600">Verification management interface will be implemented here.</p>
        </CardContent>
      </Card>
    </AdminLayout>
  );
}
