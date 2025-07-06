import { z } from "zod";
import { protectedProcedure } from "../../create-context";

export const createBookingProcedure = protectedProcedure
  .input(
    z.object({
      serviceId: z.string(),
      providerId: z.string(),
      date: z.string(),
      time: z.string(),
      duration: z.number(),
      price: z.number(),
      address: z.string(),
      notes: z.string().optional(),
    })
  )
  .mutation(async ({ input, ctx }) => {
    // Mock booking creation
    const booking = {
      id: `booking-${Date.now()}`,
      userId: ctx.user.id,
      ...input,
      status: "upcoming",
      createdAt: new Date(),
    };

    console.log("Creating booking:", booking);

    return {
      success: true,
      booking,
      message: "Booking created successfully",
    };
  });