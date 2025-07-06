import { z } from "zod";
import { protectedProcedure } from "../../create-context";

export const addFundsProcedure = protectedProcedure
  .input(
    z.object({
      amount: z.number().min(1).max(1000),
      paymentMethodId: z.string(),
    })
  )
  .mutation(async ({ input, ctx }) => {
    const { amount, paymentMethodId } = input;

    // Mock payment processing
    console.log(`Adding $${amount} to wallet for user ${ctx.user.id} using payment method ${paymentMethodId}`);

    return {
      success: true,
      transactionId: `txn-${Date.now()}`,
      newBalance: 125.50 + amount,
      message: `Successfully added $${amount} to your wallet`,
    };
  });