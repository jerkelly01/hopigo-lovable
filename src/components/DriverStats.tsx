import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Car, Users, Star, DollarSign } from 'lucide-react';
import type { Tables } from '@/integrations/supabase/types';

type RideDriver = Tables<'ride_drivers'>;

interface DriverStatsProps {
  drivers: RideDriver[];
}

export const DriverStats: React.FC<DriverStatsProps> = ({ drivers }) => {
  const totalDrivers = drivers.length;
  const onlineDrivers = drivers.filter(d => d.is_online).length;
  const verifiedDrivers = drivers.filter(d => d.is_verified).length;
  const averageRating = drivers.length > 0 
    ? drivers.reduce((sum, d) => sum + (d.rating || 0), 0) / drivers.length 
    : 0;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Drivers</CardTitle>
          <Car className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{totalDrivers}</div>
          <p className="text-xs text-muted-foreground">
            Registered drivers
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Online Now</CardTitle>
          <Users className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{onlineDrivers}</div>
          <p className="text-xs text-muted-foreground">
            Currently available
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Verified</CardTitle>
          <Star className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{verifiedDrivers}</div>
          <p className="text-xs text-muted-foreground">
            {Math.round((verifiedDrivers / totalDrivers) * 100) || 0}% verified
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Avg Rating</CardTitle>
          <Star className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{averageRating.toFixed(1)}</div>
          <p className="text-xs text-muted-foreground">
            Overall rating
          </p>
        </CardContent>
      </Card>
    </div>
  );
};