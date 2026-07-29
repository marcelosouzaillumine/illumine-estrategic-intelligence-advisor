export interface ActionLayerContext {
  readonly pageId: string;
  readonly activeAgentName?: string;
}

export interface ExecutiveActionView {
  readonly actionId: string;
  readonly label: string;
  readonly domain: 'Financial' | 'Risk' | 'Simulation' | 'Advisory';
  readonly agentId: string;
}

export class ExecutiveActionLayer {
  public static resolveActions(ctx: ActionLayerContext): readonly ExecutiveActionView[] {
    const pageId = ctx.pageId;

    if (pageId === 'DREPage') {
      return [
        { actionId: 'act-dre-1', label: '✨ Explicar Variação de Margem', domain: 'Financial', agentId: 'cfo-intelligence-agent' },
        { actionId: 'act-dre-2', label: '✨ Identificar Drivers de Despesa', domain: 'Financial', agentId: 'cfo-intelligence-agent' },
        { actionId: 'act-dre-3', label: '✨ Simular Impacto Orçamentário', domain: 'Simulation', agentId: 'simulation-agent' }
      ];
    }

    if (pageId === 'BalanceSheetPage') {
      return [
        { actionId: 'act-bp-1', label: '✨ Diagnosticar Risco de Liquidez', domain: 'Risk', agentId: 'risk-agent' },
        { actionId: 'act-bp-2', label: '✨ Simular Cenário de Passivos', domain: 'Simulation', agentId: 'simulation-agent' }
      ];
    }

    return [
      { actionId: 'act-gen-1', label: '✨ Solicitar Parecer do Conselho', domain: 'Advisory', agentId: 'advisory-council-agent' },
      { actionId: 'act-gen-2', label: '✨ Simular Cenário Global', domain: 'Simulation', agentId: 'simulation-agent' }
    ];
  }
}
