export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export type Database = {
  __InternalSupabase: { PostgrestVersion: "14.5" };
  public: {
    Tables: {
      inquiries: {
        Row: {
          created_at: string;
          customer_notified_at: string | null;
          email: string;
          id: string;
          inquiry_type: string;
          message: string;
          name: string;
          owner_notified_at: string | null;
          phone: string | null;
          status: string;
          updated_at: string;
          user_id: string;
        };
        Insert: {
          created_at?: string;
          customer_notified_at?: string | null;
          email: string;
          id?: string;
          inquiry_type: string;
          message: string;
          name: string;
          owner_notified_at?: string | null;
          phone?: string | null;
          status?: string;
          updated_at?: string;
          user_id: string;
        };
        Update: {
          created_at?: string;
          customer_notified_at?: string | null;
          email?: string;
          id?: string;
          inquiry_type?: string;
          message?: string;
          name?: string;
          owner_notified_at?: string | null;
          phone?: string | null;
          status?: string;
          updated_at?: string;
          user_id?: string;
        };
        Relationships: [];
      };
      inventory_items: {
        Row: {
          availability: string;
          created_at: string;
          description: string;
          family: string;
          id: string;
          image_url: string | null;
          live_arrival_placeholder: string;
          minimum_order: number;
          name: string;
          payment_placeholder: string;
          price: number;
          quantity: number;
          shipping_placeholder: string;
          sort_order: number;
          updated_at: string;
        };
        Insert: {
          availability?: string;
          created_at?: string;
          description?: string;
          family: string;
          id?: string;
          image_url?: string | null;
          live_arrival_placeholder?: string;
          minimum_order?: number;
          name: string;
          payment_placeholder?: string;
          price?: number;
          quantity?: number;
          shipping_placeholder?: string;
          sort_order?: number;
          updated_at?: string;
        };
        Update: {
          availability?: string;
          created_at?: string;
          description?: string;
          family?: string;
          id?: string;
          image_url?: string | null;
          live_arrival_placeholder?: string;
          minimum_order?: number;
          name?: string;
          payment_placeholder?: string;
          price?: number;
          quantity?: number;
          shipping_placeholder?: string;
          sort_order?: number;
          updated_at?: string;
        };
        Relationships: [];
      };
      livestock_requests: {
        Row: {
          created_at: string;
          customer_notified_at: string | null;
          email: string;
          id: string;
          inventory_item_id: string | null;
          name: string;
          notes: string | null;
          owner_notified_at: string | null;
          phone: string | null;
          quantity: number | null;
          selected_line: string | null;
          shipping_location: string | null;
          species: string;
          status: string;
          updated_at: string;
          user_id: string;
        };
        Insert: {
          created_at?: string;
          customer_notified_at?: string | null;
          email: string;
          id?: string;
          inventory_item_id?: string | null;
          name: string;
          notes?: string | null;
          owner_notified_at?: string | null;
          phone?: string | null;
          quantity?: number | null;
          selected_line?: string | null;
          shipping_location?: string | null;
          species: string;
          status?: string;
          updated_at?: string;
          user_id: string;
        };
        Update: {
          created_at?: string;
          customer_notified_at?: string | null;
          email?: string;
          id?: string;
          inventory_item_id?: string | null;
          name?: string;
          notes?: string | null;
          owner_notified_at?: string | null;
          phone?: string | null;
          quantity?: number | null;
          selected_line?: string | null;
          shipping_location?: string | null;
          species?: string;
          status?: string;
          updated_at?: string;
          user_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: "livestock_requests_inventory_item_id_fkey";
            columns: ["inventory_item_id"];
            isOneToOne: false;
            referencedRelation: "inventory_items";
            referencedColumns: ["id"];
          },
        ];
      };
      profiles: {
        Row: {
          address_line_1: string | null;
          address_line_2: string | null;
          city: string | null;
          country: string | null;
          created_at: string;
          full_name: string | null;
          id: string;
          marketing_opt_in: boolean;
          phone: string | null;
          postal_code: string | null;
          role: string;
          state_region: string | null;
          updated_at: string;
        };
        Insert: {
          address_line_1?: string | null;
          address_line_2?: string | null;
          city?: string | null;
          country?: string | null;
          created_at?: string;
          full_name?: string | null;
          id: string;
          marketing_opt_in?: boolean;
          phone?: string | null;
          postal_code?: string | null;
          role?: string;
          state_region?: string | null;
          updated_at?: string;
        };
        Update: {
          address_line_1?: string | null;
          address_line_2?: string | null;
          city?: string | null;
          country?: string | null;
          created_at?: string;
          full_name?: string | null;
          id?: string;
          marketing_opt_in?: boolean;
          phone?: string | null;
          postal_code?: string | null;
          role?: string;
          state_region?: string | null;
          updated_at?: string;
        };
        Relationships: [];
      };
    };
    Views: { [_ in never]: never };
    Functions: { [_ in never]: never };
    Enums: { [_ in never]: never };
    CompositeTypes: { [_ in never]: never };
  };
};
