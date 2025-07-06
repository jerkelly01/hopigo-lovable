import { z } from "zod";
import { publicProcedure } from "../../create-context";
import { TRPCError } from "@trpc/server";

export const loginProcedure = publicProcedure
  .input(
    z.object({
      email: z.string().email(),
      password: z.string().min(6),
    })
  )
  .mutation(async ({ input }) => {
    // Mock authentication logic
    const { email, password } = input;

    // In a real app, you would:
    // 1. Hash the password and compare with stored hash
    // 2. Generate a real JWT token
    // 3. Store refresh token in database

    if (email === "user@example.com" && password === "password123") {
      return {
        user: {
          id: "user-1",
          email: "user@example.com",
          name: "John Doe",
          role: "user",
        },
        token: "mock-user-token",
        refreshToken: "mock-refresh-token",
      };
    }

    if (email === "provider@example.com" && password === "password123") {
      return {
        user: {
          id: "provider-1",
          email: "provider@example.com",
          name: "Jane Provider",
          role: "provider",
        },
        token: "mock-provider-token",
        refreshToken: "mock-refresh-token",
      };
    }

    throw new TRPCError({
      code: "UNAUTHORIZED",
      message: "Invalid email or password",
    });
  });