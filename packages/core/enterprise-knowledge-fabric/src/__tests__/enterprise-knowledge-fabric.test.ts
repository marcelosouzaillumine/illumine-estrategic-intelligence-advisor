import { describe, it, expect } from 'vitest';
import { EnterpriseContext, EnterpriseKnowledgeNode, EnterpriseKnowledgeRegistry } from '../index';

describe('@illumine/enterprise-knowledge-fabric (Wave 14 Phase 1)', () => {
  it('should register and retrieve EnterpriseKnowledgeNode via EnterpriseKnowledgeRegistry', () => {
    const registry = new EnterpriseKnowledgeRegistry();

    const node: EnterpriseKnowledgeNode = {
      nodeId: 'node-corp-01',
      entityType: 'ORGANIZATION',
      name: 'Illumine OS Holding',
      domainCode: 'GOVERNANCE',
      attributes: { country: 'Brazil' }
    };

    registry.register(node);

    const fetched = registry.getById('node-corp-01');
    expect(fetched).toBeDefined();
    expect(fetched?.name).toBe('Illumine OS Holding');
    expect(fetched?.domainCode).toBe('GOVERNANCE');
  });
});
