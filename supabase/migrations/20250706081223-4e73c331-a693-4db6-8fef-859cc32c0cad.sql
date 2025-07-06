-- Fix search_path security issue for the original assign_role function
CREATE OR REPLACE FUNCTION public.assign_role(user_id uuid, role_name text)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
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