import { describe, it, expect } from 'vitest';
import { ExecutiveKnowledgeRegistry } from '../registry/ExecutiveKnowledgeRegistry';
import { KnowledgeRetrievalService } from '../registry/KnowledgeRetrievalService';
import { KnowledgeContextBuilder } from '../context/KnowledgeContextBuilder';
import { ExecutiveKnowledge } from '../contracts/ExecutiveKnowledge';

describe('ReasoningKnowledgeIntegration', () => {
  it('should correctly build a KnowledgeContext uniting concepts, patterns, and benchmarks', () => {
    const registry = new ExecutiveKnowledgeRegistry();
    const retrieval = new KnowledgeRetrievalService(registry);
    const builder = new KnowledgeContextBuilder(retrieval);

    registry.registerKnowledge({
      id: 'k-pattern', type: 'PATTERN', domain: 'FINANCIAL', ontologyReferences: ['financial.liquidity.current_ratio'], title: 'Risk', description: '', content: {}, confidence: 0.9, maturity: 'VERIFIED', metadata: { version: '1', author: 'a', source: 's', createdAt: 'date' }
    });
    
    registry.registerKnowledge({
      id: 'k-bench', type: 'BENCHMARK', domain: 'FINANCIAL', ontologyReferences: ['financial.liquidity.current_ratio'], title: 'Standard', description: '', content: {}, confidence: 0.95, maturity: 'VERIFIED', metadata: { version: '1', author: 'a', source: 's', createdAt: 'date' }
    });

    const context = builder.buildForConcept('financial.liquidity.current_ratio');

    expect(context.ontologyConcepts).toContain('financial.liquidity.current_ratio');
    expect(context.patterns.length).toBe(1);
    expect(context.benchmarks.length).toBe(1);
    expect(context.rules.length).toBe(0);
    expect(context.confidence).toBeGreaterThan(0.9);
  });
});
