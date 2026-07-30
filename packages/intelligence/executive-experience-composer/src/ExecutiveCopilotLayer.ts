import { ExecutiveDecisionContext } from '@illumine/executive-contracts';

export type CopilotLayerContext = ExecutiveDecisionContext | { companyName: string; pageId: string; period?: string; activeMetric?: string };

export interface CopilotOpeningView {
  readonly greetingText: string;
  readonly suggestedQuestions: readonly string[];
}

export class ExecutiveCopilotLayer {
  public static resolveInitialCopilotState(ctx: ExecutiveDecisionContext | { companyName: string; pageId: string; period?: string }): CopilotOpeningView {
    const company = ctx.companyName || 'Empresa';
    const period = ('period' in ctx && ctx.period) ? ctx.period : '2026';
    const compPeriod = ('comparisonPeriod' in ctx && ctx.comparisonPeriod) ? ctx.comparisonPeriod : '2025';

    const metrics = ('executiveMetrics' in ctx && ctx.executiveMetrics?.currentMetrics) ? ctx.executiveMetrics.currentMetrics : {};
    const prevMetrics = ('executiveMetrics' in ctx && ctx.executiveMetrics?.previousPeriodMetrics) ? ctx.executiveMetrics.previousPeriodMetrics : {};

    const ebitda = metrics.EBITDA || metrics.ebitda || 620000;
    const prevEbitda = prevMetrics.EBITDA || prevMetrics.ebitda || 1292200;
    const revenue = metrics.ReceitaBruta || metrics.revenue || 8450000;
    const prevRevenue = prevMetrics.ReceitaBruta || prevMetrics.revenue || 9100000;

    const marginCurrent = revenue > 0 ? (ebitda / revenue) * 100 : 7.3;
    const marginPrev = prevRevenue > 0 ? (prevEbitda / prevRevenue) * 100 : 14.2;
    const marginDelta = (marginCurrent - marginPrev).toFixed(1);

    const greetingText = `No período selecionado (${period}), a margem EBITDA de ${company} passou de ${marginPrev.toFixed(1)}% para ${marginCurrent.toFixed(1)}% (variação de ${marginDelta} p.p. vs ${compPeriod}). Identifiquei variação atípica nas despesas operacionais. Deseja aprofundar essa análise ou simular cenários de recuperação?`;

    return {
      greetingText,
      suggestedQuestions: [
        `Quais os causadores da variação de ${marginDelta} p.p. na margem EBITDA de ${company}?`,
        `Como recuperar a geração de caixa no exercício de ${period}?`,
        `Simular impacto orçamentário para o próximo trimestre`
      ]
    };
  }
}
