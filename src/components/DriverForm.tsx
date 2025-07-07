import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import type { Tables } from '@/integrations/supabase/types';

type RideDriver = Tables<'ride_drivers'>;

interface DriverFormProps {
  driver?: RideDriver | null;
  onSave: (driver: Omit<RideDriver, 'id' | 'created_at' | 'updated_at'>) => void;
  onCancel: () => void;
  isLoading?: boolean;
}

const VEHICLE_TYPES = [
  { value: 'sedan', label: 'Sedan' },
  { value: 'suv', label: 'SUV' },
  { value: 'hatchback', label: 'Hatchback' },
  { value: 'pickup', label: 'Pickup Truck' },
  { value: 'van', label: 'Van' }
];

export const DriverForm: React.FC<DriverFormProps> = ({
  driver,
  onSave,
  onCancel,
  isLoading = false
}) => {
  const [formData, setFormData] = useState<Omit<RideDriver, 'id' | 'created_at' | 'updated_at'>>({
    user_id: '',
    vehicle_type: 'sedan',
    vehicle_model: '',
    license_plate: '',
    rating: 0,
    total_rides: 0,
    is_online: false,
    is_verified: false,
    is_active: true
  });

  useEffect(() => {
    if (driver) {
      setFormData({
        user_id: driver.user_id,
        vehicle_type: driver.vehicle_type,
        vehicle_model: driver.vehicle_model,
        license_plate: driver.license_plate,
        rating: driver.rating || 0,
        total_rides: driver.total_rides || 0,
        is_online: driver.is_online || false,
        is_verified: driver.is_verified || false,
        is_active: driver.is_active || true
      });
    }
  }, [driver]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>{driver ? 'Edit Driver' : 'Add New Driver'}</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="user_id">User ID</Label>
              <Input
                id="user_id"
                value={formData.user_id}
                onChange={(e) => setFormData(prev => ({ ...prev, user_id: e.target.value }))}
                placeholder="Enter user ID"
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="vehicle_type">Vehicle Type</Label>
              <Select
                value={formData.vehicle_type}
                onValueChange={(value) => setFormData(prev => ({ ...prev, vehicle_type: value }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select vehicle type" />
                </SelectTrigger>
                <SelectContent>
                  {VEHICLE_TYPES.map(type => (
                    <SelectItem key={type.value} value={type.value}>
                      {type.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="vehicle_model">Vehicle Model</Label>
              <Input
                id="vehicle_model"
                value={formData.vehicle_model}
                onChange={(e) => setFormData(prev => ({ ...prev, vehicle_model: e.target.value }))}
                placeholder="e.g., Toyota Camry 2020"
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="license_plate">License Plate</Label>
              <Input
                id="license_plate"
                value={formData.license_plate}
                onChange={(e) => setFormData(prev => ({ ...prev, license_plate: e.target.value }))}
                placeholder="e.g., ABC-123"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="rating">Rating</Label>
              <Input
                id="rating"
                type="number"
                step="0.1"
                min="0"
                max="5"
                value={formData.rating || ''}
                onChange={(e) => setFormData(prev => ({ 
                  ...prev, 
                  rating: e.target.value ? parseFloat(e.target.value) : null 
                }))}
                placeholder="4.5"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="total_rides">Total Rides</Label>
              <Input
                id="total_rides"
                type="number"
                min="0"
                value={formData.total_rides || ''}
                onChange={(e) => setFormData(prev => ({ 
                  ...prev, 
                  total_rides: e.target.value ? parseInt(e.target.value) : null 
                }))}
                placeholder="150"
              />
            </div>
            
          </div>

          <div className="flex flex-wrap gap-6">
            <div className="flex items-center space-x-2">
              <Switch
                id="is_online"
                checked={formData.is_online || false}
                onCheckedChange={(checked) => setFormData(prev => ({ ...prev, is_online: checked }))}
              />
              <Label htmlFor="is_online">Currently Online</Label>
            </div>

            <div className="flex items-center space-x-2">
              <Switch
                id="is_verified"
                checked={formData.is_verified || false}
                onCheckedChange={(checked) => setFormData(prev => ({ ...prev, is_verified: checked }))}
              />
              <Label htmlFor="is_verified">Verified Driver</Label>
            </div>

            <div className="flex items-center space-x-2">
              <Switch
                id="is_active"
                checked={formData.is_active || false}
                onCheckedChange={(checked) => setFormData(prev => ({ ...prev, is_active: checked }))}
              />
              <Label htmlFor="is_active">Active Driver</Label>
            </div>
          </div>

          <div className="flex justify-end space-x-2 pt-4">
            <Button type="button" variant="outline" onClick={onCancel}>
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? 'Saving...' : (driver ? 'Update' : 'Create')} Driver
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};