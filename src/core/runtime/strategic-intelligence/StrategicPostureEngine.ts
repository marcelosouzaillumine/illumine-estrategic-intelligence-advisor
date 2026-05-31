// src/core/runtime/strategic-intelligence/StrategicPostureEngine.ts

import { StrategicEvaluationContext, StrategicPosture } from './strategic-intelligence-types';

export class StrategicPostureEngine {
  static evaluate(context: StrategicEvaluationContext): StrategicPosture {
    
    if (context.metadata.historicalCyclesCount < 2) {
      return 'UNVERIFIABLE_POSTURE';
    }

    const { scaleEfficiency, financialMetrics } = context.metrics;
    const isExpanding = (scaleEfficiency.recGrowth && scaleEfficiency.recGrowth > 0.05) || false;
    const hasSurvivalMode = context.survivalReport?.activeSurvivalMode === 'SURVIVAL_MODE';
    const hasExpansionSuspension = context.executiveCommand?.activeDirectives?.some(d => d.category === 'EXPANSION_SUSPENSION');
    const isRestricted = hasSurvivalMode || hasExpansionSuspension;
    const ocf = financialMetrics.ocf;

    // Se está em Survival Mode severo
    if (hasSurvivalMode && !isExpanding) {
      return 'CONTINUITY_POSTURE';
    }

    if (isRestricted) {
      return 'RESTRICTION_POSTURE';
    }

    if (isExpanding) {
      return 'EXPANSION_POSTURE';
    }

    // Se OCF está protegendo liquidez mas não há crescimento
    if (ocf > 0 && !isExpanding) {
      return 'PRESERVATION_POSTURE';
    }

    // Comportamento Flat
    return 'STABILIZATION_POSTURE';
  }
}
