import { PaymentMethod } from '@/types/wallet';

export const paymentMethods: PaymentMethod[] = [
  {
    id: 'pm1',
    type: 'card',
    name: 'Visa',
    last4: '4582',
    expiryMonth: '12',
    expiryYear: '26',
    isDefault: true,
  },
  {
    id: 'pm2',
    type: 'card',
    name: 'Mastercard',
    last4: '8745',
    expiryMonth: '09',
    expiryYear: '25',
    isDefault: false,
  },
  {
    id: 'pm3',
    type: 'bank',
    name: 'Aruba Bank',
    last4: '9012',
    isDefault: false,
  },
  {
    id: 'pm4',
    type: 'card',
    name: 'American Express',
    last4: '1234',
    expiryMonth: '03',
    expiryYear: '27',
    isDefault: false,
  },
  {
    id: 'pm5',
    type: 'card',
    name: 'Discover',
    last4: '5678',
    expiryMonth: '08',
    expiryYear: '26',
    isDefault: false,
  },
];