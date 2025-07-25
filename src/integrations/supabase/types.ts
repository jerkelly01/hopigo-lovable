export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instanciate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "12.2.3 (519615d)"
  }
  public: {
    Tables: {
      activities: {
        Row: {
          created_at: string | null
          description: string | null
          id: string
          metadata: Json | null
          title: string
          type: string
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          id?: string
          metadata?: Json | null
          title: string
          type: string
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          description?: string | null
          id?: string
          metadata?: Json | null
          title?: string
          type?: string
          user_id?: string | null
        }
        Relationships: []
      }
      advertisements: {
        Row: {
          click_count: number | null
          created_at: string | null
          description: string | null
          end_date: string
          id: string
          image_url: string | null
          is_active: boolean | null
          start_date: string
          target_audience: string | null
          title: string
        }
        Insert: {
          click_count?: number | null
          created_at?: string | null
          description?: string | null
          end_date: string
          id?: string
          image_url?: string | null
          is_active?: boolean | null
          start_date: string
          target_audience?: string | null
          title: string
        }
        Update: {
          click_count?: number | null
          created_at?: string | null
          description?: string | null
          end_date?: string
          id?: string
          image_url?: string | null
          is_active?: boolean | null
          start_date?: string
          target_audience?: string | null
          title?: string
        }
        Relationships: []
      }
      audit_logs: {
        Row: {
          action: string
          created_at: string | null
          id: string
          ip_address: unknown | null
          new_values: Json | null
          old_values: Json | null
          record_id: string | null
          table_name: string | null
          user_agent: string | null
          user_id: string | null
        }
        Insert: {
          action: string
          created_at?: string | null
          id?: string
          ip_address?: unknown | null
          new_values?: Json | null
          old_values?: Json | null
          record_id?: string | null
          table_name?: string | null
          user_agent?: string | null
          user_id?: string | null
        }
        Update: {
          action?: string
          created_at?: string | null
          id?: string
          ip_address?: unknown | null
          new_values?: Json | null
          old_values?: Json | null
          record_id?: string | null
          table_name?: string | null
          user_agent?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      bills: {
        Row: {
          amount: number
          bill_type: string
          created_at: string | null
          due_date: string
          id: string
          payment_date: string | null
          provider_name: string
          status: string | null
          user_id: string
        }
        Insert: {
          amount: number
          bill_type: string
          created_at?: string | null
          due_date: string
          id?: string
          payment_date?: string | null
          provider_name: string
          status?: string | null
          user_id: string
        }
        Update: {
          amount?: number
          bill_type?: string
          created_at?: string | null
          due_date?: string
          id?: string
          payment_date?: string | null
          provider_name?: string
          status?: string | null
          user_id?: string
        }
        Relationships: []
      }
      chat_conversations: {
        Row: {
          agent_id: string | null
          created_at: string
          customer_id: string
          id: string
          last_message_at: string | null
          status: string
          updated_at: string
        }
        Insert: {
          agent_id?: string | null
          created_at?: string
          customer_id: string
          id?: string
          last_message_at?: string | null
          status?: string
          updated_at?: string
        }
        Update: {
          agent_id?: string | null
          created_at?: string
          customer_id?: string
          id?: string
          last_message_at?: string | null
          status?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "chat_conversations_agent_id_fkey"
            columns: ["agent_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "chat_conversations_customer_id_fkey"
            columns: ["customer_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      chat_messages: {
        Row: {
          conversation_id: string
          created_at: string
          id: string
          message: string
          message_type: string
          sender_id: string
        }
        Insert: {
          conversation_id: string
          created_at?: string
          id?: string
          message: string
          message_type?: string
          sender_id: string
        }
        Update: {
          conversation_id?: string
          created_at?: string
          id?: string
          message?: string
          message_type?: string
          sender_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "chat_messages_conversation_id_fkey"
            columns: ["conversation_id"]
            isOneToOne: false
            referencedRelation: "chat_conversations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "chat_messages_sender_id_fkey"
            columns: ["sender_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      dashboard_connections: {
        Row: {
          api_key: string
          app_id: string
          app_name: string
          created_at: string
          id: string
          is_active: boolean | null
          last_sync: string | null
          sync_status: string | null
          updated_at: string
          webhook_url: string | null
        }
        Insert: {
          api_key: string
          app_id: string
          app_name: string
          created_at?: string
          id?: string
          is_active?: boolean | null
          last_sync?: string | null
          sync_status?: string | null
          updated_at?: string
          webhook_url?: string | null
        }
        Update: {
          api_key?: string
          app_id?: string
          app_name?: string
          created_at?: string
          id?: string
          is_active?: boolean | null
          last_sync?: string | null
          sync_status?: string | null
          updated_at?: string
          webhook_url?: string | null
        }
        Relationships: []
      }
      dashboard_events: {
        Row: {
          app_id: string
          created_at: string
          event_data: Json | null
          event_type: string
          id: string
          processed: boolean | null
          timestamp: string
          user_id: string | null
        }
        Insert: {
          app_id: string
          created_at?: string
          event_data?: Json | null
          event_type: string
          id?: string
          processed?: boolean | null
          timestamp?: string
          user_id?: string | null
        }
        Update: {
          app_id?: string
          created_at?: string
          event_data?: Json | null
          event_type?: string
          id?: string
          processed?: boolean | null
          timestamp?: string
          user_id?: string | null
        }
        Relationships: []
      }
      donations: {
        Row: {
          amount: number
          charity_name: string
          created_at: string | null
          id: string
          is_anonymous: boolean | null
          message: string | null
          user_id: string
        }
        Insert: {
          amount: number
          charity_name: string
          created_at?: string | null
          id?: string
          is_anonymous?: boolean | null
          message?: string | null
          user_id: string
        }
        Update: {
          amount?: number
          charity_name?: string
          created_at?: string | null
          id?: string
          is_anonymous?: boolean | null
          message?: string | null
          user_id?: string
        }
        Relationships: []
      }
      event_tickets: {
        Row: {
          event_id: string
          id: string
          purchase_date: string | null
          quantity: number
          total_amount: number
          user_id: string
        }
        Insert: {
          event_id: string
          id?: string
          purchase_date?: string | null
          quantity: number
          total_amount: number
          user_id: string
        }
        Update: {
          event_id?: string
          id?: string
          purchase_date?: string | null
          quantity?: number
          total_amount?: number
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "event_tickets_event_id_fkey"
            columns: ["event_id"]
            isOneToOne: false
            referencedRelation: "events"
            referencedColumns: ["id"]
          },
        ]
      }
      events: {
        Row: {
          available_tickets: number
          category: string
          created_at: string | null
          description: string | null
          event_date: string
          id: string
          is_active: boolean | null
          ticket_price: number
          title: string
          total_tickets: number
          venue: string
        }
        Insert: {
          available_tickets: number
          category: string
          created_at?: string | null
          description?: string | null
          event_date: string
          id?: string
          is_active?: boolean | null
          ticket_price: number
          title: string
          total_tickets: number
          venue: string
        }
        Update: {
          available_tickets?: number
          category?: string
          created_at?: string | null
          description?: string | null
          event_date?: string
          id?: string
          is_active?: boolean | null
          ticket_price?: number
          title?: string
          total_tickets?: number
          venue?: string
        }
        Relationships: []
      }
      fuel_payments: {
        Row: {
          amount: number
          created_at: string | null
          fuel_type: string
          id: string
          liters: number | null
          station_location: string
          station_name: string
          user_id: string
        }
        Insert: {
          amount: number
          created_at?: string | null
          fuel_type: string
          id?: string
          liters?: number | null
          station_location: string
          station_name: string
          user_id: string
        }
        Update: {
          amount?: number
          created_at?: string | null
          fuel_type?: string
          id?: string
          liters?: number | null
          station_location?: string
          station_name?: string
          user_id?: string
        }
        Relationships: []
      }
      locations: {
        Row: {
          address: string
          coverage_radius: number | null
          created_at: string
          id: string
          is_active: boolean
          latitude: number | null
          location_type: string
          longitude: number | null
          name: string
          notes: string | null
          service_categories: string[] | null
          updated_at: string
        }
        Insert: {
          address: string
          coverage_radius?: number | null
          created_at?: string
          id?: string
          is_active?: boolean
          latitude?: number | null
          location_type?: string
          longitude?: number | null
          name: string
          notes?: string | null
          service_categories?: string[] | null
          updated_at?: string
        }
        Update: {
          address?: string
          coverage_radius?: number | null
          created_at?: string
          id?: string
          is_active?: boolean
          latitude?: number | null
          location_type?: string
          longitude?: number | null
          name?: string
          notes?: string | null
          service_categories?: string[] | null
          updated_at?: string
        }
        Relationships: []
      }
      loyalty_programs: {
        Row: {
          created_at: string | null
          description: string | null
          id: string
          is_active: boolean | null
          name: string
          points_required: number
          reward_type: string
          reward_value: number
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          id?: string
          is_active?: boolean | null
          name: string
          points_required: number
          reward_type: string
          reward_value: number
        }
        Update: {
          created_at?: string | null
          description?: string | null
          id?: string
          is_active?: boolean | null
          name?: string
          points_required?: number
          reward_type?: string
          reward_value?: number
        }
        Relationships: []
      }
      loyalty_transactions: {
        Row: {
          created_at: string | null
          description: string | null
          id: string
          points: number
          transaction_type: string
          user_id: string
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          id?: string
          points: number
          transaction_type: string
          user_id: string
        }
        Update: {
          created_at?: string | null
          description?: string | null
          id?: string
          points?: number
          transaction_type?: string
          user_id?: string
        }
        Relationships: []
      }
      money_transfers: {
        Row: {
          amount: number
          created_at: string | null
          id: string
          message: string | null
          receiver_id: string
          sender_id: string
          status: string | null
        }
        Insert: {
          amount: number
          created_at?: string | null
          id?: string
          message?: string | null
          receiver_id: string
          sender_id: string
          status?: string | null
        }
        Update: {
          amount?: number
          created_at?: string | null
          id?: string
          message?: string | null
          receiver_id?: string
          sender_id?: string
          status?: string | null
        }
        Relationships: []
      }
      notifications: {
        Row: {
          created_at: string | null
          id: string
          is_read: boolean | null
          message: string
          title: string
          type: string
          user_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          is_read?: boolean | null
          message: string
          title: string
          type: string
          user_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          is_read?: boolean | null
          message?: string
          title?: string
          type?: string
          user_id?: string
        }
        Relationships: []
      }
      payments: {
        Row: {
          amount: number
          created_at: string | null
          id: string
          payment_method: string
          reference_id: string | null
          reference_type: string | null
          status: string | null
          type: string
          user_id: string
        }
        Insert: {
          amount: number
          created_at?: string | null
          id?: string
          payment_method: string
          reference_id?: string | null
          reference_type?: string | null
          status?: string | null
          type: string
          user_id: string
        }
        Update: {
          amount?: number
          created_at?: string | null
          id?: string
          payment_method?: string
          reference_id?: string | null
          reference_type?: string | null
          status?: string | null
          type?: string
          user_id?: string
        }
        Relationships: []
      }
      ride_bookings: {
        Row: {
          created_at: string | null
          customer_id: string
          destination: string
          distance_km: number | null
          driver_id: string
          id: string
          pickup_location: string
          ride_type: string | null
          status: string | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          customer_id: string
          destination: string
          distance_km?: number | null
          driver_id: string
          id?: string
          pickup_location: string
          ride_type?: string | null
          status?: string | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          customer_id?: string
          destination?: string
          distance_km?: number | null
          driver_id?: string
          id?: string
          pickup_location?: string
          ride_type?: string | null
          status?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "ride_bookings_driver_id_fkey"
            columns: ["driver_id"]
            isOneToOne: false
            referencedRelation: "ride_drivers"
            referencedColumns: ["id"]
          },
        ]
      }
      ride_drivers: {
        Row: {
          created_at: string | null
          id: string
          is_active: boolean | null
          is_online: boolean | null
          is_verified: boolean | null
          license_plate: string
          rating: number | null
          total_rides: number | null
          updated_at: string | null
          user_id: string
          vehicle_model: string
          vehicle_type: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          is_active?: boolean | null
          is_online?: boolean | null
          is_verified?: boolean | null
          license_plate: string
          rating?: number | null
          total_rides?: number | null
          updated_at?: string | null
          user_id: string
          vehicle_model: string
          vehicle_type: string
        }
        Update: {
          created_at?: string | null
          id?: string
          is_active?: boolean | null
          is_online?: boolean | null
          is_verified?: boolean | null
          license_plate?: string
          rating?: number | null
          total_rides?: number | null
          updated_at?: string | null
          user_id?: string
          vehicle_model?: string
          vehicle_type?: string
        }
        Relationships: []
      }
      roles: {
        Row: {
          created_at: string | null
          description: string | null
          id: string
          name: string
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          id?: string
          name: string
        }
        Update: {
          created_at?: string | null
          description?: string | null
          id?: string
          name?: string
        }
        Relationships: []
      }
      service_bookings: {
        Row: {
          booking_date: string
          created_at: string | null
          customer_id: string
          id: string
          provider_id: string
          service_id: string
          status: string | null
          total_amount: number
          updated_at: string | null
        }
        Insert: {
          booking_date: string
          created_at?: string | null
          customer_id: string
          id?: string
          provider_id: string
          service_id: string
          status?: string | null
          total_amount: number
          updated_at?: string | null
        }
        Update: {
          booking_date?: string
          created_at?: string | null
          customer_id?: string
          id?: string
          provider_id?: string
          service_id?: string
          status?: string | null
          total_amount?: number
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "service_bookings_provider_id_fkey"
            columns: ["provider_id"]
            isOneToOne: false
            referencedRelation: "service_providers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "service_bookings_service_id_fkey"
            columns: ["service_id"]
            isOneToOne: false
            referencedRelation: "services"
            referencedColumns: ["id"]
          },
        ]
      }
      service_categories: {
        Row: {
          created_at: string | null
          description: string | null
          icon_name: string | null
          id: string
          is_active: boolean | null
          name: string
          sort_order: number | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          icon_name?: string | null
          id?: string
          is_active?: boolean | null
          name: string
          sort_order?: number | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          description?: string | null
          icon_name?: string | null
          id?: string
          is_active?: boolean | null
          name?: string
          sort_order?: number | null
          updated_at?: string | null
        }
        Relationships: []
      }
      service_providers: {
        Row: {
          business_name: string | null
          category: string
          created_at: string | null
          description: string | null
          id: string
          is_active: boolean | null
          is_verified: boolean | null
          rating: number | null
          total_bookings: number | null
          total_earnings: number | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          business_name?: string | null
          category: string
          created_at?: string | null
          description?: string | null
          id?: string
          is_active?: boolean | null
          is_verified?: boolean | null
          rating?: number | null
          total_bookings?: number | null
          total_earnings?: number | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          business_name?: string | null
          category?: string
          created_at?: string | null
          description?: string | null
          id?: string
          is_active?: boolean | null
          is_verified?: boolean | null
          rating?: number | null
          total_bookings?: number | null
          total_earnings?: number | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      service_zones: {
        Row: {
          boundary_coordinates: Json
          created_at: string
          description: string | null
          id: string
          is_active: boolean
          name: string
          priority: number | null
          updated_at: string
          zone_type: string
        }
        Insert: {
          boundary_coordinates: Json
          created_at?: string
          description?: string | null
          id?: string
          is_active?: boolean
          name: string
          priority?: number | null
          updated_at?: string
          zone_type?: string
        }
        Update: {
          boundary_coordinates?: Json
          created_at?: string
          description?: string | null
          id?: string
          is_active?: boolean
          name?: string
          priority?: number | null
          updated_at?: string
          zone_type?: string
        }
        Relationships: []
      }
      services: {
        Row: {
          category: string
          created_at: string | null
          description: string | null
          duration_minutes: number | null
          id: string
          is_active: boolean | null
          price: number
          provider_id: string
          title: string
          updated_at: string | null
        }
        Insert: {
          category: string
          created_at?: string | null
          description?: string | null
          duration_minutes?: number | null
          id?: string
          is_active?: boolean | null
          price: number
          provider_id: string
          title: string
          updated_at?: string | null
        }
        Update: {
          category?: string
          created_at?: string | null
          description?: string | null
          duration_minutes?: number | null
          id?: string
          is_active?: boolean | null
          price?: number
          provider_id?: string
          title?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "services_provider_id_fkey"
            columns: ["provider_id"]
            isOneToOne: false
            referencedRelation: "service_providers"
            referencedColumns: ["id"]
          },
        ]
      }
      split_bills: {
        Row: {
          created_at: string | null
          creator_id: string
          id: string
          participants: Json
          status: string | null
          title: string
          total_amount: number
        }
        Insert: {
          created_at?: string | null
          creator_id: string
          id?: string
          participants: Json
          status?: string | null
          title: string
          total_amount: number
        }
        Update: {
          created_at?: string | null
          creator_id?: string
          id?: string
          participants?: Json
          status?: string | null
          title?: string
          total_amount?: number
        }
        Relationships: []
      }
      User: {
        Row: {
          email: string | null
          id: number
          name: string
          role: string | null
        }
        Insert: {
          email?: string | null
          id?: number
          name: string
          role?: string | null
        }
        Update: {
          email?: string | null
          id?: number
          name?: string
          role?: string | null
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          created_at: string | null
          id: string
          role_id: string
          user_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          role_id: string
          user_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          role_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_roles_role_id_fkey"
            columns: ["role_id"]
            isOneToOne: false
            referencedRelation: "roles"
            referencedColumns: ["id"]
          },
        ]
      }
      users: {
        Row: {
          address: string | null
          avatar_url: string | null
          bio: string | null
          created_at: string | null
          currency: string | null
          dob: string | null
          email: string
          full_name: string | null
          id: string
          is_active: boolean | null
          is_service_provider: boolean | null
          is_verified: boolean | null
          language: string | null
          last_login: string | null
          last_login_at: string | null
          loyalty_points: number | null
          name: string | null
          payment_methods: string[] | null
          phone_number: string | null
          saved_providers: string[] | null
          updated_at: string | null
          user_type: string | null
          verification_status: string | null
          wallet_balance: number | null
          wallet_id: string | null
        }
        Insert: {
          address?: string | null
          avatar_url?: string | null
          bio?: string | null
          created_at?: string | null
          currency?: string | null
          dob?: string | null
          email: string
          full_name?: string | null
          id?: string
          is_active?: boolean | null
          is_service_provider?: boolean | null
          is_verified?: boolean | null
          language?: string | null
          last_login?: string | null
          last_login_at?: string | null
          loyalty_points?: number | null
          name?: string | null
          payment_methods?: string[] | null
          phone_number?: string | null
          saved_providers?: string[] | null
          updated_at?: string | null
          user_type?: string | null
          verification_status?: string | null
          wallet_balance?: number | null
          wallet_id?: string | null
        }
        Update: {
          address?: string | null
          avatar_url?: string | null
          bio?: string | null
          created_at?: string | null
          currency?: string | null
          dob?: string | null
          email?: string
          full_name?: string | null
          id?: string
          is_active?: boolean | null
          is_service_provider?: boolean | null
          is_verified?: boolean | null
          language?: string | null
          last_login?: string | null
          last_login_at?: string | null
          loyalty_points?: number | null
          name?: string | null
          payment_methods?: string[] | null
          phone_number?: string | null
          saved_providers?: string[] | null
          updated_at?: string | null
          user_type?: string | null
          verification_status?: string | null
          wallet_balance?: number | null
          wallet_id?: string | null
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      assign_admin_by_email: {
        Args: { target_email: string }
        Returns: undefined
      }
      assign_role: {
        Args: { user_id: string; role_name: string }
        Returns: undefined
      }
      get_user_roles: {
        Args: { target_user_id?: string }
        Returns: {
          role_name: string
          role_description: string
        }[]
      }
      has_role: {
        Args: { role_name: string }
        Returns: boolean
      }
      is_admin: {
        Args: Record<PropertyKey, never>
        Returns: boolean
      }
      safe_assign_role: {
        Args: { target_user_id: string; role_name: string }
        Returns: undefined
      }
      safe_update_user: {
        Args: {
          target_user_id: string
          full_name_param?: string
          name_param?: string
          is_verified_param?: boolean
          is_active_param?: boolean
          user_type_param?: string
        }
        Returns: undefined
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
