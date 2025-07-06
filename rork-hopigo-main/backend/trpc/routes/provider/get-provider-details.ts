import { z } from "zod";
import { publicProcedure } from "../../create-context";
import { TRPCError } from "@trpc/server";

export const getProviderDetailsProcedure = publicProcedure
  .input(
    z.object({
      providerId: z.string(),
    })
  )
  .query(async ({ input }) => {
    const { providerId } = input;

    // Mock provider details
    if (providerId === "provider-1") {
      return {
        id: "provider-1",
        name: "Clean Pro Services",
        description: "Professional cleaning services for homes and offices. We use eco-friendly products and have been serving the community for over 5 years.",
        category: "cleaning",
        rating: 4.8,
        reviewCount: 127,
        image: "https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=400&h=300&fit=crop",
        location: "Downtown Area",
        address: "456 Business St, City, State 12345",
        phone: "+1 (555) 987-6543",
        email: "contact@cleanpro.com",
        website: "https://cleanpro.com",
        isVerified: true,
        joinedDate: new Date("2019-03-15"),
        responseTime: "Usually responds within 1 hour",
        languages: ["English", "Spanish"],
        certifications: ["Licensed", "Insured", "Bonded"],
        workingHours: {
          monday: "8:00 AM - 6:00 PM",
          tuesday: "8:00 AM - 6:00 PM",
          wednesday: "8:00 AM - 6:00 PM",
          thursday: "8:00 AM - 6:00 PM",
          friday: "8:00 AM - 6:00 PM",
          saturday: "9:00 AM - 4:00 PM",
          sunday: "Closed",
        },
        gallery: [
          "https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=300&h=200&fit=crop",
          "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=300&h=200&fit=crop",
          "https://images.unsplash.com/photo-1527515637462-cff94eecc1ac?w=300&h=200&fit=crop",
        ],
      };
    }

    throw new TRPCError({
      code: "NOT_FOUND",
      message: "Provider not found",
    });
  });