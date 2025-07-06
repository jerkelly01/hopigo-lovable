
import React, { useState, useEffect } from 'react';
import { AdminLayout } from '@/components/AdminLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { supabase } from '@/integrations/supabase/client';
import { ShoppingBag, Search, Star, TrendingUp, Users, DollarSign } from 'lucide-react';

interface ServiceProvider {
  id: string;
  user_id: string;
  business_name: string | null;
  description: string | null;
  category: string;
  rating: number | null;
  total_bookings: number | null;
  total_earnings: number | null;
  is_verified: boolean | null;
  is_active: boolean | null;
  created_at: string | null;
}

export default function ProvidersPage() {
  const [providers, setProviders] = useState<ServiceProvider[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchProviders();
  }, []);

  const fetchProviders = async () => {
    try {
      const { data, error } = await supabase
        .from('service_providers')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setProviders(data || []);
    } catch (error) {
      console.error('Error fetching providers:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredProviders = providers.filter(provider => 
    (provider.business_name && provider.business_name.toLowerCase().includes(searchTerm.toLowerCase())) ||
    provider.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const toggleVerification = async (providerId: string, currentStatus: boolean | null) => {
    try {
      const { error } = await supabase
        .from('service_providers')
        .update({ is_verified: !currentStatus })
        .eq('id', providerId);

      if (error) throw error;
      fetchProviders();
    } catch (error) {
      console.error('Error updating verification:', error);
    }
  };

  const toggleActiveStatus = async (providerId: string, currentStatus: boolean | null) => {
    try {
      const { error } = await supabase
        .from('service_providers')
        .update({ is_active: !currentStatus })
        .eq('id', providerId);

      if (error) throw error;
      fetchProviders();
    } catch (error) {
      console.error('Error updating active status:', error);
    }
  };

  return (
    <AdminLayout 
      title="Service Providers" 
      description="Manage service providers, their verification status, and business details"
    >
      <div className="space-y-6">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card className="border-0 shadow-lg bg-gradient-to-br from-purple-500 to-purple-600 text-white">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-purple-100">Total Providers</CardTitle>
              <ShoppingBag className="h-4 w-4 text-purple-100" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">{providers.length}</div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg bg-gradient-to-br from-green-500 to-green-600 text-white">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-green-100">Verified</CardTitle>
              <Star className="h-4 w-4 text-green-100" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">
                {providers.filter(p => p.is_verified).length}
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg bg-gradient-to-br from-blue-500 to-blue-600 text-white">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-blue-100">Active</CardTitle>
              <TrendingUp className="h-4 w-4 text-blue-100" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">
                {providers.filter(p => p.is_active).length}
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg bg-gradient-to-br from-emerald-500 to-emerald-600 text-white">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-emerald-100">Total Earnings</CardTitle>
              <DollarSign className="h-4 w-4 text-emerald-100" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">
                AWG {providers.reduce((sum, p) => sum + (p.total_earnings || 0), 0).toLocaleString()}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Search */}
        <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="text-gray-900">Search Providers</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search by business name or category..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </CardContent>
        </Card>

        {/* Providers List */}
        <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="text-gray-900">All Service Providers</CardTitle>
            <CardDescription>Manage provider accounts and business status</CardDescription>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="text-center py-8">Loading providers...</div>
            ) : (
              <div className="space-y-4">
                {filteredProviders.map((provider) => (
                  <div key={provider.id} className="flex items-center justify-between p-4 rounded-lg border bg-gradient-to-r from-purple-50 to-blue-50">
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full flex items-center justify-center">
                        <ShoppingBag className="h-6 w-6 text-white" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900">
                          {provider.business_name || 'Unnamed Business'}
                        </h3>
                        <p className="text-sm text-gray-600">Category: {provider.category}</p>
                        {provider.description && (
                          <p className="text-sm text-gray-500 max-w-md truncate">{provider.description}</p>
                        )}
                        <div className="flex items-center gap-4 text-sm text-gray-500 mt-1">
                          <div className="flex items-center gap-1">
                            <Star className="h-3 w-3" />
                            {provider.rating?.toFixed(1) || '0.0'}
                          </div>
                          <div className="flex items-center gap-1">
                            <Users className="h-3 w-3" />
                            {provider.total_bookings || 0} bookings
                          </div>
                          <div className="flex items-center gap-1">
                            <DollarSign className="h-3 w-3" />
                            AWG {provider.total_earnings || 0}
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3">
                      <div className="flex flex-col gap-2">
                        <Badge variant={provider.is_verified ? "default" : "secondary"}>
                          {provider.is_verified ? "Verified" : "Unverified"}
                        </Badge>
                        <Badge variant={provider.is_active ? "default" : "destructive"}>
                          {provider.is_active ? "Active" : "Inactive"}
                        </Badge>
                      </div>
                      <div className="flex flex-col gap-2">
                        <Button
                          size="sm"
                          variant={provider.is_verified ? "destructive" : "default"}
                          onClick={() => toggleVerification(provider.id, provider.is_verified)}
                        >
                          {provider.is_verified ? "Unverify" : "Verify"}
                        </Button>
                        <Button
                          size="sm"
                          variant={provider.is_active ? "secondary" : "default"}
                          onClick={() => toggleActiveStatus(provider.id, provider.is_active)}
                        >
                          {provider.is_active ? "Deactivate" : "Activate"}
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
