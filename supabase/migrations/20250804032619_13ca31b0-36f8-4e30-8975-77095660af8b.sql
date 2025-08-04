-- Phase 1: Critical Database Security Fixes

-- 1. Fix search_path vulnerability in database functions
-- Add SET search_path = 'public' to all security-sensitive functions

CREATE OR REPLACE FUNCTION public.has_role(role_name text)
RETURNS boolean
LANGUAGE plpgsql
STABLE SECURITY DEFINER
SET search_path = 'public'
AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1
    FROM user_roles
    JOIN roles ON user_roles.role_id = roles.id
    WHERE user_roles.user_id = auth.uid()
    AND roles.name = role_name
  );
END;
$$;

CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS boolean
LANGUAGE plpgsql
STABLE SECURITY DEFINER
SET search_path = 'public'
AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 
    FROM user_roles ur
    JOIN roles r ON ur.role_id = r.id
    WHERE ur.user_id = auth.uid() AND r.name = 'admin'
  );
END;
$$;

CREATE OR REPLACE FUNCTION public.safe_assign_role(target_user_id uuid, role_name text)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public'
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
$$;

CREATE OR REPLACE FUNCTION public.safe_update_user(target_user_id uuid, full_name_param text DEFAULT NULL::text, name_param text DEFAULT NULL::text, is_verified_param boolean DEFAULT NULL::boolean, is_active_param boolean DEFAULT NULL::boolean, user_type_param text DEFAULT NULL::text)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public'
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
$$;

-- 2. Secure Role System - Remove direct role column access and make it read-only
-- First drop the problematic UPDATE policy on User table
DROP POLICY IF EXISTS "Users can update their own data and admins can update all data" ON "User";

-- Create a secure trigger to prevent role column updates
CREATE OR REPLACE FUNCTION public.prevent_role_updates()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public'
AS $$
BEGIN
  -- Prevent direct role updates unless admin
  IF OLD.role IS DISTINCT FROM NEW.role AND NOT public.is_admin() THEN
    RAISE EXCEPTION 'Direct role updates are not allowed. Use role management functions instead.';
  END IF;
  
  RETURN NEW;
END;
$$;

-- Apply trigger to User table
DROP TRIGGER IF EXISTS prevent_role_updates_trigger ON "User";
CREATE TRIGGER prevent_role_updates_trigger
  BEFORE UPDATE ON "User"
  FOR EACH ROW
  EXECUTE FUNCTION public.prevent_role_updates();

-- 3. Fix User table policies - Add secure INSERT and DELETE policies
CREATE POLICY "Admins can insert users" 
ON "User"
FOR INSERT
WITH CHECK (public.is_admin());

CREATE POLICY "Admins can delete users"
ON "User" 
FOR DELETE
USING (public.is_admin());

-- Create new secure UPDATE policy
CREATE POLICY "Users can update non-role fields and admins can update all data"
ON "User"
FOR UPDATE
USING (
  auth.uid()::text = id::text OR public.is_admin()
);

-- 4. Ensure consistent user data structure by creating sync function
CREATE OR REPLACE FUNCTION public.sync_user_tables()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public'
AS $$
BEGIN
  -- Sync data between User and users tables
  IF TG_OP = 'INSERT' THEN
    INSERT INTO users (id, email, name, full_name, created_at, updated_at)
    VALUES (NEW.id, NEW.email, NEW.name, NEW.name, now(), now())
    ON CONFLICT (id) DO UPDATE SET
      email = EXCLUDED.email,
      name = EXCLUDED.name,
      updated_at = now();
    RETURN NEW;
  ELSIF TG_OP = 'UPDATE' THEN
    UPDATE users SET
      email = NEW.email,
      name = NEW.name,
      updated_at = now()
    WHERE id = NEW.id;
    RETURN NEW;
  END IF;
  RETURN NULL;
END;
$$;

-- Apply sync trigger
DROP TRIGGER IF EXISTS sync_user_tables_trigger ON "User";
CREATE TRIGGER sync_user_tables_trigger
  AFTER INSERT OR UPDATE ON "User"
  FOR EACH ROW
  EXECUTE FUNCTION public.sync_user_tables();

-- 5. Add security monitoring function
CREATE OR REPLACE FUNCTION public.log_security_event(
  event_type text,
  user_id_param uuid DEFAULT auth.uid(),
  description_param text DEFAULT NULL,
  metadata_param jsonb DEFAULT '{}'::jsonb
)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public'
AS $$
BEGIN
  INSERT INTO security_events (user_id, event_type, severity, description, metadata)
  VALUES (
    user_id_param,
    event_type,
    'medium',
    COALESCE(description_param, 'Security event: ' || event_type),
    metadata_param
  );
END;
$$;

-- Add constraint to ensure email uniqueness across user tables
ALTER TABLE "User" ADD CONSTRAINT unique_user_email UNIQUE (email);
ALTER TABLE users ADD CONSTRAINT unique_users_email UNIQUE (email);