import { NormalizedDREPayload, DREExecutiveDataMapper } from './DREExecutiveDataMapper';
import { DreHistoricalIntegrityGuard } from './DreHistoricalIntegrityGuard';
import { calculateDreCascade } from '../../../lib/dreCascade';

export interface DreExecutiveFacts {
  grossRevenue: number;
  deductions: number;
  netRevenue: number;
  grossProfit: number;
  grossMargin: number;
  cogs: number;
  contributionMarginValue: number;
  contributionMarginRate: number;
  fixedExpenses: number;
  ebitda: number;
  ebitdaMargin: number;
  ebit: number;
  ebitMargin: number;
  netIncome: number;
  netMargin: number;
  breakEvenRevenue: number;
  breakEvenCoverage: number;
  breakEvenDistance: number;
  safetyMargin: number;
  
  revenueGrowth: number;
  ebitdaGrowth: number;
  netIncomeGrowth: number;

  operatingResultQuality: number;
  extraordinaryResultShare: number;
  fixedCostAbsorption: number;
  operatingLeverageRisk: number;

  hasMeaningfulHistory: boolean;
  historyMessage: string | null;

  rawPayload?: any;
}

export class DreExecutiveFactsBuilder {
  private readonly rawPayload: any;
  private readonly historicalPayloads: any[];

  constructor(rawPayload: any, historicalPayloads: any[] = []) {
    this.rawPayload = rawPayload;
    this.historicalPayloads = historicalPayloads;
  }

