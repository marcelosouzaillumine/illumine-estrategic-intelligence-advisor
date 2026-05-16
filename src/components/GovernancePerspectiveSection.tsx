import React from 'react';
import { motion } from 'motion/react';
import { ShieldCheck, Zap, Loader2, AlertTriangle, CheckCircle2, BookOpen } from 'lucide-react';
import { GovernanceInsightPanel } from './GovernanceInsightPanel';
import { MarkdownText } from './Common';
import { cn } from '../lib/utils';

interface GovernancePerspectiveSectionProps {
  axis: string;
  metrics: Record<string, any>;
  triggeredRules: any[];
  principles: any[];
  aiAnalysis: string | null;
  isGeneratingAi: boolean;
  onGenerateAi: () => void;
  className?: string;
}

export function GovernancePerspectiveSection({
  axis,
  triggeredRules,
  principles,
  aiAnalysis,
  isGeneratingAi,
  onGenerateAi,
  className
}: GovernancePerspectiveSectionProps) {
  return (
    <div className={cn("bg-white rounded-[48px] border border-slate-200 p-8 md:p-12 overflow-hidden relative shadow-sm", className)}>
      <div className="absolute -left-20 -top-20 w-80 h-80 bg-indigo-50 rounded-full blur-3xl opacity-60" />
      <div className="relative z-10">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-10 border-b border-slate-100 pb-8">
          <div className="flex items-center gap-5">
            <div className="p-4 rounded-2xl bg-indigo-50 text-indigo-600 border border-indigo-100">
              <ShieldCheck size={28} strokeWidth={2.5} />
            </div>
            <div>
              <h3 className="text-2xl font-black text-slate-900 tracking-tight leading-none mb-2">Perspectiva de Discernimento Organizacional</h3>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Ecossistema Interpretativo Integrado: {axis}</p>
            </div>
          </div>
          
          <button 
            onClick={onGenerateAi}
            disabled={isGeneratingAi}
            className="px-8 py-4 bg-indigo-600 hover:bg-indigo-500 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all shadow-xl shadow-indigo-600/20 flex items-center gap-3 disabled:opacity-50 group"
          >
            {isGeneratingAi ? <Loader2 size={16} className="animate-spin" /> : <Zap size={16} className="group-hover:animate-pulse" />}
            {aiAnalysis ? 'ATUALIZAR PARECER SISTÊMICO' : 'GERAR PARECER DA INTELIGÊNCIA'}
          </button>
        </div>

        {/* AI Analysis Block */}
        {aiAnalysis && (
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-12 bg-gradient-to-br from-slate-900 to-slate-800 p-10 rounded-[40px] text-white shadow-2xl relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl -mr-20 -mt-20 pointer-events-none" />
            
            <div className="flex items-center gap-3 mb-6 text-indigo-400 font-black uppercase tracking-[0.3em] text-[10px]">
              <div className="w-1.5 h-1.5 rounded-full bg-indigo-400 animate-pulse" />
              Parecer de Discernimento Sistêmico (Illumine Intelligence Engine)
            </div>
            
            <div className="prose prose-invert max-w-none">
              <div className="text-base md:text-lg font-medium text-slate-200 leading-relaxed italic">
                <MarkdownText text={aiAnalysis} />
              </div>
            </div>

            <div className="mt-8 pt-8 border-t border-white/5 flex items-center gap-4 text-slate-500 text-[10px] font-black uppercase tracking-widest">
               <div className="flex -space-x-2">
                  {[1, 2, 3].map(i => (
                    <div key={i} className="w-6 h-6 rounded-full border-2 border-slate-900 bg-slate-800 flex items-center justify-center overflow-hidden">
                       <img src={`https://i.pravatar.cc/100?u=gov${i}`} alt="Advisor" />
                    </div>
                  ))}
               </div>
               <span>Discernimento Validado pelo Motor Illumine</span>
            </div>
          </motion.div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Rules / Alerts Column */}
          <div className="space-y-8">
             <div className="flex items-center gap-3 mb-2">
                <ShieldCheck className="text-indigo-500" size={20} />
                <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Diagnóstico de Desalinhamento</h4>
             </div>

             {triggeredRules.length > 0 ? (
               <div className="space-y-4">
                 {triggeredRules.map((rule, idx) => (
                    <GovernanceInsightPanel 
                      key={rule.id || idx}
                      principleId={rule.principleId}
                      misalignment={rule.misalignment}
                      impact={rule.impact}
                      recommendation={rule.recommendation}
                    />
                 ))}
               </div>
             ) : (
               <div className="p-12 rounded-[32px] bg-emerald-50 border border-emerald-100 text-center flex flex-col items-center justify-center min-h-[300px]">
                  <CheckCircle2 className="text-emerald-500 mb-6" size={56} strokeWidth={1} />
                  <h4 className="text-xl font-black text-emerald-900 tracking-tight">Sistema em Equilíbrio</h4>
                  <p className="text-sm font-medium text-emerald-700/70 mt-2 max-w-xs mx-auto">
                    A unidade dos princípios está preservada. Os indicadores operacionais refletem uma gestão alinhada aos fundamentos institucionais.
                  </p>
               </div>
             )}
          </div>

          {/* Reference Principles Column */}
          <div className="space-y-8">
             <div className="flex items-center gap-3 mb-2">
                <BookOpen className="text-indigo-500" size={20} />
                <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Unidade dos Fundamentos</h4>
             </div>

             <div className="grid grid-cols-1 gap-4">
                {principles.slice(0, 6).map((principle) => (
                  <GovernanceInsightPanel 
                    key={principle.id}
                    principleId={principle.id}
                    compact
                  />
                ))}
             </div>
             
             {principles.length > 6 && (
               <div className="pt-4 text-center">
                 <p className="text-[9px] text-slate-400 font-black uppercase tracking-[0.3em]">
                   Integrando a totalidade dos princípios do eixo
                 </p>
               </div>
             )}
          </div>
        </div>
      </div>
    </div>
  );
}
