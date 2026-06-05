// src/components/executive-command/StrategicAlignmentSurface.tsx

import React from 'react';
import { Network, Activity, Coins, TrendingUp } from 'lucide-react';
import { InstitutionalAlignmentState } from '../../services/FiduciaryRuntimeAdapter';

interface StrategicAlignmentSurfaceProps {
  alignment: InstitutionalAlignmentState;
}

export function StrategicAlignmentSurface({ alignment }: StrategicAlignmentSurfaceProps) {
  
  const getStatusColor = (status: string) => {
    switch(status) {
      case 'ALIGNED': return 'bg-emerald-950/40 border-emerald-900/50 text-emerald-400';
      case 'DIVERGENT': return 'bg-orange-950/40 border-orange-900/50 text-orange-400';
      case 'CRITICAL_TENSION': return 'bg-red-950/40 border-red-900/50 text-red-400';
      default: return 'bg-zinc-900/50 border-zinc-800 text-zinc-500';
    }
  };

  return (
    <div className="bg-zinc-950 border border-zinc-800 p-6 rounded-lg font-mono w-full flex flex-col justify-between">
      <div>
        <h3 className="text-zinc-400 text-xs font-semibold tracking-wider uppercase mb-6 flex items-center gap-2">
          <Network size={14} />
          Strategic Alignment Surface
        </h3>

        <div className="flex items-end gap-4 mb-8 pb-6 border-b border-zinc-800">
          <div className="text-5xl font-black tracking-tighter text-zinc-100">
            {alignment.overallAlignmentScore}<span className="text-xl text-zinc-500">%</span>
          </div>
          <div className="text-xs text-zinc-500 max-w-[200px] leading-relaxed mb-1">
            {alignment.alignmentNarrative}
          </div>
        </div>

        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-[10px] text-zinc-400 uppercase tracking-widest flex items-center gap-2">
              <Coins size={12} className="text-zinc-500" /> Treasury Posture
            </span>
            <span className={`text-[9px] uppercase font-bold tracking-widest px-2 py-0.5 rounded border ${getStatusColor(alignment.treasuryAlignment)}`}>
              {alignment.treasuryAlignment.replace(/_/g, ' ')}
            </span>
          </div>
          
          <div className="flex items-center justify-between">
            <span className="text-[10px] text-zinc-400 uppercase tracking-widest flex items-center gap-2">
              <TrendingUp size={12} className="text-zinc-500" /> Structural Growth
            </span>
            <span className={`text-[9px] uppercase font-bold tracking-widest px-2 py-0.5 rounded border ${getStatusColor(alignment.growthAlignment)}`}>
              {alignment.growthAlignment.replace(/_/g, ' ')}
            </span>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-[10px] text-zinc-400 uppercase tracking-widest flex items-center gap-2">
              <Activity size={12} className="text-zinc-500" /> Continuity Guardrails
            </span>
            <span className={`text-[9px] uppercase font-bold tracking-widest px-2 py-0.5 rounded border ${getStatusColor(alignment.continuityAlignment)}`}>
              {alignment.continuityAlignment.replace(/_/g, ' ')}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