  public build(): DreExecutiveFacts {
    let payload = this.rawPayload || {};
    
    // Suporte para o novo formato de injeção direta do DREPage
    if (payload.dreData && Array.isArray(payload.dreData)) {
      payload.cascadeResult = calculateDreCascade(payload.dreData);
    }
    
    const getCascadeVal = (id: string) => {
      if (!payload.cascadeResult || !Array.isArray(payload.cascadeResult)) return 0;
      const match = payload.cascadeResult.find((r: any) => r.id === id);
      return match ? (match.computedValue !== undefined ? match.computedValue : match.value || match.val || 0) : 0;
    };

    // Extratores principais
    let grossRevenue = payload.receitaBruta || 0;
    let deductions = payload.deducoesReceita || 0;
    let netRevenue = payload.recLiquida || 0;
    let cogs = Math.abs(payload.custosVar || 0); 
    let fixedExpenses = Math.abs(payload.despesasFixas || 0);
    let ebitda = payload.ebitda || 0;
    let ebit = payload.ebit || 0;
    let grossProfit = payload.lucroBruto || payload.resultadoBruto || 0;
    let netIncome = payload.lucroLiq || 0;

    // SSOT Rule: Sempre que tivermos cascadeResult, ele sobrescreve como fonte de verdade primária
    if (payload.cascadeResult && Array.isArray(payload.cascadeResult) && payload.cascadeResult.length > 0) {
      grossRevenue = getCascadeVal('ROB') || grossRevenue;
      deductions = -Math.abs(getCascadeVal('DED') || deductions);
      netRevenue = getCascadeVal('ROL') || netRevenue;
      cogs = Math.abs(getCascadeVal('CUSTOS') || cogs);
      grossProfit = getCascadeVal('LUCRO_BRUTO') || grossProfit;
      fixedExpenses = Math.abs(getCascadeVal('DESP_OPER') || fixedExpenses);
      ebitda = getCascadeVal('EBITDA') || ebitda;
      ebit = getCascadeVal('EBIT') || ebit;
      netIncome = getCascadeVal('LUCRO_LIQ') || netIncome;
    }
    
    const contributionMarginValue = payload.margemContrib || (netRevenue > 0 && cogs > 0 ? (netRevenue - cogs) : 0);
    const contributionMarginRate = netRevenue > 0 ? (contributionMarginValue / netRevenue) : 0;

    const ebitdaMargin = netRevenue > 0 ? (ebitda / netRevenue) : 0;
    const ebitMargin = netRevenue > 0 ? (ebit / netRevenue) : 0;
    
    // Fallbacks para caso cascadeResult não tenha gerado Lucro Bruto explicitamente
    grossProfit = grossProfit !== 0 ? grossProfit : (netRevenue - cogs);
    const grossMargin = netRevenue > 0 ? (grossProfit / netRevenue) : 0;
    
    // Tratamento de segurança: Se Margem de Contribuição e Margem Bruta forem idênticos (fórmula legada), assume valor consolidado.
    const finalContributionMarginValue = contributionMarginValue;
    const finalContributionMarginRate = contributionMarginRate;

    const netMargin = netRevenue > 0 ? (netIncome / netRevenue) : 0;

    const breakEvenRevenue = payload.pontoEquilibrio || (contributionMarginRate > 0 ? (fixedExpenses / contributionMarginRate) : 0);
    const breakEvenDistance = netRevenue - breakEvenRevenue;
    const safetyMargin = netRevenue > 0 ? (breakEvenDistance / netRevenue) : 0;
    const breakEvenCoverage = breakEvenRevenue > 0 
      ? (netRevenue / breakEvenRevenue) 
      : (fixedExpenses === 0 && netRevenue > 0 ? 1.0 : 0);

    // Advanced Metrics
    // Qualidade do Resultado: % do EBITDA que se converte em Lucro Líquido
    const operatingResultQuality = ebitda > 0 ? (netIncome / ebitda) : 0;
    
    // Participação de Resultados Extraordinários (se houver) - estimativa via financialResult e otherOperatingIncome
    const extrResult = 0; // Removido mapeamento estrito do Firebase para não quebrar a UI
    const extraordinaryResultShare = netIncome !== 0 ? (extrResult / Math.abs(netIncome)) : 0;
    
    // Absorção de custo fixo: Receita / Custo Fixo
    const fixedCostAbsorption = fixedExpenses > 0 ? (netRevenue / fixedExpenses) : 0;
    
    // Risco de alavancagem operacional: % de custo fixo em relação à receita
    const operatingLeverageRisk = netRevenue > 0 ? (fixedExpenses / netRevenue) : 0;

    // Histórico
    let revenueGrowth = 0;
    let ebitdaGrowth = 0;
    let netIncomeGrowth = 0;
    let hasMeaningfulHistory = false;
    let historyMessage: string | null = "Análise longitudinal limitada pela quantidade de exercícios comparáveis.";

    // Se já vem o trendNote direto no payload atual, tentaremos usá-lo se não tiver array histórico
    if (this.rawPayload && this.rawPayload.trendNote && (!this.historicalPayloads || this.historicalPayloads.length === 0)) {
        // Como o trendNote não expõe as bases do passado facilmente, só pegamos o valor e assumimos válido se for numérico razoável.
        // O contexto ideal seria ter a historicalSeries e recalcular usando a Guard, mas para compatibilidade fallback:
        const tRev = this.rawPayload.trendNote.receita !== undefined ? this.rawPayload.trendNote.receita / 100 : 0;
        const tEbitda = this.rawPayload.trendNote.ebitda !== undefined ? this.rawPayload.trendNote.ebitda / 100 : 0;
        const tLucro = this.rawPayload.trendNote.lucro !== undefined ? this.rawPayload.trendNote.lucro / 100 : 0;
        
        // Se a guard rejeitar a variação por ser extrema
        if (tEbitda > 10.0 || tEbitda < -1.0) {
            historyMessage = "Variação extrema: comparabilidade executiva restrita sem nota técnica complementar.";
        } else {
            revenueGrowth = tRev;
            ebitdaGrowth = tEbitda;
            netIncomeGrowth = tLucro;
            hasMeaningfulHistory = true;
            historyMessage = null;
        }
    } else if (this.historicalPayloads && this.historicalPayloads.length > 0) {
      // Se houvesse array histórico, a lógica seria similar, mas como focamos no DREPage que passa um array de payloads raw:
      const previousYearRaw = this.historicalPayloads[0];
      const prevReceita = previousYearRaw.recLiquida || 0;
      const prevEbitda = previousYearRaw.ebitda || 0;
      const prevLucro = previousYearRaw.lucroLiq || 0;

      const revGuard = DreHistoricalIntegrityGuard.sanitizeGrowth(netRevenue, prevReceita);
      const ebitdaGuard = DreHistoricalIntegrityGuard.sanitizeGrowth(ebitda, prevEbitda);
      const profitGuard = DreHistoricalIntegrityGuard.sanitizeGrowth(netIncome, prevLucro);

      revenueGrowth = revGuard.growthRate;
      ebitdaGrowth = ebitdaGuard.growthRate;
      netIncomeGrowth = profitGuard.growthRate;

      hasMeaningfulHistory = revGuard.isMeaningful && ebitdaGuard.isMeaningful && profitGuard.isMeaningful;
      if (!hasMeaningfulHistory) {
         historyMessage = revGuard.message || ebitdaGuard.message || profitGuard.message;
      } else {
         historyMessage = null;
      }
    }

    return {
      grossRevenue,
      deductions,
      netRevenue,
      grossProfit,
      grossMargin,
      cogs,
      contributionMarginValue: finalContributionMarginValue,
      contributionMarginRate: finalContributionMarginRate,
      fixedExpenses,
      ebitda,
      ebitdaMargin,
      ebit,
      ebitMargin,
      netIncome,
      netMargin,
      breakEvenRevenue,
      breakEvenCoverage,
      breakEvenDistance,
      safetyMargin,
      revenueGrowth,
      ebitdaGrowth,
      netIncomeGrowth,
      operatingResultQuality,
      extraordinaryResultShare,
      fixedCostAbsorption,
      operatingLeverageRisk,
      hasMeaningfulHistory,
      historyMessage,
      rawPayload: payload
    };
  }
}
