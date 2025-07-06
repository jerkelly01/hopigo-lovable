import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Transaction, PaymentMethod } from '@/types/wallet';
import { transactions as mockTransactions } from '@/mocks/transactions';
import { paymentMethods as mockPaymentMethods } from '@/mocks/payment-methods';
import { supabase } from '@/lib/supabase';

interface WalletState {
  balance: number;
  currency: string;
  transactions: Transaction[];
  paymentMethods: PaymentMethod[];
  defaultPaymentMethodId: string | null;
  isLoading: boolean;
  error: string | null;
  
  // Actions
  fetchWallet: () => Promise<void>;
  fetchPaymentMethods: () => Promise<void>;
  addPaymentMethod: (paymentMethod: Omit<PaymentMethod, 'id'>) => Promise<void>;
  setDefaultPaymentMethod: (paymentMethodId: string) => Promise<void>;
  removePaymentMethod: (paymentMethodId: string) => Promise<void>;
  sendMoney: (recipientId: string, amount: number, description: string) => Promise<void>;
  payForService: (providerId: string, serviceId: string, amount: number, description: string) => Promise<void>;
  splitBill: (title: string, amount: number, participants: string[]) => Promise<void>;
  purchaseEventTicket: (eventId: string, eventTitle: string, ticketPrice: number, quantity: number, paymentMethodId: string) => Promise<void>;
  processDonation: (causeId: string, causeTitle: string, amount: number, paymentMethodId: string) => Promise<void>;
  payForTaxiRide: (rideId: string, amount: number, driverName: string, paymentMethodId?: string) => Promise<void>;
  deductBalance: (amount: number, description: string) => Promise<void>;
  addFunds: (amount: number, paymentMethodDescription: string) => Promise<void>;
  withdrawToBank: (bankAccountId: string, amount: number) => Promise<void>;
}

