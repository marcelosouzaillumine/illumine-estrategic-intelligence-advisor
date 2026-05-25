import React from 'react';
import { ShieldAlert } from 'lucide-react';
import { ContagionEdge } from '../../core/runtime/consolidated/stress/stress-types';
import { cn } from '../../lib/utils';

export function PropagatedRiskList({ risks }: { risks: ContagionEdge[] }) {
  if (!risks || risks.length === 0) return null;

  return (
    <div className="space-y-3">
      <h4 className="text-xs font-bold uppercase tracking-widest text-muted-foreground flex items-center gap-2">
        <ShieldAlert size={14} className="text-rose-500" /> Riscos Propagados (Efeito Dominó)
      </h4>
      <div className="flex flex-col gap-3">
        {risks.map((risk, idx) => (
          <div key={idx} className="p-3 bg-rose-500/5 border border-rose-500/20 rounded-lg">
            <div className="flex justify-between items-start mb-2">
              <span className="text-sm font-semibold text-foreground">
                {risk.sourceEntity} → {risk.targetEntity}
              </span>
              <span className={cn(
                "px-2 py-0.5 rounded text-[10px] font-bold uppercase",
                risk['confidence'] === 'DIRECT_EXPOSURE' ? 'bg-rose-500/10 text-rose-500' :
                risk['confidence'] === 'INDIRECT_EXPOSURE' ? 'bg-amber-500/10 text-amber-500' :
                'bg-emerald-500/10 text-emerald-500'
              )}>
                {risk.propagationType}
              </span>
            </div>
            <p className="text-xs text-muted-foreground">{risk.causalReason}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
