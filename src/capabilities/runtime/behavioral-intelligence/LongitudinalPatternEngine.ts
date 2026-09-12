// src/core/runtime/behavioral-intelligence/LongitudinalPatternEngine.ts
//
// Longitudinal Pattern Engine
// Identifies cyclic behavioral anomalies, calculates turnaround success probability,
// and extracts early warning signals from longitudinal history.

import { ExecutiveDecision } from '../decision-intelligence/decision-types';
import { BehaviorProfile } from './behavioral-types';

export interface LongitudinalPatterns {
  detectedPatterns: string[];
  turnaroundSuccessProbability: number; // 0-100
  warningSignals: string[];
  isDeteriorating: boolean;
}

export class LongitudinalPatternEngine {
  /**
   * Evaluates historical decisions and current profile to detect patterns and warnings.
   */
  public static analyzePatterns(
    history: ExecutiveDecision[],
    report: any,
    currentProfile: BehaviorProfile
  ): LongitudinalPatterns {
    const detectedPatterns: string[] = [];
    const warningSignals: string[] = [];
    let turnaroundSuccessProbability = 70; // starts at reasonable baseline
    let isDeteriorating = false;

    if (!history || history.length === 0) {
      return {
        detectedPatterns,
        turnaroundSuccessProbability: 100,
        warningSignals,
        isDeteriorating
      };
    }

    const rollingHistory = history.slice(-15);
    const costReductionCount = rollingHistory.filter(d => d.domains.includes('Cost Reduction')).length;
    const expansionCount = rollingHistory.filter(d => d.domains.includes('Operational Expansion') || d.domains.includes('Workforce Expansion')).length;
    const dividendCount = rollingHistory.filter(d => d.domains.includes('Dividend Distribution')).length;

    // 1. Detect Operational Rollercoaster (Alternating expansions and cost cuts)
    if (costReductionCount >= 2 && expansionCount >= 2) {
      detectedPatterns.push('Ciclo de Instabilidade Operacional (Expansão-Retração)');
      warningSignals.push('A empresa alterna frequentemente entre expansão e cortes emergenciais, sinalizando falta de direcionamento estratégico.');
      turnaroundSuccessProbability -= 20;
    }

    // 2. Detect Fiduciary Distress Cycle (Dividends distributed under stress)
    const isErosionActive = report?.capitalGovernanceReport?.preservation?.preservationStatus === 'EROSÃO_RELEVANTE' ||
      report?.capitalGovernanceReport?.preservation?.preservationStatus === 'FRAGILIDADE_PATRIMONIAL';
    const ocf = report?.cashFlowReport?.operational?.fco ?? report?.ocf ?? 0;

    if (dividendCount >= 2 && (isErosionActive || ocf < 0)) {
      detectedPatterns.push('Erosão Fiduciária Recorrente (Distribuição sob Estresse)');
      warningSignals.push('Saídas de capital repetidas durante períodos de fluxo de caixa negativo ou erosão patrimonial.');
      turnaroundSuccessProbability -= 30;
      isDeteriorating = true;
    }

    // 3. Turnaround Success Probability Calculation
    // Adjust turnaround metrics if organization is in turnaround posture
    const isTurnaroundActive = currentProfile.recoveryCapacity >= 65 || costReductionCount >= 2;
    if (isTurnaroundActive) {
      // Success probability increases if prudence is high and risk escalation is low
      turnaroundSuccessProbability += Math.round((currentProfile.prudence - 50) * 0.5);
      turnaroundSuccessProbability -= Math.round(currentProfile.riskEscalationTendency * 0.4);

      if (ocf > 0) {
        turnaroundSuccessProbability += 15;
      } else {
        turnaroundSuccessProbability -= 15;
      }

      if (currentProfile.governanceConsistency > 70) {
        turnaroundSuccessProbability += 10;
      }
    } else {
      turnaroundSuccessProbability = 100; // default if not in turnaround context
    }

    // 4. Early warning signals
    if (currentProfile.riskEscalationTendency > 60) {
      warningSignals.push('Tendência de escalada de risco comportamental acima dos limites recomendados.');
      isDeteriorating = true;
    }

    if (currentProfile.prudence < 35 && currentProfile.aggressiveness > 65) {
      warningSignals.push('Exposição extrema: Postura agressiva com margens de prudência fiduciária exauridas.');
      isDeteriorating = true;
    }

    // Normalize turnaround success probability
    turnaroundSuccessProbability = Math.max(0, Math.min(100, turnaroundSuccessProbability));

    return {
      detectedPatterns,
      turnaroundSuccessProbability,
      warningSignals,
      isDeteriorating
    };
  }
}
