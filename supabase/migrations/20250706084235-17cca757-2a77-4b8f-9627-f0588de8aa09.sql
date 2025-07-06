-- Fix the last remaining Multiple Permissive Policies warnings
-- Remove separate SELECT policies where ALL policies already exist

-- 1. Fix services table - consolidate SELECT and ALL policies
DROP POLICY IF EXISTS "Service access policy" ON public.services;
DROP POLICY IF EXISTS "Service management policy" ON public.services;

-- Create a single ALL policy that handles both public reading and provider management
CREATE POLICY "Service comprehensive policy" 
ON public.services 
FOR ALL 
USING (
  -- Public can read active services
  (is_active = true)
  OR 
  -- Service providers can manage their own services
  (provider_id IN ( 
    SELECT service_providers.id
    FROM service_providers
    WHERE (service_providers.user_id = (SELECT auth.uid()))
  ))
)
WITH CHECK (
  -- Only providers can create/update their own services
  provider_id IN ( 
    SELECT service_providers.id
    FROM service_providers
    WHERE (service_providers.user_id = (SELECT auth.uid()))
  )
);

-- 2. Fix user_roles table - consolidate SELECT and ALL policies
DROP POLICY IF EXISTS "User role access policy" ON public.user_roles;
DROP POLICY IF EXISTS "User role management policy" ON public.user_roles;

-- Create a single ALL policy that handles both user viewing and admin management
CREATE POLICY "User role comprehensive policy" 
ON public.user_roles 
FOR ALL 
USING (
  -- Users can view their own roles
  (user_id = (SELECT auth.uid())) 
  OR 
  -- Admins can view and manage all roles
  (is_admin())
)
WITH CHECK (
  -- Only admins can create/update/delete user roles
  is_admin()
);