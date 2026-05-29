// src/core/runtime/treasury-intelligence/ReinvestmentIntelligenceEngine.ts

import { ReinvestmentIntelligenceOutput } from './types';

export interface ReinvestmentEvaluationInput {
  allocationsToExpansion: number;
  ebitda: number;
  runwayMonths: number;
  historicalCyclesCount: number;
}

export class ReinvestmentIntelligenceEngine {
  /**
   * Evaluates capital reinvestment quality, expected return sustainability,
   * compatibility with institutional survivability, and flags reinvestment fragilities.
   */
  public static evaluate(input: ReinvestmentEvaluationInput): ReinvestmentIntelligenceOutput {
    const {
      allocationsToExpansion,
      ebitda,
      runwayMonths,
      historicalCyclesCount
    } = input;

    const warnings: string[] = [];
    let operationalReturnSustainability = 80; // Baseline high sustainability

    // 1. Operational EBITDA return sanity
    if (ebitda < 0) {
      operationalReturnSustainability -= 35;
      warnings.push(
        'REINVESTMENT_IN_NEGATIVE_EBITDA: Alocação de Capex em negócio com EBITDA negativo (destruição de caixa operacional).'
      );
    } else if (ebitda > 0 && allocationsToExpansion > ebitda * 0.8) {
      operationalReturnSustainability -= 15;
      warnings.push(
        'EXCESSIVE_REINVESTMENT_OVER_EBITDA: Reinvestimento excede 80% da geração EBITDA (exposição de fluxo).'
      );
    }

    // 2. Compatibility check with runway
    if (runwayMonths < 6) {
      operationalReturnSustainability -= 30;
      warnings.push(
        'REINVESTMENT_UNDER_CRITICAL_RUNWAY: Reinvestimento em expansão conflita diretamente com a sobrevivência imediata.'
      );
    } else if (runwayMonths < 12) {
      operationalReturnSustainability -= 15;
      warnings.push(
        'REINVESTMENT_UNDER_SENSITIVE_RUNWAY: Reinvestimento tensiona o horizonte de caixa sensível (< 12 meses).'
      );
    }

    // 3. Historical density warning
    if (historicalCyclesCount < 2) {
      warnings.push(
        'INSUFFICIENT_HISTORY_FOR_RETURN_ASSESSMENT: Falta de histórico anterior impede calibração precisa do retorno sobre reinvestimento.'
      );
    }

    operationalReturnSustainability = Math.round(Math.max(operationalReturnSustainability, 0));

    // Determine Reinvestment Quality
    let reinvestmentQuality: 'HIGH' | 'MODERATE' | 'LOW' | 'FRAGILE' = 'HIGH';
    if (runwayMonths < 6 && allocationsToExpansion > 0) {
      reinvestmentQuality = 'FRAGILE';
    } else if (operationalReturnSustainability >= 75) {
      reinvestmentQuality = 'HIGH';
    } else if (operationalReturnSustainability >= 50) {
      reinvestmentQuality = 'MODERATE';
    } else {
      reinvestmentQuality = 'LOW';
    }

    const compatibilityWithSurvivability = runwayMonths >= 12 && operationalReturnSustainability >= 55;

    return {
      reinvestmentQuality,
      operationalReturnSustainability,
      compatibilityWithSurvivability,
      warnings
    };
  }
}
