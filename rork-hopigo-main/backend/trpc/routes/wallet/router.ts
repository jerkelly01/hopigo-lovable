import { z } from "zod";
import { TRPCError } from "@trpc/server";
import { createTRPCRouter, protectedProcedure, commonSchemas } from "../../create-context";

export const walletRouter = createTRPCRouter({
  // Get wallet balance and info
  getWallet: protectedProcedure
    .query(async ({ ctx }) => {
      const { db, user } = ctx;
      
      // Mock wallet data
      const wallet = {
        id: user.walletId || `wallet-${user.id}`,
        userId: user.id,
        balance: 125.50,
        currency: user.currency || "AWG",
        isActive: true,
        createdAt: user.createdAt,
        updatedAt: ctx.getCurrentTime(),
      };
      
      return { wallet };
    }),

  // Get transaction history
  getTransactions: protectedProcedure
    .input(z.object({
      type: z.enum(["all", "payment", "transfer", "deposit", "withdrawal", "split", "donation"]).default("all"),
      startDate: z.string().datetime().optional(),
      endDate: z.string().datetime().optional(),
      page: z.number().min(1).default(1),
      limit: z.number().min(1).max(100).default(20),
    }))
    .query(async ({ input, ctx }) => {
      const { user } = ctx;
      
      // Mock transactions
      const allTransactions = [
        {
          id: "tx1",
          type: "payment",
          amount: 45.00,
          currency: "AWG",
          description: "House cleaning service",
          date: "2024-01-20T14:30:00Z",
          status: "completed",
          recipient: {
            id: "provider1",
            name: "Clean Pro Aruba",
            avatar: "https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=400",
          },
        },
        {
          id: "tx2",
          type: "transfer",
          amount: 25.00,
          currency: "AWG",
          description: "Split dinner bill",
          date: "2024-01-19T19:15:00Z",
          status: "completed",
          recipient: {
            id: "user2",
            name: "Maria Santos",
            avatar: "https://i.pravatar.cc/150?u=user2",
          },
        },
      ];
      
      let filteredTransactions = allTransactions;
      
      // Filter by type
      if (input.type !== "all") {
        filteredTransactions = filteredTransactions.filter(tx => tx.type === input.type);
      }
      
      // Apply pagination
      const startIndex = (input.page - 1) * input.limit;
      const endIndex = startIndex + input.limit;
      const paginatedTransactions = filteredTransactions.slice(startIndex, endIndex);
      
      return {
        transactions: paginatedTransactions,
        pagination: {
          page: input.page,
          limit: input.limit,
          total: filteredTransactions.length,
          totalPages: Math.ceil(filteredTransactions.length / input.limit),
        },
      };
    }),

  // Get payment methods
  getPaymentMethods: protectedProcedure
    .query(async ({ ctx }) => {
      const { user } = ctx;
      
      // Mock payment methods
      const paymentMethods = [
        {
          id: "pm1",
          type: "card",
          name: "Visa ****1234",
          last4: "1234",
          brand: "visa",
          expiryMonth: 12,
          expiryYear: 2025,
          isDefault: true,
          createdAt: "2024-01-01T00:00:00Z",
        },
        {
          id: "pm2",
          type: "card",
          name: "Mastercard ****5678",
          last4: "5678",
          brand: "mastercard",
          expiryMonth: 8,
          expiryYear: 2026,
          isDefault: false,
          createdAt: "2024-01-15T00:00:00Z",
        },
      ];
      
      return { paymentMethods };
    }),

  // Add payment method
  addPaymentMethod: protectedProcedure
    .input(z.object({
      type: z.enum(["card", "bank_account"]),
      cardNumber: z.string().regex(/^\d{16}$/, "Invalid card number").optional(),
      expiryMonth: z.number().min(1).max(12).optional(),
      expiryYear: z.number().min(2024).optional(),
      cvv: z.string().regex(/^\d{3,4}$/, "Invalid CVV").optional(),
      holderName: z.string().min(1, "Cardholder name is required").optional(),
      bankAccount: z.string().optional(),
      routingNumber: z.string().optional(),
    }))
    .mutation(async ({ input, ctx }) => {
      const { db, generateId, getCurrentTime, user } = ctx;
      
      if (input.type === "card" && (!input.cardNumber || !input.expiryMonth || !input.expiryYear || !input.cvv)) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Card details are required for card payment method",
        });
      }
      
      const paymentMethodId = generateId();
      const paymentMethod = {
        id: paymentMethodId,
        userId: user.id,
        type: input.type,
        name: input.type === "card" ? `****${input.cardNumber?.slice(-4)}` : "Bank Account",
        last4: input.cardNumber?.slice(-4),
        brand: input.cardNumber?.startsWith("4") ? "visa" : "mastercard",
        expiryMonth: input.expiryMonth,
        expiryYear: input.expiryYear,
        isDefault: false,
        createdAt: getCurrentTime(),
      };
      
      // Store in mock database
      db.transactions.set(paymentMethodId, paymentMethod);
      
      return {
        paymentMethod,
        message: "Payment method added successfully",
      };
    }),

  // Send money
  sendMoney: protectedProcedure
    .input(z.object({
      recipientId: commonSchemas.id,
      amount: z.number().min(0.01, "Amount must be greater than 0"),
      currency: commonSchemas.currency,
      description: z.string().min(1, "Description is required"),
      paymentMethodId: commonSchemas.id.optional(),
    }))
    .mutation(async ({ input, ctx }) => {
      const { db, generateId, getCurrentTime, user } = ctx;
      
      // Validate recipient exists
      const recipient = db.users.get(input.recipientId);
      if (!recipient) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Recipient not found",
        });
      }
      
      // Create transaction
      const transactionId = generateId();
      const transaction = {
        id: transactionId,
        userId: user.id,
        type: "transfer",
        amount: input.amount,
        currency: input.currency,
        description: input.description,
        recipientId: input.recipientId,
        status: "completed",
        createdAt: getCurrentTime(),
      };
      
      db.transactions.set(transactionId, transaction);
      
      return {
        transaction,
        message: "Money sent successfully",
      };
    }),

  // Pay for service
  payForService: protectedProcedure
    .input(z.object({
      providerId: commonSchemas.id,
      serviceId: commonSchemas.id,
      amount: z.number().min(0.01, "Amount must be greater than 0"),
      currency: commonSchemas.currency,
      description: z.string().min(1, "Description is required"),
      paymentMethodId: commonSchemas.id.optional(),
    }))
    .mutation(async ({ input, ctx }) => {
      const { db, generateId, getCurrentTime, user } = ctx;
      
      // Create payment transaction
      const transactionId = generateId();
      const transaction = {
        id: transactionId,
        userId: user.id,
        type: "payment",
        amount: input.amount,
        currency: input.currency,
        description: input.description,
        providerId: input.providerId,
        serviceId: input.serviceId,
        status: "completed",
        createdAt: getCurrentTime(),
      };
      
      db.transactions.set(transactionId, transaction);
      
      return {
        transaction,
        message: "Payment processed successfully",
      };
    }),

  // Split bill
  splitBill: protectedProcedure
    .input(z.object({
      title: z.string().min(1, "Title is required"),
      totalAmount: z.number().min(0.01, "Amount must be greater than 0"),
      currency: commonSchemas.currency,
      participants: z.array(commonSchemas.id).min(1, "At least one participant is required"),
      paymentMethodId: commonSchemas.id.optional(),
    }))
    .mutation(async ({ input, ctx }) => {
      const { db, generateId, getCurrentTime, user } = ctx;
      
      const perPerson = input.totalAmount / (input.participants.length + 1);
      
      // Create split bill transaction
      const transactionId = generateId();
      const transaction = {
        id: transactionId,
        userId: user.id,
        type: "split",
        amount: perPerson,
        currency: input.currency,
        description: `Split bill: ${input.title}`,
        participants: input.participants,
        totalAmount: input.totalAmount,
        status: "completed",
        createdAt: getCurrentTime(),
      };
      
      db.transactions.set(transactionId, transaction);
      
      return {
        transaction,
        message: "Bill split successfully",
        perPersonAmount: perPerson,
      };
    }),

  // Add funds to wallet
  addFunds: protectedProcedure
    .input(z.object({
      amount: z.number().min(1, "Minimum amount is 1"),
      currency: commonSchemas.currency,
      paymentMethodId: commonSchemas.id,
    }))
    .mutation(async ({ input, ctx }) => {
      const { db, generateId, getCurrentTime, user } = ctx;
      
      // Create deposit transaction
      const transactionId = generateId();
      const transaction = {
        id: transactionId,
        userId: user.id,
        type: "deposit",
        amount: input.amount,
        currency: input.currency,
        description: "Added funds to wallet",
        paymentMethodId: input.paymentMethodId,
        status: "completed",
        createdAt: getCurrentTime(),
      };
      
      db.transactions.set(transactionId, transaction);
      
      return {
        transaction,
        message: "Funds added successfully",
      };
    }),
});