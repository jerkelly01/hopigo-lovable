import { z } from "zod";
import { protectedProcedure } from "../../create-context";

export const getTransactionsProcedure = protectedProcedure
  .input(
    z.object({
      limit: z.number().min(1).max(100).default(20),
      offset: z.number().min(0).default(0),
    })
  )
  .query(async ({ input, ctx }) => {
    // Mock transactions data
    const transactions = [
      {
        id: "txn-1",
        type: "payment",
        amount: -45.00,
        description: "House Cleaning Service",
        date: new Date(Date.now() - 1000 * 60 * 60 * 2),
        status: "completed",
      },
      {
        id: "txn-2",
        type: "deposit",
        amount: 100.00,
        description: "Wallet Top-up",
        date: new Date(Date.now() - 1000 * 60 * 60 * 24),
        status: "completed",
      },
      {
        id: "txn-3",
        type: "payment",
        amount: -25.00,
        description: "Lawn Mowing Service",
        date: new Date(Date.now() - 1000 * 60 * 60 * 48),
        status: "completed",
      },
    ];

    return {
      transactions: transactions.slice(input.offset, input.offset + input.limit),
      total: transactions.length,
      hasMore: input.offset + input.limit < transactions.length,
    };
  });