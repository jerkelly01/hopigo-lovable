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

export const signupProcedure = publicProcedure
  .input(
    z.object({
      email: z.string().email(),
      password: z.string().min(8).max(128).regex(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/,
        "Password must contain at least one lowercase letter, one uppercase letter, one number, and one special character"
      ),
      name: z.string().min(2).max(100).trim(),
      role: z.enum(["user", "provider"]).default("user"),
      language: z.enum(["en", "es", "nl"]).default("en"),
    })
  )
  .mutation(async ({ input }) => {
    const { email, password, name, role, language } = input;

    try {
      // Sanitize input data
      const sanitizedEmail = email.toLowerCase().trim();
      const sanitizedName = name.trim();

      // Use Supabase Auth for user creation
      const { data, error } = await supabase.auth.signUp({
        email: sanitizedEmail,
        password,
        options: {
          data: {
            name: sanitizedName,
            language,
            isServiceProvider: role === "provider",
          },
          emailRedirectTo: `${process.env.FRONTEND_URL || 'http://localhost:3000'}/auth?verified=true`
        }
      });

      if (error) {
        // Handle specific Supabase errors
        if (error.message.includes('already registered')) {
          throw new TRPCError({
            code: "CONFLICT",
            message: "A user with this email already exists",
          });
        }
        
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: error.message,
        });
      }

      if (!data.user) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to create user account",
        });
      }

      // The user profile will be created automatically by the handle_new_user trigger
      // Assign default role if this is a provider
      if (role === "provider") {
        try {
          await supabase.rpc('safe_assign_role', {
            target_user_id: data.user.id,
            role_name: 'provider'
          });
        } catch (roleError) {
          console.error('Error assigning provider role:', roleError);
          // Don't fail the signup if role assignment fails
        }
      }

      return {
        user: {
          id: data.user.id,
          email: data.user.email!,
          name: sanitizedName,
          role,
          created_at: data.user.created_at,
          email_confirmed: data.user.email_confirmed_at !== null,
        },
        session: data.session,
        message: data.user.email_confirmed_at 
          ? "Account created successfully" 
          : "Account created. Please check your email to verify your account.",
      };
    } catch (error: any) {
      if (error instanceof TRPCError) {
        throw error;
      }
      
      console.error('Signup error:', error);
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Account creation service unavailable",
      });
    }
  });