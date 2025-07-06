-- Fix RLS policy infinite recursion and security issues

-- Drop and recreate problematic user_roles policies to fix infinite recursion
DROP POLICY IF EXISTS "User roles can be managed by admins" ON user_roles;
DROP POLICY IF EXISTS "Users can view their own roles" ON user_roles;

-- Create a security definer function to check admin role safely
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 
    FROM user_roles ur
    JOIN roles r ON ur.role_id = r.id
    WHERE ur.user_id = auth.uid() AND r.name = 'admin'
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER STABLE;

-- Create safer RLS policies for user_roles
CREATE POLICY "Users can view their own roles" 
ON user_roles FOR SELECT 
USING (user_id = auth.uid());

CREATE POLICY "Admins can manage user roles" 
ON user_roles FOR ALL 
USING (public.is_admin());

-- Fix service_providers policies to be more secure
DROP POLICY IF EXISTS "Anyone can read service provider profiles" ON service_providers;
CREATE POLICY "Anyone can read active verified service providers" 
ON service_providers FOR SELECT 
USING (is_active = true AND is_verified = true);

CREATE POLICY "Admins can read all service providers" 
ON service_providers FOR SELECT 
USING (public.is_admin());

-- Fix ride_drivers policies
DROP POLICY IF EXISTS "Anyone can read driver profiles" ON ride_drivers;
CREATE POLICY "Anyone can read active verified drivers" 
ON ride_drivers FOR SELECT 
USING (is_active = true AND is_verified = true);

CREATE POLICY "Admins can read all drivers" 
ON ride_drivers FOR SELECT 
USING (public.is_admin());

-- Ensure RLS is enabled on all tables that should have it
ALTER TABLE activities ENABLE ROW LEVEL SECURITY;
ALTER TABLE advertisements ENABLE ROW LEVEL SECURITY;
ALTER TABLE bills ENABLE ROW LEVEL SECURITY;
ALTER TABLE donations ENABLE ROW LEVEL SECURITY;
ALTER TABLE events ENABLE ROW LEVEL SECURITY;
ALTER TABLE fuel_payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE loyalty_programs ENABLE ROW LEVEL SECURITY;
ALTER TABLE loyalty_transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE money_transfers ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE payments ENABLE ROW LEVEL SECURITY;