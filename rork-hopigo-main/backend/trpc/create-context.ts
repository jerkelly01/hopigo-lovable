import { z } from "zod";
import { TRPCError } from "@trpc/server";

// Mock database
export const db = {
  users: new Map(),
  sessions: new Map(),
  services: new Map(),
  bookings: new Map(),
  providers: new Map(),
  notifications: new Map(),
  transactions: new Map(),
  rides: new Map(),
  drivers: new Map(),
};

// Common validation schemas
export const commonSchemas = {
  id: z.string().min(1, "ID is required"),
  email: z.string().email("Invalid email address"),
  phone: z.string().regex(/^\+?[\d\s\-\(\)]+$/, "Invalid phone number").optional(),
  password: z.string().min(8, "Password must be at least 8 characters"),
  language: z.enum(["en", "es", "nl"]).default("en"),
  currency: z.enum(["AWG", "USD", "EUR"]).default("AWG"),
  coordinates: z.object({
    latitude: z.number(),
    longitude: z.number(),
  }),
  pagination: z.object({
    page: z.number().min(1).default(1),
    limit: z.number().min(1).max(100).default(20),
  }),
};

// Helper functions
export const generateId = () => Math.random().toString(36).substring(2, 15);
export const getCurrentTime = () => new Date().toISOString();

// Context type - properly extends Record<string, unknown> for tRPC compatibility
export interface Context extends Record<string, unknown> {
  db: typeof db;
  generateId: typeof generateId;
  getCurrentTime: typeof getCurrentTime;
  user?: any;
  token?: string;
}

// Create context function
export const createContext = async (opts: { req?: any }): Promise<Context> => {
  const token = opts.req?.headers?.authorization?.replace('Bearer ', '');
  
  let user = null;
  if (token) {
    const session = db.sessions.get(token);
    if (session && new Date(session.expiresAt) > new Date()) {
      user = db.users.get(session.userId);
    }
  }

  return {
    db,
    generateId,
    getCurrentTime,
    user,
    token,
  };
};

// Base router
import { initTRPC } from '@trpc/server';
import superjson from 'superjson';

const t = initTRPC.context<Context>().create({
  transformer: superjson,
});

export const createTRPCRouter = t.router;
export const publicProcedure = t.procedure;

// Protected procedure
export const protectedProcedure = t.procedure.use(async (opts) => {
  const { ctx } = opts;
  
  if (!ctx.user) {
    throw new TRPCError({
      code: 'UNAUTHORIZED',
      message: 'You must be logged in to access this resource',
    });
  }

  return opts.next({
    ctx: {
      ...ctx,
      user: ctx.user,
    },
  });
});

// Provider procedure (for service providers)
export const providerProcedure = protectedProcedure.use(async (opts) => {
  const { ctx } = opts;
  
  if (!ctx.user.isServiceProvider) {
    throw new TRPCError({
      code: 'FORBIDDEN',
      message: 'You must be a service provider to access this resource',
    });
  }

  return opts.next({
    ctx: {
      ...ctx,
      user: ctx.user,
    },
  });
});