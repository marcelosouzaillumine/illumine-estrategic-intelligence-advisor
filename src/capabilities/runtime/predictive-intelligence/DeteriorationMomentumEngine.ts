// src/core/runtime/predictive-intelligence/DeteriorationMomentumEngine.ts
//
// Deterioration Momentum Engine
// Measures velocity (first derivative) and acceleration (second derivative) of governance deterioration.

import { ExecutiveDecision } from '../decision-intelligence/decision-types';
import { DecisionPolicyProfile } from '../../../core/runtime/decision-policy/policy-types';
import { InstitutionalBehaviorProfileEngine } from '../behavioral-intelligence/InstitutionalBehaviorProfileEngine';
import { GovernanceFatigueEngine } from '../behavioral-intelligence/GovernanceFatigueEngine';
import { GovernanceDriftEngine } from '../behavioral-intelligence/GovernanceDriftEngine';

export interface MomentumMetrics {
  liquidityMomentum: number; // velocity of decline/growth
  governanceStabilityMomentum: number;
  fatigueEscalationMomentum: number;
  strategicVolatilityMomentum: number;
  driftAccelerationMomentum: number;
  survivabilityMomentum: number;
  
  liquidityAcceleration: number; // second derivative
  governanceStabilityAcceleration: number;
  fatigueEscalationAcceleration: number;
  strategicVolatilityAcceleration: number;
  driftAccelerationAcceleration: number;
  survivabilityAcceleration: number;
}

export class DeteriorationMomentumEngine {
  /**
   * Computes the velocity and acceleration of the required momentum dimensions over the last 10 decisions.
   */
  public static calculateMomentum(
    history: ExecutiveDecision[],
    report: any,
    activeProfile: DecisionPolicyProfile
  ): MomentumMetrics {
    // Extract last 10 decisions for rolling momentum window
    const rollingHistory = history.slice(-10);
    const n = rollingHistory.length;

    // Default structure for empty/insufficient histories
    const emptyMetrics: MomentumMetrics = {
      liquidityMomentum: 0,
      governanceStabilityMomentum: 0,
      fatigueEscalationMomentum: 0,
      strategicVolatilityMomentum: 0,
      driftAccelerationMomentum: 0,
      survivabilityMomentum: 0,
      liquidityAcceleration: 0,
      governanceStabilityAcceleration: 0,
      fatigueEscalationAcceleration: 0,
      strategicVolatilityAcceleration: 0,
      driftAccelerationAcceleration: 0,
      survivabilityAcceleration: 0
    };

    if (n < 3) {
      return emptyMetrics;
    }

    // Reconstruct dimension series step-by-step
    const series = {
      liquidity: [] as number[],
      govStability: [] as number[],
      fatigue: [] as number[],
      stratVolatility: [] as number[],
      drift: [] as number[],
      survivability: [] as number[]
    };

    for (let i = 0; i < n; i++) {
      const subHistory = rollingHistory.slice(0, i + 1);
      const profile = InstitutionalBehaviorProfileEngine.calculateCumulativeProfile(subHistory, report, activeProfile);
      const fatigue = GovernanceFatigueEngine.calculateFatigue(subHistory, report);
      const drift = GovernanceDriftEngine.detectDrift(rollingHistory[i], subHistory.slice(0, -1), report);

      series.liquidity.push(profile.prudence); // proxy for liquidity discipline
      series.govStability.push(profile.governanceConsistency);
      series.fatigue.push(fatigue.compositeFatigue);
      series.stratVolatility.push(100 - profile.strategicStability);
      
      const driftVal = drift.overallSeverity === 'CONSTITUTIONAL_DRIFT' ? 100 :
                       drift.overallSeverity === 'CRITICAL_DRIFT' ? 75 :
                       drift.overallSeverity === 'MODERATE_DRIFT' ? 50 :
                       drift.overallSeverity === 'MINOR_DRIFT' ? 25 : 0;
      series.drift.push(driftVal);
      series.survivability.push(profile.survivabilityDiscipline);
    }

    // Helper: calculate velocity (first derivative) series
    const getVelocitySeries = (seq: number[]): number[] => {
      const v: number[] = [];
      for (let i = 1; i < seq.length; i++) {
        v.push(seq[i] - seq[i - 1]);
      }
      return v;
    };

    // Calculate velocities
    const vLiquidity = getVelocitySeries(series.liquidity);
    const vGovStability = getVelocitySeries(series.govStability);
    const vFatigue = getVelocitySeries(series.fatigue);
    const vStratVolatility = getVelocitySeries(series.stratVolatility);
    const vDrift = getVelocitySeries(series.drift);
    const vSurvivability = getVelocitySeries(series.survivability);

    // Helper: average value of a series
    const avg = (arr: number[]): number => arr.length === 0 ? 0 : arr.reduce((s, x) => s + x, 0) / arr.length;

    // Calculate accelerations (second derivative series)
    const aLiquidity = getVelocitySeries(vLiquidity);
    const aGovStability = getVelocitySeries(vGovStability);
    const aFatigue = getVelocitySeries(vFatigue);
    const aStratVolatility = getVelocitySeries(vStratVolatility);
    const aDrift = getVelocitySeries(vDrift);
    const aSurvivability = getVelocitySeries(vSurvivability);

    return {
      liquidityMomentum: Math.round(avg(vLiquidity) * 10) / 10,
      governanceStabilityMomentum: Math.round(avg(vGovStability) * 10) / 10,
      fatigueEscalationMomentum: Math.round(avg(vFatigue) * 10) / 10,
      strategicVolatilityMomentum: Math.round(avg(vStratVolatility) * 10) / 10,
      driftAccelerationMomentum: Math.round(avg(vDrift) * 10) / 10,
      survivabilityMomentum: Math.round(avg(vSurvivability) * 10) / 10,

      liquidityAcceleration: Math.round(avg(aLiquidity) * 10) / 10,
      governanceStabilityAcceleration: Math.round(avg(aGovStability) * 10) / 10,
      fatigueEscalationAcceleration: Math.round(avg(aFatigue) * 10) / 10,
      strategicVolatilityAcceleration: Math.round(avg(aStratVolatility) * 10) / 10,
      driftAccelerationAcceleration: Math.round(avg(aDrift) * 10) / 10,
      survivabilityAcceleration: Math.round(avg(aSurvivability) * 10) / 10
    };
  }
}
