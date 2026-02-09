/**
 * Types génériques multi-secteurs pour le système GTBP
 * Generic multi-sector types for GTBP system
 */

// Types de secteurs supportés
export type BusinessSector =
  | 'automotive'
  | 'healthcare'
  | 'construction'
  | 'retail'
  | 'services'
  | 'manufacturing'
  | 'consulting'
  | 'education'
  | 'restaurant'
  | 'technology'

// Interface de base pour les entités multi-secteurs
export interface BaseEntity {
  id: string
  user_id: string
  sector: BusinessSector
  created_at: string
  updated_at: string
}

// Champs personnalisés dynamiques
export interface CustomField {
  id: string
  name: string
  type: 'text' | 'number' | 'date' | 'boolean' | 'select' | 'email' | 'phone'
  required: boolean
  options?: string[] // Pour les champs de type select
  validation?: {
    min?: number
    max?: number
    pattern?: string
  }
  sector: BusinessSector
  entity_type: 'document' | 'client' | 'product' | 'service'
}

// Valeur d'un champ personnalisé
export interface CustomFieldValue {
  id?: string
  field_id: string
  value: string | number | boolean | Date
  entity_id: string
  created_at?: string
}

// Client multi-secteur
export interface MultiSectorClient extends BaseEntity {
  type: 'client'
  name: string
  email?: string
  phone?: string
  address?: string
  city?: string
  country?: string
  postal_code?: string
  custom_fields?: CustomFieldValue[]

  // Champs spécifiques par secteur
  sector_data?: {
    automotive?: {
      license_plate?: string
      vin_number?: string
      vehicle_type?: string
      make?: string
      model?: string
      year?: number
    }
    healthcare?: {
      rpps_number?: string
      specialty?: string
      establishment?: string
      department?: string
    }
    construction?: {
      siret?: string
      company_type?: string
      tax_id?: string
    }
    retail?: {
      store_type?: string
      franchise?: boolean
      chain_name?: string
    }
    services?: {
      service_category?: string
      certification?: string
      registration_number?: string
    }
  }
}

// Document multi-secteur
export interface MultiSectorDocument extends BaseEntity {
  type: 'document'
  document_type: 'invoice' | 'quote' | 'delivery_note' | 'purchase_order' | 'receipt' | 'work_order'
  document_number: string
  client_id: string
  status: 'draft' | 'sent' | 'accepted' | 'paid' | 'overdue' | 'cancelled'
  issue_date: string
  due_date?: string
  notes?: string
  subtotal: number
  tax_amount: number
  total_amount: number
  payment_method?: string
  paid_date?: string
  pdf_url?: string

  // Items du document
  items: MultiSectorDocumentItem[]

  // Champs personnalisés
  custom_fields?: CustomFieldValue[]

  // Données spécifiques au secteur
  sector_data?: {
    automotive?: {
      vehicle_id?: string
      service_type?: string
      labor_hours?: number
      parts_used?: string[]
    }
    healthcare?: {
      patient_id?: string
      consultation_type?: string
      practitioner_id?: string
      insurance_number?: string
    }
    construction?: {
      project_id?: string
      site_address?: string
      permit_number?: string
      completion_date?: string
    }
    retail?: {
      order_id?: string
      delivery_method?: string
      tracking_number?: string
    }
    services?: {
      service_date?: string
      duration?: number
      location?: string
      materials_used?: string[]
    }
  }
}

// Item de document multi-secteur
export interface MultiSectorDocumentItem {
  id: string
  document_id: string
  product_id?: string
  service_id?: string
  description: string
  quantity: number
  unit_price: number
  total_price: number
  tax_rate?: number

  // Champs spécifiques
  sector_data?: {
    automotive?: {
      part_number?: string
      brand?: string
      warranty?: boolean
    }
    healthcare?: {
      medication_code?: string
      dosage?: string
      prescription_required?: boolean
    }
    construction?: {
      material_code?: string
      unit_of_measure?: string
      supplier?: string
    }
    retail?: {
      sku?: string
      barcode?: string
      category?: string
    }
    services?: {
      hourly_rate?: boolean
      expertise_level?: string
      certification_required?: boolean
    }
  }
}

// Produit/Service multi-secteur
export interface MultiSectorProduct extends BaseEntity {
  type: 'product' | 'service'
  name: string
  description?: string
  sku?: string
  barcode?: string
  selling_price: number
  cost_price?: number
  stock_quantity?: number
  min_stock?: number
  category?: string
  supplier?: string
  tax_rate?: number

  // Champs personnalisés
  custom_fields?: CustomFieldValue[]

  // Données spécifiques au secteur
  sector_data?: {
    automotive?: {
      compatibility?: string[]
      oem_number?: string
      category?: 'engine' | 'brakes' | 'suspension' | 'electronics' | 'body'
    }
    healthcare?: {
      medical_code?: string
      classification?: string
      storage_requirements?: string
      expiration_date?: string
    }
    construction?: {
      material_type?: string
      dimensions?: string
      weight?: number
      safety_rating?: string
    }
    retail?: {
      brand?: string
      size?: string
      color?: string
      seasonal?: boolean
    }
    services?: {
      duration?: number
      certification_required?: boolean
      skill_level?: string
      equipment_needed?: string[]
    }
  }
}

// Configuration des champs par secteur
export interface SectorConfig {
  sector: BusinessSector
  name: string
  icon: string
  color: string
  custom_fields: CustomField[]
  document_types: string[]
  product_categories: string[]
  client_fields: string[]
  reporting_metrics: string[]
}

// Types pour le moteur de schéma dynamique
export interface SchemaDefinition {
  entity_type: 'document' | 'client' | 'product' | 'service'
  sector: BusinessSector
  base_fields: Record<string, { type: string; required: boolean }>
  custom_fields: CustomField[]
  validation_rules: Record<string, {
    required: boolean
    type: string
    validation?: CustomField['validation'] | undefined
    options?: string[] | undefined
  }>
}

// Types pour les notifications multi-secteurs
export interface MultiSectorNotification {
  id: string
  user_id: string
  sector: BusinessSector
  type: 'stock_alert' | 'payment_due' | 'appointment' | 'deadline' | 'system'
  title: string
  message: string
  priority: 'low' | 'medium' | 'high' | 'urgent'
  read: boolean
  created_at: string
  action_url?: string
  metadata?: Record<string, string | number | boolean | null>
}

// Types pour l'export multi-secteurs
export interface ExportTemplate {
  id: string
  name: string
  sector: BusinessSector
  document_type: string
  template_html: string
  css_styles: string
  logo_url?: string
  footer_text?: string
  custom_fields_layout?: Record<string, string | number | boolean | null>
}
