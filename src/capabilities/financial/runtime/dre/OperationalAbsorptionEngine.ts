import { NormalizedDREPayload } from './DREExecutiveDataMapper';
import { ExecutiveMetricResult } from './ExecutiveEmptyStatePolicy';

export interface OperationalAbsorptionOutput {
  indice: number;
  classificacao: 'Plena' | 'Adequada' | 'Parcial' | 'Insuficiente' | 'Crítica' | 'Indeterminada';
  narrativa: string;
}

export class OperationalAbsorptionEngine {
  public static evaluate(input: NormalizedDREPayload): ExecutiveMetricResult<OperationalAbsorptionOutput> {
    if (!input.breakEvenRevenue.value && input.breakEvenRevenue.source.startsWith('MISSING')) {
      return {
        available: false,
        reason: 'INSUFFICIENT_DATA',
        missingFields: ['breakEvenRevenue']
      };
    }

    const indice = input.breakEvenCoverage.value * 100;
    let classificacao: OperationalAbsorptionOutput['classificacao'] = 'Crítica';

    if (indice >= 120) classificacao = 'Plena';
    else if (indice >= 100) classificacao = 'Adequada';
    else if (indice >= 75) classificacao = 'Parcial';
    else if (indice >= 50) classificacao = 'Insuficiente';
    else classificacao = 'Crítica';

    const narrativa = `A operação gera apenas ${indice.toFixed(2).replace('.', ',')}% da receita necessária para sustentar sua estrutura atual.`;

    return {
      available: true,
      value: {
        indice,
        classificacao,
        narrativa: (indice >= 100) ? `A operação gera ${indice.toFixed(2).replace('.', ',')}% da receita necessária para sustentar a estrutura atual.` : narrativa
      },
      sourceMetrics: {
        breakEvenCoverage: input.breakEvenCoverage.source
      },
      confidenceLevel: 100
    };
  }
}
