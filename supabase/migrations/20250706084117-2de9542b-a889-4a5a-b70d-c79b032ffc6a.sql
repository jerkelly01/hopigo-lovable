-- Fix Multiple Permissive Policies by properly consolidating all conflicting policies
-- Remove duplicate SELECT policies where ALL policies already exist

-- 1. Fix locations table - remove separate SELECT policy since ALL policy covers it
DROP POLICY IF EXISTS "Location access policy" ON public.locations;
-- Keep only the ALL policy which includes SELECT permissions for admins and public access for active locations

-- Update the ALL policy to include public access for active locations
DROP POLICY IF EXISTS "Admins can manage all locations" ON public.locations;
CREATE POLICY "Location management policy" 
ON public.locations 
FOR ALL 
USING (
  (is_active = true) 
  OR 
  ((SELECT auth.uid()) IN ( 
    SELECT user_roles.user_id
    FROM (user_roles
      JOIN roles ON ((user_roles.role_id = roles.id)))
    WHERE (roles.name = 'admin'::text)
  ))
);

-- 2. Fix service_zones table - same approach
DROP POLICY IF EXISTS "Service zone access policy" ON public.service_zones;
DROP POLICY IF EXISTS "Admins can manage all service zones" ON public.service_zones;

CREATE POLICY "Service zone management policy" 
ON public.service_zones 
FOR ALL 
USING (
  (is_active = true) 
  OR 
  ((SELECT auth.uid()) IN ( 
    SELECT user_roles.user_id
    FROM (user_roles
      JOIN roles ON ((user_roles.role_id = roles.id)))
    WHERE (roles.name = 'admin'::text)
  ))
);

-- 3. Fix service_categories table - same approach
DROP POLICY IF EXISTS "Service category access policy" ON public.service_categories;
DROP POLICY IF EXISTS "Admins can manage categories" ON public.service_categories;

CREATE POLICY "Service category management policy" 
ON public.service_categories 
FOR ALL 
USING (
  (is_active = true) 
  OR 
  ((SELECT auth.uid()) IN ( 
    SELECT user_roles.user_id
    FROM (user_roles
      JOIN roles ON ((user_roles.role_id = roles.id)))
    WHERE (roles.name = 'admin'::text)
  ))
);

-- 4. Fix roles table - same approach  
DROP POLICY IF EXISTS "Role access policy" ON public.roles;
DROP POLICY IF EXISTS "Admins can manage roles" ON public.roles;

CREATE POLICY "Role management policy" 
ON public.roles 
FOR ALL 
USING (
  -- Everyone can read roles
  true
)
WITH CHECK (
  -- Only admins can modify roles
  is_admin()
);

-- 5. Fix user_roles table - consolidate admin management and user viewing
DROP POLICY IF EXISTS "Admins can manage user roles" ON public.user_roles;
DROP POLICY IF EXISTS "Users can view their own roles" ON public.user_roles; 

CREATE POLICY "User role access policy" 
ON public.user_roles 
FOR SELECT 
USING (
  (user_id = (SELECT auth.uid())) 
  OR 
  (is_admin())
);

CREATE POLICY "User role management policy" 
ON public.user_roles 
FOR ALL 
USING (is_admin())
WITH CHECK (is_admin());

-- 6. Fix users table - consolidate admin and user access
DROP POLICY IF EXISTS "Admins can read all users" ON public.users;
DROP POLICY IF EXISTS "Admins can update all users" ON public.users;
DROP POLICY IF EXISTS "Users can read their own data" ON public.users;
DROP POLICY IF EXISTS "Users can update their own data" ON public.users;
DROP POLICY IF EXISTS "Users can insert their own data" ON public.users;

CREATE POLICY "User data access policy" 
ON public.users 
FOR SELECT 
USING (
  ((SELECT auth.uid()) = id) 
  OR 
  (is_admin())
);

CREATE POLICY "User data update policy" 
ON public.users 
FOR UPDATE 
USING (
  ((SELECT auth.uid()) = id) 
  OR 
  (is_admin())
);

CREATE POLICY "User data insert policy" 
ON public.users 
FOR INSERT 
WITH CHECK ((SELECT auth.uid()) = id);

-- 7. Fix services table - consolidate public reading and provider management
DROP POLICY IF EXISTS "Anyone can read active services" ON public.services;
DROP POLICY IF EXISTS "Service providers can manage their services" ON public.services;

CREATE POLICY "Service access policy" 
ON public.services 
FOR SELECT 
USING (
  (is_active = true)
  OR 
  (provider_id IN ( 
    SELECT service_providers.id
    FROM service_providers
    WHERE (service_providers.user_id = (SELECT auth.uid()))
  ))
);

CREATE POLICY "Service management policy" 
ON public.services 
FOR ALL 
USING (provider_id IN ( 
  SELECT service_providers.id
  FROM service_providers
  WHERE (service_providers.user_id = (SELECT auth.uid()))
))
WITH CHECK (provider_id IN ( 
  SELECT service_providers.id
  FROM service_providers
  WHERE (service_providers.user_id = (SELECT auth.uid()))
));