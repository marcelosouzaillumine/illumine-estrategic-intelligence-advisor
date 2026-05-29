// src/core/runtime/strategic-simulation/InstitutionalPreservationEngine.ts
//
// Institutional Preservation Engine
// Verifies compliance with strict preservation metrics (anti-erosion, distribution limits).

import { SimulatedPath } from './simulation-types';

export class InstitutionalPreservationEngine {
  /**
   * Verifies if the simulated path complies with preservation limits and anti-erosion principles.
   */
  public static checkPreservationLimits(
    path: SimulatedPath,
    initialReport: any
  ): { isCompliant: boolean; violations: string[] } {
    const violations: string[] = [];
    const scores = path.finalSurvivabilityScores;

    const netIncome = initialReport.metrics?.netIncome ?? initialReport.netIncome ?? 0;
    const preservationStatus = initialReport.capitalGovernanceReport?.preservation?.preservationStatus ?? 'PRESERVAÇÃO_SAUDÁVEL';
    const isErosionActive = preservationStatus === 'EROSÃO_RELEVANTE' || preservationStatus === 'FRAGILIDADE_PATRIMONIAL';

    const isDistributingCategory =
      path.category === 'Aggressive Expansion' ||
      path.category === 'Debt-Financed Growth' ||
      path.category === 'Controlled Growth';

    // 1. Check for dividend / distribution violations under capital erosion or negative income
    if (isDistributingCategory) {
      if (isErosionActive || netIncome <= 0) {
        violations.push(
          `VIOLAÇÃO DE PRESERVAÇÃO: Distribuição/Expansão indevida sob erosão patrimonial ativa (${preservationStatus}) ou lucro líquido negativo.`
        );
      }
      
      // 2. Strict score checks for capital preservation
      if (scores.capitalPreservation < 40) {
        violations.push(
          `VIOLAÇÃO DE PRESERVAÇÃO: O score de preservação de capital (${scores.capitalPreservation}) é inferior ao limite de salvaguarda de 40/100.`
        );
      }
      
      if (scores.liquidity < 40) {
        violations.push(
          `VIOLAÇÃO DE PRESERVAÇÃO: O score de liquidez (${scores.liquidity}) é inferior ao limite de salvaguarda de 40/100.`
        );
      }
    }

    // 3. Fail-closed on severe composite score degradation
    if (scores.composite < 30) {
      violations.push(
        `COLAPSO DE PRESERVAÇÃO: Sobrevivência composta (${scores.composite}) abaixo do patamar absoluto de tolerância (30/100).`
      );
    }

    return {
      isCompliant: violations.length === 0,
      violations
    };
  }
}
