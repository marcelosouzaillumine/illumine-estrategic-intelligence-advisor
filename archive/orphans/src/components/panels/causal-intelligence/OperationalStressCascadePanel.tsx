// src/components/panels/causal-intelligence/OperationalStressCascadePanel.tsx

import React from 'react';
import { GitCommit, AlertCircle } from 'lucide-react';

interface OperationalStressCascadePanelProps {
  cascadePath?: string[];
}

export const OperationalStressCascadePanel: React.FC<OperationalStressCascadePanelProps> = ({ cascadePath = [] }) => {
  return (
    <div className="p-6 rounded-3xl border border-slate-200 bg-white shadow-sm flex flex-col gap-4">
      <div className="flex items-center justify-between gap-2 mb-3">
        <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-500">Cascata de Estresse Operacional</h4>
        <span className="text-[9px] font-black uppercase px-2 py-0.5 rounded-full border bg-primary text-primary border-primary">
          fiduciário
        </span>
      </div>

      <div className="relative border-l border-dashed border-slate-200 pl-6 ml-3 space-y-6">
        {cascadePath.length === 0 ? (
          <div className="text-center py-6 text-xs text-slate-500 italic">
            Nenhuma cascata de estresse disponível para exibição.
          </div>
        ) : (
          cascadePath.map((step, idx) => {
            const isLast = idx === cascadePath.length - 1;
            const isFirst = idx === 0;

            let dotColor = 'bg-blue-500 border-blue-200';
            if (isLast && cascadePath.length > 2) {
              dotColor = 'bg-red-500 border-red-200 animate-pulse';
            } else if (idx > 0 && idx < cascadePath.length - 1) {
              dotColor = 'bg-amber-500 border-amber-200';
            }

            return (
              <div key={idx} className="relative">
                {/* Dot indicator */}
                <div className={`absolute -left-[31px] top-1 w-3 h-3 rounded-full border-2 ${dotColor} z-10 flex items-center justify-center`} />
                
                <div className="space-y-1">
                  <span className="text-[8px] font-black text-slate-400 uppercase tracking-widest">
                    Etapa {idx + 1}
                  </span>
                  <p className="text-xs font-semibold text-slate-700 leading-snug">
                    {step}
                  </p>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
