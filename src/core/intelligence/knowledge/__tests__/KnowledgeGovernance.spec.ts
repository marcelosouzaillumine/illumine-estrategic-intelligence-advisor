import { describe, it, expect } from 'vitest';
import { KnowledgeGovernance } from '../governance/KnowledgeGovernance';
import { ExecutiveKnowledge } from '../contracts/ExecutiveKnowledge';

describe('KnowledgeGovernance', () => {
  const governance = new KnowledgeGovernance();

  it('should approve valid knowledge', () => {
    const knowledge: ExecutiveKnowledge = {
      id: 'k1', type: 'CONCEPT', domain: 'FINANCIAL', ontologyReferences: ['ref1'], title: 't', description: 'd', content: {}, confidence: 1, maturity: 'VERIFIED', 
      metadata: { version: '1.0', author: 'a', source: 's', createdAt: 'date' }
    };
    const result = governance.validate(knowledge);
    expect(result.approved).toBe(true);
  });

  it('should block knowledge without an ontology reference', () => {
    const knowledge: ExecutiveKnowledge = {
      id: 'k1', type: 'CONCEPT', domain: 'FINANCIAL', ontologyReferences: [], title: 't', description: 'd', content: {}, confidence: 1, maturity: 'VERIFIED', 
      metadata: { version: '1.0', author: 'a', source: 's', createdAt: 'date' }
    };
    const result = governance.validate(knowledge);
    expect(result.approved).toBe(false);
    expect(result.reasons).toContain('Knowledge must be associated with at least one Ontology Concept.');
  });

  it('should block experimental knowledge with suspiciously high confidence', () => {
    const knowledge: ExecutiveKnowledge = {
      id: 'k1', type: 'CONCEPT', domain: 'FINANCIAL', ontologyReferences: ['ref1'], title: 't', description: 'd', content: {}, confidence: 0.95, maturity: 'EXPERIMENTAL', 
      metadata: { version: '1.0', author: 'a', source: 's', createdAt: 'date' }
    };
    const result = governance.validate(knowledge);
    expect(result.approved).toBe(false);
    expect(result.reasons).toContain('EXPERIMENTAL knowledge cannot have confidence > 0.8.');
  });

  it('should block knowledge without source or version metadata', () => {
    const knowledge: any = {
      id: 'k1', type: 'CONCEPT', domain: 'FINANCIAL', ontologyReferences: ['ref1'], title: 't', description: 'd', content: {}, confidence: 1, maturity: 'VERIFIED', 
      metadata: { author: 'a', createdAt: 'date' } // Missing version and source
    };
    const result = governance.validate(knowledge as ExecutiveKnowledge);
    expect(result.approved).toBe(false);
    expect(result.reasons?.length).toBe(2);
  });
});
