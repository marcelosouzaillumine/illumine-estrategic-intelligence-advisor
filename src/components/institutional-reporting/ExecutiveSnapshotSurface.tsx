// src/components/institutional-reporting/ExecutiveSnapshotSurface.tsx

import React from 'react';
import { Target, AlertTriangle } from 'lucide-react';
import { ExecutiveSnapshotSection } from '../../core/runtime/institutional-reporting/institutional-reporting-types';

export function ExecutiveSnapshotSurface({ data }: { data: ExecutiveSnapshotSection }) {
  return (
    <div className="bg-zinc-950 border border-zinc-800 p-6 rounded-lg font-mono">
      <h2 className="text-zinc-400 text-[10px] font-bold tracking-widest uppercase mb-6 flex items-center gap-2 border-b border-zinc-800 pb-2">
        <Target size={14} /> Executive Snapshot
      </h2>
      
      <div className="space-y-6">
        <div>
          <span className="text-[9px] text-zinc-500 uppercase font-bold tracking-widest block mb-2">Institutional Semantic Thesis</span>
          <p className="text-zinc-300 text-sm italic border-l-2 border-zinc-700 pl-3 py-1">
            "{data.unifiedThesisStatement}"
          </p>
        </div>

        <div>
          <span className="text-[9px] text-zinc-500 uppercase font-bold tracking-widest block mb-2">Sovereign Executive Summary</span>
          <p className="text-zinc-200 text-base leading-relaxed bg-zinc-900/50 p-4 rounded border border-zinc-800/80">
            {data.executiveSummary}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4 border-t border-zinc-800/50">
          <div className={`p-3 rounded border ${data.activeSurvivalMode ? 'bg-rose-950/20 border-rose-900/50' : 'bg-zinc-900/40 border-zinc-800/80'}`}>
            <span className="text-[9px] text-zinc-500 uppercase font-bold tracking-widest block mb-1">Survival Mode</span>
            <span className={`text-xs font-bold uppercase tracking-widest ${data.activeSurvivalMode ? 'text-rose-400' : 'text-emerald-400'}`}>
              {data.activeSurvivalMode ? 'ACTIVE' : 'INACTIVE'}
            </span>
          </div>

          <div className="p-3 rounded border bg-zinc-900/40 border-zinc-800/80">
            <span className="text-[9px] text-zinc-500 uppercase font-bold tracking-widest block mb-1">Structural Pressure</span>
            <span className="text-xs font-bold uppercase tracking-widest text-zinc-300">
              {data.structuralPressureLevel}
            </span>
          </div>

          <div className={`p-3 rounded border ${data.fiduciaryRestrictionsActive > 0 ? 'bg-orange-950/20 border-orange-900/50' : 'bg-zinc-900/40 border-zinc-800/80'}`}>
            <span className="text-[9px] text-zinc-500 uppercase font-bold tracking-widest block mb-1">Active Restrictions</span>
            <div className="flex items-center gap-2">
              {data.fiduciaryRestrictionsActive > 0 && <AlertTriangle size={12} className="text-orange-500" />}
              <span className={`text-xs font-bold uppercase tracking-widest ${data.fiduciaryRestrictionsActive > 0 ? 'text-orange-400' : 'text-zinc-300'}`}>
                {data.fiduciaryRestrictionsActive} DETECTED
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
