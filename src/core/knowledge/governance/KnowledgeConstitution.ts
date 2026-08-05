import { KnowledgeValidation } from './KnowledgeValidation';
import { KnowledgeStatus, KnowledgeTemporalContext } from './KnowledgeLifecycle';
import { KnowledgeClassification } from './KnowledgeClassification';

/**
 * KnowledgeConstitution
 * 
 * Central entity representing the Governance layer for the Enterprise Knowledge Fabric.
 * Acts as the strict gateway preventing raw data, unauthorized insights, or AI hallucinations
 * from becoming Corporate Knowledge.
 */
export class KnowledgeConstitution {
  
  /**
   * Evaluates a candidate and ensures it follows the constitutional rules before being persisted
   * as a Validated Knowledge Artifact.
   */
  static authorizeArtifactCreation(
    status: KnowledgeStatus,
    classification: KnowledgeClassification,
    temporalContext: KnowledgeTemporalContext,
    sourceId: string,
    author: 'AI_AGENT' | 'HUMAN_EXECUTIVE' | 'SYSTEM'
  ): void {
    
    // Rule 1: AI cannot unilaterally create institutional truth if it's meant to be a decision.
    // (Handled partially here, but typically AI shouldn't be the author of 'VALIDATED' knowledge without human in the loop, unless it's a synthesis).
    
    // Rule 2: Cannot create an artifact without a source and validity.
    KnowledgeValidation.validateArtifactPromotion(status, classification, temporalContext, sourceId);
  }

  /**
   * Ensures that AI actions comply with the fundamental rule:
   * "Intelligence may consume knowledge. Intelligence may not create institutional truth."
   */
  static evaluateAIOperation(intent: 'CREATE_DECISION' | 'SYNTHESIZE' | 'ANALYZE' | 'SUGGEST'): void {
    KnowledgeValidation.enforceAIConstraint('AI_AGENT', intent);
  }

}
