import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://mswxfxvqlhfqsmckezci.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1zd3hmeHZxbGhmcXNtY2tlemNpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTA5MDkwOTAsImV4cCI6MjA2NjQ4NTA5MH0.rl70EaTd19eZY0ytEpYiDRVWvpl73XpoDzFgcVF2hZs';

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
});

// Database types (you can generate these from your Supabase schema)
export interface Database {
  public: {
    Tables: {
      users: {
        Row: {
          id: string;
          name: string;
          email: string;
          avatar?: string;
          phone?: string;
          bio?: string;
          address?: string;
          dob?: string;
          is_service_provider?: boolean;
          created_at: string;
          wallet_id?: string;
          saved_providers?: string[];
          payment_methods?: string[];
          language?: string;
          currency?: string;
          is_verified?: boolean;
          last_login_at?: string;
          updated_at?: string;
        };
        Insert: {
          id?: string;
          name: string;
          email: string;
          avatar?: string;
          phone?: string;
          bio?: string;
          address?: string;
          dob?: string;
          is_service_provider?: boolean;
          created_at?: string;
          wallet_id?: string;
          saved_providers?: string[];
          payment_methods?: string[];
          language?: string;
          currency?: string;
          is_verified?: boolean;
          last_login_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          email?: string;
          avatar?: string;
          phone?: string;
          bio?: string;
          address?: string;
          dob?: string;
          is_service_provider?: boolean;
          created_at?: string;
          wallet_id?: string;
          saved_providers?: string[];
          payment_methods?: string[];
          language?: string;
          currency?: string;
          is_verified?: boolean;
          last_login_at?: string;
          updated_at?: string;
        };
      };
      service_providers: {
        Row: {
          id: string;
          user_id: string;
          name: string;
          description: string;
          category_id: string;
          services: string[];
          rating: number;
          review_count: number;
          location: string;
          availability: string;
          pricing: any;
          images: string[];
          verified: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          name: string;
          description: string;
          category_id: string;
          services: string[];
          rating?: number;
          review_count?: number;
          location: string;
          availability: string;
          pricing?: any;
          images?: string[];
          verified?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          name?: string;
          description?: string;
          category_id?: string;
          services?: string[];
          rating?: number;
          review_count?: number;
          location?: string;
          availability?: string;
          pricing?: any;
          images?: string[];
          verified?: boolean;
          created_at?: string;
          updated_at?: string;
        };
      };
      bookings: {
        Row: {
          id: string;
          user_id: string;
          provider_id: string;
          service_id: string;
          date: string;
          time: string;
          status: string;
          total_amount: number;
          currency: string;
          notes?: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          provider_id: string;
          service_id: string;
          date: string;
          time: string;
          status?: string;
          total_amount: number;
          currency: string;
          notes?: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          provider_id?: string;
          service_id?: string;
          date?: string;
          time?: string;
          status?: string;
          total_amount?: number;
          currency?: string;
          notes?: string;
          created_at?: string;
          updated_at?: string;
        };
      };
      transactions: {
        Row: {
          id: string;
          user_id: string;
          type: string;
          amount: number;
          currency: string;
          description: string;
          date: string;
          status: string;
          recipient_id?: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          type: string;
          amount: number;
          currency: string;
          description: string;
          date: string;
          status?: string;
          recipient_id?: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          type?: string;
          amount?: number;
          currency?: string;
          description?: string;
          date?: string;
          status?: string;
          recipient_id?: string;
          created_at?: string;
        };
      };
      taxi_rides: {
        Row: {
          id: string;
          user_id: string;
          driver_id?: string;
          status: string;
          pickup_location: any;
          dropoff_location: any;
          estimated_fare: number;
          actual_fare?: number;
          currency: string;
          estimated_duration: number;
          actual_duration?: number;
          estimated_distance: number;
          actual_distance?: number;
          ride_type: string;
          payment_method_id?: string;
          notes?: string;
          requested_at: string;
          scheduled_for?: string;
          assigned_at?: string;
          picked_up_at?: string;
          completed_at?: string;
          cancelled_at?: string;
          cancellation_reason?: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          driver_id?: string;
          status?: string;
          pickup_location: any;
          dropoff_location: any;
          estimated_fare: number;
          actual_fare?: number;
          currency: string;
          estimated_duration: number;
          actual_duration?: number;
          estimated_distance: number;
          actual_distance?: number;
          ride_type: string;
          payment_method_id?: string;
          notes?: string;
          requested_at: string;
          scheduled_for?: string;
          assigned_at?: string;
          picked_up_at?: string;
          completed_at?: string;
          cancelled_at?: string;
          cancellation_reason?: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          driver_id?: string;
          status?: string;
          pickup_location?: any;
          dropoff_location?: any;
          estimated_fare?: number;
          actual_fare?: number;
          currency?: string;
          estimated_duration?: number;
          actual_duration?: number;
          estimated_distance?: number;
          actual_distance?: number;
          ride_type?: string;
          payment_method_id?: string;
          notes?: string;
          requested_at?: string;
          scheduled_for?: string;
          assigned_at?: string;
          picked_up_at?: string;
          completed_at?: string;
          cancelled_at?: string;
          cancellation_reason?: string;
          created_at?: string;
        };
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      [_ in never]: never;
    };
    Enums: {
      [_ in never]: never;
    };
  };
}