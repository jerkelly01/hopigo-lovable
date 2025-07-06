import { z } from "zod";
import { publicProcedure } from "../../create-context";

export const getProvidersProcedure = publicProcedure
  .input(
    z.object({
      category: z.string().optional(),
      location: z.string().optional(),
      limit: z.number().min(1).max(50).default(20),
    })
  )
  .query(async ({ input }) => {
    // Mock providers data
    const providers = [
      {
        id: "provider-1",
        name: "Clean Pro Services",
        category: "cleaning",
        rating: 4.8,
        reviewCount: 127,
        image: "https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=300&h=200&fit=crop",
        location: "Downtown Area",
        distance: "2.3 km",
        priceRange: "$25-$75",
        isVerified: true,
        responseTime: "Usually responds within 1 hour",
      },
      {
        id: "provider-2",
        name: "Green Thumb Landscaping",
        category: "landscaping",
        rating: 4.6,
        reviewCount: 89,
        image: "https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=300&h=200&fit=crop",
        location: "Suburban Area",
        distance: "3.7 km",
        priceRange: "$30-$100",
        isVerified: true,
        responseTime: "Usually responds within 2 hours",
      },
    ];

    return providers.slice(0, input.limit);
  });