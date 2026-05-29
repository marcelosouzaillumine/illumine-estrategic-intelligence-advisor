// src/core/runtime/behavioral-intelligence/BehavioralTrajectoryEngine.ts
//
// Behavioral Trajectory Engine
// Tracks and projects the longitudinal trajectory of executive actions and scores.

import { ExecutiveDecision } from '../decision-intelligence/decision-types';
import { DecisionPolicyProfile } from '../decision-policy/policy-types';
import { BehaviorProfile } from './behavioral-types';
import { InstitutionalBehaviorProfileEngine } from './InstitutionalBehaviorProfileEngine';

export interface TrajectoryProjection {
  status: 'ESTÁVEL' | 'MELHORANDO' | 'DEGRADANDO' | 'VOLÁTIL';
  trendDelta: number; // overall delta in behavioral quality
  predictedProfileShift: string; // descriptive prediction
  projectedScores: {
    prudence: number;
    aggressiveness: number;
    governanceConsistency: number;
  };
}

export class BehavioralTrajectoryEngine {
  /**
   * Projects the future behavioral trajectory based on sequential historical analysis.
   */
  public static projectTrajectory(
    history: ExecutiveDecision[],
    report: any,
    activeProfile: DecisionPolicyProfile,
    currentProfile: BehaviorProfile
  ): TrajectoryProjection {
    if (!history || history.length < 3) {
      return {
        status: 'ESTÁVEL',
        trendDelta: 0,
        predictedProfileShift: 'Histórico insuficiente para projeção de tendência fiduciária.',
        projectedScores: {
          prudence: currentProfile.prudence,
          aggressiveness: currentProfile.aggressiveness,
          governanceConsistency: currentProfile.governanceConsistency
        }
      };
    }

    // Split history into older half and newer half to observe the delta direction
    const splitIndex = Math.floor(history.length / 2);
    const olderHistory = history.slice(0, splitIndex);
    const newerHistory = history.slice(splitIndex);

    // Compute the profile at the midpoint of history
    const olderProfile = InstitutionalBehaviorProfileEngine.calculateCumulativeProfile(
      olderHistory,
      report,
      activeProfile
    );

    // Compute the delta
    const prudenceDelta = currentProfile.prudence - olderProfile.prudence;
    const aggressivenessDelta = currentProfile.aggressiveness - olderProfile.aggressiveness;
    const consistencyDelta = currentProfile.governanceConsistency - olderProfile.governanceConsistency;

    // Overall quality metric delta (higher prudence/consistency, lower aggressiveness)
    const trendDelta = Math.round(prudenceDelta + consistencyDelta - aggressivenessDelta);

    let status: 'ESTÁVEL' | 'MELHORANDO' | 'DEGRADANDO' | 'VOLÁTIL' = 'ESTÁVEL';
    let predictedProfileShift = 'Manutenção da postura institucional recente.';

    if (Math.abs(trendDelta) <= 5) {
      status = 'ESTÁVEL';
      predictedProfileShift = 'Consolidação da postura de governança atual.';
    } else if (trendDelta > 5) {
      status = 'MELHORANDO';
      predictedProfileShift = 'Tendência de convergência para maior controle fiduciário e mitigação de riscos.';
    } else if (trendDelta < -15) {
      status = 'DEGRADANDO';
      predictedProfileShift = 'Risco elevado de desalinhamento de governança e erosão de margens de segurança.';
    } else {
      status = 'VOLÁTIL';
      predictedProfileShift = 'Comportamento decisório com oscilações relevantes entre ciclos.';
    }

    // Simple forward projection for the next cycle
    const projectedScores = {
      prudence: Math.max(0, Math.min(100, Math.round(currentProfile.prudence + prudenceDelta * 0.5))),
      aggressiveness: Math.max(0, Math.min(100, Math.round(currentProfile.aggressiveness + aggressivenessDelta * 0.5))),
      governanceConsistency: Math.max(0, Math.min(100, Math.round(currentProfile.governanceConsistency + consistencyDelta * 0.5)))
    };

    return {
      status,
      trendDelta,
      predictedProfileShift,
      projectedScores
    };
  }
}
