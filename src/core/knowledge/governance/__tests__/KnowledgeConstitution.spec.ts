import { describe, it, expect } from 'vitest';
import { KnowledgeConstitution } from '../KnowledgeConstitution';
import { KnowledgeStatus, KnowledgeTemporalContext } from '../KnowledgeLifecycle';
import { KnowledgeClassification, KnowledgeDomain, KnowledgeSensitivity } from '../KnowledgeClassification';

describe('Knowledge Constitution', () => {
  
  const validTemporalContext: KnowledgeTemporalContext = {
    createdAt: new Date(),
    validUntil: new Date(new Date().setFullYear(new Date().getFullYear() + 1)), // Valid for 1 year
    isExpired: false
  };

  const validClassification: KnowledgeClassification = {
    domain: KnowledgeDomain.STRATEGY,
    sensitivity: KnowledgeSensitivity.INTERNAL,
    confidence: 95
  };

  it('should block artifact creation without a source', () => {
    expect(() => {
      KnowledgeConstitution.authorizeArtifactCreation(
        KnowledgeStatus.KNOWLEDGE_CANDIDATE,
        validClassification,
        validTemporalContext,
        '', // Empty source
        'HUMAN_EXECUTIVE'
      );
    }).toThrow(/sourceId is missing/);
  });

  it('should block artifact creation without temporal validity', () => {
    const infiniteTemporalContext: any = {
      createdAt: new Date(),
      isExpired: false
    };

    expect(() => {
      KnowledgeConstitution.authorizeArtifactCreation(
        KnowledgeStatus.KNOWLEDGE_CANDIDATE,
        validClassification,
        infiniteTemporalContext,
        'doc-123',
        'HUMAN_EXECUTIVE'
      );
    }).toThrow(/temporal context is missing or infinite/);
  });

  it('should block AI from creating an institutional decision', () => {
    expect(() => {
      KnowledgeConstitution.evaluateAIOperation('CREATE_DECISION');
    }).toThrow(/Intelligence may consume knowledge, but may not create institutional truth/);
  });

  it('should allow AI to synthesize or analyze', () => {
    expect(() => {
      KnowledgeConstitution.evaluateAIOperation('SYNTHESIZE');
      KnowledgeConstitution.evaluateAIOperation('ANALYZE');
    }).not.toThrow();
  });

  it('should block promotion if confidence is too low', () => {
    const lowConfidenceClassification = { ...validClassification, confidence: 70 };
    
    expect(() => {
      KnowledgeConstitution.authorizeArtifactCreation(
        KnowledgeStatus.KNOWLEDGE_CANDIDATE,
        lowConfidenceClassification,
        validTemporalContext,
        'doc-123',
        'HUMAN_EXECUTIVE'
      );
    }).toThrow(/Insufficient confidence/);
  });

  it('should allow promotion if all constitutional rules are met', () => {
    expect(() => {
      KnowledgeConstitution.authorizeArtifactCreation(
        KnowledgeStatus.KNOWLEDGE_CANDIDATE,
        validClassification,
        validTemporalContext,
        'doc-123',
        'HUMAN_EXECUTIVE'
      );
    }).not.toThrow();
  });

});
