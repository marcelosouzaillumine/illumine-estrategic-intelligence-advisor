import React from 'react';
import { CrisisPropagationNode } from '../../services/FiduciaryRuntimeAdapter';
import { cn } from '../../lib/utils';
// src/components/war-gaming/CollapsePropagationGraph.tsx


export function CollapsePropagationGraph({ propagation }: { propagation: CrisisPropagationNode[] }) {
  if (!propagation || propagation.length === 0) return null;

  return (
    <div className="bg-white border border-border p-6 rounded-3xl h-full">
      <h3 className="text-[10px] font-black uppercase tracking-widest text-muted-foreground mb-6 border-b border-border pb-2">Domino Effect & Propagation</h3>
      
      <div className="space-y-4">
        {propagation.map((node, i) => {
          const isRupture = ['RUPTURA', 'CRÍTICA'].includes(node.severity);
          return (
            <div key={node.nodeId} className="flex flex-col gap-2 relative">
              {i !== 0 && (
                <div className="w-0.5 h-4 bg-slate-200 ml-4"></div>
              )}
              <div className="flex items-start gap-4">
                <div className={cn(
                  "w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs shrink-0 z-10",
                  isRupture ? "bg-rose-100 text-rose-600 border border-rose-200" : "bg-slate-100 text-muted-foreground border border-border"
                )}>
                  {i + 1}
                </div>
                <div className="flex-1 bg-slate-50 p-3 rounded-xl border border-border">
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-xs font-bold text-muted-foreground uppercase tracking-tight">{node.variable}</span>
                    <span className={cn(
                      "text-[9px] font-black uppercase px-2 py-0.5 rounded",
                      isRupture ? "bg-rose-600 text-white" : "bg-slate-200 text-muted-foreground"
                    )}>{node.severity}</span>
                  </div>
                  <p className="text-[10px] text-muted-foreground font-medium">{node.rationale}</p>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
