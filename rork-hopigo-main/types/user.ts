import { Language } from '@/constants/translations';

export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  avatar_url?: string;
  address?: string;
  dob?: string;
  isServiceProvider: boolean;
  walletId?: string;
  savedProviders?: string[];
  paymentMethods?: string[];
  language?: Language;
}

export interface UserProfile {
  id: string;
  bio?: string;
  location?: string;
  joinDate: string;
  isVerified: boolean;
}

export interface AuthState {
  isAuthenticated: boolean;
  user: User | null;
  isLoading: boolean;
  error: string | null;
}