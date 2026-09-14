// src/core/runtime/behavioral-intelligence/InstitutionalAdaptationEngine.ts
//
// Institutional Adaptation Engine
// Measures how effectively the corporate entity adapts its behavior over time (learning rate)
// by tracking reduction in operational drift and improvements in consistency.

import { ExecutiveDecision } from '../decision-intelligence/decision-types';
import { ExecutiveConsistencyEngine } from './ExecutiveConsistencyEngine';

export class InstitutionalAdaptationEngine {
  /**
   * Computes the governance learning/adaptation score (0-100) based on historical decisions.
   */
  public static calculateAdaptation(
    currentDecision: ExecutiveDecision,
    history: ExecutiveDecision[]
  ): number {
    if (!history || history.length === 0) {
      return 50; // Neutral baseline for new tenants
    }

    let adaptationScore = 50;

    // 1. Calculate executive consistency trend
    const currentConsistency = ExecutiveConsistencyEngine.calculateConsistency(currentDecision, history);

    // Compute average consistency in history
    let historicalConsistencySum = 0;
    for (const d of history) {
      historicalConsistencySum += ExecutiveConsistencyEngine.calculateConsistency(d, history.filter(h => h.timestamp < d.timestamp));
    }
    const avgHistoricalConsistency = historicalConsistencySum / history.length;

    // Consistency improvements add to adaptation
    const consistencyImprovement = currentConsistency - avgHistoricalConsistency;
    if (consistencyImprovement > 0) {
      adaptationScore += Math.min(25, consistencyImprovement * 0.8);
    } else {
      adaptationScore += Math.max(-25, consistencyImprovement * 0.8);
    }

    // 2. Evaluate resolution of conflicting/emergency domains in history
    // E.g. did the organization transition from emergency cost cutting to structured capital preservation?
    const totalCostCuts = history.filter(d => d.domains.includes('Cost Reduction')).length;
    const recentCostCuts = history.slice(-5).filter(d => d.domains.includes('Cost Reduction')).length;

    // If cost reductions are decreasing while consistency is high, it shows stabilization/adaptation
    if (totalCostCuts > 0 && currentConsistency > 75) {
      const olderCostCutRatio = (totalCostCuts - recentCostCuts) / Math.max(1, history.length - 5);
      const recentCostCutRatio = recentCostCuts / 5;

      if (recentCostCutRatio < olderCostCutRatio) {
        adaptationScore += 15; // Positive sign of stabilization
      }
    }

    // 3. Penalty for persistent behavior volatility (frequent alternating of domain directions)
    let domainSwitches = 0;
    for (let i = 1; i < history.length; i++) {
      const prev = history[i - 1].domains;
      const curr = history[i].domains;
      if (
        (prev.includes('Cost Reduction') && curr.includes('Operational Expansion')) ||
        (curr.includes('Cost Reduction') && prev.includes('Operational Expansion'))
      ) {
        domainSwitches++;
      }
    }

    if (domainSwitches >= 3) {
      adaptationScore -= Math.min(20, domainSwitches * 5); // Volatility penalty
    }

    return Math.round(Math.max(0, Math.min(100, adaptationScore)));
  }
}
