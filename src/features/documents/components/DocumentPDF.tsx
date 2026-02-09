/**
 * Composant pour l'affichage visuel du document (Format PDF/A4)
 * Component for visual document display suitable for PDF generation
 */

import React from 'react'
import { format } from 'date-fns'
import { fr } from 'date-fns/locale'
import type { Document, DocumentTemplate } from '../types/document'

interface DocumentPDFProps {
    document: Document
    template?: DocumentTemplate
}

const TYPE_LABELS: Record<string, string> = {
    invoice: 'FACTURE',
    quote: 'DEVIS',
    delivery_note: 'BON DE LIVRAISON',
    po: 'COMMANDE',
    reminder: 'RAPPEL',
    receipt: 'REÇU'
}

export const DocumentPDF = React.forwardRef<HTMLDivElement, DocumentPDFProps>(
    ({ document, template }, ref) => {
        const primaryColor = template?.color_scheme || '#3b82f6'

        const formatCurrency = (amount: number) => {
            return new Intl.NumberFormat('fr-CH', {
                style: 'currency',
                currency: 'CHF'
            }).format(amount)
        }

        return (
            <div
                ref={ref}
                className="bg-white p-8 md:p-12 shadow-sm mx-auto overflow-hidden"
                style={{ width: '210mm', minHeight: '297mm', fontFamily: 'Inter, system-ui, sans-serif' }}
            >
                {/* Header */}
                <div className="flex justify-between items-start mb-12">
                    <div>
                        {template?.company_logo_url ? (
                            <img src={template.company_logo_url} alt="Logo" className="h-16 w-auto mb-4 object-contain" />
                        ) : (
                            <div
                                className="h-12 w-12 rounded flex items-center justify-center text-white font-bold text-xl mb-4"
                                style={{ backgroundColor: primaryColor }}
                            >
                                {template?.company_name?.charAt(0) || 'D'}
                            </div>
                        )}
                        <div className="text-sm">
                            <h2 className="font-bold text-lg">{template?.company_name || 'Ma Société'}</h2>
                            <div className="text-muted-foreground whitespace-pre-line">
                                {template?.company_address}
                                {template?.company_phone && `\n${template.company_phone}`}
                                {template?.company_email && `\n${template.company_email}`}
                            </div>
                        </div>
                    </div>

                    <div className="text-right">
                        <h1
                            className="text-3xl font-black mb-2"
                            style={{ color: primaryColor }}
                        >
                            {TYPE_LABELS[document.type] || 'DOCUMENT'}
                        </h1>
                        <div className="text-sm">
                            <p><span className="font-semibold">N° :</span> {document.document_number}</p>
                            <p><span className="font-semibold">Date :</span> {format(new Date(document.issue_date), 'dd MMMM yyyy', { locale: fr })}</p>
                            {document.due_date && (
                                <p><span className="font-semibold">Échéance :</span> {format(new Date(document.due_date), 'dd.MM.yyyy', { locale: fr })}</p>
                            )}
                        </div>
                    </div>
                </div>

                {/* Client / Bill To */}
                <div className="mb-12 flex justify-end">
                    <div className="w-1/2">
                        <h3 className="text-xs uppercase tracking-wider font-bold text-muted-foreground mb-2 border-b pb-1">Destinataire</h3>
                        <div className="text-sm">
                            <p className="font-bold text-base">{document.client?.name}</p>
                            <div className="whitespace-pre-line text-muted-foreground">
                                {document.client?.address}
                                {document.client?.postal_code} {document.client?.city}
                                {document.client?.country && `\n${document.client.country}`}
                            </div>
                            {document.client?.email && <p className="mt-2">{document.client.email}</p>}
                        </div>
                    </div>
                </div>

                {/* Table Items */}
                <div className="mb-8">
                    <table className="w-full text-left text-sm border-collapse">
                        <thead>
                            <tr className="border-b-2" style={{ borderBottomColor: primaryColor }}>
                                <th className="py-3 font-bold">Description</th>
                                <th className="py-3 font-bold text-right w-20">Qté</th>
                                <th className="py-3 font-bold text-right w-32">Prix Unitaire</th>
                                <th className="py-3 font-bold text-right w-20">TVA</th>
                                <th className="py-3 font-bold text-right w-32">Total</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y">
                            {document.items?.map((item, index) => (
                                <tr key={index}>
                                    <td className="py-4 font-medium">{item.description}</td>
                                    <td className="py-4 text-right">{item.quantity}</td>
                                    <td className="py-4 text-right">{formatCurrency(item.unit_price)}</td>
                                    <td className="py-4 text-right">{item.tax_rate}%</td>
                                    <td className="py-4 text-right font-semibold">{formatCurrency(item.total_amount)}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* Totals Section */}
                <div className="flex justify-end mb-12">
                    <div className="w-1/3 space-y-2 border-t pt-4">
                        <div className="flex justify-between text-sm">
                            <span className="text-muted-foreground">Sous-total :</span>
                            <span>{formatCurrency(document.subtotal)}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                            <span className="text-muted-foreground">TVA :</span>
                            <span>{formatCurrency(document.tax_amount)}</span>
                        </div>
                        <div
                            className="flex justify-between text-lg font-bold border-t-2 pt-2 mt-2"
                            style={{ borderTopColor: primaryColor, color: primaryColor }}
                        >
                            <span>TOTAL :</span>
                            <span>{formatCurrency(document.total_amount)}</span>
                        </div>
                    </div>
                </div>

                {/* Notes & Footer */}
                <div className="mt-auto pt-12 border-t text-sm">
                    {document.notes && (
                        <div className="mb-8">
                            <h4 className="font-bold mb-1">Notes :</h4>
                            <p className="text-muted-foreground whitespace-pre-line">{document.notes}</p>
                        </div>
                    )}

                    <div className="text-center text-xs text-muted-foreground pt-8 border-t">
                        <p className="font-bold mb-1">{template?.company_name}</p>
                        <p>{template?.footer_text}</p>
                        {template?.terms_conditions && (
                            <p className="mt-2 text-[10px] leading-tight opacity-70 italic max-w-2xl mx-auto">
                                {template.terms_conditions}
                            </p>
                        )}
                    </div>
                </div>
            </div>
        )
    }
)

DocumentPDF.displayName = 'DocumentPDF'
