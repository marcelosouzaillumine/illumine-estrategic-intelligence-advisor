import { ExecutiveDecisionForensicsPackage } from '../models/ExecutiveDecisionForensicsPackage';

export class DecisionForensicEngine {
  /**
   * Compila a trilha forense de uma recomendação validando a integridade
   * de toda a cadeia de custódia (Observação -> Evidência -> Raciocínio -> Recomendação).
   */
  public compileForensicTrace(
    rawPackage: Partial<ExecutiveDecisionForensicsPackage>
  ): ExecutiveDecisionForensicsPackage {
    
    // GFC-COG-013: Decision Forensics Completeness
    this.validateForensicCompleteness(rawPackage);

    // Constrói e sela o pacote forense
    const forensicPackage: ExecutiveDecisionForensicsPackage = {
      decisionId: rawPackage.decisionId || crypto.randomUUID(),
      tenantId: rawPackage.tenantId!,
      initiatedBy: rawPackage.initiatedBy!,
      observationChain: rawPackage.observationChain || [],
      evidenceChain: rawPackage.evidenceChain || [],
      reasoningChain: rawPackage.reasoningChain || [],
      agentContributions: rawPackage.agentContributions || [],
      confidenceEvolution: rawPackage.confidenceEvolution || [],
      governanceChecks: rawPackage.governanceChecks || [],
      finalRecommendation: rawPackage.finalRecommendation!,
    };

    return forensicPackage;
  }

  private validateForensicCompleteness(pkg: Partial<ExecutiveDecisionForensicsPackage>): void {
    if (!pkg.observationChain || pkg.observationChain.length === 0) {
      throw new Error('OPAQUE GOVERNANCE: Recommendation blocked. Missing observation chain.');
    }
    
    if (!pkg.evidenceChain || pkg.evidenceChain.length === 0) {
      throw new Error('OPAQUE GOVERNANCE: Recommendation blocked. Missing evidence chain.');
    }

    if (!pkg.reasoningChain || pkg.reasoningChain.length === 0) {
      throw new Error('OPAQUE GOVERNANCE: Recommendation blocked. Missing reasoning chain.');
    }

    if (!pkg.finalRecommendation) {
      throw new Error('OPAQUE GOVERNANCE: Recommendation blocked. Missing final recommendation.');
    }

    if (!pkg.confidenceEvolution || pkg.confidenceEvolution.length === 0) {
      throw new Error('OPAQUE GOVERNANCE: Recommendation blocked. Missing confidence validation.');
    }

    if (!pkg.governanceChecks || pkg.governanceChecks.length === 0) {
      throw new Error('OPAQUE GOVERNANCE: Recommendation blocked. Missing governance review.');
    }

    // Verifica a linhagem
    const recNode = pkg.finalRecommendation;
    if (!recNode.parentId) {
      throw new Error('FORENSIC CHAIN BROKEN: Recommendation missing parent reasoning ID.');
    }
    
    const reasoningParent = pkg.reasoningChain.find(r => r.id === recNode.parentId);
    if (!reasoningParent) {
      throw new Error('FORENSIC CHAIN BROKEN: Recommendation points to unknown reasoning ID.');
    }
  }

  /**
   * Verifica imutabilidade do rastro histórico (para o teste de violação)
   */
  public verifyTraceImmutability(traceHash: string, calculatedHash: string): void {
    if (traceHash !== calculatedHash) {
      throw new Error('IMMUTABLE TRACE VIOLATION: The historical trace has been altered.');
    }
  }
}
