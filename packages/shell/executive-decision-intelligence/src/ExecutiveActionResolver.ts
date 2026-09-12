import { ExecutiveDecisionContext } from '@illumine/executive-contracts';

export interface DecisionActionItem {
  readonly id: string;
  readonly label: string;
  readonly type: 'INVESTIGATE' | 'SIMULATE' | 'DECIDE';
}

export class ExecutiveActionResolver {
  public static resolveActions(ctx: Partial<ExecutiveDecisionContext> & { pageId?: string }): readonly DecisionActionItem[] {
    const metrics = ctx.executiveMetrics?.currentMetrics || {};
    const company = ctx.companyName || 'Empresa';
    const period = ctx.period || '2026';
    const companyId = ctx.companyId || 'comp-1';

    const ebitda = metrics.EBITDA || metrics.ebitda || 620000;
    const revenue = metrics.ReceitaBruta || metrics.revenue || 8450000;
    const margin = revenue > 0 ? (ebitda / revenue) * 100 : 7.3;

    if (margin < 10.0) {
      return [
        { id: `act-inv-${companyId}`, label: `✨ Investigar Drivers de Custos (${company})`, type: 'INVESTIGATE' },
        { id: `act-sim-${companyId}`, label: `✨ Simular Recuperação de Margem (${period})`, type: 'SIMULATE' },
        { id: `act-dec-${companyId}`, label: `✨ Aprovar Plano de Otimização Fixa`, type: 'DECIDE' }
      ];
    }

    return [
      { id: `act-inv-gen-${companyId}`, label: `✨ Analisar Diagnóstico Integrado (${company})`, type: 'INVESTIGATE' },
      { id: `act-sim-gen-${companyId}`, label: `✨ Simular Cenário de Crescimento ${period}`, type: 'SIMULATE' },
      { id: `act-dec-gen-${companyId}`, label: `✨ Homologar Diretrizes de Conselho`, type: 'DECIDE' }
    ];
  }
}
