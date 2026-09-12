// src/core/runtime/treasury-intelligence/TreasuryResilienceEngine.ts

import { TreasuryResilienceOutput } from './types';

export interface ResilienceEvaluationInput {
  availableCash: number;
  normalizedMonthlyCashBurn: number;
  fco: number;
  fcf: number;
  equityFunding: number;
  thirdPartyFunding: number;
  historicalCyclesCount: number;
}

export class TreasuryResilienceEngine {
  /**
   * Evaluates treasury resilience, reserve sustainability, degradation velocity,
   * resilience half-life, and external capital dependency persistence.
   */
  public static evaluate(input: ResilienceEvaluationInput): TreasuryResilienceOutput {
    const {
      availableCash,
      normalizedMonthlyCashBurn,
      fco,
      fcf,
      equityFunding,
      thirdPartyFunding,
      historicalCyclesCount
    } = input;

    // 1. Reserve Degradation Velocity (Daily Cash Burn)
    const reserveDegradationVelocity = normalizedMonthlyCashBurn > 0
      ? Math.round((normalizedMonthlyCashBurn / 30) * 100) / 100
      : 0;

    // 2. Reserve Sustainability Days
    let reserveSustainabilityDays = 999.0;
    if (reserveDegradationVelocity > 0) {
      reserveSustainabilityDays = Math.round((availableCash / reserveDegradationVelocity) * 10) / 10;
    }

    // 3. Liquidity Redundancy Ratio (Months of coverage of monthly burn)
    let liquidityRedundancyRatio = 9.9;
    if (normalizedMonthlyCashBurn > 0) {
      liquidityRedundancyRatio = Math.round((availableCash / normalizedMonthlyCashBurn) * 10) / 10;
    } else if (availableCash > 0) {
      liquidityRedundancyRatio = 12.0; // High coverage fallback
    } else {
      liquidityRedundancyRatio = 0.0;
    }

    // 4. Resilience Half-Life (Days it takes to lose 50% of the reserves)
    let resilienceHalfLifeDays = 999.0;
    if (reserveDegradationVelocity > 0) {
      resilienceHalfLifeDays = Math.round(((availableCash * 0.5) / reserveDegradationVelocity) * 10) / 10;
    }

    // 5. Dependency Recurrence Intensity
    let dependencyRecurrenceIntensity: 'NONE' | 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL' = 'NONE';
    const hasExternalInjections = equityFunding > 0 || thirdPartyFunding > 0 || fcf > 0;

    if (fco < 0) {
      if (hasExternalInjections) {
        if (historicalCyclesCount >= 3) {
          dependencyRecurrenceIntensity = 'CRITICAL';
        } else if (historicalCyclesCount === 2) {
          dependencyRecurrenceIntensity = 'HIGH';
        } else {
          dependencyRecurrenceIntensity = 'MEDIUM';
        }
      } else {
        dependencyRecurrenceIntensity = 'LOW';
      }
    } else {
      if (hasExternalInjections) {
        dependencyRecurrenceIntensity = historicalCyclesCount >= 2 ? 'MEDIUM' : 'LOW';
      } else {
        dependencyRecurrenceIntensity = 'NONE';
      }
    }

    // Exhaustion is projected if reserves last less than 180 days (6 months)
    const exhaustionProjected = reserveSustainabilityDays < 180 && reserveDegradationVelocity > 0;

    return {
      reserveSustainabilityDays,
      liquidityRedundancyRatio,
      resilienceHalfLifeDays,
      reserveDegradationVelocity,
      dependencyRecurrenceIntensity,
      exhaustionProjected
    };
  }
}
