
import React from 'react';
import { AdminLayout } from '@/components/AdminLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { DollarSign } from 'lucide-react';

export default function PaymentsPage() {
  return (
    <AdminLayout 
      title="Payments" 
      description="Monitor payment transactions and financial data"
    >
      <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-gray-900">
            <DollarSign className="h-5 w-5" />
            Payment Management
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-600">Payment management interface will be implemented here.</p>
        </CardContent>
      </Card>
    </AdminLayout>
  );
}
