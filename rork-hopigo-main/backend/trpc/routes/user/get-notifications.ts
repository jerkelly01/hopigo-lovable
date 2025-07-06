import { protectedProcedure } from "../../create-context";

export const getNotificationsProcedure = protectedProcedure.query(async ({ ctx }) => {
  // Mock notifications data
  return [
    {
      id: "notif-1",
      title: "Booking Confirmed",
      message: "Your cleaning service booking has been confirmed for tomorrow at 2 PM.",
      type: "booking",
      read: false,
      createdAt: new Date(Date.now() - 1000 * 60 * 30), // 30 minutes ago
    },
    {
      id: "notif-2",
      title: "Payment Successful",
      message: "Your payment of $50.00 has been processed successfully.",
      type: "payment",
      read: true,
      createdAt: new Date(Date.now() - 1000 * 60 * 60 * 2), // 2 hours ago
    },
    {
      id: "notif-3",
      title: "New Service Available",
      message: "Check out our new lawn care services in your area!",
      type: "promotion",
      read: false,
      createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24), // 1 day ago
    },
  ];
});