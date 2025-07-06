
import React from 'react';
import { AdminLayout } from '@/components/AdminLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Gift } from 'lucide-react';

export default function LoyaltyPage() {
  return (
    <AdminLayout 
      title="Loyalty Programs" 
      description="Manage loyalty programs and rewards"
    >
      <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-gray-900">
            <Gift className="h-5 w-5" />
            Loyalty Program Management
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-600">Loyalty program management interface will be implemented here.</p>
        </CardContent>
      </Card>
    </AdminLayout>
  );
}
