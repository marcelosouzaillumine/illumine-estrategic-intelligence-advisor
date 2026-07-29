export interface Capability {
  id: string;
  name: string;
  domain: string;
}

export interface Risk {
  id: string;
  category: 'OPERATIONAL' | 'FINANCIAL' | 'STRATEGIC';
  severity: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
}

export interface Process {
  id: string;
  name: string;
  bottlenecksCount: number;
}

export interface ExecutiveDigitalTwin {
  organizationId: string;
  structure: {
    unitsCount: number;
    departmentsCount: number;
  };
  capabilities: Capability[];
  risks: Risk[];
  processes: Process[];
  maturityScore: number;
}

export class DigitalTwinEngine {
  public static generateTwin(organizationId: string): ExecutiveDigitalTwin {
    return {
      organizationId,
      structure: { unitsCount: 4, departmentsCount: 12 },
      capabilities: [{ id: 'cap-treasury', name: 'Gestão de Tesouraria Corporativa', domain: 'Finance' }],
      risks: [{ id: 'risk-liquidity', category: 'FINANCIAL', severity: 'MEDIUM' }],
      processes: [{ id: 'proc-mutuo', name: 'Aprovação de Mútuos Intercompany', bottlenecksCount: 0 }],
      maturityScore: 94.5
    };
  }
}
