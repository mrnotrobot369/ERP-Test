/**
 * Service pour la gestion des documents
 * Service for document management
 */

import { supabase } from '@/lib/supabase'
import type {
  Document,
  DocumentStatus,
  DocumentTemplate,
  DocumentFormData,
  DocumentFilters,
  Pagination,
  SortOption,
  DocumentSummary,
  Client,
  DocumentItemFormData
} from '../types/document'

class DocumentService {
  /**
   * Récupérer la liste des documents avec filtres et pagination
   * Get documents list with filters and pagination
   */
  async getDocuments(
    filters: DocumentFilters = {},
    pagination: Pagination = { page: 1, limit: 20, total: 0, totalPages: 0 },
    sort: SortOption = { field: 'issue_date', direction: 'desc' }
  ): Promise<{ documents: DocumentSummary[]; pagination: Pagination }> {
    try {
      let query = supabase
        .from('documents')
        .select(`
          id,
          document_number,
          type,
          status,
          total_amount,
          issue_date,
          due_date,
          created_at,
          client_id,
          clients(id, name, email)
        `)
        .order(sort.field, { ascending: sort.direction === 'asc' })

      // Appliquer les filtres
      if (filters.type) {
        query = query.eq('type', filters.type)
      }
      if (filters.status) {
        query = query.eq('status', filters.status)
      }
      if (filters.client_id) {
        query = query.eq('client_id', filters.client_id)
      }
      if (filters.search) {
        query = query.or(`document_number.ilike.%${filters.search}%,clients.name.ilike.%${filters.search}%`)
      }
      if (filters.date_from) {
        query = query.gte('issue_date', filters.date_from)
      }
      if (filters.date_to) {
        query = query.lte('issue_date', filters.date_to)
      }

      // Compter le total pour la pagination
      const { count } = await supabase
        .from('documents')
        .select('*', { count: 'exact', head: true })

      // Appliquer la pagination
      const start = (pagination.page - 1) * pagination.limit
      query = query.range(start, start + pagination.limit - 1)

      const { data, error } = await query

      if (error) throw error

      const documents: DocumentSummary[] = (data || []).map((doc: any) => ({
        id: doc.id,
        type: doc.type,
        document_number: doc.document_number,
        status: doc.status,
        issue_date: doc.issue_date,
        due_date: doc.due_date,
        total_amount: doc.total_amount,
        client_name: doc.clients?.name,
        client_email: doc.clients?.email,
        item_count: 0 // Sera calculé plus tard si nécessaire
      }))

      const totalPages = Math.ceil((count || 0) / pagination.limit)

      return {
        documents,
        pagination: {
          ...pagination,
          total: count || 0,
          totalPages
        }
      }
    } catch (error) {
      console.error('Erreur lors de la récupération des documents:', error)
      throw error
    }
  }

  /**
   * Récupérer un document par son ID avec ses items
   * Get document by ID with items
   */
  async getDocument(id: string): Promise<Document | null> {
    try {
      // Récupérer le document principal avec les relations
      const { data, error } = await (supabase
        .from('documents') as any)
        .select(`
          *,
          clients(id, name, email, phone, address, city, country, postal_code),
          document_items(*)
        `)
        .eq('id', id)
        .single()

      if (error) throw error

      // Transformer les données pour correspondre à l'interface Document
      const document: Document = {
        id: (data as any).id,
        user_id: (data as any).user_id,
        client_id: (data as any).client_id,
        type: (data as any).type,
        document_number: (data as any).document_number,
        status: (data as any).status,
        issue_date: (data as any).issue_date,
        due_date: (data as any).due_date,
        notes: (data as any).notes,
        subtotal: (data as any).subtotal,
        tax_amount: (data as any).tax_amount,
        total_amount: (data as any).total_amount,
        payment_method: (data as any).payment_method,
        paid_date: (data as any).paid_date,
        pdf_url: (data as any).pdf_url,
        created_at: (data as any).created_at,
        updated_at: (data as any).updated_at,
        client: (data as any).clients,
        items: (data as any).document_items || []
      }

      return document
    } catch (error) {
      console.error('Erreur lors de la récupération du document:', error)
      throw error
    }
  }

  /**
   * Créer un nouveau document
   * Create new document
   */
  async createDocument(formData: DocumentFormData): Promise<Document> {
    try {
      // Calculer les totaux
      const subtotal = formData.items.reduce((sum: number, item: DocumentItemFormData) =>
        sum + (item.quantity * item.unit_price), 0
      )
      const taxAmount = formData.items.reduce((sum: number, item: DocumentItemFormData) =>
        sum + (item.quantity * item.unit_price * item.tax_rate / 100), 0
      )
      const totalAmount = subtotal + taxAmount

      // Créer le document principal
      const { data: document, error: documentError } = await (supabase
        .from('documents') as any)
        .insert({
          type: formData.type,
          client_id: formData.client_id,
          document_number: formData.document_number,
          issue_date: formData.issue_date,
          due_date: formData.due_date,
          notes: formData.notes,
          subtotal,
          tax_amount: taxAmount,
          total_amount: totalAmount
        })
        .select()
        .single()

      if (documentError) throw documentError

      // Créer les items du document
      const itemsToInsert = formData.items.map(item => ({
        document_id: document.id,
        description: item.description,
        quantity: item.quantity,
        unit_price: item.unit_price,
        tax_rate: item.tax_rate
      }))

      const { error: itemsError } = await (supabase
        .from('document_items') as any)
        .insert(itemsToInsert)

      if (itemsError) throw itemsError

      // Récupérer le document complet avec ses items
      return await this.getDocument(document.id) as Document
    } catch (error) {
      console.error('Erreur lors de la création du document:', error)
      throw error
    }
  }

