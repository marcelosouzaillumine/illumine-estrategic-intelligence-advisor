import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ShieldCheck, Zap, AlertTriangle, BookOpen, Target, Activity } from 'lucide-react';
import { ExecutiveAdvisoryReport } from '../lib/executive-advisory-engine';
import { ExecutiveIntelligenceReport } from '../core/runtime/executive-intelligence-runtime';
import { cn } from '../lib/utils';

interface ExecutivePerspectiveSectionProps {
  report?: ExecutiveAdvisoryReport | null;
  intelligenceReport?: ExecutiveIntelligenceReport | null;
  loading: boolean;
  className?: string;
}

export function ExecutivePerspectiveSection({ report, intelligenceReport, loading, className }: ExecutivePerspectiveSectionProps) {
  if (loading) {
    return (
      <div className={cn("bg-white rounded-[48px] border border-slate-200 p-12 flex flex-col items-center justify-center min-h-[400px]", className)}>
        <div className="w-16 h-16 rounded-full border-4 border-indigo-200 border-t-indigo-600 animate-spin mb-6" />
        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest animate-pulse">Consultando Motor Institucional...</p>
      </div>
    );
  }

  if (!report && !intelligenceReport) return null;

  const confidenceLevel = intelligenceReport ? 'HIGH_CONFIDENCE' : report?.confidenceLevel || '';
  const executivePosture = intelligenceReport ? intelligenceReport.advisory?.priorityFocus || 'Aguardando' : report?.executivePosture || '';
  const executiveSummary = intelligenceReport ? intelligenceReport.advisory?.executiveSummary || '' : report?.executiveSummary || '';
  const institutionalDiagnosis = intelligenceReport ? intelligenceReport.causality?.financialPropagation || '' : report?.institutionalDiagnosis || '';
  
  const dominantRisks = intelligenceReport 
    ? intelligenceReport.causality?.insights?.filter(i => i.bgClass.includes('rose') || i.bgClass.includes('red')).map(i => i.text) || []
    : report?.dominantRisks || [];
    
  const strategicPriorities = intelligenceReport 
    ? intelligenceReport.advisory?.actionMatrix || []
    : report?.strategicPriorities || [];
    
  const actionMatrix = intelligenceReport 
    ? intelligenceReport.advisory?.actionMatrix?.map(action => ({ acao: action, impacto: 'ALTO', prioridade: 'ALTA', velocidade: 'CONTÍNUA' })) || []
    : report?.actionMatrix || [];
    
  const blockedFalsePositives = intelligenceReport ? [] : report?.blockedFalsePositives || [];
  const causalConflicts = intelligenceReport ? [] : report?.causalConflicts || [];

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
              <h3 className="text-2xl font-black text-slate-900 tracking-tight leading-none mb-2">Síntese Executiva Institucional</h3>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Causalidade Integrada: BP + DRE + Caixa</p>
            </div>
          </div>
          
          <div className="px-5 py-2.5 bg-slate-900 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-xl flex items-center gap-3">
            <Zap size={16} className="text-indigo-400" />
            Nível de Confiança: {confidenceLevel}
          </div>
        </div>

        {/* Contexto Institucional Detectado */}
        {intelligenceReport?.institutionalContext && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-10 p-6 bg-indigo-50/50 rounded-3xl border border-indigo-100/80 relative overflow-hidden"
          >
            <div className="absolute right-0 bottom-0 w-32 h-32 bg-indigo-500/5 rounded-full blur-2xl pointer-events-none" />
            <h4 className="text-[10px] font-black text-indigo-700 uppercase tracking-[0.2em] mb-4 flex items-center gap-2">
              <Activity size={14} className="text-indigo-500" /> Contexto Institucional Detectado
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 relative z-10">
              {/* Estágio e Modelo */}
              <div className="space-y-3">
                <div>
                  <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Estágio da Empresa</p>
                  <p className="text-sm font-bold text-slate-800">{intelligenceReport.institutionalContext.businessStage.replace(/_/g, ' ')}</p>
                </div>
                <div>
                  <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Modelo Econômico</p>
                  <p className="text-sm font-bold text-slate-800">{intelligenceReport.institutionalContext.economicModel.replace(/_/g, ' ')}</p>
                </div>
              </div>

              {/* Densidade e Confiança */}
              <div className="space-y-3">
                <div>
                  <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Densidade Histórica</p>
                  <p className="text-sm font-bold text-slate-800">{intelligenceReport.institutionalContext.historicalDensity.replace(/_/g, ' ')}</p>
                </div>
                <div>
                  <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Confiança Estratégica</p>
                  <span className={cn(
                    "inline-block px-2.5 py-1 rounded-full text-[10px] font-bold",
                    intelligenceReport.institutionalContext.confidence.strategicConfidence === 'HIGH' ? "bg-emerald-100 text-emerald-800 border border-emerald-200" :
                    intelligenceReport.institutionalContext.confidence.strategicConfidence === 'MODERATE' ? "bg-blue-100 text-blue-800 border border-blue-200" :
                    "bg-amber-100 text-amber-800 border border-amber-200"
                  )}>
                    {intelligenceReport.institutionalContext.confidence.strategicConfidence}
                  </span>
                </div>
              </div>

              {/* Limitações e Claims Bloqueados */}
              <div className="space-y-3 col-span-1">
                <div>
                  <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Limitações Interpretativas</p>
                  <div className="max-h-24 overflow-y-auto space-y-1 mt-1 text-[11px] text-slate-600 font-medium">
                    {intelligenceReport.compliance.narrativeRestrictions.filter(r => r.includes('NÃO') || r.includes('Diretriz') || r.includes('limitadas')).map((r, i) => (
                      <p key={i} className="leading-tight">• {r.replace('Diretriz:', '').replace('NÃO reivindicar:', 'NÃO alegar:').trim()}</p>
                    ))}
                    {intelligenceReport.compliance.narrativeRestrictions.length === 0 && (
                      <p className="italic text-slate-400">Nenhuma limitação ativa.</p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* Executive Summary Block */}
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-12 bg-gradient-to-br from-slate-900 to-slate-800 p-10 rounded-[40px] text-white shadow-2xl relative overflow-hidden"
        >
          <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl -mr-20 -mt-20 pointer-events-none" />
          
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3 text-indigo-400 font-black uppercase tracking-[0.3em] text-[10px]">
              <div className="w-1.5 h-1.5 rounded-full bg-indigo-400 animate-pulse" />
              Diagnóstico do Board
            </div>
            <div className="px-3 py-1 bg-white/10 rounded-md border border-white/20 text-[10px] font-bold uppercase tracking-widest text-white">
              Postura: {executivePosture}
            </div>
          </div>
          
          <div className="space-y-6">
            <div className="text-lg md:text-xl font-medium text-slate-200 leading-relaxed italic">
              "{executiveSummary}"
            </div>
            <div className="text-sm md:text-base font-medium text-slate-400 leading-relaxed border-t border-white/10 pt-6">
              {institutionalDiagnosis}
            </div>
          </div>

          <div className="mt-8 pt-8 border-t border-white/5 flex flex-col md:flex-row gap-8">
            <div className="flex-1 space-y-4">
              <h4 className="text-[10px] font-black text-rose-400 uppercase tracking-widest flex items-center gap-2">
                <AlertTriangle size={14} /> Riscos Dominantes
              </h4>
              <ul className="space-y-2">
                {dominantRisks.map((risk, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm text-slate-300">
                    <span className="text-rose-400 mt-1">•</span> {risk}
                  </li>
                ))}
              </ul>
            </div>
            <div className="flex-1 space-y-4">
              <h4 className="text-[10px] font-black text-emerald-400 uppercase tracking-widest flex items-center gap-2">
                <Target size={14} /> Prioridades Estratégicas
              </h4>
              <ul className="space-y-2">
                {strategicPriorities.map((p, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm text-slate-300">
                    <span className="text-emerald-400 mt-1">•</span> {p}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </motion.div>

        {/* Action Matrix */}
        <div className="mb-12">
          <div className="flex items-center gap-3 mb-6">
            <Activity className="text-indigo-500" size={20} />
            <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Action Matrix Executiva</h4>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {actionMatrix.map((action, idx) => (
              <div key={idx} className="bg-slate-50 border border-slate-200 rounded-2xl p-6 hover:border-indigo-200 transition-colors">
                <h5 className="text-sm font-black text-slate-900 mb-3">{action.acao}</h5>
                <div className="flex flex-wrap gap-2">
                  <span className="px-2 py-1 bg-white border border-slate-200 rounded text-[9px] font-bold text-slate-500 uppercase">Impacto: {action.impacto}</span>
                  <span className="px-2 py-1 bg-white border border-slate-200 rounded text-[9px] font-bold text-slate-500 uppercase">Prioridade: {action.prioridade}</span>
                  <span className="px-2 py-1 bg-white border border-slate-200 rounded text-[9px] font-bold text-slate-500 uppercase">Tempo: {action.velocidade}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Causal Moderation */}
        {(blockedFalsePositives.length > 0 || causalConflicts.length > 0) && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {blockedFalsePositives.length > 0 && (
              <div className="bg-rose-50 border border-rose-100 rounded-2xl p-6">
                <div className="flex items-center gap-2 text-rose-600 mb-4">
                  <ShieldCheck size={16} />
                  <span className="text-[10px] font-black uppercase tracking-widest">Falsos Positivos Bloqueados</span>
                </div>
                <ul className="space-y-2">
                  {blockedFalsePositives.map((fp, i) => (
                    <li key={i} className="text-xs font-bold text-rose-900">• {fp}</li>
                  ))}
                </ul>
              </div>
            )}
            
            {causalConflicts.length > 0 && (
              <div className="bg-amber-50 border border-amber-100 rounded-2xl p-6">
                <div className="flex items-center gap-2 text-amber-600 mb-4">
                  <AlertTriangle size={16} />
                  <span className="text-[10px] font-black uppercase tracking-widest">Conflitos Causais Resolvidos</span>
                </div>
                <ul className="space-y-2">
                  {causalConflicts.map((cc, i) => (
                    <li key={i} className="text-xs font-bold text-amber-900">• {cc}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
