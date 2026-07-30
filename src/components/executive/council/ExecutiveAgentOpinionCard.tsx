import React from 'react';
import { UserCheck } from 'lucide-react';
import { ExecutiveSurface } from '../../ui/executive-surface';
import { ExecutiveBadge } from '../../ui/executive-badge';
import { ExecutiveText } from '../../ui/executive-typography';
import { AgentOpinionContract } from '@illumine/executive-contracts';

export interface ExecutiveAgentOpinionCardProps {
  readonly opinion: AgentOpinionContract;
}

export const ExecutiveAgentOpinionCard: React.FC<ExecutiveAgentOpinionCardProps> = ({ opinion }) => {
  return (
    <ExecutiveSurface className="p-3 mb-3 bg-card border border-border rounded-lg shadow-sm">
      <div className="flex items-center justify-between gap-2 mb-1">
        <div className="flex items-center gap-2">
          <UserCheck className="w-3.5 h-3.5 text-primary" />
          <ExecutiveText variant="bodyStandard" className="font-semibold text-foreground">
            Diretor {opinion.agentRole} — {opinion.perspectiveName}
          </ExecutiveText>
        </div>
        <ExecutiveBadge variant={opinion.votedDecision === 'APPROVE' ? 'success' : 'warning'}>
          {opinion.votedDecision} ({opinion.confidenceScore}%)
        </ExecutiveBadge>
      </div>
      <p className="text-muted-foreground text-xs leading-relaxed mt-1">
        <strong className="text-foreground">Diagnóstico: </strong>{opinion.diagnosis}
      </p>
    </ExecutiveSurface>
  );
};
