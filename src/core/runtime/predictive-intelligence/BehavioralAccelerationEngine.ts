// src/core/runtime/predictive-intelligence/BehavioralAccelerationEngine.ts
//
// Behavioral Acceleration Engine
// Computes rate of fatigue accumulation and volatility velocity of decision directions.

import { ExecutiveDecision } from '../decision-intelligence/decision-types';
import { FatigueMetrics } from '../behavioral-intelligence/behavioral-types';
import { GovernanceFatigueEngine } from '../behavioral-intelligence/GovernanceFatigueEngine';

export interface BehavioralAcceleration {
  fatigueAccumulationRate: number; // point change per cycle
  volatilityVelocity: number;      // frequency of strategic pivots (0-100)
  isAccelerating: boolean;
}

export class BehavioralAccelerationEngine {
  /**
   * Evaluates the acceleration of behavioral fatigue and strategic volatility.
   */
  public static calculateAcceleration(
    history: ExecutiveDecision[],
    report: any
  ): BehavioralAcceleration {
    if (!history || history.length < 3) {
      return {
        fatigueAccumulationRate: 0,
        volatilityVelocity: 0,
        isAccelerating: false
      };
    }

    const rolling = history.slice(-10);
    const n = rolling.length;

    // 1. Fatigue accumulation rate: compute fatigue at start and end of window
    const firstFatigue = GovernanceFatigueEngine.calculateFatigue(rolling.slice(0, Math.floor(n / 2)), report);
    const lastFatigue = GovernanceFatigueEngine.calculateFatigue(rolling, report);
    
    const fatigueDelta = lastFatigue.compositeFatigue - firstFatigue.compositeFatigue;
    const fatigueAccumulationRate = Math.round((fatigueDelta / Math.max(1, Math.floor(n / 2))) * 10) / 10;

    // 2. Volatility velocity: rate of domain switching
    let shifts = 0;
    for (let i = 1; i < n; i++) {
      const prev = rolling[i - 1].domains;
      const curr = rolling[i].domains;
      
      const prevIsExpansion = prev.includes('Operational Expansion') || prev.includes('Dividend Distribution') || prev.includes('CAPEX');
      const prevIsCut = prev.includes('Cost Reduction') || prev.includes('Capital Preservation');
      
      const currIsExpansion = curr.includes('Operational Expansion') || curr.includes('Dividend Distribution') || curr.includes('CAPEX');
      const currIsCut = curr.includes('Cost Reduction') || curr.includes('Capital Preservation');

      if ((prevIsExpansion && currIsCut) || (prevIsCut && currIsExpansion)) {
        shifts++;
      }
    }

    // Volatility velocity as percentage of switches over possible switches
    const volatilityVelocity = Math.round((shifts / (n - 1)) * 100);
    
    // Deemed accelerating if fatigue accumulation is positive and velocity of strategic pivots is high
    const isAccelerating = fatigueAccumulationRate > 2 || volatilityVelocity > 50;

    return {
      fatigueAccumulationRate,
      volatilityVelocity,
      isAccelerating
    };
  }
}
