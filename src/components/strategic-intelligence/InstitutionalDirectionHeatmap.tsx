// src/components/strategic-intelligence/InstitutionalDirectionHeatmap.tsx

import React from 'react';
import { Network } from 'lucide-react';
import { InstitutionalStrategicIntelligenceOutput } from '../../core/runtime/strategic-intelligence/strategic-intelligence-types';

interface InstitutionalDirectionHeatmapProps {
  strategicOutput: InstitutionalStrategicIntelligenceOutput;
}

export function InstitutionalDirectionHeatmap({ strategicOutput }: InstitutionalDirectionHeatmapProps) {
  
  const cells = [
    { label: 'EXPANSION', active: strategicOutput.posture === 'EXPANSION_POSTURE' },
    { label: 'PRESERVATION', active: strategicOutput.posture === 'PRESERVATION_POSTURE' },
    { label: 'STABILIZATION', active: strategicOutput.posture === 'STABILIZATION_POSTURE' },
    { label: 'RESTRICTION', active: strategicOutput.posture === 'RESTRICTION_POSTURE' },
    { label: 'CONTINUITY', active: strategicOutput.posture === 'CONTINUITY_POSTURE' }
  ];

  return (
    <div className="bg-zinc-950 border border-zinc-800 p-6 rounded-lg font-mono">
      <h3 className="text-zinc-400 text-[10px] font-bold tracking-widest uppercase mb-4 flex items-center gap-2">
        <Network size={14} /> Directional Convergence Matrix
      </h3>

      <div className="grid grid-cols-5 gap-2">
        {cells.map(c => (
          <div 
            key={c.label} 
            className={`h-12 rounded flex items-center justify-center border transition-all ${
              c.active 
                ? 'bg-blue-500/20 border-blue-400 text-blue-300' 
                : 'bg-zinc-900/50 border-zinc-800 text-zinc-600'
            }`}
          >
            <span className="text-[8px] font-bold uppercase tracking-widest">{c.label}</span>
          </div>
        ))}
      </div>
      
      <div className="mt-4 pt-4 border-t border-zinc-800">
        <p className="text-xs text-zinc-400 font-medium leading-relaxed italic">
          "{strategicOutput.thesis.unifiedThesisStatement}"
        </p>
      </div>
    </div>
  );
}
