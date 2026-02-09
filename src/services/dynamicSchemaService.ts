/**
 * Service pour le moteur de schéma dynamique
 * Dynamic Schema Engine Service
 */

import { supabase } from '@/lib/supabase'
import { logger } from '@/lib/logger'
import type { CustomField, CustomFieldValue, BusinessSector, SchemaDefinition } from '@/types/multi-sector'

export interface DynamicSchemaConfig {
  sector: BusinessSector
  entityType: 'document' | 'client' | 'product' | 'service'
  fields: CustomField[]
}

class DynamicSchemaService {
  private cache = new Map<string, CustomField[]>()
  private cacheExpiry = new Map<string, number>()
  private readonly CACHE_TTL = 5 * 60 * 1000 // 5 minutes

  /**
   * Récupérer les champs personnalisés pour un secteur et type d'entité
   */
  async getCustomFields(sector: BusinessSector, entityType: string): Promise<CustomField[]> {
    const cacheKey = `${sector}_${entityType}`

    // Vérifier le cache
    const cached = this.cache.get(cacheKey)
    const expiry = this.cacheExpiry.get(cacheKey)

    if (cached && expiry && Date.now() < expiry) {
      logger.debug(`Champs personnalisés récupérés du cache: ${cacheKey}`, 'DynamicSchemaService')
      return cached
    }

    try {
      const { data, error } = await supabase
        .from('custom_fields')
        .select('*')
        .eq('sector', sector)
        .eq('entity_type', entityType)
        .order('name')

      if (error) throw error

      const fields = (data || []) as CustomField[]

      // Mettre en cache
      this.cache.set(cacheKey, fields)
      this.cacheExpiry.set(cacheKey, Date.now() + this.CACHE_TTL)

      logger.info(`Champs personnalisés chargés: ${fields.length} pour ${cacheKey}`, 'DynamicSchemaService')
      return fields
    } catch (error) {
      logger.error('Erreur lors de la récupération des champs personnalisés', 'DynamicSchemaService', error)
      return []
    }
  }

  /**
   * Ajouter un champ personnalisé
   */
  async addCustomField(field: Omit<CustomField, 'id'>): Promise<CustomField> {
    try {
      const { data, error } = await supabase
        .from('custom_fields')
        .insert({
          ...field,
          created_at: new Date().toISOString(),
        })
        .select()
        .single()

      if (error) throw error

      const newField = data as CustomField

      // Invalider le cache
      this.invalidateCache(field.sector, field.entity_type)

      logger.info(`Champ personnalisé ajouté: ${newField.name}`, 'DynamicSchemaService', newField)
      return newField
    } catch (error) {
      logger.error('Erreur lors de l\'ajout du champ personnalisé', 'DynamicSchemaService', error)
      throw error
    }
  }

  /**
   * Mettre à jour un champ personnalisé
   */
  async updateCustomField(id: string, updates: Partial<CustomField>): Promise<CustomField> {
    try {
      const { data, error } = await supabase
        .from('custom_fields')
        .update(updates)
        .eq('id', id)
        .select()
        .single()

      if (error) throw error

      const updatedField = data as CustomField

      // Invalider le cache
      this.invalidateCache(updatedField.sector, updatedField.entity_type)

      logger.info(`Champ personnalisé mis à jour: ${updatedField.name}`, 'DynamicSchemaService', updatedField)
      return updatedField
    } catch (error) {
      logger.error('Erreur lors de la mise à jour du champ personnalisé', 'DynamicSchemaService', error)
      throw error
    }
  }

  /**
   * Supprimer un champ personnalisé
   */
  async deleteCustomField(id: string): Promise<void> {
    try {
      // Récupérer le champ avant suppression pour invalider le cache
      const { data: field } = await supabase
        .from('custom_fields')
        .select('sector, entity_type')
        .eq('id', id)
        .single()

      const { error } = await supabase
        .from('custom_fields')
        .delete()
        .eq('id', id)

      if (error) throw error

      // Invalider le cache
      if (field) {
        this.invalidateCache(field.sector, field.entity_type)
      }

      logger.info(`Champ personnalisé supprimé: ${id}`, 'DynamicSchemaService')
    } catch (error) {
      logger.error('Erreur lors de la suppression du champ personnalisé', 'DynamicSchemaService', error)
      throw error
    }
  }

