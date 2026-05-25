import { ConflictDisclosure, ConflictSeverity, FiduciaryDecisionContext, VotingRestriction } from './types';

export class ConflictOfInterestEngine {
  private disclosures: Map<string, ConflictDisclosure> = new Map();

  /**
   * Registra um disclosure de conflito, garantindo isolamento multi-tenant.
   */
  public registerDisclosure(disclosure: ConflictDisclosure): void {
    if (!disclosure.tenantId) {
      throw new Error('TenantId obrigatório para isolamento Fiduciário (Zero Cross-Tenant Leakage).');
    }
    this.disclosures.set(disclosure.disclosureId, disclosure);
  }

  /**
   * Retorna os conflitos declarados para um Tenant.
   */
  public getDisclosuresForTenant(tenantId: string): ConflictDisclosure[] {
    return Array.from(this.disclosures.values()).filter(d => d.tenantId === tenantId);
  }

  /**
   * Retorna os conflitos associados especificamente a uma decisão.
   */
  public getDisclosuresForDecision(tenantId: string, decisionId: string): ConflictDisclosure[] {
    return this.getDisclosuresForTenant(tenantId).filter(d => d.decisionId === decisionId);
  }

  /**
   * Avalia os conflitos antes de uma decisão e gera as restrições de voto.
   */
  public evaluateDecisionConflicts(
    tenantId: string, 
    decisionCtx: FiduciaryDecisionContext,
    voterIds: string[]
  ): { restrictions: VotingRestriction[], hasBlockingConflict: boolean, severityScore: number } {
    
    const decisionDisclosures = this.getDisclosuresForDecision(tenantId, decisionCtx.decisionId);
    const restrictions: VotingRestriction[] = [];
    let hasBlockingConflict = false;
    let severityScore = 0; // 0 a 100

    // Avalia disclosures diretos
    for (const disclosure of decisionDisclosures) {
      if (voterIds.includes(disclosure.userId)) {
        
        const isImpeditivo = disclosure.severity === 'Impeditiva';
        if (isImpeditivo) hasBlockingConflict = true;

        severityScore += this.getSeverityWeight(disclosure.severity);

        restrictions.push({
          userId: disclosure.userId,
          restrictionReason: `Conflito Declarado: ${disclosure.type} (${disclosure.severity})`,
          isMandatoryAbstention: isImpeditivo || disclosure.severity === 'Alta'
        });
      }
    }

    return {
      restrictions,
      hasBlockingConflict,
      severityScore: Math.min(100, severityScore)
    };
  }

  /**
   * Analisa a necessidade de um disclosure formal baseado na sensibilidade e valor da decisão.
   */
  public requiresFormalDisclosure(decisionCtx: FiduciaryDecisionContext): boolean {
    if (decisionCtx.isSensitive || decisionCtx.requiresBoardApproval) return true;
    if (decisionCtx.amountImpact && decisionCtx.amountImpact > 1000000) return true; // threshold mockado
    return false;
  }

  private getSeverityWeight(severity: ConflictSeverity): number {
    switch (severity) {
      case 'Baixa': return 10;
      case 'Média': return 30;
      case 'Alta': return 70;
      case 'Impeditiva': return 100;
      default: return 0;
    }
  }
}

export const conflictOfInterestEngine = new ConflictOfInterestEngine();
