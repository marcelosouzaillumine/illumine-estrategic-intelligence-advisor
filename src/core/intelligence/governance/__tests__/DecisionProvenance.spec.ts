import { describe, it, expect } from 'vitest';
import { DecisionProvenanceEngine } from '../DecisionProvenanceEngine';

describe('DecisionProvenanceEngine', () => {
  it('should construct a full explainable AI trace', async () => {
    const engine = new DecisionProvenanceEngine();
    const session = { knowledgeVersion: '1.0', ontologyVersion: '1.0', runtimeVersion: '1.2.0' } as any;

    const trace = await engine.process(session, { evidence: 'some_evidence' });

    expect(trace).toBeInstanceOf(Array);
    expect(trace.length).toBeGreaterThan(0);
    
    const firstNode = trace[0];
    expect(firstNode.source).toBeDefined();
    expect(firstNode.evidence).toBeDefined();
    expect(firstNode.knowledgeUsed).toBeDefined();
    expect(firstNode.ruleApplied).toBeDefined();
    expect(firstNode.inference).toBeDefined();
    expect(firstNode.finding).toBeDefined();
    expect(firstNode.decision).toBeDefined();
  });
});
