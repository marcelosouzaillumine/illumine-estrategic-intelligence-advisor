export interface OperationalEfficiencyMetrics {
  ebitdaMargin: number;
  grossMargin: number;
  revenueGrowth: number | null; // null se não houver histórico válido
}

export interface EfficiencyInsight {
  status: 'CRITICAL' | 'WARNING' | 'HEALTHY' | 'NOT_AVAILABLE';
  narrative: string;
}

export class DREOperationalEfficiencyEngine {
  /**
   * Avalia a eficiência operacional e absorção estrutural.
   */
  public static evaluate(metrics: OperationalEfficiencyMetrics): EfficiencyInsight {
    if (metrics.ebitdaMargin < 0) {
      return {
        status: 'CRITICAL',
        narrative: 'A operação consome valor na sua essência, não apresentando eficiência para sustentar sua própria estrutura.'
      };
    }

    if (metrics.ebitdaMargin < 10) { // Exemplo estático, o benchmark engine complementará depois
      return {
        status: 'WARNING',
        narrative: 'A geração de margem é frágil e apresenta baixa capacidade de absorção de choques estruturais.'
      };
    }

    return {
      status: 'HEALTHY',
      narrative: 'A empresa demonstra capacidade consistente de geração de margem operacional e eficiência na absorção da estrutura instalada.'
    };
  }
}
