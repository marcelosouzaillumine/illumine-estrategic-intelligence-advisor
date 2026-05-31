// src/core/runtime/institutional-resilience/AntifragilityAssessmentEngine.ts

import { ResilienceEvaluationInput } from './ResilienceTypes';

export interface AntifragilityResult {
  antifragilityScore: number;
  falseResilienceDetected: boolean;
  antifragilityValidated: boolean;
  antifragilityDrivers: string[];
}

export class AntifragilityAssessmentEngine {
  public static evaluate(
    input: ResilienceEvaluationInput,
    vulnerabilityScore: number,
    learningScore: number,
    shockAbsorptionScore: number,
    treasuryStatus: 'WEAKER' | 'UNCHANGED' | 'IMPROVED',
    governanceStatus: 'REGRESSED' | 'STABLE' | 'IMPROVED',
    continuityStatus: 'FRAGILE' | 'STABLE' | 'ROBUST',
    recurrenceRisk: 'HIGH' | 'MODERATE' | 'LOW'
  ): AntifragilityResult {
    let score = 0;
    const drivers: string[] = [];
    let falseResilienceDetected = false;
    let antifragilityValidated = false;

    // False Resilience Checks
    // 1. Temporary recovery interpreted as resilience (High runway but operating loss)
    const fco = input.fco ?? 0;
    const runway = input.cashIntelligenceRuntime?.continuityRisk?.projectedRunwayMonths ?? 12;
    if (runway > 12 && fco < 0) {
      falseResilienceDetected = true;
      drivers.push('RESILIENCIA_FALSA_CAIXA_ARTIFICIAL_SEM_FCO');
    }

    // 2. Resilience without vulnerability reduction
    if (vulnerabilityScore < 50) {
      falseResilienceDetected = true;
      drivers.push('RESILIENCIA_FALSA_VULNERABILIDADE_ATIVA');
    }

    // 3. Growth without governance strengthening
    if (governanceStatus === 'REGRESSED') {
      falseResilienceDetected = true;
      drivers.push('RESILIENCIA_FALSA_GOVERNANCA_FRAGILIZADA');
    }

    // Antifragility Scoring
    if (treasuryStatus === 'IMPROVED') score += 15;
    if (runway > 18) score += 15;
    if (governanceStatus === 'IMPROVED') score += 15;
    if (vulnerabilityScore > 80) score += 15;
    if (continuityStatus === 'ROBUST') score += 15;
    if (shockAbsorptionScore > 80) score += 10;
    if (recurrenceRisk === 'LOW') score += 15;

    // Fail-Closed Validation
    const history = input.longitudinalRuntimeHistory || [];
    if (history.length < 3) {
      antifragilityValidated = false;
      drivers.push('ANTIFRAGILIDADE_BLOQUEADA_POR_HISTORICO_INSUFICIENTE');
    } else if (falseResilienceDetected) {
      antifragilityValidated = false;
      drivers.push('ANTIFRAGILIDADE_BLOQUEADA_POR_FALSA_RESILIENCIA');
    } else if (score >= 80) {
      antifragilityValidated = true;
      drivers.push('ANTIFRAGILIDADE_ESTRUTURAL_VALIDADA');
    } else {
      antifragilityValidated = false;
      drivers.push('PONTUACAO_INSUFICIENTE_PARA_ANTIFRAGILIDADE');
    }

    score = Math.max(0, Math.min(100, score));

    return {
      antifragilityScore: score,
      falseResilienceDetected,
      antifragilityValidated,
      antifragilityDrivers: drivers
    };
  }
}
