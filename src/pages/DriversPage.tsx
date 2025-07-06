
import React, { useState, useEffect } from 'react';
import { AdminLayout } from '@/components/AdminLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { supabase } from '@/integrations/supabase/client';
import { Car, Star, DollarSign, Users } from 'lucide-react';

interface RideDriver {
  id: string;
  user_id: string;
  vehicle_type: string;
  vehicle_model: string;
  license_plate: string;
  rating: number | null;
  total_rides: number | null;
  total_earnings: number | null;
  is_online: boolean | null;
  is_verified: boolean | null;
  is_active: boolean | null;
  created_at: string | null;
}

export default function DriversPage() {
  const [drivers, setDrivers] = useState<RideDriver[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDrivers();
  }, []);

  const fetchDrivers = async () => {
    try {
      const { data, error } = await supabase
        .from('ride_drivers')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setDrivers(data || []);
    } catch (error) {
      console.error('Error fetching drivers:', error);
    } finally {
      setLoading(false);
    }
  };

  const toggleVerification = async (driverId: string, currentStatus: boolean | null) => {
    try {
      const { error } = await supabase
        .from('ride_drivers')
        .update({ is_verified: !currentStatus })
        .eq('id', driverId);

      if (error) throw error;
      fetchDrivers();
    } catch (error) {
      console.error('Error updating verification:', error);
    }
  };

  return (
    <AdminLayout 
      title="Taxi Drivers" 
      description="Manage taxi drivers, their vehicles, and verification status"
    >
      <div className="space-y-6">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card className="border-0 shadow-lg bg-gradient-to-br from-indigo-500 to-indigo-600 text-white">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-indigo-100">Total Drivers</CardTitle>
              <Car className="h-4 w-4 text-indigo-100" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">{drivers.length}</div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg bg-gradient-to-br from-green-500 to-green-600 text-white">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-green-100">Online Now</CardTitle>
              <Users className="h-4 w-4 text-green-100" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">
                {drivers.filter(d => d.is_online).length}
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg bg-gradient-to-br from-purple-500 to-purple-600 text-white">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-purple-100">Verified</CardTitle>
              <Star className="h-4 w-4 text-purple-100" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">
                {drivers.filter(d => d.is_verified).length}
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
                AWG {drivers.reduce((sum, d) => sum + (d.total_earnings || 0), 0).toLocaleString()}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Drivers List */}
        <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="text-gray-900">All Taxi Drivers</CardTitle>
            <CardDescription>Manage driver accounts and verification</CardDescription>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="text-center py-8">Loading drivers...</div>
            ) : (
              <div className="space-y-4">
                {drivers.map((driver) => (
                  <div key={driver.id} className="flex items-center justify-between p-4 rounded-lg border bg-gradient-to-r from-indigo-50 to-purple-50">
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full flex items-center justify-center">
                        <Car className="h-6 w-6 text-white" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900">
                          {driver.vehicle_model} - {driver.license_plate}
                        </h3>
                        <p className="text-sm text-gray-600">Type: {driver.vehicle_type}</p>
                        <div className="flex items-center gap-4 text-sm text-gray-500 mt-1">
                          <div className="flex items-center gap-1">
                            <Star className="h-3 w-3" />
                            {driver.rating?.toFixed(1) || '0.0'}
                          </div>
                          <div className="flex items-center gap-1">
                            <Users className="h-3 w-3" />
                            {driver.total_rides || 0} rides
                          </div>
                          <div className="flex items-center gap-1">
                            <DollarSign className="h-3 w-3" />
                            AWG {driver.total_earnings || 0}
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3">
                      <div className="flex flex-col gap-2">
                        <Badge variant={driver.is_online ? "default" : "secondary"}>
                          {driver.is_online ? "Online" : "Offline"}
                        </Badge>
                        <Badge variant={driver.is_verified ? "default" : "destructive"}>
                          {driver.is_verified ? "Verified" : "Unverified"}
                        </Badge>
                      </div>
                      <Button
                        size="sm"
                        variant={driver.is_verified ? "destructive" : "default"}
                        onClick={() => toggleVerification(driver.id, driver.is_verified)}
                      >
                        {driver.is_verified ? "Unverify" : "Verify"}
                      </Button>
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
