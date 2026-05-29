// src/core/runtime/strategic-simulation/InstitutionalOptimizationEngine.ts
//
// Institutional Optimization Engine
// Prioritizes preservation over growth. Ranks paths and filters out those with dimensions below 40.

import { SimulatedPath, ScenarioCategory } from './simulation-types';
import { ResilienceOptimizationEngine } from './ResilienceOptimizationEngine';

export class InstitutionalOptimizationEngine {
  /**
   * Evaluates, filters, and ranks simulated paths according to Fiduciary Preservation Supremacy.
   * Paths with any survivability score below 40 are classified as UNSUSTAINABLE or COLLAPSE_TRAJECTORY
   * and are made completely ineligible for recommendation.
   */
  public static selectOptimalPath(
    candidate: SimulatedPath,
    baselines: SimulatedPath[]
  ): { optimalCategory: ScenarioCategory; eligiblePaths: SimulatedPath[]; ineligiblePaths: SimulatedPath[] } {
    const allPaths = [candidate, ...baselines];
    const eligiblePaths: SimulatedPath[] = [];
    const ineligiblePaths: SimulatedPath[] = [];

    for (const path of allPaths) {
      const scores = path.finalSurvivabilityScores;
      const isUnsafe =
        scores.liquidity < 40 ||
        scores.operational < 40 ||
        scores.governance < 40 ||
        scores.debt < 40 ||
        scores.capitalPreservation < 40 ||
        scores.strategic < 40;

      if (isUnsafe || path.classification === 'UNSUSTAINABLE' || path.classification === 'COLLAPSE_TRAJECTORY') {
        // Enforce UNSUSTAINABLE classification if not already marked
        if (path.classification !== 'COLLAPSE_TRAJECTORY' && path.classification !== 'UNSUSTAINABLE') {
          path.classification = 'UNSUSTAINABLE';
        }
        if (!path.warnings.includes('Preservation over Growth Alert: Simulated path is UNSUSTAINABLE due to survivability dropping below 40/100.')) {
          path.warnings.push('Preservation over Growth Alert: Simulated path is UNSUSTAINABLE due to survivability dropping below 40/100.');
        }
        ineligiblePaths.push(path);
      } else {
        eligiblePaths.push(path);
      }
    }

    // Sort eligible paths based on Fiduciary Preservation metrics:
    // 1. Composite Survivability
    // 2. Liquidity Runway (Cycles)
    // 3. Recovery Viability Index
    // 4. Governance Stability Score
    // 5. Capital Preservation Score
    eligiblePaths.sort((a, b) => {
      const aRecovery = ResilienceOptimizationEngine.calculateRecoveryViability(a);
      const bRecovery = ResilienceOptimizationEngine.calculateRecoveryViability(b);

      const scoreA =
        a.finalSurvivabilityScores.composite * 0.4 +
        Math.min(24, a.liquidityRunwayCycles) * 1.5 +
        aRecovery * 0.3 +
        a.finalSurvivabilityScores.governance * 0.1;

      const scoreB =
        b.finalSurvivabilityScores.composite * 0.4 +
        Math.min(24, b.liquidityRunwayCycles) * 1.5 +
        bRecovery * 0.3 +
        b.finalSurvivabilityScores.governance * 0.1;

      return scoreB - scoreA; // Descending
    });

    // If no eligible paths exist, fallback to the safest ineligible path (e.g. Survival Stabilization)
    let optimalCategory: ScenarioCategory = 'Survival Stabilization';
    if (eligiblePaths.length > 0) {
      optimalCategory = eligiblePaths[0].category;
    } else {
      // Find Survival Stabilization or Conservative Preservation among ineligible paths as fallback
      const fallback = ineligiblePaths.find(
        p => p.category === 'Survival Stabilization' || p.category === 'Conservative Preservation'
      );
      if (fallback) {
        optimalCategory = fallback.category;
      }
    }

    return {
      optimalCategory,
      eligiblePaths,
      ineligiblePaths
    };
  }
}
