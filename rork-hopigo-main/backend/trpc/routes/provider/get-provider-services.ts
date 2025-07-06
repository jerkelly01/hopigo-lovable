import { z } from "zod";
import { publicProcedure } from "../../create-context";

export const getProviderServicesProcedure = publicProcedure
  .input(
    z.object({
      providerId: z.string(),
    })
  )
  .query(async ({ input }) => {
    const { providerId } = input;

    // Mock provider services
    if (providerId === "provider-1") {
      return [
        {
          id: "service-1",
          name: "Standard House Cleaning",
          description: "Complete house cleaning including all rooms, bathrooms, and kitchen.",
          price: 45.00,
          duration: 120,
          category: "cleaning",
          isPopular: true,
        },
        {
          id: "service-2",
          name: "Deep Cleaning",
          description: "Thorough deep cleaning service including inside appliances and detailed work.",
          price: 85.00,
          duration: 180,
          category: "cleaning",
          isPopular: false,
        },
        {
          id: "service-3",
          name: "Office Cleaning",
          description: "Professional office cleaning for small to medium businesses.",
          price: 65.00,
          duration: 90,
          category: "cleaning",
          isPopular: true,
        },
      ];
    }

    return [];
  });