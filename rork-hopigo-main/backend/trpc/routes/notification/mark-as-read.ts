import { z } from "zod";
import { protectedProcedure } from "../../create-context";

export const markAsReadProcedure = protectedProcedure
  .input(
    z.object({
      notificationId: z.string(),
    })
  )
  .mutation(async ({ input, ctx }) => {
    const { notificationId } = input;

    console.log(`Marking notification ${notificationId} as read for user ${ctx.user.id}`);

    return {
      success: true,
      message: "Notification marked as read",
    };
  });