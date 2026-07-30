import React, { useMemo } from 'react';
import { ExecutiveDecisionIntelligenceEngine } from '@illumine/executive-decision-intelligence';
import { ExecutiveExperienceComposer } from '@illumine/executive-experience-composer';
import { ExecutiveDecisionSurface } from './ExecutiveDecisionSurface';
import { ExecutiveIntelligenceRuntimeInspector } from './ExecutiveIntelligenceRuntimeInspector';
import { ExecutiveDecisionContextCard } from './ExecutiveDecisionContextCard';
import { ExecutiveIntentCard } from './ExecutiveIntentCard';
import { ExecutiveDiagnosisCard } from './ExecutiveDiagnosisCard';
import { ExecutiveDeliberationCard } from './ExecutiveDeliberationCard';
import { ExecutiveEvidenceCard } from './ExecutiveEvidenceCard';
import { ExecutiveExecutionCard } from './ExecutiveExecutionCard';
import { ExecutiveLearningCard } from './ExecutiveLearningCard';

export interface ExecutiveDecisionIntelligenceMountProps {
  readonly pageId: string;
  readonly companyId?: string;
  readonly companyName?: string;
  readonly period?: string;
  readonly financialData?: Record<string, number>;
  readonly previousPeriodFinancialData?: Record<string, number>;
  readonly onExplore?: () => void;
}

export const ExecutiveDecisionIntelligenceMount: React.FC<ExecutiveDecisionIntelligenceMountProps> = ({
  pageId,
  companyId = 'comp-100',
  companyName,
  period = '2026',
  financialData,
  previousPeriodFinancialData,
  onExplore
}) => {
  const decisionOutput = useMemo(() => {
    return ExecutiveDecisionIntelligenceEngine.evaluate({
      companyId,
      companyName,
      userId: 'user-c-level',
      pageId,
      period,
      financialData,
      previousPeriodFinancialData
    });
  }, [companyId, companyName, pageId, period, financialData, previousPeriodFinancialData]);

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

  const ctx = decisionOutput.context;

  return (
    <div className="w-full space-y-4 mb-6">
      {/* Dynamic Runtime Inspector */}
      <ExecutiveIntelligenceRuntimeInspector pageId={pageId} hasRealData={!!financialData} />

      {/* Layer 1 — Executive Context */}
      <ExecutiveDecisionContextCard context={ctx} />

      {/* Layer 2 — Executive Intent */}
      <ExecutiveIntentCard context={ctx} />

      {/* Layer 3 — Executive Understanding / Synthesis */}
      <ExecutiveDecisionSurface
        pageTitle={pageId}
        opportunityTitle={decisionOutput.signal.signalTitle}
        opportunityDetail={`${decisionOutput.narrative.executiveHeadline} (${decisionOutput.recommendation.expectedImpactText})`}
        onExploreAnalysis={onExplore}
      />

      {/* Layer 4 — Executive Diagnosis */}
      <ExecutiveDiagnosisCard context={ctx} />

      {/* Layer 5 — Executive Deliberation */}
      <ExecutiveDeliberationCard context={ctx} />

      {/* Layer 6 — Executive Evidence */}
      <ExecutiveEvidenceCard context={ctx} />

      {/* Layer 7 — Executive Execution */}
      <ExecutiveExecutionCard context={ctx} />

      {/* Layer 8 — Executive Learning */}
      <ExecutiveLearningCard context={ctx} />
    </div>
  );
};
