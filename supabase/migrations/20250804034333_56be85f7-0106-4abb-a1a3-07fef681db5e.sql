-- Fix remaining database security issues (without non-existent tables)

-- 1. Enable RLS on tables that exist and are missing it
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE security_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_subscriptions ENABLE ROW LEVEL SECURITY;

-- 2. Add missing RLS policies for existing tables
CREATE POLICY "System can insert security events"
ON security_events
FOR INSERT
WITH CHECK (true);

CREATE POLICY "Admins can read security events"
ON security_events
FOR SELECT
USING (public.is_admin());

CREATE POLICY "Users can read their own security events"
ON security_events
FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can read their own subscriptions"
ON user_subscriptions
FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own subscriptions"
ON user_subscriptions
FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own subscriptions"
ON user_subscriptions
FOR UPDATE
USING (auth.uid() = user_id);

CREATE POLICY "Admins can manage all subscriptions"
ON user_subscriptions
FOR ALL
USING (public.is_admin());

-- 3. Fix users table policies for secure access
CREATE POLICY "Users can read their own user record"
ON users
FOR SELECT
USING (auth.uid() = id);

CREATE POLICY "Users can update their own user record"
ON users
FOR UPDATE
USING (auth.uid() = id);

CREATE POLICY "Admins can read all user records"
ON users
FOR SELECT
USING (public.is_admin());

CREATE POLICY "Admins can update all user records"
ON users
FOR UPDATE
USING (public.is_admin());

CREATE POLICY "System can create user records"
ON users
FOR INSERT
WITH CHECK (true);

-- 4. Add comprehensive audit logging trigger for security events
CREATE OR REPLACE FUNCTION public.audit_security_sensitive_operations()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public'
AS $$
BEGIN
    -- Log security-sensitive operations
    IF TG_OP = 'UPDATE' AND TG_TABLE_NAME = 'user_roles' THEN
        PERFORM public.log_security_event(
            'role_change',
            COALESCE(NEW.user_id, OLD.user_id),
            'User role assignment changed',
            jsonb_build_object(
                'old_role_id', OLD.role_id,
                'new_role_id', NEW.role_id,
                'changed_by', auth.uid()
            )
        );
    END IF;
    
    RETURN COALESCE(NEW, OLD);
END;
$$;

-- Apply audit trigger to user_roles table
DROP TRIGGER IF EXISTS audit_user_roles_trigger ON user_roles;
CREATE TRIGGER audit_user_roles_trigger
    AFTER INSERT OR UPDATE OR DELETE ON user_roles
    FOR EACH ROW
    EXECUTE FUNCTION public.audit_security_sensitive_operations();