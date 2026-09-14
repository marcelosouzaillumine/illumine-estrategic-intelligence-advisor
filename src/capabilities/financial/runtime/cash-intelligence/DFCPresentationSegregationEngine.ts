export interface DFCPresentationLayout {
  blocks: {
    id: string;
    title: string;
    type: 'LIQUIDITY' | 'EQE' | 'CONTEXT' | 'TECHNICAL';
    order: number;
  }[];
}

export class DFCPresentationSegregationEngine {
  /**
   * Define o layout segregado com foco executivo: Liquidez vs Earnings (EQE).
   */
  public static getLayoutConfig(): DFCPresentationLayout {
    return {
      blocks: [
        { id: 'CONTEXT', title: 'Contexto Empresarial', type: 'CONTEXT', order: 1 },
        { id: 'CQS', title: 'Health Score de Caixa (CQS)', type: 'LIQUIDITY', order: 2 },
        { id: 'DIAGNOSTIC', title: 'Diagnóstico Executivo', type: 'LIQUIDITY', order: 3 },
        { id: 'PRIORITIES', title: 'Top 3 Prioridades', type: 'LIQUIDITY', order: 4 },
        { id: 'CONVERSION', title: 'Conversão Receita → Caixa', type: 'LIQUIDITY', order: 5 },
        { id: 'DEPENDENCY', title: 'Dependência dos Sócios', type: 'LIQUIDITY', order: 6 },
        { id: 'RUNWAY', title: 'Runway Fiduciário', type: 'LIQUIDITY', order: 7 },
        { id: 'ADVISORY', title: 'Advisory do Conselho', type: 'LIQUIDITY', order: 8 },
        { id: 'RECONCILIATION', title: 'Reconciliação BP × DFC', type: 'LIQUIDITY', order: 9 },
        { id: 'EQE', title: 'Qualidade do Resultado (EQE)', type: 'EQE', order: 10 },
        { id: 'TECHNICAL', title: 'Camada Técnica', type: 'TECHNICAL', order: 11 }
      ]
    };
  }
}
