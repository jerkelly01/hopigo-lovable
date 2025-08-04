import { z } from "zod";
import { publicProcedure } from "../../create-context";
import { TRPCError } from "@trpc/server";
import { createClient } from '@supabase/supabase-js';

// Create Supabase client for server-side operations
const supabaseUrl = process.env.SUPABASE_URL || 'https://mswxfxvqlhfqsmckezci.supabase.co';
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseServiceKey) {
  throw new Error('SUPABASE_SERVICE_ROLE_KEY environment variable is required');
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

export const loginProcedure = publicProcedure
  .input(
    z.object({
      email: z.string().email(),
      password: z.string().min(6),
    })
  )
  .mutation(async ({ input }) => {
    const { email, password } = input;

    try {
      // Use Supabase Auth for authentication
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      });

      if (error) {
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: error.message,
        });
      }

      if (!data.user || !data.session) {
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "Authentication failed",
        });
      }

      // Get user profile and roles
      const { data: userProfile, error: profileError } = await supabase
        .from('users')
        .select(`
          *,
          user_roles (
            roles (
              name,
              description
            )
          )
        `)
        .eq('id', data.user.id)
        .single();

      if (profileError) {
        console.error('Error fetching user profile:', profileError);
      }

      // Extract roles
      const roles = userProfile?.user_roles?.map((ur: any) => ur.roles.name) || [];

      return {
        user: {
          id: data.user.id,
          email: data.user.email!,
          name: userProfile?.name || data.user.user_metadata?.name || 'User',
          full_name: userProfile?.full_name,
          roles,
          is_verified: userProfile?.is_verified || false,
          is_active: userProfile?.is_active || true,
          user_type: userProfile?.user_type || 'customer'
        },
        session: data.session,
        access_token: data.session.access_token,
        refresh_token: data.session.refresh_token,
      };
    } catch (error: any) {
      if (error instanceof TRPCError) {
        throw error;
      }
      
      console.error('Login error:', error);
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Authentication service unavailable",
      });
    }
  });