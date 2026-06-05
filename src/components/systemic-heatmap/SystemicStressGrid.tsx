import React from 'react';
import { Activity } from 'lucide-react';
import { ContagionEdge } from '../../services/FiduciaryRuntimeAdapter';
import { cn } from '../../lib/utils';

export function SystemicStressGrid({ stressMap }: { stressMap: ContagionEdge[] }) {
  if (!stressMap || stressMap.length === 0) return null;

  return (
    <div className="space-y-4">
      <h4 className="text-xs font-bold uppercase tracking-widest text-muted-foreground flex items-center gap-2">
        <Activity size={14} className="text-primary" /> Matriz de Estresse
      </h4>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {stressMap.map((edge, idx) => (
          <div key={idx} className="p-4 bg-surface-container border border-border rounded-xl">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[10px] uppercase font-bold text-muted-foreground tracking-widest">{edge.propagationType}</span>
              <span className={cn(
                "px-2 py-0.5 rounded text-[10px] font-bold uppercase",
                edge['confidence'] === 'DIRECT_EXPOSURE' ? 'bg-rose-500/10 text-rose-500' :
                edge['confidence'] === 'INDIRECT_EXPOSURE' ? 'bg-amber-500/10 text-amber-500' :
                'bg-muted/10 text-muted-foreground'
              )}>
                {edge.confidence}
              </span>
            </div>
            <div className="flex flex-col mb-3">
              <div className="flex justify-between items-center text-sm">
                <span className="text-muted-foreground">Origem</span>
                <span className="font-medium text-foreground">{edge.sourceEntity}</span>
              </div>
              <div className="flex justify-between items-center text-sm">
                <span className="text-muted-foreground">Destino</span>
                <span className="font-medium text-foreground">{edge.targetEntity}</span>
              </div>
            </div>
            <div className="pt-3 border-t border-border/50 text-xs text-muted-foreground">
              {edge.causalReason}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
