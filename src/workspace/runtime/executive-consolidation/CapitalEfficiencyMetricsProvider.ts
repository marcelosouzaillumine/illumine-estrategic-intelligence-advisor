export interface CapitalEfficiencyMetrics {
  caixaExcedente: number;
  capitalOcioso: number;
  eficienciaPatrimonial: number;
  potencialReinvestimento: number;
  indiceProdutividade: number;
  liquidezImediata: number;
  alavancagem: number;
  liquidezCorrente?: number;
  autonomiaFinanceira?: number;
  endividamentoGeral?: number;
}

export class CapitalEfficiencyMetricsProvider {
  /**
   * Fornece as métricas de Eficiência de Capital.
   * Na Sprint atual, utiliza heurísticas locais em cima dos dados do Balanço.
   * No futuro, extrairá diretamente os indicadores nativos calculados pelo backend.
   */
  public static getMetrics(indicators: any[], bpSummary: any): CapitalEfficiencyMetrics {
    // 1. Caixa Excedente Heurístico: Caixa acima de 15% das Obrigações Circulantes
    const caixaEquivalentes = bpSummary?.caixaEquivalentes || 0;
    const passivoCirculante = bpSummary?.passivoCirculante || 1;
    const caixaNecessario = passivoCirculante * 0.15;
    const caixaExcedente = Math.max(caixaEquivalentes - caixaNecessario, 0);

    // 2. Capital Ocioso Heurístico: Ativo Não Circulante x Constante + Caixa Excedente
    const ativoTotal = bpSummary?.ativoTotal || 1;
    const capitalOcioso = caixaExcedente + (bpSummary?.estoques || 0) * 0.10;

    // 3. Eficiência Patrimonial Heurística: Inverso do Capital Ocioso sobre Ativo
    const ineficiencia = capitalOcioso / ativoTotal;
    const eficienciaPatrimonial = Math.max(100 - (ineficiencia * 100), 0);

    // 4. Potencial de Reinvestimento: Proporção do PL
    const pl = bpSummary?.patrimonioLiquido || 1;
    const potencialReinvestimento = (caixaExcedente / pl) * 100;

    // 5. Índice de Produtividade do Capital (Heurístico aproximado)
    const indiceProdutividade = eficienciaPatrimonial * 0.8 + Math.min(potencialReinvestimento, 20);

    // 6. Liquidez Imediata (Heurística)
    const liquidezImediata = passivoCirculante > 0 ? caixaEquivalentes / passivoCirculante : 0;

    // 7. Alavancagem (Heurística: Exigível / PL)
    const exigivelTotal = (bpSummary?.passivoCirculante || 0) + (bpSummary?.passivoNaoCirculante || 0);
    const alavancagem = pl > 0 ? exigivelTotal / pl : 0;

    return {
      caixaExcedente,
      capitalOcioso,
      eficienciaPatrimonial,
      potencialReinvestimento,
      indiceProdutividade,
      liquidezImediata,
      alavancagem,
      liquidezCorrente: bpSummary?.ativoCirculante > 0 ? bpSummary.ativoCirculante / (bpSummary?.passivoCirculante || 1) : 0,
      autonomiaFinanceira: (pl / (ativoTotal || 1)) * 100, // em percentual
      endividamentoGeral: (exigivelTotal / (ativoTotal || 1)) * 100 // em percentual
    };
  }
}
