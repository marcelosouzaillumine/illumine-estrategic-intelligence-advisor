// src/core/runtime/predictive-intelligence/StrategicCollapseRiskEngine.ts
//
// Strategic Collapse Risk Engine
// Identifies strategic instability patterns, propagation chains, and systemic collapse risks.

import { ExecutiveDecision } from '../decision-intelligence/decision-types';
import { BehaviorProfile } from '../behavioral-intelligence/behavioral-types';
import { ProjectedSurvivability } from './SurvivabilityProjectionEngine';

export interface StrategicCollapseAssessment {
  systemicFailureProbability: number; // 0-100
  collapseFactors: string[];
  isExhausted: boolean;
}

export class StrategicCollapseRiskEngine {
  /**
   * Assesses systemic strategic collapse risk based on decisions history and future projections.
   */
  public static evaluateCollapseRisk(
    history: ExecutiveDecision[],
    report: any,
    profile: BehaviorProfile,
    projection: ProjectedSurvivability
  ): StrategicCollapseAssessment {
    const collapseFactors: string[] = [];
    let score = 10; // start low

    const rolling = history.slice(-10);
    const ocf = report?.cashFlowReport?.operational?.fco ?? report?.ocf ?? 0;
    const isErosionActive = report?.capitalGovernanceReport?.preservation?.preservationStatus === 'EROSÃO_RELEVANTE' ||
      report?.capitalGovernanceReport?.preservation?.preservationStatus === 'FRAGILIDADE_PATRIMONIAL';

    const dividendCount = rolling.filter(d => d.domains.includes('Dividend Distribution')).length;
    const expansionCount = rolling.filter(d => d.domains.includes('Operational Expansion') || d.domains.includes('Workforce Expansion')).length;
    const capexCount = rolling.filter(d => d.domains.includes('CAPEX')).length;

    // 1. Check for aggressive expansion under operational decay (propagation check)
    const hasAggressiveSequence = (dividendCount + expansionCount + capexCount) >= 4;
    const isReportStressed = report?.scores?.composite < 50 || ocf < 0;

    if (hasAggressiveSequence && isReportStressed) {
      score += 40;
      collapseFactors.push('Sequência de expansões agressivas sob fluxo de caixa operacional negativo.');
    }

    // 2. Check for leverage propagation (expansion backed by debt with no margins)
    const debtCount = rolling.filter(d => d.domains.includes('Debt Expansion') || d.domains.includes('Financing Strategy')).length;
    if (debtCount >= 2 && ocf < 0) {
      score += 25;
      collapseFactors.push('Alavancagem recorrente sem geração de caixa operacional (estrangulamento financeiro).');
    }

    // 3. Fiduciary reserves erosion
    if (isErosionActive && dividendCount >= 2) {
      score += 25;
      collapseFactors.push('Erosão patrimonial ativa amplificada por retiradas recorrentes de capital.');
    }

    // 4. Expose projection warnings
    if (projection.isImminentRupture) {
      score += 20;
      collapseFactors.push('Projeção de sobrevivência prevê violação iminente de thresholds operacionais.');
    }

    // Expose exhaustion status (composite score drops below 40 or multiple collapse factors)
    const isExhausted = report?.scores?.composite < 40 || collapseFactors.length >= 3;
    if (isExhausted) {
      score += 15;
    }

    const systemicFailureProbability = Math.max(0, Math.min(100, score));

    return {
      systemicFailureProbability,
      collapseFactors,
      isExhausted
    };
  }
}
