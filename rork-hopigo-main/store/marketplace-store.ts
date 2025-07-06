import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Category, ServiceProvider, Booking, Availability, Location, TaxiDriver, TaxiRide, TaxiBookingRequest, FareEstimate } from '@/types/marketplace';
import { categories as mockCategories } from '@/constants/categories';
import { providers as mockProviders } from '@/mocks/providers';
import { bookings as mockBookings } from '@/mocks/bookings';
import { supabase } from '@/lib/supabase';
import * as ExpoLocation from 'expo-location';
import { Platform } from 'react-native';

interface MarketplaceState {
  categories: Category[];
  providers: ServiceProvider[];
  bookings: Booking[];
  selectedCategory: string | null;
  selectedSubCategory: string | null;
  filteredProviders: ServiceProvider[];
  recentSearches: string[];
  isLoading: boolean;
  error: string | null;
  urgentRequests: Array<{ id: string, categoryId: string, details: string, timestamp: Date, status: 'pending' | 'accepted' | 'completed' | 'cancelled' }>;
  currentLocation: Location | null;
  
  // Taxi-specific state
  taxiDrivers: TaxiDriver[];
  currentTaxiRide: TaxiRide | null;
  taxiRideHistory: TaxiRide[];
  scheduledRides: TaxiRide[];
  nearbyDrivers: TaxiDriver[];
  isRequestingRide: boolean;
  fareEstimate: FareEstimate | null;
  
  // Actions
  fetchCategories: () => Promise<void>;
  fetchProviders: (categoryId?: string, subCategoryId?: string) => Promise<void>;
  fetchBookings: () => Promise<void>;
  selectCategory: (categoryId: string | null) => void;
  selectSubCategory: (subCategoryId: string | null) => void;
  createBooking: (booking: Omit<Booking, 'id' | 'status' | 'createdAt'>) => Promise<Booking>;
  cancelBooking: (bookingId: string) => Promise<void>;
  getProviderAvailability: (providerId: string, date: Date) => Promise<Availability[]>;
  addRecentSearch: (searchQuery: string) => void;
  clearRecentSearches: () => void;
  applyFilter: (filter: string | null) => void;
  submitUrgentRequest: (categoryId: string, details: string) => Promise<string>;
  getCurrentLocation: () => Promise<Location | null>;
  geocodeAddress: (address: string) => Promise<Location | null>;
  reverseGeocode: (latitude: number, longitude: number) => Promise<string>;
  getAddressSuggestions: (query: string) => Promise<Location[]>;
  
  // Taxi actions
  requestTaxiRide: (request: TaxiBookingRequest) => Promise<TaxiRide>;
  requestScheduledTaxiRide: (request: TaxiBookingRequest) => Promise<TaxiRide>;
  cancelTaxiRide: (rideId: string, reason?: string) => Promise<void>;
  getFareEstimate: (pickupLocation: Location, dropoffLocation: Location, rideType: string) => Promise<FareEstimate>;
  findNearbyDrivers: (location: Location, rideType: string) => Promise<TaxiDriver[]>;
  updateDriverLocation: (driverId: string, location: Location) => Promise<void>;
  acceptRideRequest: (driverId: string, rideId: string) => Promise<void>;
  updateRideStatus: (rideId: string, status: TaxiRide['status']) => Promise<void>;
  completeRide: (rideId: string, actualFare: number, actualDistance: number, actualDuration: number) => Promise<void>;
  rateTaxiRide: (rideId: string, rating: number, comment?: string) => Promise<void>;
  getScheduledRides: () => TaxiRide[];
  cancelScheduledRide: (rideId: string, reason?: string) => Promise<void>;
}

