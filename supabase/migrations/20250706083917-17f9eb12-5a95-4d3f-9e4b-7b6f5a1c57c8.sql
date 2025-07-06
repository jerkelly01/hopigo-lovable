-- Fix remaining Auth RLS Initialization Plan performance issues
-- Replace auth.uid() with (SELECT auth.uid()) and consolidate multiple permissive policies

-- 1. Fix bills table policies
DROP POLICY IF EXISTS "Users can read their own bills" ON public.bills;
DROP POLICY IF EXISTS "Users can create their own bills" ON public.bills;
DROP POLICY IF EXISTS "Users can update their own bills" ON public.bills;

CREATE POLICY "Users can read their own bills" 
ON public.bills 
FOR SELECT 
USING (user_id = (SELECT auth.uid()));

CREATE POLICY "Users can create their own bills" 
ON public.bills 
FOR INSERT 
WITH CHECK (user_id = (SELECT auth.uid()));

CREATE POLICY "Users can update their own bills" 
ON public.bills 
FOR UPDATE 
USING (user_id = (SELECT auth.uid()));

-- 2. Fix event_tickets table policies
DROP POLICY IF EXISTS "Users can read their own tickets" ON public.event_tickets;
DROP POLICY IF EXISTS "Users can purchase tickets" ON public.event_tickets;

CREATE POLICY "Users can read their own tickets" 
ON public.event_tickets 
FOR SELECT 
USING (user_id = (SELECT auth.uid()));

CREATE POLICY "Users can purchase tickets" 
ON public.event_tickets 
FOR INSERT 
WITH CHECK (user_id = (SELECT auth.uid()));

-- 3. Fix money_transfers table policies
DROP POLICY IF EXISTS "Users can read their own transfers" ON public.money_transfers;
DROP POLICY IF EXISTS "Users can create transfers" ON public.money_transfers;

CREATE POLICY "Users can read their own transfers" 
ON public.money_transfers 
FOR SELECT 
USING ((sender_id = (SELECT auth.uid())) OR (receiver_id = (SELECT auth.uid())));

CREATE POLICY "Users can create transfers" 
ON public.money_transfers 
FOR INSERT 
WITH CHECK (sender_id = (SELECT auth.uid()));

-- 4. Fix fuel_payments table policies
DROP POLICY IF EXISTS "Users can read their own fuel payments" ON public.fuel_payments;
DROP POLICY IF EXISTS "Users can create fuel payments" ON public.fuel_payments;

CREATE POLICY "Users can read their own fuel payments" 
ON public.fuel_payments 
FOR SELECT 
USING (user_id = (SELECT auth.uid()));

CREATE POLICY "Users can create fuel payments" 
ON public.fuel_payments 
FOR INSERT 
WITH CHECK (user_id = (SELECT auth.uid()));

-- 5. Fix donations table policies
DROP POLICY IF EXISTS "Users can read their own donations" ON public.donations;
DROP POLICY IF EXISTS "Users can create donations" ON public.donations;

CREATE POLICY "Users can read their own donations" 
ON public.donations 
FOR SELECT 
USING (user_id = (SELECT auth.uid()));

CREATE POLICY "Users can create donations" 
ON public.donations 
FOR INSERT 
WITH CHECK (user_id = (SELECT auth.uid()));

-- 6. Fix split_bills table policies
DROP POLICY IF EXISTS "Users can read their own split bills" ON public.split_bills;
DROP POLICY IF EXISTS "Users can create split bills" ON public.split_bills;

CREATE POLICY "Users can read their own split bills" 
ON public.split_bills 
FOR SELECT 
USING (creator_id = (SELECT auth.uid()));

CREATE POLICY "Users can create split bills" 
ON public.split_bills 
FOR INSERT 
WITH CHECK (creator_id = (SELECT auth.uid()));

-- 7. Fix loyalty_transactions table policies
DROP POLICY IF EXISTS "Users can read their own loyalty transactions" ON public.loyalty_transactions;

CREATE POLICY "Users can read their own loyalty transactions" 
ON public.loyalty_transactions 
FOR SELECT 
USING (user_id = (SELECT auth.uid()));

-- 8. Fix payments table policies
DROP POLICY IF EXISTS "Users can read their own payments" ON public.payments;
DROP POLICY IF EXISTS "Users can create their own payments" ON public.payments;

CREATE POLICY "Users can read their own payments" 
ON public.payments 
FOR SELECT 
USING (user_id = (SELECT auth.uid()));

