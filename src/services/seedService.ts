/**
 * Service pour l'injection de données de démonstration
 * Service for seeding demo data
 */

import { supabase } from '@/lib/supabase'
import { documentService } from '@/features/documents/services/documentService'
import { toast } from 'sonner'
import { logger } from '@/lib/logger'

export const seedService = {
    /**
     * Génère un jeu complet de données de test pour l'utilisateur actuel
     */
    async seedDemoData(userId: string) {
        try {
            logger.info('Démarrage de l\'injection de données', 'seedService', { userId })

            // 1. Créer des clients
            const clientsData = [
                { name: 'Tech Solutions SA', email: 'contact@techsolutions.ch', phone: '+41 22 123 45 67', address: 'Rue de Lausanne 12, Genève' },
                { name: 'Menuiserie Dubois', email: 'info@dubois-bois.ch', phone: '+41 21 987 65 43', address: 'Avenue de la Gare 5, Morges' },
                { name: 'Cabinet Médical Santé', email: 'secretariat@sante-cabinet.ch', phone: '+41 24 555 00 11', address: 'Ruelle du Port 2, Vevey' },
                { name: 'Garage du Centre', email: 'atelier@garage-centre.ch', phone: '+41 26 444 88 99', address: 'Route Cantonale 88, Fribourg' }
            ]

            const { data: insertedClients, error: clientError } = await supabase
                .from('clients')
                .insert(clientsData.map(c => ({ ...c, user_id: userId })))
                .select()

            if (clientError) throw clientError
            logger.info('Clients créés', 'seedService', { count: insertedClients?.length })

            // 2. Créer des produits
            const productsData = [
                { name: 'Installation Réseau', selling_price: 1500, category: 'Service', cost_price: 500, reference: 'SRV-001' },
                { name: 'Maintenance Mensuelle', selling_price: 250, category: 'Abonnement', cost_price: 50, reference: 'ABO-001' },
                { name: 'Serveur NAS 4 To', selling_price: 850, category: 'Hardware', cost_price: 600, reference: 'HW-056' },
                { name: 'Audit de Sécurité', selling_price: 3200, category: 'Consulting', cost_price: 1000, reference: 'SRV-002' },
                { name: 'Licence Logiciel Pro', selling_price: 45, category: 'Software', cost_price: 20, reference: 'LIC-001' }
            ]

            const { data: insertedProducts, error: productError } = await supabase
                .from('products')
                .insert(productsData.map(p => ({ ...p, user_id: userId })))
                .select()

            if (productError) throw productError
            logger.info('Produits créés', 'seedService', { count: insertedProducts?.length })

            // 3. Créer des documents (Factures et Devis)
            const now = new Date()
            const documentsToCreate: any[] = [
                {
                    type: 'invoice',
                    client_id: (insertedClients as any)[0].id,
                    status: 'paid',
                    issue_date: new Date(now.getFullYear(), now.getMonth(), 5).toISOString(),
                    due_date: new Date(now.getFullYear(), now.getMonth(), 25).toISOString(),
                    notes: 'Facture de test - Payée',
                    items: [
                        { description: 'Installation Réseau', quantity: 1, unit_price: 1500, tax_rate: 8.1 },
                        { description: 'Licence Logiciel Pro', quantity: 5, unit_price: 45, tax_rate: 8.1 }
                    ]
                },
                {
                    type: 'invoice',
                    client_id: (insertedClients as any)[1].id,
                    status: 'sent',
                    issue_date: new Date().toISOString(),
                    due_date: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000).toISOString(),
                    notes: 'En attente de paiement',
                    items: [
                        { description: 'Maintenance Mensuelle', quantity: 1, unit_price: 250, tax_rate: 8.1 }
                    ]
                },
                {
                    type: 'quote',
                    client_id: (insertedClients as any)[2].id,
                    status: 'draft',
                    issue_date: new Date().toISOString(),
                    due_date: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
                    notes: 'Brouillon de devis',
                    items: [
                        { description: 'Audit de Sécurité', quantity: 1, unit_price: 3200, tax_rate: 8.1 },
                        { description: 'Licence Logiciel Pro', quantity: 2, unit_price: 45, tax_rate: 8.1 }
                    ]
                },
                {
                    type: 'invoice',
                    client_id: (insertedClients as any)[3].id,
                    status: 'overdue',
                    issue_date: new Date(now.getFullYear(), now.getMonth() - 1, 1).toISOString(),
                    due_date: new Date(now.getFullYear(), now.getMonth() - 1, 15).toISOString(),
                    notes: 'Facture en retard',
                    items: [
                        { description: 'Serveur NAS 4 To', quantity: 2, unit_price: 850, tax_rate: 8.1 }
                    ]
                }
            ]

            for (const doc of documentsToCreate) {
                const docNum = await documentService.generateDocumentNumber(doc.type)
                await documentService.createDocument({
                    ...doc,
                    user_id: userId,
                    document_number: docNum
                } as any)
            }

            logger.info('Documents créés', 'seedService', { count: documentsToCreate.length })
            toast.success('Données de démonstration générées avec succès !')

            return true
        } catch (error) {
            logger.error('Erreur lors du seeding', 'seedService', error)
            toast.error('Erreur lors de la génération des données')
            return false
        }
    }
}
