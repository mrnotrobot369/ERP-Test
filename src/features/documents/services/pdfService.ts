/**
 * Service pour la génération de PDF
 * Service for PDF generation
 */

import jsPDF from 'jspdf'
import html2canvas from 'html2canvas'
import type { Document, DocumentTemplate, PDFGenerationOptions } from '../types/document'

class PDFService {
  /**
   * Générer un PDF à partir des données d'un document
   * Generate PDF from document data
   */
  async generatePDF(
    docData: Document,
    template?: DocumentTemplate,
    options: PDFGenerationOptions = {}
  ): Promise<Blob> {
    try {
      // Créer l'élément HTML pour le PDF
      const element = await this.createPDFElement(docData, template, options)
      
      // Convertir l'élément en canvas
      const canvas = await html2canvas(element, {
        scale: 2,
        useCORS: true,
        allowTaint: true,
        backgroundColor: '#ffffff'
      })

      // Créer le PDF
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4'
      })

      const imgData = canvas.toDataURL('image/png')
      const pdfWidth = pdf.internal.pageSize.getWidth()
      const pdfHeight = (canvas.height * pdfWidth) / canvas.width

      pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight)
      
      return pdf.output('blob')
    } catch (error) {
      console.error('Erreur lors de la génération du PDF:', error)
      throw error
    }
  }

  /**
   * Télécharger le PDF généré
   * Download generated PDF
   */
  async downloadPDF(
    docData: Document,
    template?: DocumentTemplate,
    options: PDFGenerationOptions = {}
  ): Promise<void> {
    try {
      const blob = await this.generatePDF(docData, template, options)
      const url = URL.createObjectURL(blob)
      
      const link = window.document.createElement('a')
      link.href = url
      link.download = `${docData.document_number}.pdf`
      window.document.body.appendChild(link)
      link.click()
      window.document.body.removeChild(link)
      
      URL.revokeObjectURL(url)
    } catch (error) {
      console.error('Erreur lors du téléchargement du PDF:', error)
      throw error
    }
  }

  /**
   * Créer l'élément HTML pour le PDF
   * Create HTML element for PDF
   */
  private async createPDFElement(
    docData: Document,
    template?: DocumentTemplate,
    options: PDFGenerationOptions = {}
  ): Promise<HTMLElement> {
    const container = window.document.createElement('div')
    container.style.cssText = `
      width: 210mm;
      padding: 20mm;
      background: white;
      font-family: Arial, sans-serif;
      color: #333;
    `

    // En-tête avec logo et informations entreprise
    const header = window.document.createElement('div')
    header.style.cssText = `
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      margin-bottom: 30px;
      border-bottom: 2px solid ${template?.color_scheme || '#3b82f6'};
      padding-bottom: 20px;
    `

    // Logo et entreprise
    const companyInfo = window.document.createElement('div')
    if (template?.company_logo_url) {
      const logo = window.document.createElement('img')
      logo.src = template.company_logo_url
      logo.style.cssText = `
        max-height: 50px;
        margin-bottom: 10px;
      `
      companyInfo.appendChild(logo)
    }

    const companyName = window.document.createElement('h1')
    companyName.textContent = template?.company_name || 'Votre Entreprise'
    companyName.style.cssText = `
      margin: 0;
      font-size: 24px;
      font-weight: bold;
      color: ${template?.color_scheme || '#3b82f6'};
    `
    companyInfo.appendChild(companyName)

    if (template?.company_address) {
      const address = window.document.createElement('p')
      address.textContent = template.company_address
      address.style.cssText = 'margin: 5px 0; color: #666;'
      companyInfo.appendChild(address)
    }

    if (template?.company_phone || template?.company_email) {
      const contact = window.document.createElement('p')
      contact.textContent = `${template.company_phone || ''} ${template.company_phone && template.company_email ? '|' : ''} ${template.company_email || ''}`
      contact.style.cssText = 'margin: 5px 0; color: #666;'
      companyInfo.appendChild(contact)
    }

    // Informations document
    const documentInfo = window.document.createElement('div')
    documentInfo.style.cssText = 'text-align: right;'

    const docType = window.document.createElement('div')
    docType.textContent = this.getDocumentTypeLabel(docData.type, options.language || 'fr')
    docType.style.cssText = `
      font-size: 28px;
      font-weight: bold;
      color: ${template?.color_scheme || '#3b82f6'};
      margin-bottom: 10px;
    `
    documentInfo.appendChild(docType)

    const docNumber = window.document.createElement('div')
    docNumber.textContent = `N°: ${docData.document_number}`
    docNumber.style.cssText = 'font-size: 18px; font-weight: bold; margin-bottom: 5px;'
    documentInfo.appendChild(docNumber)

    const docDate = window.document.createElement('div')
    docDate.textContent = `Date: ${new Date(docData.issue_date).toLocaleDateString(options.language || 'fr-FR')}`
    docDate.style.cssText = 'margin-bottom: 5px;'
    documentInfo.appendChild(docDate)

    if (docData.due_date) {
      const dueDate = window.document.createElement('div')
      dueDate.textContent = `Échéance: ${new Date(docData.due_date).toLocaleDateString(options.language || 'fr-FR')}`
      dueDate.style.cssText = 'margin-bottom: 5px;'
      documentInfo.appendChild(dueDate)
    }

    header.appendChild(companyInfo)
    header.appendChild(documentInfo)
    container.appendChild(header)

    // Informations client
    if (docData.client) {
      const clientSection = window.document.createElement('div')
      clientSection.style.cssText = 'margin-bottom: 30px;'

      const clientTitle = window.document.createElement('h3')
      clientTitle.textContent = 'Client:'
      clientTitle.style.cssText = 'margin: 0 0 10px 0; color: #666;'
      clientSection.appendChild(clientTitle)

      const clientInfo = window.document.createElement('div')
      clientInfo.innerHTML = `
        <strong>${docData.client.name}</strong><br>
        ${docData.client.address || ''}<br>
        ${docData.client.city ? `${docData.client.postal_code || ''} ${docData.client.city}` : ''}<br>
        ${docData.client.country || ''}<br>
        ${docData.client.email || ''}<br>
        ${docData.client.phone || ''}
      `
      clientInfo.style.cssText = 'color: #333;'
      clientSection.appendChild(clientInfo)
      container.appendChild(clientSection)
    }

    // Tableau des items
    const table = window.document.createElement('table')
    table.style.cssText = `
      width: 100%;
      border-collapse: collapse;
      margin-bottom: 20px;
    `

    // En-tête tableau
    const thead = window.document.createElement('thead')
    const headerRow = window.document.createElement('tr')
    headerRow.style.cssText = `
      background: ${template?.color_scheme || '#3b82f6'};
      color: white;
    `

    const headers = ['Description', 'Quantité', 'Prix unitaire', 'TVA', 'Total']
    headers.forEach(header => {
      const th = window.document.createElement('th')
      th.textContent = header
      th.style.cssText = `
        padding: 12px;
        text-align: ${header === 'Description' ? 'left' : 'right'};
        border: 1px solid #ddd;
        font-weight: bold;
      `
      headerRow.appendChild(th)
    })

    thead.appendChild(headerRow)
    table.appendChild(thead)

    // Corps tableau
    const tbody = window.document.createElement('tbody')
    docData.items?.forEach(item => {
      const row = window.document.createElement('tr')
      row.style.cssText = 'border-bottom: 1px solid #ddd;'

      const cells = [
        item.description,
        item.quantity.toString(),
        `CHF ${item.unit_price.toFixed(2)}`,
        `${item.tax_rate}%`,
        `CHF ${item.total_amount.toFixed(2)}`
      ]

      cells.forEach((cell, index) => {
        const td = window.document.createElement('td')
        td.textContent = cell
        td.style.cssText = `
          padding: 12px;
          text-align: ${index === 0 ? 'left' : 'right'};
          border: 1px solid #ddd;
        `
        row.appendChild(td)
      })

      tbody.appendChild(row)
    })

    table.appendChild(tbody)
    container.appendChild(table)

    // Totaux
    const totals = window.document.createElement('div')
    totals.style.cssText = `
      display: flex;
      justify-content: flex-end;
      margin-bottom: 30px;
    `

    const totalsBox = window.document.createElement('div')
    totalsBox.style.cssText = `
      border: 2px solid ${template?.color_scheme || '#3b82f6'};
      padding: 15px;
      min-width: 200px;
    `

    const subtotal = window.document.createElement('div')
    subtotal.style.cssText = 'display: flex; justify-content: space-between; margin-bottom: 5px;'
    subtotal.innerHTML = `<span>Sous-total:</span><span>CHF ${docData.subtotal.toFixed(2)}</span>`
    totalsBox.appendChild(subtotal)

    const tax = window.document.createElement('div')
    tax.style.cssText = 'display: flex; justify-content: space-between; margin-bottom: 5px;'
    tax.innerHTML = `<span>TVA:</span><span>CHF ${docData.tax_amount.toFixed(2)}</span>`
    totalsBox.appendChild(tax)

    const total = window.document.createElement('div')
    total.style.cssText = `
      display: flex;
      justify-content: space-between;
      font-weight: bold;
      font-size: 18px;
      border-top: 1px solid #ddd;
      padding-top: 10px;
      margin-top: 10px;
    `
    total.innerHTML = `<span>Total:</span><span>CHF ${docData.total_amount.toFixed(2)}</span>`
    totalsBox.appendChild(total)

    totals.appendChild(totalsBox)
    container.appendChild(totals)

    // Notes
    if (docData.notes) {
      const notes = window.document.createElement('div')
      notes.style.cssText = 'margin-bottom: 20px;'
      
      const notesTitle = window.document.createElement('h4')
      notesTitle.textContent = 'Notes:'
      notesTitle.style.cssText = 'margin: 0 0 10px 0; color: #666;'
      notes.appendChild(notesTitle)

      const notesText = window.document.createElement('p')
      notesText.textContent = docData.notes
      notesText.style.cssText = 'margin: 0; color: #333;'
      notes.appendChild(notesText)
      
      container.appendChild(notes)
    }

    // Conditions et footer
    if (template?.terms_conditions || template?.footer_text) {
      const footer = window.document.createElement('div')
      footer.style.cssText = `
        border-top: 1px solid #ddd;
        padding-top: 20px;
        margin-top: 30px;
        font-size: 12px;
        color: #666;
      `

      if (template.terms_conditions) {
        const terms = window.document.createElement('div')
        terms.innerHTML = `<strong>Conditions:</strong><br>${template.terms_conditions}`
        terms.style.cssText = 'margin-bottom: 10px;'
        footer.appendChild(terms)
      }

      if (template.footer_text) {
        const footerText = window.document.createElement('div')
        footerText.textContent = template.footer_text
        footer.appendChild(footerText)
      }

      container.appendChild(footer)
    }

    return container
  }

  /**
   * Obtenir le libellé du type de document selon la langue
   * Get document type label by language
   */
  private getDocumentTypeLabel(type: string, language: string): string {
    const labels = {
      fr: {
        invoice: 'FACTURE',
        quote: 'DEVIS',
        delivery_note: 'BON DE LIVRAISON',
        po: 'COMMANDE FOURNISSEUR',
        reminder: 'RAPPEL',
        receipt: 'REÇU'
      },
      de: {
        invoice: 'RECHNUNG',
        quote: 'ANGEBOT',
        delivery_note: 'LIEFERSCHEIN',
        po: 'BESTELLUNG',
        reminder: 'ERINNERUNG',
        receipt: 'QUITTUNG'
      },
      en: {
        invoice: 'INVOICE',
        quote: 'QUOTE',
        delivery_note: 'DELIVERY NOTE',
        po: 'PURCHASE ORDER',
        reminder: 'REMINDER',
        receipt: 'RECEIPT'
      }
    }

    return labels[language as keyof typeof labels]?.[type as keyof typeof labels.fr] || type.toUpperCase()
  }
}

export const pdfService = new PDFService()
