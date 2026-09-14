// src/core/runtime/institutional-resilience/CrisisLearningValidationEngine.ts

import { ResilienceEvaluationInput } from './ResilienceTypes';

export interface CrisisLearningResult {
  institutionalLearningScore: number;
  crisisRecurrenceRisk: 'HIGH' | 'MODERATE' | 'LOW';
  institutionalLearningDrivers: string[];
  governanceEvolutionStatus: 'REGRESSED' | 'STABLE' | 'IMPROVED';
}

export class CrisisLearningValidationEngine {
  public static evaluate(input: ResilienceEvaluationInput): CrisisLearningResult {
    let score = 50; // Base score
    const drivers: string[] = [];
    let recurrenceRisk: 'HIGH' | 'MODERATE' | 'LOW' = 'MODERATE';
    let governanceEvolution: 'REGRESSED' | 'STABLE' | 'IMPROVED' = 'STABLE';

    const history = input.longitudinalRuntimeHistory || [];
    const historicalCycles = input.historicalCycles || [];

    if (history.length < 3) {
      drivers.push('HISTORICO_INSUFICIENTE_PARA_VALIDACAO_APRENDIZADO');
      return {
        institutionalLearningScore: score, // Remains 50 (neutral)
        crisisRecurrenceRisk: 'MODERATE',
        institutionalLearningDrivers: drivers,
        governanceEvolutionStatus: 'STABLE'
      };
    }

    // Evaluate recurrence of FCO drops or survival triggers
    let survivalTriggersCount = 0;
    let negativeFcoCount = 0;

    history.forEach(cycle => {
      if (cycle.fco !== undefined && cycle.fco < 0) {
        negativeFcoCount++;
      }
      if (cycle.survivalModeActive) {
        survivalTriggersCount++;
      }
    });

    if (negativeFcoCount > 1 || survivalTriggersCount > 1) {
      score -= 30;
      recurrenceRisk = 'HIGH';
      drivers.push('REPETICAO_ESTRUTURAL_DE_CRISE');
      governanceEvolution = 'REGRESSED';
    } else if (negativeFcoCount === 1) {
      score += 10;
      drivers.push('ABSORCAO_E_CORRECAO_DE_CRISE_UNICA');
      governanceEvolution = 'IMPROVED';
    } else {
      score += 30;
      recurrenceRisk = 'LOW';
      drivers.push('AUSENCIA_DE_RECAIDAS_ESTRUTURAIS_HISTORICAS');
      governanceEvolution = 'IMPROVED';
    }

    // Evaluate if current treasury severity is better than past severities
    const currentSeverity = input.treasuryRuntime?.severity;
    const pastSeverities = history.map(h => h.treasurySeverity).filter(s => !!s);
    if (pastSeverities.includes('CRITICAL') && currentSeverity === 'STABLE') {
      score += 20;
      drivers.push('EVOLUCAO_DISCIPLINA_TESOURARIA');
    } else if (pastSeverities.includes('STABLE') && currentSeverity === 'CRITICAL') {
      score -= 20;
      governanceEvolution = 'REGRESSED';
      drivers.push('DETERIORACAO_GOVERNANCA_TESOURARIA');
    }

    score = Math.max(0, Math.min(100, score));

    if (score >= 80) {
      recurrenceRisk = 'LOW';
      governanceEvolution = 'IMPROVED';
    } else if (score < 40) {
      recurrenceRisk = 'HIGH';
      governanceEvolution = 'REGRESSED';
    }

    return {
      institutionalLearningScore: score,
      crisisRecurrenceRisk: recurrenceRisk,
      institutionalLearningDrivers: drivers,
      governanceEvolutionStatus: governanceEvolution
    };
  }
}
