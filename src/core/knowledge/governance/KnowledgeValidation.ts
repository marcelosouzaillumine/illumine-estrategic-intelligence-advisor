import { KnowledgeStatus, KnowledgeTemporalContext, KnowledgeLifecyclePolicy } from './KnowledgeLifecycle';
import { KnowledgeClassification } from './KnowledgeClassification';

export class KnowledgeValidationError extends Error {
  constructor(message: string) {
    super(`[Knowledge Governance Error]: ${message}`);
    this.name = 'KnowledgeValidationError';
  }
}

export class KnowledgeValidation {
  /**
   * Asserts that a piece of information can be promoted to a Knowledge Artifact.
   */
  static validateArtifactPromotion(
    status: KnowledgeStatus,
    classification: KnowledgeClassification,
    temporalContext?: KnowledgeTemporalContext,
    sourceId?: string
  ): void {
    if (!sourceId) {
      throw new KnowledgeValidationError('Artifact cannot be created without a verifiable source (sourceId is missing).');
    }

    if (!temporalContext || !temporalContext.validUntil) {
      throw new KnowledgeValidationError('Artifact cannot be created without a validity period (temporal context is missing or infinite).');
    }

    if (!KnowledgeLifecyclePolicy.isTemporallyValid(temporalContext)) {
      throw new KnowledgeValidationError('Artifact cannot be promoted if its temporal validity is already expired.');
    }

    if (!KnowledgeLifecyclePolicy.canPromoteToValidated(status, classification.confidence)) {
      throw new KnowledgeValidationError(`Insufficient confidence (${classification.confidence}%) or incorrect status (${status}) for promotion.`);
    }
  }

  /**
   * Asserts that an AI reasoning engine is not attempting to create institutional truth.
   */
  static enforceAIConstraint(author: 'AI_AGENT' | 'HUMAN_EXECUTIVE' | 'SYSTEM', intent: 'CREATE_DECISION' | 'SYNTHESIZE' | 'ANALYZE' | 'SUGGEST'): void {
    if (author === 'AI_AGENT' && intent === 'CREATE_DECISION') {
      throw new KnowledgeValidationError('AI cannot create an institutional decision. Intelligence may consume knowledge, but may not create institutional truth.');
    }
  }
}
