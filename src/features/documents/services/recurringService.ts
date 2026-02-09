/**
 * Service pour les documents récurrents
 * Recurring documents service
 */

import { supabase } from '@/lib/supabase'
import { documentService } from './documentService'

export interface RecurringDocument {
  id: string
  user_id: string
  template_document_id: string
  name: string
  frequency: 'monthly' | 'quarterly' | 'yearly'
  next_date: string
  end_date?: string | undefined
  is_active: boolean
  created_at: string
  updated_at: string
}

export interface RecurringConfig {
  templateDocumentId: string
  name: string
  frequency: 'monthly' | 'quarterly' | 'yearly'
  startDate?: string | undefined
  endDate?: string | undefined
  dayOfMonth?: number // Pour les documents mensuels/trimestriels
  monthOfYear?: number // Pour les documents annuels (1-12)
}

export const recurringService = {
  /**
   * Créer une configuration récurrente
   * Create recurring configuration
   */
  async setupRecurring(config: RecurringConfig): Promise<RecurringDocument> {
    try {
      // Calculer la prochaine date d'exécution
      const nextDate = this.calculateNextDate(config)

      const { data, error } = await (supabase.from('recurring_documents') as any)
        .insert({
          user_id: (await supabase.auth.getUser()).data.user?.id,
          template_document_id: config.templateDocumentId,
          name: config.name,
          frequency: config.frequency,
          next_date: nextDate,
          end_date: config.endDate,
          is_active: true,
          created_at: new Date().toISOString()
        })
        .select()
        .single()

      if (error) throw error
      return data as RecurringDocument
    } catch (error) {
      console.error('Erreur lors de la configuration récurrente:', error)
      throw error
    }
  },

  /**
   * Obtenir toutes les configurations récurrentes
   * Get all recurring configurations
   */
  async getRecurringDocuments(): Promise<RecurringDocument[]> {
    try {
      const { data, error } = await (supabase.from('recurring_documents') as any)
        .select(`
          *,
          template_documents(id, document_number, type, client_id)
        `)
        .eq('is_active', true)
        .order('next_date', { ascending: true })

      if (error) throw error
      return data || []
    } catch (error) {
      console.error('Erreur lors de la récupération des documents récurrents:', error)
      throw error
    }
  },

  /**
   * Mettre à jour une configuration récurrente
   * Update recurring configuration
   */
  async updateRecurring(id: string, updates: Partial<RecurringDocument>): Promise<RecurringDocument> {
    try {
      const { data, error } = await (supabase.from('recurring_documents') as any)
        .update({
          ...updates,
          updated_at: new Date().toISOString()
        })
        .eq('id', id)
        .select()
        .single()

      if (error) throw error
      return data as RecurringDocument
    } catch (error) {
      console.error('Erreur lors de la mise à jour:', error)
      throw error
    }
  },

  /**
   * Désactiver une configuration récurrente
   * Disable recurring configuration
   */
  async deactivateRecurring(id: string): Promise<void> {
    try {
      const { error } = await (supabase.from('recurring_documents') as any)
        .update({
          is_active: false,
          updated_at: new Date().toISOString()
        })
        .eq('id', id)

      if (error) throw error
    } catch (error) {
      console.error('Erreur lors de la désactivation:', error)
      throw error
    }
  },

  /**
   * Exécuter les documents récurrents (cron job)
   * Process recurring documents (cron job)
   */
  async processRecurringDocuments(): Promise<{ processed: number; errors: string[] }> {
    const results = { processed: 0, errors: [] as string[] }

    try {
      // Récupérer tous les documents récurrents actifs dont la date est arrivée
      const { data: recurringDocs, error } = await (supabase.from('recurring_documents') as any)
        .select('*')
        .eq('is_active', true)
        .lte('next_date', new Date().toISOString())

      if (error) throw error

      if (!recurringDocs || recurringDocs.length === 0) {
        return results
      }

      // Traiter chaque document récurrent
      for (const recurring of recurringDocs as any[]) {
        try {
          // Cloner le document template
          const templateDoc = await documentService.getDocument(recurring.template_document_id)
          if (!templateDoc) {
            results.errors.push(`Template non trouvé pour ${recurring.id}`)
            continue
          }

          // Créer le nouveau document
          await documentService.createDocument({
            type: templateDoc.type,
            client_id: templateDoc.client_id,
            document_number: await this.generateRecurringNumber(templateDoc.type),
            issue_date: new Date().toISOString().split('T')[0]!,
            due_date: this.calculateDueDate(templateDoc.type, new Date()) || undefined,
            notes: `Document généré automatiquement depuis: ${recurring.name}`,
            items: templateDoc.items?.map(item => ({
              description: item.description,
              quantity: item.quantity,
              unit_price: item.unit_price,
              tax_rate: item.tax_rate
            })) || []
          })

          // Calculer la prochaine date d'exécution
          const nextDate = this.calculateNextExecutionDate(recurring)

          // Mettre à jour la prochaine date
          await (supabase.from('recurring_documents') as any)
            .update({
              next_date: nextDate,
              updated_at: new Date().toISOString()
            })
            .eq('id', recurring.id)

          // Vérifier si c'est la dernière exécution
          if (recurring.end_date && new Date(nextDate) > new Date(recurring.end_date)) {
            await this.deactivateRecurring(recurring.id)
          }

          results.processed++
        } catch (error) {
          const errorMsg = `Erreur traitement ${recurring.id}: ${error instanceof Error ? error.message : 'Erreur inconnue'}`
          console.error(errorMsg)
          results.errors.push(errorMsg)
        }
      }

      return results
    } catch (error) {
      console.error('Erreur lors du traitement des documents récurrents:', error)
      throw error
    }
  },

  /**
   * Calculer la prochaine date d'exécution
   * Calculate next execution date
   */
  calculateNextDate(config: RecurringConfig): string {
    const now = new Date()
    let nextDate = new Date()

    switch (config.frequency) {
      case 'monthly':
        nextDate = new Date(now.getFullYear(), now.getMonth() + 1, config.dayOfMonth || 1)
        break
      case 'quarterly':
        const nextQuarter = Math.floor(now.getMonth() / 3) + 1
        nextDate = new Date(now.getFullYear(), nextQuarter * 3, config.dayOfMonth || 1)
        break
      case 'yearly':
        const year = now.getFullYear() + 1
        const month = (config.monthOfYear || 1) - 1
        nextDate = new Date(year, month, config.dayOfMonth || 1)
        break
      default:
        throw new Error(`Fréquence non supportée: ${config.frequency}`)
    }

    return nextDate.toISOString().split('T')[0]!
  },

  /**
   * Calculer la prochaine date d'exécution pour un document récurrent existant
   * Calculate next execution date for existing recurring document
   */
  calculateNextExecutionDate(recurring: RecurringDocument): string {
    const config: RecurringConfig = {
      templateDocumentId: recurring.template_document_id,
      name: recurring.name,
      frequency: recurring.frequency,
      startDate: recurring.next_date,
      endDate: recurring.end_date
    }
    return this.calculateNextDate(config)
  },

  /**
   * Calculer la date d'échéance
   * Calculate due date
   */
  calculateDueDate(documentType: string, issueDate: Date): string {
    const dueDate = new Date(issueDate)

    // Conditions de paiement par défaut selon le type de document
    switch (documentType) {
      case 'invoice':
        dueDate.setDate(dueDate.getDate() + 30) // 30 jours
        break
      case 'quote':
        dueDate.setDate(dueDate.getDate() + 15) // 15 jours
        break
      case 'po':
        dueDate.setDate(dueDate.getDate() + 7) // 7 jours
        break
      default:
        dueDate.setMonth(dueDate.getMonth() + 1) // 1 mois par défaut
    }

    return dueDate.toISOString().split('T')[0] || ''
  },

  /**
   * Générer un numéro pour document récurrent
   * Generate number for recurring document
   */
  async generateRecurringNumber(documentType: string): Promise<string> {
    const prefix = {
      invoice: 'INV-REC',
      quote: 'DEV-REC',
      delivery_note: 'BL-REC',
      po: 'CMD-REC',
      reminder: 'RAP-REC',
      receipt: 'REC-REC'
    }

    const today = new Date()
    const year = today.getFullYear()
    const month = String(today.getMonth() + 1).padStart(2, '0')

    // Récupérer le dernier numéro pour ce mois
    const { data: lastDoc } = await (supabase.from('documents') as any)
      .select('document_number')
      .like('document_number', `${(prefix as any)[documentType]}-${year}${month}%`)
      .order('document_number', { ascending: false })
      .limit(1)

    let sequence = 1
    if (lastDoc && lastDoc.length > 0) {
      const lastNumber = lastDoc[0].document_number
      const lastSequence = parseInt(lastNumber.split('-').pop() || '1')
      sequence = lastSequence + 1
    }

    return `${(prefix as any)[documentType]}-${year}${month}-${String(sequence).padStart(3, '0')}`
  },

  /**
   * Obtenir les statistiques des documents récurrents
   * Get recurring documents statistics
   */
  async getRecurringStats(): Promise<{
    total: number
    active: number
    byFrequency: Record<string, number>
    nextExecutions: number
  }> {
    try {
      const { data: all } = await (supabase.from('recurring_documents') as any)
        .select('*')

      if (!all) {
        return { total: 0, active: 0, byFrequency: {}, nextExecutions: 0 }
      }

      const active = all.filter((r: any) => r.is_active)
      const byFrequency = active.reduce((acc: any, r: any) => {
        acc[r.frequency] = (acc[r.frequency] || 0) + 1
        return acc
      }, {} as Record<string, number>)

      const nextExecutions = all.filter((r: any) =>
        r.is_active && new Date(r.next_date) <= new Date()
      ).length

      return {
        total: (all as any[]).length,
        active: active.length,
        byFrequency,
        nextExecutions
      }
    } catch (error) {
      console.error('Erreur lors de la récupération des statistiques:', error)
      throw error
    }
  }
}
