import { DLPATemporalIntegrityGuard } from './DLPATemporalIntegrityGuard';

export class PatrimonialRecoveryHorizonEngine {
  static evaluate(accumulatedLosses: number, currentNetIncome: number, historicalCycles: any[] = [], analysisYear?: number) {
    const filteredCycles = analysisYear !== undefined
      ? DLPATemporalIntegrityGuard.filterHistoricalCycles(historicalCycles, analysisYear)
      : historicalCycles;

    const positiveCycles = (filteredCycles || []).filter(c => c.netIncome > 0);
    const hasPositiveHistory = positiveCycles.length > 0 || currentNetIncome > 0;

    if (!hasPositiveHistory) {
      return {
        status: 'INDETERMINATE',
        confidence: 'LOW',
        confidenceLevel: 'LOW',
        value: null,
        formatted: 'Não Estimável',
        narrative: 'A companhia ainda não gera lucro recorrente suficiente para estimar um horizonte confiável de recomposição.',
        rationale: 'Nenhum histórico positivo válido encontrado.'
      } as any;
    }

    const capitalToRecover = accumulatedLosses < 0 ? Math.abs(accumulatedLosses) : 0;
    
    if (capitalToRecover <= 0) {
      return {
        value: 0,
        formatted: '0,0 anos',
        narrative: 'Não há prejuízos acumulados a recuperar.',
        rationale: 'Capital a recompor é R$ 0,00.',
        confidenceLevel: 'HIGH'
      };
    }

    // Resolve recurrent profit by order of priority
    let adjustedRecurrentProfit = 0;
    let method = '';
    if (positiveCycles.length > 0) {
      const sum = positiveCycles.reduce((acc, c) => acc + c.netIncome, 0);
      adjustedRecurrentProfit = sum / positiveCycles.length;
      method = 'Média dos ciclos históricos positivos';
    } else if (currentNetIncome > 0) {
      adjustedRecurrentProfit = currentNetIncome;
      method = 'Lucro líquido do exercício atual';
    }

    if (adjustedRecurrentProfit <= 0) {
      return {
        value: null,
        formatted: 'Não Estimável',
        narrative: 'A companhia ainda não gera lucro recorrente suficiente para estimar um horizonte confiável de recomposição do capital consumido.',
        rationale: 'Nenhum lucro recorrente positivo foi detectado.',
        confidenceLevel: 'LOW'
      };
    }

    const value = capitalToRecover / adjustedRecurrentProfit;
    const formatted = `${value.toFixed(1).replace('.', ',')} anos`;
    const narrative = `Com base no lucro recorrente ajustado de R$ ${adjustedRecurrentProfit.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}, estima-se um horizonte de ${formatted} para recomposição integral do capital consumido.`;
    const rationale = `Capital a Recompor (R$ ${capitalToRecover}) ÷ Lucro Recorrente Ajustado (${method}: R$ ${adjustedRecurrentProfit}).`;

    return {
      value,
      formatted,
      narrative,
      rationale,
      confidenceLevel: 'HIGH'
    };
  }
}
