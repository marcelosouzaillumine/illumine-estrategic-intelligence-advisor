// src/components/strategic-intelligence/StrategicExplainabilityDrawer.tsx

import React from 'react';
import { Microscope, Code2 } from 'lucide-react';
import { StrategicExplainability } from '../../core/runtime/strategic-intelligence/strategic-intelligence-types';

interface StrategicExplainabilityDrawerProps {
  explainability: StrategicExplainability;
}

export function StrategicExplainabilityDrawer({ explainability }: StrategicExplainabilityDrawerProps) {
  
  return (
    <div className="bg-zinc-950 border border-zinc-800 p-6 rounded-lg font-mono">
      <h3 className="text-zinc-400 text-[10px] font-bold tracking-widest uppercase mb-6 flex items-center gap-2">
        <Microscope size={14} /> Fiduciary Explainability
      </h3>

      <div className="space-y-4">
        <div className="bg-zinc-900/40 p-4 rounded border border-zinc-800">
          <span className="text-[9px] text-zinc-500 font-bold uppercase tracking-widest flex items-center gap-2 mb-2">
            <Code2 size={12} /> Cryptographic Lineage Hash
          </span>
          <span className="text-xs text-blue-400 font-mono break-all">{explainability.strategicLineage}</span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <div className="bg-zinc-900/40 p-4 rounded border border-zinc-800">
            <span className="text-[9px] text-zinc-500 font-bold uppercase tracking-widest block mb-2">Vector Rationale</span>
            <p className="text-xs text-zinc-300 leading-relaxed">{explainability.vectorRationale}</p>
          </div>
          
          <div className="bg-zinc-900/40 p-4 rounded border border-zinc-800">
            <span className="text-[9px] text-zinc-500 font-bold uppercase tracking-widest block mb-2">Trajectory Rationale</span>
            <p className="text-xs text-zinc-300 leading-relaxed">{explainability.trajectoryRationale}</p>
          </div>
        </div>

        <div className="bg-zinc-900/40 p-4 rounded border border-zinc-800">
          <span className="text-[9px] text-zinc-500 font-bold uppercase tracking-widest block mb-2">Sustainability Explanation</span>
          <p className="text-xs text-zinc-300 leading-relaxed">{explainability.sustainabilityExplanation}</p>
        </div>
      </div>
    </div>
  );
}
