/**
 * Types Supabase pour l'ERP (schéma public).
 * À régénérer si le schéma change :
 *   npx supabase gen types typescript --project-id <id> > src/types/database.ts
 *
 * Pour l'instant : structure type ERP (clients, factures) pour TypeScript strict.
 */
export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      clients: {
        Row: {
          id: string
          created_at: string
          updated_at: string
          name: string
          email: string | null
          phone: string | null
          address: string | null
        }
        Insert: {
          id?: string
          created_at?: string
          updated_at?: string
          name: string
          email?: string | null
          phone?: string | null
          address?: string | null
        }
        Update: {
          id?: string
          created_at?: string
          updated_at?: string
          name?: string
          email?: string | null
          phone?: string | null
          address?: string | null
        }
      }
      factures: {
        Row: {
          id: string
          created_at: string
          updated_at: string
          client_id: string
          number: string
          status: 'draft' | 'sent' | 'paid'
          total_ht: number
          total_ttc: number
          due_date: string | null
        }
        Insert: {
          id?: string
          created_at?: string
          updated_at?: string
          client_id: string
          number: string
          status?: 'draft' | 'sent' | 'paid'
          total_ht: number
          total_ttc: number
          due_date?: string | null
        }
        Update: {
          id?: string
          created_at?: string
          updated_at?: string
          client_id?: string
          number?: string
          status?: 'draft' | 'sent' | 'paid'
          total_ht?: number
          total_ttc?: number
          due_date?: string | null
        }
      }
      products: {
        Row: {
          id: string
          created_at: string
          updated_at: string
          name: string
          description: string | null
          reference: string | null
          sku: string | null
          cost_price: number
          selling_price: number
          stock_quantity: number
          min_stock_level: number
          max_stock_level: number
          category: string | null
          brand: string | null
          weight: number | null
          dimensions: string | null
          is_active: boolean
        }
        Insert: {
          id?: string
          created_at?: string
          updated_at?: string
          name: string
          description?: string | null
          reference?: string | null
          sku?: string | null
          cost_price: number
          selling_price: number
          stock_quantity?: number
          min_stock_level?: number
          max_stock_level?: number
          category?: string | null
          brand?: string | null
          weight?: number | null
          dimensions?: string | null
          is_active?: boolean
        }
        Update: {
          id?: string
          created_at?: string
          updated_at?: string
          name?: string
          description?: string | null
          reference?: string | null
          sku?: string | null
          cost_price?: number
          selling_price?: number
          stock_quantity?: number
          min_stock_level?: number
          max_stock_level?: number
          category?: string | null
          brand?: string | null
          weight?: number | null
          dimensions?: string | null
          is_active?: boolean
        }
      }
    }
    Views: Record<string, never>
    Functions: Record<string, never>
    Enums: Record<string, never>
  }
}

/** Ligne client (table clients) */
export type ClientRow = Database['public']['Tables']['clients']['Row']
/** Insert client */
export type ClientInsert = Database['public']['Tables']['clients']['Insert']
/** Ligne facture */
export type FactureRow = Database['public']['Tables']['factures']['Row']
/** Insert facture */
export type FactureInsert = Database['public']['Tables']['factures']['Insert']
/** Ligne produit */
export type ProductRow = Database['public']['Tables']['products']['Row']
/** Insert produit */
export type ProductInsert = Database['public']['Tables']['products']['Insert']
