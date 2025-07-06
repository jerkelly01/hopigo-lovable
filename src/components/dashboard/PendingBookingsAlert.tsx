import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { AlertTriangle } from 'lucide-react';

interface PendingBookingsAlertProps {
  pendingBookings: number;
}

export function PendingBookingsAlert({ pendingBookings }: PendingBookingsAlertProps) {
  if (pendingBookings <= 0) return null;

  return (
    <Card className="mt-6 border-0 shadow-lg bg-gradient-to-r from-orange-50 to-red-50">
      <CardHeader>
        <CardTitle className="flex items-center text-orange-800">
          <AlertTriangle className="h-5 w-5 mr-2" />
          Attention Required
        </CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-orange-700 mb-4">
          You have {pendingBookings} pending bookings that need review.
        </p>
        <Button className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white border-0">
          Review Bookings
        </Button>
      </CardContent>
    </Card>
  );
}