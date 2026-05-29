// src/core/runtime/strategic-simulation/StrategicPathComparisonEngine.ts
//
// Strategic Path Comparison Engine
// Formulates side-by-side matrices and calculates uncertainty/confidence bounds.

import { SimulatedPath, StressProfile } from './simulation-types';

export interface ComparisonMatrixRow {
  category: string;
  compositeScore: number;
  runwayMonths: number;
  fatigueScore: number;
  classification: string;
  volatilityRange: { min: number; max: number };
}

export class StrategicPathComparisonEngine {
  /**
   * Compares the candidate path with the three automatic baseline paths.
   */
  public static comparePaths(
    candidate: SimulatedPath,
    conservative: SimulatedPath,
    growth: SimulatedPath,
    survival: SimulatedPath
  ): ComparisonMatrixRow[] {
    return [
      this.buildMatrixRow(candidate),
      this.buildMatrixRow(conservative),
      this.buildMatrixRow(growth),
      this.buildMatrixRow(survival)
    ];
  }

  /**
   * Builds comparison row including dynamic uncertainty bounds based on profile aggressiveness and stress.
   */
  private static buildMatrixRow(path: SimulatedPath): ComparisonMatrixRow {
    const composite = path.finalSurvivabilityScores.composite;
    const aggressiveness = path.finalProfile.aggressiveness ?? 50;

    // Volatility/uncertainty bounds expand with aggressiveness and stress levels
    let baseUncertainty = 5;
    if (aggressiveness > 70) {
      baseUncertainty += 10;
    } else if (aggressiveness > 40) {
      baseUncertainty += 5;
    }

    if (path.stressProfileApplied) {
      switch (path.stressProfileApplied) {
        case 'MODERATE':
          baseUncertainty += 3;
          break;
        case 'SEVERE':
          baseUncertainty += 6;
          break;
        case 'EXTREME':
          baseUncertainty += 10;
          break;
      }
    }

    return {
      category: path.category,
      compositeScore: composite,
      runwayMonths: path.liquidityRunwayCycles,
      fatigueScore: path.finalFatigue.compositeFatigue,
      classification: path.classification,
      volatilityRange: {
        min: Math.max(0, composite - baseUncertainty),
        max: Math.min(100, composite + baseUncertainty)
      }
    };
  }

  /**
   * Determines the aggregate uncertainty boundaries of the recommended strategy.
   */
  public static calculateUncertainty(path: SimulatedPath): { min: number; max: number } {
    const row = this.buildMatrixRow(path);
    return row.volatilityRange;
  }
}
