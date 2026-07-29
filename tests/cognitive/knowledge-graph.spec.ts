import { entityGraph, BusinessEntity } from '../../packages/knowledge/src/index';

export function testKnowledgeGraph(): boolean {
  const entity: BusinessEntity = {
    id: 'ent-treasury',
    type: 'CAPABILITY',
    attributes: { domain: 'Finance' },
    relationships: [],
    knowledgeNode: { id: 'kn-1', domain: 'FinancialGovernance', confidence: 0.98, source: 'ERP_Connector' }
  };

  entityGraph.addEntity(entity);
  const retrieved = entityGraph.getEntity('ent-treasury');

  if (!retrieved || retrieved.knowledgeNode.confidence !== 0.98) {
    throw new Error('Falha no teste do Grafo de Conhecimento DKE');
  }

  return true;
}
