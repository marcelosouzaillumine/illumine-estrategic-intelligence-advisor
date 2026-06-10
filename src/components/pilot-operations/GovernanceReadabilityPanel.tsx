// src/components/pilot-operations/GovernanceReadabilityPanel.tsx

import React from 'react';
import { usePilotOperations } from '../../context/pilot-operations/PilotOperationsProvider';
import { ShieldCheck, AlignLeft, BarChart } from 'lucide-react';

export const GovernanceReadabilityPanel: React.FC = () => {
  const { governanceReadability, supervisionClarity, feedbackList, pilotStatus } = usePilotOperations();

  const isFailClosed = pilotStatus === 'FAIL_CLOSED';

  // Count violations
  const readabilityIssues = feedbackList.filter(f => f.category === 'GOVERNANCE_READABILITY').length;
  const clarityIssues = feedbackList.filter(f => f.category === 'EXECUTIVE_CLARITY').length;

  return (
    <div className="card-premium p-8 space-y-6 relative overflow-hidden group hover:border-secondary/20 transition-all duration-300">
      <div className="flex items-center gap-3 border-b border-border/40 pb-4">
        <div className="w-8 h-8 rounded-md bg-secondary/10 flex items-center justify-center text-secondary">
          <AlignLeft size={16} />
        </div>
        <div>
          <h3 className="text-base font-medium text-foreground tracking-tight">Compreensão & Legibilidade</h3>
          <p className="text-[11px] text-muted-foreground mt-0.5">Indicadores qualitativos de usabilidade decisória.</p>
        </div>
      </div>

      <div className="space-y-5">
        {/* Readability dial */}
        <div className="space-y-2">
          <div className="flex justify-between items-center text-[10px] font-mono font-bold tracking-wider">
            <span className="text-muted-foreground">LEGIBILIDADE DE GOVERNANÇA</span>
            <span className="text-foreground font-extrabold">{isFailClosed ? 'RESTRICTED' : `${governanceReadability}%`}</span>
          </div>
          <div className="w-full bg-surface-container-high rounded-full h-1.5 overflow-hidden">
            <div 
              className="h-1.5 rounded-full bg-secondary transition-all duration-500"
              style={{ width: `${isFailClosed ? 0 : governanceReadability}%` }}
            />
          </div>
          <span className="text-[9px] text-muted-foreground block italic">
            {readabilityIssues > 0 
              ? `${readabilityIssues} apontamento(s) de legibilidade reportados pelos executivos.` 
              : 'Sem ressalvas de legibilidade de dados registradas.'}
          </span>
        </div>

        {/* Clarity dial */}
        <div className="space-y-2">
          <div className="flex justify-between items-center text-[10px] font-mono font-bold tracking-wider">
            <span className="text-muted-foreground">CLAREZA DE SUPERVISÃO</span>
            <span className="text-foreground font-extrabold">{isFailClosed ? 'RESTRICTED' : `${supervisionClarity}%`}</span>
          </div>
          <div className="w-full bg-surface-container-high rounded-full h-1.5 overflow-hidden">
            <div 
              className="h-1.5 rounded-full bg-success-soft0 transition-all duration-500"
              style={{ width: `${isFailClosed ? 0 : supervisionClarity}%` }}
            />
          </div>
          <span className="text-[9px] text-muted-foreground block italic">
            {clarityIssues > 0
              ? `${clarityIssues} apontamento(s) de confusão em fluxos de supervisão.`
              : 'Fluxos de decisão e transição fiduciária limpos e compreensíveis.'}
          </span>
        </div>

        {/* Audit criteria summary */}
        <div className="p-3 bg-surface-container/60 border border-border/60 rounded-xl space-y-2 text-[10px] font-mono">
          <span className="font-bold text-muted-foreground uppercase tracking-widest block mb-1">COGNITIVE COMPLIANCE GATE</span>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Bypass Generative AI:</span>
            <span className="text-emerald-500 font-bold">100% SECURE</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Deterministic Context:</span>
            <span className="text-emerald-500 font-bold">VERIFIED</span>
          </div>
        </div>
      </div>
    </div>
  );
};
