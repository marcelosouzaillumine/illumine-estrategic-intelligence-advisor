import React from 'react';
import { CheckSquare } from 'lucide-react';
import { ExecutiveSurface } from '../../ui/executive-surface';
import { ExecutiveText } from '../../ui/executive-typography';

export interface ExecutiveVotingCardProps {
  readonly approveVotes: number;
  readonly approveWithReservationsVotes: number;
  readonly rejectVotes: number;
}

export const ExecutiveVotingCard: React.FC<ExecutiveVotingCardProps> = ({ approveVotes, approveWithReservationsVotes, rejectVotes }) => {
  return (
    <ExecutiveSurface className="p-3 bg-card border border-border rounded-lg shadow-sm">
      <div className="flex items-center gap-2 mb-1">
        <CheckSquare className="w-3.5 h-3.5 text-primary" />
        <ExecutiveText variant="bodyStandard" className="font-semibold text-foreground">
          Apuração Final de Votação
        </ExecutiveText>
      </div>
      <div className="flex items-center justify-between text-xs text-muted-foreground mt-1">
        <span>Favoráveis: <strong className="text-success">{approveVotes}</strong></span>
        <span>Com Ressalva: <strong className="text-warning">{approveWithReservationsVotes}</strong></span>
        <span>Contrários: <strong className="text-destructive">{rejectVotes}</strong></span>
      </div>
    </ExecutiveSurface>
  );
};
