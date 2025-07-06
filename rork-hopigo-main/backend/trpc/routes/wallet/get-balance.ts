import { protectedProcedure } from "../../create-context";

export const getBalanceProcedure = protectedProcedure.query(async ({ ctx }) => {
  // Mock wallet balance
  return {
    balance: 125.50,
    currency: "USD",
    lastUpdated: new Date(),
  };
});