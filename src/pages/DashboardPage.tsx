
import React, { useState, useEffect } from 'react';
import { AdminLayout } from '@/components/AdminLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { supabase } from '@/integrations/supabase/client';
import { Users, ShoppingBag, Calendar, DollarSign, Car, Gift, TrendingUp, Bell } from 'lucide-react';

interface DashboardStats {
  totalUsers: number;
  totalProviders: number;
  totalBookings: number;
  totalRevenue: number;
  totalRides: number;
  totalEvents: number;
  pendingVerifications: number;
  unreadNotifications: number;
}

export default function DashboardPage() {
  const [stats, setStats] = useState<DashboardStats>({
    totalUsers: 0,
    totalProviders: 0,
    totalBookings: 0,
    totalRevenue: 0,
    totalRides: 0,
    totalEvents: 0,
    pendingVerifications: 0,
    unreadNotifications: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardStats();
  }, []);

  const fetchDashboardStats = async () => {
    try {
      const [
        usersResult,
        providersResult,
        bookingsResult,
        paymentsResult,
        ridesResult,
        eventsResult
      ] = await Promise.all([
        supabase.from('users').select('id', { count: 'exact' }),
        supabase.from('service_providers').select('id', { count: 'exact' }),
        supabase.from('service_bookings').select('id, total_amount', { count: 'exact' }),
        supabase.from('payments').select('amount'),
        supabase.from('ride_bookings').select('id', { count: 'exact' }),
        supabase.from('events').select('id', { count: 'exact' })
      ]);

      const totalRevenue = paymentsResult.data?.reduce((sum, payment) => sum + payment.amount, 0) || 0;
      const bookingRevenue = bookingsResult.data?.reduce((sum, booking) => sum + booking.total_amount, 0) || 0;

      setStats({
        totalUsers: usersResult.count || 0,
        totalProviders: providersResult.count || 0,
        totalBookings: bookingsResult.count || 0,
        totalRevenue: totalRevenue + bookingRevenue,
        totalRides: ridesResult.count || 0,
        totalEvents: eventsResult.count || 0,
        pendingVerifications: 0,
        unreadNotifications: 0
      });
    } catch (error) {
      console.error('Error fetching dashboard stats:', error);
    } finally {
      setLoading(false);
    }
  };

  const statCards = [
    { title: 'Total Users', value: stats.totalUsers, icon: Users, color: 'from-blue-500 to-blue-600' },
    { title: 'Service Providers', value: stats.totalProviders, icon: ShoppingBag, color: 'from-purple-500 to-purple-600' },
    { title: 'Total Bookings', value: stats.totalBookings, icon: Calendar, color: 'from-green-500 to-green-600' },
    { title: 'Total Revenue', value: `AWG ${stats.totalRevenue.toLocaleString()}`, icon: DollarSign, color: 'from-emerald-500 to-emerald-600' },
    { title: 'Taxi Rides', value: stats.totalRides, icon: Car, color: 'from-orange-500 to-orange-600' },
    { title: 'Events', value: stats.totalEvents, icon: Gift, color: 'from-pink-500 to-pink-600' },
    { title: 'Pending Verifications', value: stats.pendingVerifications, icon: TrendingUp, color: 'from-yellow-500 to-yellow-600' },
    { title: 'Notifications', value: stats.unreadNotifications, icon: Bell, color: 'from-red-500 to-red-600' }
  ];

  return (
    <AdminLayout title="Dashboard" description="Overview of platform statistics and activities">
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {statCards.map((stat, index) => (
            <Card key={index} className={`border-0 shadow-lg bg-gradient-to-br ${stat.color} text-white`}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-white/80">{stat.title}</CardTitle>
                <stat.icon className="h-4 w-4 text-white/80" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-white">{stat.value}</div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Recent Activity</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8 text-gray-500">
                {loading ? 'Loading activities...' : 'No recent activities'}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>System Status</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span>Database</span>
                  <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-sm">Online</span>
                </div>
                <div className="flex justify-between items-center">
                  <span>Payment System</span>
                  <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-sm">Online</span>
                </div>
                <div className="flex justify-between items-center">
                  <span>Notifications</span>
                  <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-sm">Online</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </AdminLayout>
  );
}
