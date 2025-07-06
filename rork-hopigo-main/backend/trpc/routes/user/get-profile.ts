import { protectedProcedure } from "../../create-context";

export const getProfileProcedure = protectedProcedure.query(async ({ ctx }) => {
  // Mock user profile data
  return {
    id: ctx.user.id,
    email: ctx.user.email,
    name: ctx.user.name,
    role: ctx.user.role,
    avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face",
    phone: "+1 (555) 123-4567",
    address: "123 Main St, City, State 12345",
    joinedAt: new Date("2024-01-15"),
    isVerified: true,
    preferences: {
      notifications: true,
      marketing: false,
      location: true,
    },
  };
});