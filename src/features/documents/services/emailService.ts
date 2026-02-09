/**
 * Service pour l'envoi d'emails
 * Email sending service
 */

import { supabase } from '@/lib/supabase'
import { pdfService } from './pdfService'

export interface EmailOptions {
  to: string
  subject: string
  html?: string
  text?: string
  attachments?: Array<{
    filename: string
    content: string // base64
    contentType: string
  }>
}

export const emailService = {
  /**
   * Envoyer un document par email
   * Send document by email
   */
  async sendDocumentByEmail(
    documentId: string,
    recipientEmail: string,
    message?: string,
    options?: {
      cc?: string[]
      bcc?: string[]
      includePdf?: boolean
    }
  ): Promise<void> {
    try {
      // 1. Récupérer le document
      const { data: document, error: documentError } = await supabase
        .from('documents')
        .select(`
          *,
          clients(id, name, email)
        `)
        .eq('id', documentId)
        .single()

      if (documentError || !document) {
        throw new Error('Document non trouvé')
      }

      // 2. Générer le PDF si nécessaire
      let pdfBase64: string | undefined
      if (options?.includePdf !== false) {
        const pdfBlob = await pdfService.generatePDF(document as any)
        pdfBase64 = await this.blobToBase64(pdfBlob)
      }

      // 3. Préparer l'email
      const emailData: EmailOptions = {
        to: recipientEmail,
        subject: `${this.getDocumentTypeLabel((document as any).type)} ${(document as any).document_number}`,
        html: this.generateEmailHtml(document as any, message),
        attachments: pdfBase64 ? [{
          filename: `${(document as any).document_number}.pdf`,
          content: pdfBase64,
          contentType: 'application/pdf'
        }] : []
      }

      // 4. Envoyer l'email via l'API edge function
      const { error: emailError } = await supabase.functions.invoke('send-email', {
        body: emailData
      })

      if (emailError) {
        throw new Error(`Erreur lors de l'envoi: ${emailError.message}`)
      }

      // 5. Mettre à jour le statut du document
      await (supabase
        .from('documents') as any)
        .update({
          status: 'sent',
          updated_at: new Date().toISOString()
        })
        .eq('id', documentId)

    } catch (error) {
      console.error('Erreur lors de l\'envoi d\'email:', error)
      throw error
    }
  },

  /**
   * Envoyer un rappel de paiement
   * Send payment reminder
   */
  async sendPaymentReminder(
    documentId: string,
    reminderType: 'gentle' | 'formal' | 'urgent' = 'gentle'
  ): Promise<void> {
    try {
      const { data: document, error } = await supabase
        .from('documents')
        .select(`
          *,
          clients(id, name, email)
        `)
        .eq('id', documentId)
        .single()

      if (error || !document) {
        throw new Error('Document non trouvé')
      }

      const daysOverdue = Math.floor((Date.now() - new Date((document as any).due_date).getTime()) / (1000 * 60 * 60 * 24))

      const emailData: EmailOptions = {
        to: (document as any).clients?.email || '',
        subject: this.getReminderSubject(document as any, reminderType, daysOverdue),
        html: this.generateReminderHtml(document as any, reminderType, daysOverdue)
      }

      await supabase.functions.invoke('send-email', {
        body: emailData
      })

    } catch (error) {
      console.error('Erreur lors de l\'envoi du rappel:', error)
      throw error
    }
  },

  /**
   * Envoyer en lot à plusieurs clients
   * Bulk send to multiple clients
   */
  async sendBulkDocuments(
    documentIds: string[],
    options?: {
      includePdf?: boolean
      customMessage?: string
    }
  ): Promise<{ success: string[]; failed: string[] }> {
    const results = { success: [] as string[], failed: [] as string[] }

    for (const documentId of documentIds) {
      try {
        const { data: document } = await (supabase
          .from('documents') as any)
          .select('*, clients(id, name, email)')
          .eq('id', documentId)
          .single()

        if (document?.clients?.email) {
          await this.sendDocumentByEmail(
            documentId,
            document.clients.email,
            options?.customMessage,
            options
          )
          results.success.push(documentId)
        } else {
          results.failed.push(documentId)
        }
      } catch (error) {
        console.error(`Échec envoi document ${documentId}:`, error)
        results.failed.push(documentId)
      }
    }

    return results
  },

  /**
   * Convertir Blob en base64
   * Convert Blob to base64
   */
  async blobToBase64(blob: Blob): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader()
      reader.onload = () => {
        const result = reader.result as string
        const base64 = result.split(',')[1] // Enlever le préfixe data:application/pdf;base64,
        resolve(base64 as string)
      }
      reader.onerror = reject
      reader.readAsDataURL(blob)
    })
  },

  /**
   * Obtenir le libellé du type de document
   * Get document type label
   */
  getDocumentTypeLabel(type: string): string {
    const labels = {
      invoice: 'Facture',
      quote: 'Devis',
      delivery_note: 'Bon de livraison',
      po: 'Commande fournisseur',
      reminder: 'Rappel',
      receipt: 'Reçu'
    }
    return labels[type as keyof typeof labels] || type
  },

  /**
   * Générer le HTML de l'email
   * Generate email HTML
   */
  generateEmailHtml(document: any, customMessage?: string): string {
    return `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .header { background: #f8f9fa; padding: 20px; border-bottom: 1px solid #dee2e6; }
          .content { padding: 20px; }
          .footer { background: #f8f9fa; padding: 20px; border-top: 1px solid #dee2e6; font-size: 12px; color: #666; }
          .btn { display: inline-block; padding: 12px 24px; background: #007bff; color: white; text-decoration: none; border-radius: 4px; }
        </style>
      </head>
      <body>
        <div class="header">
          <h2>${this.getDocumentTypeLabel(document.type)} ${document.document_number}</h2>
        </div>
        
        <div class="content">
          <p>Bonjour ${document.clients?.name || 'Client'},</p>
          
          <p>Veuillez trouver ci-joint ${this.getDocumentTypeLabel(document.type).toLowerCase()} ${document.document_number}.</p>
          
          <div style="margin: 20px 0; padding: 15px; background: #f8f9fa; border-radius: 4px;">
            <p><strong>Montant total:</strong> ${new Intl.NumberFormat('fr-CH', {
      style: 'currency',
      currency: 'CHF'
    }).format(document.total_amount)}</p>
            <p><strong>Date d'émission:</strong> ${new Date(document.issue_date).toLocaleDateString('fr-CH')}</p>
            ${document.due_date ? `<p><strong>Date d'échéance:</strong> ${new Date(document.due_date).toLocaleDateString('fr-CH')}</p>` : ''}
          </div>
          
          ${customMessage ? `<p>${customMessage}</p>` : ''}
          
          <p>Cordialement,<br>L'équipe</p>
        </div>
        
        <div class="footer">
          <p>Cet email a été généré automatiquement. Merci de ne pas y répondre.</p>
        </div>
      </body>
      </html>
    `
  },

  /**
   * Obtenir le sujet du rappel
   * Get reminder subject
   */
  getReminderSubject(document: any, type: string, daysOverdue: number): string {
    if (type === 'urgent') {
      return `URGENT: ${this.getDocumentTypeLabel(document.type)} ${document.document_number} en retard de ${daysOverdue} jours`
    }
    return `Rappel: ${this.getDocumentTypeLabel(document.type)} ${document.document_number}`
  },

  /**
   * Générer le HTML du rappel
   * Generate reminder HTML
   */
  generateReminderHtml(document: any, _type: string, daysOverdue: number): string {
    const isOverdue = new Date(document.due_date) < new Date()

    return `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .urgent { color: #dc3545; font-weight: bold; }
          .btn { display: inline-block; padding: 12px 24px; background: #007bff; color: white; text-decoration: none; border-radius: 4px; }
        </style>
      </head>
      <body>
        <h2>Rappel: ${this.getDocumentTypeLabel(document.type)} ${document.document_number}</h2>
        
        <p>Bonjour ${document.clients?.name || 'Client'},</p>
        
        ${isOverdue ?
        `<p class="urgent">Attention: Ce document est en retard de ${daysOverdue} jours.</p>` :
        '<p>Ceci est un rappel concernant le document suivant:</p>'
      }
        
        <div style="margin: 20px 0; padding: 15px; background: #f8f9fa; border-radius: 4px;">
          <p><strong>Document:</strong> ${document.document_number}</p>
          <p><strong>Montant:</strong> ${new Intl.NumberFormat('fr-CH', {
        style: 'currency',
        currency: 'CHF'
      }).format(document.total_amount)}</p>
          <p><strong>Échéance:</strong> ${new Date(document.due_date).toLocaleDateString('fr-CH')}</p>
          ${isOverdue ? `<p class="urgent"><strong>Retard:</strong> ${daysOverdue} jours</p>` : ''}
        </div>
        
        <p>Nous vous remercions de votre attention à ce sujet.</p>
        
        <p>Cordialement,<br>L'équipe</p>
      </body>
      </html>
    `
  }
}
