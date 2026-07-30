import React from 'react';
import { AdvisoryOrchestrationResult } from '../../../../packages/intelligence/executive-advisory-engine/src';
import { ExecutiveOpportunityCard } from './ExecutiveOpportunityCard';
import { ExecutiveRecommendationCard } from './ExecutiveRecommendationCard';
import { ExecutiveActionPlanCard } from './ExecutiveActionPlanCard';
import { ExecutiveOutcomeTrackingCard } from './ExecutiveOutcomeTrackingCard';

export interface ExecutiveAdvisoryWorkspaceProps {
  readonly advisoryResult: AdvisoryOrchestrationResult;
}

export const ExecutiveAdvisoryWorkspace: React.FC<ExecutiveAdvisoryWorkspaceProps> = ({ advisoryResult }) => {
  return (
    <div className="space-y-4">
      <ExecutiveOpportunityCard
        opportunity={advisoryResult.opportunity}
        priorityScore={advisoryResult.priorityScore}
      />
      <ExecutiveRecommendationCard
        recommendation={advisoryResult.recommendation}
      />
      <ExecutiveActionPlanCard
        actionPlan={advisoryResult.actionPlan}
      />
      <ExecutiveOutcomeTrackingCard
        expectedImpactText={advisoryResult.recommendation.expectedKPIShift}
      />
    </div>
  );
};
