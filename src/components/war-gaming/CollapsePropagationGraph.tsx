// src/components/war-gaming/CollapsePropagationGraph.tsx

import React from 'react';
import { CrisisPropagationNode } from '../../core/runtime/war-gaming/war-gaming-types';
import { cn } from '../../lib/utils';

export function CollapsePropagationGraph({ propagation }: { propagation: CrisisPropagationNode[] }) {
  if (!propagation || propagation.length === 0) return null;

  return (
    <div className="bg-white border border-slate-200 p-6 rounded-3xl h-full">
      <h3 className="text-[10px] font-black uppercase tracking-widest text-slate-500 mb-6 border-b border-slate-100 pb-2">Domino Effect & Propagation</h3>
      
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
                  isRupture ? "bg-rose-100 text-rose-600 border border-rose-200" : "bg-slate-100 text-slate-500 border border-slate-200"
                )}>
                  {i + 1}
                </div>
                <div className="flex-1 bg-slate-50 p-3 rounded-xl border border-slate-100">
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-xs font-bold text-slate-700 uppercase tracking-tight">{node.variable}</span>
                    <span className={cn(
                      "text-[9px] font-black uppercase px-2 py-0.5 rounded",
                      isRupture ? "bg-rose-600 text-white" : "bg-slate-200 text-slate-600"
                    )}>{node.severity}</span>
                  </div>
                  <p className="text-[10px] text-slate-500 font-medium">{node.rationale}</p>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
