import { ConsolidatedOrchestratorInput } from '../src/core/runtime/consolidated/consolidated-types';

export const topologyStressFixture: ConsolidatedOrchestratorInput = {
  groupId: 'STRESS-GRP-01',
  entities: [
    {
      entityId: 'Holding',
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
