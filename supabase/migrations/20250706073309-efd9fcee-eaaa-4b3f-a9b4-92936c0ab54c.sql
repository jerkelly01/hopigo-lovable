
-- Add missing columns and tables for full app functionality

-- Add missing columns to existing tables
ALTER TABLE users ADD COLUMN IF NOT EXISTS phone_verified BOOLEAN DEFAULT false;
ALTER TABLE users ADD COLUMN IF NOT EXISTS profile_completed BOOLEAN DEFAULT false;
ALTER TABLE users ADD COLUMN IF NOT EXISTS preferences JSONB DEFAULT '{}';

-- Create reviews table for service providers and drivers
CREATE TABLE IF NOT EXISTS reviews (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  reviewer_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  reviewee_id UUID NOT NULL, -- Can reference service_providers or ride_drivers
  reviewee_type TEXT NOT NULL CHECK (reviewee_type IN ('service_provider', 'driver')),
  booking_id UUID, -- Reference to service_bookings or ride_bookings
  rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
  comment TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Create categories table for better service organization
CREATE TABLE IF NOT EXISTS service_categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL UNIQUE,
  description TEXT,
  icon_name TEXT,
  is_active BOOLEAN DEFAULT true,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Create app settings table for configuration
CREATE TABLE IF NOT EXISTS app_settings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  key TEXT NOT NULL UNIQUE,
  value TEXT NOT NULL,
  description TEXT,
  category TEXT DEFAULT 'general',
  is_public BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Create support tickets table
CREATE TABLE IF NOT EXISTS support_tickets (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  subject TEXT NOT NULL,
  description TEXT NOT NULL,
  status TEXT DEFAULT 'open' CHECK (status IN ('open', 'in_progress', 'resolved', 'closed')),
  priority TEXT DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high', 'urgent')),
  category TEXT DEFAULT 'general',
  assigned_to UUID REFERENCES users(id),
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Create admin audit log
CREATE TABLE IF NOT EXISTS admin_audit_log (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  admin_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  action_type TEXT NOT NULL,
  table_name TEXT,
  record_id UUID,
  old_values JSONB,
  new_values JSONB,
  description TEXT,
  ip_address INET,
  user_agent TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Enable RLS on all new tables
ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE service_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE app_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE support_tickets ENABLE ROW LEVEL SECURITY;
ALTER TABLE admin_audit_log ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for reviews
CREATE POLICY "Users can read reviews" ON reviews FOR SELECT USING (true);
CREATE POLICY "Users can create reviews for their bookings" ON reviews FOR INSERT 
WITH CHECK (reviewer_id = auth.uid());
CREATE POLICY "Users can update their own reviews" ON reviews FOR UPDATE 
USING (reviewer_id = auth.uid());

-- Create RLS policies for service_categories
CREATE POLICY "Anyone can read active categories" ON service_categories FOR SELECT 
USING (is_active = true);
CREATE POLICY "Admins can manage categories" ON service_categories FOR ALL 
USING (is_admin(auth.uid()));

-- Create RLS policies for app_settings
CREATE POLICY "Anyone can read public settings" ON app_settings FOR SELECT 
USING (is_public = true);
CREATE POLICY "Admins can manage all settings" ON app_settings FOR ALL 
USING (is_admin(auth.uid()));

-- Create RLS policies for support_tickets
CREATE POLICY "Users can read their own tickets" ON support_tickets FOR SELECT 
USING (user_id = auth.uid() OR is_admin(auth.uid()));
CREATE POLICY "Users can create support tickets" ON support_tickets FOR INSERT 
WITH CHECK (user_id = auth.uid());
CREATE POLICY "Users can update their own tickets" ON support_tickets FOR UPDATE 
USING (user_id = auth.uid() OR is_admin(auth.uid()));

-- Create RLS policies for admin_audit_log
CREATE POLICY "Admins can read audit log" ON admin_audit_log FOR SELECT 
USING (is_admin(auth.uid()));
CREATE POLICY "System can create audit entries" ON admin_audit_log FOR INSERT 
WITH CHECK (true);

-- Insert default service categories
INSERT INTO service_categories (name, description, icon_name, sort_order) VALUES
('Cleaning', 'Home and office cleaning services', 'Sparkles', 1),
('Handyman', 'General repair and maintenance', 'Wrench', 2),
('Landscaping', 'Garden and lawn care services', 'Trees', 3),
('Beauty', 'Beauty and wellness services', 'Scissors', 4),
('Pet Care', 'Pet grooming and care services', 'Heart', 5),
('Tutoring', 'Educational and tutoring services', 'BookOpen', 6),
('Photography', 'Event and portrait photography', 'Camera', 7),
('Delivery', 'Package and food delivery services', 'Truck', 8)
ON CONFLICT (name) DO NOTHING;

-- Insert default app settings
INSERT INTO app_settings (key, value, description, category, is_public) VALUES
('app_name', 'HopiGo', 'Application name', 'branding', true),
('app_version', '1.0.0', 'Current app version', 'system', true),
('maintenance_mode', 'false', 'Enable maintenance mode', 'system', false),
('max_file_upload_size', '10485760', 'Maximum file upload size in bytes (10MB)', 'uploads', false),
('supported_file_types', 'jpg,jpeg,png,pdf,doc,docx', 'Supported file types for uploads', 'uploads', false),
('default_currency', 'AWG', 'Default currency for the platform', 'financial', true),
('min_wallet_balance', '0.00', 'Minimum wallet balance allowed', 'financial', false),
('max_transfer_amount', '1000.00', 'Maximum transfer amount per transaction', 'financial', false),
('loyalty_points_per_dollar', '1', 'Loyalty points earned per dollar spent', 'loyalty', false),
('referral_bonus_points', '100', 'Points awarded for successful referrals', 'loyalty', false)
ON CONFLICT (key) DO NOTHING;

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_reviews_reviewee ON reviews(reviewee_type, reviewee_id);
CREATE INDEX IF NOT EXISTS idx_reviews_rating ON reviews(rating);
CREATE INDEX IF NOT EXISTS idx_support_tickets_status ON support_tickets(status);
CREATE INDEX IF NOT EXISTS idx_support_tickets_user ON support_tickets(user_id);
CREATE INDEX IF NOT EXISTS idx_admin_audit_log_admin ON admin_audit_log(admin_id);
CREATE INDEX IF NOT EXISTS idx_admin_audit_log_created ON admin_audit_log(created_at);

-- Create triggers for updated_at columns
CREATE TRIGGER update_reviews_updated_at BEFORE UPDATE ON reviews 
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_support_tickets_updated_at BEFORE UPDATE ON support_tickets 
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_app_settings_updated_at BEFORE UPDATE ON app_settings 
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
