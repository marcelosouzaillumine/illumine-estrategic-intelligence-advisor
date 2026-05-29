export interface CostStructureMetrics {
  fixedCostsOverhead: number; // as percentage of revenue
  variableCostsWeight: number; // as percentage of revenue
}

export interface CostStructureInsight {
  status: 'CRITICAL' | 'WARNING' | 'HEALTHY';
  narrative: string;
}

export class DRECostStructureEngine {
  /**
   * Avalia a rigidez operacional e peso administrativo.
   */
  public static evaluate(metrics: CostStructureMetrics): CostStructureInsight {
    if (metrics.fixedCostsOverhead > 50) {
      return {
        status: 'CRITICAL',
        narrative: 'Alta rigidez operacional detectada. O peso da estrutura fixa pressiona severamente a rentabilidade e exige escala comercial imediata para evitar consumo de valor.'
      };
    }

    if (metrics.fixedCostsOverhead > 35) {
      return {
        status: 'WARNING',
        narrative: 'Estrutura de custos com rigidez moderada. É necessário alinhar a estrutura administrativa à capacidade real de geração de receita da operação.'
      };
    }

    return {
      status: 'HEALTHY',
      narrative: 'A estrutura de custos demonstra boa flexibilidade, com peso administrativo adequado à escala atual do negócio.'
    };
  }
}
