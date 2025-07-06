import { User } from '@/types/user';

export type NotificationType = 'payment' | 'booking' | 'system' | 'promotion' | 'urgent-service' | 'taxi-update';

export interface Notification {
  id: string;
  type: NotificationType;
  title: string;
  message: string;
  timestamp: Date;
  isRead: boolean;
  actionUrl?: string;
  relatedUserId?: string;
  relatedUser?: User;
  data?: any;
}

export const notifications: Notification[] = [
  {
    id: '1',
    type: 'payment',
    title: 'Payment Successful',
    message: 'Your payment of $45.00 to Cleaning Pro was successful.',
    timestamp: new Date(Date.now() - 1000 * 60 * 30), // 30 minutes ago
    isRead: false,
  },
  {
    id: '2',
    type: 'booking',
    title: 'Booking Confirmed',
    message: 'Your home cleaning appointment has been confirmed for tomorrow at 2:00 PM.',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2), // 2 hours ago
    isRead: false,
  },
  {
    id: '3',
    type: 'system',
    title: 'Profile Verification',
    message: 'Your profile has been successfully verified. You now have access to all features.',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24), // 1 day ago
    isRead: true,
  },
  {
    id: '4',
    type: 'promotion',
    title: 'Special Offer',
    message: 'Get 20% off your next booking with code SERVY20.',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2), // 2 days ago
    isRead: true,
  },
  {
    id: '5',
    type: 'booking',
    title: 'Booking Reminder',
    message: 'Reminder: You have a plumbing service scheduled for tomorrow at 10:00 AM.',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24 * 3), // 3 days ago
    isRead: true,
  },
  {
    id: '6',
    type: 'payment',
    title: 'Payment Method Added',
    message: 'A new payment method has been added to your account.',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24 * 4), // 4 days ago
    isRead: true,
  },
  {
    id: '7',
    type: 'system',
    title: 'App Update Available',
    message: 'A new version of Servy is available. Update now for the latest features.',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24 * 5), // 5 days ago
    isRead: true,
  },
  {
    id: '8',
    type: 'promotion',
    title: 'New Service Available',
    message: 'We\'ve added new service providers in your area. Check them out!',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24 * 6), // 6 days ago
    isRead: true,
  },
  {
    id: '9',
    type: 'urgent-service',
    title: 'Urgent Service Request',
    message: 'Urgent Plumbing request from a customer. First come, first serve!',
    timestamp: new Date(Date.now() - 1000 * 60 * 10), // 10 minutes ago
    isRead: false,
    actionUrl: '/provider/urgent-request/9'
  }
];