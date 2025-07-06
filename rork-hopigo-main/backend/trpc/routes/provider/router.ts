import { z } from "zod";
import { TRPCError } from "@trpc/server";
import { createTRPCRouter, protectedProcedure, providerProcedure, commonSchemas } from "../../create-context";

export const providerRouter = createTRPCRouter({
  // Get provider dashboard data
  getDashboard: providerProcedure
    .query(async ({ ctx }) => {
      const { db, user } = ctx;
      
      // Get provider's bookings
      const bookings = Array.from(db.bookings.values()).filter(
        booking => booking.providerId === user.id
      );
      
      // Calculate stats
      const totalBookings = bookings.length;
      const completedBookings = bookings.filter(b => b.status === "completed").length;
      const pendingBookings = bookings.filter(b => b.status === "pending").length;
      const totalRevenue = bookings
        .filter(b => b.status === "completed")
        .reduce((sum, b) => sum + (b.estimatedPrice || 0), 0);
      
      // Recent bookings
      const recentBookings = bookings
        .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
        .slice(0, 5);
      
      return {
        stats: {
          totalBookings,
          completedBookings,
          pendingBookings,
          totalRevenue,
          currency: user.currency || "AWG",
        },
        recentBookings,
      };
    }),

  // Get provider bookings
  getBookings: providerProcedure
    .input(z.object({
      status: z.enum(["all", "pending", "accepted", "in_progress", "completed", "cancelled"]).default("all"),
      startDate: z.string().datetime().optional(),
      endDate: z.string().datetime().optional(),
      page: z.number().min(1).default(1),
      limit: z.number().min(1).max(100).default(20),
    }))
    .query(async ({ input, ctx }) => {
      const { db, user } = ctx;
      
      // Get provider's bookings
      let bookings = Array.from(db.bookings.values()).filter(
        booking => booking.providerId === user.id
      );
      
      // Filter by status
      if (input.status !== "all") {
        bookings = bookings.filter(booking => booking.status === input.status);
      }
      
      // Filter by date range
      if (input.startDate && input.endDate) {
        bookings = bookings.filter(booking => {
          const bookingDate = new Date(booking.date);
          return bookingDate >= new Date(input.startDate!) && bookingDate <= new Date(input.endDate!);
        });
      }
      
      // Sort by date (newest first)
      bookings.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
      
      // Apply pagination
      const startIndex = (input.page - 1) * input.limit;
      const endIndex = startIndex + input.limit;
      const paginatedBookings = bookings.slice(startIndex, endIndex);
      
      return {
        bookings: paginatedBookings,
        pagination: {
          page: input.page,
          limit: input.limit,
          total: bookings.length,
          totalPages: Math.ceil(bookings.length / input.limit),
        },
      };
    }),

  // Update provider profile
  updateProfile: providerProcedure
    .input(z.object({
      name: z.string().min(2, "Name must be at least 2 characters").optional(),
      description: z.string().optional(),
      services: z.array(z.string()).optional(),
      availability: z.string().optional(),
      location: commonSchemas.coordinates.extend({
        address: z.string(),
      }).optional(),
      pricing: z.record(z.object({
        min: z.number().min(0),
        max: z.number().min(0),
        currency: commonSchemas.currency,
      })).optional(),
    }))
    .mutation(async ({ input, ctx }) => {
      const { db, getCurrentTime, user } = ctx;
      
      // Update user profile
      const updatedUser = { ...user };
      
      if (input.name) updatedUser.name = input.name;
      if (input.description) updatedUser.bio = input.description;
      
      updatedUser.updatedAt = getCurrentTime();
      
      db.users.set(user.id, updatedUser);
      
      // Update provider-specific data
      let provider = db.providers.get(user.id);
      if (!provider) {
        provider = {
          id: user.id,
          userId: user.id,
          createdAt: getCurrentTime(),
        };
      }
      
      if (input.services) provider.services = input.services;
      if (input.availability) provider.availability = input.availability;
      if (input.location) provider.location = input.location;
      if (input.pricing) provider.pricing = input.pricing;
      
      provider.updatedAt = getCurrentTime();
      
      db.providers.set(user.id, provider);
      
      return {
        message: "Profile updated successfully",
      };
    }),

  // Get provider analytics
  getAnalytics: providerProcedure
    .input(z.object({
      period: z.enum(["week", "month", "quarter", "year"]).default("month"),
    }))
    .query(async ({ input, ctx }) => {
      const { db, user } = ctx;
      
      // Get provider's bookings
      const bookings = Array.from(db.bookings.values()).filter(
        booking => booking.providerId === user.id
      );
      
      // Calculate period-specific analytics
      const now = new Date();
      let startDate: Date;
      
      switch (input.period) {
        case "week":
          startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
          break;
        case "month":
          startDate = new Date(now.getFullYear(), now.getMonth(), 1);
          break;
        case "quarter":
          startDate = new Date(now.getFullYear(), Math.floor(now.getMonth() / 3) * 3, 1);
          break;
        case "year":
          startDate = new Date(now.getFullYear(), 0, 1);
          break;
      }
      
      const periodBookings = bookings.filter(
        booking => new Date(booking.createdAt) >= startDate
      );
      
      const completedBookings = periodBookings.filter(b => b.status === "completed");
      const revenue = completedBookings.reduce((sum, b) => sum + (b.estimatedPrice || 0), 0);
      const averageRating = completedBookings.length > 0 
        ? completedBookings.reduce((sum, b) => sum + (b.rating || 0), 0) / completedBookings.length
        : 0;
      
      return {
        period: input.period,
        totalBookings: periodBookings.length,
        completedBookings: completedBookings.length,
        revenue,
        averageRating: Math.round(averageRating * 10) / 10,
        currency: user.currency || "AWG",
      };
    }),

  // Add service
  addService: providerProcedure
    .input(z.object({
      name: z.string().min(1, "Service name is required"),
      description: z.string().min(10, "Description must be at least 10 characters"),
      category: z.string().min(1, "Category is required"),
      pricing: z.object({
        min: z.number().min(0),
        max: z.number().min(0),
        currency: commonSchemas.currency,
      }),
      duration: z.number().min(15).max(480), // 15 minutes to 8 hours
    }))
    .mutation(async ({ input, ctx }) => {
      const { db, generateId, getCurrentTime, user } = ctx;
      
      const serviceId = generateId();
      const service = {
        id: serviceId,
        providerId: user.id,
        name: input.name,
        description: input.description,
        category: input.category,
        pricing: input.pricing,
        duration: input.duration,
        isActive: true,
        createdAt: getCurrentTime(),
        updatedAt: getCurrentTime(),
      };
      
      // Store service (in a real app, you'd have a services table)
      db.providers.set(`service-${serviceId}`, service);
      
      return {
        service,
        message: "Service added successfully",
      };
    }),

  // Get urgent requests in provider's area
  getUrgentRequests: providerProcedure
    .input(z.object({
      radius: z.number().min(1).max(50).default(20), // km
      categories: z.array(z.string()).optional(),
    }))
    .query(async ({ input, ctx }) => {
      const { db, user } = ctx;
      
      // Get all urgent requests
      const urgentRequests = Array.from(db.bookings.values()).filter(
        booking => booking.status === "pending" && booking.urgencyLevel
      );
      
      // Filter by categories if specified
      let filteredRequests = urgentRequests;
      if (input.categories && input.categories.length > 0) {
        filteredRequests = urgentRequests.filter(
          request => input.categories!.includes(request.categoryId)
        );
      }
      
      // Sort by urgency and creation time
      filteredRequests.sort((a, b) => {
        const urgencyOrder: { [key: string]: number } = { emergency: 4, high: 3, medium: 2, low: 1 };
        const urgencyDiff = (urgencyOrder[b.urgencyLevel] || 0) - (urgencyOrder[a.urgencyLevel] || 0);
        if (urgencyDiff !== 0) return urgencyDiff;
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      });
      
      return {
        requests: filteredRequests.slice(0, 10), // Return top 10
      };
    }),

  // Respond to urgent request
  respondToUrgentRequest: providerProcedure
    .input(z.object({
      requestId: commonSchemas.id,
      estimatedPrice: z.number().min(0),
      estimatedArrival: z.number().min(5).max(120), // 5 minutes to 2 hours
      message: z.string().optional(),
    }))
    .mutation(async ({ input, ctx }) => {
      const { db, generateId, getCurrentTime, user } = ctx;
      
      const request = db.bookings.get(input.requestId);
      if (!request) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Urgent request not found",
        });
      }
      
      if (request.status !== "pending") {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "This request is no longer available",
        });
      }
      
      // Create response
      const responseId = generateId();
      const response = {
        id: responseId,
        requestId: input.requestId,
        providerId: user.id,
        estimatedPrice: input.estimatedPrice,
        estimatedArrival: input.estimatedArrival,
        message: input.message,
        status: "pending",
        createdAt: getCurrentTime(),
      };
      
      // Store response
      db.bookings.set(`response-${responseId}`, response);
      
      return {
        response,
        message: "Response submitted successfully",
      };
    }),
});