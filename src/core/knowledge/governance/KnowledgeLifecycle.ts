export enum KnowledgeStatus {
  RAW_DATA = 'RAW_DATA',
  INFORMATION = 'INFORMATION',
  KNOWLEDGE_CANDIDATE = 'KNOWLEDGE_CANDIDATE',
  PENDING_VALIDATION = 'PENDING_VALIDATION',
  VALIDATED_KNOWLEDGE = 'VALIDATED_KNOWLEDGE',
  EXECUTIVE_CONTEXT = 'EXECUTIVE_CONTEXT',
  INTELLIGENCE_OUTPUT = 'INTELLIGENCE_OUTPUT'
}

export interface KnowledgeTemporalContext {
  createdAt: Date;
  validFrom?: Date;
  validUntil: Date;
  isExpired: boolean;
}

export class KnowledgeLifecyclePolicy {
  /**
   * Promotes a candidate to a validated artifact only if confidence is sufficient.
   */
  static canPromoteToValidated(status: KnowledgeStatus, confidence: number): boolean {
    return (status === KnowledgeStatus.KNOWLEDGE_CANDIDATE || status === KnowledgeStatus.PENDING_VALIDATION) 
      && confidence >= 80;
  }

  /**
   * Evaluates if the current temporal context is valid against a reference date (usually today).
   */
  static isTemporallyValid(temporalContext: KnowledgeTemporalContext, referenceDate: Date = new Date()): boolean {
    if (temporalContext.isExpired) return false;
    
    if (temporalContext.validFrom && referenceDate < temporalContext.validFrom) {
      return false; // Not yet valid
    }
    
    if (referenceDate > temporalContext.validUntil) {
      return false; // Expired
    }
    
    return true;
  }
}
