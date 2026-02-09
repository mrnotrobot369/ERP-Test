/**
 * Hook pour la gestion du formulaire de document
 * Hook for document form management
 */

import { useState, useCallback, useEffect } from 'react'
import { documentService } from '../services/documentService'
import type {
  DocumentFormData,
  DocumentItemFormData,
  DocumentTemplate,
  Client
} from '../types/document'

export function useDocumentForm(documentId?: string) {
  const [formData, setFormData] = useState<DocumentFormData>({
    type: 'invoice',
    document_number: '',
    issue_date: new Date().toISOString().slice(0, 10),
    due_date: '',
    notes: '',
    items: [
      {
        description: '',
        quantity: 1,
        unit_price: 0,
        tax_rate: 7.7
      }
    ]
  })

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [clients, setClients] = useState<Client[]>([])
  const [templates, setTemplates] = useState<DocumentTemplate[]>([])
  const [selectedTemplate, setSelectedTemplate] = useState<DocumentTemplate | null>(null)

  // Charger les clients et modèles
  useEffect(() => {
    const loadData = async () => {
      try {
        const [clientsData, templatesData] = await Promise.all([
          documentService.getClients(),
          documentService.getTemplates()
        ])
        setClients(clientsData)
        setTemplates(templatesData)
      } catch (err) {
        console.error('Erreur lors du chargement des données:', err)
      }
    }

    loadData()
  }, [])

  // Charger le document si en mode édition
  useEffect(() => {
    if (documentId) {
      const loadDocument = async () => {
        try {
          setLoading(true)
          const document = await documentService.getDocument(documentId)
          if (document) {
            setFormData({
              type: document.type,
              client_id: document.client_id ?? undefined,
              document_number: document.document_number,
              issue_date: document.issue_date,
              due_date: document.due_date ?? '',
              notes: document.notes ?? '',
              items: document.items?.map((item: any) => ({
                description: item.description,
                quantity: item.quantity,
                unit_price: item.unit_price,
                tax_rate: item.tax_rate
              })) || []
            })
          }
        } catch (err) {
          setError(err instanceof Error ? err.message : 'Erreur lors du chargement du document')
        } finally {
          setLoading(false)
        }
      }

      loadDocument()
    }
  }, [documentId])

  // Mettre à jour un champ du formulaire
  const updateField = useCallback((field: keyof DocumentFormData, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
  }, [])

  // Ajouter un item
  const addItem = useCallback(() => {
    setFormData(prev => ({
      ...prev,
      items: [
        ...prev.items,
        {
          description: '',
          quantity: 1,
          unit_price: 0,
          tax_rate: 7.7
        }
      ]
    }))
  }, [])

  // Mettre à jour un item
  const updateItem = useCallback((index: number, field: keyof DocumentItemFormData, value: any) => {
    setFormData(prev => ({
      ...prev,
      items: prev.items.map((item, i) =>
        i === index ? { ...item, [field]: value } : item
      )
    }))
  }, [])

  // Supprimer un item
  const removeItem = useCallback((index: number) => {
    setFormData(prev => ({
      ...prev,
      items: prev.items.filter((_, i) => i !== index)
    }))
  }, [])

  // Calculer les totaux
  const totals = useCallback(() => {
    const subtotal = formData.items.reduce((sum, item) =>
      sum + (item.quantity * item.unit_price), 0
    )
    const taxAmount = formData.items.reduce((sum, item) =>
      sum + (item.quantity * item.unit_price * item.tax_rate / 100), 0
    )
    const total = subtotal + taxAmount

    return { subtotal, taxAmount, total }
  }, [formData.items])

  // Valider le formulaire
  const validate = useCallback(() => {
    const errors: string[] = []

    if (!formData.document_number.trim()) {
      errors.push('Le numéro de document est requis')
    }

    if (!formData.issue_date) {
      errors.push('La date d\'émission est requise')
    }

    if (formData.items.length === 0) {
      errors.push('Au moins un article est requis')
    }

    for (let i = 0; i < formData.items.length; i++) {
      const item = formData.items[i]
      if (item && !item.description.trim()) {
        errors.push(`La description de l'article ${i + 1} est requise`)
      }
      if (item && item.quantity <= 0) {
        errors.push(`La quantité de l'article ${i + 1} doit être supérieure à 0`)
      }
      if (item && item.unit_price < 0) {
        errors.push(`Le prix unitaire de l'article ${i + 1} doit être positif`)
      }
    }

    return errors
  }, [formData])

  // Sauvegarder le document
  const save = useCallback(async () => {
    const errors = validate()
    if (errors.length > 0) {
      setError(errors.join(', '))
      return null
    }

    try {
      setLoading(true)
      setError(null)

      if (documentId) {
        return await documentService.updateDocument(documentId, formData)
      } else {
        return await documentService.createDocument(formData)
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erreur lors de la sauvegarde'
      setError(errorMessage)
      throw err
    } finally {
      setLoading(false)
    }
  }, [formData, documentId, validate])

  // Générer un numéro automatiquement
  const generateNumber = useCallback(async () => {
    try {
      const number = await documentService.generateDocumentNumber(formData.type)
      updateField('document_number', number)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur lors de la génération du numéro')
    }
  }, [formData.type, updateField])

  // Appliquer un modèle
  const applyTemplate = useCallback((template: DocumentTemplate) => {
    setSelectedTemplate(template)
    setFormData(prev => ({
      ...prev,
      notes: template.terms_conditions || prev.notes
    }))
  }, [])

  return {
    // État
    formData,
    loading,
    error,
    clients,
    templates,
    selectedTemplate,
    totals: totals(),

    // Actions
    updateField,
    addItem,
    updateItem,
    removeItem,
    save,
    generateNumber,
    applyTemplate,
    validate
  }
}
