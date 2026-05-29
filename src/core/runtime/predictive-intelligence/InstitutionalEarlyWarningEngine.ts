// src/core/runtime/predictive-intelligence/InstitutionalEarlyWarningEngine.ts
//
// Institutional Early Warning Engine
// Generates early warning signals for the 9 mandatory warning classes.

import { DriftSeverity, FatigueMetrics, BehaviorProfile } from '../behavioral-intelligence/behavioral-types';
import { EarlyWarningSignal, EarlyWarningClass, PredictiveSeverity, PredictiveConfidence } from './predictive-types';
import { MomentumMetrics } from './DeteriorationMomentumEngine';
import { BehavioralAcceleration } from './BehavioralAccelerationEngine';
import { ProjectedSurvivability } from './SurvivabilityProjectionEngine';
import { ResilienceAssessment } from './InstitutionalResilienceEngine';
import { RecoveryViability } from './RecoveryViabilityEngine';
import { StrategicCollapseAssessment } from './StrategicCollapseRiskEngine';
import { RuptureAssessment } from './GovernanceRuptureEngine';

export class InstitutionalEarlyWarningEngine {
  /**
   * Evaluates all predictive calculations to emit early warning signals.
   */
  public static generateWarnings(
    profile: BehaviorProfile,
    fatigue: FatigueMetrics,
    consistencyScore: number,
    driftSeverity: DriftSeverity,
    momentum: MomentumMetrics,
    acceleration: BehavioralAcceleration,
    projection: ProjectedSurvivability,
    resilience: ResilienceAssessment,
    recovery: RecoveryViability,
    collapse: StrategicCollapseAssessment,
    rupture: RuptureAssessment
  ): EarlyWarningSignal[] {
    const warnings: EarlyWarningSignal[] = [];
    const timestamp = new Date().toISOString();

    const addWarning = (
      warningClass: EarlyWarningClass,
      severity: PredictiveSeverity,
      confidence: PredictiveConfidence,
      description: string,
      triggerFactors: string[]
    ) => {
      warnings.push({
        warningClass,
        severity,
        confidence,
        description,
        triggerFactors,
        timestamp
      });
    };

    // 1. Liquidity Deterioration Warning
    if (projection.projectedScores.liquidity < 40 || momentum.liquidityMomentum < -5) {
      const severity = projection.projectedScores.liquidity < 30 ? 'CRITICAL' : 'ATTENTION';
      addWarning(
        'Liquidity Deterioration Warning',
        severity,
        'HIGH',
        `Projeção indica enfraquecimento das reservas de liquidez, com esgotamento estimado em menos de 5 ciclos.`,
        [`Velocidade de caixa: ${momentum.liquidityMomentum} pts/ciclo`, `Aceleração de caixa: ${momentum.liquidityAcceleration} pts/ciclo²`]
      );
    }

    // 2. Governance Fatigue Escalation
    if (fatigue.compositeFatigue > 55 || acceleration.fatigueAccumulationRate > 1.5) {
      addWarning(
        'Governance Fatigue Escalation',
        'ATTENTION',
        'MEDIUM',
        `Aceleração da fadiga decisória estrutural. Ritmo de decisões emergenciais pode comprometer o controle fiduciário.`,
        [`Taxa de acúmulo de fadiga: ${acceleration.fatigueAccumulationRate} pts/ciclo`, `Fadiga composta atual: ${fatigue.compositeFatigue}`]
      );
    }

    // 3. Strategic Instability Warning
    if (profile.strategicStability < 50 || acceleration.volatilityVelocity > 40) {
      addWarning(
        'Strategic Instability Warning',
        'ATTENTION',
        'HIGH',
        `Elevada volatilidade de direcionamento operacional com alternâncias rápidas de foco (pivôs frequentes).`,
        [`Velocidade de volatilidade: ${acceleration.volatilityVelocity}% de desvios`, `Estabilidade estratégica: ${profile.strategicStability}`]
      );
    }

    // 4. Capital Preservation Risk
    if (profile.capitalPreservationDiscipline < 45 || momentum.liquidityMomentum < -8) {
      addWarning(
        'Capital Preservation Risk',
        'HIGH_RISK',
        'HIGH',
        `Exaustão de proteções de preservação de capital. Risco de erosão patrimonial acelerada por saídas relevantes.`,
        [`Disciplina de preservação: ${profile.capitalPreservationDiscipline}`, `Momentum de liquidez: ${momentum.liquidityMomentum}`]
      );
    }

    // 5. Survivability Rupture Risk
    if (rupture.isRuptureApproaching) {
      const severity = rupture.ruptureTimeHorizon === 'IMINENTE' ? 'RUPTURE_RISK' : 'HIGH_RISK';
      addWarning(
        'Survivability Rupture Risk',
        severity,
        'HIGH',
        `Ruptura iminente ou de curto prazo detectada na governança e nos scores de sustentabilidade da organização.`,
        rupture.ruptureDrivers
      );
    }

    // 6. Executive Consistency Collapse
    if (consistencyScore < 55) {
      addWarning(
        'Executive Consistency Collapse',
        'HIGH_RISK',
        'MEDIUM',
        `Queda abrupta de alinhamento entre as justificativas estratégicas e as ações financeiras formais.`,
        [`Score de consistência: ${consistencyScore}`]
      );
    }

    // 7. Institutional Drift Acceleration
    if (driftSeverity !== 'STABLE' && momentum.driftAccelerationMomentum > 1) {
      addWarning(
        'Institutional Drift Acceleration',
        'CRITICAL',
        'HIGH',
        `Desvios repetidos de conformidade fiduciária em aceleração longitudinal.`,
        [`Divergência de governança: ${momentum.driftAccelerationMomentum} pts/ciclo`, `Severidade de desvio atual: ${driftSeverity}`]
      );
    }

    // 8. Resilience Erosion Warning
    if (resilience.resilienceIndex < 45 || resilience.isRecoveryFragile) {
      const severity = resilience.resilienceIndex < 30 ? 'CRITICAL' : 'ATTENTION';
      addWarning(
        'Resilience Erosion Warning',
        severity,
        'HIGH',
        `Erosão da capacidade de absorção de choques da organização. Recuperações são frágeis ou inexistentes.`,
        resilience.resilienceWarnings
      );
    }

    // 9. Recovery Failure Risk
    if (recovery.falseRecoveryRisk || (driftSeverity === 'CONSTITUTIONAL_DRIFT' && recovery.viabilityIndex < 45)) {
      addWarning(
        'Recovery Failure Risk',
        'CRITICAL',
        'HIGH',
        `Probabilidade relevante de fracasso do turnaround. Presença de falso alívio operacional por fontes externas.`,
        [recovery.sustainabilityDescription]
      );
    }

    return warnings;
  }
}
