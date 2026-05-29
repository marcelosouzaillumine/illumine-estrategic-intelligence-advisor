// src/core/runtime/behavioral-intelligence/InstitutionalMaturityEvolutionEngine.ts
//
// Institutional Maturity Evolution Engine
// Evaluates the evolution stage of institutional governance and compliance maturity.

import { ExecutiveDecision } from '../decision-intelligence/decision-types';
import { BehaviorProfile, FatigueMetrics } from './behavioral-types';

export class InstitutionalMaturityEvolutionEngine {
  /**
   * Computes the dynamic corporate maturity transition stage.
   */
  public static calculateMaturity(
    history: ExecutiveDecision[],
    profile: BehaviorProfile,
    fatigue: FatigueMetrics,
    consistencyScore: number,
    hasConstitutionalDrift: boolean
  ): string {
    const historyCount = history ? history.length : 0;

    // 1. Fragile (FRÁGIL) check: Critical drift active, high fatigue, or very poor consistency
    if (hasConstitutionalDrift || consistencyScore < 50 || fatigue.compositeFatigue > 75) {
      return 'FRÁGIL';
    }

    // 2. Sovereign (SOBERANA) check: Long history, high prudence, minimal risk escalation, high consistency
    if (
      historyCount >= 10 &&
      profile.prudence >= 60 &&
      profile.governanceConsistency >= 80 &&
      profile.riskEscalationTendency <= 30 &&
      consistencyScore >= 80 &&
      fatigue.compositeFatigue <= 35
    ) {
      return 'SOBERANA';
    }

    // 3. Mature (MADURA) check: Medium history, decent scores
    if (
      historyCount >= 5 &&
      profile.prudence >= 50 &&
      profile.governanceConsistency >= 65 &&
      profile.riskEscalationTendency <= 45 &&
      consistencyScore >= 70 &&
      fatigue.compositeFatigue <= 55
    ) {
      return 'MADURA';
    }

    // 4. Fallback/Initial state
    return 'TRANSICIONAL';
  }
}
