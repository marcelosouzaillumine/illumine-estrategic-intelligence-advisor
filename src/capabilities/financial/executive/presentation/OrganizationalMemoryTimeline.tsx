import React from 'react';
import { Clock, ShieldCheck } from 'lucide-react';
import { ExecutiveSurface } from '../../../../components/ui/executive-surface';
import { ExecutiveText } from '../../../../components/ui/executive-typography';
import { DecisionMemoryContract } from '@illumine/executive-contracts';

export interface OrganizationalMemoryTimelineProps {
  readonly memories: readonly DecisionMemoryContract[];
}

export const OrganizationalMemoryTimeline: React.FC<OrganizationalMemoryTimelineProps> = ({ memories }) => {
  return (
    <ExecutiveSurface className="p-4 mb-4 bg-card border border-border rounded-lg shadow-sm">
      <div className="flex items-center gap-2 mb-3 pb-2 border-b border-border/50">
        <Clock className="w-4 h-4 text-primary" />
        <ExecutiveText variant="sectionTitle" className="font-semibold text-primary">
          Linha do Tempo de Memória Institucional
        </ExecutiveText>
      </div>

      <div className="space-y-3 text-xs">
        {memories.map((mem) => (
          <div key={mem.decisionId} className="flex items-start gap-3 p-2.5 bg-surface-container/30 rounded border border-border/30">
            <ShieldCheck className="w-4 h-4 text-primary shrink-0 mt-0.5" />
            <div>
              <span className="font-bold text-foreground block">{mem.decisionTitle}</span>
              <span className="text-muted-foreground block text-[10px]">{mem.timestamp}</span>
              <p className="text-muted-foreground mt-1">{mem.recommendationText}</p>
            </div>
          </div>
        ))}
      </div>
    </ExecutiveSurface>
  );
};
