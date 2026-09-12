// src/core/runtime/capital-governance/GovernanceCapitalBehaviorEngine.ts
//
// Eixo 4 — Governança Fiduciária
// Ref: DLPA_GOVERNANCE_CURATION_PROTOCOL.md
//
// MANDATORY FAIL-CLOSED RULE:
// "Governança Destrutiva" SOMENTE com hasDistributiveEvidence = true.
// Na ausência de evidência distributiva, o runtime assume interpretação conservadora.
//
// MANDATORY DOMAIN ISOLATION:
// Proibido inferir governança destrutiva baseada apenas em:
//   - prejuízo operacional
//   - queda do PL
//   - ausência de retenção
//
// Mapeamento:
//   MATURA          → reforço alto (>= 80) + preservação saudável
//   EM_DESENVOLVIMENTO → reforço moderado (>= 50)
//   FRAGILIZADA     → deterioração operacional SEM evidência distributiva
//   EM_ESTRUTURAÇÃO → dados iniciais / empresa nova
//   FRÁGIL          → reforço baixo (>= 30)
//   DESTRUTIVA      → SOMENTE com hasDistributiveEvidence = true

import {
  GovernanceCapitalBehaviorMetrics,
  CapitalRetentionMetrics,
  ShareholderDistributionMetrics,
  EquityPreservationMetrics,
  InstitutionalCapitalizationMetrics
} from './capital-governance-types';

export function calculateGovernanceCapitalBehavior(
  retention: CapitalRetentionMetrics,
  distribution: ShareholderDistributionMetrics,
  preservation: EquityPreservationMetrics,
  capitalization: InstitutionalCapitalizationMetrics
): GovernanceCapitalBehaviorMetrics {

  const hasDistributiveEvidence = distribution.hasDistributiveEvidence;

  // ── FAIL-CLOSED: sem evidência distributiva ─────────────────────────────────
  // Deterioração operacional → FRAGILIZADA, não DESTRUTIVA
  if (!hasDistributiveEvidence) {
    let capitalReinforcementIndex = 40; // base conservadora

    // Preservação patrimonial ajusta o índice
    if (preservation.preservationStatus === 'PRESERVAÇÃO_SAUDÁVEL') {
      capitalReinforcementIndex += 30;
    } else if (preservation.preservationStatus === 'EROSÃO_MODERADA') {
      capitalReinforcementIndex += 10;
    } else if (preservation.preservationStatus === 'EROSÃO_RELEVANTE') {
      capitalReinforcementIndex -= 10;
    } else if (preservation.preservationStatus === 'FRAGILIDADE_PATRIMONIAL') {
      capitalReinforcementIndex -= 20;
    }

    // Capitalização externa eleva índice
    if (capitalization.capitalizationStatus === 'INJEÇÃO_EXTERNA') {
      capitalReinforcementIndex += 10;
    }

    capitalReinforcementIndex = Math.max(0, Math.min(100, capitalReinforcementIndex));

    // Sem evidência distributiva: máximo é FRAGILIZADA (nunca DESTRUTIVA)
    let governanceMaturity: GovernanceCapitalBehaviorMetrics['governanceMaturity'];

    if (capitalReinforcementIndex >= 70) {
      governanceMaturity = 'EM_DESENVOLVIMENTO';
    } else if (capitalReinforcementIndex >= 40) {
      governanceMaturity = 'FRAGILIZADA';
    } else {
      governanceMaturity = 'EM_ESTRUTURAÇÃO';
    }

    return { capitalReinforcementIndex, hasDistributiveEvidence: false, governanceMaturity };
  }

  // ── COM evidência distributiva: análise completa ────────────────────────────
  let capitalReinforcementIndex = 0;

  // Preservação
  if (preservation.preservationStatus === 'PRESERVAÇÃO_SAUDÁVEL') {
    capitalReinforcementIndex += 50;
  } else if (preservation.preservationStatus === 'EROSÃO_MODERADA') {
    capitalReinforcementIndex += 30;
  } else if (preservation.preservationStatus === 'EROSÃO_RELEVANTE') {
    capitalReinforcementIndex += 10;
  }
  // FRAGILIDADE_PATRIMONIAL → não adiciona

  // Retenção
  if (
    retention.retentionStatus === 'ALTA_RETENÇÃO' ||
    retention.retentionStatus === 'RETENÇÃO_MODERADA'
  ) {
    capitalReinforcementIndex += 30;
  } else if (retention.retentionStatus === 'DISTRIBUIÇÃO_EXCESSIVA') {
    capitalReinforcementIndex -= 10;
  } else if (retention.retentionStatus === 'DESCAPITALIZAÇÃO_DELIBERADA') {
    capitalReinforcementIndex -= 30;
  }

  // Distribuição
  if (distribution.distributionPressure === 'BAIXA') {
    capitalReinforcementIndex += 20;
  } else if (distribution.distributionPressure === 'MODERADA') {
    capitalReinforcementIndex += 5;
  } else if (distribution.distributionPressure === 'ALTA') {
    capitalReinforcementIndex -= 10;
  } else if (distribution.distributionPressure === 'CRÍTICA') {
    capitalReinforcementIndex -= 30;
  }

  capitalReinforcementIndex = Math.max(0, Math.min(100, capitalReinforcementIndex));

  let governanceMaturity: GovernanceCapitalBehaviorMetrics['governanceMaturity'];

  if (capitalReinforcementIndex >= 80) {
    governanceMaturity = 'MATURA';
  } else if (capitalReinforcementIndex >= 55) {
    governanceMaturity = 'EM_DESENVOLVIMENTO';
  } else if (capitalReinforcementIndex >= 35) {
    governanceMaturity = 'FRÁGIL';
  } else {
    // Somente aqui, com evidência distributiva, DESTRUTIVA pode ser ativada
    governanceMaturity = 'DESTRUTIVA';
  }

  return { capitalReinforcementIndex, hasDistributiveEvidence: true, governanceMaturity };
}
