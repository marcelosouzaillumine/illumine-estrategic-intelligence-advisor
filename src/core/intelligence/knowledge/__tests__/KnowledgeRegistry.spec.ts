import { describe, it, expect, beforeEach } from 'vitest';
import { ExecutiveKnowledgeRegistry } from '../registry/ExecutiveKnowledgeRegistry';
import { ExecutiveKnowledge } from '../contracts/ExecutiveKnowledge';

describe('ExecutiveKnowledgeRegistry', () => {
  let registry: ExecutiveKnowledgeRegistry;
  
  beforeEach(() => {
    registry = new ExecutiveKnowledgeRegistry();
  });

  it('should register and find knowledge by id', () => {
    const knowledge: ExecutiveKnowledge = {
      id: 'k1', type: 'CONCEPT', domain: 'FINANCIAL', ontologyReferences: [], title: 't1', description: 'd1', content: {}, confidence: 1, maturity: 'VERIFIED', metadata: { version: '1', author: 'a', source: 's', createdAt: 'date' }
    };

    registry.registerKnowledge(knowledge);
    const result = registry.findKnowledge('k1');
    expect(result).toBeDefined();
    expect(result?.title).toBe('t1');
  });

  it('should find knowledge by ontology concept', () => {
    const knowledge: ExecutiveKnowledge = {
      id: 'k2', type: 'BENCHMARK', domain: 'FINANCIAL', ontologyReferences: ['financial.liquidity'], title: 't2', description: 'd2', content: {}, confidence: 1, maturity: 'VERIFIED', metadata: { version: '1', author: 'a', source: 's', createdAt: 'date' }
    };

    registry.registerKnowledge(knowledge);
    const results = registry.findByConcept('financial.liquidity');
    expect(results.length).toBe(1);
    expect(results[0].id).toBe('k2');
  });

  it('should find knowledge by domain', () => {
    const knowledge: ExecutiveKnowledge = {
      id: 'k3', type: 'RULE', domain: 'HR', ontologyReferences: [], title: 't3', description: 'd3', content: {}, confidence: 1, maturity: 'VERIFIED', metadata: { version: '1', author: 'a', source: 's', createdAt: 'date' }
    };

    registry.registerKnowledge(knowledge);
    const results = registry.findByDomain('HR');
    expect(results.length).toBe(1);
    expect(results[0].id).toBe('k3');
  });
});
