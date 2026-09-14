// src/core/runtime/behavioral-intelligence/InstitutionalBehaviorProfileEngine.ts
//
// Institutional Behavior Profile Engine

import { ExecutiveDecision } from '../decision-intelligence/decision-types';
import { BehaviorProfile } from './behavioral-types';
import { DecisionPolicyProfile } from '../../../core/runtime/decision-policy/policy-types';

export class InstitutionalBehaviorProfileEngine {
  /**
   * Resolves the EMA smoothing factor (alpha) based on the policy profile.
   */
  public static getAlpha(profile: DecisionPolicyProfile): number {
    switch (profile) {
      case 'CONSERVATIVE':
        return 0.10;
      case 'BALANCED':
        return 0.20;
      case 'AGGRESSIVE_GROWTH':
      case 'HYPER_GROWTH':
        return 0.30;
      case 'TURNAROUND':
        return 0.35;
      default:
        return 0.20;
    }
  }

  /**
   * Computes the initial baseline profile when history is empty.
   */
  public static getBaselineProfile(): BehaviorProfile {
    return {
      prudence: 70,
      aggressiveness: 30,
      survivabilityDiscipline: 80,
      governanceConsistency: 75,
      executiveCoherence: 80,
      capitalPreservationDiscipline: 75,
      expansionAppetite: 40,
      riskEscalationTendency: 20,
      recoveryCapacity: 60,
      operationalDiscipline: 70,
      strategicStability: 80
    };
  }

  /**
   * Evaluates the behavior profile of a single decision, returning a target profile.
   */
  public static getDecisionTargetProfile(decision: ExecutiveDecision, report: any): BehaviorProfile {
    const target = this.getBaselineProfile();
    const { domains } = decision;

    // Adjust target values based on the decision domains
    if (domains.includes('Dividend Distribution') || domains.includes('Financing Strategy')) {
      target.aggressiveness = 85;
      target.prudence = 25;
      target.expansionAppetite = 65;
      target.capitalPreservationDiscipline = 20; // distributing capital decreases preservation score
    }

    if (domains.includes('CAPEX') || domains.includes('Operational Expansion') || domains.includes('Workforce Expansion')) {
      target.aggressiveness = 75;
      target.expansionAppetite = 85;
      target.prudence = 40;
      target.strategicStability = 70;
    }

    if (domains.includes('Cost Reduction')) {
      target.prudence = 85;
      target.aggressiveness = 15;
      target.survivabilityDiscipline = 90;
      target.expansionAppetite = 15;
      target.operationalDiscipline = 80;
    }

    if (domains.includes('Capital Preservation')) {
      target.prudence = 90;
      target.aggressiveness = 10;
      target.capitalPreservationDiscipline = 95;
      target.survivabilityDiscipline = 85;
    }

    // In case of report structural stress, check indicators
    const isErosao = report?.capitalGovernanceReport?.preservation?.preservationStatus === 'EROSÃO_RELEVANTE' ||
      report?.capitalGovernanceReport?.preservation?.preservationStatus === 'FRAGILIDADE_PATRIMONIAL';
    const ocf = report?.cashFlowReport?.operational?.fco ?? report?.ocf ?? 0;

    if (isErosao || ocf < 0) {
      target.riskEscalationTendency = 75;
      target.survivabilityDiscipline = 45;
    }

    return target;
  }

  /**
   * Sequentially evaluates full history of decisions to compute the cumulative behavior profile.
   * Leverages the dynamic precedence alpha based on active profile.
   */
  public static calculateCumulativeProfile(
    history: ExecutiveDecision[],
    report: any,
    activeProfile: DecisionPolicyProfile
  ): BehaviorProfile {
    const alpha = this.getAlpha(activeProfile);
    let current = this.getBaselineProfile();

    if (!history || history.length === 0) {
      return current;
    }

    // Sequentially apply EMA to all historical decisions
    for (const decision of history) {
      const target = this.getDecisionTargetProfile(decision, report);
      current = {
        prudence: Math.round(alpha * target.prudence + (1 - alpha) * current.prudence),
        aggressiveness: Math.round(alpha * target.aggressiveness + (1 - alpha) * current.aggressiveness),
        survivabilityDiscipline: Math.round(alpha * target.survivabilityDiscipline + (1 - alpha) * current.survivabilityDiscipline),
        governanceConsistency: Math.round(alpha * target.governanceConsistency + (1 - alpha) * current.governanceConsistency),
        executiveCoherence: Math.round(alpha * target.executiveCoherence + (1 - alpha) * current.executiveCoherence),
        capitalPreservationDiscipline: Math.round(alpha * target.capitalPreservationDiscipline + (1 - alpha) * current.capitalPreservationDiscipline),
        expansionAppetite: Math.round(alpha * target.expansionAppetite + (1 - alpha) * current.expansionAppetite),
        riskEscalationTendency: Math.round(alpha * target.riskEscalationTendency + (1 - alpha) * current.riskEscalationTendency),
        recoveryCapacity: Math.round(alpha * target.recoveryCapacity + (1 - alpha) * current.recoveryCapacity),
        operationalDiscipline: Math.round(alpha * target.operationalDiscipline + (1 - alpha) * current.operationalDiscipline),
        strategicStability: Math.round(alpha * target.strategicStability + (1 - alpha) * current.strategicStability)
      };
    }

    return current;
  }
}
