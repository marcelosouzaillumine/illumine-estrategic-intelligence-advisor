// src/components/executive-command/CommandExplainabilityDrawer.tsx

import React from 'react';
import { Fingerprint, GitMerge, FileCode2 } from 'lucide-react';
import { ExecutiveCommandExplainability } from '../../services/FiduciaryRuntimeAdapter';

interface CommandExplainabilityDrawerProps {
  explainability: ExecutiveCommandExplainability;
}

export function CommandExplainabilityDrawer({ explainability }: CommandExplainabilityDrawerProps) {
  
  return (
    <div className="bg-zinc-950 border border-zinc-800 p-6 rounded-lg font-mono">
      <h3 className="text-zinc-400 text-xs font-semibold tracking-wider uppercase mb-6 flex items-center gap-2">
        <Fingerprint size={14} />
        Command Explainability (Lineage)
      </h3>

      <div className="space-y-4">
        <div className="bg-zinc-900/40 p-4 rounded border border-zinc-800">
          <span className="text-[10px] text-zinc-500 uppercase font-bold tracking-widest block mb-2">Rationale</span>
          <p className="text-xs text-zinc-300 leading-relaxed font-semibold">
            {explainability.rationale}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-zinc-900/40 p-4 rounded border border-zinc-800">
            <span className="text-[10px] text-zinc-500 uppercase font-bold tracking-widest flex items-center gap-2 mb-2">
              <FileCode2 size={12} /> Dominant Engine
            </span>
            <span className="text-[10px] text-zinc-400 block bg-zinc-950 p-2 border border-zinc-800 rounded">
              {explainability.dominantEngine}
            </span>
          </div>

          <div className="bg-zinc-900/40 p-4 rounded border border-zinc-800">
            <span className="text-[10px] text-zinc-500 uppercase font-bold tracking-widest flex items-center gap-2 mb-2">
              <GitMerge size={12} /> Causal Hashes
            </span>
            <div className="space-y-1">
              {explainability.supportingLineageHashes.map((hash, idx) => (
                <span key={idx} className="text-[9px] text-zinc-500 block bg-zinc-950 p-1.5 border border-zinc-800 rounded truncate">
                  {hash}
                </span>
              ))}
            </div>
          </div>
        </div>

        {explainability.governanceConstraintsApplied.length > 0 && (
          <div className="bg-red-950/20 p-4 rounded border border-red-900/30 mt-4">
            <span className="text-[10px] text-red-500 uppercase font-bold tracking-widest block mb-3">
              Constraints Fiduciários Ativos
            </span>
            <div className="flex flex-wrap gap-2">
              {explainability.governanceConstraintsApplied.map((constraint, idx) => (
                <span key={idx} className="text-[9px] text-red-400 bg-red-950 border border-red-900 px-2 py-1 rounded">
                  {constraint}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
