import { z } from 'zod'

/**
 * Schéma Zod pour la validation d'un client.
 * Correspond à la structure de la table `clients` Supabase.
 */
export const clientSchema = z.object({
  name: z
    .string()
    .min(1, 'Le nom est requis')
    .max(100, 'Le nom ne peut pas dépasser 100 caractères'),
  email: z
    .string()
    .email('Email invalide')
    .nullable()
    .optional()
    .or(z.literal('')),
  phone: z
    .string()
    .max(20, 'Le téléphone ne peut pas dépasser 20 caractères')
    .nullable()
    .optional()
    .or(z.literal('')),
  address: z
    .string()
    .max(200, 'L\'adresse ne peut pas dépasser 200 caractères')
    .nullable()
    .optional()
    .or(z.literal('')),
})

/** Type inféré du schéma client */
export type ClientFormData = z.infer<typeof clientSchema>

/**
 * Transforme les valeurs vides en null pour Supabase.
 */
export function transformClientData(data: ClientFormData) {
  return {
    name: data.name,
    email: data.email || null,
    phone: data.phone || null,
    address: data.address || null,
  }
}
