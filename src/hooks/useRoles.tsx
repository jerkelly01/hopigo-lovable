import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuthContext } from '@/components/AuthProvider';

interface UserRole {
  role_name: string;
  role_description: string;
}

export function useRoles() {
  const { user } = useAuthContext();
  const [roles, setRoles] = useState<UserRole[]>([]);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (user) {
      fetchUserRoles();
    } else {
      setRoles([]);
      setIsAdmin(false);
      setLoading(false);
    }
  }, [user]);

  const fetchUserRoles = async () => {
    if (!user) return;

    try {
      setLoading(true);
      setError(null);

      // Use the secure function to get user roles
      const { data, error } = await supabase.rpc('get_user_roles');

      if (error) throw error;

      const userRoles = data || [];
      setRoles(userRoles);
      setIsAdmin(userRoles.some(role => role.role_name === 'admin'));
    } catch (err) {
      console.error('Error fetching user roles:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch roles');
      setRoles([]);
      setIsAdmin(false);
    } finally {
      setLoading(false);
    }
  };

  const hasRole = (roleName: string) => {
    return roles.some(role => role.role_name === roleName);
  };

  const assignRole = async (userId: string, roleName: string) => {
    if (!isAdmin) {
      throw new Error('Only administrators can assign roles');
    }

    try {
      const { error } = await supabase.rpc('safe_assign_role', {
        target_user_id: userId,
        role_name: roleName
      });

      if (error) throw error;
      
      // Refresh roles if we're updating current user
      if (userId === user?.id) {
        await fetchUserRoles();
      }
    } catch (err) {
      console.error('Error assigning role:', err);
      throw err;
    }
  };

  return {
    roles,
    isAdmin,
    loading,
    error,
    hasRole,
    assignRole,
    refetch: fetchUserRoles
  };
}