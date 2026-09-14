
export interface CQSExplanation {
  totalScore: number;
  components: {
    label: string;
    score: number;
    maxScore: number;
  }[];
}

export class CashQualityExplainabilityEngine {
  /**
   * Constrói a decomposição explicativa do Cash Quality Score (CQS)
   */
  public static explain(cqs: any): CQSExplanation {
    if (!cqs || !cqs.dimensions) {
      return {
        totalScore: cqs?.score || 0,
        components: []
      };
    }

    return {
      totalScore: cqs.score,
      components: [
        {
          label: 'Liquidez',
          score: cqs.dimensions.liquidity?.score || 0,
          maxScore: 20
        },
        {
          label: 'Resiliência',
          score: cqs.dimensions.stress?.score || 0,
          maxScore: 20 // Adjusted to 20 or keeping to 15 per radar? Wait, requirement: Resiliência 0/20, Conversão 0/15, Dependência 3/15, Giro 4/15, Sustentabilidade 10/15. Let's sum: 20+20+15+15+15+15 = 100
        },
        {
          label: 'Conversão',
          score: cqs.dimensions.conversion?.score || 0,
          maxScore: 15
        },
        {
          label: 'Dependência dos Sócios',
          score: cqs.dimensions.dependency?.score || 0,
          maxScore: 15
        },
        {
          label: 'Giro Operacional',
          score: cqs.dimensions.workingCapital?.score || 0,
          maxScore: 15
        },
        {
          label: 'Sustentabilidade',
          score: cqs.dimensions.sustainability?.score || 0,
          maxScore: 15
        }
      ]
    };
  }
}
