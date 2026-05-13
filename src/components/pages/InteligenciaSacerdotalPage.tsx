import React, { useState } from 'react';
import { BookOpen, Target, LayoutGrid, ShieldCheck, FileText, CheckCircle2 } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { PageHeader } from '../Common';
import { cn } from '../../lib/utils';
import { SACERDOTAL_PRINCIPLES, calculateSacerdotalAlignmentScore, SACERDOTAL_ALIGNMENT_ASSESSMENT, getPrincipleById } from '../../lib/sacerdotalIntelligence';

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
          subtitle="Gestão empresarial interpretada à luz de princípios e valores eternos." 
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
                  className="bg-white rounded-[32px] border border-slate-200 p-8 shadow-sm hover:shadow-xl hover:border-amber-200 transition-all flex flex-col h-full overflow-hidden"
                >
                  <div className="mb-4">
                    <div className="flex flex-wrap gap-2 mb-2">
                      <span className="text-[9px] font-black text-amber-500 uppercase tracking-[0.2em]">{principle.axis}</span>
                      {principle.category && (
                        <span className="text-[9px] font-black text-emerald-500 uppercase tracking-[0.2em] border-l border-slate-200 pl-2">
                          {principle.category}
                        </span>
                      )}
                    </div>
                    <div className="flex justify-between items-start mt-1">
                      <h3 className="text-xl font-black text-slate-800">{principle.name}</h3>
                      <span className="bg-amber-50 text-amber-700 text-[9px] font-bold px-2 py-1 rounded border border-amber-100 whitespace-nowrap ml-2">
                        {principle.reference}
                      </span>
                    </div>
                  </div>
                  
                  <p className="text-sm font-medium text-slate-600 italic mb-6">"{principle.description}"</p>
                  
                  <div className="mt-auto space-y-6 pt-6 border-t border-slate-100">
                    <div>
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Aplicação Prática</p>
                      <p className="text-xs font-bold text-slate-700 leading-relaxed">{principle.businessApplication}</p>
                    </div>
                    
                    <div>
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3 flex items-center gap-1">
                        <CheckCircle2 size={12} className="text-emerald-500"/> 
                        12 Recomendações de Alinhamento
                      </p>
                      <div className="grid grid-cols-1 gap-2 max-h-[200px] overflow-y-auto pr-2 custom-scrollbar">
                        {principle.practicalRecommendations.map((rec, i) => (
                          <div key={i} className="text-[11px] font-medium text-slate-600 flex gap-2 leading-tight bg-slate-50/50 p-2 rounded-xl border border-slate-100/50">
                            <span className="text-amber-500 font-bold">{i + 1}.</span> {rec}
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </div>
      )}

      {activeTab === 'score' && (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
          <div className="bg-amber-900 text-white p-12 rounded-[40px] shadow-2xl relative overflow-hidden">
             <div className="absolute top-0 right-0 w-64 h-64 bg-amber-500/10 rounded-full -mr-32 -mt-32 blur-3xl" />
             <div className="relative z-10">
               <h3 className="text-3xl font-black mb-2">Checklist de Maturidade</h3>
               <p className="text-amber-200 text-sm max-w-xl">
                 Responda às questões abaixo para avaliar o alinhamento sacerdotal da sua organização. 
                 Este diagnóstico cruza dados qualitativos com seus indicadores financeiros e operacionais.
               </p>
             </div>
          </div>

          <div className="space-y-12">
            {SACERDOTAL_ALIGNMENT_ASSESSMENT.map((axisGroup) => (
              <div key={axisGroup.axis} className="space-y-6">
                <div className="flex items-center gap-4">
                  <div className="h-px flex-1 bg-slate-200" />
                  <h3 className="text-xs font-black text-slate-400 uppercase tracking-[0.3em] bg-slate-50 px-4 py-2 rounded-full border border-slate-100">
                    Eixo: {axisGroup.axis}
                  </h3>
                  <div className="h-px flex-1 bg-slate-200" />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {axisGroup.questions.map((q) => (
                    <motion.div 
                      key={q.id}
                      whileHover={{ y: -2 }}
                      className="bg-white p-6 rounded-[32px] border border-slate-200 shadow-sm hover:shadow-md hover:border-amber-200 transition-all flex flex-col justify-between"
                    >
                      <div className="space-y-3">
                        <div className="flex justify-between items-start">
                          <span className="text-[9px] font-black text-amber-500 uppercase tracking-widest bg-amber-50 px-2 py-1 rounded">
                            {getPrincipleById(q.principleId)?.name}
                          </span>
                          <span className="text-[10px] font-bold text-slate-300">Peso {q.weight}</span>
                        </div>
                        <p className="text-sm font-bold text-slate-700 leading-snug">{q.text}</p>
                      </div>

                      <div className="flex gap-2 mt-6">
                        <button className="flex-1 py-3 rounded-2xl border border-slate-100 bg-slate-50 text-[10px] font-black uppercase tracking-widest text-slate-400 hover:bg-emerald-500 hover:text-white hover:border-emerald-500 transition-all">Sim</button>
                        <button className="flex-1 py-3 rounded-2xl border border-slate-100 bg-slate-50 text-[10px] font-black uppercase tracking-widest text-slate-400 hover:bg-rose-500 hover:text-white hover:border-rose-500 transition-all">Não</button>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            ))}
          </div>

          <div className="bg-slate-900 text-white p-12 rounded-[40px] text-center">
            <ShieldCheck size={48} className="mx-auto text-amber-500 mb-6" />
            <h3 className="text-2xl font-black mb-4">Finalizar Diagnóstico</h3>
            <p className="text-slate-400 text-sm max-w-md mx-auto mb-8">
              Ao concluir, o sistema irá recalcular o seu Score de Alinhamento e gerar um plano de ação prioritário.
            </p>
            <button className="bg-amber-500 hover:bg-amber-400 text-amber-950 px-10 py-4 rounded-2xl text-xs font-black uppercase tracking-widest transition-all shadow-xl shadow-amber-500/20">
              Gerar Relatório de Alinhamento
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
