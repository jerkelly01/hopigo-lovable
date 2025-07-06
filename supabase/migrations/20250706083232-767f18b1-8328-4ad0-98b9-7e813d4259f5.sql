-- Fix RLS performance issue on public.User table by using subqueries for auth functions
-- This prevents re-evaluation of auth.uid() for each row

-- Drop existing policies
DROP POLICY IF EXISTS "Users can read their own data and admins can read all data" ON public."User";
DROP POLICY IF EXISTS "Users can update their own data and admins can update all data" ON public."User";

-- Recreate policies with optimized auth function calls using subqueries
CREATE POLICY "Users can read their own data and admins can read all data" 
ON public."User" 
FOR SELECT 
USING (
  ((SELECT auth.uid())::text = (id)::text) 
  OR 
  (EXISTS ( 
    SELECT 1
    FROM (user_roles
      JOIN roles ON ((user_roles.role_id = roles.id)))
    WHERE ((user_roles.user_id = (SELECT auth.uid())) AND (roles.name = 'admin'::text))
  ))
);

CREATE POLICY "Users can update their own data and admins can update all data" 
ON public."User" 
FOR UPDATE 
USING (
  ((SELECT auth.uid())::text = (id)::text) 
  OR 
  (EXISTS ( 
    SELECT 1
    FROM (user_roles
      JOIN roles ON ((user_roles.role_id = roles.id)))
    WHERE ((user_roles.user_id = (SELECT auth.uid())) AND (roles.name = 'admin'::text))
  ))
);