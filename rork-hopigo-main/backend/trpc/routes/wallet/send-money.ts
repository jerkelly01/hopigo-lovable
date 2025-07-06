import { z } from "zod";
import { protectedProcedure } from "../../create-context";
import { TRPCError } from "@trpc/server";

export const sendMoneyProcedure = protectedProcedure
  .input(
    z.object({
      recipientEmail: z.string().email(),
      amount: z.number().min(1).max(1000),
      message: z.string().optional(),
    })
  )
  .mutation(async ({ input, ctx }) => {
    const { recipientEmail, amount, message } = input;

    // Mock balance check
    const currentBalance = 125.50;
    if (amount > currentBalance) {
      throw new TRPCError({
        code: "BAD_REQUEST",
        message: "Insufficient balance",
      });
    }

    // Mock money transfer
    console.log(`Sending $${amount} from ${ctx.user.email} to ${recipientEmail}`);

    return {
      success: true,
      transactionId: `txn-${Date.now()}`,
      newBalance: currentBalance - amount,
      message: `Successfully sent $${amount} to ${recipientEmail}`,
    };
  });