import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { notifications as mockNotifications, Notification, NotificationType } from '@/mocks/notifications';

interface NotificationState {
  notifications: Notification[];
  unreadCount: number;
  addNotification: (notification: Notification) => void;
  markAsRead: (id: string) => void;
  markAllAsRead: () => void;
  deleteNotification: (id: string) => void;
  clearAll: () => void;
  addTaxiNotification: (type: 'ride_request' | 'driver_assigned' | 'driver_arriving' | 'ride_started' | 'ride_completed', data: any) => void;
}

export const useNotificationStore = create<NotificationState>()(
  persist(
    (set, get) => ({
      notifications: mockNotifications,
      unreadCount: mockNotifications.filter(n => !n.isRead).length,
      
      addNotification: (notification: Notification) => {
        try {
          set(state => ({
            notifications: [notification, ...state.notifications],
            unreadCount: state.unreadCount + (notification.isRead ? 0 : 1)
          }));
        } catch (error) {
          console.error("Error adding notification:", error);
        }
      },
      
      markAsRead: (id: string) => {
        try {
          set(state => {
            const updatedNotifications = state.notifications.map(notification => 
              notification.id === id ? { ...notification, isRead: true } : notification
            );
            
            const wasUnread = state.notifications.find(n => n.id === id)?.isRead === false;
            
            return {
              notifications: updatedNotifications,
              unreadCount: wasUnread ? state.unreadCount - 1 : state.unreadCount
            };
          });
        } catch (error) {
          console.error("Error marking notification as read:", error);
        }
      },
      
      markAllAsRead: () => {
        try {
          set(state => ({
            notifications: state.notifications.map(notification => ({ ...notification, isRead: true })),
            unreadCount: 0
          }));
        } catch (error) {
          console.error("Error marking all notifications as read:", error);
        }
      },
      
      deleteNotification: (id: string) => {
        try {
          set(state => {
            const notification = state.notifications.find(n => n.id === id);
            const wasUnread = notification?.isRead === false;
            
            return {
              notifications: state.notifications.filter(n => n.id !== id),
              unreadCount: wasUnread ? state.unreadCount - 1 : state.unreadCount
            };
          });
        } catch (error) {
          console.error("Error deleting notification:", error);
        }
      },
      
      clearAll: () => {
        try {
          set({
            notifications: [],
            unreadCount: 0
          });
        } catch (error) {
          console.error("Error clearing all notifications:", error);
        }
      },

      addTaxiNotification: (type, data) => {
        try {
          let title = '';
          let message = '';
          const notificationType: NotificationType = 'taxi-update';

          switch (type) {
            case 'ride_request':
              title = 'New Ride Request';
              message = `Ride request from ${data.pickupLocation} to ${data.dropoffLocation}`;
              break;
            case 'driver_assigned':
              title = 'Driver Assigned';
              message = `${data.driverName} is your driver. Vehicle: ${data.vehicleInfo}`;
              break;
            case 'driver_arriving':
              title = 'Driver Arriving';
              message = `Your driver is arriving at the pickup location`;
              break;
            case 'ride_started':
              title = 'Ride Started';
              message = 'Your ride has started. Enjoy your trip!';
              break;
            case 'ride_completed':
              title = 'Ride Completed';
              message = `Trip completed. Fare: ${data.fare} ${data.currency}`;
              break;
            default:
              title = 'Taxi Update';
              message = 'You have a taxi service update';
          }

          const notification: Notification = {
            id: `taxi-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
            type: notificationType,
            title,
            message,
            timestamp: new Date(),
            isRead: false,
            data
          };

          get().addNotification(notification);
        } catch (error) {
          console.error("Error adding taxi notification:", error);
        }
      }
    }),
    {
      name: 'notification-storage',
      storage: createJSONStorage(() => AsyncStorage),
      // Add error handling for storage
      onRehydrateStorage: () => (state, error) => {
        if (error) {
          console.error("Notification store rehydration error:", error);
        }
      },
    }
  )
);