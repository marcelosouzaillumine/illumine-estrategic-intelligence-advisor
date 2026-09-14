// src/core/runtime/behavioral-intelligence/InstitutionalBehavioralIntelligenceEngine.ts
//
// Institutional Behavioral Intelligence Engine (Orchestrator)
// Coordinates the evaluation of long-term corporate identity, consistency, fatigue, and drift.

import { ExecutiveDecision } from '../decision-intelligence/decision-types';
import { DecisionPolicyProfile } from '../../../core/runtime/decision-policy/policy-types';
import {
  BehavioralAssessmentResult,
  BehavioralScores,
  DriftSeverity
} from './behavioral-types';

import { InstitutionalBehaviorProfileEngine } from './InstitutionalBehaviorProfileEngine';
import { GovernanceDriftEngine } from './GovernanceDriftEngine';
import { ExecutiveConsistencyEngine } from './ExecutiveConsistencyEngine';
import { GovernanceFatigueEngine } from './GovernanceFatigueEngine';
import { InstitutionalIdentityEngine } from './InstitutionalIdentityEngine';
import { BehavioralTrajectoryEngine } from './BehavioralTrajectoryEngine';
import { InstitutionalAdaptationEngine } from './InstitutionalAdaptationEngine';
import { LongitudinalPatternEngine } from './LongitudinalPatternEngine';
import { InstitutionalMaturityEvolutionEngine } from './InstitutionalMaturityEvolutionEngine';

export class InstitutionalBehavioralIntelligenceEngine {
  /**
   * Performs a comprehensive longitudinal behavioral and governance assessment.
   */
  public static evaluateBehavior(
    decision: ExecutiveDecision,
    report: any,
    history: ExecutiveDecision[],
    activeProfile: DecisionPolicyProfile = 'BALANCED'
  ): BehavioralAssessmentResult {
    // 1. Calculate cumulative behavior profile using EMA over history
    const profile = InstitutionalBehaviorProfileEngine.calculateCumulativeProfile(
      history,
      report,
      activeProfile
    );

    // 2. Detect recent governance drift (rolling window of last 15 decisions)
    const driftResult = GovernanceDriftEngine.detectDrift(decision, history, report);

    // 3. Compute executive consistency score
    const consistencyScore = ExecutiveConsistencyEngine.calculateConsistency(decision, history);

    // 4. Compute governance fatigue metrics (rolling window of last 15 decisions)
    const fatigue = GovernanceFatigueEngine.calculateFatigue(history, report);

    // 5. Calculate adaptation score (learning speed)
    const adaptationScore = InstitutionalAdaptationEngine.calculateAdaptation(decision, history);

    // 6. Recognize patterns, turnaround likelihood, and warnings
    const patternsResult = LongitudinalPatternEngine.analyzePatterns(history, report, profile);

    // 7. Resolve dynamic institutional maturity stage
    const hasConstitutionalDrift = driftResult.overallSeverity === 'CONSTITUTIONAL_DRIFT';
    const maturityLevel = InstitutionalMaturityEvolutionEngine.calculateMaturity(
      history,
      profile,
      fatigue,
      consistencyScore,
      hasConstitutionalDrift
    );

    // 8. Resolve descriptive corporate personality archetype
    const dynamicIdentity = InstitutionalIdentityEngine.resolveIdentity(profile, driftResult.overallSeverity);

    // 9. Consolidate behavioral scores (0-100 scale)
    const scores: BehavioralScores = {
      governanceStability: profile.governanceConsistency,
      executiveConsistency: consistencyScore,
      institutionalDiscipline: profile.prudence,
      survivabilityAdaptation: adaptationScore,
      fiduciaryPrudence: profile.prudence,
      strategicCoherence: profile.strategicStability,
      governanceFatigue: fatigue.compositeFatigue
    };

    // 10. Run Behavioral Trajectory Engine
    const trajectory = BehavioralTrajectoryEngine.projectTrajectory(history, report, activeProfile, profile);

    // Combine warnings from all engines
    const warnings: string[] = [];
    if (driftResult.overallSeverity !== 'STABLE') {
      warnings.push(`Alerta de Desvio de Governança: Nível de desvio geral classificado como ${driftResult.overallSeverity}.`);
    }
    if (fatigue.compositeFatigue > 50) {
      warnings.push(`Fadiga de Governança Elevada: Fadiga geral em ${fatigue.compositeFatigue}/100. Pressão decisória recorrente detectada.`);
    }
    if (trajectory.status === 'DEGRADANDO' || trajectory.status === 'VOLÁTIL') {
      warnings.push(`Tendência de Governança: ${trajectory.predictedProfileShift}`);
    }
    warnings.push(...patternsResult.warningSignals);

    return {
      dynamicIdentity,
      driftSeverity: driftResult.overallSeverity,
      driftCategories: driftResult.categories,
      scores,
      fatigue,
      profile,
      adaptationScore,
      maturityLevel,
      warnings,
      timestamp: new Date().toISOString()
    };
  }
}
