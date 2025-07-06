
import React, { useState, useEffect } from 'react';
import { AdminLayout } from '@/components/AdminLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { supabase } from '@/integrations/supabase/client';
import { Calendar, DollarSign, Clock, User } from 'lucide-react';

interface ServiceBooking {
  id: string;
  customer_id: string;
  provider_id: string;
  service_id: string;
  total_amount: number;
  booking_date: string;
  status: string | null;
  created_at: string | null;
}

export default function BookingsPage() {
  const [bookings, setBookings] = useState<ServiceBooking[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    try {
      const { data, error } = await supabase
        .from('service_bookings')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setBookings(data || []);
    } catch (error) {
      console.error('Error fetching bookings:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateBookingStatus = async (bookingId: string, newStatus: string) => {
    try {
      const { error } = await supabase
        .from('service_bookings')
        .update({ status: newStatus })
        .eq('id', bookingId);

      if (error) throw error;
      fetchBookings();
    } catch (error) {
      console.error('Error updating booking status:', error);
    }
  };

  const getStatusColor = (status: string | null) => {
    switch (status) {
      case 'completed': return 'default';
      case 'confirmed': return 'secondary';
      case 'cancelled': return 'destructive';
      default: return 'outline';
    }
  };

  return (
    <AdminLayout 
      title="Service Bookings" 
      description="Manage all service bookings and their status"
    >
      <div className="space-y-6">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card className="border-0 shadow-lg bg-gradient-to-br from-blue-500 to-blue-600 text-white">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-blue-100">Total Bookings</CardTitle>
              <Calendar className="h-4 w-4 text-blue-100" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">{bookings.length}</div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg bg-gradient-to-br from-green-500 to-green-600 text-white">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-green-100">Completed</CardTitle>
              <Clock className="h-4 w-4 text-green-100" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">
                {bookings.filter(b => b.status === 'completed').length}
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg bg-gradient-to-br from-orange-500 to-orange-600 text-white">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-orange-100">Pending</CardTitle>
              <User className="h-4 w-4 text-orange-100" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">
                {bookings.filter(b => b.status === 'pending').length}
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg bg-gradient-to-br from-emerald-500 to-emerald-600 text-white">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-emerald-100">Total Revenue</CardTitle>
              <DollarSign className="h-4 w-4 text-emerald-100" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">
                AWG {bookings.reduce((sum, b) => sum + b.total_amount, 0).toLocaleString()}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Bookings List */}
        <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="text-gray-900">All Service Bookings</CardTitle>
            <CardDescription>Manage booking status and details</CardDescription>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="text-center py-8">Loading bookings...</div>
            ) : (
              <div className="space-y-4">
                {bookings.map((booking) => (
                  <div key={booking.id} className="flex items-center justify-between p-4 rounded-lg border bg-gradient-to-r from-blue-50 to-purple-50">
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
                        <Calendar className="h-6 w-6 text-white" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900">
                          Booking #{booking.id.slice(0, 8)}
                        </h3>
                        <p className="text-sm text-gray-600">
                          Date: {new Date(booking.booking_date).toLocaleDateString()}
                        </p>
                        <p className="text-sm text-gray-600">
                          Amount: AWG {booking.total_amount}
                        </p>
                        <p className="text-sm text-gray-500">
                          Created: {booking.created_at ? new Date(booking.created_at).toLocaleDateString() : 'Unknown'}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3">
                      <Badge variant={getStatusColor(booking.status)}>
                        {booking.status || 'pending'}
                      </Badge>
                      <div className="flex flex-col gap-2">
                        <Button
                          size="sm"
                          variant="default"
                          onClick={() => updateBookingStatus(booking.id, 'confirmed')}
                          disabled={booking.status === 'confirmed'}
                        >
                          Confirm
                        </Button>
                        <Button
                          size="sm"
                          variant="secondary"
                          onClick={() => updateBookingStatus(booking.id, 'completed')}
                          disabled={booking.status === 'completed'}
                        >
                          Complete
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
}
