import { z } from "zod";
import { publicProcedure } from "../../create-context";

export const forgotPasswordProcedure = publicProcedure
  .input(
    z.object({
      email: z.string().email(),
    })
  )
  .mutation(async ({ input }) => {
    const { email } = input;

    // Mock forgot password logic
    // In a real app, you would:
    // 1. Check if user exists
    // 2. Generate reset token
    // 3. Send email with reset link

    console.log(`Password reset requested for: ${email}`);

    return {
      message: "If an account with this email exists, you will receive a password reset link.",
      success: true,
    };
  });