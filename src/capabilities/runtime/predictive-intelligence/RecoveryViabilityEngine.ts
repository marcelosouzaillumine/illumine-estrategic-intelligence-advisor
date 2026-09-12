// src/core/runtime/predictive-intelligence/RecoveryViabilityEngine.ts
//
// Recovery Viability Engine
// Computes turnaround viability indexes, false recovery risks, and confidence bounds.

import { ExecutiveDecision } from '../decision-intelligence/decision-types';
import { FatigueMetrics, BehaviorProfile } from '../behavioral-intelligence/behavioral-types';
import { ResilienceAssessment } from './InstitutionalResilienceEngine';

export interface RecoveryViability {
  viabilityIndex: number; // 0-100 (Recovery Viability Index)
  isViable: boolean;
  falseRecoveryRisk: boolean;
  sustainabilityDescription: string;
  confidenceBounds: { min: number; max: number };
}

export class RecoveryViabilityEngine {
  /**
   * Assesses the viability of institutional turnaround and projects recovery parameters.
   */
  public static assessRecovery(
    history: ExecutiveDecision[],
    report: any,
    profile: BehaviorProfile,
    resilience: ResilienceAssessment,
    fatigue: FatigueMetrics
  ): RecoveryViability {
    let viabilityIndex = 50; // default baseline

    const ocf = report?.cashFlowReport?.operational?.fco ?? report?.ocf ?? 0;
    const netIncome = report?.metrics?.netIncome ?? report?.netIncome ?? 0;

    // 1. Calculate base turnaround viability
    // Positive OCF and net income boost viability, high fatigue and high risk appetite drag it
    viabilityIndex += Math.round((profile.prudence - 50) * 0.4);
    viabilityIndex += Math.round((resilience.resilienceIndex - 60) * 0.3);
    viabilityIndex -= Math.round(fatigue.survivabilityFatigue * 0.3);

    if (ocf > 0) {
      viabilityIndex += 15;
    } else {
      viabilityIndex -= 10;
    }

    if (netIncome > 0) {
      viabilityIndex += 10;
    }

    // Adjust for active Turnaround profile
    const costCutHistory = history.slice(-5).filter(d => d.domains.includes('Cost Reduction')).length;
    const isTurnaroundActive = costCutHistory >= 2;
    if (isTurnaroundActive && profile.governanceConsistency > 75) {
      viabilityIndex += 10; // Structured turnaround increases viability
    }

    // Normalize
    viabilityIndex = Math.max(0, Math.min(100, viabilityIndex));

    // 2. False Recovery Risk Detection
    // False recovery is flagged if viability index is moderate/high but OCF remains negative
    // and cash is supported only by financing or one-off activities
    const hasFinancingStrategy = history.slice(-3).some(d => d.domains.includes('Financing Strategy') || d.domains.includes('Debt Expansion'));
    const falseRecoveryRisk = ocf < 0 && (hasFinancingStrategy || resilience.isRecoveryFragile);

    let sustainabilityDescription = 'Fluxo operacional estável. Trajetória de governança equilibrada.';
    if (falseRecoveryRisk) {
      sustainabilityDescription = 'Alerta de Falso Turnaround: Sintomas de alívio temporário de caixa movido a captação de recursos, sem lastro na eficiência operacional.';
    } else if (viabilityIndex < 40) {
      sustainabilityDescription = 'Inviabilidade de Turnaround: Degradação acelerada de salvaguardas com baixa capacidade de resposta corporativa.';
    } else if (viabilityIndex > 70) {
      sustainabilityDescription = 'Recuperação Sustentável: Sólido alinhamento fiduciário com retorno incremental de margens operacionais.';
    } else if (isTurnaroundActive) {
      sustainabilityDescription = 'Turnaround em Curso: Medidas de reestruturação ativas com conformidade moderada.';
    }

    // 3. Confidence bounds to prevent deterministic promises (probability bounds)
    // Bounds narrow with larger histories and high consistency
    const margin = Math.max(5, 20 - Math.round(profile.governanceConsistency * 0.15));
    const confidenceBounds = {
      min: Math.max(0, viabilityIndex - margin),
      max: Math.min(100, viabilityIndex + margin)
    };

    const isViable = viabilityIndex >= 50 && !falseRecoveryRisk;

    return {
      viabilityIndex,
      isViable,
      falseRecoveryRisk,
      sustainabilityDescription,
      confidenceBounds
    };
  }
}
