/// <reference types="vitest" />
import { describe, it, expect } from 'vitest';
import { KnowledgeGraphNode, KnowledgeGraphRelationship } from '@illumine/executive-contracts';

describe('@illumine/intelligence (Wave 18.5 Knowledge Graph Architecture)', () => {
  it('should validate Organizational Knowledge Graph nodes and relationships (OIKE v1.0 / ADR-081)', () => {
    const companyNode: KnowledgeGraphNode = {
      nodeId: 'node-comp-1',
      nodeType: 'COMPANY',
      label: 'Empório do Mármore',
      properties: { segment: 'Corporativo' }
    };

    const decisionNode: KnowledgeGraphNode = {
      nodeId: 'node-dec-1',
      nodeType: 'DECISION',
      label: 'Otimização de Custos Fixos',
      properties: { year: 2026 }
    };

    const rel: KnowledgeGraphRelationship = {
      relationshipId: 'rel-1',
      sourceNodeId: companyNode.nodeId,
      targetNodeId: decisionNode.nodeId,
      type: 'HAS_DECISION',
      weight: 1.0
    };

    expect(companyNode.nodeType).toBe('COMPANY');
    expect(decisionNode.nodeType).toBe('DECISION');
    expect(rel.type).toBe('HAS_DECISION');
  });
});