export const useWalletStore = create<WalletState>()(
  persist(
    (set, get) => ({
      balance: 50,
      currency: 'AWG',
      transactions: mockTransactions,
      paymentMethods: mockPaymentMethods,
      defaultPaymentMethodId: mockPaymentMethods.length > 0 ? mockPaymentMethods[0].id : null,
      isLoading: false,
      error: null,

      fetchWallet: async () => {
        set({ isLoading: true, error: null });
        try {
          // Get current user
          const { data: { user } } = await supabase.auth.getUser();
          
          if (!user) {
            set({ isLoading: false });
            return;
          }
          
          // Try to fetch transactions from Supabase
          const { data: transactions, error: transactionsError } = await supabase
            .from('transactions')
            .select('*')
            .eq('user_id', user.id)
            .order('created_at', { ascending: false });
          
          if (transactionsError) {
            console.warn('Transactions table not found, using mock data:', transactionsError);
            set({ transactions: mockTransactions, isLoading: false });
            return;
          }
          
          // Transform Supabase data to match our Transaction type
          const transformedTransactions = transactions?.map(tx => ({
            id: tx.id,
            type: tx.type,
            amount: tx.amount,
            currency: tx.currency,
            description: tx.description,
            date: tx.date,
            status: tx.status,
            recipient: tx.recipient_id ? {
              id: tx.recipient_id,
              name: 'Unknown',
              avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=400&auto=format&fit=crop&q=60&ixlib=rb-4.0.3',
            } : undefined,
          })) || [];
          
          set({ transactions: transformedTransactions, isLoading: false });
        } catch (error) {
          console.error("Fetch wallet error:", error);
          // Fallback to mock data
          set({ 
            transactions: mockTransactions,
            isLoading: false, 
            error: error instanceof Error ? error.message : 'Failed to load wallet' 
          });
        }
      },

      fetchPaymentMethods: async () => {
        set({ isLoading: true, error: null });
        try {
          // For now, use mock data since payment methods are typically stored securely
          // In a real app, you would fetch payment method metadata (not sensitive data) from Supabase
          set({ 
            paymentMethods: mockPaymentMethods,
            defaultPaymentMethodId: mockPaymentMethods.length > 0 ? mockPaymentMethods[0].id : null,
            isLoading: false 
          });
        } catch (error) {
          console.error("Fetch payment methods error:", error);
          set({ 
            paymentMethods: mockPaymentMethods,
            defaultPaymentMethodId: mockPaymentMethods.length > 0 ? mockPaymentMethods[0].id : null,
            isLoading: false, 
            error: error instanceof Error ? error.message : 'Failed to load payment methods' 
          });
        }
      },

      addPaymentMethod: async (paymentMethodData) => {
        set({ isLoading: true, error: null });
        try {
          await new Promise(resolve => setTimeout(resolve, 1000));
          
          const newPaymentMethod: PaymentMethod = {
            id: 'pm' + Date.now(),
            ...paymentMethodData,
          };
          
          const isFirst = get().paymentMethods.length === 0;
          
          set(state => ({ 
            paymentMethods: [...state.paymentMethods, newPaymentMethod],
            defaultPaymentMethodId: isFirst ? newPaymentMethod.id : state.defaultPaymentMethodId,
            isLoading: false 
          }));
        } catch (error) {
          console.error("Add payment method error:", error);
          set({ 
            isLoading: false, 
            error: error instanceof Error ? error.message : 'Failed to add payment method' 
          });
        }
      },

      setDefaultPaymentMethod: async (paymentMethodId) => {
        set({ isLoading: true, error: null });
        try {
          await new Promise(resolve => setTimeout(resolve, 800));
          
          const exists = get().paymentMethods.some(pm => pm.id === paymentMethodId);
          if (!exists) {
            throw new Error('Payment method not found');
          }
          
          set({ 
            defaultPaymentMethodId: paymentMethodId,
            isLoading: false 
          });
        } catch (error) {
          console.error("Set default payment method error:", error);
          set({ 
            isLoading: false, 
            error: error instanceof Error ? error.message : 'Failed to set default payment method' 
          });
        }
      },

      removePaymentMethod: async (paymentMethodId) => {
        set({ isLoading: true, error: null });
        try {
          await new Promise(resolve => setTimeout(resolve, 800));
          
          const updatedPaymentMethods = get().paymentMethods.filter(
            pm => pm.id !== paymentMethodId
          );
          
          let defaultId = get().defaultPaymentMethodId;
          if (defaultId === paymentMethodId) {
            defaultId = updatedPaymentMethods.length > 0 ? updatedPaymentMethods[0].id : null;
          }
          
          set({ 
            paymentMethods: updatedPaymentMethods,
            defaultPaymentMethodId: defaultId,
            isLoading: false 
          });
        } catch (error) {
          console.error("Remove payment method error:", error);
          set({ 
            isLoading: false, 
            error: error instanceof Error ? error.message : 'Failed to remove payment method' 
          });
        }
      },

      sendMoney: async (recipientId, amount, description) => {
        set({ isLoading: true, error: null });
        try {
          // Get current user
          const { data: { user } } = await supabase.auth.getUser();
          
          if (!user) {
            throw new Error('User not authenticated');
          }
          
          if (!get().defaultPaymentMethodId) {
            throw new Error('No payment method available');
          }
          
          const paymentMethod = get().paymentMethods.find(
            pm => pm.id === get().defaultPaymentMethodId
          );
          
          if (!paymentMethod) {
            throw new Error('Default payment method not found');
          }
          
          const recipient = {
            id: recipientId,
            name: 'Friend',
            avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=400&auto=format&fit=crop&q=60&ixlib=rb-4.0.3',
          };
          
          // Try to create transaction in Supabase
          const { data, error } = await supabase
            .from('transactions')
            .insert({
              user_id: user.id,
              type: 'transfer',
              amount,
              currency: get().currency,
              description: `${description} (Charged to ${paymentMethod.name} ****${paymentMethod.last4})`,
              date: new Date().toISOString(),
              status: 'completed',
              recipient_id: recipientId,
            })
            .select()
            .single();
          
          let newTransaction: Transaction;
          
          if (error) {
            console.warn('Transactions table not found, using mock data:', error);
            // Fallback to mock creation
            newTransaction = {
              id: 'tx' + Date.now(),
              type: 'transfer',
              amount,
              currency: get().currency,
              description: `${description} (Charged to ${paymentMethod.name} ****${paymentMethod.last4})`,
              date: new Date().toISOString(),
              status: 'completed',
              recipient,
            };
          } else {
            // Transform Supabase data
            newTransaction = {
              id: data.id,
              type: data.type,
              amount: data.amount,
              currency: data.currency,
              description: data.description,
              date: data.date,
              status: data.status,
              recipient,
            };
          }
          
          set(state => ({ 
            transactions: [newTransaction, ...state.transactions],
            isLoading: false 
          }));
        } catch (error) {
          console.error("Send money error:", error);
          set({ 
            isLoading: false, 
            error: error instanceof Error ? error.message : 'Failed to send money' 
          });
          throw error;
        }
      },

      payForService: async (providerId, serviceId, amount, description) => {
        set({ isLoading: true, error: null });
        try {
          // Get current user
          const { data: { user } } = await supabase.auth.getUser();
          
          if (!user) {
            throw new Error('User not authenticated');
          }
          
          if (!get().defaultPaymentMethodId) {
            throw new Error('No payment method available');
          }
          
          const paymentMethod = get().paymentMethods.find(
            pm => pm.id === get().defaultPaymentMethodId
          );
          
          if (!paymentMethod) {
            throw new Error('Default payment method not found');
          }
          
          const provider = {
            id: providerId,
            name: description.split(' - ')[1] || 'Service Provider',
            avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&auto=format&fit=crop&q=60&ixlib=rb-4.0.3',
          };
          
          // Try to create transaction in Supabase
          const { data, error } = await supabase
            .from('transactions')
            .insert({
              user_id: user.id,
              type: 'payment',
              amount,
              currency: get().currency,
              description: `${description} (Charged to ${paymentMethod.name} ****${paymentMethod.last4})`,
              date: new Date().toISOString(),
              status: 'completed',
              recipient_id: providerId,
            })
            .select()
            .single();
          
          let newTransaction: Transaction;
          
          if (error) {
            console.warn('Transactions table not found, using mock data:', error);
            // Fallback to mock creation
            newTransaction = {
              id: 'tx' + Date.now(),
              type: 'payment',
              amount,
              currency: get().currency,
              description: `${description} (Charged to ${paymentMethod.name} ****${paymentMethod.last4})`,
              date: new Date().toISOString(),
              status: 'completed',
              recipient: provider,
            };
          } else {
            // Transform Supabase data
            newTransaction = {
              id: data.id,
              type: data.type,
              amount: data.amount,
              currency: data.currency,
              description: data.description,
              date: data.date,
              status: data.status,
              recipient: provider,
            };
          }
          
          set(state => ({ 
            transactions: [newTransaction, ...state.transactions],
            isLoading: false 
          }));
        } catch (error) {
          console.error("Pay for service error:", error);
          set({ 
            isLoading: false, 
            error: error instanceof Error ? error.message : 'Failed to pay for service' 
          });
          throw error;
        }
      },

      splitBill: async (title, amount, participants) => {
        set({ isLoading: true, error: null });
        try {
          // Get current user
          const { data: { user } } = await supabase.auth.getUser();
          
          if (!user) {
            throw new Error('User not authenticated');
          }
          
          if (!get().defaultPaymentMethodId) {
            throw new Error('No payment method available');
          }
          
          const paymentMethod = get().paymentMethods.find(
            pm => pm.id === get().defaultPaymentMethodId
          );
          
          if (!paymentMethod) {
            throw new Error('Default payment method not found');
          }
          
          const perPerson = amount / (participants.length + 1);
          
          const newTransaction: Transaction = {
            id: 'tx' + Date.now(),
            type: 'split',
            amount: perPerson,
            currency: get().currency,
            description: `Split bill: ${title} (${participants.length + 1} people, charged to ${paymentMethod.name} ****${paymentMethod.last4})`,
            date: new Date().toISOString(),
            status: 'completed',
            participants: participants.map(id => ({
              id,
              name: `Friend ${id.slice(-4)}`,
              avatar: `https://i.pravatar.cc/150?u=${id}`,
              amount: perPerson
            }))
          };
          
          set(state => ({ 
            transactions: [newTransaction, ...state.transactions],
            isLoading: false 
          }));
        } catch (error) {
          console.error("Split bill error:", error);
          set({ 
            isLoading: false, 
            error: error instanceof Error ? error.message : 'Failed to create split bill' 
          });
          throw error;
        }
      },

      purchaseEventTicket: async (eventId, eventTitle, ticketPrice, quantity, paymentMethodId) => {
        set({ isLoading: true, error: null });
        try {
          const paymentMethod = get().paymentMethods.find(
            pm => pm.id === paymentMethodId
          );
          
          if (!paymentMethod) {
            throw new Error('Payment method not found');
          }
          
          const totalAmount = ticketPrice * quantity;
          
          const newTransaction: Transaction = {
            id: 'tx' + Date.now(),
            type: 'payment',
            amount: totalAmount,
            currency: get().currency,
            description: `Event ticket: ${eventTitle} (${quantity} ticket${quantity > 1 ? 's' : ''}, charged to ${paymentMethod.name} ****${paymentMethod.last4})`,
            date: new Date().toISOString(),
            status: 'completed',
            recipient: {
              id: eventId,
              name: eventTitle,
              avatar: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400&auto=format&fit=crop&q=60',
            },
          };
          
          set(state => ({ 
            transactions: [newTransaction, ...state.transactions],
            isLoading: false 
          }));
        } catch (error) {
          console.error("Purchase event ticket error:", error);
          set({ 
            isLoading: false, 
            error: error instanceof Error ? error.message : 'Failed to purchase event ticket' 
          });
          throw error;
        }
      },

      processDonation: async (causeId, causeTitle, amount, paymentMethodId) => {
        set({ isLoading: true, error: null });
        try {
          const paymentMethod = get().paymentMethods.find(
            pm => pm.id === paymentMethodId
          );
          
          if (!paymentMethod) {
            throw new Error('Payment method not found');
          }
          
          const newTransaction: Transaction = {
            id: 'tx' + Date.now(),
            type: 'donation',
            amount,
            currency: get().currency,
            description: `Donation: ${causeTitle} (charged to ${paymentMethod.name} ****${paymentMethod.last4})`,
            date: new Date().toISOString(),
            status: 'completed',
            recipient: {
              id: causeId,
              name: causeTitle,
              avatar: 'https://images.unsplash.com/photo-1601758228041-f3b2795255f1?w=400&auto=format&fit=crop&q=60',
            },
          };
          
          set(state => ({ 
            transactions: [newTransaction, ...state.transactions],
            isLoading: false 
          }));
        } catch (error) {
          console.error("Process donation error:", error);
          set({ 
            isLoading: false, 
            error: error instanceof Error ? error.message : 'Failed to process donation' 
          });
          throw error;
        }
      },

      payForTaxiRide: async (rideId, amount, driverName, paymentMethodId) => {
        set({ isLoading: true, error: null });
        try {
          const selectedPaymentMethodId = paymentMethodId || get().defaultPaymentMethodId;
          const paymentMethod = get().paymentMethods.find(
            pm => pm.id === selectedPaymentMethodId
          );
          
          if (!paymentMethod) {
            throw new Error('Payment method not found');
          }
          
          const newTransaction: Transaction = {
            id: 'tx' + Date.now(),
            type: 'payment',
            amount,
            currency: get().currency,
            description: `Taxi ride with ${driverName} (charged to ${paymentMethod.name} ****${paymentMethod.last4})`,
            date: new Date().toISOString(),
            status: 'completed',
            recipient: {
              id: rideId,
              name: driverName,
              avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&auto=format&fit=crop&q=60',
            },
          };
          
          set(state => ({ 
            transactions: [newTransaction, ...state.transactions],
            isLoading: false 
          }));
        } catch (error) {
          console.error("Pay for taxi ride error:", error);
          set({ 
            isLoading: false, 
            error: error instanceof Error ? error.message : 'Failed to pay for taxi ride' 
          });
          throw error;
        }
      },

      deductBalance: async (amount, description) => {
        set({ isLoading: true, error: null });
        try {
          await new Promise(resolve => setTimeout(resolve, 500));
          
          const currentBalance = get().balance;
          if (currentBalance < amount) {
            throw new Error('Insufficient balance');
          }
          
          const newTransaction: Transaction = {
            id: 'tx' + Date.now(),
            type: 'payment',
            amount,
            currency: get().currency,
            description,
            date: new Date().toISOString(),
            status: 'completed',
          };
          
          set(state => ({ 
            balance: state.balance - amount,
            transactions: [newTransaction, ...state.transactions],
            isLoading: false 
          }));
        } catch (error) {
          console.error("Deduct balance error:", error);
          set({ 
            isLoading: false, 
            error: error instanceof Error ? error.message : 'Failed to deduct balance' 
          });
          throw error;
        }
      },

      addFunds: async (amount, paymentMethodDescription) => {
        set({ isLoading: true, error: null });
        try {
          await new Promise(resolve => setTimeout(resolve, 1000));
          
          const newTransaction: Transaction = {
            id: 'tx' + Date.now(),
            type: 'deposit',
            amount,
            currency: get().currency,
            description: `Added funds via ${paymentMethodDescription}`,
            date: new Date().toISOString(),
            status: 'completed',
          };
          
          set(state => ({ 
            balance: state.balance + amount,
            transactions: [newTransaction, ...state.transactions],
            isLoading: false 
          }));
        } catch (error) {
          console.error("Add funds error:", error);
          set({ 
            isLoading: false, 
            error: error instanceof Error ? error.message : 'Failed to add funds' 
          });
          throw error;
        }
      },

      withdrawToBank: async (bankAccountId, amount) => {
        set({ isLoading: true, error: null });
        try {
          await new Promise(resolve => setTimeout(resolve, 1500));
          
          const bankAccount = get().paymentMethods.find(
            pm => pm.id === bankAccountId && pm.type === 'bank'
          );
          
          if (!bankAccount) {
            throw new Error('Bank account not found');
          }
          
          const currentBalance = get().balance;
          if (currentBalance < amount) {
            throw new Error('Insufficient balance');
          }
          
          const newTransaction: Transaction = {
            id: 'tx' + Date.now(),
            type: 'withdrawal',
            amount,
            currency: get().currency,
            description: `Withdrawal to ${bankAccount.name} ****${bankAccount.last4}`,
            date: new Date().toISOString(),
            status: 'pending',
            recipient: {
              id: bankAccountId,
              name: bankAccount.name,
              avatar: 'https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=400&auto=format&fit=crop&q=60',
            },
          };
          
          set(state => ({ 
            balance: state.balance - amount,
            transactions: [newTransaction, ...state.transactions],
            isLoading: false 
          }));
        } catch (error) {
          console.error("Withdraw to bank error:", error);
          set({ 
            isLoading: false, 
            error: error instanceof Error ? error.message : 'Failed to withdraw to bank' 
          });
          throw error;
        }
      },
    }),
    {
      name: 'wallet-storage',
      storage: createJSONStorage(() => AsyncStorage),
      onRehydrateStorage: () => (state, error) => {
        if (error) {
          console.error("Wallet store rehydration error:", error);
        }
      },
    }
  )
);