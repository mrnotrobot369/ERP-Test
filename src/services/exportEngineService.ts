/**
 * Service robuste pour l'export multi-secteurs
 * Robust export engine service for multi-sectors
 */

import jsPDF from 'jspdf'
import html2canvas from 'html2canvas'
import { supabase } from '@/lib/supabase'
import { logger } from '@/lib/logger'
import { dynamicSchemaService } from './dynamicSchemaService'
import type {
  MultiSectorDocument,
  MultiSectorClient,
  ExportTemplate,
  BusinessSector
} from '@/types/multi-sector'

export interface ExportOptions {
  format: 'pdf' | 'html' | 'excel'
  template?: string
  includeCustomFields?: boolean
  language?: 'fr' | 'en' | 'de' | 'it'
  watermark?: string
  password?: string
}

export interface ExportResult {
  url: string
  filename: string
  size: number
  format: string
  generatedAt: string
}

class ExportEngineService {
  private templates = new Map<string, ExportTemplate>()
  private sectorTemplates: Record<BusinessSector, string[]> = {
    automotive: ['invoice_standard', 'work_order', 'parts_quote'],
    healthcare: ['medical_invoice', 'consultation_report', 'prescription'],
    construction: ['construction_invoice', 'work_quote', 'progress_report'],
    retail: ['sales_invoice', 'receipt', 'quote'],
    services: ['service_invoice', 'consultation_report', 'proposal'],
    manufacturing: ['manufacturing_invoice', 'work_order', 'quality_report'],
    consulting: ['consulting_invoice', 'timesheet_report', 'proposal'],
    education: ['tuition_invoice', 'certificate', 'progress_report'],
    restaurant: ['restaurant_invoice', 'receipt', 'catering_quote'],
    technology: ['tech_invoice', 'service_report', 'proposal'],
  }

  /**
   * Initialiser les templates par défaut
   */
  async initializeTemplates(): Promise<void> {
    try {
      // Charger les templates depuis la base de données
      const { data, error } = await (supabase
        .from('export_templates') as any)
        .select('*')

      if (error && error.code !== 'PGRST116') { // PGRST116 = table not found
        throw error
      }

      // Si pas de templates en base, créer les templates par défaut
      if (!data || data.length === 0) {
        await this.createDefaultTemplates()
      } else {
        // Mettre en cache les templates existants
        (data || []).forEach((template: any) => {
          this.templates.set(template.id, template as ExportTemplate)
        })
      }

      logger.info('Templates d\'export initialisés', 'ExportEngineService')
    } catch (error) {
      logger.error('Erreur lors de l\'initialisation des templates', 'ExportEngineService', error)
      throw error
    }
  }

  /**
   * Exporter un document
   */
  async exportDocument(
    document: MultiSectorDocument,
    client: MultiSectorClient,
    options: ExportOptions = { format: 'pdf' }
  ): Promise<ExportResult> {
    try {
      logger.info(`Début export document: ${document.id}`, 'ExportEngineService', { format: options.format })

      // Récupérer le template approprié
      const template = await this.getTemplate(document.sector, document.document_type, options.template)

      // Générer le HTML
      const html = await this.generateHTML(document, client, template, options)

      // Exporter selon le format
      let result: ExportResult

      switch (options.format) {
        case 'pdf':
          result = await this.exportToPDF(html, document, options)
          break
        case 'html':
          result = await this.exportToHTML(html, document, options)
          break
        case 'excel':
          result = await this.exportToExcel(document, client, options)
          break
        default:
          throw new Error(`Format d'export non supporté: ${options.format}`)
      }

      logger.info(`Export réussi: ${result.filename}`, 'ExportEngineService', result)
      return result
    } catch (error) {
      logger.error('Erreur lors de l\'export du document', 'ExportEngineService', error)
      throw error
    }
  }

