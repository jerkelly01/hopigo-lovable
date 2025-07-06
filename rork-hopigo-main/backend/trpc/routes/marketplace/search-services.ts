import { z } from "zod";
import { publicProcedure } from "../../create-context";

export const searchServicesProcedure = publicProcedure
  .input(
    z.object({
      query: z.string().optional(),
      category: z.string().optional(),
      location: z.string().optional(),
      priceMin: z.number().optional(),
      priceMax: z.number().optional(),
      limit: z.number().min(1).max(50).default(20),
      offset: z.number().min(0).default(0),
    })
  )
  .query(async ({ input }) => {
    // Mock search results
    const allServices = [
      {
        id: "service-1",
        name: "House Cleaning",
        description: "Professional house cleaning service",
        price: 45.00,
        duration: 120,
        category: "cleaning",
        providerId: "provider-1",
        providerName: "Clean Pro Services",
        rating: 4.8,
        reviewCount: 127,
        image: "https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=300&h=200&fit=crop",
        location: "Downtown Area",
      },
      {
        id: "service-2",
        name: "Lawn Mowing",
        description: "Professional lawn mowing and maintenance",
        price: 25.00,
        duration: 60,
        category: "landscaping",
        providerId: "provider-2",
        providerName: "Green Thumb Landscaping",
        rating: 4.6,
        reviewCount: 89,
        image: "https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=300&h=200&fit=crop",
        location: "Suburban Area",
      },
    ];

    // Apply filters
    let filteredServices = allServices;

    if (input.category) {
      filteredServices = filteredServices.filter(service => service.category === input.category);
    }

    if (input.query) {
      const query = input.query.toLowerCase();
      filteredServices = filteredServices.filter(service =>
        service.name.toLowerCase().includes(query) ||
        service.description.toLowerCase().includes(query)
      );
    }

    if (input.priceMin !== undefined) {
      filteredServices = filteredServices.filter(service => service.price >= input.priceMin!);
    }

    if (input.priceMax !== undefined) {
      filteredServices = filteredServices.filter(service => service.price <= input.priceMax!);
    }

    const total = filteredServices.length;
    const services = filteredServices.slice(input.offset, input.offset + input.limit);

    return {
      services,
      total,
      hasMore: input.offset + input.limit < total,
    };
  });