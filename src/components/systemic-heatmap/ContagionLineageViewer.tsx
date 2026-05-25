import React from 'react';
import { GitCommitHorizontal } from 'lucide-react';

export function ContagionLineageViewer({ lineage }: { lineage: string[] }) {
  if (!lineage || lineage.length === 0) return null;

  return (
    <div className="space-y-3 p-4 bg-surface-container border border-border rounded-xl">
      <h4 className="text-xs font-bold uppercase tracking-widest text-muted-foreground flex items-center gap-2 mb-3">
        <GitCommitHorizontal size={14} className="text-primary" /> Trilha de Causalidade (Lineage)
      </h4>
      <div className="space-y-2">
        {lineage.map((log, idx) => (
          <div key={idx} className="flex gap-3 text-xs">
            <div className="flex flex-col items-center">
              <div className="w-2 h-2 rounded-full bg-primary mt-1"></div>
              {idx < lineage.length - 1 && <div className="w-0.5 h-full bg-border mt-1"></div>}
            </div>
            <p className="text-muted-foreground pb-2">{log}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
