/**
 * Types pour le système de gestion de documents
 * Types for the document management system
 */

// Types de documents supportés
export type DocumentType = 'invoice' | 'quote' | 'delivery_note' | 'po' | 'reminder' | 'receipt'

// Statuts de documents
export type DocumentStatus = 'draft' | 'sent' | 'accepted' | 'paid' | 'overdue' | 'cancelled'

// Interface pour les options de génération PDF
export interface PDFGenerationOptions {
  template?: DocumentTemplate
  include_qr_code?: boolean
  include_payment_info?: boolean
  language?: 'fr' | 'de' | 'en' | 'it'
}

// Interface pour les lignes du formulaire
export interface DocumentItemFormData {
  id?: string | undefined
  description: string
  quantity: number
  unit_price: number
  tax_rate: number
}// Interface pour un document
export interface Document {
  id: string
  user_id: string
  client_id?: string | undefined
  type: DocumentType
  document_number: string
  status: DocumentStatus
  issue_date: string
  due_date?: string | undefined
  notes?: string | undefined
  subtotal: number
  tax_amount: number
  total_amount: number
  payment_method?: string | undefined
  paid_date?: string | undefined
  pdf_url?: string | undefined
  created_at: string
  updated_at: string
  client?: Client | undefined
  items?: DocumentItem[] | undefined
}

export interface DocumentItem {
  id: string
  document_id: string
  description: string
  quantity: number
  unit_price: number
  tax_rate: number
  total_amount: number
  created_at: string
}

export interface DocumentTemplate {
  id: string
  user_id: string
  name: string
  type: Document['type']
  company_name: string
  company_logo_url?: string | undefined
  company_address: string
  company_phone: string
  company_email: string
  footer_text: string
  terms_conditions?: string | undefined
  color_scheme: string
  created_at: string
}



export interface DocumentFilters {
  type?: Document['type']
  status?: Document['status']
  client_id?: string
  date_from?: string
  date_to?: string
  search?: string
}

// Interface pour la pagination
export interface Pagination {
  page: number
  limit: number
  total: number
  totalPages: number
}

// Interface pour le tri
export interface SortOption {
  field: 'document_number' | 'type' | 'issue_date' | 'total_amount' | 'status' | 'client_name'
  direction: 'asc' | 'desc'
}

// Interface pour le formulaire de document
export interface DocumentFormData {
  type: Document['type']
  client_id?: string | undefined
  document_number: string
  issue_date: string
  due_date?: string | undefined
  notes?: string | undefined
  items: DocumentItemFormData[]
  template_id?: string | undefined
}

// Vue résumée des documents
export interface DocumentSummary {
  id: string
  type: Document['type']
  document_number: string
  status: Document['status']
  issue_date: string
  due_date?: string | undefined
  total_amount: number
  client_name?: string | undefined
  client_email?: string | undefined
  item_count?: number | undefined
}

// Interface pour un client (référence)
export interface Client {
  id: string
  name: string
  email?: string | undefined
  phone?: string | undefined
  address?: string | undefined
  city?: string | undefined
  country?: string | undefined
  postal_code?: string | undefined
}
