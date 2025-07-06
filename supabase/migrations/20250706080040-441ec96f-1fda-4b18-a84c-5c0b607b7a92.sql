-- Add additional security policies and fix remaining RLS issues

-- Create audit logging table for admin operations
CREATE TABLE IF NOT EXISTS public.audit_logs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  action text NOT NULL,
  table_name text,
  record_id text,
  old_values jsonb,
  new_values jsonb,
  ip_address inet,
  user_agent text,
  created_at timestamp with time zone DEFAULT now()
);

-- Enable RLS on audit_logs
ALTER TABLE public.audit_logs ENABLE ROW LEVEL SECURITY;

-- Only admins can read audit logs
CREATE POLICY "Admins can read audit logs" 
ON public.audit_logs FOR SELECT 
USING (public.is_admin());

-- System can insert audit logs
CREATE POLICY "System can create audit logs" 
ON public.audit_logs FOR INSERT 
WITH CHECK (true);

-- Fix roles table RLS policy that's causing infinite recursion
DROP POLICY IF EXISTS "Roles can be managed by admins" ON roles;
CREATE POLICY "Admins can manage roles" 
ON roles FOR ALL 
USING (public.is_admin());

-- Add better RLS policies for users table (admin access)
CREATE POLICY "Admins can read all users" 
ON users FOR SELECT 
USING (public.is_admin());

CREATE POLICY "Admins can update all users" 
ON users FOR UPDATE 
USING (public.is_admin());

-- Create a secure function to get user roles
CREATE OR REPLACE FUNCTION public.get_user_roles(target_user_id uuid DEFAULT auth.uid())
RETURNS TABLE(role_name text, role_description text) 
SECURITY DEFINER
STABLE
AS $$
BEGIN
  -- Only allow admins to get other users' roles, or users to get their own roles
  IF target_user_id != auth.uid() AND NOT public.is_admin() THEN
    RAISE EXCEPTION 'Unauthorized access to user roles';
  END IF;
  
  RETURN QUERY
  SELECT r.name, r.description
  FROM user_roles ur
  JOIN roles r ON ur.role_id = r.id
  WHERE ur.user_id = target_user_id;
END;
$$ LANGUAGE plpgsql;

-- Create function to safely assign roles (admin only)
CREATE OR REPLACE FUNCTION public.safe_assign_role(target_user_id uuid, role_name text)
RETURNS void
SECURITY DEFINER
AS $$
DECLARE
  role_id uuid;
  current_user_id uuid := auth.uid();
BEGIN
  -- Only admins can assign roles
  IF NOT public.is_admin() THEN
    RAISE EXCEPTION 'Only administrators can assign roles';
  END IF;
  
  -- Get role ID
  SELECT id INTO role_id FROM roles WHERE name = role_name;
  IF role_id IS NULL THEN
    RAISE EXCEPTION 'Role % does not exist', role_name;
  END IF;
  
  -- Insert the role assignment
  INSERT INTO user_roles (user_id, role_id)
  VALUES (target_user_id, role_id)
  ON CONFLICT (user_id, role_id) DO NOTHING;
  
  -- Log the action
  INSERT INTO audit_logs (user_id, action, table_name, record_id, new_values)
  VALUES (
    current_user_id,
    'assign_role',
    'user_roles',
    target_user_id::text,
    jsonb_build_object('role_name', role_name, 'target_user_id', target_user_id)
  );
END;
$$ LANGUAGE plpgsql;

-- Create function to safely update user data (with audit logging)
CREATE OR REPLACE FUNCTION public.safe_update_user(
  target_user_id uuid,
  full_name_param text DEFAULT NULL,
  name_param text DEFAULT NULL,
  is_verified_param boolean DEFAULT NULL,
  is_active_param boolean DEFAULT NULL,
  user_type_param text DEFAULT NULL
)
RETURNS void
SECURITY DEFINER
AS $$
DECLARE
  current_user_id uuid := auth.uid();
  old_record jsonb;
  new_record jsonb;
BEGIN
  -- Only admins or the users themselves can update user data
  IF target_user_id != auth.uid() AND NOT public.is_admin() THEN
    RAISE EXCEPTION 'Unauthorized to update user data';
  END IF;
  
  -- Get old record for audit
  SELECT to_jsonb(users.*) INTO old_record 
  FROM users WHERE id = target_user_id;
  
  -- Update the user record
  UPDATE users SET
    full_name = COALESCE(full_name_param, full_name),
    name = COALESCE(name_param, name),
    is_verified = COALESCE(is_verified_param, is_verified),
    is_active = COALESCE(is_active_param, is_active),
    user_type = COALESCE(user_type_param, user_type),
    updated_at = now()
  WHERE id = target_user_id;
  
  -- Get new record for audit
  SELECT to_jsonb(users.*) INTO new_record 
  FROM users WHERE id = target_user_id;
  
  -- Log the action if performed by admin
  IF public.is_admin() THEN
    INSERT INTO audit_logs (user_id, action, table_name, record_id, old_values, new_values)
    VALUES (
      current_user_id,
      'update_user',
      'users',
      target_user_id::text,
      old_record,
      new_record
    );
  END IF;
END;
$$ LANGUAGE plpgsql;