CREATE POLICY "Users can create their own payments" 
ON public.payments 
FOR INSERT 
WITH CHECK (user_id = (SELECT auth.uid()));

-- 9. Fix activities table policies
DROP POLICY IF EXISTS "Users can read their own activities" ON public.activities;

CREATE POLICY "Users can read their own activities" 
ON public.activities 
FOR SELECT 
USING ((user_id = (SELECT auth.uid())) OR (user_id IS NULL));

-- 10. Fix notifications table policies
DROP POLICY IF EXISTS "Users can read their own notifications" ON public.notifications;
DROP POLICY IF EXISTS "Users can update their own notifications" ON public.notifications;

CREATE POLICY "Users can read their own notifications" 
ON public.notifications 
FOR SELECT 
USING (user_id = (SELECT auth.uid()));

CREATE POLICY "Users can update their own notifications" 
ON public.notifications 
FOR UPDATE 
USING (user_id = (SELECT auth.uid()));

-- 11. Fix users table policies  
DROP POLICY IF EXISTS "Users can read their own data" ON public.users;
DROP POLICY IF EXISTS "Users can update their own data" ON public.users;
DROP POLICY IF EXISTS "Users can insert their own data" ON public.users;

CREATE POLICY "Users can read their own data" 
ON public.users 
FOR SELECT 
USING ((SELECT auth.uid()) = id);

CREATE POLICY "Users can update their own data" 
ON public.users 
FOR UPDATE 
USING ((SELECT auth.uid()) = id);

CREATE POLICY "Users can insert their own data" 
ON public.users 
FOR INSERT 
WITH CHECK ((SELECT auth.uid()) = id);

-- 12. Fix locations table policies (consolidate multiple permissive policies)
DROP POLICY IF EXISTS "Admins can manage all locations" ON public.locations;
DROP POLICY IF EXISTS "Anyone can view active locations" ON public.locations;

CREATE POLICY "Location access policy" 
ON public.locations 
FOR SELECT 
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

CREATE POLICY "Admins can manage all locations" 
ON public.locations 
FOR ALL 
USING ((SELECT auth.uid()) IN ( 
  SELECT user_roles.user_id
  FROM (user_roles
    JOIN roles ON ((user_roles.role_id = roles.id)))
  WHERE (roles.name = 'admin'::text)
));

-- 13. Fix service_zones table policies
DROP POLICY IF EXISTS "Admins can manage all service zones" ON public.service_zones;
DROP POLICY IF EXISTS "Anyone can view active service zones" ON public.service_zones;

CREATE POLICY "Service zone access policy" 
ON public.service_zones 
FOR SELECT 
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

CREATE POLICY "Admins can manage all service zones" 
ON public.service_zones 
FOR ALL 
USING ((SELECT auth.uid()) IN ( 
  SELECT user_roles.user_id
  FROM (user_roles
    JOIN roles ON ((user_roles.role_id = roles.id)))
  WHERE (roles.name = 'admin'::text)
));

-- 14. Fix service_categories table policies (consolidate multiple permissive policies)
DROP POLICY IF EXISTS "Admins can manage categories" ON public.service_categories;
DROP POLICY IF EXISTS "Anyone can read active categories" ON public.service_categories;

CREATE POLICY "Service category access policy" 
ON public.service_categories 
FOR SELECT 
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

CREATE POLICY "Admins can manage categories" 
ON public.service_categories 
FOR ALL 
USING ((SELECT auth.uid()) IN ( 
  SELECT user_roles.user_id
  FROM (user_roles
    JOIN roles ON ((user_roles.role_id = roles.id)))
  WHERE (roles.name = 'admin'::text)
));

-- 15. Fix user_roles table policies
DROP POLICY IF EXISTS "Users can view their own roles" ON public.user_roles;

CREATE POLICY "Users can view their own roles" 
ON public.user_roles 
FOR SELECT 
USING (user_id = (SELECT auth.uid()));

-- 16. Fix roles table (consolidate multiple permissive policies)
DROP POLICY IF EXISTS "Admins can manage roles" ON public.roles;
DROP POLICY IF EXISTS "Roles are viewable by authenticated users" ON public.roles;

CREATE POLICY "Role access policy" 
ON public.roles 
FOR SELECT 
USING (true);

CREATE POLICY "Admins can manage roles" 
ON public.roles 
FOR ALL 
USING (is_admin());