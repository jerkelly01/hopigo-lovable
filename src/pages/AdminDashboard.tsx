import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useAuthContext } from '@/components/AuthProvider';
import { supabase } from '@/integrations/supabase/client';
import { Users, ShoppingBag, Car, DollarSign, TrendingUp, Calendar, Bell, Settings, BarChart3, AlertTriangle } from 'lucide-react';
import { SidebarProvider, SidebarInset, SidebarTrigger } from '@/components/ui/sidebar';
import { AppSidebar } from '@/components/AppSidebar';
interface DashboardStats {
  totalUsers: number;
  totalProviders: number;
  totalDrivers: number;
  totalBookings: number;
  totalRevenue: number;
  pendingBookings: number;
}
interface RecentActivity {
  id: string;
  type: string;
  description: string;
  timestamp: string;
  status: string;
}
export default function AdminDashboard() {
  const {
    user
  } = useAuthContext();
  const [stats, setStats] = useState<DashboardStats>({
    totalUsers: 0,
    totalProviders: 0,
    totalDrivers: 0,
    totalBookings: 0,
    totalRevenue: 0,
    pendingBookings: 0
  });
  const [recentActivity, setRecentActivity] = useState<RecentActivity[]>([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    fetchDashboardData();
  }, []);
  const fetchDashboardData = async () => {
    try {
      // Fetch users count
      const {
        count: usersCount
      } = await supabase.from('users').select('*', {
        count: 'exact',
        head: true
      });

      // Fetch service providers count
      const {
        count: providersCount
      } = await supabase.from('service_providers').select('*', {
        count: 'exact',
        head: true
      });

      // Fetch drivers count
      const {
        count: driversCount
      } = await supabase.from('ride_drivers').select('*', {
        count: 'exact',
        head: true
      });

      // Fetch bookings count
      const {
        count: bookingsCount
      } = await supabase.from('service_bookings').select('*', {
        count: 'exact',
        head: true
      });

      // Fetch pending bookings
      const {
        count: pendingCount
      } = await supabase.from('service_bookings').select('*', {
        count: 'exact',
        head: true
      }).eq('status', 'pending');

      // Fetch total revenue from payments
      const {
        data: paymentsData
      } = await supabase.from('payments').select('amount').eq('status', 'completed');
      const totalRevenue = paymentsData?.reduce((sum, payment) => sum + Number(payment.amount), 0) || 0;

      // Fetch recent activities (notifications as proxy)
      const {
        data: activitiesData
      } = await supabase.from('notifications').select('*').order('created_at', {
        ascending: false
      }).limit(10);
      setStats({
        totalUsers: usersCount || 0,
        totalProviders: providersCount || 0,
        totalDrivers: driversCount || 0,
        totalBookings: bookingsCount || 0,
        totalRevenue,
        pendingBookings: pendingCount || 0
      });
      setRecentActivity(activitiesData?.map(activity => ({
        id: activity.id,
        type: activity.type,
        description: activity.message,
        timestamp: activity.created_at,
        status: 'active'
      })) || []);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };
  const formatCurrency = (amount: number) => `AWG ${amount.toLocaleString()}`;
  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'booking':
        return <Calendar className="h-4 w-4 text-blue-600" />;
      case 'payment':
        return <DollarSign className="h-4 w-4 text-green-600" />;
      default:
        return <Bell className="h-4 w-4 text-purple-600" />;
    }
  };
  if (loading) {
    return <SidebarProvider>
        <div className="min-h-screen flex w-full">
          <AppSidebar />
          <SidebarInset>
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
              <div className="text-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
                <p className="text-gray-600">Loading dashboard...</p>
              </div>
            </div>
          </SidebarInset>
        </div>
      </SidebarProvider>;
  }
  return <SidebarProvider>
      <div className="min-h-screen flex w-full">
        <AppSidebar />
        <SidebarInset>
          <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
            {/* Header */}
            <header className="h-16 flex items-center gap-4 px-6 border-b border-blue-100 bg-white/80 backdrop-blur-sm py-[38px]">
              <SidebarTrigger className="text-blue-600" />
              <div className="flex-1">
                <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  Dashboard Overview
                </h1>
                <p className="text-gray-600 text-sm">Welcome back! Here's what's happening with your platform.</p>
              </div>
            </header>

            <div className="p-6">
              {/* Stats Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <Card className="border-0 shadow-lg bg-gradient-to-br from-blue-500 to-blue-600 text-white">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium text-blue-100">Total Users</CardTitle>
                    <Users className="h-4 w-4 text-blue-100" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-white">{stats.totalUsers}</div>
                    <p className="text-xs text-blue-100">+12% from last month</p>
                  </CardContent>
                </Card>

                <Card className="border-0 shadow-lg bg-gradient-to-br from-purple-500 to-purple-600 text-white">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium text-purple-100">Service Providers</CardTitle>
                    <ShoppingBag className="h-4 w-4 text-purple-100" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-white">{stats.totalProviders}</div>
                    <p className="text-xs text-purple-100">+8% from last month</p>
                  </CardContent>
                </Card>

                <Card className="border-0 shadow-lg bg-gradient-to-br from-indigo-500 to-indigo-600 text-white">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium text-indigo-100">Taxi Drivers</CardTitle>
                    <Car className="h-4 w-4 text-indigo-100" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-white">{stats.totalDrivers}</div>
                    <p className="text-xs text-indigo-100">+15% from last month</p>
                  </CardContent>
                </Card>

                <Card className="border-0 shadow-lg bg-gradient-to-br from-green-500 to-emerald-600 text-white">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium text-green-100">Total Revenue</CardTitle>
                    <DollarSign className="h-4 w-4 text-green-100" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-white">{formatCurrency(stats.totalRevenue)}</div>
                    <p className="text-xs text-green-100">+20% from last month</p>
                  </CardContent>
                </Card>
              </div>

              {/* Main Content Grid */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Recent Activity */}
                <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
                  <CardHeader>
                    <CardTitle className="text-gray-900">Recent Activity</CardTitle>
                    <CardDescription className="text-gray-600">Latest platform activities</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {recentActivity.slice(0, 5).map(activity => <div key={activity.id} className="flex items-center space-x-4 p-3 rounded-lg bg-gradient-to-r from-blue-50 to-purple-50">
                          <div className="p-2 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full">
                            {getActivityIcon(activity.type)}
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-gray-900 truncate">
                              {activity.description}
                            </p>
                            <p className="text-xs text-gray-500">
                              {new Date(activity.timestamp).toLocaleDateString()}
                            </p>
                          </div>
                        </div>)}
                    </div>
                  </CardContent>
                </Card>

                {/* Quick Actions */}
                <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
                  <CardHeader>
                    <CardTitle className="text-gray-900">Quick Actions</CardTitle>
                    <CardDescription className="text-gray-600">Common management tasks</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 gap-4">
                      <Button variant="outline" className="h-20 flex flex-col border-0 bg-gradient-to-br from-blue-50 to-blue-100 hover:from-blue-100 hover:to-blue-200 transition-all duration-200">
                        <Users className="h-6 w-6 mb-2 text-blue-600" />
                        <span className="text-blue-700">Manage Users</span>
                      </Button>
                      <Button variant="outline" className="h-20 flex flex-col border-0 bg-gradient-to-br from-purple-50 to-purple-100 hover:from-purple-100 hover:to-purple-200 transition-all duration-200">
                        <ShoppingBag className="h-6 w-6 mb-2 text-purple-600" />
                        <span className="text-purple-700">View Providers</span>
                      </Button>
                      <Button variant="outline" className="h-20 flex flex-col border-0 bg-gradient-to-br from-indigo-50 to-indigo-100 hover:from-indigo-100 hover:to-indigo-200 transition-all duration-200">
                        <BarChart3 className="h-6 w-6 mb-2 text-indigo-600" />
                        <span className="text-indigo-700">Analytics</span>
                      </Button>
                      <Button variant="outline" className="h-20 flex flex-col border-0 bg-gradient-to-br from-green-50 to-green-100 hover:from-green-100 hover:to-green-200 transition-all duration-200">
                        <Settings className="h-6 w-6 mb-2 text-green-600" />
                        <span className="text-green-700">Settings</span>
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Alerts */}
              {stats.pendingBookings > 0 && <Card className="mt-6 border-0 shadow-lg bg-gradient-to-r from-orange-50 to-red-50">
                  <CardHeader>
                    <CardTitle className="flex items-center text-orange-800">
                      <AlertTriangle className="h-5 w-5 mr-2" />
                      Attention Required
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-orange-700 mb-4">
                      You have {stats.pendingBookings} pending bookings that need review.
                    </p>
                    <Button className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white border-0">
                      Review Bookings
                    </Button>
                  </CardContent>
                </Card>}
            </div>
          </div>
        </SidebarInset>
      </div>
    </SidebarProvider>;
}