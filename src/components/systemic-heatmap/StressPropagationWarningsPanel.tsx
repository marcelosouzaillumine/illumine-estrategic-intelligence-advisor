import React from 'react';
import { AlertTriangle } from 'lucide-react';
import { StressPropagationWarning } from '../../core/runtime/consolidated/stress/stress-types';

export function StressPropagationWarningsPanel({ warnings }: { warnings: StressPropagationWarning[] }) {
  if (!warnings || warnings.length === 0) return null;

  return (
    <div className="space-y-2">
      <h4 className="text-xs font-bold uppercase tracking-widest text-muted-foreground flex items-center gap-2">
        <AlertTriangle size={14} className="text-amber-500"/> Alertas de Propagação (Runtime)
      </h4>
      <div className="space-y-2">
        {warnings.map((w) => (
          <div key={w.warningId} className="p-3 bg-amber-500/5 border border-amber-500/20 rounded-lg">
            <p className="text-sm text-foreground/90">{w.message}</p>
            <div className="flex gap-2 mt-2 text-[10px] text-muted-foreground font-mono">
              <span>Source: {w.sourceEntity}</span>
              {w.targetEntity && <span>Target: {w.targetEntity}</span>}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
