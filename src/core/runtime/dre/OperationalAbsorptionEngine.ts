import { NormalizedDREPayload } from './DREExecutiveDataMapper';

export interface OperationalAbsorptionOutput {
  indice: number;
  classificacao: 'Plena' | 'Adequada' | 'Parcial' | 'Insuficiente' | 'Crítica' | 'Indeterminada';
  narrativa: string;
}

export class OperationalAbsorptionEngine {
  public static evaluate(input: NormalizedDREPayload): OperationalAbsorptionOutput {
    if (!input.breakEvenRevenue.value && input.breakEvenRevenue.source.startsWith('MISSING')) {
      return {
        indice: 0,
        classificacao: 'Indeterminada',
        narrativa: 'Dados insuficientes para análise executiva desta seção.'
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
      indice,
      classificacao,
      narrativa: (indice >= 100) ? `A operação gera ${indice.toFixed(2).replace('.', ',')}% da receita necessária para sustentar a estrutura atual.` : narrativa
    };
  }
}
