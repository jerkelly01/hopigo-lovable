import { protectedProcedure } from "../../create-context";

export const getNotificationsProcedure = protectedProcedure.query(async ({ ctx }) => {
  // Mock notifications
  return [
    {
      id: "notif-1",
      title: "Booking Confirmed",
      message: "Your cleaning service booking has been confirmed for tomorrow at 2 PM.",
      type: "booking",
      read: false,
      createdAt: new Date(Date.now() - 1000 * 60 * 30),
      actionUrl: "/booking/booking-1",
    },
    {
      id: "notif-2",
      title: "Payment Successful",
      message: "Your payment of $50.00 has been processed successfully.",
      type: "payment",
      read: true,
      createdAt: new Date(Date.now() - 1000 * 60 * 60 * 2),
      actionUrl: "/wallet",
    },
  ];
});