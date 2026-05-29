// src/core/runtime/treasury-intelligence/CapitalPreservationEngine.ts

import { CapitalPreservationOutput } from './types';

export interface PreservationEvaluationInput {
  startingEquity: number;
  endingEquity: number;
  netIncome: number;
  availableCash: number;
  prevCaixa: number;
}

export class CapitalPreservationEngine {
  /**
   * Evaluates reserve preservation discipline, equity decay,
   * and computes a final capital preservation score.
   */
  public static evaluate(input: PreservationEvaluationInput): CapitalPreservationOutput {
    const {
      startingEquity,
      endingEquity,
      netIncome,
      availableCash,
      prevCaixa
    } = input;

    // 1. Reserve Erosion Velocity (Daily Cash decay between cycles)
    let reserveErosionVelocity = 0;
    if (availableCash < prevCaixa) {
      reserveErosionVelocity = Math.round(((prevCaixa - availableCash) / 30) * 100) / 100;
    }

    // 2. Preservation Score Math
    let preservationScore = 100;

    // Equity drop penalty
    if (endingEquity < startingEquity && startingEquity > 0) {
      const dropPct = ((startingEquity - endingEquity) / startingEquity) * 100;
      preservationScore -= dropPct * 1.5;
    }

    // Cash drop penalty
    if (availableCash < prevCaixa && prevCaixa > 0) {
      const cashDropPct = ((prevCaixa - availableCash) / prevCaixa) * 100;
      preservationScore -= cashDropPct * 0.8;
    }

    // Net income loss penalty
    if (netIncome < 0) {
      preservationScore -= 15;
    }

    preservationScore = Math.round(Math.min(Math.max(preservationScore, 0), 100));

    // 3. Discipline category assignment
    let preservationDiscipline: 'HIGH' | 'MODERATE' | 'LOW' | 'DEVIATING' = 'HIGH';
    if (preservationScore >= 80) {
      preservationDiscipline = 'HIGH';
    } else if (preservationScore >= 60) {
      preservationDiscipline = 'MODERATE';
    } else if (preservationScore >= 40) {
      preservationDiscipline = 'LOW';
    } else {
      preservationDiscipline = 'DEVIATING';
    }

    return {
      preservationScore,
      preservationDiscipline,
      reserveErosionVelocity
    };
  }
}
