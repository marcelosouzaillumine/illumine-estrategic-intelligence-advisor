// src/core/runtime/capital-governance/CapitalRetentionEngine.ts
//
// Eixo 2 — Política de Capital (Retenção)
// Ref: DLPA_GOVERNANCE_CURATION_PROTOCOL.md
//
// REGRA FIDUCIÁRIA: Na ausência de lucro distribuível,
// a taxa de retenção NÃO deve ser interpretada como 0%.
// Deve assumir: "NÃO_APLICÁVEL_SEM_LUCRO"

import { CapitalRetentionMetrics } from './capital-governance-types';

export function calculateCapitalRetention(
  netIncome: number,
  retainedEarnings: number
): CapitalRetentionMetrics {

  // Sem base distributiva — não inferir retenção como 0%
  if (netIncome <= 0) {
    return {
      netIncome,
      retainedEarnings,
      retentionRatio: 0, // Should not be interpreted mathematically when <= 0
      retentionStatus: netIncome < 0 ? 'RETENÇÃO_COMPULSÓRIA_POR_PREJUÍZO' : 'AUSÊNCIA_DE_CAPACIDADE_DISTRIBUTIVA'
    };
  }

  const retentionRatio = retainedEarnings / netIncome;

  let retentionStatus: CapitalRetentionMetrics['retentionStatus'];

  if (retentionRatio > 0.8) {
    retentionStatus = 'ALTA_RETENÇÃO';
  } else if (retentionRatio >= 0.3) {
    retentionStatus = 'RETENÇÃO_MODERADA';
  } else if (retentionRatio >= 0) {
    retentionStatus = 'DISTRIBUIÇÃO_EXCESSIVA';
  } else {
    // retainedEarnings negativo com lucro positivo (distribuição acima do lucro)
    // Este é o único caso onde DESCAPITALIZAÇÃO_DELIBERADA pode ser ativada
    retentionStatus = 'DESCAPITALIZAÇÃO_DELIBERADA';
  }

  return {
    netIncome,
    retainedEarnings,
    retentionRatio,
    retentionStatus
  };
}
