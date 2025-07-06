import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Language } from '@/constants/translations';
import { supabase } from '@/lib/supabase';
import type { User as SupabaseUser } from '@supabase/supabase-js';

export type User = {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  phone?: string;
  bio?: string;
  address?: string;
  dob?: string;
  isServiceProvider?: boolean;
  createdAt: string;
  walletId?: string;
  savedProviders?: string[];
  paymentMethods?: string[];
  language?: Language;
  currency?: "AWG" | "USD" | "EUR";
  isVerified?: boolean;
  lastLoginAt?: string;
  updatedAt?: string;
};

type AuthState = {
  user: User | null;
  supabaseUser: SupabaseUser | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  resetEmailSent: boolean;
  login: (email: string, password: string) => Promise<void>;
  signup: (name: string, email: string, password: string, language?: Language) => Promise<void>;
  logout: () => void;
  updateUser: (user: User) => void;
  forgotPassword: (email: string) => Promise<void>;
  clearResetEmailSent: () => void;
  updateUserLanguage: (language: Language) => void;
  updateUserCurrency: (currency: "AWG" | "USD" | "EUR") => void;
  refreshSession: () => Promise<void>;
  updateProfile: (data: Partial<User>) => Promise<void>;
  initializeAuth: () => Promise<void>;
};

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      supabaseUser: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,
      resetEmailSent: false,
      
      initializeAuth: async () => {
        try {
          set({ isLoading: true });
          
          // Get current session
          const { data: { session }, error } = await supabase.auth.getSession();
          
          if (error) {
            console.error('Error getting session:', error);
            set({ isLoading: false });
            return;
          }
          
          if (session?.user) {
            // Fetch user profile from database
            const { data: userProfile, error: profileError } = await supabase
              .from('users')
              .select('*')
              .eq('id', session.user.id)
              .single();
            
            if (profileError) {
              console.error('Error fetching user profile:', profileError);
            }
            
            const user: User = userProfile ? {
              id: userProfile.id,
              name: userProfile.name,
              email: userProfile.email,
              avatar: userProfile.avatar,
              phone: userProfile.phone,
              bio: userProfile.bio,
              address: userProfile.address,
              dob: userProfile.dob,
              isServiceProvider: userProfile.is_service_provider,
              createdAt: userProfile.created_at,
              walletId: userProfile.wallet_id,
              savedProviders: userProfile.saved_providers,
              paymentMethods: userProfile.payment_methods,
              language: userProfile.language as Language,
              currency: userProfile.currency as "AWG" | "USD" | "EUR",
              isVerified: userProfile.is_verified,
              lastLoginAt: userProfile.last_login_at,
              updatedAt: userProfile.updated_at,
            } : {
              id: session.user.id,
              name: session.user.user_metadata?.name || session.user.email?.split('@')[0] || 'User',
              email: session.user.email || '',
              createdAt: session.user.created_at,
              language: 'en' as Language,
              currency: 'AWG' as const,
            };
            
            set({
              user,
              supabaseUser: session.user,
              isAuthenticated: true,
              isLoading: false,
            });
          } else {
            set({
              user: null,
              supabaseUser: null,
              isAuthenticated: false,
              isLoading: false,
            });
          }
        } catch (error: any) {
          console.error('Initialize auth error:', error);
          set({
            isLoading: false,
            error: error.message || 'Failed to initialize authentication',
          });
        }
      },
      
      login: async (email, password) => {
        try {
          set({ isLoading: true, error: null });
          
          const { data, error } = await supabase.auth.signInWithPassword({
            email,
            password,
          });
          
          if (error) {
            throw error;
          }
          
          if (data.user) {
            // Fetch user profile from database
            const { data: userProfile, error: profileError } = await supabase
              .from('users')
              .select('*')
              .eq('id', data.user.id)
              .single();
            
            if (profileError && profileError.code !== 'PGRST116') {
              console.error('Error fetching user profile:', profileError);
            }
            
            const user: User = userProfile ? {
              id: userProfile.id,
              name: userProfile.name,
              email: userProfile.email,
              avatar: userProfile.avatar,
              phone: userProfile.phone,
              bio: userProfile.bio,
              address: userProfile.address,
              dob: userProfile.dob,
              isServiceProvider: userProfile.is_service_provider,
              createdAt: userProfile.created_at,
              walletId: userProfile.wallet_id,
              savedProviders: userProfile.saved_providers,
              paymentMethods: userProfile.payment_methods,
              language: userProfile.language as Language,
              currency: userProfile.currency as "AWG" | "USD" | "EUR",
              isVerified: userProfile.is_verified,
              lastLoginAt: userProfile.last_login_at,
              updatedAt: userProfile.updated_at,
            } : {
              id: data.user.id,
              name: data.user.user_metadata?.name || data.user.email?.split('@')[0] || 'User',
              email: data.user.email || '',
              createdAt: data.user.created_at,
              language: 'en' as Language,
              currency: 'AWG' as const,
            };
            
            // Update last login
            await supabase
              .from('users')
              .upsert({
                id: data.user.id,
                name: user.name,
                email: user.email,
                last_login_at: new Date().toISOString(),
              });
            
            set({
              user,
              supabaseUser: data.user,
              isAuthenticated: true,
              isLoading: false,
            });
          }
        } catch (error: any) {
          console.error("Login error:", error);
          const errorMessage = error?.message || 'Login failed. Please try again.';
          set({
            isLoading: false,
            error: errorMessage,
          });
          throw error;
        }
      },
      
      signup: async (name, email, password, language = 'en') => {
        try {
          set({ isLoading: true, error: null });
          
          const { data, error } = await supabase.auth.signUp({
            email,
            password,
            options: {
              data: {
                name,
                language,
              },
            },
          });
          
          if (error) {
            throw error;
          }
          
          if (data.user) {
            // Create user profile in database
            const { error: profileError } = await supabase
              .from('users')
              .insert({
                id: data.user.id,
                name,
                email,
                language,
                currency: 'AWG',
                created_at: new Date().toISOString(),
              });
            
            if (profileError) {
              console.error('Error creating user profile:', profileError);
            }
            
            const user: User = {
              id: data.user.id,
              name,
              email,
              createdAt: data.user.created_at,
              language: language as Language,
              currency: 'AWG' as const,
            };
            
            set({
              user,
              supabaseUser: data.user,
              isAuthenticated: true,
              isLoading: false,
            });
          }
        } catch (error: any) {
          console.error("Signup error:", error);
          const errorMessage = error?.message || 'Signup failed. Please try again.';
          set({
            isLoading: false,
            error: errorMessage,
          });
          throw error;
        }
      },
      
      forgotPassword: async (email) => {
        set({ isLoading: true, error: null, resetEmailSent: false });
        
        try {
          const { error } = await supabase.auth.resetPasswordForEmail(email);
          
          if (error) {
            throw error;
          }
          
          set({
            isLoading: false,
            resetEmailSent: true,
            error: null,
          });
        } catch (error: any) {
          console.error("Forgot password error:", error);
          const errorMessage = error?.message || 'Failed to send reset email. Please try again.';
          set({
            isLoading: false,
            error: errorMessage,
            resetEmailSent: false,
          });
          throw error;
        }
      },
      
      clearResetEmailSent: () => {
        set({ resetEmailSent: false, error: null });
      },
      
      logout: async () => {
        try {
          const { error } = await supabase.auth.signOut();
          if (error) {
            console.error("Logout error:", error);
          }
        } catch (error) {
          console.error("Logout error:", error);
        } finally {
          set({
            user: null,
            supabaseUser: null,
            isAuthenticated: false,
            isLoading: false,
            error: null,
            resetEmailSent: false,
          });
        }
      },
      
      updateUser: (updatedUser) => {
        try {
          set((state) => ({
            user: updatedUser,
          }));
        } catch (error) {
          console.error("Update user error:", error);
        }
      },

      updateUserLanguage: async (language: Language) => {
        try {
          const currentUser = get().user;
          if (currentUser) {
            const updatedUser = { ...currentUser, language };
            set({ user: updatedUser });
            
            // Update in database
            await supabase
              .from('users')
              .update({ language })
              .eq('id', currentUser.id);
          }
        } catch (error) {
          console.error("Update user language error:", error);
        }
      },

      updateUserCurrency: async (currency: "AWG" | "USD" | "EUR") => {
        try {
          const currentUser = get().user;
          if (currentUser) {
            const updatedUser = { ...currentUser, currency };
            set({ user: updatedUser });
            
            // Update in database
            await supabase
              .from('users')
              .update({ currency })
              .eq('id', currentUser.id);
          }
        } catch (error) {
          console.error("Update user currency error:", error);
        }
      },

      refreshSession: async () => {
        try {
          const { data, error } = await supabase.auth.refreshSession();
          
          if (error) {
            throw error;
          }
          
          if (data.user) {
            set({ supabaseUser: data.user });
          }
        } catch (error: any) {
          console.error("Refresh session error:", error);
          // If refresh fails, logout user
          get().logout();
          throw error;
        }
      },

      updateProfile: async (data: Partial<User>) => {
        try {
          set({ isLoading: true, error: null });
          
          const currentUser = get().user;
          if (!currentUser) {
            throw new Error('No user logged in');
          }
          
          // Convert User fields to database fields
          const dbData: any = {};
          if (data.name !== undefined) dbData.name = data.name;
          if (data.phone !== undefined) dbData.phone = data.phone;
          if (data.bio !== undefined) dbData.bio = data.bio;
          if (data.address !== undefined) dbData.address = data.address;
          if (data.dob !== undefined) dbData.dob = data.dob;
          if (data.avatar !== undefined) dbData.avatar = data.avatar;
          if (data.language !== undefined) dbData.language = data.language;
          if (data.currency !== undefined) dbData.currency = data.currency;
          
          dbData.updated_at = new Date().toISOString();
          
          const { error } = await supabase
            .from('users')
            .update(dbData)
            .eq('id', currentUser.id);
          
          if (error) {
            throw error;
          }
          
          const updatedUser = { ...currentUser, ...data };
          set({
            user: updatedUser,
            isLoading: false,
          });
        } catch (error: any) {
          console.error("Update profile error:", error);
          const errorMessage = error?.message || 'Failed to update profile.';
          set({
            isLoading: false,
            error: errorMessage,
          });
          throw error;
        }
      },
    }),
    {
      name: 'auth-storage',
      storage: createJSONStorage(() => AsyncStorage),
      // Only persist basic user data, not sensitive auth tokens
      partialize: (state) => ({
        user: state.user,
        isAuthenticated: state.isAuthenticated,
      }),
      // Add error handling for storage
      onRehydrateStorage: () => (state, error) => {
        if (error) {
          console.error("Auth store rehydration error:", error);
        }
      },
    }
  )
);

// Listen to auth changes
supabase.auth.onAuthStateChange((event, session) => {
  const store = useAuthStore.getState();
  
  if (event === 'SIGNED_IN' && session?.user) {
    // User signed in, initialize will be called
    store.initializeAuth();
  } else if (event === 'SIGNED_OUT') {
    // User signed out
    store.logout();
  } else if (event === 'TOKEN_REFRESHED' && session?.user) {
    // Token refreshed
    useAuthStore.setState({ supabaseUser: session.user });
  }
});