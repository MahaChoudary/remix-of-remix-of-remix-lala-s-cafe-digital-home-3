export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.5"
  }
  public: {
    Tables: {
      contact_messages: {
        Row: {
          created_at: string
          email: string | null
          id: string
          message: string
          name: string
          phone: string
          status: string
          subject: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          email?: string | null
          id?: string
          message: string
          name: string
          phone: string
          status?: string
          subject: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          email?: string | null
          id?: string
          message?: string
          name?: string
          phone?: string
          status?: string
          subject?: string
          updated_at?: string
        }
        Relationships: []
      }
      events: {
        Row: {
          created_at: string
          description: string
          id: string
          image_url: string | null
          is_published: boolean
          location: string | null
          sort_order: number
          starts_at: string | null
          title: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          description?: string
          id?: string
          image_url?: string | null
          is_published?: boolean
          location?: string | null
          sort_order?: number
          starts_at?: string | null
          title: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          description?: string
          id?: string
          image_url?: string | null
          is_published?: boolean
          location?: string | null
          sort_order?: number
          starts_at?: string | null
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      faqs: {
        Row: {
          answer: string
          created_at: string
          id: string
          is_published: boolean
          question: string
          sort_order: number
          updated_at: string
        }
        Insert: {
          answer: string
          created_at?: string
          id?: string
          is_published?: boolean
          question: string
          sort_order?: number
          updated_at?: string
        }
        Update: {
          answer?: string
          created_at?: string
          id?: string
          is_published?: boolean
          question?: string
          sort_order?: number
          updated_at?: string
        }
        Relationships: []
      }
      gallery_images: {
        Row: {
          alt: string
          caption: string | null
          created_at: string
          id: string
          is_published: boolean
          sort_order: number
          tag: string
          updated_at: string
          url: string
        }
        Insert: {
          alt?: string
          caption?: string | null
          created_at?: string
          id?: string
          is_published?: boolean
          sort_order?: number
          tag?: string
          updated_at?: string
          url: string
        }
        Update: {
          alt?: string
          caption?: string | null
          created_at?: string
          id?: string
          is_published?: boolean
          sort_order?: number
          tag?: string
          updated_at?: string
          url?: string
        }
        Relationships: []
      }
      menu_categories: {
        Row: {
          created_at: string
          description: string | null
          id: string
          is_published: boolean
          name: string
          slug: string
          sort_order: number
          updated_at: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          id: string
          is_published?: boolean
          name: string
          slug: string
          sort_order?: number
          updated_at?: string
        }
        Update: {
          created_at?: string
          description?: string | null
          id?: string
          is_published?: boolean
          name?: string
          slug?: string
          sort_order?: number
          updated_at?: string
        }
        Relationships: []
      }
      menu_items: {
        Row: {
          category_id: string
          created_at: string
          description: string
          id: string
          image_url: string | null
          is_available: boolean
          is_bestseller: boolean
          is_featured: boolean
          is_new: boolean
          is_published: boolean
          moods: string[]
          name: string
          price: number | null
          sort_order: number
          updated_at: string
        }
        Insert: {
          category_id: string
          created_at?: string
          description?: string
          id?: string
          image_url?: string | null
          is_available?: boolean
          is_bestseller?: boolean
          is_featured?: boolean
          is_new?: boolean
          is_published?: boolean
          moods?: string[]
          name: string
          price?: number | null
          sort_order?: number
          updated_at?: string
        }
        Update: {
          category_id?: string
          created_at?: string
          description?: string
          id?: string
          image_url?: string | null
          is_available?: boolean
          is_bestseller?: boolean
          is_featured?: boolean
          is_new?: boolean
          is_published?: boolean
          moods?: string[]
          name?: string
          price?: number | null
          sort_order?: number
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "menu_items_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "menu_categories"
            referencedColumns: ["id"]
          },
        ]
      }
      offers: {
        Row: {
          created_at: string
          description: string
          id: string
          image_url: string | null
          is_active: boolean
          sort_order: number
          terms: string | null
          title: string
          updated_at: string
          valid_until: string | null
        }
        Insert: {
          created_at?: string
          description?: string
          id?: string
          image_url?: string | null
          is_active?: boolean
          sort_order?: number
          terms?: string | null
          title: string
          updated_at?: string
          valid_until?: string | null
        }
        Update: {
          created_at?: string
          description?: string
          id?: string
          image_url?: string | null
          is_active?: boolean
          sort_order?: number
          terms?: string | null
          title?: string
          updated_at?: string
          valid_until?: string | null
        }
        Relationships: []
      }
      private_event_inquiries: {
        Row: {
          created_at: string
          details: string | null
          email: string | null
          event_date: string
          event_type: string
          guests: number
          id: string
          name: string
          phone: string
          status: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          details?: string | null
          email?: string | null
          event_date: string
          event_type: string
          guests: number
          id?: string
          name: string
          phone: string
          status?: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          details?: string | null
          email?: string | null
          event_date?: string
          event_type?: string
          guests?: number
          id?: string
          name?: string
          phone?: string
          status?: string
          updated_at?: string
        }
        Relationships: []
      }
      reservations: {
        Row: {
          created_at: string
          email: string | null
          id: string
          name: string
          notes: string | null
          party_size: number
          phone: string
          reserve_date: string
          reserve_time: string
          seating: string | null
          status: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          email?: string | null
          id?: string
          name: string
          notes?: string | null
          party_size: number
          phone: string
          reserve_date: string
          reserve_time: string
          seating?: string | null
          status?: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          email?: string | null
          id?: string
          name?: string
          notes?: string | null
          party_size?: number
          phone?: string
          reserve_date?: string
          reserve_time?: string
          seating?: string | null
          status?: string
          updated_at?: string
        }
        Relationships: []
      }
      site_settings: {
        Row: {
          address_line: string | null
          cafe_name: string
          city: string
          complaint_phone: string | null
          created_at: string
          email: string | null
          hours: Json
          id: string
          logo_url: string | null
          maps_url: string | null
          order_phones: Json
          phone: string
          socials: Json
          tagline: string
          updated_at: string
          whatsapp: string
        }
        Insert: {
          address_line?: string | null
          cafe_name?: string
          city?: string
          complaint_phone?: string | null
          created_at?: string
          email?: string | null
          hours?: Json
          id?: string
          logo_url?: string | null
          maps_url?: string | null
          order_phones?: Json
          phone?: string
          socials?: Json
          tagline?: string
          updated_at?: string
          whatsapp?: string
        }
        Update: {
          address_line?: string | null
          cafe_name?: string
          city?: string
          complaint_phone?: string | null
          created_at?: string
          email?: string | null
          hours?: Json
          id?: string
          logo_url?: string | null
          maps_url?: string | null
          order_phones?: Json
          phone?: string
          socials?: Json
          tagline?: string
          updated_at?: string
          whatsapp?: string
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          created_at: string
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      claim_admin: { Args: never; Returns: boolean }
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
      is_admin: { Args: never; Returns: boolean }
    }
    Enums: {
      app_role: "admin" | "staff"
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
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never) = never,
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
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never) = never,
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
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never) = never,
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
  EnumName extends (DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never) = never,
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
  CompositeTypeName extends (PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never) = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      app_role: ["admin", "staff"],
    },
  },
} as const
