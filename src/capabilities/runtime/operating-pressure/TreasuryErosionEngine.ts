// src/core/runtime/operating-pressure/TreasuryErosionEngine.ts

import { PressureRuntimeInput, TreasuryErosionOutput } from './operating-pressure-types';

export class TreasuryErosionEngine {
  public static evaluate(input: PressureRuntimeInput): TreasuryErosionOutput {
    const current = input.currentCycle;
    const warnings: string[] = [];
    let score = 0;

    // 1. Negative Operating Cash Flow (OCF / FCO)
    const ocfNegative = current.ocf < 0;
    if (ocfNegative) {
      score += 40;
      warnings.push('Geração de fluxo de caixa operacional (FCO) negativa, consumindo reservas de caixa');
    } else if (current.ocf < current.revenue * 0.02) {
      score += 15;
      warnings.push('Geração de fluxo de caixa operacional positiva mas insignificante perante o faturamento');
    }

    // 2. OCF deterioration
    const ocfDropped = current.ocf < current.prevOcf;
    if (ocfDropped && current.prevOcf > 0) {
      const dropRatio = (current.prevOcf - current.ocf) / current.prevOcf;
      if (dropRatio > 0.3) {
        score += 20;
        warnings.push(`Deterioração severa no FCO em relação ao ciclo anterior (-${(dropRatio * 100).toFixed(1)}%)`);
      } else {
        score += 10;
        warnings.push('Declínio moderado no fluxo de caixa operacional comparado ao período anterior');
      }
    }

    // 3. Runway months depletion
    const runway = current.runwayMonths;
    let drainVelocity = 0;

    if (runway < 6) {
      score += 35;
      warnings.push(`Runway projetado crítico de apenas ${runway.toFixed(1)} meses sob queima corrente`);
      drainVelocity = 0.8;
    } else if (runway < 12) {
      score += 20;
      warnings.push(`Runway operacional de segurança reduzido (${runway.toFixed(1)} meses)`);
      drainVelocity = 0.4;
    } else if (runway < 24) {
      score += 5;
      drainVelocity = 0.1;
    }

    // Adjust score if cashSustainabilityReport warns of treasury pressure
    if (input.cashSustainabilityReport?.sustainabilityDiagnosis) {
      const isSustainabilityAlert = input.cashSustainabilityReport.sustainabilityDiagnosis.some(
        (d: any) => d.code?.includes('SUSTAINABILITY_ALERT') || d.code?.includes('RISK')
      );
      if (isSustainabilityAlert) {
        score += 15;
      }
    }

    const erosionScore = Math.min(Math.max(score, 0), 100);

    let erosionState: 'STABLE' | 'MODERATE' | 'ERODING' | 'CRITICAL_EROSION' = 'STABLE';
    if (erosionScore > 75) {
      erosionState = 'CRITICAL_EROSION';
    } else if (erosionScore > 50) {
      erosionState = 'ERODING';
    } else if (erosionScore > 25) {
      erosionState = 'MODERATE';
    }

    return {
      erosionScore,
      drainVelocity,
      erosionState,
      warnings
    };
  }
}
