/*
  # Fix User table and role system

  1. Changes
    - Fix User table column data types (name and email)
    - Create handle_new_user function for automatic role assignment
    - Ensure default roles exist (admin, user, provider)
    - Fix foreign key references in user_roles if needed
    - Ensure RLS is enabled on all tables
    - Create RLS policies with existence checks to avoid duplicates
*/

-- Fix User table column data types
ALTER TABLE "User" ALTER COLUMN "name" TYPE text;
ALTER TABLE "User" ALTER COLUMN "email" TYPE text;
ALTER TABLE "User" ALTER COLUMN "name" DROP DEFAULT;
ALTER TABLE "User" ALTER COLUMN "email" DROP DEFAULT;

-- Add handle_new_user function if it doesn't exist
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  -- Assign default user role to new users
  INSERT INTO user_roles (user_id, role_id)
  SELECT NEW.id, id FROM roles WHERE name = 'user'
  ON CONFLICT DO NOTHING;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Ensure default roles exist
INSERT INTO roles (name, description)
VALUES 
  ('admin', 'Administrator with full access'),
  ('user', 'Regular user with standard permissions'),
  ('provider', 'Service provider with business capabilities')
ON CONFLICT (name) DO NOTHING;

-- Fix foreign key references in user_roles if needed
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.table_constraints 
    WHERE constraint_name = 'user_roles_user_id_fkey'
  ) THEN
    ALTER TABLE user_roles 
    ADD CONSTRAINT user_roles_user_id_fkey 
    FOREIGN KEY (user_id) REFERENCES "User"(id) ON DELETE CASCADE;
  END IF;
  
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.table_constraints 
    WHERE constraint_name = 'user_roles_role_id_fkey'
  ) THEN
    ALTER TABLE user_roles 
    ADD CONSTRAINT user_roles_role_id_fkey 
    FOREIGN KEY (role_id) REFERENCES roles(id) ON DELETE CASCADE;
  END IF;
END $$;

-- Ensure RLS is enabled on all tables
ALTER TABLE "User" ENABLE ROW LEVEL SECURITY;
ALTER TABLE roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_roles ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for User table with existence checks
DO $$
BEGIN
  -- Check if the policy already exists before creating it
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'User' AND policyname = 'Users can read their own data and admins can read all data'
  ) THEN
    CREATE POLICY "Users can read their own data and admins can read all data"
    ON "User"
    FOR SELECT
    TO public
    USING (
      (auth.uid()::text = id::text) OR 
      (EXISTS (
        SELECT 1 FROM user_roles
        JOIN roles ON user_roles.role_id = roles.id
        WHERE user_roles.user_id = auth.uid() AND roles.name = 'admin'
      ))
    );
  END IF;

  -- Check if the policy already exists before creating it
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'User' AND policyname = 'Users can update their own data and admins can update all data'
  ) THEN
    CREATE POLICY "Users can update their own data and admins can update all data"
    ON "User"
    FOR UPDATE
    TO public
    USING (
      (auth.uid()::text = id::text) OR 
      (EXISTS (
        SELECT 1 FROM user_roles
        JOIN roles ON user_roles.role_id = roles.id
        WHERE user_roles.user_id = auth.uid() AND roles.name = 'admin'
      ))
    );
  END IF;
END $$;

-- Create RLS policies for roles table with existence checks
DO $$
BEGIN
  -- Check if the policy already exists before creating it
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'roles' AND policyname = 'Roles are viewable by authenticated users'
  ) THEN
    CREATE POLICY "Roles are viewable by authenticated users"
    ON roles
    FOR SELECT
    TO authenticated
    USING (true);
  END IF;

  -- Check if the policy already exists before creating it
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'roles' AND policyname = 'Roles can be managed by admins'
  ) THEN
    CREATE POLICY "Roles can be managed by admins"
    ON roles
    FOR ALL
    TO public
    USING (
      auth.uid() IN (
        SELECT user_roles.user_id
        FROM user_roles
        JOIN roles roles_1 ON user_roles.role_id = roles_1.id
        WHERE roles_1.name = 'admin'
      )
    );
  END IF;
END $$;

-- Create RLS policies for user_roles table with existence checks
DO $$
BEGIN
  -- Check if the policy already exists before creating it
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'user_roles' AND policyname = 'User roles can be managed by admins'
  ) THEN
    CREATE POLICY "User roles can be managed by admins"
    ON user_roles
    FOR ALL
    TO public
    USING (
      auth.uid() IN (
        SELECT user_roles_1.user_id
        FROM user_roles user_roles_1
        JOIN roles ON user_roles_1.role_id = roles.id
        WHERE roles.name = 'admin'
      )
    );
  END IF;

  -- Check if the policy already exists before creating it
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'user_roles' AND policyname = 'Users can view their own roles'
  ) THEN
    CREATE POLICY "Users can view their own roles"
    ON user_roles
    FOR SELECT
    TO authenticated
    USING (auth.uid() = user_id);
  END IF;
END $$;