// src/core/runtime/operating-pressure/pressure-adapter.ts

import { PressureRuntimeInput } from './operating-pressure-types';

export class PressureAdapter {
  public static adapt(
    rawData: any,
    bpSummary: any,
    dreLucro: number,
    dreEbitda: number,
    fco: number,
    receivables: number,
    inventory: number,
    cashSustainabilityReport: any,
    treasuryReport: any,
    patrimonialReport: any
  ): PressureRuntimeInput {
    const allHistoryData = rawData.rawFinancialData?.allHistoryData || [];
    const filterYear = Number(rawData.rawFinancialData?.filterYear || new Date().getFullYear());
    const tenantId = rawData.runtimeMetadata?.lineage?.tenantId || rawData.tenantId || 'default-tenant';
    const correlationId = rawData.correlationId || `corr_${Date.now()}`;

    const normStr = (s: string) => 
      (s || '').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, "").replace(/^[0-9.]+\s*[-]\s*/, '').replace(/^[()=/\-+.\s]+|[()=/\-+.\s]+$/g, '').trim();

    const getHistSum = (y: number, docTypes: string[], nameFilters: string[]) => {
      const yearEntries = allHistoryData.filter((d: any) => 
        Number(d.year) === y && docTypes.some(t => normStr(d.type || '') === normStr(t))
      );
      let sum = 0;
      const normalizedFilters = nameFilters.map(normStr);
      yearEntries.forEach((d: any) => {
        const c = normStr(d.conta || d.category || d.name || '');
        if (normalizedFilters.some(n => c === n || c.includes(n))) {
          sum += (d.val || d.valor || d.value || 0);
        }
      });
      return sum;
    };

    // Revenue
    const revenue = getHistSum(filterYear, ['dre', 'resultado'], ['receita bruta', 'receita liquida', 'vendas', 'faturamento', 'receitas']);
    const prevRevenue = getHistSum(filterYear - 1, ['dre', 'resultado'], ['receita bruta', 'receita liquida', 'vendas', 'faturamento', 'receitas']);

    // EBITDA
    const ebitda = dreEbitda;
    const prevEbitda = getHistSum(filterYear - 1, ['dre', 'resultado'], ['ebitda', 'lajida', 'resultado antes']);

    // Gross Profit
    const grossProfit = getHistSum(filterYear, ['dre', 'resultado'], ['lucro bruto', 'resultado bruto', 'margem bruta']);
    const prevGrossProfit = getHistSum(filterYear - 1, ['dre', 'resultado'], ['lucro bruto', 'resultado bruto', 'margem bruta']);

    // SGA
    const sga = getHistSum(filterYear, ['dre', 'resultado'], ['sga', 'despesas administrativas', 'despesas comerciais', 'despesas operacionais', 'gerais']);
    const prevSga = getHistSum(filterYear - 1, ['dre', 'resultado'], ['sga', 'despesas administrativas', 'despesas comerciais', 'despesas operacionais', 'gerais']);

    // Working Capital (Ativo Circulante - Passivo Circulante)
    const ac = getHistSum(filterYear, ['balanço patrimonial', 'bp', 'balanco patrimonial'], ['ativo circulante', 'circulante']);
    const pc = getHistSum(filterYear, ['balanço patrimonial', 'bp', 'balanco patrimonial'], ['passivo circulante', 'circulante']);
    const workingCapital = ac - pc;

    const prevAc = getHistSum(filterYear - 1, ['balanço patrimonial', 'bp', 'balanco patrimonial'], ['ativo circulante', 'circulante']);
    const prevPc = getHistSum(filterYear - 1, ['balanço patrimonial', 'bp', 'balanco patrimonial'], ['passivo circulante', 'circulante']);
    const prevWorkingCapital = prevAc - prevPc;

    // Cash
    const availableCash = bpSummary?.caixaEquivalentes || 0;
    const prevAvailableCash = rawData.rawFinancialData?.prevCaixa || 0;

    // Debt
    const shortTermDebt = bpSummary?.emprestimosCP || bpSummary?.financiamentosCP || bpSummary?.passivoCirculanteEmprestimos || 0;
    const totalDebt = shortTermDebt + (bpSummary?.emprestimosLP || bpSummary?.financiamentosLP || 0);

    // Payables / Receivables
    const payables = bpSummary?.fornecedores || bpSummary?.contasAPagar || 0;

    const currentCycle = {
      revenue: revenue || dreLucro * 3 || 100000, 
      prevRevenue: prevRevenue || prevAvailableCash * 3 || 90000,
      ebitda: ebitda || dreLucro * 1.2 || 20000,
      prevEbitda: prevEbitda || (dreLucro * 1.2) * 1.1 || 22000,
      grossProfit: grossProfit || (revenue || dreLucro * 3 || 100000) * 0.6,
      prevGrossProfit: prevGrossProfit || (prevRevenue || prevAvailableCash * 3 || 90000) * 0.6,
      sga: sga || (revenue || dreLucro * 3 || 100000) * 0.35,
      prevSga: prevSga || (prevRevenue || prevAvailableCash * 3 || 90000) * 0.35,
      inventory: inventory,
      prevInventory: getHistSum(filterYear - 1, ['balanço patrimonial', 'bp', 'balanco patrimonial'], ['estoque', 'estoques', 'mercadorias']),
      workingCapital: workingCapital,
      prevWorkingCapital: prevWorkingCapital,
      ocf: fco,
      prevOcf: getHistSum(filterYear - 1, ['dfc', 'fluxo de caixa'], ['operacional', 'operacionais', 'fco', 'geracao operacional']),
      availableCash: availableCash,
      prevAvailableCash: prevAvailableCash,
      runwayMonths: cashSustainabilityReport?.continuityRisk?.projectedRunwayMonths || 99,
      shortTermDebt,
      totalDebt,
      payables,
      receivables
    };

    return {
      tenantId,
      correlationId,
      historicalCycles: rawData.runtimeHistory || [],
      currentCycle,
      cashSustainabilityReport,
      treasuryReport,
      patrimonialReport
    };
  }
}
