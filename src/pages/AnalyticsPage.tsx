
import React from 'react';
import { AdminLayout } from '@/components/AdminLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart3 } from 'lucide-react';

export default function AnalyticsPage() {
  return (
    <AdminLayout 
      title="Analytics" 
      description="View platform analytics and performance metrics"
    >
      <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-gray-900">
            <BarChart3 className="h-5 w-5" />
            Platform Analytics
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-600">Analytics dashboard will be implemented here.</p>
        </CardContent>
      </Card>
    </AdminLayout>
  );
}
