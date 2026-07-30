import React from 'react';
import { Calendar } from 'lucide-react';
import { ExecutiveSurface } from '../../ui/executive-surface';
import { ExecutiveText } from '../../ui/executive-typography';
import { ExecutiveMeetingContract } from '@illumine/executive-contracts';

export interface ExecutiveMeetingCenterCardProps {
  readonly meeting: ExecutiveMeetingContract;
}

export const ExecutiveMeetingCenterCard: React.FC<ExecutiveMeetingCenterCardProps> = ({ meeting }) => {
  return (
    <ExecutiveSurface className="p-4 mb-4 bg-card border border-border rounded-lg shadow-sm">
      <div className="flex items-center gap-2 mb-2 pb-2 border-b border-border/50">
        <Calendar className="w-4 h-4 text-primary" />
        <ExecutiveText variant="sectionTitle" className="font-semibold text-primary">
          Executive Meeting Center — {meeting.title}
        </ExecutiveText>
      </div>

      <p className="text-muted-foreground text-xs leading-relaxed mt-1">
        <strong className="text-foreground">Ata de Deliberação: </strong>{meeting.minutesSummary}
      </p>

      <div className="mt-2 pt-2 border-t border-border/30 text-xs">
        <span className="font-semibold text-foreground">Decisões Aprovadas: </span>
        <span className="text-primary">{meeting.decisionsMade.join('; ')}</span>
      </div>
    </ExecutiveSurface>
  );
};
