// src/core/runtime/predictive-intelligence/InstitutionalResilienceEngine.ts
//
// Institutional Resilience Engine
// Measures corporate adaptive resilience and identifies fragile recovery pathways.

import { ExecutiveDecision } from '../decision-intelligence/decision-types';
import { FatigueMetrics, BehaviorProfile } from '../behavioral-intelligence/behavioral-types';

export interface ResilienceAssessment {
  resilienceIndex: number; // 0-100
  isRecoveryFragile: boolean;
  resilienceWarnings: string[];
  persistenceYears: number; // estimated resilience persistence under current stress
}

export class InstitutionalResilienceEngine {
  /**
   * Computes the adaptive resilience index and assesses recovery quality.
   */
  public static evaluateResilience(
    history: ExecutiveDecision[],
    report: any,
    profile: BehaviorProfile,
    fatigue: FatigueMetrics
  ): ResilienceAssessment {
    let resilienceIndex = 70; // baseline
    const resilienceWarnings: string[] = [];
    let isRecoveryFragile = false;

    // 1. Governance and profile factors
    // Prudence and consistency improve resilience, risk escalation reduces it
    resilienceIndex += Math.round((profile.prudence - 50) * 0.3);
    resilienceIndex += Math.round((profile.governanceConsistency - 70) * 0.2);
    resilienceIndex -= Math.round(profile.riskEscalationTendency * 0.4);

    // High fatigue drains resilience
    resilienceIndex -= Math.round(fatigue.compositeFatigue * 0.3);

    // 2. Financial Context Factors
    const ocf = report?.cashFlowReport?.operational?.fco ?? report?.ocf ?? 0;
    const isErosionActive = report?.capitalGovernanceReport?.preservation?.preservationStatus === 'EROSÃO_RELEVANTE' ||
      report?.capitalGovernanceReport?.preservation?.preservationStatus === 'FRAGILIDADE_PATRIMONIAL';

    if (ocf > 0) {
      resilienceIndex += 10;
    } else {
      resilienceIndex -= 15;
    }

    if (isErosionActive) {
      resilienceIndex -= 15;
    }

    // 3. Fragile Recovery Detection
    // Flag recovery as fragile if scores are rising due to high leverage/debt expansion while operational generation remains negative
    const hasDebtExpansion = history.slice(-3).some(d => d.domains.includes('Debt Expansion') || d.domains.includes('Financing Strategy'));
    const isLiquidityUp = profile.prudence > 60; // proxy for improved cash indicators

    if (isLiquidityUp && ocf <= 0 && hasDebtExpansion) {
      isRecoveryFragile = true;
      resilienceWarnings.push(
        'Recuperação Frágil: Melhora recente nos níveis de caixa financiada por captação de dívida, sem sustentabilidade operacional.'
      );
      resilienceIndex -= 20;
    }

    // Also fragile if composite score is improving but fatigue remains high
    if (fatigue.compositeFatigue > 65) {
      isRecoveryFragile = true;
      resilienceWarnings.push(
        'Recuperação Frágil: Governança sob extrema fadiga decisória recorrente; resiliência exaurida.'
      );
      resilienceIndex -= 10;
    }

    // Normalize
    resilienceIndex = Math.max(0, Math.min(100, resilienceIndex));

    // Persistence calculation: how long before depletion under current stress level
    let persistenceYears = 3.0; // standard
    if (resilienceIndex < 40) {
      persistenceYears = 0.5;
    } else if (resilienceIndex < 60) {
      persistenceYears = 1.5;
    } else if (resilienceIndex >= 80) {
      persistenceYears = 5.0;
    }

    return {
      resilienceIndex,
      isRecoveryFragile,
      resilienceWarnings,
      persistenceYears
    };
  }
}
