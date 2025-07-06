
import React from 'react';
import { AdminLayout } from '@/components/AdminLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { FileText } from 'lucide-react';

export default function ReportsPage() {
  return (
    <AdminLayout 
      title="Reports" 
      description="Generate and view system reports"
    >
      <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-gray-900">
            <FileText className="h-5 w-5" />
            System Reports
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-600">System reports interface will be implemented here.</p>
        </CardContent>
      </Card>
    </AdminLayout>
  );
}
