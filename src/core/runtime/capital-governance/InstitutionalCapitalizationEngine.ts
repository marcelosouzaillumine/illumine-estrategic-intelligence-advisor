// src/core/runtime/capital-governance/InstitutionalCapitalizationEngine.ts
import { InstitutionalCapitalizationMetrics } from './capital-governance-types';

export function calculateInstitutionalCapitalization(
  capitalInjections: number,
  startingEquity: number,
  netIncome: number
): InstitutionalCapitalizationMetrics {
  
  let capitalizationRatio = 0;
  if (startingEquity > 0) {
    capitalizationRatio = capitalInjections / startingEquity;
  }

  let capitalizationStatus: 'ORGÂNICA' | 'INJEÇÃO_EXTERNA' | 'SEM_CAPITALIZAÇÃO' = 'SEM_CAPITALIZAÇÃO';

  if (capitalInjections > 0) {
    capitalizationStatus = 'INJEÇÃO_EXTERNA';
  } else if (netIncome > 0) {
    capitalizationStatus = 'ORGÂNICA';
  }

  return {
    capitalInjections,
    capitalizationRatio,
    capitalizationStatus
  };
}
