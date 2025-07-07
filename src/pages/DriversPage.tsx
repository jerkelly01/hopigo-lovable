
import React, { useState, useEffect } from 'react';
import { AdminLayout } from '@/components/AdminLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { DriverStats } from '@/components/DriverStats';
import { DriverForm } from '@/components/DriverForm';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Car, Star, DollarSign, Users, Plus, Search, Edit, Trash2 } from 'lucide-react';
import type { Tables } from '@/integrations/supabase/types';

type RideDriver = Tables<'ride_drivers'>;

export default function DriversPage() {
  const [drivers, setDrivers] = useState<RideDriver[]>([]);
  const [filteredDrivers, setFilteredDrivers] = useState<RideDriver[]>([]);
  const [selectedDriver, setSelectedDriver] = useState<RideDriver | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [editingDriver, setEditingDriver] = useState<RideDriver | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    fetchDrivers();
  }, []);

  useEffect(() => {
    const filtered = drivers.filter(driver =>
      driver.vehicle_model.toLowerCase().includes(searchTerm.toLowerCase()) ||
      driver.license_plate.toLowerCase().includes(searchTerm.toLowerCase()) ||
      driver.vehicle_type.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredDrivers(filtered);
  }, [drivers, searchTerm]);

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
      toast({
        title: 'Error',
        description: 'Failed to fetch drivers',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSaveDriver = async (driverData: Omit<RideDriver, 'id' | 'created_at' | 'updated_at'>) => {
    setSaving(true);
    try {
      if (editingDriver) {
        const { error } = await supabase
          .from('ride_drivers')
          .update(driverData)
          .eq('id', editingDriver.id);

        if (error) throw error;
        toast({
          title: 'Success',
          description: 'Driver updated successfully',
        });
      } else {
        const { error } = await supabase
          .from('ride_drivers')
          .insert([driverData]);

        if (error) throw error;
        toast({
          title: 'Success',
          description: 'Driver created successfully',
        });
      }

      await fetchDrivers();
      setShowForm(false);
      setEditingDriver(null);
    } catch (error) {
      console.error('Error saving driver:', error);
      toast({
        title: 'Error',
        description: 'Failed to save driver',
        variant: 'destructive',
      });
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteDriver = async (driverId: string) => {
    if (!confirm('Are you sure you want to delete this driver?')) return;

    try {
      const { error } = await supabase
        .from('ride_drivers')
        .delete()
        .eq('id', driverId);

      if (error) throw error;
      
      toast({
        title: 'Success',
        description: 'Driver deleted successfully',
      });
      
      await fetchDrivers();
    } catch (error) {
      console.error('Error deleting driver:', error);
      toast({
        title: 'Error',
        description: 'Failed to delete driver',
        variant: 'destructive',
      });
    }
  };

  const toggleVerification = async (driverId: string, currentStatus: boolean | null) => {
    try {
      const { error } = await supabase
        .from('ride_drivers')
        .update({ is_verified: !currentStatus })
        .eq('id', driverId);

      if (error) throw error;
      
      toast({
        title: 'Success',
        description: `Driver ${!currentStatus ? 'verified' : 'unverified'} successfully`,
      });
      
      await fetchDrivers();
    } catch (error) {
      console.error('Error updating verification:', error);
      toast({
        title: 'Error',
        description: 'Failed to update verification status',
        variant: 'destructive',
      });
    }
  };

  if (loading) {
    return (
      <AdminLayout title="Driver Management" description="Manage taxi drivers and their vehicles">
        <div className="flex items-center justify-center h-64">
          <div className="text-lg">Loading drivers...</div>
        </div>
      </AdminLayout>
    );
  }

  if (showForm) {
    return (
      <AdminLayout title="Driver Management" description="Manage taxi drivers and their vehicles">
        <DriverForm
          driver={editingDriver}
          onSave={handleSaveDriver}
          onCancel={() => {
            setShowForm(false);
            setEditingDriver(null);
          }}
          isLoading={saving}
        />
      </AdminLayout>
    );
  }

  return (
    <AdminLayout title="Driver Management" description="Manage taxi drivers and their vehicles">
      <div className="space-y-6">
        <DriverStats drivers={drivers} />
        
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span className="flex items-center gap-2">
                <Car className="h-5 w-5" />
                Drivers ({filteredDrivers.length})
              </span>
              <Button onClick={() => setShowForm(true)} size="sm">
                <Plus className="h-4 w-4 mr-2" />
                Add Driver
              </Button>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Search drivers..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              
              {filteredDrivers.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  No drivers found. Click "Add Driver" to create your first driver profile.
                </div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Vehicle</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>Rating</TableHead>
                      <TableHead>Rides</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredDrivers.map((driver) => (
                      <TableRow key={driver.id}>
                        <TableCell>
                          <div>
                            <div className="font-medium">{driver.vehicle_model}</div>
                            <div className="text-sm text-gray-500">{driver.license_plate}</div>
                          </div>
                        </TableCell>
                        <TableCell className="capitalize">{driver.vehicle_type}</TableCell>
                        <TableCell>
                          <div className="flex items-center gap-1">
                            <Star className="h-3 w-3 text-yellow-400" />
                            {driver.rating?.toFixed(1) || '0.0'}
                          </div>
                        </TableCell>
                        <TableCell>{driver.total_rides || 0}</TableCell>
                        <TableCell>
                          <div className="flex flex-col gap-1">
                            <Badge variant={driver.is_online ? "default" : "secondary"} className="text-xs">
                              {driver.is_online ? "Online" : "Offline"}
                            </Badge>
                            <Badge variant={driver.is_verified ? "default" : "destructive"} className="text-xs">
                              {driver.is_verified ? "Verified" : "Unverified"}
                            </Badge>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex gap-1">
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => {
                                setEditingDriver(driver);
                                setShowForm(true);
                              }}
                            >
                              <Edit className="h-3 w-3" />
                            </Button>
                            <Button
                              size="sm"
                              variant={driver.is_verified ? "destructive" : "default"}
                              onClick={() => toggleVerification(driver.id, driver.is_verified)}
                            >
                              {driver.is_verified ? "Unverify" : "Verify"}
                            </Button>
                            <Button
                              size="sm"
                              variant="destructive"
                              onClick={() => handleDeleteDriver(driver.id)}
                            >
                              <Trash2 className="h-3 w-3" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
}
