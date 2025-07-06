-- Fix search_path security issue for has_role function
CREATE OR REPLACE FUNCTION public.has_role(role_name text)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
STABLE
SET search_path = public
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

-- Also fix the is_admin function to have a secure search_path
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN 
LANGUAGE plpgsql 
SECURITY DEFINER 
STABLE
SET search_path = public
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

-- Fix get_user_roles function as well
CREATE OR REPLACE FUNCTION public.get_user_roles(target_user_id uuid DEFAULT auth.uid())
RETURNS TABLE(role_name text, role_description text) 
LANGUAGE plpgsql
SECURITY DEFINER
STABLE
SET search_path = public
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
$$;

-- Fix safe_assign_role function
CREATE OR REPLACE FUNCTION public.safe_assign_role(target_user_id uuid, role_name text)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
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

-- Fix safe_update_user function
CREATE OR REPLACE FUNCTION public.safe_update_user(
  target_user_id uuid,
  full_name_param text DEFAULT NULL,
  name_param text DEFAULT NULL,
  is_verified_param boolean DEFAULT NULL,
  is_active_param boolean DEFAULT NULL,
  user_type_param text DEFAULT NULL
)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
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