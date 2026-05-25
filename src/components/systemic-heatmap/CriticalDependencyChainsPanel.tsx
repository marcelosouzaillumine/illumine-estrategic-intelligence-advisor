import React from 'react';
import { Network } from 'lucide-react';
import { ContagionEdge } from '../../core/runtime/consolidated/stress/stress-types';

export function CriticalDependencyChainsPanel({ chains }: { chains: ContagionEdge[][] }) {
  if (!chains || chains.length === 0) return null;

  return (
    <div className="space-y-3">
      <h4 className="text-xs font-bold uppercase tracking-widest text-muted-foreground flex items-center gap-2">
        <Network size={14} className="text-amber-500" /> Cadeias Críticas de Dependência
      </h4>
      <div className="space-y-3">
        {chains.map((chain, chainIdx) => (
          <div key={chainIdx} className="p-3 bg-background border border-border rounded-lg flex items-center gap-2 overflow-x-auto">
            {chain.map((edge, idx) => (
              <React.Fragment key={idx}>
                <div className="flex flex-col flex-shrink-0 px-3 py-1.5 bg-surface-container rounded border border-border text-xs">
                  <span className="font-medium text-foreground">{edge.sourceEntity}</span>
                </div>
                <div className="flex-shrink-0 text-muted-foreground">→</div>
                <div className="flex flex-col flex-shrink-0 px-3 py-1.5 bg-surface-container rounded border border-border text-xs">
                  <span className="font-medium text-foreground">{edge.targetEntity}</span>
                  <span className="text-[9px] text-muted-foreground uppercase">{edge.propagationType}</span>
                </div>
                {idx < chain.length - 1 && <div className="flex-shrink-0 text-muted-foreground">→</div>}
              </React.Fragment>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
