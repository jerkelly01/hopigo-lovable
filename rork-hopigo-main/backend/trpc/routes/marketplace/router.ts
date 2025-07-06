import { z } from "zod";
import { TRPCError } from "@trpc/server";
import { createTRPCRouter, publicProcedure, protectedProcedure, commonSchemas } from "../../create-context";

export const marketplaceRouter = createTRPCRouter({
  // Get all categories
  getCategories: publicProcedure
    .query(async ({ ctx }) => {
      // Mock categories data
      const categories = [
        {
          id: "home-services",
          name: "Home Services",
          icon: "home",
          color: "#3B82F6",
          subCategories: [
            { id: "cleaning", name: "Cleaning", icon: "sparkles" },
            { id: "plumbing", name: "Plumbing", icon: "wrench" },
            { id: "electrical", name: "Electrical", icon: "zap" },
            { id: "gardening", name: "Gardening", icon: "flower" },
          ]
        },
        {
          id: "beauty-wellness",
          name: "Beauty & Wellness",
          icon: "heart",
          color: "#EC4899",
          subCategories: [
            { id: "haircut", name: "Hair & Beauty", icon: "scissors" },
            { id: "massage", name: "Massage", icon: "hand" },
            { id: "fitness", name: "Fitness", icon: "dumbbell" },
            { id: "spa", name: "Spa Services", icon: "flower2" },
          ]
        },
        {
          id: "automotive",
          name: "Automotive",
          icon: "car",
          color: "#10B981",
          subCategories: [
            { id: "car-wash", name: "Car Wash", icon: "car" },
            { id: "mechanic", name: "Mechanic", icon: "wrench" },
            { id: "towing", name: "Towing", icon: "truck" },
          ]
        },
        {
          id: "food-delivery",
          name: "Food & Delivery",
          icon: "utensils",
          color: "#F59E0B",
          subCategories: [
            { id: "restaurant", name: "Restaurants", icon: "utensils" },
            { id: "grocery", name: "Grocery", icon: "shopping-bag" },
            { id: "catering", name: "Catering", icon: "chef-hat" },
          ]
        },
        {
          id: "tourism",
          name: "Tourism",
          icon: "map",
          color: "#8B5CF6",
          subCategories: [
            { id: "tours", name: "Tours", icon: "map" },
            { id: "activities", name: "Activities", icon: "activity" },
            { id: "accommodation", name: "Hotels", icon: "bed" },
          ]
        },
      ];
      
      return { categories };
    }),

  // Get providers by category
  getProviders: publicProcedure
    .input(z.object({
      categoryId: z.string().optional(),
      subCategoryId: z.string().optional(),
      location: commonSchemas.coordinates.optional(),
      radius: z.number().min(1).max(50).default(10), // km
      page: z.number().min(1).default(1),
      limit: z.number().min(1).max(100).default(20),
    }))
    .query(async ({ input, ctx }) => {
      // Mock providers data
      const allProviders = [
        {
          id: "provider1",
          name: "Clean Pro Aruba",
          description: "Professional cleaning services for homes and offices",
          rating: 4.8,
          reviewCount: 156,
          avatar: "https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=400",
          verified: true,
          services: ["cleaning"],
          pricing: { cleaning: { min: 50, max: 200, currency: "AWG" } },
          availability: "Mon-Sat: 8AM-6PM",
          location: { latitude: 12.5092, longitude: -70.0086, address: "Oranjestad, Aruba" },
          responseTime: "Usually responds within 1 hour",
          completedJobs: 234,
        },
        {
          id: "provider2",
          name: "Island Beauty Salon",
          description: "Full-service beauty salon with experienced stylists",
          rating: 4.9,
          reviewCount: 89,
          avatar: "https://images.unsplash.com/photo-1560066984-138dadb4c035?w=400",
          verified: true,
          services: ["haircut", "spa"],
          pricing: { haircut: { min: 30, max: 150, currency: "AWG" } },
          availability: "Tue-Sun: 9AM-7PM",
          location: { latitude: 12.5150, longitude: -70.0200, address: "Palm Beach, Aruba" },
          responseTime: "Usually responds within 30 minutes",
          completedJobs: 445,
        },
      ];
      
      let filteredProviders = allProviders;
      
      // Filter by category/subcategory
      if (input.subCategoryId) {
        filteredProviders = filteredProviders.filter(provider =>
          provider.services.includes(input.subCategoryId!)
        );
      }
      
      // Apply pagination
      const startIndex = (input.page - 1) * input.limit;
      const endIndex = startIndex + input.limit;
      const paginatedProviders = filteredProviders.slice(startIndex, endIndex);
      
      return {
        providers: paginatedProviders,
        pagination: {
          page: input.page,
          limit: input.limit,
          total: filteredProviders.length,
          totalPages: Math.ceil(filteredProviders.length / input.limit),
        },
      };
    }),

  // Get provider details
  getProvider: publicProcedure
    .input(z.object({
      providerId: commonSchemas.id,
    }))
    .query(async ({ input, ctx }) => {
      // Mock provider lookup
      const provider = {
        id: input.providerId,
        name: "Clean Pro Aruba",
        description: "Professional cleaning services for homes and offices",
        rating: 4.8,
        reviewCount: 156,
        avatar: "https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=400",
        verified: true,
        services: ["cleaning"],
        pricing: { cleaning: { min: 50, max: 200, currency: "AWG" } },
        availability: "Mon-Sat: 8AM-6PM",
        location: { latitude: 12.5092, longitude: -70.0086, address: "Oranjestad, Aruba" },
        responseTime: "Usually responds within 1 hour",
        completedJobs: 234,
        gallery: [
          "https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=400",
          "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400",
        ],
        reviews: [
          {
            id: "review1",
            userId: "user1",
            userName: "Maria Santos",
            userAvatar: "https://i.pravatar.cc/150?u=user1",
            rating: 5,
            comment: "Excellent service! Very professional and thorough.",
            date: "2024-01-15T10:00:00Z",
          },
        ],
      };
      
      if (!provider) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Provider not found",
        });
      }
      
      return { provider };
    }),

  // Search providers
  searchProviders: publicProcedure
    .input(z.object({
      query: z.string().min(1, "Search query is required"),
      location: commonSchemas.coordinates.optional(),
      page: z.number().min(1).default(1),
      limit: z.number().min(1).max(100).default(20),
    }))
    .query(async ({ input, ctx }) => {
      // Mock search implementation
      const results = [
        {
          id: "provider1",
          name: "Clean Pro Aruba",
          description: "Professional cleaning services",
          rating: 4.8,
          reviewCount: 156,
          avatar: "https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=400",
          services: ["cleaning"],
          location: { latitude: 12.5092, longitude: -70.0086, address: "Oranjestad, Aruba" },
        },
      ];
      
      return {
        results,
        pagination: {
          page: input.page,
          limit: input.limit,
          total: results.length,
          totalPages: Math.ceil(results.length / input.limit),
        },
      };
    }),

  // Submit urgent request
  submitUrgentRequest: protectedProcedure
    .input(z.object({
      categoryId: z.string().min(1, "Category is required"),
      subCategoryId: z.string().optional(),
      description: z.string().min(10, "Description must be at least 10 characters"),
      location: commonSchemas.coordinates,
      urgencyLevel: z.enum(["low", "medium", "high", "emergency"]).default("medium"),
      budget: z.object({
        min: z.number().min(0),
        max: z.number().min(0),
        currency: commonSchemas.currency,
      }).optional(),
    }))
    .mutation(async ({ input, ctx }) => {
      const { db, generateId, getCurrentTime, user } = ctx;
      
      const requestId = generateId();
      const urgentRequest = {
        id: requestId,
        userId: user.id,
        categoryId: input.categoryId,
        subCategoryId: input.subCategoryId,
        description: input.description,
        location: input.location,
        urgencyLevel: input.urgencyLevel,
        budget: input.budget,
        status: "pending",
        createdAt: getCurrentTime(),
        updatedAt: getCurrentTime(),
      };
      
      // Store in mock database
      db.bookings.set(requestId, urgentRequest);
      
      return {
        requestId,
        message: "Urgent request submitted successfully",
        estimatedResponseTime: "5-15 minutes",
      };
    }),

  // Get address suggestions
  getAddressSuggestions: publicProcedure
    .input(z.object({
      query: z.string().min(1, "Query is required"),
      limit: z.number().min(1).max(10).default(5),
    }))
    .query(async ({ input, ctx }) => {
      // Mock address suggestions for Aruba
      const suggestions = [
        { latitude: 12.5092, longitude: -70.0086, address: "L.G. Smith Boulevard, Oranjestad, Aruba" },
        { latitude: 12.5150, longitude: -70.0200, address: "Palm Beach, Noord, Aruba" },
        { latitude: 12.5000, longitude: -70.0100, address: "Eagle Beach, Noord, Aruba" },
        { latitude: 12.5180, longitude: -70.0300, address: "Malmok Beach, Noord, Aruba" },
        { latitude: 12.4950, longitude: -69.9800, address: "Manchebo Beach, Oranjestad, Aruba" },
      ].filter(suggestion =>
        suggestion.address.toLowerCase().includes(input.query.toLowerCase())
      ).slice(0, input.limit);
      
      return { suggestions };
    }),

  // Reverse geocode
  reverseGeocode: publicProcedure
    .input(commonSchemas.coordinates)
    .query(async ({ input, ctx }) => {
      // Mock reverse geocoding
      const address = `${input.latitude.toFixed(6)}, ${input.longitude.toFixed(6)}, Aruba`;
      
      return { address };
    }),
});