
import React, { useState, useEffect } from 'react';
import { AdminLayout } from '@/components/AdminLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { supabase } from '@/integrations/supabase/client';
import { ShoppingBag, Search, Plus, Edit, Trash2, DollarSign } from 'lucide-react';
import type { Tables } from '@/integrations/supabase/types';

type Service = Tables<'services'>;

export default function ServicesPage() {
  const [services, setServices] = useState<Service[]>([]);
  const [filteredServices, setFilteredServices] = useState<Service[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchServices();
  }, []);

  useEffect(() => {
    const filtered = services.filter(service =>
      service.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      service.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (service.description && service.description.toLowerCase().includes(searchTerm.toLowerCase()))
    );
    setFilteredServices(filtered);
  }, [services, searchTerm]);

  const fetchServices = async () => {
    try {
      const { data, error } = await supabase
        .from('services')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setServices(data || []);
    } catch (error) {
      console.error('Error fetching services:', error);
    } finally {
      setLoading(false);
    }
  };

  const toggleServiceStatus = async (serviceId: string, currentStatus: boolean | null) => {
    try {
      const { error } = await supabase
        .from('services')
        .update({ is_active: !currentStatus })
        .eq('id', serviceId);

      if (error) throw error;
      fetchServices();
    } catch (error) {
      console.error('Error updating service status:', error);
    }
  };

  const totalRevenue = services.reduce((sum, service) => sum + Number(service.price), 0);
  const activeServices = services.filter(s => s.is_active).length;

  return (
    <AdminLayout title="Services Management" description="Manage all platform services and their configurations">
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card className="border-0 shadow-lg bg-gradient-to-br from-blue-500 to-blue-600 text-white">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-blue-100">Total Services</CardTitle>
              <ShoppingBag className="h-4 w-4 text-blue-100" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">{services.length}</div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg bg-gradient-to-br from-green-500 to-green-600 text-white">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-green-100">Active Services</CardTitle>
              <ShoppingBag className="h-4 w-4 text-green-100" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">{activeServices}</div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg bg-gradient-to-br from-purple-500 to-purple-600 text-white">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-purple-100">Categories</CardTitle>
              <ShoppingBag className="h-4 w-4 text-purple-100" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">
                {new Set(services.map(s => s.category)).size}
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg bg-gradient-to-br from-emerald-500 to-emerald-600 text-white">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-emerald-100">Avg. Price</CardTitle>
              <DollarSign className="h-4 w-4 text-emerald-100" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">
                AWG {services.length > 0 ? (totalRevenue / services.length).toFixed(2) : '0.00'}
              </div>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <div className="flex justify-between items-center">
              <CardTitle className="flex items-center gap-2">
                <ShoppingBag className="h-5 w-5" />
                All Services ({filteredServices.length})
              </CardTitle>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Add Service
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Search services..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>

              {loading ? (
                <div className="text-center py-8">Loading services...</div>
              ) : (
                <div className="space-y-4">
                  {filteredServices.map((service) => (
                    <div key={service.id} className="flex items-center justify-between p-4 rounded-lg border bg-gradient-to-r from-blue-50 to-purple-50">
                      <div className="flex items-center space-x-4">
                        <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
                          <ShoppingBag className="h-6 w-6 text-white" />
                        </div>
                        <div>
                          <h3 className="font-semibold text-gray-900">{service.title}</h3>
                          <p className="text-sm text-gray-600">Category: {service.category}</p>
                          {service.description && (
                            <p className="text-sm text-gray-500 max-w-md truncate">{service.description}</p>
                          )}
                          <div className="flex items-center gap-4 text-sm text-gray-500 mt-1">
                            <span>AWG {Number(service.price).toLocaleString()}</span>
                            {service.duration_minutes && <span>{service.duration_minutes} min</span>}
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center space-x-3">
                        <Badge variant={service.is_active ? "default" : "destructive"}>
                          {service.is_active ? "Active" : "Inactive"}
                        </Badge>
                        <div className="flex gap-2">
                          <Button size="sm" variant="outline">
                            <Edit className="h-3 w-3" />
                          </Button>
                          <Button
                            size="sm"
                            variant={service.is_active ? "secondary" : "default"}
                            onClick={() => toggleServiceStatus(service.id, service.is_active)}
                          >
                            {service.is_active ? "Deactivate" : "Activate"}
                          </Button>
                          <Button size="sm" variant="destructive">
                            <Trash2 className="h-3 w-3" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
}
