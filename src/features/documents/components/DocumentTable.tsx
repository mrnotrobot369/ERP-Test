import { Button, Input } from '@/components/ui'
import { Plus, Trash } from 'lucide-react'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui'
import type { DocumentItem } from '../types/document'

interface DocumentTableProps {
    items: Partial<DocumentItem>[]
    onAddItem: () => void
    onUpdateItem: (index: number, field: keyof DocumentItem, value: any) => void
    onRemoveItem: (index: number) => void
    readOnly?: boolean
}

export function DocumentTable({ items, onAddItem, onUpdateItem, onRemoveItem, readOnly = false }: DocumentTableProps) {
    return (
        <div className="space-y-4">
            <div className="rounded-md border">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead className="w-[40%]">Description</TableHead>
                            <TableHead className="w-[15%] text-right">Quantité</TableHead>
                            <TableHead className="w-[15%] text-right">Prix Unit.</TableHead>
                            <TableHead className="w-[15%] text-right">TVA (%)</TableHead>
                            <TableHead className="w-[15%] text-right">Total</TableHead>
                            {!readOnly && <TableHead className="w-[50px]"></TableHead>}
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {items.map((item, index) => (
                            <TableRow key={index}>
                                <TableCell>
                                    {readOnly ? (
                                        <span>{item.description}</span>
                                    ) : (
                                        <Input
                                            value={item.description}
                                            onChange={(e) => onUpdateItem(index, 'description', e.target.value)}
                                            placeholder="Description du produit/service"
                                        />
                                    )}
                                </TableCell>
                                <TableCell className="text-right">
                                    {readOnly ? (
                                        <span>{item.quantity}</span>
                                    ) : (
                                        <Input
                                            type="number"
                                            min="1"
                                            value={item.quantity}
                                            onChange={(e) => onUpdateItem(index, 'quantity', e.target.value)}
                                            className="text-right"
                                        />
                                    )}
                                </TableCell>
                                <TableCell className="text-right">
                                    {readOnly ? (
                                        <span>{item.unit_price?.toFixed(2)}</span>
                                    ) : (
                                        <Input
                                            type="number"
                                            min="0"
                                            step="0.01"
                                            value={item.unit_price}
                                            onChange={(e) => onUpdateItem(index, 'unit_price', e.target.value)}
                                            className="text-right"
                                        />
                                    )}
                                </TableCell>
                                <TableCell className="text-right">
                                    {readOnly ? (
                                        <span>{item.tax_rate}%</span>
                                    ) : (
                                        <Input
                                            type="number"
                                            min="0"
                                            max="100"
                                            value={item.tax_rate}
                                            onChange={(e) => onUpdateItem(index, 'tax_rate', e.target.value)}
                                            className="text-right"
                                        />
                                    )}
                                </TableCell>
                                <TableCell className="text-right font-medium">
                                    {item.total_amount?.toFixed(2)} CHF
                                </TableCell>
                                {!readOnly && (
                                    <TableCell>
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            onClick={() => onRemoveItem(index)}
                                            className="text-red-500 hover:text-red-600"
                                        >
                                            <Trash className="h-4 w-4" />
                                        </Button>
                                    </TableCell>
                                )}
                            </TableRow>
                        ))}
                        {items.length === 0 && (
                            <TableRow>
                                <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                                    Aucun élément. Cliquez sur "Ajouter une ligne" pour commencer.
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>

            {!readOnly && (
                <Button variant="outline" onClick={onAddItem} className="w-full sm:w-auto">
                    <Plus className="mr-2 h-4 w-4" />
                    Ajouter une ligne
                </Button>
            )}
        </div>
    )
}
