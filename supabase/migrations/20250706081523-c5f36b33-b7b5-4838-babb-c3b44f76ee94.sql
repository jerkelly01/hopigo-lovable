-- Fix search_path security issue for handle_new_user function
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
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
$$;