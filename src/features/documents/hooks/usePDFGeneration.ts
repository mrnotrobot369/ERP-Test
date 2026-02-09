/**
 * Hook pour la génération de PDF
 * Hook for PDF generation
 */

import { useState, useCallback } from 'react'
import { pdfService } from '../services/pdfService'
import type { Document, DocumentTemplate, PDFGenerationOptions } from '../types/document'

export function usePDFGeneration() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Générer un PDF
  const generatePDF = useCallback(async (
    document: Document,
    template?: DocumentTemplate,
    options?: PDFGenerationOptions
  ): Promise<Blob> => {
    try {
      setLoading(true)
      setError(null)
      
      return await pdfService.generatePDF(document, template, options)
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erreur lors de la génération du PDF'
      setError(errorMessage)
      throw err
    } finally {
      setLoading(false)
    }
  }, [])

  // Télécharger un PDF
  const downloadPDF = useCallback(async (
    document: Document,
    template?: DocumentTemplate,
    options?: PDFGenerationOptions
  ): Promise<void> => {
    try {
      setLoading(true)
      setError(null)
      
      await pdfService.downloadPDF(document, template, options)
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erreur lors du téléchargement du PDF'
      setError(errorMessage)
      throw err
    } finally {
      setLoading(false)
    }
  }, [])

  // Réinitialiser les erreurs
  const clearError = useCallback(() => {
    setError(null)
  }, [])

  return {
    loading,
    error,
    generatePDF,
    downloadPDF,
    clearError
  }
}
