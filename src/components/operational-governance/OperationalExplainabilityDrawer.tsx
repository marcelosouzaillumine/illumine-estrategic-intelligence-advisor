// src/components/operational-governance/OperationalExplainabilityDrawer.tsx

import React from 'react';
import { Fingerprint, Search } from 'lucide-react';
import { OperationalGovernanceExplainability } from '../../core/runtime/operational-governance/operational-governance-types';

interface OperationalExplainabilityDrawerProps {
  explainability: OperationalGovernanceExplainability;
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
          <span className="text-[9px] text-zinc-400 font-bold">{explainability.operationalLineage.substring(0,16)}</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-4">
          <div className="bg-zinc-900/30 border border-zinc-800/50 p-4 rounded">
            <span className="text-[9px] text-zinc-500 uppercase font-bold tracking-widest block mb-2">Execution Rationale</span>
            <p className="text-[11px] text-zinc-300 leading-relaxed font-semibold">
              {explainability.executionRationale}
            </p>
          </div>
          <div className="bg-zinc-900/30 border border-zinc-800/50 p-4 rounded">
            <span className="text-[9px] text-zinc-500 uppercase font-bold tracking-widest block mb-2">Continuity Rationale</span>
            <p className="text-[11px] text-zinc-300 leading-relaxed font-semibold">
              {explainability.continuityRationale}
            </p>
          </div>
        </div>

        <div className="space-y-4">
          <div className="bg-zinc-900/30 border border-zinc-800/50 p-4 rounded h-full">
            <span className="text-[9px] text-zinc-500 uppercase font-bold tracking-widest block mb-2">Dependency Context</span>
            <p className="text-[11px] text-zinc-300 leading-relaxed font-semibold mb-4">
              {explainability.dependencyExplanation}
            </p>
            
            {explainability.frictionDecomposition.length > 0 && (
              <>
                <span className="text-[9px] text-zinc-500 uppercase font-bold tracking-widest block mb-2 pt-4 border-t border-zinc-800/50">
                  Friction Decomposition
                </span>
                <ul className="space-y-2">
                  {explainability.frictionDecomposition.map((desc, idx) => (
                    <li key={idx} className="text-[10px] text-zinc-400 bg-zinc-950 p-2 rounded border border-zinc-800/80 flex items-start gap-2">
                      <span className="text-zinc-600 mt-0.5">›</span> {desc}
                    </li>
                  ))}
                </ul>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
