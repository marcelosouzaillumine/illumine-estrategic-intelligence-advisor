import { 
  FiduciaryDecisionContext, 
  FiduciaryValidationResult, 
  FiduciaryApprovalGate,
  FiduciaryAuditTrail
} from './types';
import { conflictOfInterestEngine } from './ConflictOfInterestEngine';
import { relatedPartiesRegistry } from './RelatedPartiesRegistry';

export class DecisionFiduciaryValidator {
  constructor(...args: any[]) {}
  [key: string]: any;
  static [key: string]: any;
  private gates: Map<string, FiduciaryApprovalGate> = new Map();

  /**
   * Ponto de entrada obrigatório antes de qualquer aprovação executiva sensível.
   * Analisa a decisão contra a base de conflitos e partes relacionadas.
   */
  public evaluateGate(
    tenantId: string,
    approverId: string,
    decisionCtx: FiduciaryDecisionContext,
    partyIdsInvolved: string[] = []
  ): FiduciaryValidationResult {
    
    // 1. Checa conflitos declarados para este aprovador
    const conflictEval = conflictOfInterestEngine.evaluateDecisionConflicts(tenantId, decisionCtx, [approverId]);
    
    // 2. Checa partes relacionadas (cross-check societário)
    const hasRelatedPartyConflict = relatedPartiesRegistry.checkApproverConflicts(tenantId, approverId, partyIdsInvolved);

    const warnings: string[] = [];
    const blocks: string[] = [];
    const isBlocking = conflictEval.hasBlockingConflict || hasRelatedPartyConflict;

    if (hasRelatedPartyConflict) {
      blocks.push('Impedimento Estatutário: O aprovador possui vínculo direto com uma Parte Relacionada na transação.');
    }

    if (conflictEval.hasBlockingConflict) {
      blocks.push('Impedimento Declarado: O aprovador declarou conflito de severidade Impeditiva para esta pauta.');
    }

    if (conflictEval.severityScore > 30 && !isBlocking) {
      warnings.push('Atenção Fiduciária: Conflitos de baixa/média severidade detectados. Recomendada abstenção voluntária.');
    }

    // Se é uma decisão sensível, a engine de conflitos exige disclosure
    if (conflictOfInterestEngine.requiresFormalDisclosure(decisionCtx) && conflictEval.restrictions.length === 0) {
      warnings.push('Decisão Sensível: Nenhum disclosure formal localizado para o aprovador neste ciclo. Recomendado registrar declaração de isenção.');
    }

    // Calcula um confidence score base: 100 menos penalidades
    let confidenceScore = 100 - conflictEval.severityScore;
    if (hasRelatedPartyConflict) confidenceScore -= 50;
    if (warnings.length > 0) confidenceScore -= 10;
    confidenceScore = Math.max(0, confidenceScore);

    return {
      isApprovedToProceed: !isBlocking,
      warnings,
      blocks,
      votingRestrictions: conflictEval.restrictions,
      confidenceScore
    };
  }

  /**
   * Caso a validação passe, este método gera e registra o Gate Oficial de Aprovação (Auditável).
   */
  public issueApprovalGate(
    tenantId: string,
    approverId: string,
    decisionCtx: FiduciaryDecisionContext,
    validationResult: FiduciaryValidationResult
  ): FiduciaryApprovalGate {
    
    if (!validationResult.isApprovedToProceed) {
      throw new Error('Não é possível emitir Gate de Aprovação para validações com status de bloqueio.');
    }

    const auditEvent: FiduciaryAuditTrail = {
      auditId: `AUDIT-FID-${Date.now()}`,
      tenantId,
      decisionId: decisionCtx.decisionId,
      action: 'DECISION_CLEARED',
      timestamp: new Date().toISOString(),
      details: 'Validação fiduciária aprovada e Gate liberado para execução.',
      lineageHash: `LIN-${Date.now()}-${tenantId}-${approverId}` // Na prática gerado por função criptográfica
    };

    const gate: FiduciaryApprovalGate = {
      gateId: `GATE-${Date.now()}`,
      decisionContext: decisionCtx,
      validationStatus: validationResult,
      declaredConflicts: conflictOfInterestEngine.getDisclosuresForDecision(tenantId, decisionCtx.decisionId),
      relatedPartyCheck: {
        hasRelatedParties: false, // seria preenchido na integração real
        transactionsEnvolved: []
      },
      approverIdentity: approverId,
      decisionLineageHash: auditEvent.lineageHash,
      auditTrail: [auditEvent],
      createdAt: new Date().toISOString()
    };

    this.gates.set(gate.gateId, gate);
    return gate;
  }
}

export const decisionFiduciaryValidator = new DecisionFiduciaryValidator();
