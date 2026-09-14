// src/core/runtime/treasury-intelligence/CapitalAllocationEngine.ts

import { TreasuryPriorityLevel } from './types';

export interface AllocationProposal {
  id: string;
  category: string;
  amount: number;
  priority: TreasuryPriorityLevel;
  strategicNecessityScore: number; // 0 a 100
}

export interface AllocationDimensionsEvaluation {
  id: string;
  survivabilityImpact: 'POSITIVE' | 'NEUTRAL' | 'NEGATIVE';
  liquidityPressure: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  governanceExposure: 'LOW' | 'MEDIUM' | 'HIGH';
  resilienceSustainability: 'SUSTAINABLE' | 'DEGRADATIVE';
  operationalContinuity: 'SUPPORTIVE' | 'NON_SUPPORTIVE';
  fiduciaryEfficiencyScore: number; // 0-100
  runwayPreservationScore: number; // 0-100
  strategicNecessity: 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW';
  suitabilityScore: number; // 0-100 consolidated suitability score
}

export class CapitalAllocationEngine {
  /**
   * Evaluates capital allocation proposals against the 8 fiduciary dimensions:
   * 1. Survivability impact
   * 2. Liquidity pressure
   * 3. Governance exposure
   * 4. Resilience sustainability
   * 5. Operational continuity
   * 6. Fiduciary efficiency
   * 7. Strategic necessity
   * 8. Runway preservation
   */
  public static evaluate(
    proposals: AllocationProposal[],
    availableCash: number,
    runwayMonths: number,
    fco: number
  ): AllocationDimensionsEvaluation[] {
    return proposals.map((prop) => {
      let survivabilityImpact: 'POSITIVE' | 'NEUTRAL' | 'NEGATIVE' = 'NEUTRAL';
      let liquidityPressure: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL' = 'LOW';
      let governanceExposure: 'LOW' | 'MEDIUM' | 'HIGH' = 'LOW';
      let resilienceSustainability: 'SUSTAINABLE' | 'DEGRADATIVE' = 'SUSTAINABLE';
      let operationalContinuity: 'SUPPORTIVE' | 'NON_SUPPORTIVE' = 'SUPPORTIVE';
      
      const pctOfCash = availableCash > 0 ? prop.amount / availableCash : 1.0;

      // 1. Survivability Impact & Runway Preservation
      let runwayPreservationScore = 100;
      if (runwayMonths < 12) {
        runwayPreservationScore = Math.max(100 - pctOfCash * 150, 0);
      } else {
        runwayPreservationScore = Math.max(100 - pctOfCash * 50, 0);
      }

      if (prop.priority === 1 || prop.priority === 2) {
        survivabilityImpact = 'POSITIVE';
        operationalContinuity = 'SUPPORTIVE';
      } else if (prop.priority >= 7 && runwayMonths < 12) {
        survivabilityImpact = 'NEGATIVE';
        resilienceSustainability = 'DEGRADATIVE';
        operationalContinuity = 'NON_SUPPORTIVE';
      }

      // 2. Liquidity Pressure
      if (pctOfCash > 0.4) {
        liquidityPressure = 'CRITICAL';
      } else if (pctOfCash > 0.2) {
        liquidityPressure = 'HIGH';
      } else if (pctOfCash > 0.05) {
        liquidityPressure = 'MEDIUM';
      } else {
        liquidityPressure = 'LOW';
      }

      // 3. Governance Exposure
      if (prop.priority === 9) { // shareholder distribution
        governanceExposure = fco < 0 ? 'HIGH' : 'MEDIUM';
      }

      // 4. Fiduciary Efficiency
      let fiduciaryEfficiencyScore = 90;
      if (prop.priority >= 8 && runwayMonths < 12) {
        fiduciaryEfficiencyScore = 40; // low efficiency to allocate growth under stress
      } else if (prop.strategicNecessityScore < 50) {
        fiduciaryEfficiencyScore = 60;
      }

      // 5. Strategic Necessity
      let strategicNecessity: 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW' = 'LOW';
      if (prop.strategicNecessityScore >= 85) {
        strategicNecessity = 'CRITICAL';
      } else if (prop.strategicNecessityScore >= 65) {
        strategicNecessity = 'HIGH';
      } else if (prop.strategicNecessityScore >= 40) {
        strategicNecessity = 'MEDIUM';
      }

      // Suitability score math
      let suitabilityScore = (runwayPreservationScore * 0.2) + (fiduciaryEfficiencyScore * 0.2) + (prop.strategicNecessityScore * 0.2);
      if (survivabilityImpact === 'POSITIVE') suitabilityScore += 40;
      if (survivabilityImpact === 'NEGATIVE') suitabilityScore -= 30;
      if (liquidityPressure === 'CRITICAL') suitabilityScore -= 20;

      suitabilityScore = Math.round(Math.min(Math.max(suitabilityScore, 0), 100));

      return {
        id: prop.id,
        survivabilityImpact,
        liquidityPressure,
        governanceExposure,
        resilienceSustainability,
        operationalContinuity,
        fiduciaryEfficiencyScore: Math.round(fiduciaryEfficiencyScore),
        runwayPreservationScore: Math.round(runwayPreservationScore),
        strategicNecessity,
        suitabilityScore
      };
    });
  }
}
