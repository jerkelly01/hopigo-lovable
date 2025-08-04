import React from 'react';
import { AdminLayout } from '@/components/AdminLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Activity } from 'lucide-react';

export default function SystemHealthPage() {
  return (
    <AdminLayout title="System Health" description="Monitor system health and performance">
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity className="h-5 w-5" />
              System Health Monitoring
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              System health monitoring is being updated to match the current database schema.
              This page will be fully functional soon.
            </p>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
}