-- Fix Auth RLS Initialization Plan performance issues across all affected tables
-- Replace auth.uid() with (SELECT auth.uid()) to prevent re-evaluation for each row

-- 1. Fix ride_drivers table policies
DROP POLICY IF EXISTS "Drivers can read their own data" ON public.ride_drivers;
DROP POLICY IF EXISTS "Drivers can update their own data" ON public.ride_drivers;
DROP POLICY IF EXISTS "Users can create driver profiles" ON public.ride_drivers;

CREATE POLICY "Drivers can read their own data" 
ON public.ride_drivers 
FOR SELECT 
USING (user_id = (SELECT auth.uid()));

CREATE POLICY "Drivers can update their own data" 
ON public.ride_drivers 
FOR UPDATE 
USING (user_id = (SELECT auth.uid()));

CREATE POLICY "Users can create driver profiles" 
ON public.ride_drivers 
FOR INSERT 
WITH CHECK (user_id = (SELECT auth.uid()));

-- 2. Fix service_providers table policies
DROP POLICY IF EXISTS "Service providers can read their own data" ON public.service_providers;
DROP POLICY IF EXISTS "Service providers can update their own data" ON public.service_providers;
DROP POLICY IF EXISTS "Users can create service provider profiles" ON public.service_providers;

CREATE POLICY "Service providers can read their own data" 
ON public.service_providers 
FOR SELECT 
USING (user_id = (SELECT auth.uid()));

CREATE POLICY "Service providers can update their own data" 
ON public.service_providers 
FOR UPDATE 
USING (user_id = (SELECT auth.uid()));

CREATE POLICY "Users can create service provider profiles" 
ON public.service_providers 
FOR INSERT 
WITH CHECK (user_id = (SELECT auth.uid()));

-- 3. Fix services table policies
DROP POLICY IF EXISTS "Service providers can manage their services" ON public.services;

CREATE POLICY "Service providers can manage their services" 
ON public.services 
FOR ALL 
USING (provider_id IN ( 
  SELECT service_providers.id
  FROM service_providers
  WHERE (service_providers.user_id = (SELECT auth.uid()))
));

-- 4. Fix service_bookings table policies
DROP POLICY IF EXISTS "Users can read their own service bookings" ON public.service_bookings;
DROP POLICY IF EXISTS "Customers can create service bookings" ON public.service_bookings;
DROP POLICY IF EXISTS "Users can update their related service bookings" ON public.service_bookings;

CREATE POLICY "Users can read their own service bookings" 
ON public.service_bookings 
FOR SELECT 
USING (
  (customer_id = (SELECT auth.uid())) 
  OR 
  (provider_id IN ( 
    SELECT service_providers.id
    FROM service_providers
    WHERE (service_providers.user_id = (SELECT auth.uid()))
  ))
);

CREATE POLICY "Customers can create service bookings" 
ON public.service_bookings 
FOR INSERT 
WITH CHECK (customer_id = (SELECT auth.uid()));

CREATE POLICY "Users can update their related service bookings" 
ON public.service_bookings 
FOR UPDATE 
USING (
  (customer_id = (SELECT auth.uid())) 
  OR 
  (provider_id IN ( 
    SELECT service_providers.id
    FROM service_providers
    WHERE (service_providers.user_id = (SELECT auth.uid()))
  ))
);

-- 5. Fix ride_bookings table policies
DROP POLICY IF EXISTS "Users can read their own ride bookings" ON public.ride_bookings;
DROP POLICY IF EXISTS "Customers can create ride bookings" ON public.ride_bookings;
DROP POLICY IF EXISTS "Users can update their related ride bookings" ON public.ride_bookings;

CREATE POLICY "Users can read their own ride bookings" 
ON public.ride_bookings 
FOR SELECT 
USING (
  (customer_id = (SELECT auth.uid())) 
  OR 
  (driver_id IN ( 
    SELECT ride_drivers.id
    FROM ride_drivers
    WHERE (ride_drivers.user_id = (SELECT auth.uid()))
  ))
);

CREATE POLICY "Customers can create ride bookings" 
ON public.ride_bookings 
FOR INSERT 
WITH CHECK (customer_id = (SELECT auth.uid()));

CREATE POLICY "Users can update their related ride bookings" 
ON public.ride_bookings 
FOR UPDATE 
USING (
  (customer_id = (SELECT auth.uid())) 
  OR 
  (driver_id IN ( 
    SELECT ride_drivers.id
    FROM ride_drivers
    WHERE (ride_drivers.user_id = (SELECT auth.uid()))
  ))
);