// src/components/operational-governance/OperationalFrictionMap.tsx

import React from 'react';
import { Network, Zap, Waves, GitMerge } from 'lucide-react';
import { OperationalFrictionEvent } from '../../services/FiduciaryRuntimeAdapter';

interface OperationalFrictionMapProps {
  frictions: OperationalFrictionEvent[];
}

export function OperationalFrictionMap({ frictions }: OperationalFrictionMapProps) {
  
  if (frictions.length === 0) {
    return (
      <div className="bg-zinc-950 border border-zinc-800 p-6 rounded-lg font-mono text-center flex flex-col items-center justify-center h-full min-h-[200px]">
        <Network size={24} className="text-zinc-700 mb-3" />
        <span className="text-[10px] text-zinc-500 uppercase font-bold tracking-widest">Fluxo Institucional Sem Atrito</span>
      </div>
    );
  }

  return (
    <div className="bg-zinc-950 border border-zinc-800 p-6 rounded-lg font-mono h-full flex flex-col">
      <h3 className="text-zinc-400 text-[10px] font-bold tracking-widest uppercase mb-6 flex items-center gap-2">
        <GitMerge size={14} /> Institutional Friction Map
      </h3>

      <div className="space-y-4 flex-1">
        {frictions.map((friction) => {
          let icon = <Zap size={14} className="text-orange-500" />;
          let natureColor = 'text-orange-400 bg-orange-950 border-orange-900/50';

          if (friction.nature === 'STRUCTURAL') {
            icon = <Waves size={14} className="text-red-500" />;
            natureColor = 'text-red-400 bg-red-950 border-red-900/50';
          } else if (friction.nature === 'CONTINUITY_RELATED') {
            natureColor = 'text-purple-400 bg-purple-950 border-purple-900/50';
          }

          return (
            <div key={friction.id} className="relative pl-6 before:absolute before:left-2 before:top-4 before:bottom-[-16px] before:w-px before:bg-zinc-800 last:before:hidden">
              <div className="absolute left-[-2px] top-1.5 p-1 bg-zinc-950 rounded-full border border-zinc-800 z-10">
                {icon}
              </div>
              <div className="bg-zinc-900/40 p-4 rounded-lg border border-zinc-800/80">
                <div className="flex justify-between items-center mb-2">
                  <span className={`text-[9px] uppercase font-bold tracking-widest px-2 py-0.5 rounded border ${natureColor}`}>
                    {friction.nature.replace(/_/g, ' ')}
                  </span>
                  <span className="text-[8px] font-mono text-zinc-600">{friction.id.split('-').slice(0,3).join('-')}</span>
                </div>
                <p className="text-xs text-zinc-300 font-semibold leading-relaxed mb-3">
                  {friction.description}
                </p>
                <div className="flex flex-wrap gap-2">
                  {friction.causalMetrics.map((metric, idx) => (
                    <span key={idx} className="text-[9px] text-zinc-500 bg-zinc-950 px-1.5 py-0.5 rounded border border-zinc-800">
                      {metric}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