// Expanded mock address suggestions for Aruba
const mockAddressSuggestions: Location[] = [
  // Beaches
  { latitude: 12.5092, longitude: -70.0086, address: "L.G. Smith Boulevard, Oranjestad, Aruba" },
  { latitude: 12.5150, longitude: -70.0200, address: "Palm Beach, Noord, Aruba" },
  { latitude: 12.5000, longitude: -70.0100, address: "Eagle Beach, Noord, Aruba" },
  { latitude: 12.5180, longitude: -70.0300, address: "Malmok Beach, Noord, Aruba" },
  { latitude: 12.4950, longitude: -69.9800, address: "Manchebo Beach, Oranjestad, Aruba" },
  { latitude: 12.5200, longitude: -70.0400, address: "Arashi Beach, Noord, Aruba" },
  { latitude: 12.4800, longitude: -69.9600, address: "Baby Beach, San Nicolas, Aruba" },
  { latitude: 12.4900, longitude: -69.9700, address: "Rodgers Beach, San Nicolas, Aruba" },
  { latitude: 12.5080, longitude: -70.0050, address: "Renaissance Island, Oranjestad, Aruba" },
  { latitude: 12.5120, longitude: -70.0120, address: "Surfside Beach, Oranjestad, Aruba" },
  { latitude: 12.5170, longitude: -70.0250, address: "Fisherman's Huts Beach, Noord, Aruba" },
  { latitude: 12.4850, longitude: -69.9650, address: "Boca Grandi Beach, San Nicolas, Aruba" },
  { latitude: 12.5220, longitude: -70.0420, address: "Boca Catalina Beach, Noord, Aruba" },
  { latitude: 12.5160, longitude: -70.0280, address: "Hadicurari Beach, Noord, Aruba" },
  { latitude: 12.4920, longitude: -69.9750, address: "Grapefield Beach, San Nicolas, Aruba" },

  // Hotels and Resorts
  { latitude: 12.5160, longitude: -70.0220, address: "Marriott Resort & Stellaris Casino, Palm Beach, Noord, Aruba" },
  { latitude: 12.5140, longitude: -70.0200, address: "Hyatt Regency Aruba Resort, Palm Beach, Noord, Aruba" },
  { latitude: 12.5180, longitude: -70.0240, address: "Hilton Aruba Caribbean Resort, Palm Beach, Noord, Aruba" },
  { latitude: 12.5120, longitude: -70.0180, address: "Holiday Inn Resort Aruba, Palm Beach, Noord, Aruba" },
  { latitude: 12.5000, longitude: -70.0120, address: "Manchebo Beach Resort, Eagle Beach, Noord, Aruba" },
  { latitude: 12.4980, longitude: -70.0110, address: "Casa del Mar Beach Resort, Eagle Beach, Noord, Aruba" },
  { latitude: 12.5020, longitude: -70.0130, address: "Amsterdam Manor Beach Resort, Eagle Beach, Noord, Aruba" },
  { latitude: 12.5080, longitude: -70.0060, address: "Renaissance Aruba Resort & Casino, Oranjestad, Aruba" },
  { latitude: 12.5200, longitude: -70.0380, address: "Ritz-Carlton Aruba, Noord, Aruba" },
  { latitude: 12.5190, longitude: -70.0260, address: "Occidental Grand Aruba, Palm Beach, Noord, Aruba" },
  { latitude: 12.5170, longitude: -70.0230, address: "Barcelo Aruba, Palm Beach, Noord, Aruba" },
  { latitude: 12.5150, longitude: -70.0210, address: "Radisson Blu Aruba, Palm Beach, Noord, Aruba" },

  // Shopping Centers and Malls
  { latitude: 12.5090, longitude: -70.0070, address: "Royal Plaza Mall, Oranjestad, Aruba" },
  { latitude: 12.5110, longitude: -70.0090, address: "Harbour Town, Oranjestad, Aruba" },
  { latitude: 12.5170, longitude: -70.0250, address: "Paseo Herencia, Noord, Aruba" },
  { latitude: 12.5190, longitude: -70.0280, address: "The Village, Noord, Aruba" },
  { latitude: 12.5100, longitude: -70.0080, address: "Main Street, Oranjestad, Aruba" },
  { latitude: 12.5120, longitude: -70.0100, address: "Caya G.F. Betico Croes, Oranjestad, Aruba" },
  { latitude: 12.5080, longitude: -70.0060, address: "Renaissance Marketplace, Oranjestad, Aruba" },
  { latitude: 12.5200, longitude: -70.0300, address: "Palm Beach Plaza, Noord, Aruba" },
  { latitude: 12.5180, longitude: -70.0270, address: "Aruban Mall, Noord, Aruba" },

  // Restaurants and Bars
  { latitude: 12.5100, longitude: -70.0085, address: "Barefoot Restaurant, Eagle Beach, Aruba" },
  { latitude: 12.5160, longitude: -70.0220, address: "Papiamento Restaurant, Noord, Aruba" },
  { latitude: 12.5090, longitude: -70.0075, address: "Gasparito Restaurant, Noord, Aruba" },
  { latitude: 12.5140, longitude: -70.0190, address: "Flying Fishbone, Savaneta, Aruba" },
  { latitude: 12.5120, longitude: -70.0110, address: "Madame Janette, Cunucu Abao, Aruba" },
  { latitude: 12.5080, longitude: -70.0065, address: "Quinta del Carmen, Oranjestad, Aruba" },
  { latitude: 12.5200, longitude: -70.0320, address: "The Old Cunucu House, Noord, Aruba" },
  { latitude: 12.5110, longitude: -70.0095, address: "Yemanja Woodfired Grill, Oranjestad, Aruba" },
  { latitude: 12.5150, longitude: -70.0200, address: "Screaming Eagle Restaurant, Eagle Beach, Aruba" },
  { latitude: 12.5170, longitude: -70.0240, address: "Carte Blanche Restaurant, Noord, Aruba" },

  // Tourist Attractions
  { latitude: 12.5300, longitude: -70.0500, address: "California Lighthouse, Noord, Aruba" },
  { latitude: 12.5070, longitude: -70.0040, address: "Queen Beatrix International Airport, Oranjestad, Aruba" },
  { latitude: 12.5250, longitude: -70.0450, address: "Tierra del Sol Golf Course, Noord, Aruba" },
  { latitude: 12.5000, longitude: -69.9900, address: "Natural Pool (Conchi), Arikok National Park, Aruba" },
  { latitude: 12.5100, longitude: -69.9800, address: "Arikok National Park Visitor Center, San Nicolas, Aruba" },
  { latitude: 12.4950, longitude: -69.9850, address: "Natural Bridge, Andicuri, Aruba" },
  { latitude: 12.5050, longitude: -69.9950, address: "Fontein Cave, Arikok National Park, Aruba" },
  { latitude: 12.5020, longitude: -69.9920, address: "Quadirikiri Cave, Arikok National Park, Aruba" },
  { latitude: 12.4900, longitude: -69.9750, address: "Seroe Colorado Lighthouse, San Nicolas, Aruba" },
  { latitude: 12.5150, longitude: -70.0150, address: "Butterfly Farm, Palm Beach, Noord, Aruba" },
  { latitude: 12.5080, longitude: -70.0055, address: "Fort Zoutman, Oranjestad, Aruba" },
  { latitude: 12.5090, longitude: -70.0065, address: "Archaeological Museum of Aruba, Oranjestad, Aruba" },

  // Government and Public Buildings
  { latitude: 12.5100, longitude: -70.0080, address: "Parliament Building, Oranjestad, Aruba" },
  { latitude: 12.5110, longitude: -70.0090, address: "City Hall, Oranjestad, Aruba" },
  { latitude: 12.5090, longitude: -70.0070, address: "Central Bank of Aruba, Oranjestad, Aruba" },
  { latitude: 12.5120, longitude: -70.0100, address: "Post Office Aruba, Oranjestad, Aruba" },
  { latitude: 12.5080, longitude: -70.0060, address: "Courthouse Aruba, Oranjestad, Aruba" },

  // Medical Facilities
  { latitude: 12.5130, longitude: -70.0110, address: "Dr. Horacio E. Oduber Hospital, Oranjestad, Aruba" },
  { latitude: 12.5100, longitude: -70.0085, address: "Aruba Medical Center, Oranjestad, Aruba" },
  { latitude: 12.5150, longitude: -70.0200, address: "Palm Beach Medical Center, Noord, Aruba" },
  { latitude: 12.4950, longitude: -69.9800, address: "San Nicolas Medical Clinic, San Nicolas, Aruba" },

  // Educational Institutions
  { latitude: 12.5140, longitude: -70.0120, address: "University of Aruba, Oranjestad, Aruba" },
  { latitude: 12.5110, longitude: -70.0095, address: "Colegio Arubano, Oranjestad, Aruba" },
  { latitude: 12.5160, longitude: -70.0210, address: "International School of Aruba, Noord, Aruba" },
  { latitude: 12.5080, longitude: -70.0070, address: "Aruba Institute of Technology, Oranjestad, Aruba" },

  // Residential Areas
  { latitude: 12.5200, longitude: -70.0350, address: "Alto Vista, Noord, Aruba" },
  { latitude: 12.5180, longitude: -70.0320, address: "Bubali, Noord, Aruba" },
  { latitude: 12.5120, longitude: -70.0130, address: "Paradera, Paradera, Aruba" },
  { latitude: 12.5050, longitude: -70.0020, address: "Santa Cruz, Santa Cruz, Aruba" },
  { latitude: 12.4980, longitude: -69.9900, address: "Savaneta, Savaneta, Aruba" },
  { latitude: 12.4920, longitude: -69.9780, address: "San Nicolas Downtown, San Nicolas, Aruba" },
  { latitude: 12.5160, longitude: -70.0180, address: "Tanki Leendert, Noord, Aruba" },
  { latitude: 12.5140, longitude: -70.0160, address: "Piedra Plat, Noord, Aruba" },

  // Business Districts
  { latitude: 12.5100, longitude: -70.0080, address: "Wilhelminastraat, Oranjestad, Aruba" },
  { latitude: 12.5090, longitude: -70.0070, address: "Nassaustraat, Oranjestad, Aruba" },
  { latitude: 12.5110, longitude: -70.0090, address: "Havenstraat, Oranjestad, Aruba" },
  { latitude: 12.5080, longitude: -70.0060, address: "Zoutmanstraat, Oranjestad, Aruba" },

  // Parks and Recreation
  { latitude: 12.5120, longitude: -70.0105, address: "Linear Park, Oranjestad, Aruba" },
  { latitude: 12.5150, longitude: -70.0180, address: "Bubali Bird Sanctuary, Noord, Aruba" },
  { latitude: 12.5200, longitude: -70.0380, address: "Alto Vista Chapel, Noord, Aruba" },
  { latitude: 12.5100, longitude: -70.0085, address: "Wilhelmina Park, Oranjestad, Aruba" },

  // Transportation Hubs
  { latitude: 12.5070, longitude: -70.0040, address: "Queen Beatrix International Airport, Oranjestad, Aruba" },
  { latitude: 12.5090, longitude: -70.0075, address: "Oranjestad Bus Terminal, Oranjestad, Aruba" },
  { latitude: 12.5080, longitude: -70.0055, address: "Cruise Port Aruba, Oranjestad, Aruba" },
  { latitude: 12.5100, longitude: -70.0080, address: "Arubus Central Station, Oranjestad, Aruba" },

  // Casinos and Entertainment
  { latitude: 12.5160, longitude: -70.0220, address: "Stellaris Casino, Palm Beach, Noord, Aruba" },
  { latitude: 12.5080, longitude: -70.0060, address: "Renaissance Casino, Oranjestad, Aruba" },
  { latitude: 12.5140, longitude: -70.0190, address: "Alhambra Casino, Noord, Aruba" },
  { latitude: 12.5200, longitude: -70.0300, address: "Excelsior Casino, Palm Beach, Noord, Aruba" },

  // Gas Stations and Services
  { latitude: 12.5110, longitude: -70.0095, address: "Valero Gas Station, Oranjestad, Aruba" },
  { latitude: 12.5150, longitude: -70.0200, address: "Shell Gas Station, Noord, Aruba" },
  { latitude: 12.5080, longitude: -70.0065, address: "Texaco Gas Station, Oranjestad, Aruba" },
  { latitude: 12.4950, longitude: -69.9800, address: "Esso Gas Station, San Nicolas, Aruba" },

  // Churches and Religious Sites
  { latitude: 12.5200, longitude: -70.0380, address: "Alto Vista Chapel, Noord, Aruba" },
  { latitude: 12.5090, longitude: -70.0075, address: "St. Francis Catholic Church, Oranjestad, Aruba" },
  { latitude: 12.5120, longitude: -70.0100, address: "Protestant Church of Aruba, Oranjestad, Aruba" },
  { latitude: 12.4930, longitude: -69.9780, address: "San Nicolas Catholic Church, San Nicolas, Aruba" },

  // Sports and Fitness
  { latitude: 12.5250, longitude: -70.0450, address: "Tierra del Sol Golf Course, Noord, Aruba" },
  { latitude: 12.5130, longitude: -70.0115, address: "Aruba Golf Club, Oranjestad, Aruba" },
  { latitude: 12.5100, longitude: -70.0085, address: "Guillermo Prospero Trinidad Stadium, Oranjestad, Aruba" },
  { latitude: 12.5160, longitude: -70.0210, address: "Tennis Club Aruba, Noord, Aruba" },

  // Specialty Shops and Markets
  { latitude: 12.5100, longitude: -70.0080, address: "Aruba Aloe Factory, Oranjestad, Aruba" },
  { latitude: 12.5090, longitude: -70.0070, address: "Local Market Oranjestad, Oranjestad, Aruba" },
  { latitude: 12.5110, longitude: -70.0090, address: "Cosecha Aruban Craft Market, Oranjestad, Aruba" },
  { latitude: 12.4940, longitude: -69.9790, address: "San Nicolas Art Walk, San Nicolas, Aruba" },
];

