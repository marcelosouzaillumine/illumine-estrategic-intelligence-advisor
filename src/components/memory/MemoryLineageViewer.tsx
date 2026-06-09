import React from 'react';
import { GitMerge } from 'lucide-react';

interface Props {
  memoryId: string | null;
}

export const MemoryLineageViewer: React.FC<Props> = ({ memoryId }) => {
  if (!memoryId) {
    return (
      <div className="bg-slate-900 border border-border rounded-2xl p-6 text-center">
        <p className="text-muted-foreground text-sm">Selecione um fato para visualizar a linhagem de aprendizado.</p>
      </div>
    );
  }

  return (
    <div className="bg-slate-900 border border-border rounded-2xl p-6">
      <div className="flex items-center gap-3 mb-6">
        <GitMerge className="text-blue-400" size={20} />
        <h3 className="text-sm font-bold text-muted-foreground">Memory Lineage</h3>
      </div>
      <div className="space-y-4">
        <div className="p-4 bg-slate-800/50 rounded-lg border border-border">
          <p className="text-xs text-muted-foreground">
            A cadeia temporal de aprendizado mapeada por evidências. (Mock State)
          </p>
        </div>
      </div>
    </div>
  );
};
