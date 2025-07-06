/*
  # User Roles Schema

  1. New Tables
    - `roles`
      - `id` (uuid, primary key)
      - `name` (text, unique)
      - `description` (text)
      - `created_at` (timestamp)
    - `user_roles`
      - `id` (uuid, primary key)
      - `user_id` (uuid, references auth.users)
      - `role_id` (uuid, references roles)
      - `created_at` (timestamp)
  2. Security
    - Enable RLS on both tables
    - Add policies for authenticated users to read roles
    - Add policies for admins to manage roles
*/

-- Create roles table
CREATE TABLE IF NOT EXISTS roles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text UNIQUE NOT NULL,
  description text,
  created_at timestamptz DEFAULT now()
);

-- Create user_roles junction table
CREATE TABLE IF NOT EXISTS user_roles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users NOT NULL,
  role_id uuid REFERENCES roles NOT NULL,
  created_at timestamptz DEFAULT now(),
  UNIQUE(user_id, role_id)
);

-- Enable Row Level Security
ALTER TABLE roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_roles ENABLE ROW LEVEL SECURITY;

-- Create default roles
INSERT INTO roles (name, description)
VALUES 
  ('admin', 'Administrator with full access'),
  ('provider', 'Service provider with access to provider dashboard'),
  ('user', 'Regular user with standard permissions')
ON CONFLICT (name) DO NOTHING;

-- Create policies for roles table
CREATE POLICY "Roles are viewable by authenticated users"
  ON roles
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Roles can be managed by admins"
  ON roles
  USING (
    auth.uid() IN (
      SELECT user_id FROM user_roles
      JOIN roles ON user_roles.role_id = roles.id
      WHERE roles.name = 'admin'
    )
  );

-- Create policies for user_roles table
CREATE POLICY "Users can view their own roles"
  ON user_roles
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "User roles can be managed by admins"
  ON user_roles
  USING (
    auth.uid() IN (
      SELECT user_id FROM user_roles
      JOIN roles ON user_roles.role_id = roles.id
      WHERE roles.name = 'admin'
    )
  );

-- Create function to check if a user has a specific role
CREATE OR REPLACE FUNCTION public.has_role(role_name text)
RETURNS boolean AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1
    FROM user_roles
    JOIN roles ON user_roles.role_id = roles.id
    WHERE user_roles.user_id = auth.uid()
    AND roles.name = role_name
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create function to assign a role to a user
CREATE OR REPLACE FUNCTION public.assign_role(user_id uuid, role_name text)
RETURNS void AS $$
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
$$ LANGUAGE plpgsql SECURITY DEFINER;