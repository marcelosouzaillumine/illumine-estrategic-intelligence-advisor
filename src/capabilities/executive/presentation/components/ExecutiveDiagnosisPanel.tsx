import React from 'react';
import { motion } from 'motion/react';
import { Target } from 'lucide-react';
import { ExecutivePerspectiveViewData } from '../view-models/ExecutivePerspectiveViewData';
import { DominantRisksPanel } from './DominantRisksPanel';

interface ExecutiveDiagnosisPanelProps {
  diagnosisData: ExecutivePerspectiveViewData['diagnosis'];
  headerData: ExecutivePerspectiveViewData['header'];
}

export function ExecutiveDiagnosisPanel({ diagnosisData, headerData }: ExecutiveDiagnosisPanelProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="mb-12 bg-gradient-to-br from-slate-900 to-slate-800 p-10 rounded-[40px] text-white shadow-2xl relative overflow-hidden"
    >
      <div className="absolute top-0 right-0 w-64 h-64 bg-primary rounded-full blur-3xl -mr-20 -mt-20 pointer-events-none" />

      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3 text-primary font-black uppercase tracking-[0.3em] text-[10px]">
          <div className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
          Diagnóstico do Board
        </div>
      </div>
      
      {/* Header Metadata */}
      <div className="flex flex-wrap items-center gap-2 mb-6 pt-2">
        <div className="px-3 py-1.5 bg-white/10 rounded-md border border-white/20 text-[10px] font-bold uppercase tracking-widest text-white flex gap-2 items-center">
          <span className="text-white/60">{headerData.segmentLabel}</span>
          <span className="w-1 h-1 bg-white/40 rounded-full"></span>
          <span>{headerData.modelLabel}</span>
        </div>
        {headerData.executivePosture && (
          <div className="px-3 py-1.5 bg-white/10 rounded-md border border-white/20 text-[10px] font-bold uppercase tracking-widest text-white text-balance leading-relaxed whitespace-nowrap">
            Foco: {headerData.executivePosture}
          </div>
        )}
      </div>

      <div className="space-y-6">
        <div className="text-lg md:text-xl font-medium text-muted-foreground leading-relaxed italic">
          "{diagnosisData.executiveSummary}"
        </div>
        {diagnosisData.institutionalDiagnosis && (
          <div className="text-sm md:text-base font-medium text-muted-foreground leading-relaxed border-t border-white/10 pt-6">
            {diagnosisData.institutionalDiagnosis}
          </div>
        )}
      </div>

      <div className="mt-8 pt-8 border-t border-white/5 flex flex-col md:flex-row gap-8">
        <DominantRisksPanel risks={diagnosisData.dominantRisks} />

        {/* Prioridades Estratégicas */}
        <div className="flex-1 space-y-4">
          <h4 className="text-[10px] font-black text-emerald-400 uppercase tracking-widest flex items-center gap-2">
            <Target size={14} /> Prioridades Estratégicas
          </h4>
          <ul className="space-y-2">
            {diagnosisData.strategicPriorities.length > 0 ? diagnosisData.strategicPriorities.map((p) => (
              <li key={p.id} className="flex items-start gap-2 text-sm text-muted-foreground">
                <span className="text-emerald-400 mt-1 shrink-0">•</span>
                <span>{p.label}</span>
              </li>
            )) : (
              <li className="text-sm text-muted-foreground italic">Lance os demonstrativos financeiros para gerar prioridades estratégicas.</li>
            )}
          </ul>
        </div>
      </div>
    </motion.div>
  );
}
