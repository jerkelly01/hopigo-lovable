export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
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
        Relationships: [
          {
            foreignKeyName: "activities_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
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
        Relationships: [
          {
            foreignKeyName: "bills_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
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
        Relationships: [
          {
            foreignKeyName: "donations_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
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
          {
            foreignKeyName: "event_tickets_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
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
        Relationships: [
          {
            foreignKeyName: "fuel_payments_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
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
        Relationships: [
          {
            foreignKeyName: "loyalty_transactions_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
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
        Relationships: [
          {
            foreignKeyName: "money_transfers_receiver_id_fkey"
            columns: ["receiver_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "money_transfers_sender_id_fkey"
            columns: ["sender_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
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
        Relationships: [
          {
            foreignKeyName: "notifications_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
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
        Relationships: [
          {
            foreignKeyName: "payments_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      ride_bookings: {
        Row: {
          created_at: string | null
          customer_id: string
          destination: string
          distance_km: number | null
          driver_id: string
          fare_amount: number
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
          fare_amount: number
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
          fare_amount?: number
          id?: string
          pickup_location?: string
          ride_type?: string | null
          status?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "ride_bookings_customer_id_fkey"
            columns: ["customer_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
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
          total_earnings: number | null
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
          total_earnings?: number | null
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
          total_earnings?: number | null
          total_rides?: number | null
          updated_at?: string | null
          user_id?: string
          vehicle_model?: string
          vehicle_type?: string
        }
        Relationships: [
          {
            foreignKeyName: "ride_drivers_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
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
            foreignKeyName: "service_bookings_customer_id_fkey"
            columns: ["customer_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
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
        Relationships: [
          {
            foreignKeyName: "service_providers_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
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
        Relationships: [
          {
            foreignKeyName: "split_bills_creator_id_fkey"
            columns: ["creator_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
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
          avatar_url: string | null
          created_at: string | null
          email: string
          full_name: string | null
          id: string
          is_active: boolean | null
          last_login: string | null
          loyalty_points: number | null
          phone_number: string | null
          updated_at: string | null
          user_type: string | null
          verification_status: string | null
          wallet_balance: number | null
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string | null
          email: string
          full_name?: string | null
          id?: string
          is_active?: boolean | null
          last_login?: string | null
          loyalty_points?: number | null
          phone_number?: string | null
          updated_at?: string | null
          user_type?: string | null
          verification_status?: string | null
          wallet_balance?: number | null
        }
        Update: {
          avatar_url?: string | null
          created_at?: string | null
          email?: string
          full_name?: string | null
          id?: string
          is_active?: boolean | null
          last_login?: string | null
          loyalty_points?: number | null
          phone_number?: string | null
          updated_at?: string | null
          user_type?: string | null
          verification_status?: string | null
          wallet_balance?: number | null
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      assign_role: {
        Args: { user_id: string; role_name: string }
        Returns: undefined
      }
      has_role: {
        Args: { role_name: string }
        Returns: boolean
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

type DefaultSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
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
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
