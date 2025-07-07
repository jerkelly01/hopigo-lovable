-- Get the current user ID and assign admin role
DO $$
DECLARE
    current_user_id uuid;
    admin_role_id uuid;
BEGIN
    -- Get the current authenticated user ID
    SELECT auth.uid() INTO current_user_id;
    
    -- If no current user, get the first user from users table as fallback
    IF current_user_id IS NULL THEN
        SELECT id INTO current_user_id FROM users ORDER BY created_at LIMIT 1;
    END IF;
    
    -- Get or create admin role
    SELECT id INTO admin_role_id FROM roles WHERE name = 'admin';
    
    IF admin_role_id IS NULL THEN
        INSERT INTO roles (name, description) 
        VALUES ('admin', 'System administrator with full access')
        RETURNING id INTO admin_role_id;
    END IF;
    
    -- Assign admin role to the user
    INSERT INTO user_roles (user_id, role_id)
    VALUES (current_user_id, admin_role_id)
    ON CONFLICT (user_id, role_id) DO NOTHING;
    
    -- Also create a backup admin assignment function for future use
    CREATE OR REPLACE FUNCTION assign_admin_to_user(target_email text)
    RETURNS void
    LANGUAGE plpgsql
    SECURITY DEFINER
    AS $func$
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
    $func$;
    
END $$;