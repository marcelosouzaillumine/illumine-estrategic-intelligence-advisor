export interface NormalizedDREValue {
  value: number;
  source: string;
}

export interface NormalizedDREPayload {
  grossRevenue: NormalizedDREValue;
  netRevenue: NormalizedDREValue;
  deductions: NormalizedDREValue;
  cogs: NormalizedDREValue;
  grossProfit: NormalizedDREValue;
  grossMargin: NormalizedDREValue;
  adminExpenses: NormalizedDREValue;
  ebitda: NormalizedDREValue;
  ebitdaMargin: NormalizedDREValue;
  financialResult: NormalizedDREValue;
  otherOperatingIncome: NormalizedDREValue;
  netProfit: NormalizedDREValue;
  netMargin: NormalizedDREValue;
  breakEvenRevenue: NormalizedDREValue;
  breakEvenGap: NormalizedDREValue;
  breakEvenCoverage: NormalizedDREValue;
}

export class DREExecutiveDataMapper {
  private static findValue(payload: any, aliases: string[]): NormalizedDREValue {
    if (!payload || typeof payload !== 'object') return { value: 0, source: 'MISSING_PAYLOAD' };
    
    // Flatten possible payload structures to search
    const searchContext = { ...payload, ...(payload.financialMetrics || {}), ...(payload.calculatedMetrics || {}) };
    
    for (const alias of aliases) {
      if (searchContext[alias] !== undefined && searchContext[alias] !== null && !Number.isNaN(searchContext[alias])) {
        const sourceStr = payload.financialMetrics && payload.financialMetrics[alias] !== undefined ? `financialMetrics.${alias}` : 
                          payload.calculatedMetrics && payload.calculatedMetrics[alias] !== undefined ? `calculatedMetrics.${alias}` : 
                          `payload.${alias}`;
        return { value: Number(searchContext[alias]), source: sourceStr };
      }
    }
    
    return { value: 0, source: `NOT_FOUND[${aliases.join(',')}]` };
  }

  public static map(payload: any): NormalizedDREPayload {
    const grossRevenue = this.findValue(payload, ['grossRevenue', 'receitaBruta', 'faturamentoBruto']);
    const netRevenue = this.findValue(payload, ['netRevenue', 'receitaLiquida', 'financial.netRevenue']);
    const deductions = this.findValue(payload, ['deductions', 'deducoes', 'impostosVenda']);
    const cogs = this.findValue(payload, ['cogs', 'cmv', 'costOfGoodsSold', 'financial.cogs']);
    const grossProfit = this.findValue(payload, ['grossProfit', 'lucroBruto', 'resultadoBruto']);
    const adminExpenses = this.findValue(payload, ['adminExpenses', 'fixedExpenses', 'despesasAdministrativas', 'financial.adminExpenses', 'despesasFixas', 'despesasOperacionais']);
    const ebitda = this.findValue(payload, ['ebitda', 'financial.ebitda']);
    const financialResult = this.findValue(payload, ['financialResult', 'resultadoFinanceiro', 'despesasFinanceiras']);
    const otherOperatingIncome = this.findValue(payload, ['otherOperatingIncome', 'outrasReceitas', 'outrasDespesas']);
    const netProfit = this.findValue(payload, ['netProfit', 'lucroLiquido', 'financial.netProfit']);

    // Calcular margens se faltarem, senão usar do payload
    let grossMargin = this.findValue(payload, ['grossMargin', 'margemBruta', 'indiceMargemContrib']);
    if (grossMargin.value === 0 && grossMargin.source.startsWith('NOT_FOUND') && netRevenue.value > 0) {
      grossMargin = { value: grossProfit.value / netRevenue.value, source: 'CALCULATED_FROM_PROFIT_REVENUE' };
    }

    let ebitdaMargin = this.findValue(payload, ['ebitdaMargin', 'margemEbitda']);
    if (ebitdaMargin.value === 0 && ebitdaMargin.source.startsWith('NOT_FOUND') && netRevenue.value > 0) {
      ebitdaMargin = { value: ebitda.value / netRevenue.value, source: 'CALCULATED_FROM_EBITDA_REVENUE' };
    }

    let netMargin = this.findValue(payload, ['netMargin', 'margemLiquida']);
    if (netMargin.value === 0 && netMargin.source.startsWith('NOT_FOUND') && netRevenue.value > 0) {
      netMargin = { value: netProfit.value / netRevenue.value, source: 'CALCULATED_FROM_NETPROFIT_REVENUE' };
    }

    let breakEvenRevenue = this.findValue(payload, ['breakEvenRevenue', 'pontoEquilibrio']);
    if (breakEvenRevenue.value === 0 && breakEvenRevenue.source.startsWith('NOT_FOUND') && grossMargin.value > 0) {
        breakEvenRevenue = { value: Math.abs(adminExpenses.value) / grossMargin.value, source: 'CALCULATED_FROM_ADMIN_AND_MARGIN' };
    }

    let breakEvenGap = this.findValue(payload, ['breakEvenGap', 'gapEquilibrio', 'gapParaEquilibrio']);
    if (breakEvenGap.value === 0 && breakEvenGap.source.startsWith('NOT_FOUND')) {
      const gap = Math.max(breakEvenRevenue.value - netRevenue.value, 0);
      breakEvenGap = { value: gap, source: 'CALCULATED_MAX_BREAKEVEN_NETREVENUE' };
    }

    let breakEvenCoverage = this.findValue(payload, ['breakEvenCoverage', 'coberturaOperacional', 'indiceCoberturaOperacional']);
    if (breakEvenCoverage.value === 0 && breakEvenCoverage.source.startsWith('NOT_FOUND') && breakEvenRevenue.value > 0) {
        breakEvenCoverage = { value: netRevenue.value / breakEvenRevenue.value, source: 'CALCULATED_NETREVENUE_DIV_BREAKEVEN' };
    }

    return {
      grossRevenue,
      netRevenue,
      deductions,
      cogs,
      grossProfit,
      grossMargin,
      adminExpenses,
      ebitda,
      ebitdaMargin,
      financialResult,
      otherOperatingIncome,
      netProfit,
      netMargin,
      breakEvenRevenue,
      breakEvenGap,
      breakEvenCoverage
    };
  }
}
