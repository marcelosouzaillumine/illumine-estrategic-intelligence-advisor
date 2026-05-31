// src/components/institutional-reporting/LineageAppendixDrawer.tsx

import React from 'react';
import { Fingerprint, Network } from 'lucide-react';
import { LineageAppendix } from '../../core/runtime/institutional-reporting/institutional-reporting-types';

export function LineageAppendixDrawer({ data }: { data: LineageAppendix }) {
  return (
    <div className="bg-zinc-950 border border-zinc-800 p-6 rounded-lg font-mono">
      <h2 className="text-zinc-400 text-[10px] font-bold tracking-widest uppercase mb-6 flex items-center gap-2 border-b border-zinc-800 pb-2">
        <Fingerprint size={14} /> Cryptographic Lineage Appendix
      </h2>
      
      <div className="mb-6 bg-blue-950/20 border border-blue-900/50 p-4 rounded">
        <span className="text-[9px] text-blue-500 uppercase font-bold tracking-widest block mb-1">Board Pack Sovereign Hash</span>
        <span className="text-xs text-blue-300 font-mono break-all">{data.boardPackLineageHash}</span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div>
          <span className="text-[9px] text-zinc-500 uppercase font-bold tracking-widest block mb-4">Runtime Propagation Hashes</span>
          <div className="space-y-2">
            {Object.entries(data.runtimeHashes).map(([layer, hash]) => (
              <div key={layer} className="bg-zinc-900/40 border border-zinc-800/80 p-2 rounded">
                <span className="text-[8px] text-zinc-500 font-bold tracking-widest uppercase block">{layer.replace(/_/g, ' ')}</span>
                <span className="text-[10px] text-zinc-300 font-mono break-all">{hash}</span>
              </div>
            ))}
          </div>
        </div>

        <div>
          <span className="text-[9px] text-zinc-500 uppercase font-bold tracking-widest block mb-4">Audit Trail Propagation</span>
          <div className="bg-zinc-900/40 border border-zinc-800/80 p-4 rounded max-h-64 overflow-y-auto custom-scrollbar">
            {data.propagationHashes.length === 0 ? (
              <span className="text-[10px] text-zinc-500 font-bold tracking-widest uppercase">NO PROPAGATION DATA</span>
            ) : (
              <ul className="space-y-3 relative border-l border-zinc-800 ml-2 pl-4">
                {data.propagationHashes.map((ph, idx) => (
                  <li key={idx} className="text-[9px] text-zinc-400 font-mono relative">
                    <Network size={10} className="absolute -left-[21px] top-0 text-zinc-600 bg-zinc-950" />
                    {ph}
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
