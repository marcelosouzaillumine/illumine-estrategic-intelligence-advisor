import React from 'react';
import { ExecutiveExperienceContext } from '../../../../core/experience/runtime/ExecutiveExperienceContext';
import { HistoricalEvolutionSection } from '../HistoricalEvolutionSection';

interface HistoricalEvolutionRootProps {
  context: ExecutiveExperienceContext;
}

export function HistoricalEvolutionRoot({ context }: HistoricalEvolutionRootProps) {
  const historicalEvolution = context.intelligence.financialPosition?.pureViewModel?.historicalEvolution;
  
  if (!historicalEvolution || !historicalEvolution.available) {
    return null;
  }
  
  return <HistoricalEvolutionSection historicalEvolution={historicalEvolution} />;
}
