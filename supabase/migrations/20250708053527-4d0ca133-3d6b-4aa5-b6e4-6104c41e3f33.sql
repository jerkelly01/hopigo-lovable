-- Create dashboard_events table for app integration
CREATE TABLE public.dashboard_events (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  app_id text NOT NULL,
  event_type text NOT NULL,
  event_data jsonb,
  user_id uuid,
  timestamp timestamp with time zone NOT NULL DEFAULT now(),
  processed boolean DEFAULT false,
  created_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.dashboard_events ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Admins can read all dashboard events" 
ON public.dashboard_events 
FOR SELECT 
USING (is_admin());

CREATE POLICY "System can create dashboard events" 
ON public.dashboard_events 
FOR INSERT 
WITH CHECK (true);

CREATE POLICY "Admins can update dashboard events" 
ON public.dashboard_events 
FOR UPDATE 
USING (is_admin());

-- Create dashboard_connections table for managing app connections
CREATE TABLE public.dashboard_connections (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  app_id text NOT NULL UNIQUE,
  app_name text NOT NULL,
  api_key text NOT NULL,
  webhook_url text,
  is_active boolean DEFAULT true,
  last_sync timestamp with time zone,
  sync_status text DEFAULT 'pending',
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.dashboard_connections ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Admins can manage dashboard connections" 
ON public.dashboard_connections 
FOR ALL 
USING (is_admin());

-- Create trigger for updated_at
CREATE TRIGGER update_dashboard_connections_updated_at
BEFORE UPDATE ON public.dashboard_connections
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();