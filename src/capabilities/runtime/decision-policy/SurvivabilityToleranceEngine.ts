// src/core/runtime/decision-policy/SurvivabilityToleranceEngine.ts
//
// Survivability Tolerance Engine

import { DecisionPolicyProfile } from './policy-types';

export class SurvivabilityToleranceEngine {
  /**
   * Returns score thresholds for a given policy profile.
   */
  public static getTolerances(profile: DecisionPolicyProfile): {
    minLiquidityScore: number;
    minDebtScore: number;
    minCapitalPreservationScore: number;
    minCompositeScore: number;
  } {
    switch (profile) {
      case 'CONSERVATIVE':
        return {
          minLiquidityScore: 45,
          minDebtScore: 45,
          minCapitalPreservationScore: 45,
          minCompositeScore: 60
        };

      case 'TURNAROUND':
        // Turnaround allows lower baseline thresholds to keep operational recovery pathways open
        return {
          minLiquidityScore: 20,
          minDebtScore: 20,
          minCapitalPreservationScore: 25,
          minCompositeScore: 40
        };

      case 'HYPER_GROWTH':
        return {
          minLiquidityScore: 25,
          minDebtScore: 25,
          minCapitalPreservationScore: 25,
          minCompositeScore: 45
        };

      case 'HOSPITAL':
        return {
          minLiquidityScore: 45,
          minDebtScore: 35,
          minCapitalPreservationScore: 40,
          minCompositeScore: 55
        };

      case 'NONPROFIT':
        return {
          minLiquidityScore: 50,
          minDebtScore: 40,
          minCapitalPreservationScore: 40,
          minCompositeScore: 60
        };

      case 'INDUSTRIAL':
      case 'HIGH_CAPITAL_INTENSITY':
        return {
          minLiquidityScore: 30,
          minDebtScore: 25, // More tolerant on leverage
          minCapitalPreservationScore: 35,
          minCompositeScore: 50
        };

      case 'BALANCED':
      default:
        return {
          minLiquidityScore: 30,
          minDebtScore: 30,
          minCapitalPreservationScore: 30,
          minCompositeScore: 50
        };
    }
  }
}
