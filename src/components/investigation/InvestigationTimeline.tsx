import React from 'react';
import { UIInvestigationNode } from '../../viewmodels/investigation/BoardInvestigationViewModel';
import { Clock, CheckCircle2 } from 'lucide-react';

interface InvestigationTimelineProps {
  timeline: UIInvestigationNode[];
}

export const InvestigationTimeline: React.FC<InvestigationTimelineProps> = ({ timeline }) => {
  if (!timeline || timeline.length === 0) {
    return (
      <div className="p-4 bg-surface-container border border-border rounded-xl">
        <h3 className="text-sm font-bold text-foreground mb-1">Linha do Tempo Histórica</h3>
        <p className="text-xs text-muted-foreground">
          Nenhum snapshot histórico disponível para este nó.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <h3 className="text-eyebrow text-foreground uppercase tracking-wider flex items-center gap-2">
        <Clock size={16} className="text-primary" />
        Trajetória Temporal do Nó
      </h3>

      <div className="space-y-0 relative before:absolute before:inset-0 before:ml-2.5 before:-translate-x-px before:h-full before:w-0.5 before:bg-gradient-to-b before:from-indigo-500/0 before:via-indigo-500/20 before:to-indigo-500/0">
        {timeline.map((node, idx) => (
          <div key={`${node.id}-${idx}`} className="relative flex items-center group is-active py-3">
            <div className="flex items-center justify-center w-5 h-5 rounded-full border border-insight bg-surface-container shrink-0 shadow-sm z-10 ml-0">
              <CheckCircle2 size={12} className="text-primary" />
            </div>
            <div className="ml-4 p-3 rounded-lg border border-border bg-surface-container shadow-sm w-full">
              <div className="flex items-center justify-between mb-1">
                <span className="text-[10px] uppercase font-mono text-muted-foreground">{node.type}</span>
                <span className="text-[9px] uppercase tracking-widest text-primary font-bold bg-primary px-2 py-0.5 rounded">
                  {node.confidence}
                </span>
              </div>
              <p className="text-xs font-semibold text-foreground">{node.title}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
