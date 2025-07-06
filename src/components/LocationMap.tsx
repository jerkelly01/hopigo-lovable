import React, { useEffect, useRef } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import type { Tables } from '@/integrations/supabase/types';

type Location = Tables<'locations'>;

interface LocationMapProps {
  locations: Location[];
  selectedLocation?: Location | null;
  onLocationSelect?: (location: Location) => void;
  onMapClick?: (lat: number, lng: number) => void;
}

export const LocationMap: React.FC<LocationMapProps> = ({
  locations,
  selectedLocation,
  onLocationSelect,
  onMapClick
}) => {
  const mapContainer = useRef<HTMLDivElement>(null);

  // For now, we'll show a placeholder map. In a real implementation, 
  // you would integrate with Mapbox or Google Maps
  useEffect(() => {
    if (!mapContainer.current) return;

    // This is where you would initialize your map
    console.log('Map would be initialized here with locations:', locations);
  }, [locations]);

  return (
    <Card className="h-[400px]">
      <CardContent className="p-0 h-full">
        <div 
          ref={mapContainer}
          className="w-full h-full bg-gradient-to-br from-blue-50 to-green-50 rounded-lg flex items-center justify-center relative overflow-hidden"
          onClick={(e) => {
            if (onMapClick) {
              // Mock coordinates for demonstration
              const rect = e.currentTarget.getBoundingClientRect();
              const x = (e.clientX - rect.left) / rect.width;
              const y = (e.clientY - rect.top) / rect.height;
              onMapClick(12.5 + (y - 0.5) * 0.1, -70 + (x - 0.5) * 0.1);
            }
          }}
        >
          <div className="text-center p-8">
            <div className="text-4xl mb-4">🗺️</div>
            <h3 className="text-lg font-semibold text-gray-700 mb-2">Interactive Map</h3>
            <p className="text-sm text-gray-500 mb-4">
              Click anywhere to add a new location
            </p>
            <div className="text-xs text-gray-400">
              {locations.length} location{locations.length !== 1 ? 's' : ''} loaded
            </div>
          </div>
          
          {/* Mock location markers */}
          {locations.map((location, index) => (
            <div
              key={location.id}
              className={`absolute w-6 h-6 bg-red-500 rounded-full border-2 border-white shadow-lg cursor-pointer transform -translate-x-1/2 -translate-y-1/2 ${
                selectedLocation?.id === location.id ? 'bg-blue-500 scale-125' : 'hover:scale-110'
              }`}
              style={{
                left: `${20 + (index * 15) % 60}%`,
                top: `${30 + (index * 20) % 40}%`
              }}
              onClick={(e) => {
                e.stopPropagation();
                onLocationSelect?.(location);
              }}
            >
              <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-black text-white text-xs px-2 py-1 rounded opacity-0 hover:opacity-100 transition-opacity whitespace-nowrap">
                {location.name}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};
