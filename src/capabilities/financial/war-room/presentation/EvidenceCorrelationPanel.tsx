import React from 'react';
import { FileText, Link as LinkIcon } from 'lucide-react';

interface EvidenceCorrelationPanelProps {
  evidences: string[];
}

export const EvidenceCorrelationPanel: React.FC<EvidenceCorrelationPanelProps> = ({ evidences }) => {
  if (evidences.length === 0) {
    return (
      <div className="card-premium p-6 h-full flex flex-col items-center justify-center">
        <FileText className="w-8 h-8 text-muted-foreground mb-3" />
        <h4 className="text-sm font-bold text-foreground">Nenhuma evidência vinculada.</h4>
        <p className="text-xs text-muted-foreground mt-2 text-center max-w-sm">
          Sem rastros documentais ou links probatórios para este cenário.
        </p>
      </div>
    );
  }

  return (
    <div className="card-premium overflow-hidden flex flex-col h-full">
      <div className="p-4 border-b border-border bg-surface-container-highest flex items-center justify-between">
        <h3 className="text-eyebrow text-foreground uppercase tracking-widest flex items-center gap-2">
          <FileText className="w-4 h-4 text-emerald-500" />
          Lastro Documental
        </h3>
        <span className="text-[10px] font-mono text-muted-foreground tabular-nums">{evidences.length} refs</span>
      </div>
      
      <div className="flex-1 overflow-y-auto p-4 space-y-2">
        {evidences.map((ev, idx) => (
          <div key={idx} className="flex items-center gap-3 p-3 bg-surface-container/40 border border-border/50 rounded-lg group hover:bg-surface-container hover:border-border-hover transition-colors cursor-pointer">
            <LinkIcon className="w-4 h-4 text-muted-foreground group-hover:text-emerald-400 transition-colors" />
            <span className="text-sm font-mono text-muted-foreground group-hover:text-foreground transition-colors truncate">
              {ev}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};
