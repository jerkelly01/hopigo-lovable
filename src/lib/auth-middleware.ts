import { supabase } from '@/integrations/supabase/client';
import { Session, User } from '@supabase/supabase-js';

export interface AuthenticatedUser extends User {
  roles?: string[];
  isAdmin?: boolean;
  isActive?: boolean;
  isVerified?: boolean;
}

export interface AuthResult {
  success: boolean;
  user?: AuthenticatedUser;
  session?: Session;
  error?: string;
}

/**
 * Validates the current user session and fetches user data with roles
 */
export async function validateSession(): Promise<AuthResult> {
  try {
    // Get current session
    const { data: { session }, error: sessionError } = await supabase.auth.getSession();
    
    if (sessionError) {
      return { success: false, error: sessionError.message };
    }

    if (!session?.user) {
      return { success: false, error: 'No active session' };
    }

    // Fetch user roles separately to avoid relation issues
    const { data: userRoles, error: rolesError } = await supabase
      .from('user_roles')
      .select(`
        roles (
          name,
          description
        )
      `)
      .eq('user_id', session.user.id);

    if (rolesError) {
      console.error('Error fetching user roles:', rolesError);
    }

    // Fetch user profile separately
    const { data: userProfile, error: profileError } = await supabase
      .from('users')
      .select('*')
      .eq('id', session.user.id)
      .maybeSingle();

    if (profileError) {
      console.error('Error fetching user profile:', profileError);
      // Continue without profile data if fetch fails
    }

    // Extract roles safely
    const roles = Array.isArray(userRoles) 
      ? userRoles.map((ur: any) => ur.roles?.name).filter(Boolean)
      : [];
    
    const authenticatedUser: AuthenticatedUser = {
      ...session.user,
      roles,
      isAdmin: roles.includes('admin'),
      isActive: true, // Default to true since users table doesn't have is_active field
      isVerified: userProfile?.is_verified ?? false,
    };

    return {
      success: true,
      user: authenticatedUser,
      session,
    };
  } catch (error: any) {
    console.error('Session validation error:', error);
    return { success: false, error: error.message || 'Session validation failed' };
  }
}

/**
 * Checks if user has required role
 */
export function hasRequiredRole(user: AuthenticatedUser, requiredRole: string): boolean {
  return user.roles?.includes(requiredRole) || false;
}

/**
 * Checks if user has admin privileges
 */
export function isUserAdmin(user: AuthenticatedUser): boolean {
  return user.isAdmin || false;
}

/**
 * Middleware for protecting routes that require authentication
 */
export async function requireAuth(): Promise<AuthResult> {
  const result = await validateSession();
  
  if (!result.success || !result.user) {
    return { success: false, error: 'Authentication required' };
  }

  if (!result.user.isActive) {
    return { success: false, error: 'Account is deactivated' };
  }

  return result;
}

/**
 * Middleware for protecting admin routes
 */
export async function requireAdmin(): Promise<AuthResult> {
  const result = await requireAuth();
  
  if (!result.success) {
    return result;
  }

  if (!result.user || !isUserAdmin(result.user)) {
    return { success: false, error: 'Administrator privileges required' };
  }

  return result;
}

/**
 * Middleware for protecting routes that require specific roles
 */
export async function requireRole(requiredRole: string): Promise<AuthResult> {
  const result = await requireAuth();
  
  if (!result.success) {
    return result;
  }

  if (!result.user || !hasRequiredRole(result.user, requiredRole)) {
    return { success: false, error: `Role '${requiredRole}' required` };
  }

  return result;
}

/**
 * Secure logout function
 */
export async function secureSignOut(): Promise<{ success: boolean; error?: string }> {
  try {
    // Log security event before logout
    const { data: { user } } = await supabase.auth.getUser();
    
    if (user) {
      await supabase.rpc('log_security_event', {
        event_type: 'logout_initiated',
        user_id_param: user.id,
        description_param: 'User initiated logout',
        metadata_param: { timestamp: new Date().toISOString() }
      });
    }

    // Sign out from Supabase
    const { error } = await supabase.auth.signOut();
    
    if (error) {
      return { success: false, error: error.message };
    }

    // Clear any local storage or additional cleanup
    localStorage.removeItem('supabase.auth.token');
    sessionStorage.clear();

    return { success: true };
  } catch (error: any) {
    console.error('Secure logout error:', error);
    return { success: false, error: error.message || 'Logout failed' };
  }
}