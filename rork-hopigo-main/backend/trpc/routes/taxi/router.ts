import { z } from "zod";
import { TRPCError } from "@trpc/server";
import { createTRPCRouter, protectedProcedure, commonSchemas } from "../../create-context";

export const taxiRouter = createTRPCRouter({
  // Get fare estimate
  getFareEstimate: protectedProcedure
    .input(z.object({
      pickupLocation: commonSchemas.coordinates.extend({
        address: z.string(),
      }),
      dropoffLocation: commonSchemas.coordinates.extend({
        address: z.string(),
      }),
      rideType: z.enum(["standard", "premium", "xl", "express"]).default("standard"),
    }))
    .query(async ({ input, ctx }) => {
      // Calculate distance (simplified)
      const distance = calculateDistance(input.pickupLocation, input.dropoffLocation);
      const duration = Math.max(5, distance * 2); // 2 minutes per km, minimum 5 minutes
      
      // Fare calculation
      const fareRates = {
        standard: { base: 5, perKm: 2.5, perMin: 0.5 },
        premium: { base: 8, perKm: 3.5, perMin: 0.7 },
        xl: { base: 10, perKm: 4.0, perMin: 0.8 },
        express: { base: 7, perKm: 3.0, perMin: 0.6 }
      };
      
      const rates = fareRates[input.rideType];
      const baseFare = rates.base;
      const distanceFare = distance * rates.perKm;
      const timeFare = duration * rates.perMin;
      const totalFare = Math.round((baseFare + distanceFare + timeFare) * 100) / 100;
      
      return {
        rideType: input.rideType,
        baseFare,
        distanceFare,
        timeFare,
        totalFare,
        currency: "AWG",
        estimatedDuration: Math.round(duration),
        estimatedDistance: Math.round(distance * 100) / 100,
      };
    }),

  // Find nearby drivers
  findNearbyDrivers: protectedProcedure
    .input(z.object({
      location: commonSchemas.coordinates,
      rideType: z.enum(["standard", "premium", "xl", "express"]).default("standard"),
      radius: z.number().min(1).max(20).default(10), // km
    }))
    .query(async ({ input, ctx }) => {
      // Mock nearby drivers
      const drivers = [
        {
          id: "driver1",
          name: "Carlos Rodriguez",
          avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400",
          rating: 4.9,
          reviewCount: 1247,
          verified: true,
          vehicleInfo: {
            make: "Toyota",
            model: "Camry",
            year: 2022,
            color: "Silver",
            licensePlate: "ABC-123",
            type: "sedan"
          },
          currentLocation: {
            latitude: 12.5092,
            longitude: -70.0086,
            address: "Oranjestad, Aruba"
          },
          isOnline: true,
          isAvailable: true,
          phoneNumber: "+297-123-4567",
          estimatedArrival: 5, // minutes
        },
        {
          id: "driver2",
          name: "Maria Santos",
          avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=400",
          rating: 4.8,
          reviewCount: 892,
          verified: true,
          vehicleInfo: {
            make: "Honda",
            model: "CR-V",
            year: 2021,
            color: "White",
            licensePlate: "XYZ-789",
            type: "suv"
          },
          currentLocation: {
            latitude: 12.5150,
            longitude: -70.0200,
            address: "Palm Beach, Aruba"
          },
          isOnline: true,
          isAvailable: true,
          phoneNumber: "+297-987-6543",
          estimatedArrival: 8, // minutes
        },
      ];
      
      // Filter by vehicle type for ride type
      const filteredDrivers = drivers.filter(driver => {
        if (input.rideType === "xl" && driver.vehicleInfo.type === "sedan") return false;
        if (input.rideType === "premium" && driver.vehicleInfo.type !== "luxury" && driver.vehicleInfo.type !== "sedan") return false;
        return driver.isOnline && driver.isAvailable;
      });
      
      return { drivers: filteredDrivers };
    }),

  // Request ride
  requestRide: protectedProcedure
    .input(z.object({
      pickupLocation: commonSchemas.coordinates.extend({
        address: z.string(),
      }),
      dropoffLocation: commonSchemas.coordinates.extend({
        address: z.string(),
      }),
      rideType: z.enum(["standard", "premium", "xl", "express"]).default("standard"),
      paymentMethodId: commonSchemas.id,
      notes: z.string().optional(),
      scheduledFor: z.string().optional(), // ISO date string for scheduled rides
    }))
    .mutation(async ({ input, ctx }) => {
      const { db, generateId, getCurrentTime, user } = ctx;
      
      // Create ride request
      const rideId = generateId();
      const ride = {
        id: rideId,
        userId: user.id,
        status: input.scheduledFor ? "scheduled" : "requesting",
        pickupLocation: input.pickupLocation,
        dropoffLocation: input.dropoffLocation,
        rideType: input.rideType,
        paymentMethodId: input.paymentMethodId,
        notes: input.notes,
        requestedAt: getCurrentTime(),
        estimatedFare: 0, // Will be calculated
        currency: "AWG",
        driverId: null as string | null,
        assignedAt: null as string | null,
        scheduledFor: input.scheduledFor,
      };
      
      db.bookings.set(rideId, ride);
      
      // For immediate rides, simulate driver assignment after delay
      if (!input.scheduledFor) {
        setTimeout(async () => {
          // Find available driver
          const drivers = await ctx.db.users; // Mock driver lookup
          // Assign first available driver
          ride.status = "driver_assigned";
          ride.driverId = "driver1";
          ride.assignedAt = getCurrentTime();
          db.bookings.set(rideId, ride);
        }, 10000); // 10 seconds
      }
      
      return {
        ride,
        message: input.scheduledFor ? "Ride scheduled successfully" : "Ride requested successfully",
        estimatedWaitTime: input.scheduledFor ? "Scheduled" : "5-10 minutes",
      };
    }),

  // Get current ride
  getCurrentRide: protectedProcedure
    .query(async ({ ctx }) => {
      const { db, user } = ctx;
      
      // Find user's active ride
      const activeRide = Array.from(db.bookings.values()).find(
        (booking: any) => booking.userId === user.id && 
        ["requesting", "driver_assigned", "pickup", "in_progress"].includes(booking.status)
      );
      
      return { ride: activeRide || null };
    }),

  // Get scheduled rides
  getScheduledRides: protectedProcedure
    .input(z.object({
      page: z.number().min(1).default(1),
      limit: z.number().min(1).max(100).default(20),
    }))
    .query(async ({ input, ctx }) => {
      const { db, user } = ctx;
      
      // Get user's scheduled rides
      let rides = Array.from(db.bookings.values()).filter(
        (booking: any) => booking.userId === user.id && booking.status === "scheduled"
      );
      
      // Sort by scheduled date
      rides.sort((a: any, b: any) => {
        const dateA = new Date(a.scheduledFor || a.requestedAt).getTime();
        const dateB = new Date(b.scheduledFor || b.requestedAt).getTime();
        return dateA - dateB;
      });
      
      // Apply pagination
      const startIndex = (input.page - 1) * input.limit;
      const endIndex = startIndex + input.limit;
      const paginatedRides = rides.slice(startIndex, endIndex);
      
      return {
        rides: paginatedRides,
        pagination: {
          page: input.page,
          limit: input.limit,
          total: rides.length,
          totalPages: Math.ceil(rides.length / input.limit),
        },
      };
    }),

  // Update ride status
  updateRideStatus: protectedProcedure
    .input(z.object({
      rideId: commonSchemas.id,
      status: z.enum(["requesting", "driver_assigned", "pickup", "in_progress", "completed", "cancelled", "scheduled"]),
    }))
    .mutation(async ({ input, ctx }) => {
      const { db, getCurrentTime } = ctx;
      
      const ride: any = db.bookings.get(input.rideId);
      if (!ride) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Ride not found",
        });
      }
      
      ride.status = input.status;
      ride.updatedAt = getCurrentTime();
      
      // Add status-specific timestamps
      if (input.status === "pickup") {
        ride.pickedUpAt = getCurrentTime();
      } else if (input.status === "completed") {
        ride.completedAt = getCurrentTime();
      } else if (input.status === "cancelled") {
        ride.cancelledAt = getCurrentTime();
      }
      
      db.bookings.set(input.rideId, ride);
      
      return {
        ride,
        message: "Ride status updated successfully",
      };
    }),

  // Cancel ride
  cancelRide: protectedProcedure
    .input(z.object({
      rideId: commonSchemas.id,
      reason: z.string().optional(),
    }))
    .mutation(async ({ input, ctx }) => {
      const { db, getCurrentTime, user } = ctx;
      
      const ride: any = db.bookings.get(input.rideId);
      if (!ride) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Ride not found",
        });
      }
      
      if (ride.userId !== user.id) {
        throw new TRPCError({
          code: "FORBIDDEN",
          message: "You can only cancel your own rides",
        });
      }
      
      ride.status = "cancelled";
      ride.cancelledAt = getCurrentTime();
      ride.cancellationReason = input.reason;
      ride.updatedAt = getCurrentTime();
      
      db.bookings.set(input.rideId, ride);
      
      return {
        ride,
        message: "Ride cancelled successfully",
      };
    }),

  // Get ride history
  getRideHistory: protectedProcedure
    .input(z.object({
      status: z.enum(["all", "completed", "cancelled"]).default("all"),
      page: z.number().min(1).default(1),
      limit: z.number().min(1).max(100).default(20),
    }))
    .query(async ({ input, ctx }) => {
      const { db, user } = ctx;
      
      // Get user's ride history
      let rides = Array.from(db.bookings.values()).filter(
        (booking: any) => booking.userId === user.id
      );
      
      // Filter by status
      if (input.status !== "all") {
        rides = rides.filter((ride: any) => ride.status === input.status);
      }
      
      // Sort by date (newest first)
      rides.sort((a: any, b: any) => new Date(b.requestedAt).getTime() - new Date(a.requestedAt).getTime());
      
      // Apply pagination
      const startIndex = (input.page - 1) * input.limit;
      const endIndex = startIndex + input.limit;
      const paginatedRides = rides.slice(startIndex, endIndex);
      
      return {
        rides: paginatedRides,
        pagination: {
          page: input.page,
          limit: input.limit,
          total: rides.length,
          totalPages: Math.ceil(rides.length / input.limit),
        },
      };
    }),

  // Rate ride
  rateRide: protectedProcedure
    .input(z.object({
      rideId: commonSchemas.id,
      rating: z.number().min(1).max(5),
      comment: z.string().optional(),
    }))
    .mutation(async ({ input, ctx }) => {
      const { db, getCurrentTime, user } = ctx;
      
      const ride: any = db.bookings.get(input.rideId);
      if (!ride) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Ride not found",
        });
      }
      
      if (ride.userId !== user.id) {
        throw new TRPCError({
          code: "FORBIDDEN",
          message: "You can only rate your own rides",
        });
      }
      
      ride.rating = input.rating;
      ride.ratingComment = input.comment;
      ride.ratedAt = getCurrentTime();
      ride.updatedAt = getCurrentTime();
      
      db.bookings.set(input.rideId, ride);
      
      return {
        message: "Ride rated successfully",
      };
    }),
});

// Helper function to calculate distance between two coordinates
function calculateDistance(loc1: { latitude: number; longitude: number }, loc2: { latitude: number; longitude: number }): number {
  const R = 6371; // Earth's radius in kilometers
  const dLat = (loc2.latitude - loc1.latitude) * Math.PI / 180;
  const dLon = (loc2.longitude - loc1.longitude) * Math.PI / 180;
  const a = 
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(loc1.latitude * Math.PI / 180) * Math.cos(loc2.latitude * Math.PI / 180) * 
    Math.sin(dLon/2) * Math.sin(dLon/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  return R * c;
}