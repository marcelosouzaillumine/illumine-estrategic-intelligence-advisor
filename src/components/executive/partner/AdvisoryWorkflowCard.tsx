import React from 'react';
import { GitCommit } from 'lucide-react';
import { ExecutiveSurface } from '../../ui/executive-surface';
import { ExecutiveBadge } from '../../ui/executive-badge';
import { ExecutiveText } from '../../ui/executive-typography';
import { AdvisoryWorkflowContract } from '@illumine/executive-contracts';

export interface AdvisoryWorkflowCardProps {
  readonly workflow: AdvisoryWorkflowContract;
}

export const AdvisoryWorkflowCard: React.FC<AdvisoryWorkflowCardProps> = ({ workflow }) => {
  return (
    <ExecutiveSurface className="p-3 bg-card border border-border rounded-lg shadow-sm">
      <div className="flex items-center justify-between gap-2 mb-1">
        <div className="flex items-center gap-2">
          <GitCommit className="w-3.5 h-3.5 text-primary" />
          <ExecutiveText variant="bodyStandard" className="font-semibold text-foreground">
            Workflow de Recomendação ({workflow.recommendationId})
          </ExecutiveText>
        </div>
        <ExecutiveBadge variant="success">
          {workflow.currentStage}
        </ExecutiveBadge>
      </div>
      {workflow.reviewerComment && (
        <p className="text-muted-foreground text-xs leading-relaxed mt-1">
          <strong className="text-foreground">Comentário Fiduciário: </strong>{workflow.reviewerComment}
        </p>
      )}
    </ExecutiveSurface>
  );
};
