import { z } from "zod";
import { protectedProcedure } from "../../create-context";
import { TRPCError } from "@trpc/server";

export const cancelBookingProcedure = protectedProcedure
  .input(
    z.object({
      bookingId: z.string(),
      reason: z.string().optional(),
    })
  )
  .mutation(async ({ input, ctx }) => {
    const { bookingId, reason } = input;

    // Mock booking cancellation
    // In a real app, you would check if the booking exists and belongs to the user
    if (bookingId === "non-existent") {
      throw new TRPCError({
        code: "NOT_FOUND",
        message: "Booking not found",
      });
    }

    console.log(`Cancelling booking ${bookingId} for user ${ctx.user.id}. Reason: ${reason}`);

    return {
      success: true,
      message: "Booking cancelled successfully",
    };
  });