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
      ai_chatbot_conversations: {
        Row: {
          confidence: number | null
          created_at: string | null
          id: string
          intent: string | null
          message: string
          response: string
          session_id: string
          user_id: string | null
        }
        Insert: {
          confidence?: number | null
          created_at?: string | null
          id?: string
          intent?: string | null
          message: string
          response: string
          session_id: string
          user_id?: string | null
        }
        Update: {
          confidence?: number | null
          created_at?: string | null
          id?: string
          intent?: string | null
          message?: string
          response?: string
          session_id?: string
          user_id?: string | null
        }
        Relationships: []
      }
      ai_models: {
        Row: {
          accuracy_score: number | null
          created_at: string | null
          description: string | null
          id: string
          is_active: boolean | null
          last_trained_at: string | null
          model_data: Json | null
          model_type: string
          name: string
          parameters: Json | null
          updated_at: string | null
          version: string
        }
        Insert: {
          accuracy_score?: number | null
          created_at?: string | null
          description?: string | null
          id?: string
          is_active?: boolean | null
          last_trained_at?: string | null
          model_data?: Json | null
          model_type: string
          name: string
          parameters?: Json | null
          updated_at?: string | null
          version: string
        }
        Update: {
          accuracy_score?: number | null
          created_at?: string | null
          description?: string | null
          id?: string
          is_active?: boolean | null
          last_trained_at?: string | null
          model_data?: Json | null
          model_type?: string
          name?: string
          parameters?: Json | null
          updated_at?: string | null
          version?: string
        }
        Relationships: []
      }
      ai_performance_metrics: {
        Row: {
          created_at: string | null
          dataset_size: number | null
          evaluation_date: string | null
          id: string
          metric_type: string
          metric_value: number
          model_id: string | null
          training_duration: number | null
        }
        Insert: {
          created_at?: string | null
          dataset_size?: number | null
          evaluation_date?: string | null
          id?: string
          metric_type: string
          metric_value: number
          model_id?: string | null
          training_duration?: number | null
        }
        Update: {
          created_at?: string | null
          dataset_size?: number | null
          evaluation_date?: string | null
          id?: string
          metric_type?: string
          metric_value?: number
          model_id?: string | null
          training_duration?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "ai_performance_metrics_model_id_fkey"
            columns: ["model_id"]
            isOneToOne: false
            referencedRelation: "ai_models"
            referencedColumns: ["id"]
          },
        ]
      }
      ai_predictions: {
        Row: {
          confidence_score: number | null
          created_at: string | null
          feedback: Json | null
          id: string
          input_data: Json
          is_correct: boolean | null
          model_id: string | null
          output_data: Json
          prediction_type: string
          user_id: string | null
        }
        Insert: {
          confidence_score?: number | null
          created_at?: string | null
          feedback?: Json | null
          id?: string
          input_data: Json
          is_correct?: boolean | null
          model_id?: string | null
          output_data: Json
          prediction_type: string
          user_id?: string | null
        }
        Update: {
          confidence_score?: number | null
          created_at?: string | null
          feedback?: Json | null
          id?: string
          input_data?: Json
          is_correct?: boolean | null
          model_id?: string | null
          output_data?: Json
          prediction_type?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "ai_predictions_model_id_fkey"
            columns: ["model_id"]
            isOneToOne: false
            referencedRelation: "ai_models"
            referencedColumns: ["id"]
          },
        ]
      }
      ai_recommendations: {
        Row: {
          confidence_score: number | null
          context: Json | null
          created_at: string | null
          id: string
          is_clicked: boolean | null
          provider_id: string | null
          recommendation_type: string
          user_id: string | null
        }
        Insert: {
          confidence_score?: number | null
          context?: Json | null
          created_at?: string | null
          id?: string
          is_clicked?: boolean | null
          provider_id?: string | null
          recommendation_type: string
          user_id?: string | null
        }
        Update: {
          confidence_score?: number | null
          context?: Json | null
          created_at?: string | null
          id?: string
          is_clicked?: boolean | null
          provider_id?: string | null
          recommendation_type?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "ai_recommendations_provider_id_fkey"
            columns: ["provider_id"]
            isOneToOne: false
            referencedRelation: "service_providers"
            referencedColumns: ["id"]
          },
        ]
      }
      analytics_events: {
        Row: {
          created_at: string
          event_data: Json
          event_type: string
          id: string
          location: Json | null
          provider_id: string | null
          session_id: string
          timestamp: string
          updated_at: string
          user_agent: string | null
          user_id: string | null
        }
        Insert: {
          created_at?: string
          event_data?: Json
          event_type: string
          id?: string
          location?: Json | null
          provider_id?: string | null
          session_id: string
          timestamp?: string
          updated_at?: string
          user_agent?: string | null
          user_id?: string | null
        }
        Update: {
          created_at?: string
          event_data?: Json
          event_type?: string
          id?: string
          location?: Json | null
          provider_id?: string | null
          session_id?: string
          timestamp?: string
          updated_at?: string
          user_agent?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "analytics_events_provider_id_fkey"
            columns: ["provider_id"]
            isOneToOne: false
            referencedRelation: "service_providers"
            referencedColumns: ["id"]
          },
        ]
      }
      analytics_metrics: {
        Row: {
          created_at: string
          end_date: string
          generated_at: string
          id: string
          insights: Json
          metrics: Json
          period: string
          start_date: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          end_date: string
          generated_at?: string
          id?: string
          insights?: Json
          metrics?: Json
          period: string
          start_date: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          end_date?: string
          generated_at?: string
          id?: string
          insights?: Json
          metrics?: Json
          period?: string
          start_date?: string
          updated_at?: string
        }
        Relationships: []
      }
      analytics_reports: {
        Row: {
          created_at: string
          generated_at: string
          generated_by: string | null
          id: string
          period_end: string
          period_start: string
          report_data: Json
          report_type: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          generated_at?: string
          generated_by?: string | null
          id?: string
          period_end: string
          period_start: string
          report_data?: Json
          report_type: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          generated_at?: string
          generated_by?: string | null
          id?: string
          period_end?: string
          period_start?: string
          report_data?: Json
          report_type?: string
          updated_at?: string
        }
        Relationships: []
      }
      api_performance_logs: {
        Row: {
          endpoint: string
          error_message: string | null
          id: string
          ip_address: unknown | null
          metadata: Json | null
          method: string
          request_size_bytes: number | null
          response_size_bytes: number | null
          response_time_ms: number
          status_code: number
          timestamp: string | null
          user_agent: string | null
          user_id: string | null
        }
        Insert: {
          endpoint: string
          error_message?: string | null
          id?: string
          ip_address?: unknown | null
          metadata?: Json | null
          method: string
          request_size_bytes?: number | null
          response_size_bytes?: number | null
          response_time_ms: number
          status_code: number
          timestamp?: string | null
          user_agent?: string | null
          user_id?: string | null
        }
        Update: {
          endpoint?: string
          error_message?: string | null
          id?: string
          ip_address?: unknown | null
          metadata?: Json | null
          method?: string
          request_size_bytes?: number | null
          response_size_bytes?: number | null
          response_time_ms?: number
          status_code?: number
          timestamp?: string | null
          user_agent?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      api_rate_limits: {
        Row: {
          blocked_until: string | null
          created_at: string | null
          endpoint: string
          id: string
          ip_address: unknown
          is_blocked: boolean | null
          request_count: number | null
          updated_at: string | null
          user_id: string | null
          window_end: string
          window_start: string
        }
        Insert: {
          blocked_until?: string | null
          created_at?: string | null
          endpoint: string
          id?: string
          ip_address: unknown
          is_blocked?: boolean | null
          request_count?: number | null
          updated_at?: string | null
          user_id?: string | null
          window_end: string
          window_start: string
        }
        Update: {
          blocked_until?: string | null
          created_at?: string | null
          endpoint?: string
          id?: string
          ip_address?: unknown
          is_blocked?: boolean | null
          request_count?: number | null
          updated_at?: string | null
          user_id?: string | null
          window_end?: string
          window_start?: string
        }
        Relationships: []
      }
      app_errors: {
        Row: {
          context: Json | null
          created_at: string | null
          error_message: string
          error_type: string
          id: string
          stack_trace: string | null
          user_id: string | null
        }
        Insert: {
          context?: Json | null
          created_at?: string | null
          error_message: string
          error_type: string
          id?: string
          stack_trace?: string | null
          user_id?: string | null
        }
        Update: {
          context?: Json | null
          created_at?: string | null
          error_message?: string
          error_type?: string
          id?: string
          stack_trace?: string | null
          user_id?: string | null
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
      billing_profiles: {
        Row: {
          address: Json
          business_number: string | null
          created_at: string | null
          email: string
          id: string
          is_active: boolean | null
          name: string
          phone: string | null
          tax_id: string | null
          type: string | null
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          address: Json
          business_number?: string | null
          created_at?: string | null
          email: string
          id: string
          is_active?: boolean | null
          name: string
          phone?: string | null
          tax_id?: string | null
          type?: string | null
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          address?: Json
          business_number?: string | null
          created_at?: string | null
          email?: string
          id?: string
          is_active?: boolean | null
          name?: string
          phone?: string | null
          tax_id?: string | null
          type?: string | null
          updated_at?: string | null
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
      bookings: {
        Row: {
          cancellation_reason: string | null
          cancelled_at: string | null
          created_at: string | null
          currency: string | null
          date: string | null
          id: string
          location: Json | null
          notes: string | null
          price: number | null
          provider_id: string | null
          service_id: string
          status: string | null
          time: string | null
          total_amount: number | null
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          cancellation_reason?: string | null
          cancelled_at?: string | null
          created_at?: string | null
          currency?: string | null
          date?: string | null
          id?: string
          location?: Json | null
          notes?: string | null
          price?: number | null
          provider_id?: string | null
          service_id: string
          status?: string | null
          time?: string | null
          total_amount?: number | null
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          cancellation_reason?: string | null
          cancelled_at?: string | null
          created_at?: string | null
          currency?: string | null
          date?: string | null
          id?: string
          location?: Json | null
          notes?: string | null
          price?: number | null
          provider_id?: string | null
          service_id?: string
          status?: string | null
          time?: string | null
          total_amount?: number | null
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "bookings_provider_id_fkey"
            columns: ["provider_id"]
            isOneToOne: false
            referencedRelation: "service_providers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "bookings_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      cache_management: {
        Row: {
          cache_key: string
          cache_type: string
          created_at: string | null
          data: Json
          expires_at: string
          hit_count: number | null
          id: string
          last_accessed_at: string | null
          size_bytes: number | null
          ttl_seconds: number
          updated_at: string | null
        }
        Insert: {
          cache_key: string
          cache_type: string
          created_at?: string | null
          data: Json
          expires_at: string
          hit_count?: number | null
          id?: string
          last_accessed_at?: string | null
          size_bytes?: number | null
          ttl_seconds: number
          updated_at?: string | null
        }
        Update: {
          cache_key?: string
          cache_type?: string
          created_at?: string | null
          data?: Json
          expires_at?: string
          hit_count?: number | null
          id?: string
          last_accessed_at?: string | null
          size_bytes?: number | null
          ttl_seconds?: number
          updated_at?: string | null
        }
        Relationships: []
      }
      category_analytics: {
        Row: {
          active_providers: number
          average_rating: number | null
          category_id: string | null
          conversion_rate: number | null
          created_at: string
          growth_rate: number | null
          id: string
          search_count: number
          total_bookings: number
          total_revenue: number
          updated_at: string
        }
        Insert: {
          active_providers?: number
          average_rating?: number | null
          category_id?: string | null
          conversion_rate?: number | null
          created_at?: string
          growth_rate?: number | null
          id?: string
          search_count?: number
          total_bookings?: number
          total_revenue?: number
          updated_at?: string
        }
        Update: {
          active_providers?: number
          average_rating?: number | null
          category_id?: string | null
          conversion_rate?: number | null
          created_at?: string
          growth_rate?: number | null
          id?: string
          search_count?: number
          total_bookings?: number
          total_revenue?: number
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "category_analytics_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: true
            referencedRelation: "service_categories"
            referencedColumns: ["id"]
          },
        ]
      }
      causes: {
        Row: {
          category_id: string | null
          created_at: string | null
          currency: string | null
          description: string
          end_date: string | null
          featured: boolean | null
          full_description: string | null
          goal_amount: number
          id: string
          image_url: string | null
          is_verified: boolean | null
          organizer_email: string | null
          organizer_name: string | null
          organizer_phone: string | null
          raised_amount: number | null
          start_date: string | null
          status: string
          title: string
          updated_at: string | null
        }
        Insert: {
          category_id?: string | null
          created_at?: string | null
          currency?: string | null
          description: string
          end_date?: string | null
          featured?: boolean | null
          full_description?: string | null
          goal_amount: number
          id?: string
          image_url?: string | null
          is_verified?: boolean | null
          organizer_email?: string | null
          organizer_name?: string | null
          organizer_phone?: string | null
          raised_amount?: number | null
          start_date?: string | null
          status?: string
          title: string
          updated_at?: string | null
        }
        Update: {
          category_id?: string | null
          created_at?: string | null
          currency?: string | null
          description?: string
          end_date?: string | null
          featured?: boolean | null
          full_description?: string | null
          goal_amount?: number
          id?: string
          image_url?: string | null
          is_verified?: boolean | null
          organizer_email?: string | null
          organizer_name?: string | null
          organizer_phone?: string | null
          raised_amount?: number | null
          start_date?: string | null
          status?: string
          title?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "causes_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "donation_categories"
            referencedColumns: ["id"]
          },
        ]
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
        Relationships: []
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
        ]
      }
      chatbot_conversations: {
        Row: {
          created_at: string | null
          id: string
          satisfaction_score: number | null
          sentiment: string | null
          session_id: string
          status: string
          topic: string | null
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          satisfaction_score?: number | null
          sentiment?: string | null
          session_id: string
          status?: string
          topic?: string | null
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          satisfaction_score?: number | null
          sentiment?: string | null
          session_id?: string
          status?: string
          topic?: string | null
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      chatbot_messages: {
        Row: {
          confidence: number | null
          content: string
          conversation_id: string
          created_at: string | null
          entities: Json | null
          id: string
          intent: string | null
          message_type: string
          metadata: Json | null
          sender_type: string
        }
        Insert: {
          confidence?: number | null
          content: string
          conversation_id: string
          created_at?: string | null
          entities?: Json | null
          id?: string
          intent?: string | null
          message_type: string
          metadata?: Json | null
          sender_type: string
        }
        Update: {
          confidence?: number | null
          content?: string
          conversation_id?: string
          created_at?: string | null
          entities?: Json | null
          id?: string
          intent?: string | null
          message_type?: string
          metadata?: Json | null
          sender_type?: string
        }
        Relationships: [
          {
            foreignKeyName: "chatbot_messages_conversation_id_fkey"
            columns: ["conversation_id"]
            isOneToOne: false
            referencedRelation: "chatbot_conversations"
            referencedColumns: ["id"]
          },
        ]
      }
      content_generation: {
        Row: {
          approved_at: string | null
          approved_by: string | null
          content_type: string
          created_at: string | null
          generated_content: string
          id: string
          is_approved: boolean | null
          prompt: string
          quality_score: number | null
          target_id: string | null
          target_type: string | null
        }
        Insert: {
          approved_at?: string | null
          approved_by?: string | null
          content_type: string
          created_at?: string | null
          generated_content: string
          id?: string
          is_approved?: boolean | null
          prompt: string
          quality_score?: number | null
          target_id?: string | null
          target_type?: string | null
        }
        Update: {
          approved_at?: string | null
          approved_by?: string | null
          content_type?: string
          created_at?: string | null
          generated_content?: string
          id?: string
          is_approved?: boolean | null
          prompt?: string
          quality_score?: number | null
          target_id?: string | null
          target_type?: string | null
        }
        Relationships: []
      }
      conversations: {
        Row: {
          booking_id: string | null
          created_at: string | null
          customer_id: string | null
          id: string
          is_active: boolean | null
          last_message_at: string | null
          provider_id: string | null
          title: string | null
          updated_at: string | null
        }
        Insert: {
          booking_id?: string | null
          created_at?: string | null
          customer_id?: string | null
          id?: string
          is_active?: boolean | null
          last_message_at?: string | null
          provider_id?: string | null
          title?: string | null
          updated_at?: string | null
        }
        Update: {
          booking_id?: string | null
          created_at?: string | null
          customer_id?: string | null
          id?: string
          is_active?: boolean | null
          last_message_at?: string | null
          provider_id?: string | null
          title?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "conversations_booking_id_fkey"
            columns: ["booking_id"]
            isOneToOne: false
            referencedRelation: "bookings"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "conversations_provider_id_fkey"
            columns: ["provider_id"]
            isOneToOne: false
            referencedRelation: "service_providers"
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
      database_query_performance: {
        Row: {
          cache_hit: boolean | null
          execution_time_ms: number
          id: string
          metadata: Json | null
          query_hash: string | null
          query_type: string
          rows_affected: number | null
          table_name: string | null
          timestamp: string | null
          user_id: string | null
        }
        Insert: {
          cache_hit?: boolean | null
          execution_time_ms: number
          id?: string
          metadata?: Json | null
          query_hash?: string | null
          query_type: string
          rows_affected?: number | null
          table_name?: string | null
          timestamp?: string | null
          user_id?: string | null
        }
        Update: {
          cache_hit?: boolean | null
          execution_time_ms?: number
          id?: string
          metadata?: Json | null
          query_hash?: string | null
          query_type?: string
          rows_affected?: number | null
          table_name?: string | null
          timestamp?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      deal_categories: {
        Row: {
          color: string | null
          created_at: string | null
          description: string | null
          icon: string | null
          id: string
          is_active: boolean | null
          name: string
          updated_at: string | null
        }
        Insert: {
          color?: string | null
          created_at?: string | null
          description?: string | null
          icon?: string | null
          id?: string
          is_active?: boolean | null
          name: string
          updated_at?: string | null
        }
        Update: {
          color?: string | null
          created_at?: string | null
          description?: string | null
          icon?: string | null
          id?: string
          is_active?: boolean | null
          name?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      deal_purchases: {
        Row: {
          created_at: string | null
          deal_id: string | null
          expiry_date: string | null
          id: string
          payment_method_id: string | null
          payment_method_name: string | null
          purchase_price: number
          qr_code: string | null
          redeemed_at: string | null
          redemption_code: string | null
          status: string
          updated_at: string | null
          used_at: string | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          deal_id?: string | null
          expiry_date?: string | null
          id?: string
          payment_method_id?: string | null
          payment_method_name?: string | null
          purchase_price: number
          qr_code?: string | null
          redeemed_at?: string | null
          redemption_code?: string | null
          status?: string
          updated_at?: string | null
          used_at?: string | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          deal_id?: string | null
          expiry_date?: string | null
          id?: string
          payment_method_id?: string | null
          payment_method_name?: string | null
          purchase_price?: number
          qr_code?: string | null
          redeemed_at?: string | null
          redemption_code?: string | null
          status?: string
          updated_at?: string | null
          used_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "deal_purchases_deal_id_fkey"
            columns: ["deal_id"]
            isOneToOne: false
            referencedRelation: "deals"
            referencedColumns: ["id"]
          },
        ]
      }
      deals: {
        Row: {
          category_id: string | null
          created_at: string | null
          current_purchases: number | null
          description: string
          detailed_description: string | null
          discount_percentage: number
          discount_price: number
          expiry_date: string | null
          how_to_redeem: string | null
          id: string
          image_url: string | null
          is_active: boolean | null
          is_featured: boolean | null
          location: string | null
          max_purchases: number | null
          original_price: number
          provider_id: string | null
          provider_name: string
          terms_conditions: string | null
          title: string
          updated_at: string | null
        }
        Insert: {
          category_id?: string | null
          created_at?: string | null
          current_purchases?: number | null
          description: string
          detailed_description?: string | null
          discount_percentage: number
          discount_price: number
          expiry_date?: string | null
          how_to_redeem?: string | null
          id?: string
          image_url?: string | null
          is_active?: boolean | null
          is_featured?: boolean | null
          location?: string | null
          max_purchases?: number | null
          original_price: number
          provider_id?: string | null
          provider_name: string
          terms_conditions?: string | null
          title: string
          updated_at?: string | null
        }
        Update: {
          category_id?: string | null
          created_at?: string | null
          current_purchases?: number | null
          description?: string
          detailed_description?: string | null
          discount_percentage?: number
          discount_price?: number
          expiry_date?: string | null
          how_to_redeem?: string | null
          id?: string
          image_url?: string | null
          is_active?: boolean | null
          is_featured?: boolean | null
          location?: string | null
          max_purchases?: number | null
          original_price?: number
          provider_id?: string | null
          provider_name?: string
          terms_conditions?: string | null
          title?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "deals_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "deal_categories"
            referencedColumns: ["id"]
          },
        ]
      }
      donation_categories: {
        Row: {
          color: string | null
          created_at: string | null
          description: string | null
          icon_url: string | null
          id: string
          is_active: boolean | null
          name: string
          updated_at: string | null
        }
        Insert: {
          color?: string | null
          created_at?: string | null
          description?: string | null
          icon_url?: string | null
          id?: string
          is_active?: boolean | null
          name: string
          updated_at?: string | null
        }
        Update: {
          color?: string | null
          created_at?: string | null
          description?: string | null
          icon_url?: string | null
          id?: string
          is_active?: boolean | null
          name?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      donation_impact: {
        Row: {
          achieved_at: string | null
          cause_id: string | null
          created_at: string | null
          id: string
          impact_description: string | null
          impact_type: string
          impact_unit: string
          impact_value: number
        }
        Insert: {
          achieved_at?: string | null
          cause_id?: string | null
          created_at?: string | null
          id?: string
          impact_description?: string | null
          impact_type: string
          impact_unit: string
          impact_value: number
        }
        Update: {
          achieved_at?: string | null
          cause_id?: string | null
          created_at?: string | null
          id?: string
          impact_description?: string | null
          impact_type?: string
          impact_unit?: string
          impact_value?: number
        }
        Relationships: []
      }
      donation_milestones: {
        Row: {
          achieved: boolean | null
          achieved_at: string | null
          cause_id: string | null
          created_at: string | null
          description: string | null
          id: string
          target_amount: number
          title: string
        }
        Insert: {
          achieved?: boolean | null
          achieved_at?: string | null
          cause_id?: string | null
          created_at?: string | null
          description?: string | null
          id?: string
          target_amount: number
          title: string
        }
        Update: {
          achieved?: boolean | null
          achieved_at?: string | null
          cause_id?: string | null
          created_at?: string | null
          description?: string | null
          id?: string
          target_amount?: number
          title?: string
        }
        Relationships: []
      }
      donation_receipts: {
        Row: {
          amount: number
          cause_title: string
          created_at: string | null
          currency: string | null
          donation_id: string | null
          donor_email: string | null
          donor_name: string | null
          id: string
          receipt_date: string | null
          receipt_number: string
          receipt_pdf_url: string | null
          sent_at: string | null
          tax_deductible: boolean | null
        }
        Insert: {
          amount: number
          cause_title: string
          created_at?: string | null
          currency?: string | null
          donation_id?: string | null
          donor_email?: string | null
          donor_name?: string | null
          id?: string
          receipt_date?: string | null
          receipt_number: string
          receipt_pdf_url?: string | null
          sent_at?: string | null
          tax_deductible?: boolean | null
        }
        Update: {
          amount?: number
          cause_title?: string
          created_at?: string | null
          currency?: string | null
          donation_id?: string | null
          donor_email?: string | null
          donor_name?: string | null
          id?: string
          receipt_date?: string | null
          receipt_number?: string
          receipt_pdf_url?: string | null
          sent_at?: string | null
          tax_deductible?: boolean | null
        }
        Relationships: [
          {
            foreignKeyName: "donation_receipts_donation_id_fkey"
            columns: ["donation_id"]
            isOneToOne: false
            referencedRelation: "donations"
            referencedColumns: ["id"]
          },
        ]
      }
      donations: {
        Row: {
          amount: number
          anonymous: boolean | null
          cause_id: string | null
          created_at: string | null
          currency: string | null
          id: string
          message: string | null
          payment_method_id: string | null
          receipt_email: string | null
          receipt_sent: boolean | null
          status: string
          transaction_id: string | null
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          amount: number
          anonymous?: boolean | null
          cause_id?: string | null
          created_at?: string | null
          currency?: string | null
          id?: string
          message?: string | null
          payment_method_id?: string | null
          receipt_email?: string | null
          receipt_sent?: boolean | null
          status?: string
          transaction_id?: string | null
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          amount?: number
          anonymous?: boolean | null
          cause_id?: string | null
          created_at?: string | null
          currency?: string | null
          id?: string
          message?: string | null
          payment_method_id?: string | null
          receipt_email?: string | null
          receipt_sent?: boolean | null
          status?: string
          transaction_id?: string | null
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "donations_cause_id_fkey"
            columns: ["cause_id"]
            isOneToOne: false
            referencedRelation: "causes"
            referencedColumns: ["id"]
          },
        ]
      }
      encryption_keys: {
        Row: {
          created_at: string | null
          expires_at: string | null
          id: string
          is_active: boolean | null
          key_data: string
          key_name: string
          key_type: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          expires_at?: string | null
          id?: string
          is_active?: boolean | null
          key_data: string
          key_name: string
          key_type: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          expires_at?: string | null
          id?: string
          is_active?: boolean | null
          key_data?: string
          key_name?: string
          key_type?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      event_categories: {
        Row: {
          color: string | null
          created_at: string | null
          description: string | null
          icon: string | null
          id: string
          is_active: boolean | null
          name: string
          updated_at: string | null
        }
        Insert: {
          color?: string | null
          created_at?: string | null
          description?: string | null
          icon?: string | null
          id?: string
          is_active?: boolean | null
          name: string
          updated_at?: string | null
        }
        Update: {
          color?: string | null
          created_at?: string | null
          description?: string | null
          icon?: string | null
          id?: string
          is_active?: boolean | null
          name?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      event_favorites: {
        Row: {
          created_at: string | null
          event_id: string | null
          id: string
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          event_id?: string | null
          id?: string
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          event_id?: string | null
          id?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "event_favorites_event_id_fkey"
            columns: ["event_id"]
            isOneToOne: false
            referencedRelation: "events"
            referencedColumns: ["id"]
          },
        ]
      }
      event_organizers: {
        Row: {
          contact_email: string | null
          contact_phone: string | null
          created_at: string | null
          description: string | null
          id: string
          is_active: boolean | null
          is_verified: boolean | null
          logo_url: string | null
          name: string
          updated_at: string | null
          website: string | null
        }
        Insert: {
          contact_email?: string | null
          contact_phone?: string | null
          created_at?: string | null
          description?: string | null
          id?: string
          is_active?: boolean | null
          is_verified?: boolean | null
          logo_url?: string | null
          name: string
          updated_at?: string | null
          website?: string | null
        }
        Update: {
          contact_email?: string | null
          contact_phone?: string | null
          created_at?: string | null
          description?: string | null
          id?: string
          is_active?: boolean | null
          is_verified?: boolean | null
          logo_url?: string | null
          name?: string
          updated_at?: string | null
          website?: string | null
        }
        Relationships: []
      }
      event_ratings: {
        Row: {
          created_at: string | null
          event_id: string | null
          id: string
          rating: number
          review: string | null
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          event_id?: string | null
          id?: string
          rating: number
          review?: string | null
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          event_id?: string | null
          id?: string
          rating?: number
          review?: string | null
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "event_ratings_event_id_fkey"
            columns: ["event_id"]
            isOneToOne: false
            referencedRelation: "events"
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
        Relationships: []
      }
      events: {
        Row: {
          address: string | null
          age_restriction: string | null
          available_tickets: number
          category_id: string | null
          created_at: string | null
          currency: string | null
          description: string
          duration: string | null
          event_date: string
          event_time: string
          featured: boolean | null
          full_description: string | null
          gallery_images: Json | null
          id: string
          image_url: string | null
          latitude: number | null
          location: string
          longitude: number | null
          max_tickets_per_purchase: number | null
          organizer_id: string | null
          price: number
          rating: number | null
          status: string
          tags: string[] | null
          title: string
          total_ratings: number | null
          total_tickets: number
          updated_at: string | null
        }
        Insert: {
          address?: string | null
          age_restriction?: string | null
          available_tickets: number
          category_id?: string | null
          created_at?: string | null
          currency?: string | null
          description: string
          duration?: string | null
          event_date: string
          event_time: string
          featured?: boolean | null
          full_description?: string | null
          gallery_images?: Json | null
          id?: string
          image_url?: string | null
          latitude?: number | null
          location: string
          longitude?: number | null
          max_tickets_per_purchase?: number | null
          organizer_id?: string | null
          price: number
          rating?: number | null
          status?: string
          tags?: string[] | null
          title: string
          total_ratings?: number | null
          total_tickets: number
          updated_at?: string | null
        }
        Update: {
          address?: string | null
          age_restriction?: string | null
          available_tickets?: number
          category_id?: string | null
          created_at?: string | null
          currency?: string | null
          description?: string
          duration?: string | null
          event_date?: string
          event_time?: string
          featured?: boolean | null
          full_description?: string | null
          gallery_images?: Json | null
          id?: string
          image_url?: string | null
          latitude?: number | null
          location?: string
          longitude?: number | null
          max_tickets_per_purchase?: number | null
          organizer_id?: string | null
          price?: number
          rating?: number | null
          status?: string
          tags?: string[] | null
          title?: string
          total_ratings?: number | null
          total_tickets?: number
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "events_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "event_categories"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "events_organizer_id_fkey"
            columns: ["organizer_id"]
            isOneToOne: false
            referencedRelation: "event_organizers"
            referencedColumns: ["id"]
          },
        ]
      }
      fraud_rules: {
        Row: {
          actions: Json
          conditions: Json
          created_at: string | null
          description: string | null
          id: string
          is_active: boolean | null
          name: string
          priority: number | null
          rule_type: string
          updated_at: string | null
        }
        Insert: {
          actions: Json
          conditions: Json
          created_at?: string | null
          description?: string | null
          id?: string
          is_active?: boolean | null
          name: string
          priority?: number | null
          rule_type: string
          updated_at?: string | null
        }
        Update: {
          actions?: Json
          conditions?: Json
          created_at?: string | null
          description?: string | null
          id?: string
          is_active?: boolean | null
          name?: string
          priority?: number | null
          rule_type?: string
          updated_at?: string | null
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
      fuel_transaction_history: {
        Row: {
          action: string
          created_at: string | null
          details: Json | null
          id: string
          transaction_id: string | null
        }
        Insert: {
          action: string
          created_at?: string | null
          details?: Json | null
          id?: string
          transaction_id?: string | null
        }
        Update: {
          action?: string
          created_at?: string | null
          details?: Json | null
          id?: string
          transaction_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "fuel_transaction_history_transaction_id_fkey"
            columns: ["transaction_id"]
            isOneToOne: false
            referencedRelation: "fuel_transactions"
            referencedColumns: ["id"]
          },
        ]
      }
      fuel_transactions: {
        Row: {
          amount_authorized: number
          amount_refunded: number | null
          amount_used: number | null
          completed_at: string | null
          created_at: string | null
          fuel_type: string
          id: string
          liters_dispensed: number | null
          price_per_liter: number
          pump_number: number
          qr_code_data: string | null
          started_at: string | null
          station_id: string | null
          status: string
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          amount_authorized: number
          amount_refunded?: number | null
          amount_used?: number | null
          completed_at?: string | null
          created_at?: string | null
          fuel_type: string
          id?: string
          liters_dispensed?: number | null
          price_per_liter: number
          pump_number: number
          qr_code_data?: string | null
          started_at?: string | null
          station_id?: string | null
          status?: string
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          amount_authorized?: number
          amount_refunded?: number | null
          amount_used?: number | null
          completed_at?: string | null
          created_at?: string | null
          fuel_type?: string
          id?: string
          liters_dispensed?: number | null
          price_per_liter?: number
          pump_number?: number
          qr_code_data?: string | null
          started_at?: string | null
          station_id?: string | null
          status?: string
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "fuel_transactions_station_id_fkey"
            columns: ["station_id"]
            isOneToOne: false
            referencedRelation: "gas_stations"
            referencedColumns: ["id"]
          },
        ]
      }
      gas_stations: {
        Row: {
          address: string | null
          amenities: Json | null
          created_at: string | null
          current_prices: Json | null
          fuel_types: Json | null
          id: string
          is_active: boolean | null
          latitude: number | null
          location: string
          longitude: number | null
          name: string
          operating_hours: Json | null
          updated_at: string | null
        }
        Insert: {
          address?: string | null
          amenities?: Json | null
          created_at?: string | null
          current_prices?: Json | null
          fuel_types?: Json | null
          id?: string
          is_active?: boolean | null
          latitude?: number | null
          location: string
          longitude?: number | null
          name: string
          operating_hours?: Json | null
          updated_at?: string | null
        }
        Update: {
          address?: string | null
          amenities?: Json | null
          created_at?: string | null
          current_prices?: Json | null
          fuel_types?: Json | null
          id?: string
          is_active?: boolean | null
          latitude?: number | null
          location?: string
          longitude?: number | null
          name?: string
          operating_hours?: Json | null
          updated_at?: string | null
        }
        Relationships: []
      }
      image_optimization: {
        Row: {
          compression_ratio: number | null
          created_at: string | null
          format: string | null
          height: number | null
          id: string
          is_processed: boolean | null
          optimized_size_bytes: number | null
          optimized_url: string | null
          original_size_bytes: number
          original_url: string
          processing_time_ms: number | null
          quality: number | null
          updated_at: string | null
          width: number | null
        }
        Insert: {
          compression_ratio?: number | null
          created_at?: string | null
          format?: string | null
          height?: number | null
          id?: string
          is_processed?: boolean | null
          optimized_size_bytes?: number | null
          optimized_url?: string | null
          original_size_bytes: number
          original_url: string
          processing_time_ms?: number | null
          quality?: number | null
          updated_at?: string | null
          width?: number | null
        }
        Update: {
          compression_ratio?: number | null
          created_at?: string | null
          format?: string | null
          height?: number | null
          id?: string
          is_processed?: boolean | null
          optimized_size_bytes?: number | null
          optimized_url?: string | null
          original_size_bytes?: number
          original_url?: string
          processing_time_ms?: number | null
          quality?: number | null
          updated_at?: string | null
          width?: number | null
        }
        Relationships: []
      }
      invite_codes: {
        Row: {
          code: string
          created_at: string | null
          currency: string | null
          current_uses: number | null
          expires_at: string | null
          id: string
          is_active: boolean | null
          max_uses: number | null
          reward_amount: number | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          code: string
          created_at?: string | null
          currency?: string | null
          current_uses?: number | null
          expires_at?: string | null
          id?: string
          is_active?: boolean | null
          max_uses?: number | null
          reward_amount?: number | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          code?: string
          created_at?: string | null
          currency?: string | null
          current_uses?: number | null
          expires_at?: string | null
          id?: string
          is_active?: boolean | null
          max_uses?: number | null
          reward_amount?: number | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      invoice_items: {
        Row: {
          created_at: string | null
          description: string
          id: string
          invoice_id: string | null
          metadata: Json | null
          quantity: number
          tax_amount: number | null
          tax_rate: number | null
          total_price: number
          unit_price: number
        }
        Insert: {
          created_at?: string | null
          description: string
          id: string
          invoice_id?: string | null
          metadata?: Json | null
          quantity: number
          tax_amount?: number | null
          tax_rate?: number | null
          total_price: number
          unit_price: number
        }
        Update: {
          created_at?: string | null
          description?: string
          id?: string
          invoice_id?: string | null
          metadata?: Json | null
          quantity?: number
          tax_amount?: number | null
          tax_rate?: number | null
          total_price?: number
          unit_price?: number
        }
        Relationships: [
          {
            foreignKeyName: "invoice_items_invoice_id_fkey"
            columns: ["invoice_id"]
            isOneToOne: false
            referencedRelation: "invoices"
            referencedColumns: ["id"]
          },
        ]
      }
      invoices: {
        Row: {
          amount: number
          booking_id: string | null
          created_at: string | null
          currency: string | null
          due_date: string
          id: string
          invoice_number: string
          metadata: Json | null
          notes: string | null
          paid_date: string | null
          provider_id: string | null
          status: string | null
          tax_amount: number | null
          total_amount: number
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          amount: number
          booking_id?: string | null
          created_at?: string | null
          currency?: string | null
          due_date: string
          id: string
          invoice_number: string
          metadata?: Json | null
          notes?: string | null
          paid_date?: string | null
          provider_id?: string | null
          status?: string | null
          tax_amount?: number | null
          total_amount: number
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          amount?: number
          booking_id?: string | null
          created_at?: string | null
          currency?: string | null
          due_date?: string
          id?: string
          invoice_number?: string
          metadata?: Json | null
          notes?: string | null
          paid_date?: string | null
          provider_id?: string | null
          status?: string | null
          tax_amount?: number | null
          total_amount?: number
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "invoices_booking_id_fkey"
            columns: ["booking_id"]
            isOneToOne: false
            referencedRelation: "bookings"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "invoices_provider_id_fkey"
            columns: ["provider_id"]
            isOneToOne: false
            referencedRelation: "service_providers"
            referencedColumns: ["id"]
          },
        ]
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
          description: string
          detailed_description: string | null
          id: string
          image_url: string | null
          is_active: boolean | null
          name: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          description: string
          detailed_description?: string | null
          id?: string
          image_url?: string | null
          is_active?: boolean | null
          name: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          description?: string
          detailed_description?: string | null
          id?: string
          image_url?: string | null
          is_active?: boolean | null
          name?: string
          updated_at?: string | null
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
      memory_usage_tracking: {
        Row: {
          app_version: string | null
          heap_size_mb: number | null
          heap_used_mb: number | null
          id: string
          memory_limit_mb: number | null
          memory_percentage: number | null
          memory_usage_mb: number
          platform: string | null
          session_id: string | null
          timestamp: string | null
          user_id: string | null
        }
        Insert: {
          app_version?: string | null
          heap_size_mb?: number | null
          heap_used_mb?: number | null
          id?: string
          memory_limit_mb?: number | null
          memory_percentage?: number | null
          memory_usage_mb: number
          platform?: string | null
          session_id?: string | null
          timestamp?: string | null
          user_id?: string | null
        }
        Update: {
          app_version?: string | null
          heap_size_mb?: number | null
          heap_used_mb?: number | null
          id?: string
          memory_limit_mb?: number | null
          memory_percentage?: number | null
          memory_usage_mb?: number
          platform?: string | null
          session_id?: string | null
          timestamp?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      messages: {
        Row: {
          content: string
          conversation_id: string | null
          created_at: string | null
          id: string
          is_read: boolean | null
          media_url: string | null
          message_type: string | null
          read_at: string | null
          sender_id: string
          sender_name: string
          sender_type: string
          updated_at: string | null
        }
        Insert: {
          content: string
          conversation_id?: string | null
          created_at?: string | null
          id?: string
          is_read?: boolean | null
          media_url?: string | null
          message_type?: string | null
          read_at?: string | null
          sender_id: string
          sender_name: string
          sender_type: string
          updated_at?: string | null
        }
        Update: {
          content?: string
          conversation_id?: string | null
          created_at?: string | null
          id?: string
          is_read?: boolean | null
          media_url?: string | null
          message_type?: string | null
          read_at?: string | null
          sender_id?: string
          sender_name?: string
          sender_type?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "messages_conversation_id_fkey"
            columns: ["conversation_id"]
            isOneToOne: false
            referencedRelation: "conversations"
            referencedColumns: ["id"]
          },
        ]
      }
      ml_training_data: {
        Row: {
          created_at: string | null
          data_type: string
          features: Json
          id: string
          is_processed: boolean | null
          labels: Json | null
          metadata: Json | null
          model_id: string | null
        }
        Insert: {
          created_at?: string | null
          data_type: string
          features: Json
          id?: string
          is_processed?: boolean | null
          labels?: Json | null
          metadata?: Json | null
          model_id?: string | null
        }
        Update: {
          created_at?: string | null
          data_type?: string
          features?: Json
          id?: string
          is_processed?: boolean | null
          labels?: Json | null
          metadata?: Json | null
          model_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "ml_training_data_model_id_fkey"
            columns: ["model_id"]
            isOneToOne: false
            referencedRelation: "ai_models"
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
        Relationships: []
      }
      notification_settings: {
        Row: {
          badge_enabled: boolean | null
          created_at: string | null
          deal_notifications: Json | null
          donation_notifications: Json | null
          event_notifications: Json | null
          frequency: string | null
          id: string
          language: string | null
          loyalty_notifications: Json | null
          marketplace_notifications: Json | null
          payment_notifications: Json | null
          promotional_notifications: Json | null
          push_enabled: boolean | null
          qr_code_notifications: Json | null
          quiet_hours: Json | null
          referral_notifications: Json | null
          sound_enabled: boolean | null
          subscription_notifications: Json | null
          system_notifications: Json | null
          taxi_notifications: Json | null
          updated_at: string | null
          user_id: string | null
          vibration_enabled: boolean | null
        }
        Insert: {
          badge_enabled?: boolean | null
          created_at?: string | null
          deal_notifications?: Json | null
          donation_notifications?: Json | null
          event_notifications?: Json | null
          frequency?: string | null
          id?: string
          language?: string | null
          loyalty_notifications?: Json | null
          marketplace_notifications?: Json | null
          payment_notifications?: Json | null
          promotional_notifications?: Json | null
          push_enabled?: boolean | null
          qr_code_notifications?: Json | null
          quiet_hours?: Json | null
          referral_notifications?: Json | null
          sound_enabled?: boolean | null
          subscription_notifications?: Json | null
          system_notifications?: Json | null
          taxi_notifications?: Json | null
          updated_at?: string | null
          user_id?: string | null
          vibration_enabled?: boolean | null
        }
        Update: {
          badge_enabled?: boolean | null
          created_at?: string | null
          deal_notifications?: Json | null
          donation_notifications?: Json | null
          event_notifications?: Json | null
          frequency?: string | null
          id?: string
          language?: string | null
          loyalty_notifications?: Json | null
          marketplace_notifications?: Json | null
          payment_notifications?: Json | null
          promotional_notifications?: Json | null
          push_enabled?: boolean | null
          qr_code_notifications?: Json | null
          quiet_hours?: Json | null
          referral_notifications?: Json | null
          sound_enabled?: boolean | null
          subscription_notifications?: Json | null
          system_notifications?: Json | null
          taxi_notifications?: Json | null
          updated_at?: string | null
          user_id?: string | null
          vibration_enabled?: boolean | null
        }
        Relationships: [
          {
            foreignKeyName: "notification_settings_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: true
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      notifications: {
        Row: {
          created_at: string | null
          data: Json | null
          id: string
          is_read: boolean | null
          is_sent: boolean | null
          message: string
          sent_at: string | null
          title: string
          type: string
          updated_at: string | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          data?: Json | null
          id?: string
          is_read?: boolean | null
          is_sent?: boolean | null
          message: string
          sent_at?: string | null
          title: string
          type: string
          updated_at?: string | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          data?: Json | null
          id?: string
          is_read?: boolean | null
          is_sent?: boolean | null
          message?: string
          sent_at?: string | null
          title?: string
          type?: string
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      partner_businesses: {
        Row: {
          category: string | null
          created_at: string | null
          description: string | null
          id: string
          is_active: boolean | null
          name: string
          reward_rate: number
          updated_at: string | null
        }
        Insert: {
          category?: string | null
          created_at?: string | null
          description?: string | null
          id?: string
          is_active?: boolean | null
          name: string
          reward_rate?: number
          updated_at?: string | null
        }
        Update: {
          category?: string | null
          created_at?: string | null
          description?: string | null
          id?: string
          is_active?: boolean | null
          name?: string
          reward_rate?: number
          updated_at?: string | null
        }
        Relationships: []
      }
      payment_intents: {
        Row: {
          amount: number
          booking_id: string | null
          client_secret: string | null
          created_at: string | null
          currency: string | null
          description: string
          id: string
          invoice_id: string | null
          metadata: Json | null
          payment_method_id: string | null
          status: string | null
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          amount: number
          booking_id?: string | null
          client_secret?: string | null
          created_at?: string | null
          currency?: string | null
          description: string
          id: string
          invoice_id?: string | null
          metadata?: Json | null
          payment_method_id?: string | null
          status?: string | null
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          amount?: number
          booking_id?: string | null
          client_secret?: string | null
          created_at?: string | null
          currency?: string | null
          description?: string
          id?: string
          invoice_id?: string | null
          metadata?: Json | null
          payment_method_id?: string | null
          status?: string | null
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "payment_intents_booking_id_fkey"
            columns: ["booking_id"]
            isOneToOne: false
            referencedRelation: "bookings"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "payment_intents_invoice_id_fkey"
            columns: ["invoice_id"]
            isOneToOne: false
            referencedRelation: "invoices"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "payment_intents_payment_method_id_fkey"
            columns: ["payment_method_id"]
            isOneToOne: false
            referencedRelation: "payment_methods"
            referencedColumns: ["id"]
          },
        ]
      }
      payment_methods: {
        Row: {
          brand: string | null
          created_at: string | null
          expiry_month: number | null
          expiry_year: number | null
          id: string
          is_active: boolean | null
          is_default: boolean | null
          last4: string | null
          metadata: Json | null
          name: string
          provider: string | null
          type: string
          updated_at: string | null
          user_id: string
        }
        Insert: {
          brand?: string | null
          created_at?: string | null
          expiry_month?: number | null
          expiry_year?: number | null
          id?: string
          is_active?: boolean | null
          is_default?: boolean | null
          last4?: string | null
          metadata?: Json | null
          name: string
          provider?: string | null
          type: string
          updated_at?: string | null
          user_id: string
        }
        Update: {
          brand?: string | null
          created_at?: string | null
          expiry_month?: number | null
          expiry_year?: number | null
          id?: string
          is_active?: boolean | null
          is_default?: boolean | null
          last4?: string | null
          metadata?: Json | null
          name?: string
          provider?: string | null
          type?: string
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      payment_plans: {
        Row: {
          billing_cycle: string
          created_at: string | null
          currency: string | null
          description: string | null
          features: Json | null
          id: string
          is_active: boolean | null
          name: string
          price: number
          updated_at: string | null
        }
        Insert: {
          billing_cycle: string
          created_at?: string | null
          currency?: string | null
          description?: string | null
          features?: Json | null
          id?: string
          is_active?: boolean | null
          name: string
          price: number
          updated_at?: string | null
        }
        Update: {
          billing_cycle?: string
          created_at?: string | null
          currency?: string | null
          description?: string | null
          features?: Json | null
          id?: string
          is_active?: boolean | null
          name?: string
          price?: number
          updated_at?: string | null
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
      performance_alerts: {
        Row: {
          alert_type: string
          created_at: string | null
          description: string
          id: string
          is_resolved: boolean | null
          metadata: Json | null
          metric_value: number | null
          resolved_at: string | null
          resolved_by: string | null
          severity: string
          threshold_value: number | null
          title: string
        }
        Insert: {
          alert_type: string
          created_at?: string | null
          description: string
          id?: string
          is_resolved?: boolean | null
          metadata?: Json | null
          metric_value?: number | null
          resolved_at?: string | null
          resolved_by?: string | null
          severity: string
          threshold_value?: number | null
          title: string
        }
        Update: {
          alert_type?: string
          created_at?: string | null
          description?: string
          id?: string
          is_resolved?: boolean | null
          metadata?: Json | null
          metric_value?: number | null
          resolved_at?: string | null
          resolved_by?: string | null
          severity?: string
          threshold_value?: number | null
          title?: string
        }
        Relationships: []
      }
      performance_metrics: {
        Row: {
          app_version: string | null
          device_info: Json | null
          id: string
          metadata: Json | null
          metric_name: string
          metric_type: string
          metric_value: number
          platform: string | null
          session_id: string | null
          timestamp: string | null
          unit: string
          user_id: string | null
        }
        Insert: {
          app_version?: string | null
          device_info?: Json | null
          id?: string
          metadata?: Json | null
          metric_name: string
          metric_type: string
          metric_value: number
          platform?: string | null
          session_id?: string | null
          timestamp?: string | null
          unit: string
          user_id?: string | null
        }
        Update: {
          app_version?: string | null
          device_info?: Json | null
          id?: string
          metadata?: Json | null
          metric_name?: string
          metric_type?: string
          metric_value?: number
          platform?: string | null
          session_id?: string | null
          timestamp?: string | null
          unit?: string
          user_id?: string | null
        }
        Relationships: []
      }
      points_expiry: {
        Row: {
          created_at: string | null
          expiry_date: string
          id: string
          is_expired: boolean | null
          points_amount: number
          source_transaction_id: string | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          expiry_date: string
          id?: string
          is_expired?: boolean | null
          points_amount: number
          source_transaction_id?: string | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          expiry_date?: string
          id?: string
          is_expired?: boolean | null
          points_amount?: number
          source_transaction_id?: string | null
          user_id?: string
        }
        Relationships: []
      }
      points_transactions: {
        Row: {
          created_at: string | null
          description: string | null
          expiry_date: string | null
          id: string
          points: number
          program_id: string | null
          reference_id: string | null
          reference_type: string | null
          transaction_type: string
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          expiry_date?: string | null
          id?: string
          points: number
          program_id?: string | null
          reference_id?: string | null
          reference_type?: string | null
          transaction_type: string
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          description?: string | null
          expiry_date?: string | null
          id?: string
          points?: number
          program_id?: string | null
          reference_id?: string | null
          reference_type?: string | null
          transaction_type?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "points_transactions_program_id_fkey"
            columns: ["program_id"]
            isOneToOne: false
            referencedRelation: "loyalty_programs"
            referencedColumns: ["id"]
          },
        ]
      }
      privacy_requests: {
        Row: {
          completed_at: string | null
          created_at: string | null
          description: string | null
          expires_at: string | null
          id: string
          processed_data: Json | null
          request_type: string
          requested_data: Json | null
          status: string
          updated_at: string | null
          user_id: string
        }
        Insert: {
          completed_at?: string | null
          created_at?: string | null
          description?: string | null
          expires_at?: string | null
          id?: string
          processed_data?: Json | null
          request_type: string
          requested_data?: Json | null
          status?: string
          updated_at?: string | null
          user_id: string
        }
        Update: {
          completed_at?: string | null
          created_at?: string | null
          description?: string | null
          expires_at?: string | null
          id?: string
          processed_data?: Json | null
          request_type?: string
          requested_data?: Json | null
          status?: string
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      program_levels: {
        Row: {
          benefits: Json | null
          color: string | null
          created_at: string | null
          id: string
          name: string
          program_id: string | null
          requirement_max: number | null
          requirement_min: number
        }
        Insert: {
          benefits?: Json | null
          color?: string | null
          created_at?: string | null
          id?: string
          name: string
          program_id?: string | null
          requirement_max?: number | null
          requirement_min: number
        }
        Update: {
          benefits?: Json | null
          color?: string | null
          created_at?: string | null
          id?: string
          name?: string
          program_id?: string | null
          requirement_max?: number | null
          requirement_min?: number
        }
        Relationships: [
          {
            foreignKeyName: "program_levels_program_id_fkey"
            columns: ["program_id"]
            isOneToOne: false
            referencedRelation: "loyalty_programs"
            referencedColumns: ["id"]
          },
        ]
      }
      provider_analytics: {
        Row: {
          average_rating: number | null
          cancelled_bookings: number
          completed_bookings: number
          completion_rate: number | null
          created_at: string
          id: string
          peak_hours: Json | null
          popular_services: string[] | null
          provider_id: string | null
          response_time_minutes: number | null
          total_bookings: number
          total_revenue: number
          updated_at: string
        }
        Insert: {
          average_rating?: number | null
          cancelled_bookings?: number
          completed_bookings?: number
          completion_rate?: number | null
          created_at?: string
          id?: string
          peak_hours?: Json | null
          popular_services?: string[] | null
          provider_id?: string | null
          response_time_minutes?: number | null
          total_bookings?: number
          total_revenue?: number
          updated_at?: string
        }
        Update: {
          average_rating?: number | null
          cancelled_bookings?: number
          completed_bookings?: number
          completion_rate?: number | null
          created_at?: string
          id?: string
          peak_hours?: Json | null
          popular_services?: string[] | null
          provider_id?: string | null
          response_time_minutes?: number | null
          total_bookings?: number
          total_revenue?: number
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "provider_analytics_provider_id_fkey"
            columns: ["provider_id"]
            isOneToOne: true
            referencedRelation: "service_providers"
            referencedColumns: ["id"]
          },
        ]
      }
      provider_deals: {
        Row: {
          approved_at: string | null
          approved_by: string | null
          created_at: string | null
          deal_id: string | null
          id: string
          is_approved: boolean | null
          notes: string | null
          provider_id: string
          updated_at: string | null
        }
        Insert: {
          approved_at?: string | null
          approved_by?: string | null
          created_at?: string | null
          deal_id?: string | null
          id?: string
          is_approved?: boolean | null
          notes?: string | null
          provider_id: string
          updated_at?: string | null
        }
        Update: {
          approved_at?: string | null
          approved_by?: string | null
          created_at?: string | null
          deal_id?: string | null
          id?: string
          is_approved?: boolean | null
          notes?: string | null
          provider_id?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "provider_deals_deal_id_fkey"
            columns: ["deal_id"]
            isOneToOne: false
            referencedRelation: "deals"
            referencedColumns: ["id"]
          },
        ]
      }
      pump_status: {
        Row: {
          created_at: string | null
          current_transaction_id: string | null
          fuel_type: string
          id: string
          last_activity: string | null
          pump_number: number
          station_id: string | null
          status: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          current_transaction_id?: string | null
          fuel_type: string
          id?: string
          last_activity?: string | null
          pump_number: number
          station_id?: string | null
          status?: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          current_transaction_id?: string | null
          fuel_type?: string
          id?: string
          last_activity?: string | null
          pump_number?: number
          station_id?: string | null
          status?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "pump_status_current_transaction_id_fkey"
            columns: ["current_transaction_id"]
            isOneToOne: false
            referencedRelation: "fuel_transactions"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "pump_status_station_id_fkey"
            columns: ["station_id"]
            isOneToOne: false
            referencedRelation: "gas_stations"
            referencedColumns: ["id"]
          },
        ]
      }
      qr_code_scans: {
        Row: {
          created_at: string | null
          error_message: string | null
          id: string
          is_successful: boolean | null
          qr_code_id: string | null
          scan_data: Json | null
          scan_location: string | null
          scan_timestamp: string | null
          scanned_by_user_id: string | null
        }
        Insert: {
          created_at?: string | null
          error_message?: string | null
          id?: string
          is_successful?: boolean | null
          qr_code_id?: string | null
          scan_data?: Json | null
          scan_location?: string | null
          scan_timestamp?: string | null
          scanned_by_user_id?: string | null
        }
        Update: {
          created_at?: string | null
          error_message?: string | null
          id?: string
          is_successful?: boolean | null
          qr_code_id?: string | null
          scan_data?: Json | null
          scan_location?: string | null
          scan_timestamp?: string | null
          scanned_by_user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "qr_code_scans_qr_code_id_fkey"
            columns: ["qr_code_id"]
            isOneToOne: false
            referencedRelation: "user_qr_codes"
            referencedColumns: ["id"]
          },
        ]
      }
      qr_code_types: {
        Row: {
          created_at: string | null
          description: string | null
          format_schema: Json | null
          id: string
          is_active: boolean | null
          name: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          format_schema?: Json | null
          id?: string
          is_active?: boolean | null
          name: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          description?: string | null
          format_schema?: Json | null
          id?: string
          is_active?: boolean | null
          name?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      referral_bonuses: {
        Row: {
          bonus_points: number
          completed_at: string | null
          created_at: string | null
          id: string
          referral_code: string
          referred_id: string | null
          referrer_id: string
          status: string | null
        }
        Insert: {
          bonus_points?: number
          completed_at?: string | null
          created_at?: string | null
          id?: string
          referral_code: string
          referred_id?: string | null
          referrer_id: string
          status?: string | null
        }
        Update: {
          bonus_points?: number
          completed_at?: string | null
          created_at?: string | null
          id?: string
          referral_code?: string
          referred_id?: string | null
          referrer_id?: string
          status?: string | null
        }
        Relationships: []
      }
      referral_rewards: {
        Row: {
          amount: number
          created_at: string | null
          currency: string | null
          id: string
          paid_at: string | null
          referral_id: string | null
          reward_type: string
          status: string
          transaction_id: string | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          amount: number
          created_at?: string | null
          currency?: string | null
          id?: string
          paid_at?: string | null
          referral_id?: string | null
          reward_type: string
          status?: string
          transaction_id?: string | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          amount?: number
          created_at?: string | null
          currency?: string | null
          id?: string
          paid_at?: string | null
          referral_id?: string | null
          reward_type?: string
          status?: string
          transaction_id?: string | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "referral_rewards_referral_id_fkey"
            columns: ["referral_id"]
            isOneToOne: false
            referencedRelation: "user_referrals"
            referencedColumns: ["id"]
          },
        ]
      }
      referral_settings: {
        Row: {
          created_at: string | null
          description: string | null
          id: string
          is_active: boolean | null
          setting_key: string
          setting_value: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          id?: string
          is_active?: boolean | null
          setting_key: string
          setting_value: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          description?: string | null
          id?: string
          is_active?: boolean | null
          setting_key?: string
          setting_value?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      rental_listings: {
        Row: {
          category: string
          condition: string | null
          created_at: string | null
          delivery_options: Json | null
          description: string
          id: string
          images: string[] | null
          inquiries: number | null
          location: string
          name: string
          price: number
          price_unit: string
          rating: number | null
          status: string | null
          updated_at: string | null
          user_id: string
          views: number | null
        }
        Insert: {
          category: string
          condition?: string | null
          created_at?: string | null
          delivery_options?: Json | null
          description: string
          id?: string
          images?: string[] | null
          inquiries?: number | null
          location: string
          name: string
          price: number
          price_unit: string
          rating?: number | null
          status?: string | null
          updated_at?: string | null
          user_id: string
          views?: number | null
        }
        Update: {
          category?: string
          condition?: string | null
          created_at?: string | null
          delivery_options?: Json | null
          description?: string
          id?: string
          images?: string[] | null
          inquiries?: number | null
          location?: string
          name?: string
          price?: number
          price_unit?: string
          rating?: number | null
          status?: string | null
          updated_at?: string | null
          user_id?: string
          views?: number | null
        }
        Relationships: []
      }
      rental_photos: {
        Row: {
          created_at: string | null
          id: string
          photo_size: number
          photo_type: string
          photo_uri: string
          updated_at: string | null
          uploaded_at: string | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          photo_size: number
          photo_type: string
          photo_uri: string
          updated_at?: string | null
          uploaded_at?: string | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          photo_size?: number
          photo_type?: string
          photo_uri?: string
          updated_at?: string | null
          uploaded_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      resource_loading_performance: {
        Row: {
          cache_status: string | null
          id: string
          load_time_ms: number
          metadata: Json | null
          resource_type: string
          resource_url: string
          session_id: string | null
          size_bytes: number | null
          timestamp: string | null
          user_id: string | null
        }
        Insert: {
          cache_status?: string | null
          id?: string
          load_time_ms: number
          metadata?: Json | null
          resource_type: string
          resource_url: string
          session_id?: string | null
          size_bytes?: number | null
          timestamp?: string | null
          user_id?: string | null
        }
        Update: {
          cache_status?: string | null
          id?: string
          load_time_ms?: number
          metadata?: Json | null
          resource_type?: string
          resource_url?: string
          session_id?: string | null
          size_bytes?: number | null
          timestamp?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      reward_tiers: {
        Row: {
          benefits: string[] | null
          color: string | null
          created_at: string | null
          id: string
          max_points: number | null
          min_points: number
          multiplier: number
          name: string
        }
        Insert: {
          benefits?: string[] | null
          color?: string | null
          created_at?: string | null
          id?: string
          max_points?: number | null
          min_points?: number
          multiplier?: number
          name: string
        }
        Update: {
          benefits?: string[] | null
          color?: string | null
          created_at?: string | null
          id?: string
          max_points?: number | null
          min_points?: number
          multiplier?: number
          name?: string
        }
        Relationships: []
      }
      rewards_catalog: {
        Row: {
          created_at: string | null
          description: string | null
          expiry_days: number | null
          id: string
          is_active: boolean | null
          points_cost: number
          program_id: string | null
          reward_data: Json | null
          reward_type: string
          reward_value: number | null
          terms_conditions: string | null
          title: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          expiry_days?: number | null
          id?: string
          is_active?: boolean | null
          points_cost: number
          program_id?: string | null
          reward_data?: Json | null
          reward_type: string
          reward_value?: number | null
          terms_conditions?: string | null
          title: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          description?: string | null
          expiry_days?: number | null
          id?: string
          is_active?: boolean | null
          points_cost?: number
          program_id?: string | null
          reward_data?: Json | null
          reward_type?: string
          reward_value?: number | null
          terms_conditions?: string | null
          title?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "rewards_catalog_program_id_fkey"
            columns: ["program_id"]
            isOneToOne: false
            referencedRelation: "loyalty_programs"
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
      security_activities: {
        Row: {
          activity_type: string
          created_at: string | null
          description: string | null
          id: string
          ip_address: string | null
          user_agent: string | null
          user_id: string | null
        }
        Insert: {
          activity_type: string
          created_at?: string | null
          description?: string | null
          id?: string
          ip_address?: string | null
          user_agent?: string | null
          user_id?: string | null
        }
        Update: {
          activity_type?: string
          created_at?: string | null
          description?: string | null
          id?: string
          ip_address?: string | null
          user_agent?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "security_activities_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      security_events: {
        Row: {
          created_at: string | null
          description: string
          event_type: string
          id: string
          ip_address: unknown | null
          is_resolved: boolean | null
          location: Json | null
          metadata: Json | null
          resolved_at: string | null
          resolved_by: string | null
          severity: string
          user_agent: string | null
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          description: string
          event_type: string
          id?: string
          ip_address?: unknown | null
          is_resolved?: boolean | null
          location?: Json | null
          metadata?: Json | null
          resolved_at?: string | null
          resolved_by?: string | null
          severity: string
          user_agent?: string | null
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          description?: string
          event_type?: string
          id?: string
          ip_address?: unknown | null
          is_resolved?: boolean | null
          location?: Json | null
          metadata?: Json | null
          resolved_at?: string | null
          resolved_by?: string | null
          severity?: string
          user_agent?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      security_settings: {
        Row: {
          analytics_consent: boolean | null
          created_at: string | null
          data_export_enabled: boolean | null
          id: string
          login_notifications: boolean | null
          marketing_consent: boolean | null
          suspicious_activity_alerts: boolean | null
          two_factor_enabled: boolean | null
          two_factor_method: string | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          analytics_consent?: boolean | null
          created_at?: string | null
          data_export_enabled?: boolean | null
          id?: string
          login_notifications?: boolean | null
          marketing_consent?: boolean | null
          suspicious_activity_alerts?: boolean | null
          two_factor_enabled?: boolean | null
          two_factor_method?: string | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          analytics_consent?: boolean | null
          created_at?: string | null
          data_export_enabled?: boolean | null
          id?: string
          login_notifications?: boolean | null
          marketing_consent?: boolean | null
          suspicious_activity_alerts?: boolean | null
          two_factor_enabled?: boolean | null
          two_factor_method?: string | null
          updated_at?: string | null
          user_id?: string
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
        Relationships: []
      }
      service_categories: {
        Row: {
          color: string | null
          created_at: string | null
          description: string | null
          icon: string | null
          id: string
          is_featured: boolean | null
          is_popular: boolean | null
          name: string
          sub_categories: Json | null
        }
        Insert: {
          color?: string | null
          created_at?: string | null
          description?: string | null
          icon?: string | null
          id?: string
          is_featured?: boolean | null
          is_popular?: boolean | null
          name: string
          sub_categories?: Json | null
        }
        Update: {
          color?: string | null
          created_at?: string | null
          description?: string | null
          icon?: string | null
          id?: string
          is_featured?: boolean | null
          is_popular?: boolean | null
          name?: string
          sub_categories?: Json | null
        }
        Relationships: []
      }
      service_providers: {
        Row: {
          address: string | null
          availability: string | null
          category_id: string | null
          completed_jobs: number | null
          created_at: string | null
          description: string | null
          email: string | null
          experience: string | null
          gallery: string[] | null
          hourly_rate: number | null
          id: string
          images: string[] | null
          location: Json | null
          name: string
          phone: string | null
          pricing: Json | null
          rating: number | null
          response_time: string | null
          review_count: number | null
          services: string[] | null
          specializations: string[] | null
          updated_at: string | null
          user_id: string | null
          verified: boolean | null
          website: string | null
        }
        Insert: {
          address?: string | null
          availability?: string | null
          category_id?: string | null
          completed_jobs?: number | null
          created_at?: string | null
          description?: string | null
          email?: string | null
          experience?: string | null
          gallery?: string[] | null
          hourly_rate?: number | null
          id?: string
          images?: string[] | null
          location?: Json | null
          name: string
          phone?: string | null
          pricing?: Json | null
          rating?: number | null
          response_time?: string | null
          review_count?: number | null
          services?: string[] | null
          specializations?: string[] | null
          updated_at?: string | null
          user_id?: string | null
          verified?: boolean | null
          website?: string | null
        }
        Update: {
          address?: string | null
          availability?: string | null
          category_id?: string | null
          completed_jobs?: number | null
          created_at?: string | null
          description?: string | null
          email?: string | null
          experience?: string | null
          gallery?: string[] | null
          hourly_rate?: number | null
          id?: string
          images?: string[] | null
          location?: Json | null
          name?: string
          phone?: string | null
          pricing?: Json | null
          rating?: number | null
          response_time?: string | null
          review_count?: number | null
          services?: string[] | null
          specializations?: string[] | null
          updated_at?: string | null
          user_id?: string | null
          verified?: boolean | null
          website?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "service_providers_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "service_categories"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "service_providers_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
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
          category_id: string | null
          created_at: string | null
          currency: string | null
          description: string | null
          duration: number | null
          id: string
          image: string | null
          is_active: boolean | null
          name: string
          price: number | null
          provider_id: string | null
          updated_at: string | null
        }
        Insert: {
          category_id?: string | null
          created_at?: string | null
          currency?: string | null
          description?: string | null
          duration?: number | null
          id?: string
          image?: string | null
          is_active?: boolean | null
          name: string
          price?: number | null
          provider_id?: string | null
          updated_at?: string | null
        }
        Update: {
          category_id?: string | null
          created_at?: string | null
          currency?: string | null
          description?: string | null
          duration?: number | null
          id?: string
          image?: string | null
          is_active?: boolean | null
          name?: string
          price?: number | null
          provider_id?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "services_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "service_categories"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "services_provider_id_fkey"
            columns: ["provider_id"]
            isOneToOne: false
            referencedRelation: "service_providers"
            referencedColumns: ["id"]
          },
        ]
      }
      smart_pricing: {
        Row: {
          applied_at: string | null
          base_price: number
          competition_factor: number | null
          confidence_score: number | null
          created_at: string | null
          demand_factor: number | null
          final_price: number
          id: string
          is_applied: boolean | null
          provider_id: string | null
          seasonality_factor: number | null
          service_id: string | null
          suggested_price: number
          time_factor: number | null
        }
        Insert: {
          applied_at?: string | null
          base_price: number
          competition_factor?: number | null
          confidence_score?: number | null
          created_at?: string | null
          demand_factor?: number | null
          final_price: number
          id?: string
          is_applied?: boolean | null
          provider_id?: string | null
          seasonality_factor?: number | null
          service_id?: string | null
          suggested_price: number
          time_factor?: number | null
        }
        Update: {
          applied_at?: string | null
          base_price?: number
          competition_factor?: number | null
          confidence_score?: number | null
          created_at?: string | null
          demand_factor?: number | null
          final_price?: number
          id?: string
          is_applied?: boolean | null
          provider_id?: string | null
          seasonality_factor?: number | null
          service_id?: string | null
          suggested_price?: number
          time_factor?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "smart_pricing_provider_id_fkey"
            columns: ["provider_id"]
            isOneToOne: false
            referencedRelation: "service_providers"
            referencedColumns: ["id"]
          },
        ]
      }
      smart_recommendations: {
        Row: {
          clicked_at: string | null
          created_at: string | null
          expires_at: string | null
          id: string
          is_clicked: boolean | null
          item_id: string | null
          item_type: string | null
          metadata: Json | null
          reason: string | null
          recommendation_type: string
          score: number
          user_id: string | null
        }
        Insert: {
          clicked_at?: string | null
          created_at?: string | null
          expires_at?: string | null
          id?: string
          is_clicked?: boolean | null
          item_id?: string | null
          item_type?: string | null
          metadata?: Json | null
          reason?: string | null
          recommendation_type: string
          score: number
          user_id?: string | null
        }
        Update: {
          clicked_at?: string | null
          created_at?: string | null
          expires_at?: string | null
          id?: string
          is_clicked?: boolean | null
          item_id?: string | null
          item_type?: string | null
          metadata?: Json | null
          reason?: string | null
          recommendation_type?: string
          score?: number
          user_id?: string | null
        }
        Relationships: []
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
      subscription_benefits: {
        Row: {
          created_at: string | null
          description: string | null
          icon: string | null
          id: string
          is_active: boolean | null
          plan_id: string | null
          sort_order: number | null
          title: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          icon?: string | null
          id?: string
          is_active?: boolean | null
          plan_id?: string | null
          sort_order?: number | null
          title: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          description?: string | null
          icon?: string | null
          id?: string
          is_active?: boolean | null
          plan_id?: string | null
          sort_order?: number | null
          title?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "subscription_benefits_plan_id_fkey"
            columns: ["plan_id"]
            isOneToOne: false
            referencedRelation: "subscription_plans"
            referencedColumns: ["id"]
          },
        ]
      }
      subscription_payments: {
        Row: {
          amount: number
          created_at: string | null
          currency: string | null
          id: string
          payment_date: string | null
          payment_method_id: string | null
          payment_method_name: string | null
          status: string
          subscription_id: string | null
          transaction_id: string | null
          updated_at: string | null
        }
        Insert: {
          amount: number
          created_at?: string | null
          currency?: string | null
          id?: string
          payment_date?: string | null
          payment_method_id?: string | null
          payment_method_name?: string | null
          status?: string
          subscription_id?: string | null
          transaction_id?: string | null
          updated_at?: string | null
        }
        Update: {
          amount?: number
          created_at?: string | null
          currency?: string | null
          id?: string
          payment_date?: string | null
          payment_method_id?: string | null
          payment_method_name?: string | null
          status?: string
          subscription_id?: string | null
          transaction_id?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "subscription_payments_subscription_id_fkey"
            columns: ["subscription_id"]
            isOneToOne: false
            referencedRelation: "user_subscriptions"
            referencedColumns: ["id"]
          },
        ]
      }
      subscription_plans: {
        Row: {
          created_at: string | null
          description: string | null
          duration_months: number
          features: Json | null
          id: string
          is_active: boolean | null
          name: string
          price_awg: number
          price_florins: number
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          duration_months: number
          features?: Json | null
          id?: string
          is_active?: boolean | null
          name: string
          price_awg: number
          price_florins: number
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          description?: string | null
          duration_months?: number
          features?: Json | null
          id?: string
          is_active?: boolean | null
          name?: string
          price_awg?: number
          price_florins?: number
          updated_at?: string | null
        }
        Relationships: []
      }
      subscriptions: {
        Row: {
          auto_renew: boolean | null
          created_at: string | null
          end_date: string | null
          id: string
          plan_id: string
          start_date: string | null
          status: string | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          auto_renew?: boolean | null
          created_at?: string | null
          end_date?: string | null
          id?: string
          plan_id: string
          start_date?: string | null
          status?: string | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          auto_renew?: boolean | null
          created_at?: string | null
          end_date?: string | null
          id?: string
          plan_id?: string
          start_date?: string | null
          status?: string | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "subscriptions_plan_id_fkey"
            columns: ["plan_id"]
            isOneToOne: false
            referencedRelation: "payment_plans"
            referencedColumns: ["id"]
          },
        ]
      }
      taxi_rides: {
        Row: {
          actual_distance: number | null
          actual_duration: number | null
          actual_fare: number | null
          assigned_at: string | null
          cancellation_reason: string | null
          cancelled_at: string | null
          completed_at: string | null
          created_at: string | null
          currency: string | null
          driver_id: string | null
          dropoff_location: Json
          estimated_distance: number | null
          estimated_duration: number | null
          estimated_fare: number
          id: string
          notes: string | null
          payment_method_id: string | null
          picked_up_at: string | null
          pickup_location: Json
          requested_at: string | null
          ride_type: string | null
          scheduled_for: string | null
          status: string | null
          user_id: string | null
        }
        Insert: {
          actual_distance?: number | null
          actual_duration?: number | null
          actual_fare?: number | null
          assigned_at?: string | null
          cancellation_reason?: string | null
          cancelled_at?: string | null
          completed_at?: string | null
          created_at?: string | null
          currency?: string | null
          driver_id?: string | null
          dropoff_location: Json
          estimated_distance?: number | null
          estimated_duration?: number | null
          estimated_fare: number
          id?: string
          notes?: string | null
          payment_method_id?: string | null
          picked_up_at?: string | null
          pickup_location: Json
          requested_at?: string | null
          ride_type?: string | null
          scheduled_for?: string | null
          status?: string | null
          user_id?: string | null
        }
        Update: {
          actual_distance?: number | null
          actual_duration?: number | null
          actual_fare?: number | null
          assigned_at?: string | null
          cancellation_reason?: string | null
          cancelled_at?: string | null
          completed_at?: string | null
          created_at?: string | null
          currency?: string | null
          driver_id?: string | null
          dropoff_location?: Json
          estimated_distance?: number | null
          estimated_duration?: number | null
          estimated_fare?: number
          id?: string
          notes?: string | null
          payment_method_id?: string | null
          picked_up_at?: string | null
          pickup_location?: Json
          requested_at?: string | null
          ride_type?: string | null
          scheduled_for?: string | null
          status?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      ticket_usage_logs: {
        Row: {
          action: string
          created_at: string | null
          details: Json | null
          id: string
          performed_by: string | null
          ticket_id: string | null
        }
        Insert: {
          action: string
          created_at?: string | null
          details?: Json | null
          id?: string
          performed_by?: string | null
          ticket_id?: string | null
        }
        Update: {
          action?: string
          created_at?: string | null
          details?: Json | null
          id?: string
          performed_by?: string | null
          ticket_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "ticket_usage_logs_ticket_id_fkey"
            columns: ["ticket_id"]
            isOneToOne: false
            referencedRelation: "tickets"
            referencedColumns: ["id"]
          },
        ]
      }
      tickets: {
        Row: {
          created_at: string | null
          event_id: string | null
          expires_at: string | null
          id: string
          payment_method_id: string | null
          purchase_date: string | null
          qr_code: string | null
          qr_code_data: string | null
          quantity: number
          seat_info: string | null
          status: string
          ticket_number: string
          total_amount: number
          unit_price: number
          updated_at: string | null
          used_date: string | null
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          event_id?: string | null
          expires_at?: string | null
          id?: string
          payment_method_id?: string | null
          purchase_date?: string | null
          qr_code?: string | null
          qr_code_data?: string | null
          quantity?: number
          seat_info?: string | null
          status?: string
          ticket_number: string
          total_amount: number
          unit_price: number
          updated_at?: string | null
          used_date?: string | null
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          event_id?: string | null
          expires_at?: string | null
          id?: string
          payment_method_id?: string | null
          purchase_date?: string | null
          qr_code?: string | null
          qr_code_data?: string | null
          quantity?: number
          seat_info?: string | null
          status?: string
          ticket_number?: string
          total_amount?: number
          unit_price?: number
          updated_at?: string | null
          used_date?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "tickets_event_id_fkey"
            columns: ["event_id"]
            isOneToOne: false
            referencedRelation: "events"
            referencedColumns: ["id"]
          },
        ]
      }
      transactions: {
        Row: {
          amount: number
          booking_id: string | null
          cause_id: string | null
          created_at: string | null
          currency: string | null
          description: string
          id: string
          provider_id: string | null
          reference: string | null
          status: string | null
          type: string
          updated_at: string | null
          user_id: string
        }
        Insert: {
          amount: number
          booking_id?: string | null
          cause_id?: string | null
          created_at?: string | null
          currency?: string | null
          description: string
          id?: string
          provider_id?: string | null
          reference?: string | null
          status?: string | null
          type: string
          updated_at?: string | null
          user_id: string
        }
        Update: {
          amount?: number
          booking_id?: string | null
          cause_id?: string | null
          created_at?: string | null
          currency?: string | null
          description?: string
          id?: string
          provider_id?: string | null
          reference?: string | null
          status?: string | null
          type?: string
          updated_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "transactions_booking_id_fkey"
            columns: ["booking_id"]
            isOneToOne: false
            referencedRelation: "bookings"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "transactions_cause_id_fkey"
            columns: ["cause_id"]
            isOneToOne: false
            referencedRelation: "causes"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "transactions_provider_id_fkey"
            columns: ["provider_id"]
            isOneToOne: false
            referencedRelation: "service_providers"
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
      user_analytics: {
        Row: {
          average_rating: number | null
          created_at: string
          favorite_categories: string[] | null
          id: string
          last_booking_date: string | null
          search_history: string[] | null
          total_bookings: number
          total_spent: number
          updated_at: string
          user_id: string | null
        }
        Insert: {
          average_rating?: number | null
          created_at?: string
          favorite_categories?: string[] | null
          id?: string
          last_booking_date?: string | null
          search_history?: string[] | null
          total_bookings?: number
          total_spent?: number
          updated_at?: string
          user_id?: string | null
        }
        Update: {
          average_rating?: number | null
          created_at?: string
          favorite_categories?: string[] | null
          id?: string
          last_booking_date?: string | null
          search_history?: string[] | null
          total_bookings?: number
          total_spent?: number
          updated_at?: string
          user_id?: string | null
        }
        Relationships: []
      }
      user_behavior_analytics: {
        Row: {
          event_data: Json
          event_type: string
          id: string
          ip_address: unknown | null
          location: Json | null
          page_url: string | null
          referrer: string | null
          session_id: string | null
          timestamp: string | null
          user_agent: string | null
          user_id: string | null
        }
        Insert: {
          event_data: Json
          event_type: string
          id?: string
          ip_address?: unknown | null
          location?: Json | null
          page_url?: string | null
          referrer?: string | null
          session_id?: string | null
          timestamp?: string | null
          user_agent?: string | null
          user_id?: string | null
        }
        Update: {
          event_data?: Json
          event_type?: string
          id?: string
          ip_address?: unknown | null
          location?: Json | null
          page_url?: string | null
          referrer?: string | null
          session_id?: string | null
          timestamp?: string | null
          user_agent?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      user_consents: {
        Row: {
          consent_type: string
          created_at: string | null
          expires_at: string | null
          granted: boolean
          granted_at: string | null
          id: string
          ip_address: unknown | null
          revoked_at: string | null
          user_agent: string | null
          user_id: string
          version: string
        }
        Insert: {
          consent_type: string
          created_at?: string | null
          expires_at?: string | null
          granted: boolean
          granted_at?: string | null
          id?: string
          ip_address?: unknown | null
          revoked_at?: string | null
          user_agent?: string | null
          user_id: string
          version: string
        }
        Update: {
          consent_type?: string
          created_at?: string | null
          expires_at?: string | null
          granted?: boolean
          granted_at?: string | null
          id?: string
          ip_address?: unknown | null
          revoked_at?: string | null
          user_agent?: string | null
          user_id?: string
          version?: string
        }
        Relationships: []
      }
      user_loyalty_accounts: {
        Row: {
          created_at: string | null
          current_level_id: string | null
          id: string
          is_active: boolean | null
          joined_date: string | null
          last_activity: string | null
          points: number | null
          program_id: string | null
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          current_level_id?: string | null
          id?: string
          is_active?: boolean | null
          joined_date?: string | null
          last_activity?: string | null
          points?: number | null
          program_id?: string | null
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          current_level_id?: string | null
          id?: string
          is_active?: boolean | null
          joined_date?: string | null
          last_activity?: string | null
          points?: number | null
          program_id?: string | null
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "user_loyalty_accounts_current_level_id_fkey"
            columns: ["current_level_id"]
            isOneToOne: false
            referencedRelation: "program_levels"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "user_loyalty_accounts_program_id_fkey"
            columns: ["program_id"]
            isOneToOne: false
            referencedRelation: "loyalty_programs"
            referencedColumns: ["id"]
          },
        ]
      }
      user_notification_settings: {
        Row: {
          app_updates: boolean | null
          booking_reminders: boolean | null
          created_at: string | null
          email_notifications: boolean | null
          id: string
          new_providers: boolean | null
          payment_alerts: boolean | null
          promotions: boolean | null
          push_notifications: boolean | null
          sms_notifications: boolean | null
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          app_updates?: boolean | null
          booking_reminders?: boolean | null
          created_at?: string | null
          email_notifications?: boolean | null
          id?: string
          new_providers?: boolean | null
          payment_alerts?: boolean | null
          promotions?: boolean | null
          push_notifications?: boolean | null
          sms_notifications?: boolean | null
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          app_updates?: boolean | null
          booking_reminders?: boolean | null
          created_at?: string | null
          email_notifications?: boolean | null
          id?: string
          new_providers?: boolean | null
          payment_alerts?: boolean | null
          promotions?: boolean | null
          push_notifications?: boolean | null
          sms_notifications?: boolean | null
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "user_notification_settings_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: true
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      user_photos: {
        Row: {
          created_at: string | null
          file_size: number | null
          file_type: string | null
          id: string
          listing_id: string | null
          photo_uri: string
          updated_at: string | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          file_size?: number | null
          file_type?: string | null
          id?: string
          listing_id?: string | null
          photo_uri: string
          updated_at?: string | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          file_size?: number | null
          file_type?: string | null
          id?: string
          listing_id?: string | null
          photo_uri?: string
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      user_qr_codes: {
        Row: {
          created_at: string | null
          expires_at: string | null
          id: string
          is_active: boolean | null
          last_used_at: string | null
          qr_code: string
          qr_data: Json
          qr_type_id: string | null
          updated_at: string | null
          usage_count: number | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          expires_at?: string | null
          id?: string
          is_active?: boolean | null
          last_used_at?: string | null
          qr_code: string
          qr_data: Json
          qr_type_id?: string | null
          updated_at?: string | null
          usage_count?: number | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          expires_at?: string | null
          id?: string
          is_active?: boolean | null
          last_used_at?: string | null
          qr_code?: string
          qr_data?: Json
          qr_type_id?: string | null
          updated_at?: string | null
          usage_count?: number | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_qr_codes_qr_type_id_fkey"
            columns: ["qr_type_id"]
            isOneToOne: false
            referencedRelation: "qr_code_types"
            referencedColumns: ["id"]
          },
        ]
      }
      user_referrals: {
        Row: {
          completed_at: string | null
          created_at: string | null
          currency: string | null
          first_transaction_id: string | null
          id: string
          invite_code: string
          invite_code_id: string | null
          referred_at: string | null
          referred_id: string
          referrer_id: string
          reward_amount: number | null
          status: string
          updated_at: string | null
        }
        Insert: {
          completed_at?: string | null
          created_at?: string | null
          currency?: string | null
          first_transaction_id?: string | null
          id?: string
          invite_code: string
          invite_code_id?: string | null
          referred_at?: string | null
          referred_id: string
          referrer_id: string
          reward_amount?: number | null
          status?: string
          updated_at?: string | null
        }
        Update: {
          completed_at?: string | null
          created_at?: string | null
          currency?: string | null
          first_transaction_id?: string | null
          id?: string
          invite_code?: string
          invite_code_id?: string | null
          referred_at?: string | null
          referred_id?: string
          referrer_id?: string
          reward_amount?: number | null
          status?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "user_referrals_invite_code_id_fkey"
            columns: ["invite_code_id"]
            isOneToOne: false
            referencedRelation: "invite_codes"
            referencedColumns: ["id"]
          },
        ]
      }
      user_rewards: {
        Row: {
          created_at: string | null
          expiry_date: string | null
          id: string
          points_spent: number
          redeemed_at: string | null
          reward_id: string | null
          status: string
          updated_at: string | null
          used_at: string | null
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          expiry_date?: string | null
          id?: string
          points_spent: number
          redeemed_at?: string | null
          reward_id?: string | null
          status?: string
          updated_at?: string | null
          used_at?: string | null
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          expiry_date?: string | null
          id?: string
          points_spent?: number
          redeemed_at?: string | null
          reward_id?: string | null
          status?: string
          updated_at?: string | null
          used_at?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "user_rewards_reward_id_fkey"
            columns: ["reward_id"]
            isOneToOne: false
            referencedRelation: "rewards_catalog"
            referencedColumns: ["id"]
          },
        ]
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
      user_security_settings: {
        Row: {
          app_lock: boolean | null
          biometric_login: boolean | null
          created_at: string | null
          id: string
          two_factor_auth: boolean | null
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          app_lock?: boolean | null
          biometric_login?: boolean | null
          created_at?: string | null
          id?: string
          two_factor_auth?: boolean | null
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          app_lock?: boolean | null
          biometric_login?: boolean | null
          created_at?: string | null
          id?: string
          two_factor_auth?: boolean | null
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "user_security_settings_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: true
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      user_streaks: {
        Row: {
          created_at: string | null
          current_streak: number | null
          id: string
          last_activity_date: string | null
          longest_streak: number | null
          streak_type: string | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          current_streak?: number | null
          id?: string
          last_activity_date?: string | null
          longest_streak?: number | null
          streak_type?: string | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          current_streak?: number | null
          id?: string
          last_activity_date?: string | null
          longest_streak?: number | null
          streak_type?: string | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      user_subscriptions: {
        Row: {
          auto_renew: boolean | null
          created_at: string | null
          currency: string | null
          end_date: string | null
          id: string
          last_payment_date: string | null
          next_payment_date: string | null
          payment_method_id: string | null
          payment_method_name: string | null
          plan_id: string | null
          start_date: string | null
          status: string
          total_payments: number | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          auto_renew?: boolean | null
          created_at?: string | null
          currency?: string | null
          end_date?: string | null
          id?: string
          last_payment_date?: string | null
          next_payment_date?: string | null
          payment_method_id?: string | null
          payment_method_name?: string | null
          plan_id?: string | null
          start_date?: string | null
          status?: string
          total_payments?: number | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          auto_renew?: boolean | null
          created_at?: string | null
          currency?: string | null
          end_date?: string | null
          id?: string
          last_payment_date?: string | null
          next_payment_date?: string | null
          payment_method_id?: string | null
          payment_method_name?: string | null
          plan_id?: string | null
          start_date?: string | null
          status?: string
          total_payments?: number | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_subscriptions_plan_id_fkey"
            columns: ["plan_id"]
            isOneToOne: false
            referencedRelation: "subscription_plans"
            referencedColumns: ["id"]
          },
        ]
      }
      users: {
        Row: {
          address: string | null
          avatar: string | null
          bio: string | null
          created_at: string | null
          currency: string | null
          dob: string | null
          email: string
          full_name: string | null
          id: string
          is_service_provider: boolean | null
          is_verified: boolean | null
          language: string | null
          last_login_at: string | null
          loyalty_points: number | null
          name: string
          payment_methods: string[] | null
          phone: string | null
          saved_providers: string[] | null
          updated_at: string | null
          user_type: string | null
          wallet_balance: number | null
          wallet_id: string | null
        }
        Insert: {
          address?: string | null
          avatar?: string | null
          bio?: string | null
          created_at?: string | null
          currency?: string | null
          dob?: string | null
          email: string
          full_name?: string | null
          id?: string
          is_service_provider?: boolean | null
          is_verified?: boolean | null
          language?: string | null
          last_login_at?: string | null
          loyalty_points?: number | null
          name: string
          payment_methods?: string[] | null
          phone?: string | null
          saved_providers?: string[] | null
          updated_at?: string | null
          user_type?: string | null
          wallet_balance?: number | null
          wallet_id?: string | null
        }
        Update: {
          address?: string | null
          avatar?: string | null
          bio?: string | null
          created_at?: string | null
          currency?: string | null
          dob?: string | null
          email?: string
          full_name?: string | null
          id?: string
          is_service_provider?: boolean | null
          is_verified?: boolean | null
          language?: string | null
          last_login_at?: string | null
          loyalty_points?: number | null
          name?: string
          payment_methods?: string[] | null
          phone?: string | null
          saved_providers?: string[] | null
          updated_at?: string | null
          user_type?: string | null
          wallet_balance?: number | null
          wallet_id?: string | null
        }
        Relationships: []
      }
      wallets: {
        Row: {
          balance: number | null
          created_at: string | null
          currency: string | null
          id: string
          is_active: boolean | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          balance?: number | null
          created_at?: string | null
          currency?: string | null
          id?: string
          is_active?: boolean | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          balance?: number | null
          created_at?: string | null
          currency?: string | null
          id?: string
          is_active?: boolean | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      analyze_sentiment: {
        Args: { p_text: string }
        Returns: Json
      }
      assign_admin_by_email: {
        Args: { target_email: string }
        Returns: undefined
      }
      assign_role: {
        Args: { user_id: string; role_name: string }
        Returns: undefined
      }
      calculate_invoice_totals: {
        Args: { invoice_uuid: string }
        Returns: undefined
      }
      calculate_next_payment_date: {
        Args: { last_payment_date: string; billing_cycle: string }
        Returns: string
      }
      calculate_subscription_end_date: {
        Args: { start_date: string; billing_cycle: string }
        Returns: string
      }
      calculate_user_tier: {
        Args: { user_points: number }
        Returns: string
      }
      check_fraud_risk: {
        Args: { p_user_id: string; p_action_type: string; p_data: Json }
        Returns: Json
      }
      clean_expired_cache: {
        Args: Record<PropertyKey, never>
        Returns: number
      }
      expire_points: {
        Args: Record<PropertyKey, never>
        Returns: undefined
      }
      generate_daily_analytics_report: {
        Args: Record<PropertyKey, never>
        Returns: undefined
      }
      generate_invite_code: {
        Args: Record<PropertyKey, never>
        Returns: string
      }
      generate_invoice_number: {
        Args: Record<PropertyKey, never>
        Returns: string
      }
      generate_receipt_number: {
        Args: Record<PropertyKey, never>
        Returns: string
      }
      generate_recommendations: {
        Args: {
          p_user_id: string
          p_recommendation_type: string
          p_limit?: number
        }
        Returns: {
          item_id: string
          item_type: string
          score: number
          reason: string
        }[]
      }
      generate_ticket_number: {
        Args: { event_id: string }
        Returns: string
      }
      generate_unique_qr_code: {
        Args: Record<PropertyKey, never>
        Returns: string
      }
      get_cache_statistics: {
        Args: Record<PropertyKey, never>
        Returns: Json
      }
      get_or_create_conversation: {
        Args: {
          p_customer_id: string
          p_provider_id: string
          p_booking_id?: string
        }
        Returns: string
      }
      get_performance_summary: {
        Args: { hours_back?: number }
        Returns: Json
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
      increment_listing_inquiries: {
        Args: { listing_id: string }
        Returns: undefined
      }
      increment_listing_views: {
        Args: { listing_id: string }
        Returns: undefined
      }
      is_admin: {
        Args: Record<PropertyKey, never>
        Returns: boolean
      }
      log_security_event: {
        Args: {
          event_type: string
          user_id_param?: string
          description_param?: string
          metadata_param?: Json
        }
        Returns: undefined
      }
      mark_messages_as_read: {
        Args: { p_conversation_id: string; p_user_id: string }
        Returns: number
      }
      predict_demand: {
        Args: { p_service_category: string; p_location: string; p_date: string }
        Returns: Json
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
      send_booking_notification: {
        Args: { p_user_id: string; p_booking_id: string; p_action: string }
        Returns: string
      }
      send_message: {
        Args: {
          p_conversation_id: string
          p_sender_id: string
          p_sender_type: string
          p_sender_name: string
          p_content: string
          p_message_type?: string
          p_media_url?: string
        }
        Returns: string
      }
      send_notification: {
        Args: {
          p_user_id: string
          p_type: string
          p_title: string
          p_message: string
          p_data?: Json
        }
        Returns: string
      }
      send_payment_notification: {
        Args: {
          p_user_id: string
          p_transaction_id: string
          p_amount: number
          p_status: string
        }
        Returns: string
      }
      suggest_optimal_pricing: {
        Args: {
          p_provider_id: string
          p_service_id: string
          p_base_price: number
        }
        Returns: Json
      }
      transfer_money: {
        Args: {
          sender_id: string
          recipient_id: string
          transfer_amount: number
          transfer_description: string
        }
        Returns: undefined
      }
      update_category_analytics: {
        Args: { category_uuid: string }
        Returns: undefined
      }
      update_provider_analytics: {
        Args: { provider_uuid: string }
        Returns: undefined
      }
      update_user_analytics: {
        Args: { user_uuid: string }
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
