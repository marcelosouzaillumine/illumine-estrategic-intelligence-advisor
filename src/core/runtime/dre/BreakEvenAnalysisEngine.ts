import { NormalizedDREPayload } from './DREExecutiveDataMapper';

export interface BreakEvenAnalysisOutput {
  breakEvenRevenue: number;
  breakEvenGap: number;
  breakEvenCoverage: number;
  narrativa: string;
}

export class BreakEvenAnalysisEngine {
  public static evaluate(input: NormalizedDREPayload): BreakEvenAnalysisOutput {
    if (!input.breakEvenRevenue.value && input.breakEvenRevenue.source.startsWith('MISSING')) {
      return {
        breakEvenRevenue: 0,
        breakEvenGap: 0,
        breakEvenCoverage: 0,
        narrativa: 'Dados insuficientes para análise executiva desta seção.'
      };
    }

    const breakEvenRevenue = input.breakEvenRevenue.value;
    const breakEvenGap = input.breakEvenGap.value;
    const breakEvenCoverage = input.breakEvenCoverage.value * 100;

    const formatCurrencyStr = (val: number) => `R$ ${Math.abs(val).toFixed(2).replace('.', ',')}`;

    let narrativa = `Ponto de Equilíbrio: ${formatCurrencyStr(breakEvenRevenue)}\n`;
    narrativa += `Receita Adicional Necessária: ${formatCurrencyStr(breakEvenGap)}\n`;
    narrativa += `Cobertura Operacional: ${breakEvenCoverage.toFixed(2).replace('.', ',')}%`;

    return {
      breakEvenRevenue,
      breakEvenGap,
      breakEvenCoverage,
      narrativa
    };
  }
}
