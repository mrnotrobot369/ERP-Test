/**
 * Composant pour l'éditeur de templates
 * Template editor component
 */

import React, { useState, useRef } from 'react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Upload, Save } from 'lucide-react'
import { toast } from 'sonner'
import type { DocumentTemplate } from '../types/document'

interface TemplateEditorProps {
  template?: DocumentTemplate
  onSave: (template: DocumentTemplate) => void
  onClose: () => void
}

export const TemplateEditor: React.FC<TemplateEditorProps> = ({
  template,
  onSave,
  onClose,
}) => {
  const [formData, setFormData] = useState<Partial<DocumentTemplate>>(
    template || {
      name: '',
      company_name: '',
      company_address: '',
      company_phone: '',
      company_email: '',
      footer_text: '',
      terms_conditions: '',
      color_scheme: '#3b82f6',
    }
  )
  const [logoPreview, setLogoPreview] = useState<string | null>(
    template?.company_logo_url || null
  )
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleLogoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    try {
      const reader = new FileReader()
      reader.onload = (event) => {
        const result = event.target?.result as string
        setLogoPreview(result)
        setFormData(prev => ({ ...prev, company_logo_url: result }))
      }
      reader.readAsDataURL(file)
    } catch (error) {
      toast.error('Erreur lors du chargement du logo')
    }
  }

  const handleSave = async () => {
    if (!formData.name || !formData.company_name) {
      toast.error('Veuillez remplir le nom du template et de l\'entreprise')
      return
    }

    try {
      onSave(formData as DocumentTemplate)
      toast.success('Template enregistré avec succès')
      onClose()
    } catch (error) {
      toast.error('Erreur lors de l\'enregistrement')
    }
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      {/* Editor Panel */}
      <div className="space-y-6">
        <h2 className="text-xl font-bold text-slate-800">Éditeur de Modèle</h2>

        {/* Logo Upload */}
        <div className="space-y-2">
          <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Logo de l'entreprise</label>
          <div
            className="border-2 border-dashed border-slate-200 rounded-xl p-6 text-center cursor-pointer hover:border-blue-400 hover:bg-blue-50/30 transition-all duration-200"
            onClick={() => fileInputRef.current?.click()}
          >
            {logoPreview ? (
              <img src={logoPreview} alt="Logo" className="h-16 mx-auto object-contain" />
            ) : (
              <div className="py-4">
                <Upload className="w-8 h-8 mx-auto text-slate-300 mb-2" />
                <p className="text-xs text-slate-500 font-medium">Cliquez pour ajouter un logo</p>
              </div>
            )}
          </div>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleLogoUpload}
            className="hidden"
          />
        </div>

        {/* Form Fields */}
        <div className="grid grid-cols-1 gap-4">
          <div className="space-y-1.5">
            <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Nom du modèle</label>
            <Input
              value={formData.name || ''}
              onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
              placeholder="Ex: Facture Professionnelle"
              className="bg-white"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Nom de l'entreprise</label>
            <Input
              value={formData.company_name || ''}
              onChange={(e) => setFormData(prev => ({ ...prev, company_name: e.target.value }))}
              className="bg-white"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Adresse du siège</label>
            <Textarea
              value={formData.company_address || ''}
              onChange={(e) => setFormData(prev => ({ ...prev, company_address: e.target.value }))}
              rows={2}
              className="bg-white resize-none"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Téléphone</label>
              <Input
                value={formData.company_phone || ''}
                onChange={(e) => setFormData(prev => ({ ...prev, company_phone: e.target.value }))}
                className="bg-white"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Email</label>
              <Input
                value={formData.company_email || ''}
                onChange={(e) => setFormData(prev => ({ ...prev, company_email: e.target.value }))}
                className="bg-white"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Couleur d'accentuation</label>
            <div className="flex gap-2">
              <input
                type="color"
                value={formData.color_scheme || '#3b82f6'}
                onChange={(e) => setFormData(prev => ({ ...prev, color_scheme: e.target.value }))}
                className="w-10 h-10 p-1 border rounded-md cursor-pointer bg-white"
              />
              <Input
                value={formData.color_scheme || '#3b82f6'}
                onChange={(e) => setFormData(prev => ({ ...prev, color_scheme: e.target.value }))}
                className="flex-1 bg-white uppercase font-mono"
              />
            </div>
          </div>
        </div>

        <div className="pt-4 flex gap-4">
          <Button onClick={handleSave} className="flex-1 shadow-lg shadow-blue-500/20">
            <Save className="w-4 h-4 mr-2" />
            Enregistrer
          </Button>
          <Button onClick={onClose} variant="ghost" className="flex-1">
            Annuler
          </Button>
        </div>
      </div>

      {/* Preview Panel */}
      <div className="space-y-4 hidden lg:block">
        <h2 className="text-xl font-bold text-slate-800">Aperçu</h2>
        <Card
          className="p-8 bg-white shadow-xl border-t-4"
          style={{ borderTopColor: formData.color_scheme }}
        >
          <div className="flex justify-between items-start mb-10">
            <div>
              {logoPreview && <img src={logoPreview} alt="Logo" className="h-12 mb-4 object-contain" />}
              <div className="space-y-0.5 text-[11px] text-slate-500">
                <p className="font-bold text-slate-800 text-sm">{formData.company_name || 'VOTRE ENTREPRISE'}</p>
                <p className="whitespace-pre-line">{formData.company_address || 'Adresse de l\'entreprise'}</p>
                <p>{formData.company_phone}</p>
                <p>{formData.company_email}</p>
              </div>
            </div>
            <div className="text-right">
              <h1 className="text-2xl font-black italic tracking-tighter" style={{ color: formData.color_scheme }}>FACTURE</h1>
              <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">N° FAC-2024-001</p>
            </div>
          </div>

          <div className="space-y-6">
            <div className="w-full bg-slate-50 rounded p-3 text-[11px]">
              <p className="text-slate-400 font-bold uppercase mb-1">Destinataire</p>
              <p className="font-bold text-slate-900">Client Démo</p>
              <p>Rue de l'Exemple 123, Lausanne</p>
            </div>

            <table className="w-full text-xs">
              <thead className="border-b" style={{ borderColor: formData.color_scheme }}>
                <tr className="text-slate-500 uppercase font-bold text-[10px]">
                  <th className="text-left py-2 font-black">Description</th>
                  <th className="text-right py-2 font-black">Total</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                <tr>
                  <td className="py-3 font-medium">Prestation informatique démo</td>
                  <td className="text-right font-bold">1'250.00 CHF</td>
                </tr>
              </tbody>
            </table>

            <div className="flex justify-end pt-4">
              <div className="w-1/2 space-y-2">
                <div className="flex justify-between text-[11px] text-slate-500">
                  <span>Sous-total:</span>
                  <span>1'250.00 CHF</span>
                </div>
                <div className="flex justify-between text-base font-black border-t pt-2" style={{ color: formData.color_scheme }}>
                  <span>TOTAL:</span>
                  <span>1'250.00 CHF</span>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-20 pt-4 border-t border-slate-100 text-[9px] text-slate-400 text-center">
            <p>{formData.footer_text || 'Merci de votre confiance.'}</p>
          </div>
        </Card>
      </div>
    </div>
  )
}
