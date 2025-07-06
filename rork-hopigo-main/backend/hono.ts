import { Hono } from "hono";
import { trpcServer } from "@hono/trpc-server";
import { cors } from "hono/cors";
import { logger } from "hono/logger";
import { prettyJSON } from "hono/pretty-json";
import { secureHeaders } from "hono/secure-headers";
import { appRouter } from "./trpc/app-router";
import { createContext } from "./trpc/create-context";
import type { Context } from "hono";

// app will be mounted at /api
const app = new Hono();

// Security middleware
app.use("*", secureHeaders());

// CORS configuration
app.use("*", cors({
  origin: ["http://localhost:8081", "https://localhost:8081", "exp://192.168.1.100:8081"],
  allowMethods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowHeaders: ["Content-Type", "Authorization", "X-Requested-With"],
  credentials: true,
}));

// Logging middleware
app.use("*", logger());

// Pretty JSON for development
app.use("*", prettyJSON());

// Simple rate limiting middleware (in-memory)
const rateLimitMap = new Map<string, { count: number; resetTime: number }>();

app.use("*", async (c: Context, next) => {
  const ip = c.req.header("x-forwarded-for") ?? "anonymous";
  const now = Date.now();
  const windowMs = 15 * 60 * 1000; // 15 minutes
  const limit = 100;
  
  const current = rateLimitMap.get(ip);
  
  if (!current || now > current.resetTime) {
    rateLimitMap.set(ip, { count: 1, resetTime: now + windowMs });
  } else if (current.count >= limit) {
    return c.json({ error: "Too many requests" }, 429);
  } else {
    current.count++;
  }
  
  await next();
});

// Global error handler
app.onError((err, c) => {
  console.error("API Error:", err);
  
  // Don't expose internal errors in production
  const isDev = process.env.NODE_ENV === "development";
  
  if (err.name === "ValidationError") {
    return c.json({
      error: "Validation failed",
      message: isDev ? err.message : "Invalid input data",
      code: "VALIDATION_ERROR"
    }, 400);
  }
  
  if (err.name === "UnauthorizedError") {
    return c.json({
      error: "Unauthorized",
      message: "Authentication required",
      code: "UNAUTHORIZED"
    }, 401);
  }
  
  if (err.name === "ForbiddenError") {
    return c.json({
      error: "Forbidden",
      message: "Insufficient permissions",
      code: "FORBIDDEN"
    }, 403);
  }
  
  if (err.name === "NotFoundError") {
    return c.json({
      error: "Not found",
      message: "Resource not found",
      code: "NOT_FOUND"
    }, 404);
  }
  
  // Generic server error
  return c.json({
    error: "Internal server error",
    message: isDev ? err.message : "Something went wrong",
    code: "INTERNAL_ERROR",
    ...(isDev && { stack: err.stack })
  }, 500);
});

// Health check endpoint
app.get("/health", (c) => {
  return c.json({ 
    status: "ok", 
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    version: "1.0.0"
  });
});

// API documentation endpoint
app.get("/", (c) => {
  return c.json({
    name: "HopiGo API",
    version: "1.0.0",
    description: "Comprehensive service marketplace API for Aruba",
    endpoints: {
      health: "/api/health",
      trpc: "/api/trpc",
      docs: "/api/"
    },
    features: [
      "Authentication & Authorization",
      "Service Marketplace",
      "Wallet & Payments",
      "Real-time Notifications",
      "Taxi Services",
      "Provider Management",
      "Booking System"
    ]
  });
});

// Mount tRPC router at /trpc with enhanced error handling
app.use(
  "/trpc/*",
  trpcServer({
    endpoint: "/api/trpc",
    router: appRouter,
    createContext: async (opts) => {
      // Create context with the correct parameters
      const context = await createContext({ req: opts.req });
      return context;
    },
    onError: ({ error, type, path, input, ctx, req }) => {
      console.error(`tRPC Error [${type}] ${path}:`, error);
      
      // Log additional context in development
      if (process.env.NODE_ENV === "development") {
        console.error("Input:", input);
        console.error("Context:", ctx);
      }
    },
  })
);

// 404 handler for unmatched routes
app.notFound((c) => {
  return c.json({
    error: "Not found",
    message: "The requested endpoint does not exist",
    code: "ENDPOINT_NOT_FOUND",
    path: c.req.path
  }, 404);
});

export default app;