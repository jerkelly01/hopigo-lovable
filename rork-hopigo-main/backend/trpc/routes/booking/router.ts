import { z } from "zod";
import { TRPCError } from "@trpc/server";
import { createTRPCRouter, protectedProcedure, commonSchemas } from "../../create-context";

export const bookingRouter = createTRPCRouter({
  // Create booking
  createBooking: protectedProcedure
    .input(z.object({
      providerId: commonSchemas.id,
      serviceId: z.string().min(1, "Service ID is required"),
      date: z.string().datetime("Invalid date format"),
      time: z.string().regex(/^\d{2}:\d{2}$/, "Invalid time format (HH:MM)"),
      duration: z.number().min(30).max(480), // 30 minutes to 8 hours
      location: commonSchemas.coordinates.extend({
        address: z.string(),
      }),
      notes: z.string().optional(),
      estimatedPrice: z.number().min(0),
      currency: commonSchemas.currency,
    }))
    .mutation(async ({ input, ctx }) => {
      const { db, generateId, getCurrentTime, user } = ctx;
      
      // Validate provider exists
      const provider = db.providers.get(input.providerId);
      if (!provider) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Service provider not found",
        });
      }
      
      // Create booking
      const bookingId = generateId();
      const booking = {
        id: bookingId,
        userId: user.id,
        providerId: input.providerId,
        serviceId: input.serviceId,
        date: input.date,
        time: input.time,
        duration: input.duration,
        location: input.location,
        notes: input.notes,
        estimatedPrice: input.estimatedPrice,
        currency: input.currency,
        status: "pending",
        createdAt: getCurrentTime(),
        updatedAt: getCurrentTime(),
      };
      
      db.bookings.set(bookingId, booking);
      
      return {
        booking,
        message: "Booking created successfully",
      };
    }),

  // Get user bookings
  getBookings: protectedProcedure
    .input(z.object({
      status: z.enum(["all", "pending", "accepted", "in_progress", "completed", "cancelled"]).default("all"),
      startDate: z.string().datetime().optional(),
      endDate: z.string().datetime().optional(),
      page: z.number().min(1).default(1),
      limit: z.number().min(1).max(100).default(20),
    }))
    .query(async ({ input, ctx }) => {
      const { db, user } = ctx;
      
      // Get user's bookings
      let bookings = Array.from(db.bookings.values()).filter(
        (booking: any) => booking.userId === user.id
      );
      
      // Filter by status
      if (input.status !== "all") {
        bookings = bookings.filter((booking: any) => booking.status === input.status);
      }
      
      // Filter by date range
      if (input.startDate && input.endDate) {
        bookings = bookings.filter((booking: any) => {
          const bookingDate = new Date(booking.date);
          return bookingDate >= new Date(input.startDate!) && bookingDate <= new Date(input.endDate!);
        });
      }
      
      // Sort by date (newest first)
      bookings.sort((a: any, b: any) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
      
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

  // Get booking details
  getBooking: protectedProcedure
    .input(z.object({
      bookingId: commonSchemas.id,
    }))
    .query(async ({ input, ctx }) => {
      const { db, user } = ctx;
      
      const booking = db.bookings.get(input.bookingId);
      if (!booking) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Booking not found",
        });
      }
      
      // Check if user owns this booking or is the provider
      if ((booking as any).userId !== user.id && (booking as any).providerId !== user.id) {
        throw new TRPCError({
          code: "FORBIDDEN",
          message: "You don't have access to this booking",
        });
      }
      
      return { booking };
    }),

  // Update booking status
  updateBookingStatus: protectedProcedure
    .input(z.object({
      bookingId: commonSchemas.id,
      status: z.enum(["pending", "accepted", "in_progress", "completed", "cancelled"]),
      notes: z.string().optional(),
    }))
    .mutation(async ({ input, ctx }) => {
      const { db, getCurrentTime, user } = ctx;
      
      const booking: any = db.bookings.get(input.bookingId);
      if (!booking) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Booking not found",
        });
      }
      
      // Only provider can update booking status (except cancellation)
      if (input.status !== "cancelled" && booking.providerId !== user.id) {
        throw new TRPCError({
          code: "FORBIDDEN",
          message: "Only the service provider can update booking status",
        });
      }
      
      // Users can only cancel their own bookings
      if (input.status === "cancelled" && booking.userId !== user.id && booking.providerId !== user.id) {
        throw new TRPCError({
          code: "FORBIDDEN",
          message: "You can only cancel your own bookings",
        });
      }
      
      booking.status = input.status;
      booking.updatedAt = getCurrentTime();
      
      if (input.notes) {
        booking.statusNotes = input.notes;
      }
      
      // Add status-specific timestamps
      if (input.status === "accepted") {
        booking.acceptedAt = getCurrentTime();
      } else if (input.status === "in_progress") {
        booking.startedAt = getCurrentTime();
      } else if (input.status === "completed") {
        booking.completedAt = getCurrentTime();
      } else if (input.status === "cancelled") {
        booking.cancelledAt = getCurrentTime();
      }
      
      db.bookings.set(input.bookingId, booking);
      
      return {
        booking,
        message: "Booking status updated successfully",
      };
    }),

  // Cancel booking
  cancelBooking: protectedProcedure
    .input(z.object({
      bookingId: commonSchemas.id,
      reason: z.string().optional(),
    }))
    .mutation(async ({ input, ctx }) => {
      const { db, getCurrentTime, user } = ctx;
      
      const booking: any = db.bookings.get(input.bookingId);
      if (!booking) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Booking not found",
        });
      }
      
      if (booking.userId !== user.id) {
        throw new TRPCError({
          code: "FORBIDDEN",
          message: "You can only cancel your own bookings",
        });
      }
      
      if (booking.status === "completed") {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Cannot cancel a completed booking",
        });
      }
      
      booking.status = "cancelled";
      booking.cancelledAt = getCurrentTime();
      booking.cancellationReason = input.reason;
      booking.updatedAt = getCurrentTime();
      
      db.bookings.set(input.bookingId, booking);
      
      return {
        booking,
        message: "Booking cancelled successfully",
      };
    }),

  // Rate booking
  rateBooking: protectedProcedure
    .input(z.object({
      bookingId: commonSchemas.id,
      rating: z.number().min(1).max(5),
      comment: z.string().optional(),
    }))
    .mutation(async ({ input, ctx }) => {
      const { db, getCurrentTime, user } = ctx;
      
      const booking: any = db.bookings.get(input.bookingId);
      if (!booking) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Booking not found",
        });
      }
      
      if (booking.userId !== user.id) {
        throw new TRPCError({
          code: "FORBIDDEN",
          message: "You can only rate your own bookings",
        });
      }
      
      if (booking.status !== "completed") {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "You can only rate completed bookings",
        });
      }
      
      booking.rating = input.rating;
      booking.ratingComment = input.comment;
      booking.ratedAt = getCurrentTime();
      booking.updatedAt = getCurrentTime();
      
      db.bookings.set(input.bookingId, booking);
      
      return {
        message: "Booking rated successfully",
      };
    }),

  // Get provider availability
  getProviderAvailability: protectedProcedure
    .input(z.object({
      providerId: commonSchemas.id,
      date: z.string().datetime("Invalid date format"),
    }))
    .query(async ({ input, ctx }) => {
      const { db } = ctx;
      
      // Check if provider exists
      const provider = db.providers.get(input.providerId);
      if (!provider) {
        // Return empty availability instead of throwing error to prevent crashes
        console.warn(`Provider with id ${input.providerId} not found`);
        return { timeSlots: [] };
      }
      
      // Get provider's existing bookings for the date
      const dateString = input.date.split('T')[0];
      const existingBookings = Array.from(db.bookings.values()).filter(
        (booking: any) => 
          booking.providerId === input.providerId && 
          booking.date.startsWith(dateString) &&
          ["pending", "accepted", "in_progress"].includes(booking.status)
      );
      
      // Generate available time slots (simplified)
      const timeSlots = [];
      for (let hour = 8; hour < 18; hour++) {
        const startTime = `${hour.toString().padStart(2, '0')}:00`;
        const endTime = `${(hour + 1).toString().padStart(2, '0')}:00`;
        
        // Check if this slot is already booked
        const isBooked = existingBookings.some((booking: any) => {
          const bookingHour = parseInt(booking.time.split(':')[0]);
          return bookingHour === hour;
        });
        
        timeSlots.push({
          startTime,
          endTime,
          available: !isBooked,
        });
      }
      
      return { timeSlots };
    }),
});