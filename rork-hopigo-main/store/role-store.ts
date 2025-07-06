import { create } from 'zustand';
import { supabase } from '@/lib/supabase';
import { useAuthStore } from './auth-store';

interface RoleState {
  roles: string[];
  isAdmin: boolean;
  isProvider: boolean;
  isLoading: boolean;
  error: string | null;
  
  // Actions
  fetchUserRoles: () => Promise<void>;
  hasRole: (roleName: string) => boolean;
}

export const useRoleStore = create<RoleState>((set, get) => ({
  roles: [],
  isAdmin: false,
  isProvider: false,
  isLoading: false,
  error: null,
  
  fetchUserRoles: async () => {
    const { user } = useAuthStore.getState();
    
    if (!user) {
      set({ roles: [], isAdmin: false, isProvider: false });
      return;
    }
    
    set({ isLoading: true, error: null });
    
    try {
      // Fetch user roles from the database
      const { data, error } = await supabase
        .from('user_roles')
        .select(`
          roles (
            name
          )
        `)
        .eq('user_id', user.id);
      
      if (error) throw error;
      
      // Extract role names from the response
      const roleNames = data?.map(item => item.roles.name) || [];
      
      set({
        roles: roleNames,
        isAdmin: roleNames.includes('admin'),
        isProvider: roleNames.includes('provider'),
        isLoading: false,
      });
    } catch (error) {
      console.error('Error fetching user roles:', error);
      set({
        isLoading: false,
        error: error instanceof Error ? error.message : 'Failed to fetch user roles',
      });
    }
  },
  
  hasRole: (roleName: string) => {
    return get().roles.includes(roleName);
  },
}));

// Initialize roles when auth state changes
useAuthStore.subscribe(
  (state) => state.isAuthenticated,
  (isAuthenticated) => {
    if (isAuthenticated) {
      useRoleStore.getState().fetchUserRoles();
    } else {
      useRoleStore.setState({ roles: [], isAdmin: false, isProvider: false });
    }
  }
);