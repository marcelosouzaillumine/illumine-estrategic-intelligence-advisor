import React from 'react';
import { Clock } from 'lucide-react';
import { ExecutiveSurface } from '../../ui/executive-surface';
import { ExecutiveText } from '../../ui/executive-typography';

export interface ExecutiveCouncilTimelineProps {
  readonly timestamp: string;
}

export const ExecutiveCouncilTimeline: React.FC<ExecutiveCouncilTimelineProps> = ({ timestamp }) => {
  return (
    <ExecutiveSurface className="p-3 bg-card border border-border rounded-lg shadow-sm">
      <div className="flex items-center gap-2 mb-1">
        <Clock className="w-3.5 h-3.5 text-primary" />
        <ExecutiveText variant="bodyStandard" className="font-semibold text-foreground">
          Linha do Tempo da Sessão Colegiada
        </ExecutiveText>
      </div>
      <span className="text-xs text-muted-foreground">Sessão encerrada e registrada em: {timestamp}</span>
    </ExecutiveSurface>
  );
};
