import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { X } from 'lucide-react';
import type { Tables } from '@/integrations/supabase/types';

type Location = Tables<'locations'>;

interface LocationFormProps {
  location?: Location | null;
  onSave: (location: Omit<Location, 'id' | 'created_at' | 'updated_at'>) => void;
  onCancel: () => void;
  isLoading?: boolean;
}

const LOCATION_TYPES = [
  { value: 'service_area', label: 'Service Area' },
  { value: 'pickup_point', label: 'Pickup Point' },
  { value: 'delivery_zone', label: 'Delivery Zone' },
  { value: 'branch_office', label: 'Branch Office' },
  { value: 'warehouse', label: 'Warehouse' }
];

const SERVICE_CATEGORIES = [
  'Transportation', 'Food Delivery', 'Home Services', 'Healthcare',
  'Beauty & Wellness', 'Maintenance', 'Professional Services', 'Emergency'
];

export const LocationForm: React.FC<LocationFormProps> = ({
  location,
  onSave,
  onCancel,
  isLoading = false
}) => {
  const [formData, setFormData] = useState<Omit<Location, 'id' | 'created_at' | 'updated_at'>>({
    name: '',
    address: '',
    latitude: null,
    longitude: null,
    location_type: 'service_area',
    is_active: true,
    coverage_radius: null,
    service_categories: [],
    notes: null
  });

  const [newCategory, setNewCategory] = useState('');

  useEffect(() => {
    if (location) {
      setFormData({
        name: location.name,
        address: location.address,
        latitude: location.latitude,
        longitude: location.longitude,
        location_type: location.location_type,
        is_active: location.is_active,
        coverage_radius: location.coverage_radius,
        service_categories: location.service_categories || [],
        notes: location.notes
      });
    }
  }, [location]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  const addServiceCategory = (category: string) => {
    if (category && !formData.service_categories.includes(category)) {
      setFormData(prev => ({
        ...prev,
        service_categories: [...prev.service_categories, category]
      }));
    }
    setNewCategory('');
  };

  const removeServiceCategory = (category: string) => {
    setFormData(prev => ({
      ...prev,
      service_categories: prev.service_categories.filter(c => c !== category)
    }));
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>{location ? 'Edit Location' : 'Add New Location'}</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">Location Name</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                placeholder="Enter location name"
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="location_type">Location Type</Label>
              <Select
                value={formData.location_type}
                onValueChange={(value) => setFormData(prev => ({ ...prev, location_type: value }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select location type" />
                </SelectTrigger>
                <SelectContent>
                  {LOCATION_TYPES.map(type => (
                    <SelectItem key={type.value} value={type.value}>
                      {type.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="address">Address</Label>
            <Textarea
              id="address"
              value={formData.address}
              onChange={(e) => setFormData(prev => ({ ...prev, address: e.target.value }))}
              placeholder="Enter full address"
              required
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="latitude">Latitude</Label>
              <Input
                id="latitude"
                type="number"
                step="any"
                value={formData.latitude || ''}
                onChange={(e) => setFormData(prev => ({ 
                  ...prev, 
                  latitude: e.target.value ? parseFloat(e.target.value) : null 
                }))}
                placeholder="12.5084"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="longitude">Longitude</Label>
              <Input
                id="longitude"
                type="number"
                step="any"
                value={formData.longitude || ''}
                onChange={(e) => setFormData(prev => ({ 
                  ...prev, 
                  longitude: e.target.value ? parseFloat(e.target.value) : null 
                }))}
                placeholder="-70.0187"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="coverage_radius">Coverage Radius (km)</Label>
              <Input
                id="coverage_radius"
                type="number"
                step="0.1"
                value={formData.coverage_radius || ''}
                onChange={(e) => setFormData(prev => ({ 
                  ...prev, 
                  coverage_radius: e.target.value ? parseFloat(e.target.value) : null 
                }))}
                placeholder="5.0"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label>Service Categories</Label>
            <div className="flex flex-wrap gap-2 mb-2">
              {formData.service_categories.map(category => (
                <Badge key={category} variant="secondary" className="flex items-center gap-1">
                  {category}
                  <X 
                    className="h-3 w-3 cursor-pointer" 
                    onClick={() => removeServiceCategory(category)}
                  />
                </Badge>
              ))}
            </div>
            <div className="flex gap-2">
              <Select value={newCategory} onValueChange={setNewCategory}>
                <SelectTrigger className="flex-1">
                  <SelectValue placeholder="Add service category" />
                </SelectTrigger>
                <SelectContent>
                  {SERVICE_CATEGORIES.filter(cat => !formData.service_categories.includes(cat)).map(category => (
                    <SelectItem key={category} value={category}>
                      {category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Button 
                type="button" 
                variant="outline"
                onClick={() => addServiceCategory(newCategory)}
                disabled={!newCategory}
              >
                Add
              </Button>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="notes">Notes</Label>
            <Textarea
              id="notes"
              value={formData.notes || ''}
              onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value || null }))}
              placeholder="Additional notes or instructions"
            />
          </div>

          <div className="flex items-center space-x-2">
            <Switch
              id="is_active"
              checked={formData.is_active}
              onCheckedChange={(checked) => setFormData(prev => ({ ...prev, is_active: checked }))}
            />
            <Label htmlFor="is_active">Active Location</Label>
          </div>

          <div className="flex justify-end space-x-2 pt-4">
            <Button type="button" variant="outline" onClick={onCancel}>
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? 'Saving...' : (location ? 'Update' : 'Create')} Location
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};
