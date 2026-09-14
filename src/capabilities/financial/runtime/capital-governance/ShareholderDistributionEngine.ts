// src/core/runtime/capital-governance/ShareholderDistributionEngine.ts
//
// Eixo 2 — Política de Capital (Distribuição)
// Ref: DLPA_GOVERNANCE_CURATION_PROTOCOL.md
//
// REGRA FIDUCIÁRIA:
// Na ausência de lucro e de distribuição, o payout NÃO é 0%.
// Deve assumir: "NÃO_APLICÁVEL_SEM_LUCRO"
//
// FAIL-CLOSED:
// "Pressão distributiva baixa" NÃO deve ser emitida quando
// a ausência de distribuição decorre da ausência de lucro.

import { ShareholderDistributionMetrics } from './capital-governance-types';

export function calculateShareholderDistribution(
  netIncome: number,
  totalDistributed: number
): ShareholderDistributionMetrics {

  // Evidência distributiva explícita — qualquer valor distribuído
  const hasDistributiveEvidence = totalDistributed > 0;

  // Sem lucro E sem distribuição → N/A fiduciário
  // Não inferir "pressão baixa" — a ausência de lucro naturalmente inviabiliza distribuição
  if (netIncome <= 0 && !hasDistributiveEvidence) {
    return {
      totalDistributed,
      distributionRatio: 0,
      hasDistributiveEvidence: false,
      distributionPressure: 'NÃO_APLICÁVEL_SEM_LUCRO'
    };
  }

  // Sem lucro MAS com distribuição → bloqueia análise de "pressão distributiva", 
  // que é aplicável apenas à base de lucro. A erosão será tratada em Integridade Patrimonial.
  if (netIncome <= 0 && hasDistributiveEvidence) {
    return {
      totalDistributed,
      distributionRatio: 0, // indefinido matematicamente
      hasDistributiveEvidence: true,
      distributionPressure: 'NÃO_APLICÁVEL_SEM_LUCRO'
    };
  }

  const distributionRatio = totalDistributed / netIncome;
  let distributionPressure: ShareholderDistributionMetrics['distributionPressure'];

  if (!hasDistributiveEvidence) {
    distributionPressure = 'BAIXA'; // lucro positivo e sem distribuição = conservador
  } else if (distributionRatio > 1) {
    distributionPressure = 'CRÍTICA'; // distribuindo mais que o lucro
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
    hasDistributiveEvidence,
    distributionPressure
  };
}
