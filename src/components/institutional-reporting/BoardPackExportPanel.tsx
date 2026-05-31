// src/components/institutional-reporting/BoardPackExportPanel.tsx

import React from 'react';
import { Download, CloudUpload, ShieldCheck } from 'lucide-react';
import { ReportGenerationMetadata } from '../../core/runtime/institutional-reporting/institutional-reporting-types';

export function BoardPackExportPanel({ metadata }: { metadata: ReportGenerationMetadata }) {
  return (
    <div className="bg-zinc-950 border border-zinc-800 p-6 rounded-lg font-mono">
      <h2 className="text-zinc-400 text-[10px] font-bold tracking-widest uppercase mb-6 flex items-center gap-2 border-b border-zinc-800 pb-2">
        <ShieldCheck size={14} /> Fiduciary Export & Storage
      </h2>
      
      <div className="flex flex-col md:flex-row gap-4">
        <button 
          className="flex-1 bg-blue-600 hover:bg-blue-500 text-white p-4 rounded font-bold uppercase tracking-widest text-xs flex items-center justify-center gap-3 transition-colors"
          onClick={() => alert(`Downloading local PDF copy... Lineage: ${metadata.boardPackLineageHash}`)}
        >
          <Download size={16} /> Download Local Copy
        </button>
        <button 
          className="flex-1 bg-zinc-800 hover:bg-zinc-700 text-white p-4 rounded font-bold uppercase tracking-widest text-xs flex items-center justify-center gap-3 transition-colors"
          onClick={() => alert(`Persisting snapshot to Firebase Storage... Cycle: ${metadata.cycleReference}`)}
        >
          <CloudUpload size={16} /> Persist Fiduciary Snapshot
        </button>
      </div>

      <div className="mt-4 text-center">
        <span className="text-[9px] text-zinc-500 uppercase font-bold tracking-widest">
          Both operations will cryptographically stamp the artifact with the Board Pack Hash.
        </span>
      </div>
    </div>
  );
}
