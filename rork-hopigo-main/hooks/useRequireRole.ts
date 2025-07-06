import { useEffect } from 'react';
import { useRouter } from 'expo-router';
import { useRoleStore } from '@/store/role-store';
import { useAuthStore } from '@/store/auth-store';

/**
 * Hook to require a specific role for accessing a page
 * @param requiredRole The role required to access the page
 * @param redirectTo The path to redirect to if the user doesn't have the required role
 */
export function useRequireRole(requiredRole: string, redirectTo: string = '/') {
  const router = useRouter();
  const { isAuthenticated } = useAuthStore();
  const { roles, isLoading, fetchUserRoles } = useRoleStore();
  
  useEffect(() => {
    // If not authenticated, redirect immediately
    if (!isAuthenticated) {
      router.replace('/auth/login');
      return;
    }
    
    // Fetch roles if not already loaded
    if (roles.length === 0 && !isLoading) {
      fetchUserRoles();
    }
    
    // Check if user has the required role
    if (!isLoading && roles.length > 0 && !roles.includes(requiredRole)) {
      router.replace(redirectTo);
    }
  }, [isAuthenticated, roles, isLoading, requiredRole, redirectTo, router]);
  
  return {
    hasRequiredRole: roles.includes(requiredRole),
    isLoading,
  };
}