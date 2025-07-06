import { z } from "zod";
import { TRPCError } from "@trpc/server";
import { createTRPCRouter, protectedProcedure, commonSchemas } from "../../create-context";

export const userRouter = createTRPCRouter({
  // Update user profile
  updateProfile: protectedProcedure
    .input(z.object({
      name: z.string().min(2, "Name must be at least 2 characters").optional(),
      phone: commonSchemas.phone.optional(),
      bio: z.string().optional(),
      address: z.string().optional(),
      dob: z.string().optional(),
      language: commonSchemas.language.optional(),
      currency: commonSchemas.currency.optional(),
    }))
    .mutation(async ({ input, ctx }) => {
      const { db, getCurrentTime, user } = ctx;
      
      // Update user data
      const updatedUser = { ...user };
      
      if (input.name) updatedUser.name = input.name;
      if (input.phone) updatedUser.phone = input.phone;
      if (input.bio) updatedUser.bio = input.bio;
      if (input.address) updatedUser.address = input.address;
      if (input.dob) updatedUser.dob = input.dob;
      if (input.language) updatedUser.language = input.language;
      if (input.currency) updatedUser.currency = input.currency;
      
      updatedUser.updatedAt = getCurrentTime();
      
      db.users.set(user.id, updatedUser);
      
      // Remove password from response
      const { password, ...userResponse } = updatedUser;
      
      return {
        user: userResponse,
        message: "Profile updated successfully",
      };
    }),

  // Upload avatar
  uploadAvatar: protectedProcedure
    .input(z.object({
      imageData: z.string().min(1, "Image data is required"),
      mimeType: z.string().regex(/^image\/(jpeg|jpg|png|gif)$/, "Invalid image type"),
    }))
    .mutation(async ({ input, ctx }) => {
      const { db, getCurrentTime, user } = ctx;
      
      // In production, upload to cloud storage and get URL
      // For demo, we'll use a placeholder URL
      const avatarUrl = `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.id}&t=${Date.now()}`;
      
      const updatedUser = { ...user };
      updatedUser.avatar = avatarUrl;
      updatedUser.updatedAt = getCurrentTime();
      
      db.users.set(user.id, updatedUser);
      
      return {
        avatarUrl,
        message: "Avatar updated successfully",
      };
    }),

  // Get user preferences
  getPreferences: protectedProcedure
    .query(async ({ ctx }) => {
      const { user } = ctx;
      
      // Mock user preferences
      const preferences = {
        notifications: {
          push: true,
          email: true,
          sms: false,
        },
        privacy: {
          profileVisible: true,
          showLocation: true,
          showPhone: false,
        },
        app: {
          theme: "system",
          language: user.language || "en",
          currency: user.currency || "AWG",
        },
      };
      
      return { preferences };
    }),

  // Update user preferences
  updatePreferences: protectedProcedure
    .input(z.object({
      notifications: z.object({
        push: z.boolean().optional(),
        email: z.boolean().optional(),
        sms: z.boolean().optional(),
      }).optional(),
      privacy: z.object({
        profileVisible: z.boolean().optional(),
        showLocation: z.boolean().optional(),
        showPhone: z.boolean().optional(),
      }).optional(),
      app: z.object({
        theme: z.enum(["light", "dark", "system"]).optional(),
        language: commonSchemas.language.optional(),
        currency: commonSchemas.currency.optional(),
      }).optional(),
    }))
    .mutation(async ({ input, ctx }) => {
      const { db, getCurrentTime, user } = ctx;
      
      // In production, store preferences in database
      // For demo, we'll just update user language and currency
      const updatedUser = { ...user };
      
      if (input.app?.language) {
        updatedUser.language = input.app.language;
      }
      
      if (input.app?.currency) {
        updatedUser.currency = input.app.currency;
      }
      
      updatedUser.updatedAt = getCurrentTime();
      
      db.users.set(user.id, updatedUser);
      
      return {
        message: "Preferences updated successfully",
      };
    }),

  // Get saved providers
  getSavedProviders: protectedProcedure
    .input(z.object({
      page: z.number().min(1).default(1),
      limit: z.number().min(1).max(100).default(20),
    }))
    .query(async ({ input, ctx }) => {
      const { user } = ctx;
      
      // Mock saved providers
      const savedProviders = [
        {
          id: "provider1",
          name: "Clean Pro Aruba",
          description: "Professional cleaning services",
          rating: 4.8,
          reviewCount: 156,
          avatar: "https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=400",
          services: ["cleaning"],
          savedAt: "2024-01-15T10:00:00Z",
        },
      ];
      
      // Apply pagination
      const startIndex = (input.page - 1) * input.limit;
      const endIndex = startIndex + input.limit;
      const paginatedProviders = savedProviders.slice(startIndex, endIndex);
      
      return {
        providers: paginatedProviders,
        pagination: {
          page: input.page,
          limit: input.limit,
          total: savedProviders.length,
          totalPages: Math.ceil(savedProviders.length / input.limit),
        },
      };
    }),

  // Save/unsave provider
  toggleSavedProvider: protectedProcedure
    .input(z.object({
      providerId: commonSchemas.id,
    }))
    .mutation(async ({ input, ctx }) => {
      const { db, getCurrentTime, user } = ctx;
      
      const updatedUser = { ...user };
      const savedProviders = updatedUser.savedProviders || [];
      
      const isCurrentlySaved = savedProviders.includes(input.providerId);
      
      if (isCurrentlySaved) {
        updatedUser.savedProviders = savedProviders.filter((id: string) => id !== input.providerId);
      } else {
        updatedUser.savedProviders = [...savedProviders, input.providerId];
      }
      
      updatedUser.updatedAt = getCurrentTime();
      
      db.users.set(user.id, updatedUser);
      
      return {
        isSaved: !isCurrentlySaved,
        message: isCurrentlySaved ? "Provider removed from favorites" : "Provider added to favorites",
      };
    }),

  // Delete account
  deleteAccount: protectedProcedure
    .input(z.object({
      password: z.string().min(1, "Password is required for account deletion"),
      reason: z.string().optional(),
    }))
    .mutation(async ({ input, ctx }) => {
      const { db, user } = ctx;
      
      // In production, verify password before deletion
      
      // Mark user as deleted instead of actually deleting
      const updatedUser = { ...user };
      updatedUser.isDeleted = true;
      updatedUser.deletedAt = ctx.getCurrentTime();
      updatedUser.deletionReason = input.reason;
      
      db.users.set(user.id, updatedUser);
      
      // Remove all sessions
      Array.from(db.sessions.entries()).forEach(([token, session]) => {
        if (session.userId === user.id) {
          db.sessions.delete(token);
        }
      });
      
      return {
        message: "Account deleted successfully",
      };
    }),
});