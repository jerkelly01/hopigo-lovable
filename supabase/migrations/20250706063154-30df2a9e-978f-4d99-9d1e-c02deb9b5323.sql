
-- Create table for managing locations and service areas
CREATE TABLE public.locations (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  address TEXT NOT NULL,
  latitude DECIMAL(10,8),
  longitude DECIMAL(11,8),
  location_type TEXT NOT NULL DEFAULT 'service_area',
  is_active BOOLEAN NOT NULL DEFAULT true,
  coverage_radius DECIMAL(10,2), -- in kilometers
  service_categories TEXT[],
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create table for geographic boundaries/zones
CREATE TABLE public.service_zones (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  boundary_coordinates JSONB NOT NULL, -- GeoJSON polygon coordinates
  zone_type TEXT NOT NULL DEFAULT 'service_area',
  is_active BOOLEAN NOT NULL DEFAULT true,
  priority INTEGER DEFAULT 1,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Add RLS policies for locations
ALTER TABLE public.locations ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can manage all locations" 
  ON public.locations 
  FOR ALL 
  USING (
    auth.uid() IN (
      SELECT user_roles.user_id
      FROM user_roles
      JOIN roles ON user_roles.role_id = roles.id
      WHERE roles.name = 'admin'
    )
  );

CREATE POLICY "Anyone can view active locations" 
  ON public.locations 
  FOR SELECT 
  USING (is_active = true);

-- Add RLS policies for service zones
ALTER TABLE public.service_zones ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can manage all service zones" 
  ON public.service_zones 
  FOR ALL 
  USING (
    auth.uid() IN (
      SELECT user_roles.user_id
      FROM user_roles
      JOIN roles ON user_roles.role_id = roles.id
      WHERE roles.name = 'admin'
    )
  );

CREATE POLICY "Anyone can view active service zones" 
  ON public.service_zones 
  FOR SELECT 
  USING (is_active = true);

-- Create triggers for updated_at
CREATE TRIGGER update_locations_updated_at
  BEFORE UPDATE ON public.locations
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_service_zones_updated_at
  BEFORE UPDATE ON public.service_zones
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();
