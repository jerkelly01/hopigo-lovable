-- First, let's check if we need to reference auth.users instead
-- and create admin role properly
DO $$
DECLARE
    admin_role_id uuid;
    auth_user_id uuid;
BEGIN
    -- Get or create admin role
    SELECT id INTO admin_role_id FROM roles WHERE name = 'admin';
    
    IF admin_role_id IS NULL THEN
        INSERT INTO roles (name, description) 
        VALUES ('admin', 'System administrator with full access')
        RETURNING id INTO admin_role_id;
    END IF;
    
    -- Get the first auth user (since user_roles might reference auth.users)
    SELECT id INTO auth_user_id FROM auth.users ORDER BY created_at LIMIT 1;
    
    -- If we found an auth user, assign admin role
    IF auth_user_id IS NOT NULL THEN
        INSERT INTO user_roles (user_id, role_id)
        VALUES (auth_user_id, admin_role_id)
        ON CONFLICT (user_id, role_id) DO NOTHING;
    END IF;
    
END $$;

-- Create a function to assign admin to any user by email (using auth.users)
CREATE OR REPLACE FUNCTION assign_admin_by_email(target_email text)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    target_user_id uuid;
    admin_role_id uuid;
BEGIN
    -- Get user by email from auth.users
    SELECT id INTO target_user_id FROM auth.users WHERE email = target_email;
    
    IF target_user_id IS NULL THEN
        RAISE EXCEPTION 'User with email % not found', target_email;
    END IF;
    
    -- Get admin role
    SELECT id INTO admin_role_id FROM roles WHERE name = 'admin';
    
    IF admin_role_id IS NULL THEN
        INSERT INTO roles (name, description) 
        VALUES ('admin', 'System administrator with full access')
        RETURNING id INTO admin_role_id;
    END IF;
    
    -- Assign admin role
    INSERT INTO user_roles (user_id, role_id)
    VALUES (target_user_id, admin_role_id)
    ON CONFLICT (user_id, role_id) DO NOTHING;
END;
$$;