// Mock taxi drivers data
const mockTaxiDrivers: TaxiDriver[] = [
  {
    id: 'driver1',
    name: 'Carlos Rodriguez',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&auto=format&fit=crop&q=60',
    rating: 4.9,
    reviewCount: 1247,
    verified: true,
    vehicleInfo: {
      make: 'Toyota',
      model: 'Camry',
      year: 2022,
      color: 'Silver',
      licensePlate: 'ABC-123',
      type: 'sedan'
    },
    currentLocation: {
      latitude: 12.5092,
      longitude: -70.0086,
      address: 'Oranjestad, Aruba'
    },
    isOnline: true,
    isAvailable: true,
    phoneNumber: '+297-123-4567'
  },
  {
    id: 'driver2',
    name: 'Maria Santos',
    avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=400&auto=format&fit=crop&q=60',
    rating: 4.8,
    reviewCount: 892,
    verified: true,
    vehicleInfo: {
      make: 'Honda',
      model: 'CR-V',
      year: 2021,
      color: 'White',
      licensePlate: 'XYZ-789',
      type: 'suv'
    },
    currentLocation: {
      latitude: 12.5150,
      longitude: -70.0200,
      address: 'Palm Beach, Aruba'
    },
    isOnline: true,
    isAvailable: true,
    phoneNumber: '+297-987-6543'
  },
  {
    id: 'driver3',
    name: 'Juan Perez',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&auto=format&fit=crop&q=60',
    rating: 4.7,
    reviewCount: 654,
    verified: true,
    vehicleInfo: {
      make: 'Mercedes',
      model: 'E-Class',
      year: 2023,
      color: 'Black',
      licensePlate: 'LUX-001',
      type: 'luxury'
    },
    currentLocation: {
      latitude: 12.5000,
      longitude: -70.0100,
      address: 'Eagle Beach, Aruba'
    },
    isOnline: true,
    isAvailable: true,
    phoneNumber: '+297-555-0123'
  }
];

