-- Ensure users table exists and is compatible with admin dashboard
-- Create users table if it doesn't exist or update structure to match admin expectations

DO $$
BEGIN
    -- Check if users table exists, if not create it
    IF NOT EXISTS (SELECT FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'users') THEN
        CREATE TABLE public.users (
            id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
            email text,
            name text NOT NULL,
            full_name text,
            avatar_url text,
            phone text,
            bio text,
            address text,
            dob text,
            is_service_provider boolean DEFAULT false,
            wallet_balance numeric DEFAULT 0.00,
            loyalty_points integer DEFAULT 0,
            is_active boolean DEFAULT true,
            is_verified boolean DEFAULT false,
            user_type text DEFAULT 'customer',
            language text DEFAULT 'en',
            currency text DEFAULT 'AWG',
            last_login_at timestamp with time zone,
            created_at timestamp with time zone DEFAULT now(),
            updated_at timestamp with time zone DEFAULT now(),
            role text DEFAULT 'user'
        );
    END IF;

    -- Add missing columns if they don't exist
    IF NOT EXISTS (SELECT FROM information_schema.columns WHERE table_name = 'users' AND column_name = 'role') THEN
        ALTER TABLE public.users ADD COLUMN role text DEFAULT 'user';
    END IF;

    IF NOT EXISTS (SELECT FROM information_schema.columns WHERE table_name = 'users' AND column_name = 'full_name') THEN
        ALTER TABLE public.users ADD COLUMN full_name text;
    END IF;

    IF NOT EXISTS (SELECT FROM information_schema.columns WHERE table_name = 'users' AND column_name = 'wallet_balance') THEN
        ALTER TABLE public.users ADD COLUMN wallet_balance numeric DEFAULT 0.00;
    END IF;

    IF NOT EXISTS (SELECT FROM information_schema.columns WHERE table_name = 'users' AND column_name = 'loyalty_points') THEN
        ALTER TABLE public.users ADD COLUMN loyalty_points integer DEFAULT 0;
    END IF;

    IF NOT EXISTS (SELECT FROM information_schema.columns WHERE table_name = 'users' AND column_name = 'user_type') THEN
        ALTER TABLE public.users ADD COLUMN user_type text DEFAULT 'customer';
    END IF;
END $$;

-- Enable RLS on users table
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;

-- Update RLS policies to match admin dashboard expectations
DROP POLICY IF EXISTS "Users can read their own data and admins can read all data" ON public.users;
DROP POLICY IF EXISTS "Users can update their own data and admins can update all data" ON public.users;

-- Users can read their own data and admins can read all data
CREATE POLICY "Users can read their own data and admins can read all data" 
ON public.users 
FOR SELECT 
USING (
    auth.uid()::text = id::text OR 
    EXISTS (
        SELECT 1 FROM user_roles 
        JOIN roles ON user_roles.role_id = roles.id 
        WHERE user_roles.user_id = auth.uid() AND roles.name = 'admin'
    )
);

-- Users can update their own data and admins can update all data
CREATE POLICY "Users can update their own data and admins can update all data" 
ON public.users 
FOR UPDATE 
USING (
    auth.uid()::text = id::text OR 
    EXISTS (
        SELECT 1 FROM user_roles 
        JOIN roles ON user_roles.role_id = roles.id 
        WHERE user_roles.user_id = auth.uid() AND roles.name = 'admin'
    )
);

-- Create trigger to auto-populate users table when auth user is created
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = public
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

-- Drop existing trigger if it exists and create new one
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();