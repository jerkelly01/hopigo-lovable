
import React from 'react';
import { AdminLayout } from '@/components/AdminLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CreditCard } from 'lucide-react';

export default function TransfersPage() {
  return (
    <AdminLayout 
      title="Money Transfers" 
      description="Monitor user money transfers and transaction history"
    >
      <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-gray-900">
            <CreditCard className="h-5 w-5" />
            Money Transfer Management
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-600">Money transfer management interface will be implemented here.</p>
        </CardContent>
      </Card>
    </AdminLayout>
  );
}
