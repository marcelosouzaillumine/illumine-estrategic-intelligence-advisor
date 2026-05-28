// src/core/runtime/capital-governance/CapitalRetentionEngine.ts
import { CapitalRetentionMetrics } from './capital-governance-types';

export function calculateCapitalRetention(
  netIncome: number,
  retainedEarnings: number
): CapitalRetentionMetrics {
  
  let retentionRatio = 0;
  if (netIncome > 0) {
    retentionRatio = retainedEarnings / netIncome;
  }

  let retentionStatus: 'ALTA_RETENÇÃO' | 'RETENÇÃO_MODERADA' | 'DISTRIBUIÇÃO_EXCESSIVA' | 'DESCAPITALIZAÇÃO' | 'NÃO_APLICÁVEL' = 'NÃO_APLICÁVEL';

  if (netIncome <= 0 && retainedEarnings < 0) {
    retentionStatus = 'DESCAPITALIZAÇÃO';
  } else if (netIncome <= 0) {
    retentionStatus = 'NÃO_APLICÁVEL';
  } else if (retentionRatio > 0.8) {
    retentionStatus = 'ALTA_RETENÇÃO';
  } else if (retentionRatio >= 0.3) {
    retentionStatus = 'RETENÇÃO_MODERADA';
  } else {
    retentionStatus = 'DISTRIBUIÇÃO_EXCESSIVA';
  }

  return {
    netIncome,
    retainedEarnings,
    retentionRatio,
    retentionStatus
  };
}
