export const topologyIntercompanyFixture = {
  groupId: 'GRP-PHASE3',
  tenantContext: { tenantId: 'tenant-1', executionScope: 'CONSOLIDATION', entityScope: ['Holding', 'Sub-A', 'Sub-B'], runtimeScope: 'MULTI_ENTITY', auditScope: 'test' },
  entities: [
    {
      entityId: 'Holding',
      role: 'Holding' as const,
      rawData: {
        tenantId: 'tenant-1',
        isMockData: false,
        bpData: [
          { category: 'Caixa', type: 'ativo', value: 1000 },
          { category: 'Mútuo a Receber - Sub-A', type: 'ativo', value: 500 }
        ],
        dreData: [
          { category: 'Receita de Serviços', type: 'receita', value: 2000 },
          { category: 'Taxa de Franquia - Sub-A', type: 'receita', value: 100 }
        ]
      }
    },
    {
      entityId: 'Sub-A',
      role: 'Subsidiary' as const,
      parentId: 'Holding',
      rawData: {
        tenantId: 'tenant-1',
        isMockData: false,
        bpData: [
          { category: 'Caixa', type: 'ativo', value: 300 },
          { category: 'Mútuo a Pagar - Holding', type: 'passivo', value: 500 }
        ],
        dreData: [
          { category: 'Receita de Serviços', type: 'receita', value: 800 },
          { category: 'Despesa Franquia - Holding', type: 'despesa', value: 100 }
        ]
      }
    },
    {
      entityId: 'Sub-B',
      role: 'Subsidiary' as const,
      parentId: 'Holding',
      rawData: {
        tenantId: 'tenant-1',
        isMockData: false,
        bpData: [
          { category: 'Caixa', type: 'ativo', value: 400 },
          { category: 'Mútuo a Pagar - Holding', type: 'passivo', value: 200 } // Intentional mismatch or unreconciled
        ],
        dreData: [
          { category: 'Receita de Serviços', type: 'receita', value: 600 }
        ]
      }
    }
  ]
};
