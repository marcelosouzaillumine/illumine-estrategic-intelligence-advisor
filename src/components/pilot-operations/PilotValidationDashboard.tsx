// src/components/pilot-operations/PilotValidationDashboard.tsx

import React from 'react';
import { usePilotOperations } from '../../context/pilot-operations/PilotOperationsProvider';
import { ShieldCheck, AlertOctagon, CheckCircle2, AlertTriangle, Cpu } from 'lucide-react';

export const PilotValidationDashboard: React.FC = () => {
  const { readinessReport, pilotStatus } = usePilotOperations();

  const isFailClosed = pilotStatus === 'FAIL_CLOSED';

  const ratingColors = {
    GO_LIVE_READY: 'text-emerald-500 bg-emerald-500/10 border-emerald-500/25',
    CONDITIONAL_APPROVAL: 'text-amber-500 bg-amber-500/10 border-amber-500/25',
    UNREADY: 'text-rose-500 bg-rose-500/10 border-rose-500/25'
  };

  const ratingLabels = {
    GO_LIVE_READY: 'Go-Live Ready',
    CONDITIONAL_APPROVAL: 'Conditional Approval',
    UNREADY: 'Unready / Blocked'
  };

  return (
    <div className="card-premium p-8 space-y-6 relative overflow-hidden group hover:border-secondary/20 transition-all duration-300">
      <div className="flex justify-between items-center border-b border-border/40 pb-4">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-md bg-secondary/10 flex items-center justify-center text-secondary">
            <ShieldCheck size={16} />
          </div>
          <div>
            <h3 className="text-base font-medium text-foreground tracking-tight">Avaliação de Prontidão Produtiva</h3>
            <p className="text-[11px] text-muted-foreground mt-0.5">Diagnóstico determinístico de maturidade regulatória para go-live.</p>
          </div>
        </div>
        <div className={`px-3 py-1 rounded-full border text-[10px] font-black uppercase tracking-wider ${
          isFailClosed ? 'text-rose-500 bg-rose-500/10 border-rose-500/25' : ratingColors[readinessReport.rating]
        }`}>
          {isFailClosed ? 'UNREADY (FAIL CLOSED)' : ratingLabels[readinessReport.rating]}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {/* Maturity Score */}
        <div className="p-5 bg-surface-container/60 border border-border/60 rounded-xl space-y-3 col-span-1">
          <span className="text-[9px] font-mono font-black text-muted-foreground uppercase tracking-widest block">MATURITY SCORE</span>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-bold font-mono tracking-tight text-foreground">
              {isFailClosed ? 0 : readinessReport.maturityScore}%
            </span>
          </div>
          <div className="w-full bg-surface-container-high rounded-full h-1.5 overflow-hidden">
            <div 
              className={`h-1.5 rounded-full transition-all duration-500 ${
                isFailClosed ? 'bg-rose-500' :
                readinessReport.maturityScore >= 90 ? 'bg-emerald-500' : readinessReport.maturityScore >= 60 ? 'bg-amber-500' : 'bg-rose-500'
              }`}
              style={{ width: `${isFailClosed ? 0 : readinessReport.maturityScore}%` }}
            />
          </div>
        </div>

        {/* Risk & Timeline Summary */}
        <div className="p-5 bg-surface-container/60 border border-border/60 rounded-xl space-y-2 col-span-2 text-xs">
          <div>
            <span className="text-[9px] font-mono font-black text-muted-foreground uppercase tracking-widest block mb-0.5">OPERATIONAL RISK SUMMARY</span>
            <p className="text-[11px] text-muted-foreground leading-relaxed">
              {isFailClosed ? 'Diagnóstico interrompido devido ao estado ativo de isolamento fiduciário.' : readinessReport.operationalRiskSummary}
            </p>
          </div>
          <div className="pt-2 border-t border-border/30">
            <span className="text-[9px] font-mono font-black text-muted-foreground uppercase tracking-widest block mb-0.5">RECOMMENDED TIMELINE</span>
            <p className="text-[11px] text-secondary font-bold leading-normal">
              {isFailClosed ? 'Aguardar liberação emergencial do conselho.' : readinessReport.recommendedProductionTimeline}
            </p>
          </div>
        </div>
      </div>

      {/* Blockers list */}
      <div className="space-y-3 pt-3 border-t border-border/40">
        <span className="text-[9px] font-mono font-black text-muted-foreground uppercase tracking-widest block">ACTIVE GOVERNANCE BLOCKERS ({isFailClosed ? 1 : readinessReport.unresolvedGovernanceBlockers.length})</span>
        
        {isFailClosed ? (
          <div className="p-3 bg-rose-500/5 border border-rose-500/10 rounded-xl flex gap-2">
            <AlertOctagon size={14} className="text-rose-500 shrink-0 mt-0.5" />
            <p className="text-[11px] text-rose-500 leading-normal">FAIL_CLOSED_STATE: O inquilino está bloqueado para go-live devido a isolamentoemergencial.</p>
          </div>
        ) : readinessReport.unresolvedGovernanceBlockers.length === 0 ? (
          <div className="p-4 bg-emerald-500/5 border border-emerald-500/10 rounded-xl flex gap-2.5 items-center text-emerald-500">
            <CheckCircle2 size={16} className="shrink-0" />
            <p className="text-xs font-bold">Nenhum bloqueador societário ativo. Homologação fiduciária aprovada para produção.</p>
          </div>
        ) : (
          <div className="space-y-2 max-h-[160px] overflow-y-auto pr-1">
            {readinessReport.unresolvedGovernanceBlockers.map((blocker, idx) => (
              <div key={idx} className="p-3 bg-rose-500/5 border border-rose-500/10 rounded-xl flex gap-2.5 text-rose-500">
                <AlertTriangle size={14} className="shrink-0 mt-0.5" />
                <p className="text-[11px] leading-normal text-muted-foreground">
                  <span className="text-rose-500 font-bold uppercase tracking-wider font-mono mr-1">
                    {blocker.substring(0, blocker.indexOf(':'))}
                  </span>
                  {blocker.substring(blocker.indexOf(':') + 1)}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="flex justify-between items-center text-[8.5px] font-mono text-muted-foreground pt-3 border-t border-border/30">
        <span className="flex items-center gap-1"><Cpu size={10} /> Certified Readiness Engine</span>
        <span className="text-secondary font-semibold" title={readinessReport.lineageHash}>{readinessReport.lineageHash}</span>
      </div>
    </div>
  );
};
