import { DLPATemporalIntegrityGuard } from './DLPATemporalIntegrityGuard';

export interface PatrimonialRecoveryHorizonInput {
  capitalToRecover: number;
  currentNetProfit: number;
  eligibleHistoricalCycles?: any[];
  analysisYear: number;
  temporalAudit?: any;
}

export class PatrimonialRecoveryHorizonEngine {
  static evaluate(
    inputOrLosses: any,
    currentNetIncome?: number,
    historicalCycles: any[] = [],
    analysisYearInput?: number
  ) {
    let capitalToRecover = 0;
    let currentNetProfit = 0;
    let eligibleHistoricalCycles: any[] = [];
    let analysisYear = 2022;
    let temporalAudit: any = null;

    if (inputOrLosses && typeof inputOrLosses === 'object' && 'capitalToRecover' in inputOrLosses) {
      // New signature
      const input = inputOrLosses as PatrimonialRecoveryHorizonInput;
      capitalToRecover = input.capitalToRecover;
      currentNetProfit = input.currentNetProfit;
      eligibleHistoricalCycles = input.eligibleHistoricalCycles || [];
      analysisYear = input.analysisYear;
      temporalAudit = input.temporalAudit;
    } else {
      // Legacy signature compatibility
      const accumulatedLosses = Number(inputOrLosses || 0);
      capitalToRecover = accumulatedLosses < 0 ? Math.abs(accumulatedLosses) : 0;
      currentNetProfit = currentNetIncome ?? 0;
      eligibleHistoricalCycles = historicalCycles || [];
      analysisYear = analysisYearInput ?? new Date().getFullYear();
    }

    // 1. Rejeitar qualquer ciclo com year > analysisYear
    const validCycles = (eligibleHistoricalCycles || [])
      .filter(c => c && typeof c === 'object' && Number(c.year) <= analysisYear);

    const positiveEligibleCycles = validCycles.filter(c => Number(c.netIncome) > 0);
    const eligibleYears = temporalAudit?.eligibleYears || validCycles.map(c => Number(c.year));
    const blockedYears = temporalAudit?.blockedYears || (eligibleHistoricalCycles || []).map(c => Number(c.year)).filter(y => y > analysisYear);

    if (positiveEligibleCycles.length === 0 && currentNetProfit <= 0) {
      return {
        available: false,
        status: 'INDETERMINATE',
        classification: 'Não Estimável',
        formatted: 'Não Estimável',
        value: null,
        years: null,
        adjustedRecurringProfit: null,
        confidence: 'LOW',
        confidenceLevel: 'LOW',
        rationale: 'A companhia ainda não possui histórico de lucro recorrente elegível suficiente para estimar um horizonte de recomposição patrimonial.',
        sourceMetrics: {
          analysisYear,
          eligibleYears,
          blockedYears,
          capitalToRecover,
          currentNetProfit
        }
      };
    }

    const positiveCycles = positiveEligibleCycles;

    if (capitalToRecover <= 0) {
      return {
        available: true,
        status: 'ESTIMAVEL',
        classification: '0,0 anos',
        formatted: '0,0 anos',
        value: 0,
        years: 0,
        adjustedRecurringProfit: currentNetProfit > 0 ? currentNetProfit : 0,
        confidenceLevel: 'HIGH',
        narrative: 'Não há prejuízos acumulados a recuperar.',
        rationale: 'Capital a recompor é R$ 0,00.',
        sourceMetrics: {
          analysisYear,
          eligibleYears,
          blockedYears,
          capitalToRecover,
          currentNetProfit
        }
      };
    }

    // 3. Calcular lucro recorrente ajustado apenas com ciclos elegíveis
    let adjustedRecurringProfit = 0;
    let method = '';
    if (positiveCycles.length > 0) {
      const sum = positiveCycles.reduce((acc, c) => acc + Number(c.netIncome), 0);
      adjustedRecurringProfit = sum / positiveCycles.length;
      method = 'Média dos ciclos históricos positivos';
    } else if (currentNetProfit > 0) {
      adjustedRecurringProfit = currentNetProfit;
      method = 'Lucro líquido do exercício atual';
    }

    if (adjustedRecurringProfit <= 0) {
      return {
        available: false,
        status: 'INDETERMINATE',
        classification: 'Não Estimável',
        formatted: 'Não Estimável',
        value: null,
        years: null,
        adjustedRecurringProfit: null,
        confidence: 'LOW',
        confidenceLevel: 'LOW',
        rationale: 'A companhia ainda não gera lucro recorrente suficiente até o ano analisado para estimar horizonte de recomposição patrimonial.',
        sourceMetrics: {
          analysisYear,
          eligibleYears,
          blockedYears,
          capitalToRecover,
          currentNetProfit
        }
      };
    }

    const value = capitalToRecover / adjustedRecurringProfit;
    const formatted = `${value.toFixed(1).replace('.', ',')} anos`;
    const narrative = `Com base no lucro recorrente ajustado de R$ ${adjustedRecurringProfit.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}, estima-se um horizonte de ${formatted} para recomposição integral do capital consumido.`;
    const rationale = `Capital a Recompor (R$ ${capitalToRecover}) ÷ Lucro Recorrente Ajustado (${method}: R$ ${adjustedRecurringProfit}).`;

    return {
      available: true,
      status: 'ESTIMAVEL',
      classification: formatted,
      formatted,
      value,
      years: value,
      adjustedRecurringProfit,
      narrative,
      rationale,
      confidenceLevel: 'HIGH',
      sourceMetrics: {
        analysisYear,
        eligibleYears,
        blockedYears,
        capitalToRecover,
        currentNetProfit
      }
    };
  }
}