  /**
   * Mettre à jour un document existant
   * Update existing document
   */
  async updateDocument(id: string, formData: DocumentFormData): Promise<Document> {
    try {
      // Calculer les totaux
      const subtotal = formData.items.reduce((sum: number, item: DocumentItemFormData) =>
        sum + (item.quantity * item.unit_price), 0
      )
      const taxAmount = formData.items.reduce((sum: number, item: DocumentItemFormData) =>
        sum + (item.quantity * item.unit_price * item.tax_rate / 100), 0
      )
      const totalAmount = subtotal + taxAmount

      // Mettre à jour le document principal
      const { error: documentError } = await (supabase
        .from('documents') as any)
        .update({
          type: formData.type,
          client_id: formData.client_id,
          document_number: formData.document_number,
          issue_date: formData.issue_date,
          due_date: formData.due_date,
          notes: formData.notes,
          subtotal,
          tax_amount: taxAmount,
          total_amount: totalAmount
        })
        .eq('id', id)

      if (documentError) throw documentError

      // Supprimer les anciens items
      const { error: deleteError } = await supabase
        .from('document_items')
        .delete()
        .eq('document_id', id)

      if (deleteError) throw deleteError

      // Insérer les nouveaux items
      const itemsToInsert = formData.items.map(item => ({
        document_id: id,
        description: item.description,
        quantity: item.quantity,
        unit_price: item.unit_price,
        tax_rate: item.tax_rate
      }))

      const { error: insertError } = await (supabase
        .from('document_items') as any)
        .insert(itemsToInsert)

      if (insertError) throw insertError

      // Récupérer le document mis à jour
      return await this.getDocument(id) as Document
    } catch (error) {
      console.error('Erreur lors de la mise à jour du document:', error)
      throw error
    }
  }

  /**
   * Supprimer un document
   * Delete document
   */
  async deleteDocument(id: string): Promise<void> {
    try {
      const { error } = await supabase
        .from('documents')
        .delete()
        .eq('id', id)

      if (error) throw error
    } catch (error) {
      console.error('Erreur lors de la suppression du document:', error)
      throw error
    }
  }

  /**
   * Supprimer plusieurs documents
   * Bulk delete documents
   */
  async bulkDeleteDocuments(ids: string[]): Promise<void> {
    try {
      const { error } = await supabase
        .from('documents')
        .delete()
        .in('id', ids)

      if (error) throw error
    } catch (error) {
      console.error('Erreur lors de la suppression multiple:', error)
      throw error
    }
  }

  /**
   * Mettre à jour le statut d'un document
   * Update document status
   */
  async updateDocumentStatus(id: string, status: DocumentStatus, paidDate?: string): Promise<void> {
    try {
      const updateData: any = { status };
      if (paidDate && status === 'paid') {
        updateData.paid_date = paidDate;
      }
      const { error } = await (supabase
        .from('documents') as any)
        .update(updateData)
        .eq('id', id);

      if (error) throw error;
    } catch (error) {
      console.error('Erreur lors de la mise à jour du statut:', error);
      throw error;
    }
  }

  /**
   * Générer un numéro de document unique
   * Generate unique document number
   */
  async generateDocumentNumber(type: Document['type']): Promise<string> {
    try {
      const currentYear = new Date().getFullYear()
      const prefix = type.toUpperCase().substring(0, 3)

      // Récupérer le dernier numéro pour ce type et cette année
      const { data, error } = await (supabase
        .from('documents') as any)
        .select('document_number')
        .eq('type', type)
        .like('document_number', `${prefix}-%`)
        .order('document_number', { ascending: false })
        .limit(1);

      if (error) throw error

      let nextNumber = 1
      if (data && data.length > 0 && (data as any)[0]?.document_number) {
        const lastNumber = (data as any)[0].document_number.split('-')[2]
        nextNumber = parseInt(lastNumber) + 1
      }

      return `${prefix}-${currentYear}-${nextNumber.toString().padStart(4, '0')}`
    } catch (error) {
      console.error('Erreur lors de la génération du numéro de document:', error)
      throw error
    }
  }

  /**
   * Récupérer les modèles de documents
   * Get document templates
   */
  async getTemplates(type?: Document['type']): Promise<DocumentTemplate[]> {
    try {
      let query = supabase
        .from('document_templates')
        .select('*')
        .order('created_at', { ascending: false })

      if (type) {
        query = query.eq('type', type)
      }

      const { data, error } = await query

      if (error) throw error
      return data || []
    } catch (error) {
      console.error('Erreur lors de la récupération des modèles:', error)
      throw error
    }
  }

  /**
   * Récupérer la liste des clients
   * Get clients list
   */
  async getClients(): Promise<Client[]> {
    try {
      const { data, error } = await supabase
        .from('clients')
        .select('id, name, email')
        .order('name', { ascending: true })

      if (error) throw error
      return data || []
    } catch (error) {
      console.error('Erreur lors de la récupération des clients:', error)
      throw error
    }
  }

  /**
   * Sauvegarder l'URL du PDF généré
   * Save generated PDF URL
   */
  async savePDFUrl(documentId: string, pdfUrl: string): Promise<void> {
    try {
      const { error } = await (supabase
        .from('documents') as any)
        .update({ pdf_url: pdfUrl })
        .eq('id', documentId)

      if (error) throw error
    } catch (error) {
      console.error('Erreur lors de la sauvegarde de l\'URL du PDF:', error)
      throw error
    }
  }
}

export const documentService = new DocumentService()
