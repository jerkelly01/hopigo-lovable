
import React, { createContext, useContext, useEffect } from 'react';
import { useAuth, AuthState } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';

interface AuthContextType extends AuthState {
  signUp: (email: string, password: string, options?: { name?: string; language?: string }) => Promise<any>;
  signIn: (email: string, password: string) => Promise<any>;
  signOut: () => Promise<any>;
  resetPassword: (email: string) => Promise<any>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const auth = useAuth();

  useEffect(() => {
    // Security monitoring: Log authentication events
    const logAuthEvent = async (event: string, data?: any) => {
      if (auth.user?.id) {
        try {
          await supabase.rpc('log_security_event', {
            event_type: `auth_${event}`,
            user_id_param: auth.user.id,
            description_param: `User ${event}`,
            metadata_param: data || {}
          });
        } catch (error) {
          console.error('Failed to log auth event:', error);
        }
      }
    };

    // Log login events
    if (auth.user && !auth.loading) {
      logAuthEvent('session_active', {
        user_id: auth.user.id,
        email: auth.user.email,
        timestamp: new Date().toISOString()
      });
    }

    // Set up auth state change monitoring
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === 'SIGNED_IN' && session?.user) {
        await logAuthEvent('signed_in', {
          user_id: session.user.id,
          provider: session.user.app_metadata?.provider || 'email'
        });
      } else if (event === 'SIGNED_OUT') {
        await logAuthEvent('signed_out');
      } else if (event === 'PASSWORD_RECOVERY') {
        await logAuthEvent('password_recovery_initiated');
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [auth.user, auth.loading]);

  return (
    <AuthContext.Provider value={auth}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuthContext() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuthContext must be used within an AuthProvider');
  }
  return context;
}
