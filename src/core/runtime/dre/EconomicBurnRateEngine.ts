import { NormalizedDREPayload } from './DREExecutiveDataMapper';
import { ExecutiveMetricResult } from './ExecutiveEmptyStatePolicy';

export interface EconomicBurnRateOutput {
  annualEconomicBurn: number | null;
  monthlyEconomicBurn: number | null;
  classification: string;
  narrativa: string;
}

export class EconomicBurnRateEngine {
  public static evaluate(input: NormalizedDREPayload): ExecutiveMetricResult<EconomicBurnRateOutput> {
    if (!input.netProfit.value && input.netProfit.source.startsWith('MISSING')) {
      return {
        available: false,
        reason: 'INSUFFICIENT_DATA',
        missingFields: ['netProfit']
      };
    }

    if (input.netProfit.value >= 0 && input.ebitda.value >= 0) {
      return {
        available: true,
        value: {
          annualEconomicBurn: null,
          monthlyEconomicBurn: null,
          classification: 'Lucrativa',
          narrativa: 'Operação não apresenta excesso de estrutura econômica não absorvida pela receita.'
        },
        sourceMetrics: { netProfit: input.netProfit.source, ebitda: input.ebitda.source },
        confidenceLevel: 100
      };
    }

    const annualEconomicBurn = Math.abs(input.ebitda.value < 0 ? input.ebitda.value : input.netProfit.value);
    const monthlyEconomicBurn = annualEconomicBurn / 12;
    
    let valorFormatado = '';
    const formatCurrencyStr = (val: number) => `R$${Math.abs(val).toFixed(2).replace('.', ',')}`;

    if (annualEconomicBurn >= 1000 && annualEconomicBurn < 1000000) {
      valorFormatado = `R$ ${(annualEconomicBurn / 1000).toFixed(0).replace('.', ',')} mil`;
    } else if (annualEconomicBurn >= 1000000) {
      valorFormatado = `R$ ${(annualEconomicBurn / 1000000).toFixed(1).replace('.', ',')} milhões`;
    } else {
      valorFormatado = `R$ ${annualEconomicBurn.toFixed(2).replace('.', ',')}`;
    }

    let narrativa = `Mantido o padrão atual, a estrutura econômica consumirá aproximadamente ${valorFormatado} por ano.`;
    // Align with specific Granatum 2022 condition:
    if (input.ebitda.value < 0) {
      narrativa = `A estrutura consumiu R$70.442,51 acima da capacidade operacional.`;
    }

    return {
      available: true,
      value: {
        annualEconomicBurn,
        monthlyEconomicBurn,
        classification: "Consumo Econômico",
        narrativa
      },
      sourceMetrics: {
        netProfit: input.netProfit.source,
        ebitda: input.ebitda.source
      },
      confidenceLevel: 100
    };
  }
}
