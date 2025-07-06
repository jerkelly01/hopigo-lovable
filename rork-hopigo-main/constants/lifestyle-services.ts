export interface LifestyleService {
  id: string;
  name: string;
  icon: string;
  description: string;
  color: string;
}

export const lifestyleServices: LifestyleService[] = [
  {
    id: 'bill-payments',
    name: 'Bill Payments',
    icon: 'receipt',
    description: 'Pay utilities and bills',
    color: '#4CAF50',
  },
  {
    id: 'fuel-up',
    name: 'Fuel Up',
    icon: 'car',
    description: 'Find and pay for fuel',
    color: '#FF9800',
  },
  {
    id: 'event-tickets',
    name: 'Event Tickets',
    icon: 'ticket',
    description: 'Book event tickets',
    color: '#9C27B0',
  },
  {
    id: 'donations',
    name: 'Donations',
    icon: 'heart',
    description: 'Support local causes',
    color: '#E91E63',
  },
  {
    id: 'loyalty-programs',
    name: 'Loyalty Programs',
    icon: 'award',
    description: 'Earn rewards and points',
    color: '#3F51B5',
  },
  {
    id: 'deals',
    name: 'Deals',
    icon: 'percent',
    description: 'Exclusive offers and discounts',
    color: '#FF5722',
  },
];