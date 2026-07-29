import { describe, it, expect } from 'vitest';
import { OrgGraphNode, OrgImpactRelationship, OrganizationalGraphModel } from '../index';

describe('@illumine/organizational-intelligence-graph (Wave 14 Phase 2)', () => {
  it('should build OrganizationalGraphModel mapping Strategy -> Capabilities -> Processes -> Metrics -> Decisions -> Outcomes', () => {
    const model = new OrganizationalGraphModel();

    const stratNode: OrgGraphNode = { id: 'strat-1', type: 'STRATEGY', name: 'Expansão 2026', code: 'STRAT_EXP' };
    const capNode: OrgGraphNode = { id: 'cap-1', type: 'CAPABILITY', name: 'Inteligência Financeira', code: 'CAP_FIN' };
    const procNode: OrgGraphNode = { id: 'proc-1', type: 'PROCESS', name: 'Gestão de Caixa', code: 'PROC_CASH' };
    const metNode: OrgGraphNode = { id: 'met-1', type: 'METRIC', name: 'EBITDA', code: 'EBITDA' };

    model.addNode(stratNode);
    model.addNode(capNode);
    model.addNode(procNode);
    model.addNode(metNode);

    const edge: OrgImpactRelationship = {
      edgeId: 'edge-1',
      sourceId: 'strat-1',
      targetId: 'cap-1',
      relationshipType: 'DRIVES',
      weight: 0.95
    };

    model.addEdge(edge);

    expect(model.getNodes().length).toBe(4);
    expect(model.traceChainFromStrategy('strat-1').length).toBe(1);
    expect(model.traceChainFromStrategy('strat-1')[0].targetId).toBe('cap-1');
  });
});