export const useMarketplaceStore = create<MarketplaceState>()(
  persist(
    (set, get) => ({
      categories: mockCategories,
      providers: mockProviders,
      bookings: mockBookings,
      selectedCategory: null,
      selectedSubCategory: null,
      filteredProviders: [],
      recentSearches: [],
      isLoading: false,
      error: null,
      urgentRequests: [],
      currentLocation: null,
      
      // Taxi state
      taxiDrivers: mockTaxiDrivers,
      currentTaxiRide: null,
      taxiRideHistory: [],
      scheduledRides: [],
      nearbyDrivers: [],
      isRequestingRide: false,
      fareEstimate: null,

      fetchCategories: async () => {
        set({ isLoading: true, error: null });
        try {
          // Try to fetch from Supabase first, fallback to mock data
          const { data, error } = await supabase
            .from('categories')
            .select('*')
            .order('name');
          
          if (error) {
            console.warn('Categories table not found, using mock data:', error);
            set({ categories: mockCategories, isLoading: false });
            return;
          }
          
          // Transform Supabase data to match our Category type
          const categories = data || mockCategories;
          set({ categories, isLoading: false });
        } catch (error) {
          console.error("Fetch categories error:", error);
          // Fallback to mock data
          set({ categories: mockCategories, isLoading: false });
        }
      },

      fetchProviders: async (categoryId, subCategoryId) => {
        set({ isLoading: true, error: null });
        try {
          // Try to fetch from Supabase first, fallback to mock data
          let query = supabase
            .from('service_providers')
            .select('*');
          
          if (categoryId) {
            query = query.eq('category_id', categoryId);
          }
          
          const { data, error } = await query.order('rating', { ascending: false });
          
          if (error) {
            console.warn('Service providers table not found, using mock data:', error);
            // Use mock data with filtering
            let filtered = [...mockProviders];
            
            if (subCategoryId) {
              filtered = filtered.filter(provider => 
                provider.services.includes(subCategoryId)
              );
            }
            
            set({ 
              providers: mockProviders,
              filteredProviders: filtered,
              isLoading: false 
            });
            return;
          }
          
          // Transform Supabase data to match our ServiceProvider type
          let providers = data?.map(provider => ({
            id: provider.id,
            name: provider.name,
            description: provider.description,
            rating: provider.rating,
            reviewCount: provider.review_count,
            image: provider.images?.[0] || 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&auto=format&fit=crop&q=60',
            category: provider.category_id,
            services: provider.services || [],
            pricing: provider.pricing || {},
            availability: provider.availability || 'Mon-Fri: 9AM-5PM',
            location: provider.location || 'Aruba',
            verified: provider.verified || false,
            responseTime: '< 1 hour',
            completedJobs: provider.completed_jobs || 0,
            tags: provider.tags || [],
            contact: {
              phone: provider.phone || '+297-000-0000',
              email: provider.email || 'contact@provider.com',
              whatsapp: provider.whatsapp
            }
          })) || mockProviders;
          
          // Filter by subcategory if provided
          let filtered = [...providers];
          if (subCategoryId) {
            filtered = filtered.filter(provider => 
              provider.services.includes(subCategoryId)
            );
          }
          
          set({ 
            providers,
            filteredProviders: filtered,
            isLoading: false 
          });
        } catch (error) {
          console.error("Fetch providers error:", error);
          // Fallback to mock data
          let filtered = [...mockProviders];
          if (subCategoryId) {
            filtered = filtered.filter(provider => 
              provider.services.includes(subCategoryId)
            );
          }
          
          set({ 
            providers: mockProviders,
            filteredProviders: filtered,
            isLoading: false 
          });
        }
      },

      fetchBookings: async () => {
        set({ isLoading: true, error: null });
        try {
          // Get current user
          const { data: { user } } = await supabase.auth.getUser();
          
          if (!user) {
            set({ bookings: [], isLoading: false });
            return;
          }
          
          // Try to fetch from Supabase first, fallback to mock data
          const { data, error } = await supabase
            .from('bookings')
            .select(`
              *,
              service_providers (
                name,
                images
              )
            `)
            .eq('user_id', user.id)
            .order('created_at', { ascending: false });
          
          if (error) {
            console.warn('Bookings table not found, using mock data:', error);
            set({ bookings: mockBookings, isLoading: false });
            return;
          }
          
          // Transform Supabase data to match our Booking type
          const bookings = data?.map(booking => ({
            id: booking.id,
            providerId: booking.provider_id,
            providerName: booking.service_providers?.name || 'Unknown Provider',
            providerImage: booking.service_providers?.images?.[0] || 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&auto=format&fit=crop&q=60',
            service: booking.service_name || 'Service',
            date: booking.date,
            time: booking.time,
            location: booking.location || 'Aruba',
            price: booking.total_amount || 0,
            currency: booking.currency || 'AWG',
            status: booking.status,
            notes: booking.notes,
            createdAt: booking.created_at,
          })) || [];
          
          set({ bookings, isLoading: false });
        } catch (error) {
          console.error("Fetch bookings error:", error);
          // Fallback to mock data
          set({ bookings: mockBookings, isLoading: false });
        }
      },

      selectCategory: (categoryId) => {
        try {
          set({ 
            selectedCategory: categoryId,
            selectedSubCategory: null,
            filteredProviders: []
          });
        } catch (error) {
          console.error("Select category error:", error);
        }
      },

      selectSubCategory: (subCategoryId) => {
        try {
          set({ selectedSubCategory: subCategoryId });
          
          if (subCategoryId) {
            get().fetchProviders(get().selectedCategory ?? undefined, subCategoryId);
          }
        } catch (error) {
          console.error("Select sub-category error:", error);
        }
      },

      createBooking: async (bookingData) => {
        set({ isLoading: true, error: null });
        try {
          // Get current user
          const { data: { user } } = await supabase.auth.getUser();
          
          if (!user) {
            throw new Error('User not authenticated');
          }
          
          // Try to create in Supabase first
          const { data, error } = await supabase
            .from('bookings')
            .insert({
              user_id: user.id,
              provider_id: bookingData.providerId,
              service_name: bookingData.service,
              date: bookingData.date,
              time: bookingData.time,
              location: bookingData.location,
              total_amount: bookingData.price,
              currency: bookingData.currency,
              notes: bookingData.notes,
              status: 'pending',
            })
            .select()
            .single();
          
          if (error) {
            console.warn('Bookings table not found, using mock data:', error);
            // Fallback to mock creation
            const newBooking: Booking = {
              id: 'booking' + Date.now(),
              status: 'pending',
              createdAt: new Date().toISOString(),
              ...bookingData,
            };
            
            set(state => ({ 
              bookings: [newBooking, ...state.bookings],
              isLoading: false 
            }));
            
            return newBooking;
          }
          
          // Transform Supabase data to match our Booking type
          const newBooking: Booking = {
            id: data.id,
            providerId: data.provider_id,
            providerName: bookingData.providerName,
            providerImage: bookingData.providerImage,
            service: data.service_name,
            date: data.date,
            time: data.time,
            location: data.location,
            price: data.total_amount,
            currency: data.currency,
            status: data.status,
            notes: data.notes,
            createdAt: data.created_at,
          };
          
          set(state => ({ 
            bookings: [newBooking, ...state.bookings],
            isLoading: false 
          }));
          
          return newBooking;
        } catch (error) {
          console.error("Create booking error:", error);
          set({ 
            isLoading: false, 
            error: error instanceof Error ? error.message : 'Failed to create booking' 
          });
          throw error;
        }
      },

      cancelBooking: async (bookingId) => {
        set({ isLoading: true, error: null });
        try {
          // Try to update in Supabase first
          const { error } = await supabase
            .from('bookings')
            .update({ status: 'cancelled' })
            .eq('id', bookingId);
          
          if (error) {
            console.warn('Bookings table not found, using mock data:', error);
          }
          
          // Update local state regardless
          set(state => ({
            bookings: state.bookings.map(booking => 
              booking.id === bookingId 
                ? { ...booking, status: 'cancelled' } 
                : booking
            ),
            isLoading: false
          }));
        } catch (error) {
          console.error("Cancel booking error:", error);
          set({ 
            isLoading: false, 
            error: error instanceof Error ? error.message : 'Failed to cancel booking' 
          });
        }
      },

      getProviderAvailability: async (providerId, date) => {
        try {
          // For now, use the existing mock logic
          // In a real app, you would fetch availability from Supabase
          
          const provider = get().providers.find(p => p.id === providerId);
          if (!provider) {
            console.warn(`Provider with id ${providerId} not found`);
            return [];
          }
          
          const dateString = date.toISOString().split('T')[0];
          const existingBookings = get().bookings.filter(
            booking => 
              booking.providerId === providerId && 
              booking.date.startsWith(dateString) &&
              ['pending', 'accepted'].includes(booking.status)
          );
          
          const availabilityRanges = parseAvailabilityString(provider.availability);
          const dayOfWeek = date.toLocaleDateString('en-US', { weekday: 'short' }).toLowerCase();
          
          const workingHours = availabilityRanges.find(range => 
            range.days.includes(dayOfWeek)
          );
          
          if (!workingHours) {
            return [];
          }
          
          const timeSlots: Availability[] = [];
          let currentHour = workingHours.startHour;
          
          while (currentHour < workingHours.endHour) {
            const startTime = new Date(date);
            startTime.setHours(currentHour, 0, 0, 0);
            
            const endTime = new Date(date);
            endTime.setHours(currentHour + 1, 0, 0, 0);
            
            const isBooked = existingBookings.some(booking => {
              const bookingTime = new Date(booking.date);
              return bookingTime.getHours() === currentHour;
            });
            
            timeSlots.push({
              startTime: startTime.toISOString(),
              endTime: endTime.toISOString(),
              available: !isBooked
            });
            
            currentHour++;
          }
          
          return timeSlots;
        } catch (error) {
          console.error('Error getting provider availability:', error);
          return [];
        }
      },

      addRecentSearch: (searchQuery) => {
        try {
          if (!searchQuery.trim()) return;
          
          set(state => {
            const filteredSearches = state.recentSearches.filter(
              search => search.toLowerCase() !== searchQuery.toLowerCase()
            );
            
            return {
              recentSearches: [searchQuery, ...filteredSearches].slice(0, 10)
            };
          });
        } catch (error) {
          console.error("Add recent search error:", error);
        }
      },

      clearRecentSearches: () => {
        try {
          set({ recentSearches: [] });
        } catch (error) {
          console.error("Clear recent searches error:", error);
        }
      },

      applyFilter: (filter) => {
        try {
          let filtered = [...get().filteredProviders];
          if (filtered.length === 0) {
            filtered = [...get().providers];
          }
          
          if (filter === 'rating') {
            filtered.sort((a, b) => (b.rating || 0) - (a.rating || 0));
          } else if (filter === 'name') {
            filtered.sort((a, b) => a.name.localeCompare(b.name));
          }
          
          set({ filteredProviders: filtered });
        } catch (error) {
          console.error("Apply filter error:", error);
        }
      },

      submitUrgentRequest: async (categoryId, details) => {
        set({ isLoading: true, error: null });
        try {
          const requestId = `urgent-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
          
          // In a real app, you would save this to Supabase
          // For now, just update local state
          
          set(state => ({
            urgentRequests: [
              ...state.urgentRequests,
              {
                id: requestId,
                categoryId,
                details,
                timestamp: new Date(),
                status: 'pending'
              }
            ],
            isLoading: false
          }));
          
          return requestId;
        } catch (error) {
          console.error("Submit urgent request error:", error);
          set({ 
            isLoading: false, 
            error: error instanceof Error ? error.message : 'Failed to submit urgent request' 
          });
          throw error;
        }
      },

      getCurrentLocation: async () => {
        try {
          if (Platform.OS === 'web') {
            return new Promise<Location | null>((resolve) => {
              if (!navigator.geolocation) {
                console.log('Geolocation is not supported by this browser');
                resolve(null);
                return;
              }

              navigator.geolocation.getCurrentPosition(
                async (position) => {
                  const { latitude, longitude } = position.coords;
                  try {
                    const address = await get().reverseGeocode(latitude, longitude);
                    const location: Location = {
                      latitude,
                      longitude,
                      address,
                    };
                    set({ currentLocation: location });
                    resolve(location);
                  } catch (error) {
                    console.error('Error reverse geocoding:', error);
                    const location: Location = {
                      latitude,
                      longitude,
                      address: `${latitude.toFixed(6)}, ${longitude.toFixed(6)}`,
                    };
                    set({ currentLocation: location });
                    resolve(location);
                  }
                },
                (error) => {
                  console.error('Error getting location:', error);
                  resolve(null);
                },
                { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000 }
              );
            });
          } else {
            const { status } = await ExpoLocation.requestForegroundPermissionsAsync();
            if (status !== 'granted') {
              console.log('Permission to access location was denied');
              return null;
            }

            const location = await ExpoLocation.getCurrentPositionAsync({
              accuracy: ExpoLocation.Accuracy.High,
            });

            const { latitude, longitude } = location.coords;
            
            try {
              const address = await get().reverseGeocode(latitude, longitude);
              const userLocation: Location = {
                latitude,
                longitude,
                address,
              };
              set({ currentLocation: userLocation });
              return userLocation;
            } catch (error) {
              console.error('Error reverse geocoding:', error);
              const userLocation: Location = {
                latitude,
                longitude,
                address: `${latitude.toFixed(6)}, ${longitude.toFixed(6)}`,
              };
              set({ currentLocation: userLocation });
              return userLocation;
            }
          }
        } catch (error) {
          console.error('Error getting current location:', error);
          return null;
        }
      },

      geocodeAddress: async (address: string) => {
        try {
          if (Platform.OS === 'web') {
            console.log('Geocoding not available on web without API key');
            return null;
          } else {
            const geocoded = await ExpoLocation.geocodeAsync(address);
            if (geocoded.length > 0) {
              const { latitude, longitude } = geocoded[0];
              return {
                latitude,
                longitude,
                address,
              };
            }
            return null;
          }
        } catch (error) {
          console.error('Error geocoding address:', error);
          return null;
        }
      },

      reverseGeocode: async (latitude: number, longitude: number) => {
        try {
          if (Platform.OS === 'web') {
            return `${latitude.toFixed(6)}, ${longitude.toFixed(6)}`;
          } else {
            const reverseGeocoded = await ExpoLocation.reverseGeocodeAsync({
              latitude,
              longitude,
            });
            
            if (reverseGeocoded.length > 0) {
              const location = reverseGeocoded[0];
              const addressParts = [
                location.streetNumber,
                location.street,
                location.city,
                location.region,
                location.country,
              ].filter(Boolean);
              
              return addressParts.join(', ');
            }
            
            return `${latitude.toFixed(6)}, ${longitude.toFixed(6)}`;
          }
        } catch (error) {
          console.error('Error reverse geocoding:', error);
          return `${latitude.toFixed(6)}, ${longitude.toFixed(6)}`;
        }
      },

      getAddressSuggestions: async (query: string) => {
        try {
          await new Promise(resolve => setTimeout(resolve, 200));
          
          const filteredSuggestions = mockAddressSuggestions.filter(suggestion =>
            suggestion.address.toLowerCase().includes(query.toLowerCase())
          );
          
          return filteredSuggestions.slice(0, 8);
        } catch (error) {
          console.error('Error getting address suggestions:', error);
          return [];
        }
      },

      // Taxi-specific actions (using mock data for now)
      requestTaxiRide: async (request: TaxiBookingRequest) => {
        set({ isRequestingRide: true, error: null });
        try {
          // Get current user
          const { data: { user } } = await supabase.auth.getUser();
          
          if (!user) {
            throw new Error('User not authenticated');
          }
          
          const fareEstimate = await get().getFareEstimate(
            request.pickupLocation,
            request.dropoffLocation,
            request.rideType
          );
          
          // Try to create in Supabase first
          const { data, error } = await supabase
            .from('taxi_rides')
            .insert({
              user_id: user.id,
              status: 'requesting',
              pickup_location: request.pickupLocation,
              dropoff_location: request.dropoffLocation,
              estimated_fare: fareEstimate.totalFare,
              currency: fareEstimate.currency,
              estimated_duration: fareEstimate.estimatedDuration,
              estimated_distance: fareEstimate.estimatedDistance,
              ride_type: request.rideType,
              payment_method_id: request.paymentMethodId,
              notes: request.notes,
              requested_at: new Date().toISOString(),
            })
            .select()
            .single();
          
          let newRide: TaxiRide;
          
          if (error) {
            console.warn('Taxi rides table not found, using mock data:', error);
            // Fallback to mock creation
            newRide = {
              id: 'ride' + Date.now(),
              userId: user.id,
              status: 'requesting',
              pickupLocation: request.pickupLocation,
              dropoffLocation: request.dropoffLocation,
              estimatedFare: fareEstimate.totalFare,
              currency: fareEstimate.currency,
              estimatedDuration: fareEstimate.estimatedDuration,
              estimatedDistance: fareEstimate.estimatedDistance,
              requestedAt: new Date().toISOString(),
              rideType: request.rideType,
              paymentMethodId: request.paymentMethodId,
              notes: request.notes,
            };
          } else {
            // Transform Supabase data
            newRide = {
              id: data.id,
              userId: data.user_id,
              driverId: data.driver_id,
              status: data.status,
              pickupLocation: data.pickup_location,
              dropoffLocation: data.dropoff_location,
              estimatedFare: data.estimated_fare,
              actualFare: data.actual_fare,
              currency: data.currency,
              estimatedDuration: data.estimated_duration,
              actualDuration: data.actual_duration,
              estimatedDistance: data.estimated_distance,
              actualDistance: data.actual_distance,
              rideType: data.ride_type,
              paymentMethodId: data.payment_method_id,
              notes: data.notes,
              requestedAt: data.requested_at,
              scheduledFor: data.scheduled_for,
              assignedAt: data.assigned_at,
              pickedUpAt: data.picked_up_at,
              completedAt: data.completed_at,
              cancelledAt: data.cancelled_at,
              cancellationReason: data.cancellation_reason,
            };
          }
          
          set(state => ({
            currentTaxiRide: newRide,
            isRequestingRide: false
          }));
          
          // Simulate driver assignment
          setTimeout(() => {
            const availableDrivers = get().nearbyDrivers.filter(d => d.isAvailable);
            if (availableDrivers.length > 0) {
              const assignedDriver = availableDrivers[0];
              get().acceptRideRequest(assignedDriver.id, newRide.id);
            }
          }, 10000);
          
          return newRide;
        } catch (error) {
          console.error("Request taxi ride error:", error);
          set({ 
            isRequestingRide: false, 
            error: error instanceof Error ? error.message : 'Failed to request taxi ride' 
          });
          throw error;
        }
      },

      requestScheduledTaxiRide: async (request: TaxiBookingRequest) => {
        set({ isRequestingRide: true, error: null });
        try {
          // Get current user
          const { data: { user } } = await supabase.auth.getUser();
          
          if (!user) {
            throw new Error('User not authenticated');
          }
          
          const fareEstimate = await get().getFareEstimate(
            request.pickupLocation,
            request.dropoffLocation,
            request.rideType
          );
          
          // Try to create in Supabase first
          const { data, error } = await supabase
            .from('taxi_rides')
            .insert({
              user_id: user.id,
              status: 'scheduled',
              pickup_location: request.pickupLocation,
              dropoff_location: request.dropoffLocation,
              estimated_fare: fareEstimate.totalFare,
              currency: fareEstimate.currency,
              estimated_duration: fareEstimate.estimatedDuration,
              estimated_distance: fareEstimate.estimatedDistance,
              ride_type: request.rideType,
              payment_method_id: request.paymentMethodId,
              notes: request.notes,
              requested_at: new Date().toISOString(),
              scheduled_for: request.scheduledFor,
            })
            .select()
            .single();
          
          let newRide: TaxiRide;
          
          if (error) {
            console.warn('Taxi rides table not found, using mock data:', error);
            // Fallback to mock creation
            newRide = {
              id: 'scheduled-ride' + Date.now(),
              userId: user.id,
              status: 'scheduled',
              pickupLocation: request.pickupLocation,
              dropoffLocation: request.dropoffLocation,
              estimatedFare: fareEstimate.totalFare,
              currency: fareEstimate.currency,
              estimatedDuration: fareEstimate.estimatedDuration,
              estimatedDistance: fareEstimate.estimatedDistance,
              requestedAt: new Date().toISOString(),
              rideType: request.rideType,
              paymentMethodId: request.paymentMethodId,
              notes: request.notes,
              scheduledFor: request.scheduledFor,
            };
          } else {
            // Transform Supabase data
            newRide = {
              id: data.id,
              userId: data.user_id,
              driverId: data.driver_id,
              status: data.status,
              pickupLocation: data.pickup_location,
              dropoffLocation: data.dropoff_location,
              estimatedFare: data.estimated_fare,
              actualFare: data.actual_fare,
              currency: data.currency,
              estimatedDuration: data.estimated_duration,
              actualDuration: data.actual_duration,
              estimatedDistance: data.estimated_distance,
              actualDistance: data.actual_distance,
              rideType: data.ride_type,
              paymentMethodId: data.payment_method_id,
              notes: data.notes,
              requestedAt: data.requested_at,
              scheduledFor: data.scheduled_for,
              assignedAt: data.assigned_at,
              pickedUpAt: data.picked_up_at,
              completedAt: data.completed_at,
              cancelledAt: data.cancelled_at,
              cancellationReason: data.cancellation_reason,
            };
          }
          
          set(state => ({
            scheduledRides: [...state.scheduledRides, newRide],
            isRequestingRide: false
          }));
          
          return newRide;
        } catch (error) {
          console.error("Request scheduled taxi ride error:", error);
          set({ 
            isRequestingRide: false, 
            error: error instanceof Error ? error.message : 'Failed to schedule taxi ride' 
          });
          throw error;
        }
      },

      cancelTaxiRide: async (rideId: string, reason?: string) => {
        set({ isLoading: true, error: null });
        try {
          // Try to update in Supabase first
          const { error } = await supabase
            .from('taxi_rides')
            .update({ 
              status: 'cancelled',
              cancelled_at: new Date().toISOString(),
              cancellation_reason: reason
            })
            .eq('id', rideId);
          
          if (error) {
            console.warn('Taxi rides table not found, using mock data:', error);
          }
          
          // Update local state regardless
          set(state => {
            const updatedRide = state.currentTaxiRide?.id === rideId
              ? {
                  ...state.currentTaxiRide,
                  status: 'cancelled' as const,
                  cancelledAt: new Date().toISOString(),
                  cancellationReason: reason
                }
              : state.currentTaxiRide;
            
            return {
              currentTaxiRide: updatedRide?.status === 'cancelled' ? null : updatedRide,
              taxiRideHistory: updatedRide?.status === 'cancelled' 
                ? [...state.taxiRideHistory, updatedRide]
                : state.taxiRideHistory,
              isLoading: false
            };
          });
        } catch (error) {
          console.error("Cancel taxi ride error:", error);
          set({ 
            isLoading: false, 
            error: error instanceof Error ? error.message : 'Failed to cancel taxi ride' 
          });
        }
      },

      getFareEstimate: async (pickupLocation: Location, dropoffLocation: Location, rideType: string) => {
        try {
          await new Promise(resolve => setTimeout(resolve, 1000));
          
          const distance = calculateDistance(pickupLocation, dropoffLocation);
          const duration = Math.max(5, distance * 2);
          
          const fareRates = {
            standard: { base: 5, perKm: 2.5, perMin: 0.5 },
            premium: { base: 8, perKm: 3.5, perMin: 0.7 },
            xl: { base: 10, perKm: 4.0, perMin: 0.8 },
            express: { base: 7, perKm: 3.0, perMin: 0.6 }
          };
          
          const rates = fareRates[rideType as keyof typeof fareRates] || fareRates.standard;
          
          const baseFare = rates.base;
          const distanceFare = distance * rates.perKm;
          const timeFare = duration * rates.perMin;
          const totalFare = Math.round((baseFare + distanceFare + timeFare) * 100) / 100;
          
          const estimate: FareEstimate = {
            rideType: rideType as FareEstimate['rideType'],
            baseFare,
            distanceFare,
            timeFare,
            totalFare,
            currency: 'AWG',
            estimatedDuration: Math.round(duration),
            estimatedDistance: Math.round(distance * 100) / 100
          };
          
          set({ fareEstimate: estimate });
          return estimate;
        } catch (error) {
          console.error('Error getting fare estimate:', error);
          throw error;
        }
      },

      findNearbyDrivers: async (location: Location, rideType: string) => {
        try {
          await new Promise(resolve => setTimeout(resolve, 800));
          
          const availableDrivers = get().taxiDrivers.filter(driver => {
            if (!driver.isOnline || !driver.isAvailable) return false;
            
            if (rideType === 'xl' && driver.vehicleInfo.type === 'sedan') return false;
            if (rideType === 'premium' && driver.vehicleInfo.type !== 'luxury' && driver.vehicleInfo.type !== 'sedan') return false;
            
            if (driver.currentLocation) {
              const distance = calculateDistance(location, driver.currentLocation);
              return distance <= 10;
            }
            
            return true;
          });
          
          set({ nearbyDrivers: availableDrivers });
          return availableDrivers;
        } catch (error) {
          console.error('Error finding nearby drivers:', error);
          return [];
        }
      },

      updateDriverLocation: async (driverId: string, location: Location) => {
        try {
          set(state => ({
            taxiDrivers: state.taxiDrivers.map(driver =>
              driver.id === driverId
                ? { ...driver, currentLocation: location }
                : driver
            ),
            currentTaxiRide: state.currentTaxiRide?.driverId === driverId
              ? { ...state.currentTaxiRide, driverLocation: location }
              : state.currentTaxiRide
          }));
        } catch (error) {
          console.error('Error updating driver location:', error);
        }
      },

      acceptRideRequest: async (driverId: string, rideId: string) => {
        try {
          await new Promise(resolve => setTimeout(resolve, 500));
          
          set(state => ({
            currentTaxiRide: state.currentTaxiRide?.id === rideId
              ? {
                  ...state.currentTaxiRide,
                  driverId,
                  status: 'driver_assigned',
                  assignedAt: new Date().toISOString(),
                  driverLocation: state.taxiDrivers.find(d => d.id === driverId)?.currentLocation
                }
              : state.currentTaxiRide,
            taxiDrivers: state.taxiDrivers.map(driver =>
              driver.id === driverId
                ? { ...driver, isAvailable: false }
                : driver
            )
          }));
        } catch (error) {
          console.error('Error accepting ride request:', error);
        }
      },

      updateRideStatus: async (rideId: string, status: TaxiRide['status']) => {
        try {
          await new Promise(resolve => setTimeout(resolve, 500));
          
          set(state => ({
            currentTaxiRide: state.currentTaxiRide?.id === rideId
              ? {
                  ...state.currentTaxiRide,
                  status,
                  ...(status === 'pickup' && { pickedUpAt: new Date().toISOString() })
                }
              : state.currentTaxiRide
          }));
        } catch (error) {
          console.error('Error updating ride status:', error);
        }
      },

      completeRide: async (rideId: string, actualFare: number, actualDistance: number, actualDuration: number) => {
        try {
          await new Promise(resolve => setTimeout(resolve, 1000));
          
          set(state => {
            const completedRide = state.currentTaxiRide?.id === rideId
              ? {
                  ...state.currentTaxiRide,
                  status: 'completed' as const,
                  completedAt: new Date().toISOString(),
                  actualFare,
                  actualDistance,
                  actualDuration
                }
              : null;
            
            return {
              currentTaxiRide: null,
              taxiRideHistory: completedRide 
                ? [...state.taxiRideHistory, completedRide]
                : state.taxiRideHistory,
              taxiDrivers: state.taxiDrivers.map(driver =>
                driver.id === completedRide?.driverId
                  ? { ...driver, isAvailable: true }
                  : driver
              )
            };
          });
        } catch (error) {
          console.error('Error completing ride:', error);
        }
      },

      rateTaxiRide: async (rideId: string, rating: number, comment?: string) => {
        try {
          await new Promise(resolve => setTimeout(resolve, 800));
          console.log(`Rated ride ${rideId}: ${rating} stars`, comment);
        } catch (error) {
          console.error('Error rating taxi ride:', error);
        }
      },

      getScheduledRides: () => {
        return get().scheduledRides;
      },

      cancelScheduledRide: async (rideId: string, reason?: string) => {
        set({ isLoading: true, error: null });
        try {
          await new Promise(resolve => setTimeout(resolve, 1000));
          
          set(state => {
            const cancelledRide = state.scheduledRides.find(ride => ride.id === rideId);
            if (cancelledRide) {
              const updatedRide = {
                ...cancelledRide,
                status: 'cancelled' as const,
                cancelledAt: new Date().toISOString(),
                cancellationReason: reason
              };
              
              return {
                scheduledRides: state.scheduledRides.filter(ride => ride.id !== rideId),
                taxiRideHistory: [...state.taxiRideHistory, updatedRide],
                isLoading: false
              };
            }
            
            return { isLoading: false };
          });
        } catch (error) {
          console.error("Cancel scheduled ride error:", error);
          set({ 
            isLoading: false, 
            error: error instanceof Error ? error.message : 'Failed to cancel scheduled ride' 
          });
        }
      },
    }),
    {
      name: 'marketplace-storage',
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (state) => ({
        recentSearches: state.recentSearches,
        currentLocation: state.currentLocation,
        taxiRideHistory: state.taxiRideHistory,
        scheduledRides: state.scheduledRides,
      }),
      onRehydrateStorage: () => (state, error) => {
        if (error) {
          console.error("Marketplace store rehydration error:", error);
        }
      },
    }
  )
);

// Helper function to parse availability string
function parseAvailabilityString(availabilityStr: string) {
  const result: { days: string[], startHour: number, endHour: number }[] = [];
  
  try {
    const parts = availabilityStr.split(',').map(part => part.trim());
    
    for (const part of parts) {
      const [daysRange, hoursRange] = part.split(':').map(p => p.trim());
      
      let days: string[] = [];
      if (daysRange.includes('-')) {
        const [startDay, endDay] = daysRange.split('-').map(d => d.toLowerCase().substring(0, 3));
        const allDays = ['mon', 'tue', 'wed', 'thu', 'fri', 'sat', 'sun'];
        const startIndex = allDays.indexOf(startDay);
        const endIndex = allDays.indexOf(endDay);
        
        if (startIndex !== -1 && endIndex !== -1) {
          days = allDays.slice(startIndex, endIndex + 1);
        }
      } else if (daysRange.toLowerCase() === 'daily') {
        days = ['mon', 'tue', 'wed', 'thu', 'fri', 'sat', 'sun'];
      } else {
        days = [daysRange.toLowerCase().substring(0, 3)];
      }
      
      const [startTime, endTime] = hoursRange.split('-');
      
      const parseTime = (timeStr: string) => {
        const isPM = timeStr.toUpperCase().includes('PM');
        const hour = parseInt(timeStr.replace(/[^0-9]/g, ''));
        return isPM && hour !== 12 ? hour + 12 : (hour === 12 && !isPM ? 0 : hour);
      };
      
      const startHour = parseTime(startTime);
      const endHour = parseTime(endTime);
      
      result.push({ days, startHour, endHour });
    }
  } catch (error) {
    console.error("Error parsing availability string:", error);
    return [{ days: ['mon', 'tue', 'wed', 'thu', 'fri'], startHour: 9, endHour: 17 }];
  }
  
  return result;
}

// Helper function to calculate distance between two locations
function calculateDistance(loc1: Location, loc2: Location): number {
  const R = 6371;
  const dLat = (loc2.latitude - loc1.latitude) * Math.PI / 180;
  const dLon = (loc2.longitude - loc1.longitude) * Math.PI / 180;
  const a = 
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(loc1.latitude * Math.PI / 180) * Math.cos(loc2.latitude * Math.PI / 180) * 
    Math.sin(dLon/2) * Math.sin(dLon/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  return R * c;
}