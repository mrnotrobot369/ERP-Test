import React from 'react'
import { Card, CardContent, Button } from '@/components/ui'
import { Plus, Heart, Filter, Scissors, Share2, Camera } from 'lucide-react'

export const StyleBarPage: React.FC = () => {
    return (
        <div className="p-8 space-y-8 animate-in fade-in duration-700">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-black text-slate-900 tracking-tight">Bar à Styles</h1>
                    <p className="text-slate-500 font-medium">Vitrine de vos meilleures créations et inspirations coiffure.</p>
                </div>
                <div className="flex gap-3">
                    <Button variant="ghost" className="rounded-2xl font-bold bg-white shadow-sm border border-slate-100">
                        <Filter className="w-4 h-4 mr-2" />
                        Filtres
                    </Button>
                    <Button className="rounded-2xl font-bold bg-pink-600 hover:bg-pink-700 text-white shadow-xl shadow-pink-500/20 border-none">
                        <Plus className="w-4 h-4 mr-2" />
                        Poster un Style
                    </Button>
                </div>
            </div>

            {/* Categories */}
            <div className="flex gap-4 overflow-x-auto pb-4 no-scrollbar">
                {['Tous', 'Modern Chic', 'Vintage Spirit', 'Color Experts', 'Wedding Styles'].map((cat, idx) => (
                    <button key={cat} className={
                        idx === 0 
                            ? "px-6 py-2 rounded-full text-xs font-black uppercase tracking-widest whitespace-nowrap transition-all shadow-sm bg-slate-900 text-white"
                            : "px-6 py-2 rounded-full text-xs font-black uppercase tracking-widest whitespace-nowrap transition-all shadow-sm bg-white text-slate-500 border border-slate-100 hover:border-pink-200"
                    }>
                        {cat}
                    </button>
                ))}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                {[...Array(8)].map((_, i) => (
                    <Card key={i} className="group rounded-[32px] overflow-hidden border-slate-200/60 bg-white shadow-sm hover:shadow-2xl hover:-translate-y-2 transition-all duration-500 cursor-pointer">
                        <div className="aspect-[4/5] bg-slate-100 flex items-center justify-center relative">
                            <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-end p-6">
                                <div className="flex gap-2">
                                    <Button size="sm" variant="secondary" className="flex-1 rounded-xl font-bold text-[10px] h-8"><Heart className="w-3 h-3 mr-1" /> J'aime</Button>
                                    <Button size="sm" variant="secondary" className="flex-1 rounded-xl font-bold text-[10px] h-8"><Share2 className="w-3 h-3" /></Button>
                                </div>
                            </div>
                            <div className="text-slate-200 opacity-20">
                                <Scissors className="w-12 h-12 mb-2" />
                                <Camera className="w-12 h-12 ml-4" />
                            </div>
                        </div>
                        <CardContent className="p-6">
                            <div className="flex items-center justify-between mb-2">
                                <p className="text-[10px] font-black text-pink-500 uppercase tracking-widest">Modern Chic</p>
                                <p className="text-[10px] font-bold text-slate-400">12 Féb 2026</p>
                            </div>
                            <h3 className="text-sm font-black text-slate-900 uppercase">Coupe Dégradé Platinium</h3>
                            <div className="flex items-center gap-2 mt-4 pt-4 border-t border-slate-50">
                                <div className="w-6 h-6 rounded-full bg-slate-100" />
                                <p className="text-[10px] font-bold text-slate-500 uppercase">Par Sarah L.</p>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>
        </div>
    )
}
