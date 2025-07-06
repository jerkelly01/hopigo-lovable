// In-memory database simulation
export interface User {
  id: string;
  email: string;
  name: string;
  role: "user" | "provider";
  password: string; // In real app, this would be hashed
  createdAt: Date;
  updatedAt: Date;
  isVerified: boolean;
  avatar?: string;
  phone?: string;
}

export interface Service {
  id: string;
  name: string;
  description: string;
  price: number;
  duration: number;
  category: string;
  providerId: string;
  image: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface Booking {
  id: string;
  userId: string;
  serviceId: string;
  providerId: string;
  date: string;
  time: string;
  duration: number;
  price: number;
  address: string;
  notes?: string;
  status: "upcoming" | "in-progress" | "completed" | "cancelled";
  createdAt: Date;
  updatedAt: Date;
}

export interface Transaction {
  id: string;
  userId: string;
  type: "add_funds" | "send_money" | "payment" | "refund";
  amount: number;
  description: string;
  status: "pending" | "completed" | "failed";
  createdAt: Date;
  recipientId?: string;
  bookingId?: string;
}

export interface Wallet {
  userId: string;
  balance: number;
  currency: string;
  updatedAt: Date;
}

export interface PaymentMethod {
  id: string;
  userId: string;
  type: "card" | "bank" | "paypal";
  last4: string;
  brand: string;
  isDefault: boolean;
  createdAt: Date;
}

export interface Notification {
  id: string;
  userId: string;
  title: string;
  message: string;
  type: "booking" | "payment" | "system" | "promotion";
  isRead: boolean;
  createdAt: Date;
  data?: any;
}

// In-memory storage
class InMemoryDatabase {
  private users: Map<string, User> = new Map();
  private services: Map<string, Service> = new Map();
  private bookings: Map<string, Booking> = new Map();
  private transactions: Map<string, Transaction> = new Map();
  private wallets: Map<string, Wallet> = new Map();
  private paymentMethods: Map<string, PaymentMethod> = new Map();
  private notifications: Map<string, Notification> = new Map();

  constructor() {
    this.seedData();
  }

