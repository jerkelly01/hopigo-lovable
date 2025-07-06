
-- Fix the infinite recursion issue in user_roles RLS policy
DROP POLICY IF EXISTS "User roles can be managed by admins" ON user_roles;

-- Create a security definer function to check admin role without recursion
CREATE OR REPLACE FUNCTION public.is_admin(user_uuid uuid)
RETURNS boolean
LANGUAGE sql
SECURITY DEFINER
STABLE
AS $$
  SELECT EXISTS (
    SELECT 1 
    FROM user_roles ur
    JOIN roles r ON ur.role_id = r.id
    WHERE ur.user_id = user_uuid 
    AND r.name = 'admin'
  );
$$;

-- Recreate the policy using the security definer function
CREATE POLICY "User roles can be managed by admins" 
ON user_roles 
FOR ALL 
TO authenticated
USING (is_admin(auth.uid()));

-- Insert sample data for roles if they don't exist
INSERT INTO roles (name, description) VALUES 
('admin', 'Full system administrator access'),
('user', 'Regular user access'),
('provider', 'Service provider access'),
('driver', 'Taxi driver access')
ON CONFLICT (name) DO NOTHING;

-- Insert sample users data
INSERT INTO users (id, email, full_name, name, user_type, is_verified, wallet_balance, loyalty_points) VALUES 
('11111111-1111-1111-1111-111111111111', 'admin@hopigo.com', 'Admin User', 'Admin', 'admin', true, 1000.00, 500),
('22222222-2222-2222-2222-222222222222', 'john.doe@example.com', 'John Doe', 'John', 'customer', true, 250.75, 120),
('33333333-3333-3333-3333-333333333333', 'jane.smith@example.com', 'Jane Smith', 'Jane', 'customer', true, 450.25, 200),
('44444444-4444-4444-4444-444444444444', 'provider@hopigo.com', 'Service Provider', 'Provider', 'provider', true, 750.00, 80),
('55555555-5555-5555-5555-555555555555', 'driver@hopigo.com', 'Taxi Driver', 'Driver', 'driver', true, 320.50, 50)
ON CONFLICT (id) DO NOTHING;

-- Insert sample loyalty programs
INSERT INTO loyalty_programs (name, description, reward_type, points_required, reward_value, is_active) VALUES 
('Welcome Bonus', 'Get 10 AWG credit for signing up', 'credit', 0, 10.00, true),
('Ride Master', 'Free ride after 10 completed rides', 'free_ride', 100, 25.00, true),
('Service Champion', 'Discount on services after 5 bookings', 'discount', 50, 15.00, true),
('Loyalty Gold', 'Premium membership benefits', 'premium', 500, 100.00, true),
('Refer Friend', 'Bonus for successful referrals', 'credit', 25, 20.00, true)
ON CONFLICT DO NOTHING;

-- Insert sample service providers
INSERT INTO service_providers (id, user_id, business_name, description, category, rating, total_earnings, total_bookings, is_verified, is_active) VALUES 
('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', '44444444-4444-4444-4444-444444444444', 'Clean Pro Services', 'Professional cleaning services', 'cleaning', 4.8, 2500.00, 45, true, true),
('bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', '44444444-4444-4444-4444-444444444444', 'Fix It Fast', 'Home repair and maintenance', 'repair', 4.6, 1800.00, 32, true, true)
ON CONFLICT (id) DO NOTHING;

-- Insert sample notifications
INSERT INTO notifications (user_id, title, message, type, is_read) VALUES 
('22222222-2222-2222-2222-222222222222', 'Welcome to HopiGo!', 'Thank you for joining our platform', 'welcome', false),
('22222222-2222-2222-2222-222222222222', 'Booking Confirmed', 'Your service booking has been confirmed', 'booking', true),
('33333333-3333-3333-3333-333333333333', 'Payment Received', 'Your payment of AWG 50 has been processed', 'payment', false),
('44444444-4444-4444-4444-444444444444', 'New Booking Request', 'You have a new service booking request', 'booking', false)
ON CONFLICT DO NOTHING;

-- Insert sample activities
INSERT INTO activities (user_id, type, title, description, metadata) VALUES 
('22222222-2222-2222-2222-222222222222', 'booking', 'Service Booked', 'Booked cleaning service', '{"service": "cleaning", "amount": 50}'),
('33333333-3333-3333-3333-333333333333', 'payment', 'Payment Made', 'Made payment for service', '{"amount": 75, "method": "wallet"}'),
('44444444-4444-4444-4444-444444444444', 'signup', 'Provider Joined', 'New service provider registered', '{"category": "cleaning"}'),
(NULL, 'system', 'Database Backup', 'Automated database backup completed', '{"size": "2.5MB"}')
ON CONFLICT DO NOTHING;

-- Assign roles to users
INSERT INTO user_roles (user_id, role_id) 
SELECT u.id, r.id 
FROM users u, roles r 
WHERE (u.email = 'admin@hopigo.com' AND r.name = 'admin')
OR (u.email = 'john.doe@example.com' AND r.name = 'user')
OR (u.email = 'jane.smith@example.com' AND r.name = 'user')
OR (u.email = 'provider@hopigo.com' AND r.name = 'provider')
OR (u.email = 'driver@hopigo.com' AND r.name = 'driver')
ON CONFLICT (user_id, role_id) DO NOTHING;
