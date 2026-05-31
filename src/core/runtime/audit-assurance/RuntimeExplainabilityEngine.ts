// src/core/runtime/audit-assurance/RuntimeExplainabilityEngine.ts
//
// Runtime Explainability Engine
// Generates natural language (Portuguese) justifications for governance and treasury constraints.

export interface ExplainabilityContext {
  isDecisionBlocked?: boolean;
  decisionBlockTrigger?: string;
  isSeverityEscalated?: boolean;
  severityEscalationTrigger?: string;
  isSurvivabilityDegraded?: boolean;
  survivabilityDegradationTrigger?: string;
  isTreasuryRestrictionsPropagated?: boolean;
  treasuryPropagationTrigger?: string;
  isPredictiveRuptureTriggered?: boolean;
  predictiveRuptureTrigger?: string;
  isPublicationRestricted?: boolean;
  publicationRestrictionTrigger?: string;
}

export class RuntimeExplainabilityEngine {
  /**
   * Generates localized narratives explaining why specific limits, blocks, or escalations triggered.
   */
  public explainState(context: ExplainabilityContext): {
    decisionBlockReason?: string;
    severityEscalationReason?: string;
    survivabilityDegradationReason?: string;
    treasuryPropagationReason?: string;
    predictiveRuptureReason?: string;
    publicationRestrictionReason?: string;
  } {
    const narrative: {
      decisionBlockReason?: string;
      severityEscalationReason?: string;
      survivabilityDegradationReason?: string;
      treasuryPropagationReason?: string;
      predictiveRuptureReason?: string;
      publicationRestrictionReason?: string;
    } = {};

    if (context.isDecisionBlocked) {
      narrative.decisionBlockReason = context.decisionBlockTrigger
        ? `Decisão bloqueada pelo controle de governança fiduciária: ${context.decisionBlockTrigger}.`
        : 'Decisão bloqueada devido a inconformidade operacional ou violação ativa de limites de risco fiduciário.';
    }

    if (context.isSeverityEscalated) {
      narrative.severityEscalationReason = context.severityEscalationTrigger
        ? `Severidade elevada para nível crítico: ${context.severityEscalationTrigger}.`
        : 'Severidade elevada devido ao cruzamento de limites prudenciais e escalação automática de mitigação.';
    }

    if (context.isSurvivabilityDegraded) {
      narrative.survivabilityDegradationReason = context.survivabilityDegradationTrigger
        ? `Capacidade de sobrevivência institucional comprometida: ${context.survivabilityDegradationTrigger}.`
        : 'Degradação da sobrevivência decorrente de estresse financeiro severo ou ruptura de covenants contratuais.';
    }

    if (context.isTreasuryRestrictionsPropagated) {
      narrative.treasuryPropagationReason = context.treasuryPropagationTrigger
        ? `Restrições de tesouraria propagadas para coligadas: ${context.treasuryPropagationTrigger}.`
        : 'Propagação de salvaguardas de caixa e limites de alocação de liquidez intra-grupo.';
    }

    if (context.isPredictiveRuptureTriggered) {
      narrative.predictiveRuptureReason = context.predictiveRuptureTrigger
        ? `Ruptura preditiva detectada nos modelos: ${context.predictiveRuptureTrigger}.`
        : 'Ruptura de projeção identificada com alto desvio em relação ao cenário-base estruturado.';
    }

    if (context.isPublicationRestricted) {
      narrative.publicationRestrictionReason = context.publicationRestrictionTrigger
        ? `Restrição de publicação formal aplicada: ${context.publicationRestrictionTrigger}.`
        : 'A publicação formal ou exportação de relatórios está restrita por falta de disclosures obrigatórios ou lineage quebrado.';
    }

    return narrative;
  }
}
