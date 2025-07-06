import { Transaction } from '@/types/wallet';

export const transactions: Transaction[] = [
  {
    id: '1',
    type: 'payment',
    amount: 50,
    currency: 'AWG',
    description: 'Flat tire change - Tom Rodriguez',
    date: new Date(2025, 5, 1, 14, 30).toISOString(),
    status: 'completed',
    recipient: {
      id: '1',
      name: 'Tom Rodriguez',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&auto=format&fit=crop&q=60&ixlib=rb-4.0.3',
    }
  },
  {
    id: '2',
    type: 'transfer',
    amount: 75,
    currency: 'AWG',
    description: 'Dinner split - La Trattoria',
    date: new Date(2025, 5, 1, 9, 15).toISOString(),
    status: 'completed',
    recipient: {
      id: 'user123',
      name: 'Elena Sanchez',
      avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=400&auto=format&fit=crop&q=60&ixlib=rb-4.0.3',
    }
  },
  {
    id: '3',
    type: 'deposit',
    amount: 200,
    currency: 'AWG',
    description: 'Added funds from Visa ****4582',
    date: new Date(2025, 4, 28, 16, 45).toISOString(),
    status: 'completed',
  },
  {
    id: '4',
    type: 'payment',
    amount: 120,
    currency: 'AWG',
    description: 'Home cleaning - Sofia Martinez',
    date: new Date(2025, 4, 25, 11, 20).toISOString(),
    status: 'completed',
    recipient: {
      id: '4',
      name: 'Sofia Martinez',
      avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=400&auto=format&fit=crop&q=60&ixlib=rb-4.0.3',
    }
  },
  {
    id: '5',
    type: 'transfer',
    amount: 35,
    currency: 'AWG',
    description: 'Movie tickets',
    date: new Date(2025, 4, 22, 19, 30).toISOString(),
    status: 'completed',
    recipient: {
      id: 'user456',
      name: 'Miguel Torres',
      avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=400&auto=format&fit=crop&q=60&ixlib=rb-4.0.3',
    }
  },
];