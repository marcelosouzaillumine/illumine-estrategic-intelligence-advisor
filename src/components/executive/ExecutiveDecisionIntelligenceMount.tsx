import React, { useMemo } from 'react';
import { ExecutiveDecisionIntelligenceEngine } from '@illumine/executive-decision-intelligence';
import { ExecutiveExperienceComposer } from '@illumine/executive-experience-composer';
import { ExecutiveDecisionSurface } from './ExecutiveDecisionSurface';
import { ExecutiveIntelligenceRuntimeInspector } from './ExecutiveIntelligenceRuntimeInspector';

export interface ExecutiveDecisionIntelligenceMountProps {
  pageId: string;
  companyId?: string;
  companyName?: string;
  period?: string;
  financialData?: Record<string, number>;
  onExplore?: () => void;
}

export const ExecutiveDecisionIntelligenceMount: React.FC<ExecutiveDecisionIntelligenceMountProps> = ({
  pageId,
  companyId = 'comp-100',
  companyName = 'Empresa',
  period = '2026',
  financialData,
  onExplore
}) => {
  const decisionOutput = useMemo(() => {
    return ExecutiveDecisionIntelligenceEngine.evaluate({
      companyId,
      userId: 'user-c-level',
      pageId,
      period,
      financialData
    });
  }, [companyId, pageId, period, financialData]);

  useMemo(() => {
    return ExecutiveExperienceComposer.compose({
      companyId,
      companyName,
      userId: 'user-c-level',
      pageId,
      period,
      activeFinancialMetrics: financialData
    });
  }, [companyId, companyName, pageId, period, financialData]);

  return (
    <div className="w-full space-y-4 mb-6">
      <ExecutiveIntelligenceRuntimeInspector pageId={pageId} hasRealData={!!financialData} />
      <ExecutiveDecisionSurface
        pageTitle={pageId}
        opportunityTitle={decisionOutput.signal.signalTitle}
        opportunityDetail={`${decisionOutput.narrative.executiveHeadline} (${decisionOutput.recommendation.expectedImpactText})`}
        onExploreAnalysis={onExplore}
      />
    </div>
  );
};
