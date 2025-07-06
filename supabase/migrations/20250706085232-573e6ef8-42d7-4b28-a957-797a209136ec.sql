-- Fix critical authentication and user profile issues

-- 1. First, create the missing trigger for user profile creation
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
    full_name,
    name,
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
    COALESCE(NEW.raw_user_meta_data->>'name', NEW.email),
    COALESCE(NEW.raw_user_meta_data->>'name', split_part(NEW.email, '@', 1)),
    NEW.raw_user_meta_data->>'avatar_url',
    COALESCE(NEW.raw_user_meta_data->>'language', 'en'),
    'AWG',
    COALESCE((NEW.raw_user_meta_data->>'isServiceProvider')::boolean, false),
    0.00,
    0,
    true,
    false,
    'customer',
    NOW(),
    NOW()
  );
  RETURN NEW;
END;
$$;

-- Create the trigger
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- 2. Create function to make first user admin automatically
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

-- Create trigger to auto-assign admin to first user
DROP TRIGGER IF EXISTS assign_first_admin_trigger ON users;
CREATE TRIGGER assign_first_admin_trigger
  AFTER INSERT ON users
  FOR EACH ROW EXECUTE FUNCTION public.assign_first_admin();

-- 3. Ensure basic roles exist
INSERT INTO roles (name, description) VALUES 
  ('admin', 'System administrator with full access'),
  ('user', 'Regular platform user'),
  ('provider', 'Service provider'),
  ('driver', 'Taxi driver')
ON CONFLICT (name) DO NOTHING;

-- 4. Add email uniqueness constraint if missing
ALTER TABLE users ADD CONSTRAINT users_email_unique UNIQUE (email);