
import React, { useState, useEffect } from 'react';
import { AdminLayout } from '@/components/AdminLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { supabase } from '@/integrations/supabase/client';
import { Users, ShoppingBag, Calendar, DollarSign, Car, Gift, TrendingUp, Bell, Activity, Star } from 'lucide-react';

interface DashboardStats {
  totalUsers: number;
  totalProviders: number;
  totalBookings: number;
  totalRevenue: number;
  totalRides: number;
  totalEvents: number;
  totalLoyaltyPrograms: number;
  unreadNotifications: number;
  averageProviderRating: number;
  totalLoyaltyPoints: number;
}

interface RecentActivity {
  id: string;
  title: string;
  description: string;
  type: string;
  created_at: string;
  user_id: string | null;
}

export default function DashboardPage() {
  const [stats, setStats] = useState<DashboardStats>({
    totalUsers: 0,
    totalProviders: 0,
    totalBookings: 0,
    totalRevenue: 0,
    totalRides: 0,
    totalEvents: 0,
    totalLoyaltyPrograms: 0,
    unreadNotifications: 0,
    averageProviderRating: 0,
    totalLoyaltyPoints: 0
  });
  const [recentActivities, setRecentActivities] = useState<RecentActivity[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardStats();
    fetchRecentActivities();
  }, []);

  const fetchDashboardStats = async () => {
    try {
      const [
        usersResult,
        providersResult,
        serviceBookingsResult,
        rideBookingsResult,
        paymentsResult,
        eventsResult,
        loyaltyProgramsResult,
        notificationsResult
      ] = await Promise.all([
        supabase.from('users').select('wallet_balance, loyalty_points', { count: 'exact' }),
        supabase.from('service_providers').select('rating', { count: 'exact' }),
        supabase.from('service_bookings').select('total_amount', { count: 'exact' }),
        supabase.from('ride_bookings').select('id', { count: 'exact' }),
        supabase.from('payments').select('amount'),
        supabase.from('events').select('id', { count: 'exact' }),
        supabase.from('loyalty_programs').select('id', { count: 'exact' }),
        supabase.from('notifications').select('id', { count: 'exact' }).eq('is_read', false)
      ]);

      // Calculate revenue from payments
      const paymentsRevenue = paymentsResult.data?.reduce((sum, payment) => sum + Number(payment.amount), 0) || 0;
      
      // Calculate revenue from service bookings
      const serviceBookingsRevenue = serviceBookingsResult.data?.reduce((sum, booking) => sum + Number(booking.total_amount), 0) || 0;
      
      // Calculate average provider rating
      const providerRatings = providersResult.data?.filter(p => p.rating > 0) || [];
      const averageRating = providerRatings.length > 0 
        ? providerRatings.reduce((sum, p) => sum + Number(p.rating), 0) / providerRatings.length 
        : 0;

      // Calculate total loyalty points
      const totalLoyaltyPoints = usersResult.data?.reduce((sum, user) => sum + Number(user.loyalty_points || 0), 0) || 0;

      setStats({
        totalUsers: usersResult.count || 0,
        totalProviders: providersResult.count || 0,
        totalBookings: (serviceBookingsResult.count || 0) + (rideBookingsResult.count || 0),
        totalRevenue: paymentsRevenue + serviceBookingsRevenue,
        totalRides: rideBookingsResult.count || 0,
        totalEvents: eventsResult.count || 0,
        totalLoyaltyPrograms: loyaltyProgramsResult.count || 0,
        unreadNotifications: notificationsResult.count || 0,
        averageProviderRating: averageRating,
        totalLoyaltyPoints: totalLoyaltyPoints
      });
    } catch (error) {
      console.error('Error fetching dashboard stats:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchRecentActivities = async () => {
    try {
      const { data, error } = await supabase
        .from('activities')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(10);

      if (error) throw error;
      setRecentActivities(data || []);
    } catch (error) {
      console.error('Error fetching recent activities:', error);
    }
  };

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'booking':
        return <Calendar className="h-4 w-4" />;
      case 'payment':
        return <DollarSign className="h-4 w-4" />;
      case 'signup':
        return <Users className="h-4 w-4" />;
      case 'system':
        return <Activity className="h-4 w-4" />;
      default:
        return <Bell className="h-4 w-4" />;
    }
  };

  const getActivityColor = (type: string) => {
    switch (type) {
      case 'booking':
        return 'text-blue-600 bg-blue-100';
      case 'payment':
        return 'text-green-600 bg-green-100';
      case 'signup':
        return 'text-purple-600 bg-purple-100';
      case 'system':
        return 'text-gray-600 bg-gray-100';
      default:
        return 'text-orange-600 bg-orange-100';
    }
  };

  const formatTimeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 1) return 'Just now';
    if (diffInHours < 24) return `${diffInHours}h ago`;
    const diffInDays = Math.floor(diffInHours / 24);
    return `${diffInDays}d ago`;
  };

  const statCards = [
    { title: 'Total Users', value: stats.totalUsers, icon: Users, color: 'from-blue-500 to-blue-600' },
    { title: 'Service Providers', value: stats.totalProviders, icon: ShoppingBag, color: 'from-purple-500 to-purple-600' },
    { title: 'Total Bookings', value: stats.totalBookings, icon: Calendar, color: 'from-green-500 to-green-600' },
    { title: 'Total Revenue', value: `AWG ${stats.totalRevenue.toLocaleString()}`, icon: DollarSign, color: 'from-emerald-500 to-emerald-600' },
    { title: 'Taxi Rides', value: stats.totalRides, icon: Car, color: 'from-orange-500 to-orange-600' },
    { title: 'Events', value: stats.totalEvents, icon: Gift, color: 'from-pink-500 to-pink-600' },
    { title: 'Loyalty Programs', value: stats.totalLoyaltyPrograms, icon: TrendingUp, color: 'from-yellow-500 to-yellow-600' },
    { title: 'Unread Notifications', value: stats.unreadNotifications, icon: Bell, color: 'from-red-500 to-red-600' }
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
              <CardTitle className="flex items-center gap-2">
                <Activity className="h-5 w-5" />
                Recent Activity
              </CardTitle>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="text-center py-8 text-gray-500">Loading activities...</div>
              ) : recentActivities.length > 0 ? (
                <div className="space-y-4">
                  {recentActivities.slice(0, 8).map((activity) => (
                    <div key={activity.id} className="flex items-start space-x-3">
                      <div className={`p-2 rounded-full ${getActivityColor(activity.type)}`}>
                        {getActivityIcon(activity.type)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900 truncate">
                          {activity.title}
                        </p>
                        <p className="text-sm text-gray-500 truncate">
                          {activity.description}
                        </p>
                        <p className="text-xs text-gray-400 mt-1">
                          {formatTimeAgo(activity.created_at)}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500">No recent activities</div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5" />
                Key Metrics
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex justify-between items-center p-3 bg-blue-50 rounded-lg">
                  <div className="flex items-center space-x-2">
                    <Star className="h-4 w-4 text-blue-600" />
                    <span className="text-sm font-medium text-gray-900">Avg Provider Rating</span>
                  </div>
                  <span className="text-sm font-bold text-blue-600">
                    {stats.averageProviderRating.toFixed(1)} / 5.0
                  </span>
                </div>
                
                <div className="flex justify-between items-center p-3 bg-purple-50 rounded-lg">
                  <div className="flex items-center space-x-2">
                    <Gift className="h-4 w-4 text-purple-600" />
                    <span className="text-sm font-medium text-gray-900">Total Loyalty Points</span>
                  </div>
                  <span className="text-sm font-bold text-purple-600">
                    {stats.totalLoyaltyPoints.toLocaleString()}
                  </span>
                </div>

                <div className="flex justify-between items-center p-3 bg-green-50 rounded-lg">
                  <div className="flex items-center space-x-2">
                    <Activity className="h-4 w-4 text-green-600" />
                    <span className="text-sm font-medium text-gray-900">System Status</span>
                  </div>
                  <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs font-medium">
                    Online
                  </span>
                </div>

                <div className="flex justify-between items-center p-3 bg-orange-50 rounded-lg">
                  <div className="flex items-center space-x-2">
                    <DollarSign className="h-4 w-4 text-orange-600" />
                    <span className="text-sm font-medium text-gray-900">Payment System</span>
                  </div>
                  <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs font-medium">
                    Online
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </AdminLayout>
  );
}
