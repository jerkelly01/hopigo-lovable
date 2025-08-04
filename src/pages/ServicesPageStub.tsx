import React from 'react';
import { AdminLayout } from '@/components/AdminLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ShoppingBag } from 'lucide-react';

export default function ServicesPage() {
  return (
    <AdminLayout title="Services" description="Manage platform services">
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <ShoppingBag className="h-5 w-5" />
              Services Management
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              Services functionality is being updated to match the current database schema.
              This page will be fully functional soon.
            </p>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
}