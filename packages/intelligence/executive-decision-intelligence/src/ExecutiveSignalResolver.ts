export interface SignalResolverContext {
  readonly pageId: string;
  readonly financialData?: Record<string, number>;
}

export interface ExecutiveSignalView {
  readonly signalTitle: string;
  readonly severity: 'CRITICAL' | 'WARNING' | 'OPPORTUNITY' | 'STABLE';
  readonly metricValue?: string;
  readonly deltaDescription?: string;
}

export class ExecutiveSignalResolver {
  public static resolveSignal(ctx: SignalResolverContext): ExecutiveSignalView {
    const pageId = ctx.pageId;

    if (pageId === 'DREPage') {
      return {
        signalTitle: 'Margem EBITDA reduziu 4,2 p.p. no exercício analisado',
        severity: 'WARNING',
        deltaDescription: 'Aumento não planejado de despesas operacionais e comerciais.'
      };
    }

    if (pageId === 'BalanceSheetPage') {
      return {
        signalTitle: 'Liquidez imediata sob pressão de obrigações de curto prazo',
        severity: 'CRITICAL',
        deltaDescription: 'Necessidade de recomposição de capital de giro e alongamento de dívida.'
      };
    }

    if (pageId === 'DFCPage') {
      return {
        signalTitle: 'Geração operacional de caixa (FCO) 12% abaixo da meta',
        severity: 'WARNING',
        deltaDescription: 'Retenção temporária no ciclo de recebíveis comerciais.'
      };
    }

    return {
      signalTitle: 'Estrutura de capital e alinhamento de governança fiduciária estáveis',
      severity: 'STABLE',
      deltaDescription: 'Pontuação sintética EFOS mantida dentro dos padrões de conselho.'
    };
  }
}
