import React from 'react';
import { AdminLayout } from '@/components/AdminLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Gift } from 'lucide-react';

export default function LoyaltyProgramsPage() {
  return (
    <AdminLayout title="Loyalty Programs" description="Manage loyalty programs and rewards">
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Gift className="h-5 w-5" />
              Loyalty Programs
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              Loyalty programs functionality is being updated to match the current database schema.
              This page will be fully functional soon.
            </p>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
}