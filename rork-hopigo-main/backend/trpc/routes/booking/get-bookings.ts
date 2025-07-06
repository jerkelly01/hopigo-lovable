import { z } from "zod";
import { protectedProcedure } from "../../create-context";

export const getBookingsProcedure = protectedProcedure
  .input(
    z.object({
      status: z.enum(["upcoming", "completed", "cancelled"]).optional(),
    })
  )
  .query(async ({ input, ctx }) => {
    // Mock bookings data
    const allBookings = [
      {
        id: "booking-1",
        serviceId: "service-1",
        serviceName: "House Cleaning",
        providerName: "Clean Pro Services",
        date: new Date(Date.now() + 1000 * 60 * 60 * 24), // Tomorrow
        time: "14:00",
        duration: 120,
        price: 45.00,
        status: "upcoming",
        address: "123 Main St, City, State",
      },
      {
        id: "booking-2",
        serviceId: "service-2",
        serviceName: "Lawn Mowing",
        providerName: "Green Thumb Landscaping",
        date: new Date(Date.now() - 1000 * 60 * 60 * 48), // 2 days ago
        time: "10:00",
        duration: 60,
        price: 25.00,
        status: "completed",
        address: "123 Main St, City, State",
      },
    ];

    const filteredBookings = input.status
      ? allBookings.filter(booking => booking.status === input.status)
      : allBookings;

    return filteredBookings;
  });