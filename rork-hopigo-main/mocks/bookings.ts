import { Booking } from '@/types/marketplace';

// Helper to create dates in the future
const futureDate = (days: number, hours: number) => {
  const date = new Date();
  date.setDate(date.getDate() + days);
  date.setHours(hours, 0, 0, 0);
  return date.toISOString();
};

export const bookings: Booking[] = [
  {
    id: 'booking1',
    providerId: '1',
    userId: 'user789',
    serviceId: '101',
    status: 'completed',
    price: 50,
    currency: 'AWG',
    date: futureDate(-2, 14), // 2 days ago at 2 PM
    location: 'Oranjestad, Aruba',
    notes: 'Flat tire on my Toyota Corolla',
    createdAt: futureDate(-3, 10),
  },
  {
    id: 'booking2',
    providerId: '4',
    userId: 'user789',
    serviceId: '201',
    status: 'accepted',
    price: 75,
    currency: 'AWG',
    date: futureDate(1, 10), // Tomorrow at 10 AM
    location: 'Palm Beach, Aruba',
    notes: 'Need deep cleaning for 2 bedroom apartment',
    createdAt: futureDate(-1, 15),
  },
  {
    id: 'booking3',
    providerId: '2',
    userId: 'user789',
    serviceId: '103',
    status: 'pending',
    price: 120,
    currency: 'AWG',
    date: futureDate(2, 16), // 2 days from now at 4 PM
    location: 'Noord, Aruba',
    notes: 'Car broke down on the highway',
    createdAt: futureDate(0, 9),
  },
  {
    id: 'booking4',
    providerId: '5',
    userId: 'user789',
    serviceId: '202',
    status: 'cancelled',
    price: 60,
    currency: 'AWG',
    date: futureDate(0, 13), // Today at 1 PM
    location: 'Eagle Beach, Aruba',
    notes: 'Leaking sink in bathroom',
    createdAt: futureDate(-1, 18),
  },
  // Add some bookings for other users
  {
    id: 'booking5',
    providerId: '1',
    userId: 'user123',
    serviceId: '101',
    status: 'completed',
    price: 50,
    currency: 'AWG',
    date: futureDate(-1, 11), // Yesterday at 11 AM
    location: 'San Nicolas, Aruba',
    createdAt: futureDate(-2, 9),
  },
  {
    id: 'booking6',
    providerId: '3',
    userId: 'user456',
    serviceId: '104',
    status: 'accepted',
    price: 80,
    currency: 'AWG',
    date: futureDate(1, 15), // Tomorrow at 3 PM
    location: 'Santa Cruz, Aruba',
    createdAt: futureDate(0, 10),
  },
  // Add more bookings for the next week to populate the calendar
  {
    id: 'booking7',
    providerId: '1',
    userId: 'user789',
    serviceId: '102',
    status: 'pending',
    price: 40,
    currency: 'AWG',
    date: futureDate(3, 9), // 3 days from now at 9 AM
    location: 'Oranjestad, Aruba',
    createdAt: futureDate(1, 14),
  },
  {
    id: 'booking8',
    providerId: '2',
    userId: 'user123',
    serviceId: '101',
    status: 'accepted',
    price: 55,
    currency: 'AWG',
    date: futureDate(4, 14), // 4 days from now at 2 PM
    location: 'Noord, Aruba',
    createdAt: futureDate(2, 10),
  },
  {
    id: 'booking9',
    providerId: '5',
    userId: 'user456',
    serviceId: '203',
    status: 'pending',
    price: 65,
    currency: 'AWG',
    date: futureDate(5, 11), // 5 days from now at 11 AM
    location: 'Eagle Beach, Aruba',
    createdAt: futureDate(3, 16),
  },
];