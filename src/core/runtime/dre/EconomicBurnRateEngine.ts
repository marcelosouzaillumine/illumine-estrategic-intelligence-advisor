import { NormalizedDREPayload } from './DREExecutiveDataMapper';

export interface EconomicBurnRateOutput {
  annualEconomicBurn: number | null;
  monthlyEconomicBurn: number | null;
  classification: string;
  narrativa: string;
}

export class EconomicBurnRateEngine {
  public static evaluate(input: NormalizedDREPayload): EconomicBurnRateOutput {
    if (!input.netProfit.value && input.netProfit.source.startsWith('MISSING')) {
      return {
        annualEconomicBurn: null,
        monthlyEconomicBurn: null,
        classification: 'Indeterminado',
        narrativa: 'Dados insuficientes para análise executiva desta seção.'
      };
    }

    if (input.netProfit.value >= 0) {
      return {
        annualEconomicBurn: null,
        monthlyEconomicBurn: null,
        classification: 'Lucrativa',
        narrativa: 'Operação não apresenta queima de caixa estrutural decorrente de prejuízo operacional neste período.'
      };
    }

    const annualEconomicBurn = Math.abs(input.netProfit.value);
    const monthlyEconomicBurn = annualEconomicBurn / 12;
    
    let valorFormatado = '';
    if (annualEconomicBurn >= 1000 && annualEconomicBurn < 1000000) {
      valorFormatado = `R$ ${(annualEconomicBurn / 1000).toFixed(0).replace('.', ',')} mil`;
    } else if (annualEconomicBurn >= 1000000) {
      valorFormatado = `R$ ${(annualEconomicBurn / 1000000).toFixed(1).replace('.', ',')} milhões`;
    } else {
      valorFormatado = `R$ ${annualEconomicBurn.toFixed(2).replace('.', ',')}`;
    }

    const narrativa = `Mantido o padrão atual, a estrutura econômica consumirá aproximadamente ${valorFormatado} por ano.`;

    return {
      annualEconomicBurn,
      monthlyEconomicBurn,
      classification: "Consumo Econômico",
      narrativa
    };
  }
}
