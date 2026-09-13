// src/core/runtime/decision-policy/InstitutionalRiskAppetiteEngine.ts
//
// Institutional Risk Appetite Engine

import { DecisionPolicyProfile, RiskAppetiteBounds } from './policy-types';

export class InstitutionalRiskAppetiteEngine {
  /**
   * Returns the risk appetite limits for a given policy profile.
   */
  public static getBounds(profile: DecisionPolicyProfile): RiskAppetiteBounds {
    switch (profile) {
      case 'CONSERVATIVE':
        return {
          maxLeverageRatio: 2.0,
          minLiquidityBufferRatio: 0.30,
          maxCapexAsOcfRatio: 0.50,
          expansionPermissiveness: 'LOW',
          governanceFlexibility: 'NONE'
        };

      case 'TURNAROUND':
        // Turnaround allows temporary higher debt restructuring leverage, but strictly limits CAPEX
        return {
          maxLeverageRatio: 4.5,
          minLiquidityBufferRatio: 0.10,
          maxCapexAsOcfRatio: 0.40,
          expansionPermissiveness: 'LOW',
          governanceFlexibility: 'HIGH'
        };

      case 'HYPER_GROWTH':
        return {
          maxLeverageRatio: 4.0,
          minLiquidityBufferRatio: 0.15,
          maxCapexAsOcfRatio: 0.90,
          expansionPermissiveness: 'HIGH',
          governanceFlexibility: 'MEDIUM'
        };

      case 'AGGRESSIVE_GROWTH':
        return {
          maxLeverageRatio: 3.5,
          minLiquidityBufferRatio: 0.20,
          maxCapexAsOcfRatio: 0.85,
          expansionPermissiveness: 'HIGH',
          governanceFlexibility: 'LOW'
        };

      case 'HOSPITAL':
        return {
          maxLeverageRatio: 2.5,
          minLiquidityBufferRatio: 0.30,
          maxCapexAsOcfRatio: 0.60,
          expansionPermissiveness: 'MEDIUM',
          governanceFlexibility: 'NONE'
        };

      case 'NONPROFIT':
        return {
          maxLeverageRatio: 1.5,
          minLiquidityBufferRatio: 0.40,
          maxCapexAsOcfRatio: 0.30,
          expansionPermissiveness: 'LOW',
          governanceFlexibility: 'NONE'
        };

      case 'INDUSTRIAL':
      case 'HIGH_CAPITAL_INTENSITY':
        return {
          maxLeverageRatio: 3.8, // Heavy assets allow higher structural leverage
          minLiquidityBufferRatio: 0.15,
          maxCapexAsOcfRatio: 0.80,
          expansionPermissiveness: 'MEDIUM',
          governanceFlexibility: 'LOW'
        };

      case 'BALANCED':
      default:
        return {
          maxLeverageRatio: 3.0,
          minLiquidityBufferRatio: 0.20,
          maxCapexAsOcfRatio: 0.70,
          expansionPermissiveness: 'MEDIUM',
          governanceFlexibility: 'LOW'
        };
    }
  }
}
