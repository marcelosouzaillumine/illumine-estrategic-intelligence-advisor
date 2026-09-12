// src/core/runtime/pilot-operations/ProductionReadinessAssessment.ts

import { PilotSupervisionTelemetry, PilotReadinessReport, PilotFeedbackEntry } from './types';

export class ProductionReadinessAssessment {
  /**
   * Deterministically evaluate pilot metrics to determine production readiness.
   */
  public static evaluate(
    telemetry: PilotSupervisionTelemetry,
    feedbackList: PilotFeedbackEntry[]
  ): PilotReadinessReport {
    const unresolvedGovernanceBlockers: string[] = [];
    let maturityScore = 100;

    // 1. Evaluate Onboarding Stability
    if (telemetry.onboardingProgress < 100) {
      unresolvedGovernanceBlockers.push('ONBOARDING_INCOMPLETE: Executivos do tenant não concluíram o fluxo completo de capacitação fiduciária.');
      maturityScore -= 20;
    }

    // 2. Evaluate Runtime Resilience
    if (telemetry.runtimeStability < 95) {
      unresolvedGovernanceBlockers.push(`RUNTIME_INSTABILITY: Taxa de estabilidade operacional abaixo do threshold aceitável (Atual: ${telemetry.runtimeStability}%).`);
      maturityScore -= 25;
    }

    // 3. Evaluate Feedback blockages
    const blockingFeedback = feedbackList.filter(f => f.severity === 'BLOCKING' || f.severity === 'CRITICAL');
    if (blockingFeedback.length > 0) {
      unresolvedGovernanceBlockers.push(`UNRESOLVED_CRITICAL_FEEDBACK: Existem ${blockingFeedback.length} feedbacks de severidade Crítica ou Bloqueante ativos.`);
      maturityScore -= Math.min(30, blockingFeedback.length * 15);
    }

    // 4. Check Cognitive Load
    if (telemetry.cognitiveLoad.status === 'CRITICAL') {
      unresolvedGovernanceBlockers.push('EXECUTIVE_COGNITIVE_PANIC: Sinais de telemetria indicam excesso de interações (fricção cognitiva de uso).');
      maturityScore -= 15;
    }

    // 5. Sovereignty check: Health status cannot be DEGRADED or FAIL_CLOSED
    if (telemetry.health === 'FAIL_CLOSED') {
      unresolvedGovernanceBlockers.push('FAIL_CLOSED_STATE: Tenant operacional em estado de isolamento emergencial de segurança.');
      maturityScore = 0;
    } else if (telemetry.health === 'DEGRADED') {
      unresolvedGovernanceBlockers.push('HEALTH_DEGRADED: Saúde geral do piloto degradada devido a inconsistências acumuladas.');
      maturityScore = Math.min(maturityScore, 40);
    }

    // Bound score
    maturityScore = Math.max(0, Math.min(100, maturityScore));

    // Determine readiness classification
    let rating: 'GO_LIVE_READY' | 'CONDITIONAL_APPROVAL' | 'UNREADY' = 'UNREADY';
    let operationalRiskSummary = '';
    let recommendedProductionTimeline = '';

    if (maturityScore >= 90 && unresolvedGovernanceBlockers.length === 0) {
      rating = 'GO_LIVE_READY';
      operationalRiskSummary = 'Mínimo risco operacional. Todos os critérios de maturidade e nexo de causalidade foram atendidos.';
      recommendedProductionTimeline = 'Imediata liberação de chaves produtivas (Go-Live).';
    } else if (maturityScore >= 60 && unresolvedGovernanceBlockers.every(b => !b.startsWith('FAIL_CLOSED') && !b.startsWith('RUNTIME_INSTABILITY'))) {
      rating = 'CONDITIONAL_APPROVAL';
      operationalRiskSummary = 'Risco operacional moderado. Permitido com supervisão assistida e mitigação de feedbacks bloqueantes em até 15 dias.';
      recommendedProductionTimeline = 'Próximos 15 dias, sob acompanhamento diário do Board.';
    } else {
      rating = 'UNREADY';
      operationalRiskSummary = 'Alto risco operacional. Falhas críticas de resiliência, onboarding ou bloqueios societários impedem a migração de chaves.';
      recommendedProductionTimeline = 'Bloqueado. Reavaliar após correção das violações e nova rodada de 30 dias de piloto.';
    }

    // Generate deterministic lineage hash
    const criteriaStr = `${telemetry.tenantId}:${rating}:${maturityScore}:${unresolvedGovernanceBlockers.length}`;
    let hash = 0;
    for (let i = 0; i < criteriaStr.length; i++) {
      hash = (hash << 5) - hash + criteriaStr.charCodeAt(i);
      hash |= 0;
    }
    const lineageHash = `0xPR-LINEAGE-${Math.abs(hash).toString(16).toUpperCase()}`;

    return {
      rating,
      maturityScore,
      unresolvedGovernanceBlockers,
      operationalRiskSummary,
      recommendedProductionTimeline,
      generatedAt: new Date().toISOString(),
      lineageHash
    };
  }
}
