import { describe, it, expect } from 'vitest';
import { OntologicalGraphNode, CausalRelationship, CausalGraphModel, ContextualInferenceEngine } from '../index';

describe('@illumine/knowledge-graph (Phase 2 Knowledge Graph)', () => {
  it('should construct CausalGraphModel with ontology nodes and causal edges', () => {
    const model = new CausalGraphModel();

    const nodeA: OntologicalGraphNode = {
      id: 'metric-ebitda',
      type: 'METRIC',
      version: '1.0.0',
      label: 'EBITDA Operacional',
      description: 'Lucro operacional',
      createdAt: '2026-07-28T00:00:00Z',
      domainCategory: 'FINANCE',
      properties: {}
    };

    const nodeB: OntologicalGraphNode = {
      id: 'metric-liquidity',
      type: 'METRIC',
      version: '1.0.0',
      label: 'Liquidez Corrente',
      description: 'Capacidade de pagamento',
      createdAt: '2026-07-28T00:00:00Z',
      domainCategory: 'FINANCE',
      properties: {}
    };

    model.addNode(nodeA);
    model.addNode(nodeB);

    const edge: CausalRelationship = {
      relationshipId: 'edge-ebitda-liquidity',
      sourceNodeId: 'metric-ebitda',
      targetNodeId: 'metric-liquidity',
      impactWeight: 0.85,
      causalDirection: 'DIRECT',
      confidence: 0.92
    };

    model.addCausalEdge(edge);

    expect(model.getNodes().length).toBe(2);
    expect(model.getDownstreamImpacts('metric-ebitda').length).toBe(1);
    expect(model.getDownstreamImpacts('metric-ebitda')[0].targetNodeId).toBe('metric-liquidity');
  });

  it('should evaluate ReasoningTrace via ContextualInferenceEngine', () => {
    const model = new CausalGraphModel();
    const edge: CausalRelationship = {
      relationshipId: 'edge-1',
      sourceNodeId: 'node-x',
      targetNodeId: 'node-y',
      impactWeight: 0.9,
      causalDirection: 'DIRECT',
      confidence: 0.95
    };
    model.addCausalEdge(edge);

    const trace = ContextualInferenceEngine.evaluateCausalChain(model, 'node-x');
    expect(trace.steps.length).toBe(1);
    expect(trace.steps[0].confidence).toBe(0.95);
  });
});
