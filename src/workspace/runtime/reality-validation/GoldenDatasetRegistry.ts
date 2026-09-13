import { GoldenDatasetProfile } from './RealityValidationTypes';

export class GoldenDatasetRegistry {
  static getAll(): GoldenDatasetProfile[] {
    return [
      GoldenDatasetRegistry.industrialHoldingComplex(),
      GoldenDatasetRegistry.healthcareNetwork(),
      GoldenDatasetRegistry.advisorMultiTenant()
    ];
  }

  static getById(datasetId: string): GoldenDatasetProfile | undefined {
    return GoldenDatasetRegistry.getAll().find(d => d.datasetId === datasetId);
  }

  private static industrialHoldingComplex(): GoldenDatasetProfile {
    return {
      datasetId: 'GD-HOLDING-01',
      type: 'INDUSTRIAL_HOLDING',
      name: 'Grupo Meridional Industrial',
      description: 'Holding industrial com exportadora, distribuidora e imobiliária. EBITDA positivo, liquidez frágil, alta concentração bancária e covenant ativo.',
      complexityScore: 0.92,
      lineageHash: 'GD-LIN-HOLDING-7f3a2b1c',
      stressFactors: [
        'Covenant risco: DÍVIDA/EBITDA > 4.2x',
        'Hedge cambial com gap de 90 dias',
        'Supply chain pressionado: 40% importado USD',
        'CAPEX emergencial: R$ 12M não planejado',
        'Concentração bancária: 78% Banco A'
      ],
      governanceEvents: [
        'Early Warning: Liquidez em zona crítica',
        'Orchestration: Playbook de Contenção CAPEX ativado',
        'Workflow: Aprovação de pagamento extraordinário bloqueada'
      ],
      entities: [
        { entityId: 'E-HOLD', name: 'Holding Meridional S.A.', role: 'Holding', revenue: 180000000, ebitda: 22000000, netDebt: 91000000, liquidityPressure: 'HIGH' },
        { entityId: 'E-IND', name: 'Meridional Indústria Ltda', role: 'Indústria / Exportadora', revenue: 120000000, ebitda: 18000000, netDebt: 55000000, liquidityPressure: 'HIGH' },
        { entityId: 'E-DIST', name: 'Meridional Distribuição S.A.', role: 'Distribuidora', revenue: 45000000, ebitda: 3800000, netDebt: 12000000, liquidityPressure: 'MEDIUM' },
        { entityId: 'E-IMOB', name: 'Meridional Empreendimentos', role: 'Imobiliária', revenue: 15000000, ebitda: 4200000, netDebt: 24000000, liquidityPressure: 'CRITICAL' },
        { entityId: 'E-SS', name: 'Meridional Shared Services', role: 'Shared Services', revenue: 0, ebitda: -2800000, netDebt: 0, liquidityPressure: 'LOW' }
      ],
      intercompanyLinks: [
        { from: 'E-HOLD', to: 'E-IND', type: 'LOAN', value: 18000000 },
        { from: 'E-HOLD', to: 'E-IMOB', type: 'GUARANTEE', value: 24000000 },
        { from: 'E-IND', to: 'E-SS', type: 'SHARED_SERVICE', value: 2800000 },
        { from: 'E-HOLD', to: 'E-DIST', type: 'ROYALTY', value: 1500000 }
      ]
    };
  }

  private static healthcareNetwork(): GoldenDatasetProfile {
    return {
      datasetId: 'GD-HEALTH-01',
      type: 'HEALTHCARE_NETWORK',
      name: 'Rede Saúde Integrada',
      description: 'Rede hospitalar com SADT, convênios, centro cirúrgico e OPME. Glosas elevadas, passivo tributário ativo, descasamento operacional e pressão regulatória.',
      complexityScore: 0.88,
      lineageHash: 'GD-LIN-HEALTH-2d9e4f5a',
      stressFactors: [
        'Glosas: 14.2% da receita bruta em disputa',
        'Passivo tributário: R$ 8.5M em parcelamento REFIS',
        'Repasse médico: 61% da folha operacional',
        'Descasamento: Recebimento médio 47 dias / pagamento médio 28 dias',
        'OPME: 3 fornecedores com bloqueio judicial em andamento'
      ],
      governanceEvents: [
        'Early Warning: Fluxo operacional negativo por 3 meses consecutivos',
        'Orchestration: Playbook de Gestão de Glosas recomendado',
        'IOS: Deterioração sistêmica detectada no Institutional Pulse'
      ],
      entities: [
        { entityId: 'H-HOSP', name: 'Hospital Central S.A.', role: 'Hospital Principal', revenue: 95000000, ebitda: 8500000, netDebt: 32000000, liquidityPressure: 'CRITICAL' },
        { entityId: 'H-SADT', name: 'Diagnósticos Integrados', role: 'SADT', revenue: 22000000, ebitda: 4100000, netDebt: 6000000, liquidityPressure: 'HIGH' },
        { entityId: 'H-CC', name: 'Centro Cirúrgico Meridional', role: 'Centro Cirúrgico', revenue: 31000000, ebitda: 5200000, netDebt: 9000000, liquidityPressure: 'HIGH' }
      ],
      intercompanyLinks: [
        { from: 'H-HOSP', to: 'H-SADT', type: 'SHARED_SERVICE', value: 3200000 },
        { from: 'H-HOSP', to: 'H-CC', type: 'LOAN', value: 5000000 }
      ]
    };
  }

  private static advisorMultiTenant(): GoldenDatasetProfile {
    return {
      datasetId: 'GD-ADVISOR-01',
      type: 'ADVISOR_MULTI_TENANT',
      name: 'Network Advisor Premium',
      description: 'Advisor com 4 clientes simultâneos (2 holdings, 1 healthcare, 1 industrial). Crises simultâneas, tenant switching intenso e benchmarking sob pressão.',
      complexityScore: 0.95,
      lineageHash: 'GD-LIN-ADVISOR-9c1b3e7f',
      stressFactors: [
        'Crises simultâneas em 3 de 4 clientes ativos',
        'Tenant switching 22x por sessão de trabalho',
        'Benchmarking cross-sector sob demanda',
        'Workflows concorrentes em 4 entidades',
        'IOS load máximo: todos os domínios ativos'
      ],
      governanceEvents: [
        'Multi-tenant: Isolation check em cada troca de contexto',
        'Benchmarking: K-anonymity preservado sob carga',
        'IOS: 4 Institutional Pulses simultâneos, segregados'
      ],
      entities: [
        { entityId: 'A-C1', name: 'Cliente 1: Grupo Industrial Alpha', role: 'Holding Industrial', revenue: 210000000, ebitda: 31000000, netDebt: 102000000, liquidityPressure: 'HIGH' },
        { entityId: 'A-C2', name: 'Cliente 2: Rede Saúde Beta', role: 'Hospital Network', revenue: 88000000, ebitda: 6000000, netDebt: 29000000, liquidityPressure: 'CRITICAL' },
        { entityId: 'A-C3', name: 'Cliente 3: Holding Gamma', role: 'Holding Diversificada', revenue: 155000000, ebitda: 24000000, netDebt: 60000000, liquidityPressure: 'MEDIUM' },
        { entityId: 'A-C4', name: 'Cliente 4: Indústria Delta', role: 'Industrial', revenue: 72000000, ebitda: 9500000, netDebt: 21000000, liquidityPressure: 'LOW' }
      ],
      intercompanyLinks: []
    };
  }
}
