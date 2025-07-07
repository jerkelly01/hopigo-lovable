-- Assign admin role to the first user and create backup functions
DO $$
DECLARE
    first_user_id uuid := '550e8400-e29b-41d4-a716-446655440001'; -- John Doe
    admin_role_id uuid;
BEGIN
    -- Get or create admin role
    SELECT id INTO admin_role_id FROM roles WHERE name = 'admin';
    
    IF admin_role_id IS NULL THEN
        INSERT INTO roles (name, description) 
        VALUES ('admin', 'System administrator with full access')
        RETURNING id INTO admin_role_id;
    END IF;
    
    -- Assign admin role to the first user
    INSERT INTO user_roles (user_id, role_id)
    VALUES (first_user_id, admin_role_id)
    ON CONFLICT (user_id, role_id) DO NOTHING;
    
END $$;

-- Create a function to assign admin to any user by email
CREATE OR REPLACE FUNCTION assign_admin_to_user(target_email text)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    target_user_id uuid;
    admin_role_id uuid;
BEGIN
    -- Get user by email
    SELECT id INTO target_user_id FROM users WHERE email = target_email;
    
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