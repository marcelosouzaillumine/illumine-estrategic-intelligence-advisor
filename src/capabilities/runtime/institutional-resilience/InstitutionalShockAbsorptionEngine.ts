// src/core/runtime/institutional-resilience/InstitutionalShockAbsorptionEngine.ts

import { ResilienceEvaluationInput } from './ResilienceTypes';

export interface ShockAbsorptionResult {
  shockAbsorptionScore: number;
  treasuryStrengtheningStatus: 'WEAKER' | 'UNCHANGED' | 'IMPROVED';
}

export class InstitutionalShockAbsorptionEngine {
  public static evaluate(input: ResilienceEvaluationInput): ShockAbsorptionResult {
    let score = 50; // Base score
    let treasuryStrengtheningStatus: 'WEAKER' | 'UNCHANGED' | 'IMPROVED' = 'UNCHANGED';

    const currentAvailableCash = input.availableCash ?? 0;
    const history = input.longitudinalRuntimeHistory || [];
    
    // Evaluate treasury trajectory over history
    if (history.length > 0) {
      const pastCash = history.map(h => h.availableCash).filter(c => c !== undefined) as number[];
      if (pastCash.length > 0) {
        const averagePastCash = pastCash.reduce((a, b) => a + b, 0) / pastCash.length;
        if (currentAvailableCash > averagePastCash * 1.2) {
          treasuryStrengtheningStatus = 'IMPROVED';
          score += 30;
        } else if (currentAvailableCash < averagePastCash * 0.8) {
          treasuryStrengtheningStatus = 'WEAKER';
          score -= 30;
        } else {
          treasuryStrengtheningStatus = 'UNCHANGED';
        }
      }
    }

    const runway = input.cashIntelligenceRuntime?.continuityRisk?.projectedRunwayMonths ?? 12;
    if (runway > 24) {
      score += 20;
    } else if (runway > 12) {
      score += 10;
    } else if (runway < 6) {
      score -= 20;
    }

    // Evaluate resilience drivers like funding dependence
    const currentSeverity = input.treasuryRuntime?.severity;
    if (currentSeverity === 'STABLE') {
      score += 10;
    } else if (currentSeverity === 'CRITICAL') {
      score -= 20;
    }

    score = Math.max(0, Math.min(100, score));

    return {
      shockAbsorptionScore: score,
      treasuryStrengtheningStatus
    };
  }
}
