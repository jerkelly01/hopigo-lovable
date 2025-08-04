import React from 'react';
import { AdminLayout } from '@/components/AdminLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Shield } from 'lucide-react';

export default function VerificationPage() {
  return (
    <AdminLayout title="Verification" description="Manage user and provider verification">
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5" />
              Verification Management
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              Verification functionality is being updated to match the current database schema.
              This page will be fully functional soon.
            </p>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
}