import { z } from "zod";
import { createTRPCRouter, protectedProcedure, commonSchemas } from "../../create-context";

export const notificationRouter = createTRPCRouter({
  // Get user notifications
  getNotifications: protectedProcedure
    .input(z.object({
      type: z.enum(["all", "booking", "payment", "taxi-update", "promotion", "system"]).default("all"),
      isRead: z.boolean().optional(),
      page: z.number().min(1).default(1),
      limit: z.number().min(1).max(100).default(20),
    }))
    .query(async ({ input, ctx }) => {
      const { user } = ctx;
      
      // Mock notifications
      const allNotifications = [
        {
          id: "notif1",
          userId: user.id,
          type: "booking",
          title: "Booking Confirmed",
          message: "Your cleaning service booking has been confirmed for tomorrow at 2 PM",
          isRead: false,
          timestamp: "2024-01-20T10:00:00Z",
          data: {
            bookingId: "booking1",
            providerId: "provider1",
          },
        },
        {
          id: "notif2",
          userId: user.id,
          type: "payment",
          title: "Payment Successful",
          message: "Payment of AWG 45.00 for cleaning service has been processed",
          isRead: true,
          timestamp: "2024-01-19T14:30:00Z",
          data: {
            transactionId: "tx1",
            amount: 45.00,
            currency: "AWG",
          },
        },
      ];
      
      let filteredNotifications = allNotifications;
      
      // Filter by type
      if (input.type !== "all") {
        filteredNotifications = filteredNotifications.filter(notif => notif.type === input.type);
      }
      
      // Filter by read status
      if (input.isRead !== undefined) {
        filteredNotifications = filteredNotifications.filter(notif => notif.isRead === input.isRead);
      }
      
      // Apply pagination
      const startIndex = (input.page - 1) * input.limit;
      const endIndex = startIndex + input.limit;
      const paginatedNotifications = filteredNotifications.slice(startIndex, endIndex);
      
      const unreadCount = allNotifications.filter(notif => !notif.isRead).length;
      
      return {
        notifications: paginatedNotifications,
        unreadCount,
        pagination: {
          page: input.page,
          limit: input.limit,
          total: filteredNotifications.length,
          totalPages: Math.ceil(filteredNotifications.length / input.limit),
        },
      };
    }),

  // Mark notification as read
  markAsRead: protectedProcedure
    .input(z.object({
      notificationId: commonSchemas.id,
    }))
    .mutation(async ({ input, ctx }) => {
      const { db, getCurrentTime } = ctx;
      
      // In production, update notification in database
      
      return {
        message: "Notification marked as read",
      };
    }),

  // Mark all notifications as read
  markAllAsRead: protectedProcedure
    .mutation(async ({ ctx }) => {
      const { db, user, getCurrentTime } = ctx;
      
      // In production, update all user notifications in database
      
      return {
        message: "All notifications marked as read",
      };
    }),

  // Delete notification
  deleteNotification: protectedProcedure
    .input(z.object({
      notificationId: commonSchemas.id,
    }))
    .mutation(async ({ input, ctx }) => {
      const { db } = ctx;
      
      // In production, delete notification from database
      
      return {
        message: "Notification deleted",
      };
    }),

  // Send notification (internal use)
  sendNotification: protectedProcedure
    .input(z.object({
      userId: commonSchemas.id,
      type: z.enum(["booking", "payment", "taxi-update", "promotion", "system"]),
      title: z.string().min(1, "Title is required"),
      message: z.string().min(1, "Message is required"),
      data: z.record(z.any()).optional(),
    }))
    .mutation(async ({ input, ctx }) => {
      const { db, generateId, getCurrentTime } = ctx;
      
      const notificationId = generateId();
      const notification = {
        id: notificationId,
        userId: input.userId,
        type: input.type,
        title: input.title,
        message: input.message,
        isRead: false,
        timestamp: getCurrentTime(),
        data: input.data,
      };
      
      db.notifications.set(notificationId, notification);
      
      // In production, send push notification here
      
      return {
        notification,
        message: "Notification sent successfully",
      };
    }),

  // Get notification settings
  getSettings: protectedProcedure
    .query(async ({ ctx }) => {
      const { user } = ctx;
      
      // Mock notification settings
      const settings = {
        pushNotifications: true,
        emailNotifications: true,
        smsNotifications: false,
        bookingUpdates: true,
        paymentAlerts: true,
        promotions: true,
        taxiUpdates: true,
        systemAlerts: true,
      };
      
      return { settings };
    }),

  // Update notification settings
  updateSettings: protectedProcedure
    .input(z.object({
      pushNotifications: z.boolean().optional(),
      emailNotifications: z.boolean().optional(),
      smsNotifications: z.boolean().optional(),
      bookingUpdates: z.boolean().optional(),
      paymentAlerts: z.boolean().optional(),
      promotions: z.boolean().optional(),
      taxiUpdates: z.boolean().optional(),
      systemAlerts: z.boolean().optional(),
    }))
    .mutation(async ({ input, ctx }) => {
      const { db, user, getCurrentTime } = ctx;
      
      // In production, update user notification settings in database
      
      return {
        message: "Notification settings updated successfully",
      };
    }),
});