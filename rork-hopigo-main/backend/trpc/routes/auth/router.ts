import { z } from "zod";
import { TRPCError } from "@trpc/server";
import { createTRPCRouter, publicProcedure, protectedProcedure, commonSchemas } from "../../create-context";

export const authRouter = createTRPCRouter({
  // Register new user
  register: publicProcedure
    .input(z.object({
      name: z.string().min(2, "Name must be at least 2 characters"),
      email: commonSchemas.email,
      password: commonSchemas.password,
      language: commonSchemas.language,
      isServiceProvider: z.boolean().default(false),
    }))
    .mutation(async ({ input, ctx }) => {
      const { db, generateId, getCurrentTime } = ctx;
      
      // Check if user already exists
      const existingUser = Array.from(db.users.values()).find(
        user => user.email === input.email
      );
      
      if (existingUser) {
        throw new TRPCError({
          code: "CONFLICT",
          message: "User with this email already exists",
        });
      }
      
      // Create new user
      const userId = generateId();
      const currentTime = getCurrentTime();
      
      const userWithPassword = {
        id: userId,
        name: input.name,
        email: input.email,
        password: input.password, // Store password (in production, hash first)
        language: input.language,
        isServiceProvider: input.isServiceProvider,
        avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${userId}`,
        createdAt: currentTime,
        updatedAt: currentTime,
        isVerified: false,
        walletId: `wallet-${userId}`,
        currency: "AWG" as const,
      };
      
      // Store user in database
      db.users.set(userId, userWithPassword);
      
      // Create session token
      const token = generateId();
      db.sessions.set(token, {
        userId,
        createdAt: currentTime,
        expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(), // 30 days
      });
      
      // Return user without password
      const { password, ...userResponse } = userWithPassword;
      
      return {
        user: userResponse,
        token,
        message: "Account created successfully",
      };
    }),

  // Login user
  login: publicProcedure
    .input(z.object({
      email: commonSchemas.email,
      password: z.string().min(1, "Password is required"),
    }))
    .mutation(async ({ input, ctx }) => {
      const { db, generateId, getCurrentTime } = ctx;
      
      // Find user by email
      const user = Array.from(db.users.values()).find(
        user => user.email === input.email
      );
      
      if (!user) {
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "Invalid email or password",
        });
      }
      
      // In production, verify password hash
      if (user.password !== input.password) {
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "Invalid email or password",
        });
      }
      
      // Create session token
      const token = generateId();
      const currentTime = getCurrentTime();
      
      db.sessions.set(token, {
        userId: user.id,
        createdAt: currentTime,
        expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(), // 30 days
      });
      
      // Update last login
      const updatedUser = {
        ...user,
        lastLoginAt: currentTime,
        updatedAt: currentTime,
      };
      db.users.set(user.id, updatedUser);
      
      // Remove password from response
      const { password, ...userResponse } = updatedUser;
      
      return {
        user: userResponse,
        token,
        message: "Login successful",
      };
    }),

  // Logout user
  logout: protectedProcedure
    .mutation(async ({ ctx }) => {
      const { db, token } = ctx;
      
      if (token) {
        db.sessions.delete(token);
      }
      
      return {
        message: "Logout successful",
      };
    }),

  // Refresh token
  refreshToken: protectedProcedure
    .mutation(async ({ ctx }) => {
      const { db, generateId, getCurrentTime, user } = ctx;
      
      // Create new session token
      const newToken = generateId();
      const currentTime = getCurrentTime();
      
      db.sessions.set(newToken, {
        userId: user.id,
        createdAt: currentTime,
        expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(), // 30 days
      });
      
      // Remove old token
      if (ctx.token) {
        db.sessions.delete(ctx.token);
      }
      
      return {
        token: newToken,
        message: "Token refreshed successfully",
      };
    }),

  // Forgot password
  forgotPassword: publicProcedure
    .input(z.object({
      email: commonSchemas.email,
    }))
    .mutation(async ({ input, ctx }) => {
      // Always return success for security (don't reveal if email exists)
      // In production, send reset email if user exists
      
      return {
        message: "If an account with this email exists, a password reset link has been sent",
      };
    }),

  // Reset password
  resetPassword: publicProcedure
    .input(z.object({
      token: z.string().min(1, "Reset token is required"),
      password: commonSchemas.password,
    }))
    .mutation(async ({ input, ctx }) => {
      // In production, verify reset token and update password
      // For demo, we'll just return success
      
      return {
        message: "Password reset successfully",
      };
    }),

  // Verify email
  verifyEmail: publicProcedure
    .input(z.object({
      token: z.string().min(1, "Verification token is required"),
    }))
    .mutation(async ({ input, ctx }) => {
      // In production, verify email token and mark user as verified
      // For demo, we'll just return success
      
      return {
        message: "Email verified successfully",
      };
    }),

  // Get current user
  me: protectedProcedure
    .query(async ({ ctx }) => {
      const { user } = ctx;
      
      // Remove sensitive data
      const { password, ...userResponse } = user;
      
      return {
        user: userResponse,
      };
    }),

  // Change password
  changePassword: protectedProcedure
    .input(z.object({
      currentPassword: z.string().min(1, "Current password is required"),
      newPassword: commonSchemas.password,
    }))
    .mutation(async ({ input, ctx }) => {
      const { db, getCurrentTime, user } = ctx;
      
      // In production, verify current password
      if (user.password !== input.currentPassword) {
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "Current password is incorrect",
        });
      }
      
      // Update password
      const currentTime = getCurrentTime();
      const updatedUser = {
        ...user,
        password: input.newPassword,
        updatedAt: currentTime,
      };
      
      db.users.set(user.id, updatedUser);
      
      return {
        message: "Password changed successfully",
      };
    }),
});