import React from 'react';
import { ExecutiveExperienceContext } from '../../../../core/experience/runtime/ExecutiveExperienceContext';
import { FinancialPositionScoreSection } from '../FinancialPositionScoreSection';

interface FinancialPositionScoreRootProps {
  context: ExecutiveExperienceContext;
}

export function FinancialPositionScoreRoot({ context }: FinancialPositionScoreRootProps) {
  const score = context.intelligence.financialPosition?.pureViewModel?.score;
  return <FinancialPositionScoreSection score={score} />;
}
