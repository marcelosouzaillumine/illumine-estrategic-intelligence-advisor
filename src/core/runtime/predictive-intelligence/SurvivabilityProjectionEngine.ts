// src/core/runtime/predictive-intelligence/SurvivabilityProjectionEngine.ts
//
// Survivability Projection Engine
// Projects future survivability dimensions using momentum and acceleration.

import { SurvivabilityScores } from '../decision-intelligence/decision-types';
import { MomentumMetrics } from './DeteriorationMomentumEngine';

export interface ProjectedSurvivability {
  projectedScores: SurvivabilityScores;
  stepsToThresholdViolation: Record<string, number>; // dimension -> steps to fall below 30
  isImminentRupture: boolean;
}

export class SurvivabilityProjectionEngine {
  /**
   * Projects survivability scores forward by N steps using velocity and acceleration derivatives.
   */
  public static projectSurvivability(
    currentScores: SurvivabilityScores,
    momentum: MomentumMetrics,
    steps: number
  ): ProjectedSurvivability {
    const projectDimension = (current: number, velocity: number, acceleration: number): number => {
      // Y(t) = Y(0) + V * t + 0.5 * A * t^2
      const projected = current + velocity * steps + 0.5 * acceleration * Math.pow(steps, 2);
      return Math.round(Math.max(0, Math.min(100, projected)));
    };

    const projectedScores: SurvivabilityScores = {
      liquidity: projectDimension(currentScores.liquidity, momentum.liquidityMomentum, momentum.liquidityAcceleration),
      operational: projectDimension(currentScores.operational, momentum.survivabilityMomentum, momentum.survivabilityAcceleration),
      governance: projectDimension(currentScores.governance, momentum.governanceStabilityMomentum, momentum.governanceStabilityAcceleration),
      debt: projectDimension(currentScores.debt, momentum.survivabilityMomentum, momentum.survivabilityAcceleration),
      capitalPreservation: projectDimension(currentScores.capitalPreservation, momentum.liquidityMomentum, momentum.liquidityAcceleration),
      strategic: projectDimension(currentScores.strategic, momentum.strategicVolatilityMomentum, momentum.strategicVolatilityAcceleration),
      composite: 0
    };

    projectedScores.composite = Math.round(
      (projectedScores.liquidity +
        projectedScores.operational +
        projectedScores.governance +
        projectedScores.debt +
        projectedScores.capitalPreservation +
        projectedScores.strategic) / 6
    );

    // Calculate steps until a dimension drops below its critical threshold (e.g. 30 for dimensions, 50 for composite)
    const stepsToThresholdViolation: Record<string, number> = {};
    const dimensions = ['liquidity', 'governance', 'capitalPreservation', 'composite'] as const;

    for (const dim of dimensions) {
      const limit = dim === 'composite' ? 50 : 30;
      const currentVal = dim === 'composite' ? currentScores.composite : currentScores[dim];
      
      let velocity = 0;
      let acceleration = 0;

      if (dim === 'liquidity' || dim === 'capitalPreservation') {
        velocity = momentum.liquidityMomentum;
        acceleration = momentum.liquidityAcceleration;
      } else if (dim === 'governance') {
        velocity = momentum.governanceStabilityMomentum;
        acceleration = momentum.governanceStabilityAcceleration;
      } else {
        // composite/overall
        velocity = momentum.survivabilityMomentum;
        acceleration = momentum.survivabilityAcceleration;
      }

      if (currentVal <= limit) {
        stepsToThresholdViolation[dim] = 0;
      } else if (velocity >= 0 && acceleration >= 0) {
        stepsToThresholdViolation[dim] = Infinity; // not declining
      } else {
        // Find first step t where Y(t) <= limit
        let found = false;
        for (let t = 1; t <= 15; t++) {
          const val = currentVal + velocity * t + 0.5 * acceleration * Math.pow(t, 2);
          if (val <= limit) {
            stepsToThresholdViolation[dim] = t;
            found = true;
            break;
          }
        }
        if (!found) {
          stepsToThresholdViolation[dim] = Infinity;
        }
      }
    }

    // Rupture is imminent if any critical threshold is crossed in less than 3 steps
    const isImminentRupture = Object.values(stepsToThresholdViolation).some(t => t <= 2);

    return {
      projectedScores,
      stepsToThresholdViolation,
      isImminentRupture
    };
  }
}
