import { z } from 'zod'

/**
 * Schéma Zod pour la validation d'une facture.
 * Correspond à la structure de la table `factures` Supabase.
 */
export const factureSchema = z.object({
    number: z
        .string()
        .min(1, 'Le numéro de facture est requis')
        .max(50, 'Le numéro ne peut pas dépasser 50 caractères'),
    client_id: z
        .string()
        .min(1, 'Le client est requis'),
    status: z
        .enum(['draft', 'sent', 'paid'])
        .default('draft'),
    total_ht: z
        .number()
        .min(0, 'Le montant HT doit être positif'),
    total_ttc: z
        .number()
        .min(0, 'Le montant TTC doit être positif'),
    due_date: z
        .string()
        .nullable()
        .optional()
        .or(z.literal('')),
})

/** Type inféré du schéma facture */
export type FactureFormData = z.infer<typeof factureSchema>

/**
 * Transforme les valeurs pour Supabase.
 */
export function transformFactureData(data: FactureFormData) {
    return {
        number: data.number,
        client_id: data.client_id,
        status: data.status,
        total_ht: data.total_ht,
        total_ttc: data.total_ttc,
        due_date: data.due_date || null,
    }
}

/** Labels pour les statuts */
export const STATUS_OPTIONS = [
    { value: 'draft', label: 'Brouillon' },
    { value: 'sent', label: 'Envoyée' },
    { value: 'paid', label: 'Payée' },
] as const