  /**
   * Générer le HTML pour un document
   */
  private async generateHTML(
    document: MultiSectorDocument,
    client: MultiSectorClient,
    template: ExportTemplate,
    options: ExportOptions
  ): Promise<string> {
    // Récupérer les champs personnalisés si nécessaire
    let customFieldsData = {}
    if (options.includeCustomFields) {
      const customFields = await dynamicSchemaService.getCustomFieldValues(document.id)
      customFieldsData = customFields.reduce((acc, field) => {
        acc[field.field_id] = field.value
        return acc
      }, {} as Record<string, string | number | boolean | Date>)
    }

    // Variables pour le template
    const variables = {
      // Document
      document_number: document.document_number,
      document_type: document.document_type,
      issue_date: new Date(document.issue_date).toLocaleDateString('fr-CH'),
      due_date: document.due_date ? new Date(document.due_date).toLocaleDateString('fr-CH') : '',
      status: document.status,
      subtotal: document.subtotal.toFixed(2),
      tax_amount: document.tax_amount.toFixed(2),
      total_amount: document.total_amount.toFixed(2),
      notes: document.notes || '',

      // Client
      client_name: client.name,
      client_email: client.email || '',
      client_phone: client.phone || '',
      client_address: client.address || '',
      client_city: client.city || '',
      client_country: client.country || '',
      client_postal_code: client.postal_code || '',

      // Secteur spécifique
      sector_data: document.sector_data || {},
      client_sector_data: client.sector_data || {},

      // Champs personnalisés
      custom_fields: customFieldsData,

      // Options
      watermark: options.watermark || '',
      language: options.language || 'fr',

      // Items
      items: document.items.map(item => ({
        description: item.description,
        quantity: item.quantity,
        unit_price: item.unit_price.toFixed(2),
        total_price: item.total_price.toFixed(2),
        tax_rate: item.tax_rate || 0,
        sector_data: item.sector_data || {},
      })),
    }

    // Remplacer les variables dans le template
    let html = template.template_html

    // Remplacement simple des variables
    Object.entries(variables).forEach(([key, value]) => {
      const regex = new RegExp(`{{\\s*${key}\\s*}}`, 'g')
      if (typeof value === 'object') {
        html = html.replace(regex, JSON.stringify(value))
      } else {
        html = html.replace(regex, String(value))
      }
    })

    // Ajouter les styles CSS
    const css = `
      <style>
        ${template.css_styles}
        
        /* Styles de base */
        body {
          font-family: 'Arial', sans-serif;
          margin: 0;
          padding: 20px;
          color: #333;
        }
        
        .document-header {
          border-bottom: 3px solid #2563eb;
          padding-bottom: 20px;
          margin-bottom: 30px;
        }
        
        .document-title {
          font-size: 28px;
          font-weight: bold;
          color: #2563eb;
          margin: 0;
        }
        
        .document-info {
          display: flex;
          justify-content: space-between;
          margin: 20px 0;
        }
        
        .client-info, .document-details {
          flex: 1;
        }
        
        .items-table {
          width: 100%;
          border-collapse: collapse;
          margin: 20px 0;
        }
        
        .items-table th,
        .items-table td {
          border: 1px solid #ddd;
          padding: 12px;
          text-align: left;
        }
        
        .items-table th {
          background-color: #f8f9fa;
          font-weight: bold;
        }
        
        .items-table .text-right {
          text-align: right;
        }
        
        .totals {
          text-align: right;
          margin-top: 20px;
        }
        
        .totals-row {
          display: flex;
          justify-content: flex-end;
          margin: 5px 0;
        }
        
        .totals-label {
          width: 150px;
          text-align: right;
          padding-right: 20px;
        }
        
        .totals-value {
          width: 120px;
          text-align: right;
          font-weight: bold;
        }
        
        .grand-total {
          border-top: 2px solid #2563eb;
          padding-top: 10px;
          font-size: 18px;
          color: #2563eb;
        }
        
        .footer {
          margin-top: 50px;
          padding-top: 20px;
          border-top: 1px solid #ddd;
          text-align: center;
          font-size: 12px;
          color: #666;
        }
        
        .watermark {
          position: fixed;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%) rotate(-45deg);
          font-size: 100px;
          opacity: 0.1;
          color: #000;
          z-index: -1;
        }
      </style>
    `

    // Remplacer le placeholder CSS
    html = html.replace('{{css_styles}}', css)

    return html
  }

