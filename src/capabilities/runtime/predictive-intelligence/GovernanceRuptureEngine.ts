// src/core/runtime/predictive-intelligence/GovernanceRuptureEngine.ts
//
// Governance Rupture Engine
// Detects imminent corporate governance or fiduciary rupture points.

import { DriftSeverity } from '../behavioral-intelligence/behavioral-types';
import { ResilienceAssessment } from './InstitutionalResilienceEngine';
import { StrategicCollapseAssessment } from './StrategicCollapseRiskEngine';
import { ProjectedSurvivability } from './SurvivabilityProjectionEngine';

export interface RuptureAssessment {
  isRuptureApproaching: boolean;
  ruptureTimeHorizon: 'IMINENTE' | 'CURTO_PRAZO' | 'NÃO_DETECTADO';
  ruptureDrivers: string[];
}

export class GovernanceRuptureEngine {
  /**
   * Evaluates if the institution is approaching a severe governance/fiduciary rupture point.
   */
  public static evaluateRupture(
    projection: ProjectedSurvivability,
    resilience: ResilienceAssessment,
    collapse: StrategicCollapseAssessment,
    driftSeverity: DriftSeverity
  ): RuptureAssessment {
    const ruptureDrivers: string[] = [];
    let isRuptureApproaching = false;
    let ruptureTimeHorizon: 'IMINENTE' | 'CURTO_PRAZO' | 'NÃO_DETECTADO' = 'NÃO_DETECTADO';

    // 1. Imminent rupture conditions (within next 2 steps)
    const hasImminentRuptureScores = projection.isImminentRupture;
    const hasSevereLongitudinalRisk = collapse.systemicFailureProbability > 70 || collapse.isExhausted;
    const hasLowResilience = resilience.resilienceIndex < 40;

    if (hasImminentRuptureScores && (hasSevereLongitudinalRisk || driftSeverity === 'CONSTITUTIONAL_DRIFT')) {
      isRuptureApproaching = true;
      ruptureTimeHorizon = 'IMINENTE';
      ruptureDrivers.push('Colapso projetado de scores de sobrevivência no horizonte imediato (1-2 ciclos).');
    }

    // 2. Short term rupture conditions (within 3-5 steps)
    const hasShortTermRisk = Object.values(projection.stepsToThresholdViolation).some(t => t > 2 && t <= 5);
    const hasSignificantDrift = driftSeverity === 'CRITICAL_DRIFT' || driftSeverity === 'CONSTITUTIONAL_DRIFT';

    if (!isRuptureApproaching && (hasShortTermRisk || collapse.systemicFailureProbability > 50) && (hasLowResilience || hasSignificantDrift)) {
      isRuptureApproaching = true;
      ruptureTimeHorizon = 'CURTO_PRAZO';
      ruptureDrivers.push('Deterioração longitudinal sustentada com exaustão de resiliência corporativa.');
    }

    if (driftSeverity === 'CONSTITUTIONAL_DRIFT') {
      ruptureDrivers.push('Ruptura fiduciária longitudinal persistente confirmada no ledger.');
    }
    if (resilience.isRecoveryFragile) {
      ruptureDrivers.push('Frágil qualidade de recuperação de caixa mascarando riscos estruturais.');
    }

    return {
      isRuptureApproaching,
      ruptureTimeHorizon,
      ruptureDrivers
    };
  }
}
