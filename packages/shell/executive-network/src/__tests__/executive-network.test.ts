import { describe, it, expect } from 'vitest';
import { ExecutiveNode, AdvisorNetwork } from '../index';

describe('@illumine/executive-network (Wave 14 Phase 5)', () => {
  it('should register and retrieve nodes in AdvisorNetwork by role', () => {
    const net = new AdvisorNetwork();

    const ceo: ExecutiveNode = {
      nodeId: 'exec-ceo-1',
      role: 'CEO',
      name: 'Marcelo Souza',
      capabilitiesAssigned: ['executive-advisor']
    };

    const boardMember: ExecutiveNode = {
      nodeId: 'exec-board-1',
      role: 'BOARD',
      name: 'Conselheiro Titular',
      capabilitiesAssigned: ['governance-governance']
    };

    net.registerNode(ceo);
    net.registerNode(boardMember);

    expect(net.getNodesByRole('CEO').length).toBe(1);
    expect(net.getNodesByRole('BOARD').length).toBe(1);
    expect(net.getNode('exec-ceo-1')?.name).toBe('Marcelo Souza');
  });
});
