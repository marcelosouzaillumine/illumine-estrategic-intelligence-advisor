import { ConsolidatedOrchestratorInput } from '../src/core/runtime/consolidated/consolidated-types';

export const topologyStressFixture: ConsolidatedOrchestratorInput = {
  groupId: 'STRESS-GRP-01',
  tenantContext: { tenantId: 'tenant-1', executionScope: 'CONSOLIDATION', entityScope: ['Holding', 'SubDependent', 'SubHealthy'], runtimeScope: 'MULTI_ENTITY', auditScope: 'test' },
  entities: [
    {
      entityId: 'Holding',
      tenantId: 'tenant-1',
      role: 'Holding',
      rawData: {
        isMockData: false,
        bpData: [
          { category: 'Caixa', type: 'ativo', value: 1000 },
          { category: 'Mútuo a Receber - SubDependent', type: 'ativo', value: 2000 }
        ],
        dreData: [
          { category: 'Receita Bruta', type: 'receita', value: 500 }
        ]
      }
    },
    {
      entityId: 'SubDependent',
      tenantId: 'tenant-1',
      role: 'Subsidiary',
      parentId: 'Holding',
      rawData: {
        isMockData: false,
        bpData: [
          { category: 'Caixa', type: 'ativo', value: 50 }, // Quase sem caixa
          { category: 'Mútuo a Pagar - Holding', type: 'passivo', value: 2000 },
          { category: 'Garantia - Holding', type: 'passivo', value: 5000 } // Shared Liability
        ],
        dreData: [
          { category: 'Receita Bruta', type: 'receita', value: 100 },
          { category: 'Custo', type: 'despesa', value: 500 } // Queima de caixa extrema
        ]
      }
    },
    {
      entityId: 'SubHealthy', // Sem ligação estrutural direta de dependência (sem mutuos com Holding)
      tenantId: 'tenant-1',
      role: 'Subsidiary',
      parentId: 'Holding',
      rawData: {
        isMockData: false,
        bpData: [
          { category: 'Caixa', type: 'ativo', value: 3000 }
        ],
        dreData: [
          { category: 'Receita Bruta', type: 'receita', value: 4000 },
          { category: 'Custo', type: 'despesa', value: 1000 }
        ]
      }
    }
  ]
};
