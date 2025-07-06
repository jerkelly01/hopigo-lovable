-- Fix remaining Multiple Permissive Policies warnings by consolidating policies

-- 1. Fix ride_drivers table policies (consolidate multiple permissive SELECT policies)
DROP POLICY IF EXISTS "Admins can read all drivers" ON public.ride_drivers;
DROP POLICY IF EXISTS "Anyone can read active verified drivers" ON public.ride_drivers;
DROP POLICY IF EXISTS "Drivers can read their own data" ON public.ride_drivers;

CREATE POLICY "Driver access policy" 
ON public.ride_drivers 
FOR SELECT 
USING (
  -- Anyone can read active verified drivers
  ((is_active = true) AND (is_verified = true))
  OR 
  -- Drivers can read their own data
  (user_id = (SELECT auth.uid()))
  OR 
  -- Admins can read all drivers
  (is_admin())
);

-- 2. Fix service_providers table policies (consolidate multiple permissive SELECT policies) 
DROP POLICY IF EXISTS "Admins can read all service providers" ON public.service_providers;
DROP POLICY IF EXISTS "Anyone can read active verified service providers" ON public.service_providers;
DROP POLICY IF EXISTS "Service providers can read their own data" ON public.service_providers;

CREATE POLICY "Service provider access policy" 
ON public.service_providers 
FOR SELECT 
USING (
  -- Anyone can read active verified service providers
  ((is_active = true) AND (is_verified = true))
  OR 
  -- Service providers can read their own data
  (user_id = (SELECT auth.uid()))
  OR 
  -- Admins can read all service providers
  (is_admin())
);