  /**
   * Récupérer les valeurs des champs personnalisés pour une entité
   */
  async getCustomFieldValues(entityId: string): Promise<CustomFieldValue[]> {
    try {
      const { data, error } = await supabase
        .from('custom_field_values')
        .select('*')
        .eq('entity_id', entityId)

      if (error) throw error

      return (data || []) as CustomFieldValue[]
    } catch (error) {
      logger.error('Erreur lors de la récupération des valeurs personnalisées', 'DynamicSchemaService', error)
      return []
    }
  }

  /**
   * Sauvegarder les valeurs des champs personnalisés
   */
  async saveCustomFieldValues(
    entityId: string,
    values: Record<string, any>,
    sector: BusinessSector,
    entityType: string
  ): Promise<void> {
    try {
      // Récupérer les champs pour validation
      const fields = await this.getCustomFields(sector, entityType)

      // Supprimer les anciennes valeurs
      await supabase
        .from('custom_field_values')
        .delete()
        .eq('entity_id', entityId)

      // Insérer les nouvelles valeurs
      const valuesToInsert = Object.entries(values).map(([fieldId, value]) => {
        const field = fields.find(f => f.id === fieldId)
        if (!field) return null

        // Validation
        this.validateFieldValue(value, field)

        return {
          field_id: fieldId,
          value: this.serializeValue(value, field.type),
          entity_id: entityId,
        }
      }).filter(Boolean)

      if (valuesToInsert.length > 0) {
        const { error } = await supabase
          .from('custom_field_values')
          .insert(valuesToInsert)

        if (error) throw error
      }

      logger.info(`Valeurs personnalisées sauvegardées: ${valuesToInsert.length} pour ${entityId}`, 'DynamicSchemaService')
    } catch (error) {
      logger.error('Erreur lors de la sauvegarde des valeurs personnalisées', 'DynamicSchemaService', error)
      throw error
    }
  }

  /**
   * Valider une valeur selon le champ
   */
  private validateFieldValue(value: string | number | boolean | Date | null | undefined, field: CustomField): void {
    if (field.required && (value === null || value === undefined || value === '')) {
      throw new Error(`Le champ "${field.name}" est requis`)
    }

    if (value === null || value === undefined || value === '') return

    switch (field.type) {
      case 'number':
        const num = Number(value)
        if (isNaN(num)) {
          throw new Error(`Le champ "${field.name}" doit être un nombre`)
        }
        if (field.validation?.min !== undefined && num < field.validation.min) {
          throw new Error(`Le champ "${field.name}" doit être supérieur à ${field.validation.min}`)
        }
        if (field.validation?.max !== undefined && num > field.validation.max) {
          throw new Error(`Le champ "${field.name}" doit être inférieur à ${field.validation.max}`)
        }
        break

      case 'email':
        const emailStr = String(value)
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
        if (!emailRegex.test(emailStr)) {
          throw new Error(`Le champ "${field.name}" doit être un email valide`)
        }
        break

      case 'phone':
        const phoneStr = String(value)
        const phoneRegex = /^[\d\s\+\-\(\)]+$/
        if (!phoneRegex.test(phoneStr)) {
          throw new Error(`Le champ "${field.name}" doit être un numéro de téléphone valide`)
        }
        break

      case 'select':
        if (field.options && !field.options.includes(String(value))) {
          throw new Error(`Le champ "${field.name}" doit être une des options: ${field.options.join(', ')}`)
        }
        break

      case 'date':
        if (value instanceof Date) {
          if (isNaN(value.getTime())) {
            throw new Error(`Le champ "${field.name}" doit être une date valide`)
          }
        } else {
          const date = new Date(String(value))
          if (isNaN(date.getTime())) {
            throw new Error(`Le champ "${field.name}" doit être une date valide`)
          }
        }
        break
    }

    if (field.validation?.pattern) {
      const regex = new RegExp(field.validation.pattern)
      if (!regex.test(String(value))) {
        throw new Error(`Le champ "${field.name}" ne correspond pas au format requis`)
      }
    }
  }

