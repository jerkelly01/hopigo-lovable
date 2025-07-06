export interface Transaction {
  id: string;
  type: 'transfer' | 'payment' | 'deposit' | 'withdrawal' | 'refund' | 'split' | 'donation';
  amount: number;
  currency: string;
  description: string;
  date: string;
  status: 'pending' | 'completed' | 'failed';
  recipient?: {
    id: string;
    name: string;
    avatar: string;
  };
  participants?: {
    id: string;
    name: string;
    avatar: string;
    amount: number;
  }[];
}

export interface PaymentMethod {
  id: string;
  type: 'card' | 'bank' | 'paypal';
  name: string;
  last4: string;
  expiryDate?: string;
  expiryMonth?: string;
  expiryYear?: string;
  isDefault: boolean;
}