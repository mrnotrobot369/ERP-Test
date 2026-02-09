/**
 * Hook pour la gestion des documents
 * Hook for document management
 */

import { useState, useEffect, useCallback } from 'react'
import { documentService } from '../services/documentService'
import type {
  Document,
  DocumentFilters,
  Pagination,
  SortOption,
  DocumentSummary
} from '../types/document'

export function useDocuments() {
  const [documents, setDocuments] = useState<DocumentSummary[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [pagination, setPagination] = useState<Pagination>({
    page: 1,
    limit: 20,
    total: 0,
    totalPages: 0
  })
  const [filters, setFilters] = useState<DocumentFilters>({})
  const [sort, setSort] = useState<SortOption>({
    field: 'issue_date',
    direction: 'desc'
  })

  // Charger les documents
  const loadDocuments = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)

      const result = await documentService.getDocuments(filters, pagination, sort)
      setDocuments(result.documents)
      setPagination(result.pagination)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur lors du chargement des documents')
      console.error('Erreur lors du chargement des documents:', err)
    } finally {
      setLoading(false)
    }
  }, [filters, pagination, sort])

  // Charger au montage et quand les filtres changent
  useEffect(() => {
    loadDocuments()
  }, [loadDocuments])

  // Créer un document
  const createDocument = useCallback(async (formData: any) => {
    try {
      setLoading(true)
      const newDocument = await documentService.createDocument(formData)
      const summary: DocumentSummary = {
        id: newDocument.id,
        type: newDocument.type,
        document_number: newDocument.document_number,
        status: newDocument.status,
        issue_date: newDocument.issue_date,
        due_date: newDocument.due_date,
        total_amount: newDocument.total_amount,
        client_name: newDocument.client?.name,
        client_email: newDocument.client?.email,
        item_count: newDocument.items?.length || 0
      }
      setDocuments(prev => [summary, ...prev])
      return newDocument
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur lors de la création du document')
      throw err
    } finally {
      setLoading(false)
    }
  }, [])

  // Mettre à jour un document
  const updateDocument = useCallback(async (id: string, formData: any) => {
    try {
      setLoading(true)
      const updatedDocument = await documentService.updateDocument(id, formData)
      const summary: DocumentSummary = {
        id: updatedDocument.id,
        type: updatedDocument.type,
        document_number: updatedDocument.document_number,
        status: updatedDocument.status,
        issue_date: updatedDocument.issue_date,
        due_date: updatedDocument.due_date,
        total_amount: updatedDocument.total_amount,
        client_name: updatedDocument.client?.name,
        client_email: updatedDocument.client?.email,
        item_count: updatedDocument.items?.length || 0
      }
      setDocuments(prev =>
        prev.map(doc => doc.id === id ? summary : doc)
      )
      return updatedDocument
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur lors de la mise à jour du document')
      throw err
    } finally {
      setLoading(false)
    }
  }, [])

  // Supprimer un document
  const deleteDocument = useCallback(async (id: string) => {
    try {
      setLoading(true)
      await documentService.deleteDocument(id)
      setDocuments(prev => prev.filter(doc => doc.id !== id))
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur lors de la suppression du document')
      throw err
    } finally {
      setLoading(false)
    }
  }, [])

  // Supprimer plusieurs documents
  const bulkDelete = useCallback(async (ids: string[]) => {
    try {
      setLoading(true)
      await documentService.bulkDeleteDocuments(ids)
      setDocuments(prev => prev.filter(doc => !ids.includes(doc.id)))
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur lors de la suppression multiple')
      throw err
    } finally {
      setLoading(false)
    }
  }, [])

  // Mettre à jour le statut
  const updateStatus = useCallback(async (id: string, status: Document['status'], paidDate?: string) => {
    try {
      setLoading(true)
      await documentService.updateDocumentStatus(id, status, paidDate)
      setDocuments(prev =>
        prev.map(doc =>
          doc.id === id
            ? { ...doc, status, paid_date: paidDate }
            : doc
        )
      )
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur lors de la mise à jour du statut')
      throw err
    } finally {
      setLoading(false)
    }
  }, [])

  // Générer un numéro de document
  const generateDocumentNumber = useCallback(async (type: Document['type']) => {
    try {
      return await documentService.generateDocumentNumber(type)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur lors de la génération du numéro')
      throw err
    }
  }, [])

  // Changer de page
  const changePage = useCallback((page: number) => {
    setPagination(prev => ({ ...prev, page }))
  }, [])

  // Changer les filtres
  const changeFilters = useCallback((newFilters: DocumentFilters) => {
    setFilters(newFilters)
    setPagination(prev => ({ ...prev, page: 1 })) // Reset à la première page
  }, [])

  // Changer le tri
  const changeSort = useCallback((newSort: SortOption) => {
    setSort(newSort)
  }, [])

  // Réinitialiser les filtres
  const resetFilters = useCallback(() => {
    setFilters({})
    setPagination(prev => ({ ...prev, page: 1 }))
  }, [])

  return {
    // Données
    documents,
    loading,
    error,
    pagination,
    filters,
    sort,

    // Actions
    loadDocuments,
    createDocument,
    updateDocument,
    deleteDocument,
    updateStatus,
    bulkDelete,
    generateDocumentNumber,

    // Navigation
    changePage,
    changeFilters,
    changeSort,
    resetFilters
  }
}
