import React from 'react';
import { useExecutiveCognitive } from '../../context/executive-cognitive/ExecutiveCognitiveProvider';
import { ShieldAlert, Fingerprint, Activity } from 'lucide-react';

export function CriticalDecisionSurface() {
  const { prioritizedItems } = useExecutiveCognitive();

  // Find critical fiduciary or immediate signals (fiduciaryEscalation, BOARD/EXECUTIVE intervention)
  const criticalItem = prioritizedItems.find(
    item => 
      item.priority === 'IMMEDIATE' || 
      item.urgency === 'BOARD_INTERVENTION' || 
      item.urgency === 'EXECUTIVE_INTERVENTION' ||
      item.signal.fiduciaryEscalation
  );

  if (!criticalItem) {
    return (
      <div className="card-premium p-4 sm:p-6 border border-emerald-500/20 bg-success-soft0/5 rounded-xl flex items-center gap-4 text-emerald-400 font-semibold animate-executive-fade leading-relaxed w-full min-w-0">
        <Activity size={18} className="shrink-0 animate-pulse text-emerald-500" />
        <div className="text-xs min-w-0 flex-1">
          <p className="font-bold uppercase tracking-wider text-[9px] text-emerald-500 mb-0.5 font-display">Status Fiduciário</p>
          <p className="text-muted-foreground font-medium">Operação e conformidade fiduciária assegurada pelo Runtime. Zero anomalias pendentes.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="card-premium p-4 sm:p-6 lg:p-8 border border-red-500/35 bg-red-500/5 rounded-xl space-y-6 animate-executive-fade leading-relaxed w-full min-w-0 overflow-hidden">
      <div className="flex items-start gap-3 sm:gap-4 min-w-0">
        <div className="p-2.5 sm:p-3 bg-red-500/10 text-red-500 rounded-lg shrink-0">
          <ShieldAlert size={22} className="animate-pulse" />
        </div>
        <div className="space-y-1 min-w-0 flex-1">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="px-2 py-0.5 bg-red-500/15 text-red-400 text-[8px] font-black uppercase tracking-wider rounded border border-red-500/30">
              Intervenção Necessária
            </span>
            <span className="text-[9px] font-mono text-muted-foreground truncate">{criticalItem.signal.sourceModule}</span>
          </div>
          <h3 className="text-h3 font-display font-medium text-foreground tracking-tight mt-1 break-words">
            {criticalItem.signal.title}
          </h3>
          <p className="text-xs text-muted-foreground font-medium leading-relaxed break-words">
            {criticalItem.signal.description}
          </p>
        </div>
      </div>

      {criticalItem.signal.lineageHash && (
        <div className="pt-4 border-t border-red-500/20 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 sm:gap-4 text-[10px] text-muted-foreground font-semibold min-w-0">
          <div className="flex items-center gap-2 min-w-0 flex-wrap">
            <Fingerprint size={12} className="text-red-500 shrink-0" />
            <span>Lineage Hash:</span>
            <span className="font-mono text-foreground font-bold truncate">{criticalItem.signal.lineageHash}</span>
          </div>
          <span className="text-[9px] text-red-400 uppercase tracking-widest font-black shrink-0">
            Auditoria Obrigatória
          </span>
        </div>
      )}
    </div>
  );
}
