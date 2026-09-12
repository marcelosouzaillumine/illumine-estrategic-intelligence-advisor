import React from 'react';
import { ExecutiveExperienceContext } from '../../../../core/experience/runtime/ExecutiveExperienceContext';
import { ExecutivePositionSummarySection } from '../ExecutivePositionSummarySection';

interface ExecutivePositionSummaryRootProps {
  context: ExecutiveExperienceContext;
}

export function ExecutivePositionSummaryRoot({ context }: ExecutivePositionSummaryRootProps) {
  const summary = context.intelligence.financialPosition?.pureViewModel?.executiveSummary;
  return <ExecutivePositionSummarySection summary={summary} />;
}