  /**
   * Sérialiser une valeur pour le stockage
   */
  private serializeValue(value: string | number | boolean | Date | null | undefined, fieldType: string): string {
    switch (fieldType) {
      case 'number':
        return String(Number(value))
      case 'boolean':
        return String(Boolean(value))
      case 'date':
        return value instanceof Date ? value.toISOString() : new Date(String(value)).toISOString()
      default:
        return String(value)
    }
  }

  /**
   * Désérialiser une valeur depuis le stockage
   */
  deserializeValue(value: string, fieldType: string): CustomFieldValue['value'] {
    switch (fieldType) {
      case 'number':
        return Number(value)
      case 'boolean':
        return value === 'true'
      case 'date':
        return new Date(value)
      default:
        return value
    }
  }

  /**
   * Obtenir la définition complète du schéma pour un secteur
   */
  async getSchemaDefinition(sector: BusinessSector): Promise<SchemaDefinition[]> {
    const entityTypes = ['document', 'client', 'product', 'service'] as const
    const schemas: SchemaDefinition[] = []

    for (const entityType of entityTypes) {
      const fields = await this.getCustomFields(sector, entityType)

      schemas.push({
        entity_type: entityType,
        sector,
        base_fields: this.getBaseFields(entityType),
        custom_fields: fields,
        validation_rules: this.getValidationRules(fields),
      })
    }

    return schemas
  }

  /**
   * Obtenir les champs de base pour un type d'entité
   */
  private getBaseFields(entityType: string): Record<string, { type: string; required: boolean }> {
    const baseFields: Record<string, Record<string, { type: string; required: boolean }>> = {
      document: {
        id: { type: 'string', required: true },
        type: { type: 'string', required: true },
        document_number: { type: 'string', required: true },
        client_id: { type: 'string', required: true },
        status: { type: 'string', required: true },
        issue_date: { type: 'date', required: true },
        total_amount: { type: 'number', required: true },
      },
      client: {
        id: { type: 'string', required: true },
        name: { type: 'string', required: true },
        email: { type: 'email', required: false },
        phone: { type: 'phone', required: false },
      },
      product: {
        id: { type: 'string', required: true },
        name: { type: 'string', required: true },
        selling_price: { type: 'number', required: true },
        stock_quantity: { type: 'number', required: false },
      },
      service: {
        id: { type: 'string', required: true },
        name: { type: 'string', required: true },
        description: { type: 'text', required: false },
        duration: { type: 'number', required: false },
      },
    }

    return baseFields[entityType] || {}
  }

  /**
   * Obtenir les règles de validation pour les champs personnalisés
   */
  private getValidationRules(fields: CustomField[]): Record<string, SchemaDefinition['validation_rules'][string]> {
    const rules: Record<string, SchemaDefinition['validation_rules'][string]> = {}

    fields.forEach(field => {
      rules[field.id] = {
        required: field.required,
        type: field.type,
        validation: field.validation,
        options: field.options || undefined,
      }
    })

    return rules
  }

  /**
   * Invalider le cache
   */
  private invalidateCache(sector: BusinessSector, entityType: string): void {
    const cacheKey = `${sector}_${entityType}`
    this.cache.delete(cacheKey)
    this.cacheExpiry.delete(cacheKey)
  }

  /**
   * Vider tout le cache
   */
  clearCache(): void {
    this.cache.clear()
    this.cacheExpiry.clear()
    logger.info('Cache des schémas dynamiques vidé', 'DynamicSchemaService')
  }
}

export const dynamicSchemaService = new DynamicSchemaService()
export default dynamicSchemaService