  /**
   * Exporter en PDF
   */
  private async exportToPDF(
    html: string,
    document: MultiSectorDocument,
    _options: ExportOptions
  ): Promise<ExportResult> {
    const filename = `${document.document_type}_${document.document_number}.pdf`

    // Créer un élément temporaire
    const tempDiv = window.document.createElement('div')
    tempDiv.innerHTML = html
    tempDiv.style.position = 'absolute'
    tempDiv.style.left = '-9999px'
    window.document.body.appendChild(tempDiv)

    try {
      // Convertir en canvas
      const canvas = await html2canvas(tempDiv, {
        scale: 2,
        useCORS: true,
        allowTaint: true,
      })

      // Créer le PDF
      const pdf = new jsPDF('p', 'mm', 'a4')
      const imgData = canvas.toDataURL('image/png')

      const pdfWidth = pdf.internal.pageSize.getWidth()
      const pdfHeight = (canvas.height * pdfWidth) / canvas.width

      pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight)

      // Ajouter un mot de passe si spécifié
      // Note: La fonction encrypt n'existe pas dans jsPDF de base
      // if (options.password) {
      //   pdf.encrypt(options.password)
      // }

      // Convertir en blob
      const pdfBlob = pdf.output('blob')

      // Uploader vers Supabase Storage
      const url = await this.uploadToStorage(pdfBlob, filename, 'application/pdf')

      // Nettoyer
      window.document.body.removeChild(tempDiv)

      return {
        url,
        filename,
        size: pdfBlob.size,
        format: 'pdf',
        generatedAt: new Date().toISOString(),
      }
    } catch (error) {
      window.document.body.removeChild(tempDiv)
      throw error
    }
  }

  /**
   * Exporter en HTML
   */
  private async exportToHTML(
    html: string,
    document: MultiSectorDocument,
    _options: ExportOptions
  ): Promise<ExportResult> {
    const filename = `${document.document_type}_${document.document_number}.html`

    // Créer le HTML complet
    const fullHTML = `
      <!DOCTYPE html>
      <html lang="${_options.language || 'fr'}">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>${document.document_type} ${document.document_number}</title>
      </head>
      <body>
        ${html}
      </body>
      </html>
    `

    // Créer un blob
    const blob = new Blob([fullHTML], { type: 'text/html' })

    // Uploader vers Supabase Storage
    const url = await this.uploadToStorage(blob, filename, 'text/html')

    return {
      url,
      filename,
      size: blob.size,
      format: 'html',
      generatedAt: new Date().toISOString(),
    }
  }

  /**
   * Exporter en Excel (placeholder)
   */
  private async exportToExcel(
    document: MultiSectorDocument,
    client: MultiSectorClient,
    _options: ExportOptions
  ): Promise<ExportResult> {
    const filename = `${document.document_type}_${document.document_number}.csv`

    // Créer un CSV simple
    const csvContent = [
      ['Type', 'Numéro', 'Date', 'Client', 'Montant Total'],
      [document.document_type, document.document_number, document.issue_date, client.name, document.total_amount.toFixed(2)],
      [],
      ['Description', 'Quantité', 'Prix Unitaire', 'Total'],
      ...document.items.map(item => [
        item.description,
        item.quantity,
        item.unit_price.toFixed(2),
        item.total_price.toFixed(2)
      ])
    ].map(row => row.join(',')).join('\n')

    const blob = new Blob([csvContent], { type: 'text/csv' })

    // Uploader vers Supabase Storage
    const url = await this.uploadToStorage(blob, filename, 'text/csv')

    return {
      url,
      filename,
      size: blob.size,
      format: 'csv',
      generatedAt: new Date().toISOString(),
    }
  }

  /**
   * Uploader un fichier vers Supabase Storage
   */
  private async uploadToStorage(
    blob: Blob,
    filename: string,
    contentType: string
  ): Promise<string> {
    try {
      const timestamp = Date.now()
      const path = `exports/${timestamp}_${filename}`

      const { error } = await supabase.storage
        .from('documents')
        .upload(path, blob, {
          contentType,
          upsert: true,
        })

      if (error) throw error

      const { data: { publicUrl } } = supabase.storage
        .from('documents')
        .getPublicUrl(path)

      return publicUrl
    } catch (error) {
      logger.error('Erreur lors de l\'upload vers Supabase Storage', 'ExportEngineService', error)
      throw error
    }
  }

  /**
   * Récupérer un template
   */
  private async getTemplate(
    sector: BusinessSector,
    _documentType: string,
    templateId?: string
  ): Promise<ExportTemplate> {
    if (templateId) {
      const template = this.templates.get(templateId)
      if (template) return template
    }

    // Récupérer le template par défaut pour le secteur et type
    const templates = this.sectorTemplates[sector] || []
    const defaultTemplateId = templates[0] || 'standard'

    const template = this.templates.get(defaultTemplateId)
    if (template) return template

    // Template de secours
    return this.getDefaultTemplate()
  }

  /**
   * Obtenir le template par défaut
   */
  private getDefaultTemplate(): ExportTemplate {
    return {
      id: 'standard',
      name: 'Template Standard',
      sector: 'services',
      document_type: 'invoice',
      template_html: `
        <div class="document">
          <div class="document-header">
            <h1 class="document-title">{{ document_type | uppercase }}</h1>
            <p>Numéro: {{ document_number }}</p>
            <p>Date: {{ issue_date }}</p>
          </div>
          
          <div class="document-info">
            <div class="client-info">
              <h3>Client</h3>
              <p><strong>{{ client_name }}</strong></p>
              <p>{{ client_address }}</p>
              <p>{{ client_city }} {{ client_postal_code }}</p>
              <p>{{ client_email }}</p>
            </div>
            
            <div class="document-details">
              <p><strong>Date d'émission:</strong> {{ issue_date }}</p>
              <p><strong>Date d'échéance:</strong> {{ due_date }}</p>
              <p><strong>Statut:</strong> {{ status }}</p>
            </div>
          </div>
          
          <table class="items-table">
            <thead>
              <tr>
                <th>Description</th>
                <th class="text-right">Quantité</th>
                <th class="text-right">Prix Unit.</th>
                <th class="text-right">Total</th>
              </tr>
            </thead>
            <tbody>
              {% for item in items %}
              <tr>
                <td>{{ item.description }}</td>
                <td class="text-right">{{ item.quantity }}</td>
                <td class="text-right">{{ item.unit_price }} CHF</td>
                <td class="text-right">{{ item.total_price }} CHF</td>
              </tr>
              {% endfor %}
            </tbody>
          </table>
          
          <div class="totals">
            <div class="totals-row">
              <div class="totals-label">Sous-total:</div>
              <div class="totals-value">{{ subtotal }} CHF</div>
            </div>
            <div class="totals-row">
              <div class="totals-label">TVA:</div>
              <div class="totals-value">{{ tax_amount }} CHF</div>
            </div>
            <div class="totals-row grand-total">
              <div class="totals-label">Total:</div>
              <div class="totals-value">{{ total_amount }} CHF</div>
            </div>
          </div>
          
          {% if notes %}
          <div class="notes">
            <h4>Notes</h4>
            <p>{{ notes }}</p>
          </div>
          {% endif %}
          
          <div class="footer">
            <p>Merci de votre confiance</p>
            <p>Généré le ${new Date().toLocaleDateString('fr-CH')}</p>
          </div>
          
          {% if watermark %}
          <div class="watermark">{{ watermark }}</div>
          {% endif %}
        </div>
      `,
      css_styles: '{{css_styles}}',
      footer_text: 'Merci de votre confiance',
    }
  }

  /**
   * Créer les templates par défaut
   */
  private async createDefaultTemplates(): Promise<void> {
    // Implémentation pour créer les templates par défaut dans la base de données
    // Pour l'instant, on utilise le template standard
    const defaultTemplate = this.getDefaultTemplate()
    this.templates.set(defaultTemplate.id, defaultTemplate)

    // Sauvegarder dans la base de données si nécessaire
    try {
      await supabase
        .from('export_templates')
        .insert({
          ...defaultTemplate as any,
          created_at: new Date().toISOString(),
        })
    } catch (error) {
      // Ignorer l'erreur si la table n'existe pas encore
      logger.debug('Table export_templates non disponible', 'ExportEngineService')
    }
  }

  /**
   * Créer un template personnalisé
   */
  async createTemplate(template: Omit<ExportTemplate, 'id'>): Promise<ExportTemplate> {
    try {
      const { error } = await supabase
        .from('export_templates')
        .insert({
          ...template as any,
          created_at: new Date().toISOString(),
        })
        .select()
        .single()

      if (error) throw error

      // Récupérer le template inséré
      const { data: insertedData } = await supabase
        .from('export_templates')
        .select('*')
        .eq('name', template.name)
        .single()

      const newTemplate = insertedData as ExportTemplate
      this.templates.set(newTemplate.id, newTemplate)

      logger.info(`Template créé: ${newTemplate.name}`, 'ExportEngineService', newTemplate)
      return newTemplate
    } catch (error) {
      logger.error('Erreur lors de la création du template', 'ExportEngineService', error)
      throw error
    }
  }

  /**
   * Lister les templates disponibles pour un secteur
   */
  async getTemplatesForSector(sector: BusinessSector): Promise<ExportTemplate[]> {
    const templateIds = this.sectorTemplates[sector] || []
    return templateIds
      .map(id => this.templates.get(id))
      .filter(Boolean) as ExportTemplate[]
  }
}

export const exportEngineService = new ExportEngineService()
export default exportEngineService
