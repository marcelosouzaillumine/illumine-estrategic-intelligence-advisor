import React, { useState } from 'react';
import { BookOpen, Target, LayoutGrid, ShieldCheck, FileText, CheckCircle2 } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { PageHeader } from '../Common';
import { cn } from '../../lib/utils';
import { SACERDOTAL_PRINCIPLES, calculateSacerdotalAlignmentScore } from '../../lib/sacerdotalIntelligence';

export function InteligenciaSacerdotalPage({ clientId }: { clientId: string }) {
  const [selectedAxis, setSelectedAxis] = useState<string>('Todos');
  const [activeTab, setActiveTab] = useState<'principios' | 'score'>('principios');

  const eixos = ['Todos', ...Array.from(new Set(SACERDOTAL_PRINCIPLES.map(p => p.axis)))];
  
  const filteredPrinciples = selectedAxis === 'Todos' 
    ? SACERDOTAL_PRINCIPLES 
    : SACERDOTAL_PRINCIPLES.filter(p => p.axis === selectedAxis);

  // Score mock para demonstração
  const mockData = { hasMVV: true, hasCompliance: true, liquidezCorrente: 1.5, turnoverBaixo: true, ebitdaMargin: 18 };
  const alignmentScore = calculateSacerdotalAlignmentScore(mockData);

  return (
    <div className="space-y-8 pb-32 max-w-7xl mx-auto">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <PageHeader 
          title="Inteligência Sacerdotal" 
          description="Gestão empresarial interpretada à luz de princípios e valores eternos." 
        />
        <div className="bg-amber-50 p-6 rounded-3xl border border-amber-100 shadow-sm flex items-center gap-6">
           <div className="w-14 h-14 bg-amber-100 rounded-2xl flex items-center justify-center text-amber-600">
             <BookOpen size={28} />
           </div>
           <div>
             <p className="text-[10px] font-black uppercase tracking-[0.2em] text-amber-600 mb-1">Índice de Alinhamento</p>
             <div className="flex items-baseline gap-2">
               <h2 className="text-4xl font-black text-amber-900">{alignmentScore}</h2>
               <span className="text-xs font-bold text-amber-700">/ 100</span>
             </div>
           </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-4 border-b border-slate-200">
        <button
          onClick={() => setActiveTab('principios')}
          className={cn("px-6 py-4 text-xs font-black uppercase tracking-widest border-b-2 transition-all", activeTab === 'principios' ? "border-amber-500 text-amber-700" : "border-transparent text-slate-400 hover:text-slate-600")}
        >
          Biblioteca de Princípios
        </button>
        <button
          onClick={() => setActiveTab('score')}
          className={cn("px-6 py-4 text-xs font-black uppercase tracking-widest border-b-2 transition-all", activeTab === 'score' ? "border-amber-500 text-amber-700" : "border-transparent text-slate-400 hover:text-slate-600")}
        >
          Avaliação de Alinhamento
        </button>
      </div>

      {activeTab === 'principios' && (
        <div className="space-y-6">
          <div className="flex flex-wrap gap-2">
            {eixos.map(eixo => (
              <button
                key={eixo}
                onClick={() => setSelectedAxis(eixo)}
                className={cn(
                  "px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all",
                  selectedAxis === eixo ? "bg-amber-500 text-white shadow-md" : "bg-white text-slate-500 border border-slate-200 hover:border-amber-300 hover:text-amber-600"
                )}
              >
                {eixo}
              </button>
            ))}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            <AnimatePresence>
              {filteredPrinciples.map(principle => (
                <motion.div
                  key={principle.id}
                  layout
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.2 }}
                  className="bg-white rounded-3xl border border-slate-200 p-8 shadow-sm hover:shadow-xl hover:border-amber-200 transition-all flex flex-col h-full"
                >
                  <div className="mb-4">
                    <span className="text-[9px] font-black text-amber-500 uppercase tracking-[0.2em]">{principle.axis}</span>
                    <div className="flex justify-between items-start mt-1">
                      <h3 className="text-xl font-black text-slate-800">{principle.name}</h3>
                      <span className="bg-amber-50 text-amber-700 text-[9px] font-bold px-2 py-1 rounded border border-amber-100 whitespace-nowrap ml-2">
                        {principle.reference}
                      </span>
                    </div>
                  </div>
                  
                  <p className="text-sm font-medium text-slate-600 italic mb-6">"{principle.description}"</p>
                  
                  <div className="mt-auto space-y-4 pt-6 border-t border-slate-100">
                    <div>
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Aplicação Prática</p>
                      <p className="text-xs font-bold text-slate-700">{principle.businessApplication}</p>
                    </div>
                    
                    <div>
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 flex items-center gap-1"><CheckCircle2 size={12} className="text-emerald-500"/> Recomendações</p>
                      <ul className="space-y-1.5">
                        {principle.practicalRecommendations.slice(0,2).map((rec, i) => (
                          <li key={i} className="text-xs font-medium text-slate-600 flex gap-2">
                            <span className="text-amber-500">•</span> {rec}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </div>
      )}

      {activeTab === 'score' && (
        <div className="bg-white p-10 rounded-[40px] border border-slate-200 shadow-sm text-center py-20">
          <ShieldCheck size={64} className="mx-auto text-amber-200 mb-6" strokeWidth={1} />
          <h2 className="text-2xl font-black text-slate-800 mb-2">Avaliação de Alinhamento (Em breve)</h2>
          <p className="text-sm text-slate-500 max-w-md mx-auto">
            Esta seção trará um diagnóstico completo e quantitativo do alinhamento da operação com os princípios sacerdotais, baseado nos indicadores de cada módulo.
          </p>
        </div>
      )}
    </div>
  );
}
