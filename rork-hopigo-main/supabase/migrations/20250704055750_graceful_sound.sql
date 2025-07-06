/*
  # Fix User table RLS and role management
  
  1. New Features
    - Enable RLS on User table
    - Add role column to User table
    - Create trigger for automatic role assignment
    
  2. Security
    - Add RLS policies for User table
    - Ensure proper type casting for ID comparisons
*/

-- First, ensure RLS is enabled on the User table
ALTER TABLE "User" ENABLE ROW LEVEL SECURITY;

-- Add role column to User table if it doesn't exist
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'User' AND column_name = 'role'
  ) THEN
    ALTER TABLE "User" ADD COLUMN role text DEFAULT 'user';
  END IF;
END $$;

-- Create a trigger to automatically assign the default role to new users
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
DECLARE
  default_role_id uuid;
BEGIN
  -- Get the ID of the default 'user' role
  SELECT id INTO default_role_id FROM roles WHERE name = 'user';
  
  -- Assign the default role to the new user
  IF default_role_id IS NOT NULL THEN
    INSERT INTO user_roles (user_id, role_id)
    VALUES (NEW.id::uuid, default_role_id)
    ON CONFLICT (user_id, role_id) DO NOTHING;
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger on User table
DROP TRIGGER IF EXISTS on_user_created ON "User";
CREATE TRIGGER on_user_created
  AFTER INSERT ON "User"
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();

-- Create RLS policies for User table
CREATE POLICY "Users can read their own data and admins can read all data"
  ON "User"
  FOR SELECT
  USING (
    auth.uid()::text = id::text OR 
    EXISTS (
      SELECT 1 FROM user_roles
      JOIN roles ON user_roles.role_id = roles.id
      WHERE user_roles.user_id = auth.uid()
      AND roles.name = 'admin'
    )
  );

CREATE POLICY "Users can update their own data and admins can update all data"
  ON "User"
  FOR UPDATE
  USING (
    auth.uid()::text = id::text OR 
    EXISTS (
      SELECT 1 FROM user_roles
      JOIN roles ON user_roles.role_id = roles.id
      WHERE user_roles.user_id = auth.uid()
      AND roles.name = 'admin'
    )
  );