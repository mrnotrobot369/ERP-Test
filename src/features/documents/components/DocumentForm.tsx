/**
 * Composant pour le formulaire de document (Enterprise Grade)
 * Component for document form with dynamic items and auto-calculations
 */

import { useNavigate, Link } from 'react-router-dom'
import {
  Plus,
  Trash2,
  Save,
  ArrowLeft,
  FileText,
  RefreshCw,
  Calculator,
  Layout
} from 'lucide-react'

import { useDocumentForm } from '../hooks/useDocumentForm'
import { TemplateSelector } from './TemplateSelector'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'

export function DocumentForm({ documentId }: { documentId?: string | undefined }) {
  const navigate = useNavigate()
  const {
    formData,
    loading,
    error,
    clients,
    selectedTemplate,
    totals,
    updateField,
    addItem,
    updateItem,
    removeItem,
    save,
    generateNumber,
    applyTemplate
  } = useDocumentForm(documentId)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const result = await save()
      if (result) {
        navigate('/documents')
      }
    } catch (err) {
      console.error('Save error:', err)
    }
  }

  const handleGenerateNumber = async () => {
    try {
      await generateNumber()
    } catch (err) {
      console.error('Generation error:', err)
    }
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('fr-CH', {
      style: 'currency',
      currency: 'CHF'
    }).format(amount)
  }

  return (
    <div className="container mx-auto py-6 max-w-5xl">
      <Link
        to="/documents"
        className="flex items-center text-sm text-muted-foreground hover:text-primary mb-6 transition-colors"
      >
        <ArrowLeft className="mr-2 h-4 w-4" />
        Retour à la liste
      </Link>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">
              {documentId ? 'Modifier le document' : 'Nouveau document'}
            </h1>
            <p className="text-muted-foreground">
              {documentId ? `Édition du document ${formData.document_number}` : 'Créez un nouveau document commercial'}
            </p>
          </div>
          <div className="flex gap-2 w-full md:w-auto">
            <Button type="button" variant="outline" onClick={() => navigate('/documents')}>
              Annuler
            </Button>
            <Button type="submit" disabled={loading} className="w-full md:w-auto">
              {loading ? (
                <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <Save className="mr-2 h-4 w-4" />
              )}
              {documentId ? 'Mettre à jour' : 'Créer le document'}
            </Button>
          </div>
        </div>

        {error && (
          <Badge variant="destructive" className="w-full p-4 rounded-md justify-start h-auto text-sm font-normal">
            {error}
          </Badge>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Form Area */}
          <div className="lg:col-span-2 space-y-6">
            {/* General Info */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5" /> Informations Générales
                </CardTitle>
              </CardHeader>
              <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="type">Type de document</Label>
                  <Select
                    value={formData.type}
                    onValueChange={(value) => updateField('type', value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Choisir un type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="invoice">Facture</SelectItem>
                      <SelectItem value="quote">Devis</SelectItem>
                      <SelectItem value="delivery_note">Bon de livraison</SelectItem>
                      <SelectItem value="po">Commande</SelectItem>
                      <SelectItem value="reminder">Rappel</SelectItem>
                      <SelectItem value="receipt">Reçu</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="document_number">Numéro de document</Label>
                  <div className="flex gap-2">
                    <Input
                      id="document_number"
                      value={formData.document_number}
                      onChange={(e) => updateField('document_number', e.target.value)}
                      placeholder="Ex: INV-2024-001"
                      className="font-mono"
                    />
                    <Button
                      type="button"
                      variant="secondary"
                      onClick={handleGenerateNumber}
                      title="Générer automatiquement"
                    >
                      <RefreshCw className="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="issue_date">Date d'émission</Label>
                  <Input
                    id="issue_date"
                    type="date"
                    value={formData.issue_date}
                    onChange={(e) => updateField('issue_date', e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="due_date">Date d'échéance</Label>
                  <Input
                    id="due_date"
                    type="date"
                    value={formData.due_date}
                    onChange={(e) => updateField('due_date', e.target.value)}
                  />
                </div>
              </CardContent>
            </Card>

            {/* Client Section */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Layout className="h-5 w-5" /> Destinataire
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <Label htmlFor="client">Client</Label>
                  <Select
                    value={formData.client_id || "none"}
                    onValueChange={(value) => updateField('client_id', value === "none" ? undefined : value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Sélectionner un client" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="none">Aucun client sélectionné</SelectItem>
                      {clients.map((client) => (
                        <SelectItem key={client.id} value={client.id}>
                          {client.name} {client.email ? `(${client.email})` : ''}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>

            {/* Items Table */}
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <Calculator className="h-5 w-5" /> Articles & Prestations
                </CardTitle>
                <Button type="button" variant="outline" size="sm" onClick={addItem}>
                  <Plus className="mr-2 h-4 w-4" /> Ajouter
                </Button>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {formData.items.map((item, index) => (
                    <div key={index} className="relative group grid grid-cols-1 md:grid-cols-6 gap-4 p-4 border rounded-lg bg-muted/30">
                      <div className="md:col-span-2 space-y-2">
                        <Label className="text-xs">Description</Label>
                        <Input
                          value={item.description}
                          onChange={(e) => updateItem(index, 'description', e.target.value)}
                          placeholder="Services ou produits..."
                        />
                      </div>
                      <div className="space-y-2">
                        <Label className="text-xs">Quantité</Label>
                        <Input
                          type="number"
                          value={item.quantity}
                          onChange={(e) => updateItem(index, 'quantity', parseFloat(e.target.value) || 0)}
                          min="0.01"
                          step="0.01"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label className="text-xs">Prix Unitaire</Label>
                        <Input
                          type="number"
                          value={item.unit_price}
                          onChange={(e) => updateItem(index, 'unit_price', parseFloat(e.target.value) || 0)}
                          min="0"
                          step="0.01"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label className="text-xs">TVA (%)</Label>
                        <Select
                          value={item.tax_rate.toString()}
                          onValueChange={(value) => updateItem(index, 'tax_rate', parseFloat(value))}
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="7.7">7.7% (Standard)</SelectItem>
                            <SelectItem value="2.5">2.5% (Réduit)</SelectItem>
                            <SelectItem value="3.7">3.7% (Spécial)</SelectItem>
                            <SelectItem value="0">0% (Exempté)</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="flex items-end justify-center">
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          className="text-destructive opacity-0 group-hover:opacity-100 transition-opacity"
                          disabled={formData.items.length <= 1}
                          onClick={() => removeItem(index)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
              <CardFooter className="bg-muted/50 flex flex-col items-end gap-2 text-right">
                <div className="flex justify-between w-full max-w-xs text-sm">
                  <span className="text-muted-foreground">Sous-total:</span>
                  <span>{formatCurrency(totals.subtotal)}</span>
                </div>
                <div className="flex justify-between w-full max-w-xs text-sm">
                  <span className="text-muted-foreground">TVA:</span>
                  <span>{formatCurrency(totals.taxAmount)}</span>
                </div>
                <div className="flex justify-between w-full max-w-xs text-lg font-bold pt-2 border-t">
                  <span>Total:</span>
                  <span>{formatCurrency(totals.total)}</span>
                </div>
              </CardFooter>
            </Card>
          </div>

          {/* Sidebar / Options */}
          <div className="space-y-6">
            {/* Template Selection */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-base">
                  <Layout className="h-4 w-4" /> Modèle & Design
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <TemplateSelector
                  selectedId={formData.template_id}
                  onSelect={(template) => {
                    applyTemplate(template)
                    updateField('template_id', template.id)
                  }}
                />

                <div className="p-3 border rounded bg-muted/50 text-xs">
                  <p className="font-semibold mb-1">Résumé du modèle :</p>
                  <p>{selectedTemplate?.name || 'Standard'}</p>
                </div>
              </CardContent>
            </Card>

            {/* Notes Section */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-base">
                  <FileText className="h-4 w-4" /> Notes & Conditions
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Textarea
                  value={formData.notes || ''}
                  onChange={(e) => updateField('notes', e.target.value)}
                  placeholder="Notes affichées sur le document..."
                  className="min-h-[150px] resize-none"
                />
              </CardContent>
            </Card>

            {/* Quick Actions / Info */}
            <div className="p-4 bg-primary/5 rounded-lg border border-primary/10">
              <h4 className="text-sm font-semibold mb-2">Conseil</h4>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Les modifications sont enregistrées dès que vous cliquez sur le bouton de sauvegarde. Assurez-vous d'avoir vérifié les montants de TVA.
              </p>
            </div>
          </div>
        </div>
      </form>
    </div>
  )
}
