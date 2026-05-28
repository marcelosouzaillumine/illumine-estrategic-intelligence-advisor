// src/core/runtime/capital-governance/ShareholderDistributionEngine.ts
import { ShareholderDistributionMetrics } from './capital-governance-types';

export function calculateShareholderDistribution(
  netIncome: number,
  totalDistributed: number
): ShareholderDistributionMetrics {
  
  let distributionRatio = 0;
  if (netIncome > 0) {
    distributionRatio = totalDistributed / netIncome;
  }

  let distributionPressure: 'BAIXA' | 'MODERADA' | 'ALTA' | 'CRÍTICA' | 'NÃO_APLICÁVEL' = 'NÃO_APLICÁVEL';

  if (totalDistributed <= 0) {
    distributionPressure = 'BAIXA';
  } else if (netIncome <= 0 && totalDistributed > 0) {
    // Distributing capital while having a loss
    distributionPressure = 'CRÍTICA';
  } else if (distributionRatio > 1) {
    // Distributing more than the net income
    distributionPressure = 'CRÍTICA';
  } else if (distributionRatio > 0.7) {
    distributionPressure = 'ALTA';
  } else if (distributionRatio >= 0.3) {
    distributionPressure = 'MODERADA';
  } else {
    distributionPressure = 'BAIXA';
  }

  return {
    totalDistributed,
    distributionRatio,
    distributionPressure
  };
}
