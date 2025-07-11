
import React, { useState, useEffect } from 'react';
import { AdminLayout } from '@/components/AdminLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { supabase } from '@/integrations/supabase/client';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from 'recharts';
import { TrendingUp, Users, DollarSign, Calendar, Activity } from 'lucide-react';

export default function AnalyticsPage() {
  const [analyticsData, setAnalyticsData] = useState({
    userGrowth: [],
    revenueData: [],
    serviceBreakdown: [],
    monthlyStats: []
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAnalyticsData();
  }, []);

  const fetchAnalyticsData = async () => {
    try {
      const [usersResult, paymentsResult, servicesResult, bookingsResult] = await Promise.all([
        supabase.from('users').select('created_at'),
        supabase.from('payments').select('amount, created_at'),
        supabase.from('services').select('category, price'),
        supabase.from('service_bookings').select('total_amount, created_at')
      ]);

      // Process user growth data
      const usersByMonth = {};
      usersResult.data?.forEach(user => {
        const month = new Date(user.created_at).toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
        usersByMonth[month] = (usersByMonth[month] || 0) + 1;
      });

      const userGrowth = Object.entries(usersByMonth).map(([month, count]) => ({
        month,
        users: count
      }));

      // Process revenue data
      const revenueByMonth = {};
      paymentsResult.data?.forEach(payment => {
        const month = new Date(payment.created_at).toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
        revenueByMonth[month] = (revenueByMonth[month] || 0) + payment.amount;
      });

      bookingsResult.data?.forEach(booking => {
        const month = new Date(booking.created_at).toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
        revenueByMonth[month] = (revenueByMonth[month] || 0) + booking.total_amount;
      });

      const revenueData = Object.entries(revenueByMonth).map(([month, revenue]) => ({
        month,
        revenue
      }));

      // Process service breakdown
      const servicesByCategory = {};
      servicesResult.data?.forEach(service => {
        servicesByCategory[service.category] = (servicesByCategory[service.category] || 0) + 1;
      });

      const serviceBreakdown = Object.entries(servicesByCategory).map(([category, count]) => ({
        name: category,
        value: count
      }));

      setAnalyticsData({
        userGrowth: userGrowth.slice(-12),
        revenueData: revenueData.slice(-12),
        serviceBreakdown,
        monthlyStats: []
      });
    } catch (error) {
      console.error('Error fetching analytics data:', error);
    } finally {
      setLoading(false);
    }
  };

  const COLORS = ['#8884d8', '#82ca9d', '#ffc658', '#ff7300', '#ff0000', '#00ff00'];

  return (
    <AdminLayout title="Analytics & Reports" description="View platform analytics, reports, and performance metrics">
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card className="border-0 shadow-lg bg-gradient-to-br from-blue-500 to-blue-600 text-white">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-blue-100">Total Users</CardTitle>
              <Users className="h-4 w-4 text-blue-100" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">
                {analyticsData.userGrowth.reduce((sum, data) => sum + data.users, 0)}
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg bg-gradient-to-br from-green-500 to-green-600 text-white">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-green-100">Total Revenue</CardTitle>
              <DollarSign className="h-4 w-4 text-green-100" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">
                AWG {analyticsData.revenueData.reduce((sum, data) => sum + data.revenue, 0).toLocaleString()}
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg bg-gradient-to-br from-purple-500 to-purple-600 text-white">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-purple-100">Services</CardTitle>
              <Activity className="h-4 w-4 text-purple-100" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">
                {analyticsData.serviceBreakdown.reduce((sum, data) => sum + data.value, 0)}
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg bg-gradient-to-br from-orange-500 to-orange-600 text-white">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-orange-100">Growth Rate</CardTitle>
              <TrendingUp className="h-4 w-4 text-orange-100" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">12.5%</div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>User Growth</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={analyticsData.userGrowth}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Line type="monotone" dataKey="users" stroke="#8884d8" strokeWidth={2} />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Revenue Trends</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={analyticsData.revenueData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="revenue" fill="#82ca9d" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Service Categories</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={analyticsData.serviceBreakdown}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {analyticsData.serviceBreakdown.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Key Metrics</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex justify-between">
                  <span className="text-gray-600">Average Session Duration</span>
                  <span className="font-medium">8m 32s</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Bounce Rate</span>
                  <span className="font-medium">24.3%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Conversion Rate</span>
                  <span className="font-medium">3.7%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Customer Satisfaction</span>
                  <span className="font-medium">4.6/5</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </AdminLayout>
  );
}
