import { NormalizedBalanceSheet, NormalizedBalanceSheetDataset } from '../../domain/models/NormalizedBalanceSheet';
import { BalanceSheetAnalysisInput, BalanceSheetRawData } from '../../domain/models/BalanceSheetAnalysisInput';

export class BalanceSheetNormalizer {
  private static getNumber(value: any): number | undefined {
    if (value === undefined || value === null || value === '') return undefined;
    const num = Number(value);
    return isNaN(num) ? undefined : num;
  }

  private static normalizeSingle(rawData: any): NormalizedBalanceSheet {
    const currentAssets = this.getNumber(rawData.ativoCirculante);
    const nonCurrentAssets = this.getNumber(rawData.ativoNaoCirculante);
    const totalAssets = this.getNumber(rawData.ativoTotal) ?? 
      (currentAssets !== undefined && nonCurrentAssets !== undefined ? currentAssets + nonCurrentAssets : undefined);

    const currentLiabilities = this.getNumber(rawData.passivoCirculante);
    const nonCurrentLiabilities = this.getNumber(rawData.passivoNaoCirculante);
    const totalLiabilities = this.getNumber(rawData.passivoTotal) ?? 
      (currentLiabilities !== undefined && nonCurrentLiabilities !== undefined ? currentLiabilities + nonCurrentLiabilities : undefined);

    return {
      year: Number(rawData.ano || new Date().getFullYear()),
      assets: {
        currentAssets,
        nonCurrentAssets,
        cashAndEquivalents: this.getNumber(rawData.caixaEquivalentes),
        accountsReceivable: this.getNumber(rawData.clientes),
        inventory: this.getNumber(rawData.estoques),
        fixedAssets: this.getNumber(rawData.imobilizado),
        total: totalAssets
      },
      liabilities: {
        currentLiabilities,
        nonCurrentLiabilities,
        suppliers: this.getNumber(rawData.fornecedores),
        laborObligations: this.getNumber(rawData.obrigacoesTrabalhistas),
        taxes: this.getNumber(rawData.tributos),
        financialDebtsShortTerm: this.getNumber(rawData.passivosFinanceiros),
        financialDebtsLongTerm: this.getNumber(rawData.passivosFinanceirosNaoCirculante),
        total: totalLiabilities
      },
      equity: {
        capital: this.getNumber(rawData.capitalSocial),
        retainedEarnings: this.getNumber(rawData.lucrosAcumulados),
        total: this.getNumber(rawData.patrimonioLiquido)
      }
    };
  }

  static normalize(input: BalanceSheetAnalysisInput): NormalizedBalanceSheetDataset {
    if (!input || !input.current || !input.history || input.analysisPeriod === undefined) {
      throw new Error('Invalid BalanceSheetAnalysisInput: must provide current, history, and analysisPeriod');
    }

    const analysisPeriod = input.analysisPeriod;

    // 1. Normalize the entire provided history just to have the structured data
    let rawHistoryNormalized: NormalizedBalanceSheet[] = [];
    if (Array.isArray(input.history) && input.history.length > 0) {
      rawHistoryNormalized = input.history
        .map(item => this.normalizeSingle(item))
        .sort((a, b) => a.year - b.year);
    }

    const availablePeriods = rawHistoryNormalized.map(h => h.year);

    // 2. APPLY TEMPORAL CAUSALITY LOCK: Filter history strictly by analysisPeriod
    const history = rawHistoryNormalized.filter(h => h.year <= analysisPeriod);
    const filteredPeriods = history.map(h => h.year);
    const hasHistory = history.length > 0;

    // 3. Select the target 'current' period exactly matching the analysisPeriod if available,
    // otherwise fallback to what the frontend provided in input.current BUT check if it violates the period lock
    let current = this.normalizeSingle(input.current);
    const currentFromHistory = history.find(h => h.year === analysisPeriod);
    
    if (currentFromHistory) {
      current = currentFromHistory;
    } else if (current.year > analysisPeriod) {
       // If the explicit current passed is > analysisPeriod, we shouldn't use it.
       // We force its year to analysisPeriod, although ideally the data shouldn't be future.
       current.year = analysisPeriod; 
    }

    const coverage = {
      available: hasHistory,
      analysisPeriod: analysisPeriod,
      firstPeriod: hasHistory ? filteredPeriods[0] : current.year,
      lastPeriod: hasHistory ? filteredPeriods[filteredPeriods.length - 1] : current.year,
      availablePeriods: availablePeriods,
      filteredPeriods: filteredPeriods
    };

    return { current, history, coverage };
  }
}
