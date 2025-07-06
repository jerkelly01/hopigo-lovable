import React, { useState, useEffect } from 'react';
import { useAuthContext } from '@/components/AuthProvider';
import { supabase } from '@/integrations/supabase/client';
import { SidebarProvider, SidebarInset } from '@/components/ui/sidebar';
import { AppSidebar } from '@/components/AppSidebar';
import { DashboardSkeleton } from '@/components/LoadingScreen';
import { DashboardHeader } from '@/components/dashboard/DashboardHeader';
import { StatsCards } from '@/components/dashboard/StatsCards';
import { RecentActivity } from '@/components/dashboard/RecentActivity';
import { QuickActions } from '@/components/dashboard/QuickActions';
import { PendingBookingsAlert } from '@/components/dashboard/PendingBookingsAlert';
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
  if (loading) {
    return (
      <SidebarProvider>
        <div className="min-h-screen flex w-full">
          <AppSidebar />
          <SidebarInset>
            <DashboardSkeleton />
          </SidebarInset>
        </div>
      </SidebarProvider>
    );
  }
  return <SidebarProvider>
      <div className="min-h-screen flex w-full">
        <AppSidebar />
        <SidebarInset>
          <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
            <DashboardHeader />
            
            <div className="p-6">
              <StatsCards stats={stats} formatCurrency={formatCurrency} />
              
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <RecentActivity activities={recentActivity} />
                <QuickActions />
              </div>

              <PendingBookingsAlert pendingBookings={stats.pendingBookings} />
            </div>
          </div>
        </SidebarInset>
      </div>
    </SidebarProvider>;
}