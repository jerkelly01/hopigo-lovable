import React, { useState, useEffect } from 'react';
import { AdminLayout } from '@/components/AdminLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
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
import { LocationMap } from '@/components/LocationMap';
import { LocationForm } from '@/components/LocationForm';
import { LocationStats } from '@/components/LocationStats';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { MapPin, Plus, Search, Edit, Trash2, Eye } from 'lucide-react';
import type { Tables } from '@/integrations/supabase/types';

type Location = Tables<'locations'>;

export default function LocationsPage() {
  const [locations, setLocations] = useState<Location[]>([]);
  const [filteredLocations, setFilteredLocations] = useState<Location[]>([]);
  const [selectedLocation, setSelectedLocation] = useState<Location | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [editingLocation, setEditingLocation] = useState<Location | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    fetchLocations();
  }, []);

  useEffect(() => {
    const filtered = locations.filter(location =>
      location.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      location.address.toLowerCase().includes(searchTerm.toLowerCase()) ||
      location.location_type.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredLocations(filtered);
  }, [locations, searchTerm]);

  const fetchLocations = async () => {
    try {
      const { data, error } = await supabase
        .from('locations')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setLocations(data || []);
    } catch (error) {
      console.error('Error fetching locations:', error);
      toast({
        title: 'Error',
        description: 'Failed to fetch locations',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSaveLocation = async (locationData: Omit<Location, 'id' | 'created_at' | 'updated_at'>) => {
    setSaving(true);
    try {
      if (editingLocation) {
        const { error } = await supabase
          .from('locations')
          .update(locationData)
          .eq('id', editingLocation.id);

        if (error) throw error;
        toast({
          title: 'Success',
          description: 'Location updated successfully',
        });
      } else {
        const { error } = await supabase
          .from('locations')
          .insert([locationData]);

        if (error) throw error;
        toast({
          title: 'Success',
          description: 'Location created successfully',
        });
      }

      await fetchLocations();
      setShowForm(false);
      setEditingLocation(null);
    } catch (error) {
      console.error('Error saving location:', error);
      toast({
        title: 'Error',
        description: 'Failed to save location',
        variant: 'destructive',
      });
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteLocation = async (locationId: string) => {
    if (!confirm('Are you sure you want to delete this location?')) return;

    try {
      const { error } = await supabase
        .from('locations')
        .delete()
        .eq('id', locationId);

      if (error) throw error;
      
      toast({
        title: 'Success',
        description: 'Location deleted successfully',
      });
      
      await fetchLocations();
    } catch (error) {
      console.error('Error deleting location:', error);
      toast({
        title: 'Error',
        description: 'Failed to delete location',
        variant: 'destructive',
      });
    }
  };

  const handleToggleStatus = async (location: Location) => {
    try {
      const { error } = await supabase
        .from('locations')
        .update({ is_active: !location.is_active })
        .eq('id', location.id);

      if (error) throw error;
      
      toast({
        title: 'Success',
        description: `Location ${!location.is_active ? 'activated' : 'deactivated'} successfully`,
      });
      
      await fetchLocations();
    } catch (error) {
      console.error('Error updating location status:', error);
      toast({
        title: 'Error',
        description: 'Failed to update location status',
        variant: 'destructive',
      });
    }
  };

  const handleMapClick = (lat: number, lng: number) => {
    setEditingLocation(null);
    setShowForm(true);
    // You could pre-fill coordinates here if needed
  };

  if (loading) {
    return (
      <AdminLayout title="Location Management" description="Manage locations and service areas">
        <div className="flex items-center justify-center h-64">
          <div className="text-lg">Loading locations...</div>
        </div>
      </AdminLayout>
    );
  }

  if (showForm) {
    return (
      <AdminLayout title="Location Management" description="Manage locations and service areas">
        <LocationForm
          location={editingLocation}
          onSave={handleSaveLocation}
          onCancel={() => {
            setShowForm(false);
            setEditingLocation(null);
          }}
          isLoading={saving}
        />
      </AdminLayout>
    );
  }

  return (
    <AdminLayout title="Location Management" description="Manage locations and service areas">
      <div className="space-y-6">
        <LocationStats locations={locations} />
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <LocationMap
            locations={filteredLocations}
            selectedLocation={selectedLocation}
            onLocationSelect={setSelectedLocation}
            onMapClick={handleMapClick}
          />
          
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span className="flex items-center gap-2">
                  <MapPin className="h-5 w-5" />
                  Locations ({filteredLocations.length})
                </span>
                <Button onClick={() => setShowForm(true)} size="sm">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Location
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <Input
                    placeholder="Search locations..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
                
                <div className="max-h-96 overflow-y-auto">
                  {filteredLocations.length === 0 ? (
                    <div className="text-center py-8 text-gray-500">
                      No locations found. Click "Add Location" to create your first location.
                    </div>
                  ) : (
                    <div className="space-y-2">
                      {filteredLocations.map((location) => (
                        <div
                          key={location.id}
                          className={`p-3 border rounded-lg cursor-pointer transition-colors ${
                            selectedLocation?.id === location.id
                              ? 'border-blue-500 bg-blue-50'
                              : 'border-gray-200 hover:border-gray-300'
                          }`}
                          onClick={() => setSelectedLocation(location)}
                        >
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-1">
                                <h4 className="font-medium">{location.name}</h4>
                                <Badge variant={location.is_active ? 'default' : 'secondary'}>
                                  {location.is_active ? 'Active' : 'Inactive'}
                                </Badge>
                              </div>
                              <p className="text-sm text-gray-600 mb-2">{location.address}</p>
                              <div className="flex flex-wrap gap-1">
                                {location.service_categories?.slice(0, 2).map(category => (
                                  <Badge key={category} variant="outline" className="text-xs">
                                    {category}
                                  </Badge>
                                ))}
                                {(location.service_categories?.length || 0) > 2 && (
                                  <Badge variant="outline" className="text-xs">
                                    +{(location.service_categories?.length || 0) - 2} more
                                  </Badge>
                                )}
                              </div>
                            </div>
                            <div className="flex gap-1 ml-2">
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setEditingLocation(location);
                                  setShowForm(true);
                                }}
                              >
                                <Edit className="h-3 w-3" />
                              </Button>
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleToggleStatus(location);
                                }}
                              >
                                {location.is_active ? 'Deactivate' : 'Activate'}
                              </Button>
                              <Button
                                size="sm"
                                variant="destructive"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleDeleteLocation(location.id);
                                }}
                              >
                                <Trash2 className="h-3 w-3" />
                              </Button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {selectedLocation && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Eye className="h-5 w-5" />
                Location Details
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <div>
                  <Label className="font-medium">Name</Label>
                  <p className="text-sm text-gray-600">{selectedLocation.name}</p>
                </div>
                <div>
                  <Label className="font-medium">Type</Label>
                  <p className="text-sm text-gray-600 capitalize">
                    {selectedLocation.location_type.replace('_', ' ')}
                  </p>
                </div>
                <div>
                  <Label className="font-medium">Status</Label>
                  <Badge variant={selectedLocation.is_active ? 'default' : 'secondary'}>
                    {selectedLocation.is_active ? 'Active' : 'Inactive'}
                  </Badge>
                </div>
                <div className="md:col-span-2 lg:col-span-3">
                  <Label className="font-medium">Address</Label>
                  <p className="text-sm text-gray-600">{selectedLocation.address}</p>
                </div>
                <div>
                  <Label className="font-medium">Coordinates</Label>
                  <p className="text-sm text-gray-600">
                    {selectedLocation.latitude?.toFixed(6)}, {selectedLocation.longitude?.toFixed(6)}
                  </p>
                </div>
                <div>
                  <Label className="font-medium">Coverage Radius</Label>
                  <p className="text-sm text-gray-600">
                    {selectedLocation.coverage_radius ? `${selectedLocation.coverage_radius} km` : 'Not set'}
                  </p>
                </div>
                <div>
                  <Label className="font-medium">Created</Label>
                  <p className="text-sm text-gray-600">
                    {new Date(selectedLocation.created_at).toLocaleDateString()}
                  </p>
                </div>
                {selectedLocation.service_categories && selectedLocation.service_categories.length > 0 && (
                  <div className="md:col-span-2 lg:col-span-3">
                    <Label className="font-medium">Service Categories</Label>
                    <div className="flex flex-wrap gap-2 mt-1">
                      {selectedLocation.service_categories.map(category => (
                        <Badge key={category} variant="outline">
                          {category}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
                {selectedLocation.notes && (
                  <div className="md:col-span-2 lg:col-span-3">
                    <Label className="font-medium">Notes</Label>
                    <p className="text-sm text-gray-600">{selectedLocation.notes}</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </AdminLayout>
  );
}

const Label: React.FC<{ children: React.ReactNode; className?: string }> = ({ children, className = '' }) => (
  <label className={`block text-sm font-medium text-gray-700 mb-1 ${className}`}>{children}</label>
);
