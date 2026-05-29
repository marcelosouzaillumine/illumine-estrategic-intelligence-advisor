// src/core/runtime/strategic-simulation/ResilienceOptimizationEngine.ts
//
// Resilience Optimization Engine
// Evaluates growth vs preservation and maps the safest recovery curve/viability index.

import { SimulatedPath } from './simulation-types';

export class ResilienceOptimizationEngine {
  /**
   * Computes the Recovery Viability Index (0-100) for a simulated path.
   * Prioritizes low fatigue, strong cash runway, and robust composite survivability.
   */
  public static calculateRecoveryViability(path: SimulatedPath): number {
    const composite = path.finalSurvivabilityScores.composite;
    const fatigue = path.finalFatigue.compositeFatigue;
    const runway = path.liquidityRunwayCycles;

    if (path.classification === 'UNSUSTAINABLE' || path.classification === 'COLLAPSE_TRAJECTORY') {
      const isPreservation = path.category === 'Survival Stabilization' || path.category === 'Conservative Preservation';
      return isPreservation ? 30 : 15; // Preservation has higher baseline viability
    }

    // Weighting: 50% composite survivability, 30% fatigue reduction, 20% runway availability
    const compositeWeight = composite * 0.5;
    const fatigueWeight = (100 - fatigue) * 0.3;
    const runwayWeight = Math.min(100, runway * 8) * 0.2; // 12+ months gives maximum runway score

    const rawScore = Math.round(compositeWeight + fatigueWeight + runwayWeight);
    return Math.max(0, Math.min(100, rawScore));
  }

  /**
   * Computes resilience recovery rate per cycle.
   */
  public static projectResilienceRecovery(path: SimulatedPath): number[] {
    const initialResilience = 50;
    const targetResilience = this.calculateRecoveryViability(path);
    const horizon = path.horizon;

    // Linear/Exponential projection of recovery curve over the horizon cycles
    const curve: number[] = [];
    for (let t = 1; t <= horizon; t++) {
      const progress = t / horizon;
      const val = Math.round(initialResilience + (targetResilience - initialResilience) * progress);
      curve.push(Math.max(0, Math.min(100, val)));
    }
    return curve;
  }
}
