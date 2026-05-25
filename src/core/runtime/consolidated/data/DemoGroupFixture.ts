import { ConsolidatedFinancialInput } from '../types';

/**
 * Fixture de Demonstração isolada.
 * NUNCA usar em ambiente de produção real.
 */
export const DEMO_GROUP_FIXTURE: ConsolidatedFinancialInput = {
  groupId: 'demo-holding-group',
  fiscalYear: '2026',
  entities: [
    { id: 'holding-1', name: 'Alpha Holding S.A', role: 'PARENT', ownershipPercentage: 100, consolidationMethod: 'FULL' },
    { id: 'sub-op-1', name: 'Alpha Operações BR', role: 'SUBSIDIARY', ownershipPercentage: 100, consolidationMethod: 'FULL' }
  ],
  consolidationScope: ['holding-1', 'sub-op-1'],
  confidenceByEntity: { 'holding-1': 'HIGH', 'sub-op-1': 'HIGH' },
  topologySnapshot: {
    groupId: 'demo-holding-group',
    nodes: [],
    edges: [],
    intercompanyOperations: [
      {
        operationId: 'mutuo-1',
        sourceEntityId: 'sub-op-1',
        targetEntityId: 'holding-1',
        type: 'MUTUO',
        amount: 1500000,
        sourceAccountCategory: 'Mútuo a Receber',
        targetAccountCategory: 'Mútuo a Pagar',
        reconciled: true
      }
    ]
  },
  bpByEntity: {
    'holding-1': [
      { accountId: 'h1', category: 'Ativo Circulante', value: 200000, type: 'ativo' },
      { accountId: 'h2', category: 'Passivo Circulante', value: 50000, type: 'passivo' },
      { accountId: 'h3', category: 'Mútuo a Pagar', value: 1500000, type: 'passivo' },
      { accountId: 'h4', category: 'Patrimônio Líquido', value: -1350000, type: 'pl' }
    ],
    'sub-op-1': [
      { accountId: 's1', category: 'Ativo Circulante', value: 3000000, type: 'ativo' },
      { accountId: 's2', category: 'Mútuo a Receber', value: 1500000, type: 'ativo' },
      { accountId: 's3', category: 'Passivo Circulante', value: 1000000, type: 'passivo' },
      { accountId: 's4', category: 'Patrimônio Líquido', value: 3500000, type: 'pl' }
    ]
  },
  dreByEntity: {
    'holding-1': [
      { accountId: 'd1', category: 'Receita Bruta', value: 0 },
      { accountId: 'd2', category: 'Despesas Administrativas', value: -150000 }
    ],
    'sub-op-1': [
      { accountId: 'd3', category: 'Receita Bruta', value: 8500000 },
      { accountId: 'd4', category: 'Custos Operacionais', value: -4000000 }
    ]
  },
  sourceMetadata: {
    dataSource: 'DEMO',
    extractedAt: new Date().toISOString()
  }
};
