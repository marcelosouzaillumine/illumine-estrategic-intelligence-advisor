// src/components/operational-governance/OperationalExplainabilityDrawer.tsx

import React from 'react';
import { Fingerprint, Search } from 'lucide-react';
import { ExplainabilityOutput } from '../../services/FiduciaryRuntimeAdapter';

interface OperationalExplainabilityDrawerProps {
  explainability: ExplainabilityOutput;
}

export function OperationalExplainabilityDrawer({ explainability }: OperationalExplainabilityDrawerProps) {
  
  return (
    <div className="bg-zinc-950 border border-zinc-800 p-6 rounded-lg font-mono">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-zinc-400 text-[10px] font-bold tracking-widest uppercase flex items-center gap-2">
          <Search size={14} /> Operational Explainability Trace
        </h3>
        <div className="flex items-center gap-2 bg-zinc-900 border border-zinc-800 px-3 py-1.5 rounded-full">
          <Fingerprint size={12} className="text-zinc-500" />
          <p className="text-[10px] text-zinc-500 font-mono break-all mt-1">{explainability.lineageReferences?.[0] || 'N/A'}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-4">
          <div className="bg-zinc-900/30 border border-zinc-800/50 p-4 rounded">
            <span className="text-[9px] text-zinc-500 uppercase font-bold tracking-widest block mb-2">Execution Rationale</span>
            <p className="text-[11px] text-zinc-300 leading-relaxed font-semibold">
              {explainability.structuralDrivers?.[0] || 'N/A'}
            </p>
          </div>
          <div className="bg-zinc-900/30 border border-zinc-800/50 p-4 rounded">
            <span className="text-[9px] text-zinc-500 uppercase font-bold tracking-widest block mb-2">Continuity Rationale</span>
            <p className="text-[11px] text-zinc-300 leading-relaxed font-semibold">
              {explainability.structuralDrivers?.[1] || 'N/A'}
            </p>
          </div>
        </div>

        <div className="space-y-4">
          <div className="bg-zinc-900/30 border border-zinc-800/50 p-4 rounded h-full">
            <span className="text-[9px] text-zinc-500 uppercase font-bold tracking-widest block mb-2">Dependency Context</span>
            <p className="text-[11px] text-zinc-300 leading-relaxed font-semibold">
              {explainability.evidence?.[0] || 'N/A'}
            </p>
            
            {explainability.propagationChains?.length > 0 ? (
              <ul className="text-xs text-zinc-400 mt-2 space-y-1 list-disc list-inside">
                {explainability.propagationChains.map((f, i) => (
                  <li key={i}>{f}</li>
                ))}
              </ul>
            ) : null}
          </div>
        </div>
      </div>
    </div>
  );
}
