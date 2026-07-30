import React from 'react';
import { Users, Award } from 'lucide-react';
import { ExecutiveSurface } from '../../ui/executive-surface';
import { ExecutiveBadge } from '../../ui/executive-badge';
import { ExecutiveText } from '../../ui/executive-typography';
import { CouncilDecisionContract } from '@illumine/executive-contracts';

export interface ExecutiveCouncilCardProps {
  readonly councilDecision: CouncilDecisionContract;
}

export const ExecutiveCouncilCard: React.FC<ExecutiveCouncilCardProps> = ({ councilDecision }) => {
  return (
    <ExecutiveSurface className="p-4 mb-4 bg-card border border-border rounded-lg shadow-sm">
      <div className="flex items-center justify-between gap-4 mb-2 pb-2 border-b border-border/50">
        <div className="flex items-center gap-2">
          <Users className="w-4 h-4 text-primary" />
          <ExecutiveText variant="sectionTitle" className="font-semibold text-primary">
            AI Agent Council — Deliberação Colegiada Executiva
          </ExecutiveText>
        </div>
        <ExecutiveBadge variant={councilDecision.consensusScore >= 80 ? 'success' : 'warning'}>
          Consenso: {councilDecision.consensusScore}%
        </ExecutiveBadge>
      </div>

      <ExecutiveText variant="bodyStandard" className="font-semibold text-foreground mb-1">
        Recomendação Final do Conselho: {councilDecision.finalCouncilRecommendation}
      </ExecutiveText>

      <div className="flex items-center justify-between text-xs text-muted-foreground mt-2">
        <span>Votação: <strong className="text-success">{councilDecision.votingSummary.approveVotes} Aprovados</strong>, {councilDecision.votingSummary.approveWithReservationsVotes} com Ressalvas</span>
        <span>Conflito: <strong className="text-foreground">{councilDecision.conflictLevel}</strong></span>
      </div>
    </ExecutiveSurface>
  );
};
