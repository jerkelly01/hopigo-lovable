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
      case 'booking': return <Calendar className="h-4 w-4 text-blue-600" />;
      case 'payment': return <DollarSign className="h-4 w-4 text-green-600" />;
      default: return <Bell className="h-4 w-4 text-purple-600" />;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            HopiGo Admin Dashboard
          </h1>
          <p className="text-gray-600 mt-2">Manage your marketplace platform</p>
        </div>

        {/* Stats Overview */}
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

        {/* Management Tabs */}
        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="grid w-full grid-cols-6 bg-white/70 backdrop-blur-sm border-0 shadow-md">
            <TabsTrigger value="overview" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-500 data-[state=active]:to-purple-500 data-[state=active]:text-white">Overview</TabsTrigger>
            <TabsTrigger value="users" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-500 data-[state=active]:to-purple-500 data-[state=active]:text-white">Users</TabsTrigger>
            <TabsTrigger value="providers" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-500 data-[state=active]:to-purple-500 data-[state=active]:text-white">Providers</TabsTrigger>
            <TabsTrigger value="bookings" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-500 data-[state=active]:to-purple-500 data-[state=active]:text-white">Bookings</TabsTrigger>
            <TabsTrigger value="payments" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-500 data-[state=active]:to-purple-500 data-[state=active]:text-white">Payments</TabsTrigger>
            <TabsTrigger value="settings" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-500 data-[state=active]:to-purple-500 data-[state=active]:text-white">Settings</TabsTrigger>
          </TabsList>

          <TabsContent value="overview">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Recent Activity */}
              <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="text-gray-900">Recent Activity</CardTitle>
                  <CardDescription className="text-gray-600">Latest platform activities</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {recentActivity.slice(0, 5).map((activity) => (
                      <div key={activity.id} className="flex items-center space-x-4 p-3 rounded-lg bg-gradient-to-r from-blue-50 to-purple-50">
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
                      </div>
                    ))}
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
            {stats.pendingBookings > 0 && (
              <Card className="border-0 shadow-lg bg-gradient-to-r from-orange-50 to-red-50">
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
    return <div className="text-center py-8 text-gray-600">Loading users...</div>;
  }

  return (
    <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
      <CardHeader>
        <CardTitle className="text-gray-900">User Management</CardTitle>
        <CardDescription className="text-gray-600">Manage platform users</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {users.map((user) => (
            <div key={user.id} className="flex items-center justify-between p-4 border-0 rounded-lg bg-gradient-to-r from-blue-50 to-purple-50">
              <div className="flex items-center space-x-4">
                <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white font-semibold">
                  {user.name?.charAt(0) || user.email.charAt(0)}
                </div>
                <div>
                  <p className="font-medium text-gray-900">{user.name || 'No name'}</p>
                  <p className="text-sm text-gray-600">{user.email}</p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <Badge variant={user.is_active ? "default" : "secondary"} className={user.is_active ? "bg-gradient-to-r from-green-500 to-emerald-500" : ""}>
                  {user.is_active ? 'Active' : 'Inactive'}
                </Badge>
                <Badge variant="outline" className="border-blue-200 text-blue-700">
                  {user.user_type || 'Customer'}
                </Badge>
                <Button variant="outline" size="sm" className="border-purple-200 text-purple-700 hover:bg-purple-50">
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
    return <div className="text-center py-8 text-gray-600">Loading providers...</div>;
  }

  return (
    <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
      <CardHeader>
        <CardTitle className="text-gray-900">Provider Management</CardTitle>
        <CardDescription className="text-gray-600">Manage service providers</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {providers.map((provider) => (
            <div key={provider.id} className="flex items-center justify-between p-4 border-0 rounded-lg bg-gradient-to-r from-blue-50 to-purple-50">
              <div>
                <p className="font-medium text-gray-900">{provider.business_name}</p>
                <p className="text-sm text-gray-600">{provider.description}</p>
                <p className="text-xs text-gray-500">Category: {provider.category}</p>
              </div>
              <div className="flex items-center space-x-2">
                <Badge variant={provider.is_verified ? "default" : "secondary"} className={provider.is_verified ? "bg-gradient-to-r from-green-500 to-emerald-500" : ""}>
                  {provider.is_verified ? 'Verified' : 'Unverified'}
                </Badge>
                <Badge variant="outline" className="border-blue-200 text-blue-700">
                  Rating: {provider.rating}/5
                </Badge>
                <Button variant="outline" size="sm" className="border-purple-200 text-purple-700 hover:bg-purple-50">
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
    return <div className="text-center py-8 text-gray-600">Loading bookings...</div>;
  }

  return (
    <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
      <CardHeader>
        <CardTitle className="text-gray-900">Booking Management</CardTitle>
        <CardDescription className="text-gray-600">Monitor and manage service bookings</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {bookings.map((booking) => (
            <div key={booking.id} className="flex items-center justify-between p-4 border-0 rounded-lg bg-gradient-to-r from-blue-50 to-purple-50">
              <div>
                <p className="font-medium text-gray-900">{booking.services?.title}</p>
                <p className="text-sm text-gray-600">
                  Provider: {booking.service_providers?.business_name}
                </p>
                <p className="text-xs text-gray-500">
                  Booking Date: {new Date(booking.booking_date).toLocaleDateString()}
                </p>
              </div>
              <div className="flex items-center space-x-2">
                <Badge variant={getStatusColor(booking.status)} className={booking.status === 'completed' ? "bg-gradient-to-r from-green-500 to-emerald-500" : ""}>
                  {booking.status}
                </Badge>
                <span className="font-semibold text-gray-900">
                  AWG {Number(booking.total_amount).toFixed(2)}
                </span>
                <Button variant="outline" size="sm" className="border-purple-200 text-purple-700 hover:bg-purple-50">
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
    return <div className="text-center py-8 text-gray-600">Loading payments...</div>;
  }

  return (
    <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
      <CardHeader>
        <CardTitle className="text-gray-900">Payment Management</CardTitle>
        <CardDescription className="text-gray-600">Monitor platform transactions</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {payments.map((payment) => (
            <div key={payment.id} className="flex items-center justify-between p-4 border-0 rounded-lg bg-gradient-to-r from-blue-50 to-purple-50">
              <div>
                <p className="font-medium text-gray-900">{payment.type.replace('_', ' ').toUpperCase()}</p>
                <p className="text-sm text-gray-600">
                  User: {payment.users?.name || payment.users?.email}
                </p>
                <p className="text-xs text-gray-500">
                  {new Date(payment.created_at).toLocaleDateString()}
                </p>
              </div>
              <div className="flex items-center space-x-2">
                <Badge variant={payment.status === 'completed' ? 'default' : 'secondary'} className={payment.status === 'completed' ? "bg-gradient-to-r from-green-500 to-emerald-500" : ""}>
                  {payment.status}
                </Badge>
                <span className="font-semibold text-gray-900">
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
      <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="text-gray-900">Application Settings</CardTitle>
          <CardDescription className="text-gray-600">Configure platform settings</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between p-4 rounded-lg bg-gradient-to-r from-blue-50 to-purple-50">
            <div>
              <p className="font-medium text-gray-900">Maintenance Mode</p>
              <p className="text-sm text-gray-600">Temporarily disable the platform</p>
            </div>
            <Button variant="outline" className="border-blue-200 text-blue-700 hover:bg-blue-50">Configure</Button>
          </div>
          
          <div className="flex items-center justify-between p-4 rounded-lg bg-gradient-to-r from-blue-50 to-purple-50">
            <div>
              <p className="font-medium text-gray-900">Commission Rates</p>
              <p className="text-sm text-gray-600">Set commission for services and rides</p>
            </div>
            <Button variant="outline" className="border-purple-200 text-purple-700 hover:bg-purple-50">Manage</Button>
          </div>
          
          <div className="flex items-center justify-between p-4 rounded-lg bg-gradient-to-r from-blue-50 to-purple-50">
            <div>
              <p className="font-medium text-gray-900">Payment Methods</p>
              <p className="text-sm text-gray-600">Configure accepted payment methods</p>
            </div>
            <Button variant="outline" className="border-indigo-200 text-indigo-700 hover:bg-indigo-50">Configure</Button>
          </div>
          
          <div className="flex items-center justify-between p-4 rounded-lg bg-gradient-to-r from-blue-50 to-purple-50">
            <div>
              <p className="font-medium text-gray-900">Notifications</p>
              <p className="text-sm text-gray-600">Manage notification settings</p>
            </div>
            <Button variant="outline" className="border-green-200 text-green-700 hover:bg-green-50">Settings</Button>
          </div>
        </CardContent>
      </Card>

      <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="text-gray-900">Platform Analytics</CardTitle>
          <CardDescription className="text-gray-600">View detailed analytics and reports</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4">
            <Button variant="outline" className="h-20 flex flex-col border-0 bg-gradient-to-br from-blue-50 to-blue-100 hover:from-blue-100 hover:to-blue-200 transition-all duration-200">
              <BarChart3 className="h-6 w-6 mb-2 text-blue-600" />
              <span className="text-blue-700">Revenue Reports</span>
            </Button>
            <Button variant="outline" className="h-20 flex flex-col border-0 bg-gradient-to-br from-purple-50 to-purple-100 hover:from-purple-100 hover:to-purple-200 transition-all duration-200">
              <TrendingUp className="h-6 w-6 mb-2 text-purple-600" />
              <span className="text-purple-700">Growth Analytics</span>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
