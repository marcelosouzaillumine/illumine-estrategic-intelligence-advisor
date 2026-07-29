export interface ActionResolverContext {
  readonly pageId: string;
}

export interface DecisionActionItem {
  readonly id: string;
  readonly label: string;
  readonly type: 'INVESTIGATE' | 'SIMULATE' | 'DECIDE';
}

export class ExecutiveActionResolver {
  public static resolveActions(ctx: ActionResolverContext): readonly DecisionActionItem[] {
    const pageId = ctx.pageId;

    if (pageId === 'DREPage') {
      return [
        { id: 'act-investigate-dre', label: '✨ Investigar Drivers de Custos', type: 'INVESTIGATE' },
        { id: 'act-simulate-dre', label: '✨ Simular Impacto Orçamentário', type: 'SIMULATE' },
        { id: 'act-decide-dre', label: '✨ Aprovar Plano de Otimização', type: 'DECIDE' }
      ];
    }

    if (pageId === 'BalanceSheetPage') {
      return [
        { id: 'act-investigate-bp', label: '✨ Investigar Risco de Liquidez', type: 'INVESTIGATE' },
        { id: 'act-simulate-bp', label: '✨ Simular Reestruturação de Dívida', type: 'SIMULATE' },
        { id: 'act-decide-bp', label: '✨ Homologar Estrutura Patrimonial', type: 'DECIDE' }
      ];
    }

    return [
      { id: 'act-investigate-gen', label: '✨ Analisar Diagnóstico Integrado', type: 'INVESTIGATE' },
      { id: 'act-simulate-gen', label: '✨ Simular Cenário Global', type: 'SIMULATE' },
      { id: 'act-decide-gen', label: '✨ Encaminhar ao Conselho', type: 'DECIDE' }
    ];
  }
}
