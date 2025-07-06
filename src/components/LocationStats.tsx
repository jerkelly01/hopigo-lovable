import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { MapPin, Activity, Zap, Users } from 'lucide-react';
import type { Tables } from '@/integrations/supabase/types';

type Location = Tables<'locations'>;

interface LocationStatsProps {
  locations: Location[];
}

export const LocationStats: React.FC<LocationStatsProps> = ({ locations }) => {
  const totalLocations = locations.length;
  const activeLocations = locations.filter(loc => loc.is_active).length;
  const locationTypes = [...new Set(locations.map(loc => loc.location_type))];
  const serviceCategories = [...new Set(locations.flatMap(loc => loc.service_categories || []))];

  const locationTypeStats = locationTypes.map(type => ({
    type,
    count: locations.filter(loc => loc.location_type === type).length,
    active: locations.filter(loc => loc.location_type === type && loc.is_active).length
  }));

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Locations</CardTitle>
          <MapPin className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{totalLocations}</div>
          <p className="text-xs text-muted-foreground">
            {activeLocations} active, {totalLocations - activeLocations} inactive
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Active Rate</CardTitle>
          <Activity className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            {totalLocations > 0 ? Math.round((activeLocations / totalLocations) * 100) : 0}%
          </div>
          <p className="text-xs text-muted-foreground">
            {activeLocations} of {totalLocations} locations
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Location Types</CardTitle>
          <Zap className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{locationTypes.length}</div>
          <p className="text-xs text-muted-foreground">
            Different types configured
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Service Categories</CardTitle>
          <Users className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{serviceCategories.length}</div>
          <p className="text-xs text-muted-foreground">
            Categories available
          </p>
        </CardContent>
      </Card>

      {locationTypeStats.length > 0 && (
        <Card className="md:col-span-2 lg:col-span-4">
          <CardHeader>
            <CardTitle className="text-lg">Location Types Breakdown</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {locationTypeStats.map(stat => (
                <div key={stat.type} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div>
                    <p className="font-medium capitalize">{stat.type.replace('_', ' ')}</p>
                    <p className="text-sm text-gray-600">
                      {stat.active} active, {stat.count - stat.active} inactive
                    </p>
                  </div>
                  <Badge variant="outline" className="text-lg font-bold">
                    {stat.count}
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
