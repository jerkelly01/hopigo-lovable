import { z } from "zod";
import { protectedProcedure } from "../../create-context";

export const updateProfileProcedure = protectedProcedure
  .input(
    z.object({
      name: z.string().min(2).optional(),
      phone: z.string().optional(),
      address: z.string().optional(),
      preferences: z
        .object({
          notifications: z.boolean().optional(),
          marketing: z.boolean().optional(),
          location: z.boolean().optional(),
        })
        .optional(),
    })
  )
  .mutation(async ({ input, ctx }) => {
    // Mock profile update
    console.log(`Updating profile for user ${ctx.user.id}:`, input);

    return {
      success: true,
      message: "Profile updated successfully",
    };
  });