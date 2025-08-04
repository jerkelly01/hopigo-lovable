-- Fix remaining database security issues

-- 1. Fix search_path for remaining functions that still need it
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public'
AS $$
BEGIN
    INSERT INTO public.users (
        id,
        email,
        name,
        full_name,
        avatar_url,
        language,
        currency,
        is_service_provider,
        wallet_balance,
        loyalty_points,
        is_active,
        is_verified,
        user_type,
        created_at,
        updated_at
    )
    VALUES (
        NEW.id,
        NEW.email,
        COALESCE(NEW.raw_user_meta_data->>'name', split_part(NEW.email, '@', 1)),
        COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.raw_user_meta_data->>'name'),
        NEW.raw_user_meta_data->>'avatar_url',
        COALESCE(NEW.raw_user_meta_data->>'language', 'en'),
        'AWG',
        COALESCE((NEW.raw_user_meta_data->>'isServiceProvider')::boolean, false),
        0.00,
        0,
        true,
        false,
        'customer',
        now(),
        now()
    )
    ON CONFLICT (id) DO UPDATE SET
        email = EXCLUDED.email,
        name = COALESCE(EXCLUDED.name, users.name),
        updated_at = now();
    
    RETURN NEW;
END;
$$;

CREATE OR REPLACE FUNCTION public.assign_first_admin()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public'
AS $$
DECLARE
  user_count int;
  admin_role_id uuid;
BEGIN
  -- Check if this is the first user
  SELECT COUNT(*) INTO user_count FROM users;
  
  IF user_count = 1 THEN
    -- Get admin role ID
    SELECT id INTO admin_role_id FROM roles WHERE name = 'admin';
    
    -- If admin role doesn't exist, create it
    IF admin_role_id IS NULL THEN
      INSERT INTO roles (name, description) 
      VALUES ('admin', 'System administrator with full access')
      RETURNING id INTO admin_role_id;
    END IF;
    
    -- Assign admin role to first user
    INSERT INTO user_roles (user_id, role_id)
    VALUES (NEW.id, admin_role_id)
    ON CONFLICT (user_id, role_id) DO NOTHING;
  END IF;
  
  RETURN NEW;
END;
$$;

CREATE OR REPLACE FUNCTION public.assign_role(user_id uuid, role_name text)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public'
AS $$
DECLARE
  role_id uuid;
BEGIN
  -- Check if the role exists
  SELECT id INTO role_id FROM roles WHERE name = role_name;
  
  IF role_id IS NULL THEN
    RAISE EXCEPTION 'Role % does not exist', role_name;
  END IF;
  
  -- Assign the role to the user
  INSERT INTO user_roles (user_id, role_id)
  VALUES (user_id, role_id)
  ON CONFLICT (user_id, role_id) DO NOTHING;
END;
$$;

-- 2. Enable RLS on tables that are missing it
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE security_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_subscriptions ENABLE ROW LEVEL SECURITY;

-- 3. Add missing RLS policies for newly secured tables
CREATE POLICY "Users can read their own profile"
ON profiles
FOR SELECT
USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile"
ON profiles  
FOR UPDATE
USING (auth.uid() = id);

CREATE POLICY "Users can insert their own profile"
ON profiles
FOR INSERT
WITH CHECK (auth.uid() = id);

CREATE POLICY "Admins can read all profiles"
ON profiles
FOR SELECT
USING (public.is_admin());

CREATE POLICY "Admins can update all profiles"
ON profiles
FOR UPDATE
USING (public.is_admin());

CREATE POLICY "System can insert security events"
ON security_events
FOR INSERT
WITH CHECK (true);

CREATE POLICY "Admins can read security events"
ON security_events
FOR SELECT
USING (public.is_admin());

CREATE POLICY "Users can read their own security events"
ON security_events
FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can read their own subscriptions"
ON user_subscriptions
FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own subscriptions"
ON user_subscriptions
FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own subscriptions"
ON user_subscriptions
FOR UPDATE
USING (auth.uid() = user_id);

CREATE POLICY "Admins can manage all subscriptions"
ON user_subscriptions
FOR ALL
USING (public.is_admin());