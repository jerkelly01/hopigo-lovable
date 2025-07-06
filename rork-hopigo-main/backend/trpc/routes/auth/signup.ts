import { z } from "zod";
import { publicProcedure } from "../../create-context";
import { TRPCError } from "@trpc/server";

export const signupProcedure = publicProcedure
  .input(
    z.object({
      email: z.string().email(),
      password: z.string().min(6),
      name: z.string().min(2),
      role: z.enum(["user", "provider"]).default("user"),
    })
  )
  .mutation(async ({ input }) => {
    const { email, password, name, role } = input;

    // Mock signup logic
    // In a real app, you would:
    // 1. Check if user already exists
    // 2. Hash the password
    // 3. Save user to database
    // 4. Generate JWT token

    // Mock check for existing user
    if (email === "existing@example.com") {
      throw new TRPCError({
        code: "CONFLICT",
        message: "User with this email already exists",
      });
    }

    const newUser = {
      id: `${role}-${Date.now()}`,
      email,
      name,
      role,
      createdAt: new Date(),
    };

    return {
      user: newUser,
      token: `mock-${role}-token`,
      refreshToken: "mock-refresh-token",
    };
  });