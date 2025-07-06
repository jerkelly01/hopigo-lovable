
-- Update the existing users table to work better with Supabase auth
ALTER TABLE public.users 
DROP CONSTRAINT IF EXISTS users_pkey CASCADE;

ALTER TABLE public.users 
ALTER COLUMN id SET DEFAULT auth.uid();

ALTER TABLE public.users 
ADD CONSTRAINT users_pkey PRIMARY KEY (id);

-- Add missing columns that your app expects
ALTER TABLE public.users 
ADD COLUMN IF NOT EXISTS name TEXT,
ADD COLUMN IF NOT EXISTS bio TEXT,
ADD COLUMN IF NOT EXISTS address TEXT,
ADD COLUMN IF NOT EXISTS dob TEXT,
ADD COLUMN IF NOT EXISTS is_service_provider BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS wallet_id TEXT,
ADD COLUMN IF NOT EXISTS saved_providers TEXT[],
ADD COLUMN IF NOT EXISTS payment_methods TEXT[],
ADD COLUMN IF NOT EXISTS language TEXT DEFAULT 'en',
ADD COLUMN IF NOT EXISTS currency TEXT DEFAULT 'AWG',
ADD COLUMN IF NOT EXISTS is_verified BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS last_login_at TIMESTAMP WITH TIME ZONE;

-- Create function to handle new user creation
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
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
    NOW(),
    NOW()
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger for new user creation
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();

-- Update RLS policies for users table
DROP POLICY IF EXISTS "Users can read their own data" ON public.users;
DROP POLICY IF EXISTS "Users can update their own data" ON public.users;
DROP POLICY IF EXISTS "Anyone can insert users" ON public.users;

CREATE POLICY "Users can read their own data" ON public.users
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update their own data" ON public.users
  FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Users can insert their own data" ON public.users
  FOR INSERT WITH CHECK (auth.uid() = id);
