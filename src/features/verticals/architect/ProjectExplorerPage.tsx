import React from 'react'
import { Card, Button } from '@/components/ui'
import { Ruler, FileText, Plus, TrendingUp, FolderOpen, MoreHorizontal, Download, Building } from 'lucide-react'

export const ProjectExplorerPage: React.FC = () => {
    return (
        <div className="p-8 space-y-8 animate-in fade-in duration-700">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-black text-slate-900 tracking-tight">Projets & Plans</h1>
                    <p className="text-slate-500 font-medium">Explorateur technique pour vos chantiers d'architecture.</p>
                </div>
                <div className="flex gap-3">
                    <Button variant="ghost" className="rounded-2xl font-bold bg-white shadow-sm border border-slate-100">
                        <Download className="w-4 h-4 mr-2" />
                        Tout Sauvegarder
                    </Button>
                    <Button className="rounded-2xl font-bold bg-indigo-600 hover:bg-indigo-700 text-white shadow-xl shadow-indigo-500/20 border-none">
                        <Plus className="w-4 h-4 mr-2" />
                        Nouveau Projet
                    </Button>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                {/* Stats row */}
                <Card className="rounded-3xl border-slate-200/60 bg-white p-6 shadow-sm flex items-center justify-between group overflow-hidden relative">
                    <div className="absolute -right-4 -bottom-4 opacity-5 pointer-events-none group-hover:scale-110 transition-transform duration-700">
                        <Building className="w-32 h-32" />
                    </div>
                    <div>
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Budget Total</p>
                        <p className="text-2xl font-black text-slate-900">$2.4M</p>
                    </div>
                    <div className="p-3 bg-indigo-50 text-indigo-600 rounded-2xl shadow-sm">
                        <TrendingUp className="w-6 h-6" />
                    </div>
                </Card>
                <Card className="rounded-3xl border-slate-200/60 bg-white p-6 shadow-sm flex items-center justify-between group overflow-hidden relative">
                    <div className="absolute -right-4 -bottom-4 opacity-5 pointer-events-none group-hover:scale-110 transition-transform duration-700">
                        <FileText className="w-32 h-32" />
                    </div>
                    <div>
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Documents</p>
                        <p className="text-2xl font-black text-slate-900">142</p>
                    </div>
                    <div className="p-3 bg-indigo-50 text-indigo-600 rounded-2xl shadow-sm">
                        <FolderOpen className="w-6 h-6" />
                    </div>
                </Card>
                <div className="lg:col-span-2 bg-indigo-900 rounded-3xl p-6 text-white flex items-center justify-between shadow-xl shadow-indigo-500/20">
                    <div>
                        <p className="text-[10px] font-black uppercase tracking-widest opacity-60 mb-1">Projet en cours : Villa Leman</p>
                        <p className="text-xl font-black">Phase de gros oeuvre</p>
                    </div>
                    <Button variant="outline" className="rounded-xl border-white/20 hover:bg-white/10 text-white font-black text-[10px]">DÉTAILS</Button>
                </div>
            </div>

            <Card className="rounded-[40px] border-slate-200/60 bg-white/40 backdrop-blur-sm shadow-xl shadow-slate-200/10 overflow-hidden">
                <div className="p-8 border-b border-slate-50 bg-slate-50/20 flex flex-row items-center justify-between">
                    <h2 className="text-sm font-black text-slate-900 uppercase tracking-widest flex items-center gap-2">
                        <Ruler className="w-4 h-4 text-indigo-500" />
                        Vignettes des Plans Techniques
                    </h2>
                </div>
                <div className="p-8">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {[
                            { name: 'Vue_Facade_Sud.png', size: '4.2 MB', type: 'IMAGE' },
                            { name: 'Plan_Electricite_V2.pdf', size: '1.8 MB', type: 'PDF' },
                            { name: 'Structure_Acier.dwg', size: '12.4 MB', type: 'CAD' },
                            { name: 'Rendu_Interior_Final.jpg', size: '8.5 MB', type: 'IMAGE' },
                            { name: 'Devis_Gros_Oeuvre.xlsx', size: '45 KB', type: 'XLS' },
                        ].map((file, idx) => (
                            <div key={idx} className="bg-white border border-slate-100 rounded-[32px] p-6 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group">
                                <div className="aspect-video bg-indigo-50/50 rounded-2xl mb-6 flex items-center justify-center border-2 border-dashed border-indigo-100 group-hover:border-indigo-300 transition-colors relative overflow-hidden">
                                    <div className="absolute top-4 right-4 bg-white/80 backdrop-blur-sm p-1 rounded-lg border border-slate-100 shadow-sm opacity-0 group-hover:opacity-100 transition-opacity">
                                        <MoreHorizontal className="w-4 h-4 text-slate-400" />
                                    </div>
                                    <FileText className="w-12 h-12 text-indigo-300 group-hover:scale-110 transition-transform duration-500" />
                                </div>
                                <div className="flex justify-between items-start">
                                    <div>
                                        <p className="text-sm font-black text-slate-900 tracking-tight truncate max-w-[150px]">{file.name}</p>
                                        <div className="flex gap-2 items-center mt-1">
                                            <span className="text-[10px] font-black text-indigo-500 uppercase tracking-tight">{file.type}</span>
                                            <span className="w-1 h-1 rounded-full bg-slate-200" />
                                            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-tight">{file.size}</span>
                                        </div>
                                    </div>
                                    <Button size="sm" variant="ghost" className="h-10 w-10 p-0 rounded-2xl bg-slate-50 hover:bg-indigo-50 hover:text-indigo-600 transition-colors">
                                        <Download className="w-4 h-4" />
                                    </Button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </Card>
        </div>
    )
}
