export interface Category {
  id: string;
  name: string;
  icon: string;
  color: string;
  subCategories?: SubCategory[];
}

export interface SubCategory {
  id: string;
  name: string;
  description?: string;
  icon?: string;
}

export interface ServiceProvider {
  id: string;
  name: string;
  description: string;
  rating: number;
  reviewCount: number;
  image: string;
  category: string;
  services: string[];
  pricing: Record<string, any>;
  availability: string;
  location: string;
  verified: boolean;
  responseTime: string;
  completedJobs: number;
  tags: string[];
  portfolio?: string[];
  contact: {
    phone: string;
    email: string;
    whatsapp?: string;
  };
}

export interface Booking {
  id: string;
  providerId: string;
  providerName: string;
  providerImage: string;
  service: string;
  date: string;
  time: string;
  location: string;
  price: number;
  currency: string;
  status: 'pending' | 'accepted' | 'in_progress' | 'completed' | 'cancelled';
  createdAt: string;
  notes?: string;
  estimatedDuration?: number;
}

export interface Availability {
  startTime: string;
  endTime: string;
  available: boolean;
}

export interface Location {
  latitude: number;
  longitude: number;
  address: string;
}

// Taxi-specific types
export type RideType = 'standard' | 'premium' | 'xl' | 'express';

export interface TaxiDriver {
  id: string;
  name: string;
  avatar: string;
  rating: number;
  reviewCount: number;
  verified: boolean;
  vehicleInfo: {
    make: string;
    model: string;
    year: number;
    color: string;
    licensePlate: string;
    type: 'sedan' | 'suv' | 'luxury' | 'van';
  };
  currentLocation?: Location;
  isOnline: boolean;
  isAvailable: boolean;
  phoneNumber: string;
}

export interface TaxiRide {
  id: string;
  userId: string;
  driverId?: string;
  status: 'requesting' | 'driver_assigned' | 'driver_arriving' | 'pickup' | 'in_transit' | 'completed' | 'cancelled' | 'scheduled';
  pickupLocation: Location;
  dropoffLocation: Location;
  estimatedFare: number;
  actualFare?: number;
  currency: string;
  estimatedDuration: number;
  actualDuration?: number;
  estimatedDistance: number;
  actualDistance?: number;
  requestedAt: string;
  assignedAt?: string;
  pickedUpAt?: string;
  completedAt?: string;
  cancelledAt?: string;
  cancellationReason?: string;
  rideType: RideType;
  paymentMethodId: string;
  notes?: string;
  driverLocation?: Location;
  rating?: number;
  review?: string;
  scheduledFor?: string; // ISO date string for scheduled rides
}

export interface TaxiBookingRequest {
  pickupLocation: Location;
  dropoffLocation: Location;
  rideType: RideType;
  paymentMethodId: string;
  notes?: string;
  scheduledFor?: string; // ISO date string for scheduled rides
}

export interface FareEstimate {
  rideType: RideType;
  baseFare: number;
  distanceFare: number;
  timeFare: number;
  totalFare: number;
  currency: string;
  estimatedDuration: number;
  estimatedDistance: number;
}