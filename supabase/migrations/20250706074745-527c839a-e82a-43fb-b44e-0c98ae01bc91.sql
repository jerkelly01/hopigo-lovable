
-- Create the service_categories table that the code expects
CREATE TABLE IF NOT EXISTS public.service_categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL UNIQUE,
  description TEXT,
  icon_name TEXT,
  is_active BOOLEAN DEFAULT true,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Enable RLS on the service_categories table
ALTER TABLE public.service_categories ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for service_categories
CREATE POLICY "Anyone can read active categories" ON public.service_categories 
FOR SELECT USING (is_active = true);

CREATE POLICY "Admins can manage categories" ON public.service_categories 
FOR ALL USING (
  auth.uid() IN (
    SELECT user_roles.user_id
    FROM user_roles
    JOIN roles ON user_roles.role_id = roles.id
    WHERE roles.name = 'admin'
  )
);

-- Insert default service categories
INSERT INTO public.service_categories (name, description, icon_name, sort_order) VALUES
('Cleaning', 'Home and office cleaning services', 'Sparkles', 1),
('Handyman', 'General repair and maintenance', 'Wrench', 2),
('Landscaping', 'Garden and lawn care services', 'Trees', 3),
('Beauty', 'Beauty and wellness services', 'Scissors', 4),
('Pet Care', 'Pet grooming and care services', 'Heart', 5),
('Tutoring', 'Educational and tutoring services', 'BookOpen', 6),
('Photography', 'Event and portrait photography', 'Camera', 7),
('Delivery', 'Package and food delivery services', 'Truck', 8)
ON CONFLICT (name) DO NOTHING;

-- Create trigger for updated_at
CREATE TRIGGER update_service_categories_updated_at
  BEFORE UPDATE ON public.service_categories
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();
