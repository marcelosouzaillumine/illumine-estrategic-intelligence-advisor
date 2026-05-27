import React from 'react';
import { useExecutiveCognitive } from '../../context/executive-cognitive/ExecutiveCognitiveProvider';
import { Layers } from 'lucide-react';

export function ExecutivePriorityNavigator() {
  const { executiveAttentionMap } = useExecutiveCognitive();

  const entries = Object.entries(executiveAttentionMap);

  if (entries.length === 0) {
    return null;
  }

  return (
    <div className="card-premium p-6 bg-card/30 border border-border/40 space-y-4 animate-executive-fade text-xs">
      <div className="flex items-center gap-2 pb-2 border-b border-border/30">
        <Layers size={14} className="text-secondary" />
        <span className="font-display font-medium tracking-tight text-foreground">Distribuição de Atenção</span>
      </div>

      <div className="space-y-3 font-semibold">
        {entries.map(([moduleName, weight]) => (
          <div key={moduleName} className="space-y-1">
            <div className="flex justify-between items-center text-[10px]">
              <span className="text-muted-foreground uppercase tracking-wider">{moduleName}</span>
              <span className="text-foreground">{(weight * 100).toFixed(0)}%</span>
            </div>
            <div className="h-1.5 w-full bg-surface-container rounded-full overflow-hidden">
              <div 
                className="h-full bg-secondary transition-all duration-700" 
                style={{ width: `${weight * 100}%` }}
              ></div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
