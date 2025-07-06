import { z } from "zod";
import { publicProcedure } from "../../create-context";
import { TRPCError } from "@trpc/server";

export const refreshTokenProcedure = publicProcedure
  .input(
    z.object({
      refreshToken: z.string(),
    })
  )
  .mutation(async ({ input }) => {
    const { refreshToken } = input;

    // Mock refresh token logic
    if (refreshToken !== "mock-refresh-token") {
      throw new TRPCError({
        code: "UNAUTHORIZED",
        message: "Invalid refresh token",
      });
    }

    return {
      token: "mock-new-token",
      refreshToken: "mock-new-refresh-token",
    };
  });