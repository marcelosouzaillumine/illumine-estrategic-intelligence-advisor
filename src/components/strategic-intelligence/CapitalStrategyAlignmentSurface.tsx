// src/components/strategic-intelligence/CapitalStrategyAlignmentSurface.tsx

import React from 'react';
import { Columns, CheckCircle2, XOctagon } from 'lucide-react';
import { CapitalStrategyAlignment } from '../../services/FiduciaryRuntimeAdapter';

interface CapitalStrategyAlignmentSurfaceProps {
  alignment: CapitalStrategyAlignment;
}

export function CapitalStrategyAlignmentSurface({ alignment }: CapitalStrategyAlignmentSurfaceProps) {
  
  const isAligned = alignment.isCoherent;

  return (
    <div className={`p-6 rounded-lg font-mono border h-full flex flex-col ${isAligned ? 'bg-zinc-950 border-zinc-800' : 'bg-orange-950/20 border-orange-900/50'}`}>
      <h3 className="text-zinc-400 text-[10px] font-bold tracking-widest uppercase mb-4 flex items-center gap-2">
        <Columns size={14} /> Capital vs Strategy Alignment
      </h3>

      <div className="flex items-center gap-3 mb-6">
        {isAligned ? (
          <CheckCircle2 size={24} className="text-emerald-500" />
        ) : (
          <XOctagon size={24} className="text-orange-500" />
        )}
        <div>
          <span className={`text-lg font-bold uppercase tracking-widest block leading-tight ${isAligned ? 'text-emerald-400' : 'text-orange-400'}`}>
            {alignment.status.replace(/_/g, ' ')}
          </span>
        </div>
      </div>

      {!isAligned && alignment.tensions.length > 0 && (
        <div className="mb-4">
          <span className="text-[9px] text-orange-500/70 font-bold uppercase tracking-widest block mb-2">Detected Tensions</span>
          <ul className="space-y-2">
            {alignment.tensions.map((t, idx) => (
              <li key={idx} className="text-[10px] text-orange-200/80 bg-orange-900/20 p-2 border border-orange-800/40 rounded">
                • {t}
              </li>
            ))}
          </ul>
        </div>
      )}

      <div className="mt-auto bg-zinc-900/30 p-3 border-l-2 border-zinc-700">
        <p className="text-[11px] text-zinc-400 font-medium leading-relaxed">
          {alignment.rationale}
        </p>
      </div>
    </div>
  );
}
