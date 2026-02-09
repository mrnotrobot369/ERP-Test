import { useState, useEffect } from 'react'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui'
import { Label } from '@/components/ui/label'
import { documentService } from '../services/documentService'
import type { DocumentTemplate } from '../types/document'

interface TemplateSelectorProps {
    onSelect: (template: DocumentTemplate) => void
    selectedId?: string | undefined
}

// Temporary default template until we have API data
const DEFAULT_TEMPLATE: DocumentTemplate = {
    id: 'default',
    user_id: 'system',
    name: 'Standard Bleu',
    type: 'invoice',
    company_name: 'Ma Société',
    company_address: '123 Rue de Exemple\n1000 Lausanne',
    company_email: 'contact@exemple.ch',
    company_phone: '+41 21 123 45 67',
    footer_text: 'Merci de votre confiance !',
    color_scheme: '#3b82f6',
    created_at: new Date().toISOString()
}

export function TemplateSelector({ onSelect, selectedId }: TemplateSelectorProps) {
    const [templates, setTemplates] = useState<DocumentTemplate[]>([DEFAULT_TEMPLATE])
    const [selected, setSelected] = useState<string>(selectedId || DEFAULT_TEMPLATE.id)

    useEffect(() => {
        const loadTemplates = async () => {
            try {
                const data = await documentService.getTemplates()
                if (data && data.length > 0) {
                    setTemplates(data)
                }
            } catch (err) {
                console.warn('Could not load templates, using default', err)
            }
        }
        loadTemplates()
    }, [])

    // Auto-select default if nothing selected
    useEffect(() => {
        if (!selectedId && templates.length > 0 && templates[0]) {
            onSelect(templates[0])
        }
    }, [selectedId, templates, onSelect])

    const handleChange = (id: string) => {
        setSelected(id)
        const template = templates.find(t => t.id === id)
        if (template) {
            onSelect(template)
        }
    }

    return (
        <div className="space-y-2">
            <Label>Modèle de document</Label>
            <Select value={selected} onValueChange={handleChange}>
                <SelectTrigger>
                    <SelectValue placeholder="Choisir un modèle" />
                </SelectTrigger>
                <SelectContent>
                    {templates.map(t => (
                        <SelectItem key={t.id} value={t.id}>
                            {t.name}
                        </SelectItem>
                    ))}
                </SelectContent>
            </Select>
        </div>
    )
}