  // Users
  createUser(user: Omit<User, "id" | "createdAt" | "updatedAt">): User {
    const id = `user-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    const newUser: User = {
      ...user,
      id,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    this.users.set(id, newUser);
    
    // Create wallet for new user
    this.wallets.set(id, {
      userId: id,
      balance: 0,
      currency: "USD",
      updatedAt: new Date(),
    });

    return newUser;
  }

  getUserByEmail(email: string): User | undefined {
    return Array.from(this.users.values()).find(user => user.email === email);
  }

  getUserById(id: string): User | undefined {
    return this.users.get(id);
  }

  updateUser(id: string, updates: Partial<User>): User | undefined {
    const user = this.users.get(id);
    if (!user) return undefined;
    
    const updatedUser = { ...user, ...updates, updatedAt: new Date() };
    this.users.set(id, updatedUser);
    return updatedUser;
  }

  // Services
  createService(service: Omit<Service, "id" | "createdAt" | "updatedAt">): Service {
    const id = `service-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    const newService: Service = {
      ...service,
      id,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    this.services.set(id, newService);
    return newService;
  }

  getServiceById(id: string): Service | undefined {
    return this.services.get(id);
  }

  getServicesByProvider(providerId: string): Service[] {
    return Array.from(this.services.values()).filter(service => service.providerId === providerId);
  }

  searchServices(filters: {
    query?: string;
    category?: string;
    priceMin?: number;
    priceMax?: number;
    providerId?: string;
  }): Service[] {
    let services = Array.from(this.services.values()).filter(service => service.isActive);

    if (filters.query) {
      const query = filters.query.toLowerCase();
      services = services.filter(service =>
        service.name.toLowerCase().includes(query) ||
        service.description.toLowerCase().includes(query)
      );
    }

    if (filters.category) {
      services = services.filter(service => service.category === filters.category);
    }

    if (filters.priceMin !== undefined) {
      services = services.filter(service => service.price >= filters.priceMin!);
    }

    if (filters.priceMax !== undefined) {
      services = services.filter(service => service.price <= filters.priceMax!);
    }

    if (filters.providerId) {
      services = services.filter(service => service.providerId === filters.providerId);
    }

    return services;
  }

  // Bookings
  createBooking(booking: Omit<Booking, "id" | "createdAt" | "updatedAt">): Booking {
    const id = `booking-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    const newBooking: Booking = {
      ...booking,
      id,
      status: "upcoming",
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    this.bookings.set(id, newBooking);
    return newBooking;
  }

  getBookingById(id: string): Booking | undefined {
    return this.bookings.get(id);
  }

  getBookingsByUser(userId: string): Booking[] {
    return Array.from(this.bookings.values()).filter(booking => booking.userId === userId);
  }

  getBookingsByProvider(providerId: string): Booking[] {
    return Array.from(this.bookings.values()).filter(booking => booking.providerId === providerId);
  }

  updateBooking(id: string, updates: Partial<Booking>): Booking | undefined {
    const booking = this.bookings.get(id);
    if (!booking) return undefined;
    
    const updatedBooking = { ...booking, ...updates, updatedAt: new Date() };
    this.bookings.set(id, updatedBooking);
    return updatedBooking;
  }

  // Transactions
  createTransaction(transaction: Omit<Transaction, "id" | "createdAt">): Transaction {
    const id = `txn-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    const newTransaction: Transaction = {
      ...transaction,
      id,
      createdAt: new Date(),
    };
    this.transactions.set(id, newTransaction);
    return newTransaction;
  }

  getTransactionsByUser(userId: string): Transaction[] {
    return Array.from(this.transactions.values())
      .filter(transaction => transaction.userId === userId)
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
  }

  // Wallets
  getWallet(userId: string): Wallet | undefined {
    return this.wallets.get(userId);
  }

  updateWalletBalance(userId: string, amount: number): Wallet | undefined {
    const wallet = this.wallets.get(userId);
    if (!wallet) return undefined;
    
    const updatedWallet = { ...wallet, balance: wallet.balance + amount, updatedAt: new Date() };
    this.wallets.set(userId, updatedWallet);
    return updatedWallet;
  }

  // Payment Methods
  createPaymentMethod(paymentMethod: Omit<PaymentMethod, "id" | "createdAt">): PaymentMethod {
    const id = `pm-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    const newPaymentMethod: PaymentMethod = {
      ...paymentMethod,
      id,
      createdAt: new Date(),
    };
    this.paymentMethods.set(id, newPaymentMethod);
    return newPaymentMethod;
  }

  getPaymentMethodsByUser(userId: string): PaymentMethod[] {
    return Array.from(this.paymentMethods.values()).filter(pm => pm.userId === userId);
  }

  // Notifications
  createNotification(notification: Omit<Notification, "id" | "createdAt">): Notification {
    const id = `notif-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    const newNotification: Notification = {
      ...notification,
      id,
      createdAt: new Date(),
    };
    this.notifications.set(id, newNotification);
    return newNotification;
  }

  getNotificationsByUser(userId: string): Notification[] {
    return Array.from(this.notifications.values())
      .filter(notification => notification.userId === userId)
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
  }

  markNotificationAsRead(id: string): boolean {
    const notification = this.notifications.get(id);
    if (!notification) return false;
    
    notification.isRead = true;
    this.notifications.set(id, notification);
    return true;
  }

  private seedData() {
    // Seed users
    const user1 = this.createUser({
      email: "user@example.com",
      name: "John Doe",
      role: "user",
      password: "password123",
      isVerified: true,
      avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face",
    });

    const provider1 = this.createUser({
      email: "provider@example.com",
      name: "Jane Provider",
      role: "provider",
      password: "password123",
      isVerified: true,
      avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face",
    });

    // Add initial wallet balance
    this.updateWalletBalance(user1.id, 125.50);
    this.updateWalletBalance(provider1.id, 250.00);

    // Seed payment methods
    this.createPaymentMethod({
      userId: user1.id,
      type: "card",
      last4: "4242",
      brand: "Visa",
      isDefault: true,
    });

    // Seed services
    const service1 = this.createService({
      name: "Basic House Cleaning",
      description: "Standard cleaning service including dusting, vacuuming, and bathroom cleaning",
      price: 45.00,
      duration: 2,
      category: "cleaning",
      providerId: provider1.id,
      image: "https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=300&h=200&fit=crop",
      isActive: true,
    });

    this.createService({
      name: "Deep House Cleaning",
      description: "Comprehensive deep cleaning including baseboards, inside appliances, and detailed work",
      price: 85.00,
      duration: 4,
      category: "cleaning",
      providerId: provider1.id,
      image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=300&h=200&fit=crop",
      isActive: true,
    });

    // Seed bookings
    this.createBooking({
      userId: user1.id,
      serviceId: service1.id,
      providerId: provider1.id,
      date: "2025-01-15",
      time: "10:00",
      duration: 2,
      price: 45.00,
      address: "123 Main St, City, State 12345",
      notes: "Please focus on the kitchen and bathrooms",
    });

    // Seed transactions
    this.createTransaction({
      userId: user1.id,
      type: "add_funds",
      amount: 100.00,
      description: "Added funds via Visa ****4242",
      status: "completed",
    });

    this.createTransaction({
      userId: user1.id,
      type: "payment",
      amount: -45.00,
      description: "Payment for Basic House Cleaning",
      status: "completed",
      recipientId: provider1.id,
    });

    // Seed notifications
    this.createNotification({
      userId: user1.id,
      title: "Booking Confirmed",
      message: "Your house cleaning service has been confirmed for January 15th at 10:00 AM",
      type: "booking",
      isRead: false,
      data: { bookingId: "booking-1" },
    });

    this.createNotification({
      userId: user1.id,
      title: "Payment Successful",
      message: "Your payment of $45.00 has been processed successfully",
      type: "payment",
      isRead: false,
    });
  }
}

export const db = new InMemoryDatabase();