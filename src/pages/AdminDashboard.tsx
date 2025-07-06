
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { useAuthContext } from '@/components/AuthProvider';
import { supabase } from '@/integrations/supabase/client';
import { 
  Users, 
  ShoppingBag, 
  Car, 
  DollarSign, 
  TrendingUp, 
  Calendar,
  Bell,
  Settings,
  BarChart3,
  Shield,
  AlertTriangle
} from 'lucide-react';

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
  const { user } = useAuthContext();
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
      const { count: usersCount } = await supabase
        .from('users')
        .select('*', { count: 'exact', head: true });

      // Fetch service providers count
      const { count: providersCount } = await supabase
        .from('service_providers')
        .select('*', { count: 'exact', head: true });

      // Fetch drivers count
      const { count: driversCount } = await supabase
        .from('ride_drivers')
        .select('*', { count: 'exact', head: true });

      // Fetch bookings count
      const { count: bookingsCount } = await supabase
        .from('service_bookings')
        .select('*', { count: 'exact', head: true });

      // Fetch pending bookings
      const { count: pendingCount } = await supabase
        .from('service_bookings')
        .select('*', { count: 'exact', head: true })
        .eq('status', 'pending');

      // Fetch total revenue from payments
      const { data: paymentsData } = await supabase
        .from('payments')
        .select('amount')
        .eq('status', 'completed');

      const totalRevenue = paymentsData?.reduce((sum, payment) => sum + Number(payment.amount), 0) || 0;

      // Fetch recent activities (notifications as proxy)
      const { data: activitiesData } = await supabase
        .from('notifications')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(10);

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
      case 'booking': return <Calendar className="h-4 w-4" />;
      case 'payment': return <DollarSign className="h-4 w-4" />;
      default: return <Bell className="h-4 w-4" />;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p>Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">HopiGo Admin Dashboard</h1>
          <p className="text-gray-600">Manage your marketplace platform</p>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Users</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalUsers}</div>
              <p className="text-xs text-muted-foreground">+12% from last month</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Service Providers</CardTitle>
              <ShoppingBag className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalProviders}</div>
              <p className="text-xs text-muted-foreground">+8% from last month</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Taxi Drivers</CardTitle>
              <Car className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalDrivers}</div>
              <p className="text-xs text-muted-foreground">+15% from last month</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{formatCurrency(stats.totalRevenue)}</div>
              <p className="text-xs text-muted-foreground">+20% from last month</p>
            </CardContent>
          </Card>
        </div>

        {/* Management Tabs */}
        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="grid w-full grid-cols-6">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="users">Users</TabsTrigger>
            <TabsTrigger value="providers">Providers</TabsTrigger>
            <TabsTrigger value="bookings">Bookings</TabsTrigger>
            <TabsTrigger value="payments">Payments</TabsTrigger>
            <TabsTrigger value="settings">Settings</TabsTrigger>
          </TabsList>

          <TabsContent value="overview">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Recent Activity */}
              <Card>
                <CardHeader>
                  <CardTitle>Recent Activity</CardTitle>
                  <CardDescription>Latest platform activities</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {recentActivity.slice(0, 5).map((activity) => (
                      <div key={activity.id} className="flex items-center space-x-4">
                        <div className="p-2 bg-blue-100 rounded-full">
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
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Quick Actions */}
              <Card>
                <CardHeader>
                  <CardTitle>Quick Actions</CardTitle>
                  <CardDescription>Common management tasks</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-4">
                    <Button variant="outline" className="h-20 flex flex-col">
                      <Users className="h-6 w-6 mb-2" />
                      <span>Manage Users</span>
                    </Button>
                    <Button variant="outline" className="h-20 flex flex-col">
                      <ShoppingBag className="h-6 w-6 mb-2" />
                      <span>View Providers</span>
                    </Button>
                    <Button variant="outline" className="h-20 flex flex-col">
                      <BarChart3 className="h-6 w-6 mb-2" />
                      <span>Analytics</span>
                    </Button>
                    <Button variant="outline" className="h-20 flex flex-col">
                      <Settings className="h-6 w-6 mb-2" />
                      <span>Settings</span>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Alerts */}
            {stats.pendingBookings > 0 && (
              <Card className="border-orange-200 bg-orange-50">
                <CardHeader>
                  <CardTitle className="flex items-center text-orange-800">
                    <AlertTriangle className="h-5 w-5 mr-2" />
                    Attention Required
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-orange-700">
                    You have {stats.pendingBookings} pending bookings that need review.
                  </p>
                  <Button variant="outline" className="mt-4">
                    Review Bookings
                  </Button>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="users">
            <UserManagement />
          </TabsContent>

          <TabsContent value="providers">
            <ProviderManagement />
          </TabsContent>

          <TabsContent value="bookings">
            <BookingManagement />
          </TabsContent>

          <TabsContent value="payments">
            <PaymentManagement />
          </TabsContent>

          <TabsContent value="settings">
            <AppSettings />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}

// User Management Component
function UserManagement() {
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setUsers(data || []);
    } catch (error) {
      console.error('Error fetching users:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="text-center py-8">Loading users...</div>;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>User Management</CardTitle>
        <CardDescription>Manage platform users</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {users.map((user) => (
            <div key={user.id} className="flex items-center justify-between p-4 border rounded-lg">
              <div className="flex items-center space-x-4">
                <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center text-white font-semibold">
                  {user.name?.charAt(0) || user.email.charAt(0)}
                </div>
                <div>
                  <p className="font-medium">{user.name || 'No name'}</p>
                  <p className="text-sm text-gray-500">{user.email}</p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <Badge variant={user.is_active ? "default" : "secondary"}>
                  {user.is_active ? 'Active' : 'Inactive'}
                </Badge>
                <Badge variant="outline">
                  {user.user_type || 'Customer'}
                </Badge>
                <Button variant="outline" size="sm">
                  Edit
                </Button>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

// Provider Management Component
function ProviderManagement() {
  const [providers, setProviders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProviders();
  }, []);

  const fetchProviders = async () => {
    try {
      const { data, error } = await supabase
        .from('service_providers')
        .select(`
          *,
          users (
            name,
            email
          )
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setProviders(data || []);
    } catch (error) {
      console.error('Error fetching providers:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="text-center py-8">Loading providers...</div>;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Provider Management</CardTitle>
        <CardDescription>Manage service providers</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {providers.map((provider) => (
            <div key={provider.id} className="flex items-center justify-between p-4 border rounded-lg">
              <div>
                <p className="font-medium">{provider.business_name}</p>
                <p className="text-sm text-gray-500">{provider.description}</p>
                <p className="text-xs text-gray-400">Category: {provider.category}</p>
              </div>
              <div className="flex items-center space-x-2">
                <Badge variant={provider.is_verified ? "default" : "secondary"}>
                  {provider.is_verified ? 'Verified' : 'Unverified'}
                </Badge>
                <Badge variant="outline">
                  Rating: {provider.rating}/5
                </Badge>
                <Button variant="outline" size="sm">
                  Manage
                </Button>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

// Booking Management Component
function BookingManagement() {
  const [bookings, setBookings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    try {
      const { data, error } = await supabase
        .from('service_bookings')
        .select(`
          *,
          users (
            name,
            email
          ),
          service_providers (
            business_name
          ),
          services (
            title
          )
        `)
        .order('created_at', { ascending: false })
        .limit(20);

      if (error) throw error;
      setBookings(data || []);
    } catch (error) {
      console.error('Error fetching bookings:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'default';
      case 'pending': return 'secondary';
      case 'cancelled': return 'destructive';
      default: return 'outline';
    }
  };

  if (loading) {
    return <div className="text-center py-8">Loading bookings...</div>;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Booking Management</CardTitle>
        <CardDescription>Monitor and manage service bookings</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {bookings.map((booking) => (
            <div key={booking.id} className="flex items-center justify-between p-4 border rounded-lg">
              <div>
                <p className="font-medium">{booking.services?.title}</p>
                <p className="text-sm text-gray-500">
                  Provider: {booking.service_providers?.business_name}
                </p>
                <p className="text-xs text-gray-400">
                  Booking Date: {new Date(booking.booking_date).toLocaleDateString()}
                </p>
              </div>
              <div className="flex items-center space-x-2">
                <Badge variant={getStatusColor(booking.status)}>
                  {booking.status}
                </Badge>
                <span className="font-semibold">
                  AWG {Number(booking.total_amount).toFixed(2)}
                </span>
                <Button variant="outline" size="sm">
                  View
                </Button>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

// Payment Management Component
function PaymentManagement() {
  const [payments, setPayments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPayments();
  }, []);

  const fetchPayments = async () => {
    try {
      const { data, error } = await supabase
        .from('payments')
        .select(`
          *,
          users (
            name,
            email
          )
        `)
        .order('created_at', { ascending: false })
        .limit(20);

      if (error) throw error;
      setPayments(data || []);
    } catch (error) {
      console.error('Error fetching payments:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="text-center py-8">Loading payments...</div>;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Payment Management</CardTitle>
        <CardDescription>Monitor platform transactions</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {payments.map((payment) => (
            <div key={payment.id} className="flex items-center justify-between p-4 border rounded-lg">
              <div>
                <p className="font-medium">{payment.type.replace('_', ' ').toUpperCase()}</p>
                <p className="text-sm text-gray-500">
                  User: {payment.users?.name || payment.users?.email}
                </p>
                <p className="text-xs text-gray-400">
                  {new Date(payment.created_at).toLocaleDateString()}
                </p>
              </div>
              <div className="flex items-center space-x-2">
                <Badge variant={payment.status === 'completed' ? 'default' : 'secondary'}>
                  {payment.status}
                </Badge>
                <span className="font-semibold">
                  AWG {Number(payment.amount).toFixed(2)}
                </span>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

// App Settings Component
function AppSettings() {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Application Settings</CardTitle>
          <CardDescription>Configure platform settings</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">Maintenance Mode</p>
              <p className="text-sm text-gray-500">Temporarily disable the platform</p>
            </div>
            <Button variant="outline">Configure</Button>
          </div>
          
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">Commission Rates</p>
              <p className="text-sm text-gray-500">Set commission for services and rides</p>
            </div>
            <Button variant="outline">Manage</Button>
          </div>
          
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">Payment Methods</p>
              <p className="text-sm text-gray-500">Configure accepted payment methods</p>
            </div>
            <Button variant="outline">Configure</Button>
          </div>
          
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">Notifications</p>
              <p className="text-sm text-gray-500">Manage notification settings</p>
            </div>
            <Button variant="outline">Settings</Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Platform Analytics</CardTitle>
          <CardDescription>View detailed analytics and reports</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4">
            <Button variant="outline" className="h-20 flex flex-col">
              <BarChart3 className="h-6 w-6 mb-2" />
              <span>Revenue Reports</span>
            </Button>
            <Button variant="outline" className="h-20 flex flex-col">
              <TrendingUp className="h-6 w-6 mb-2" />
              <span>Growth Analytics</span>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
