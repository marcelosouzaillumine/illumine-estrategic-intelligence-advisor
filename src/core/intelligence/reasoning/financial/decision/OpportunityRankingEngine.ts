import { FinancialDecisionOption } from './FinancialDecisionOption';

export interface RankedOpportunity {
  option: FinancialDecisionOption;
  score: number;
  priority: 'Alta' | 'Média' | 'Baixa';
  complexityScore: number; // 1 to 10
  riskScore: number; // 1 to 10
  impactScore: number; // 1 to 10
}

export class OpportunityRankingEngine {
  /**
   * Opportunity Score = (Impacto × Confiança) / (Complexidade + Risco)
   */
  public rankOptions(options: FinancialDecisionOption[]): RankedOpportunity[] {
    const ranked: RankedOpportunity[] = options.map(option => {
      // Mocking the scoring logic based on categories. In a real scenario, this would be computed or LLM-driven based on specific metrics.
      let impactScore = 5;
      let complexityScore = 5;
      let riskScore = 5;

      if (option.category === 'GROWTH') {
        impactScore = 9;
        complexityScore = 8;
        riskScore = 7;
      } else if (option.category === 'DEBT_MANAGEMENT') {
        impactScore = 8;
        complexityScore = 4;
        riskScore = 3;
      } else if (option.category === 'CAPITAL_ALLOCATION') {
        impactScore = 6;
        complexityScore = 3;
        riskScore = 4;
      }

      // Calculation
      const numerator = impactScore * option.confidence;
      const denominator = complexityScore + riskScore;
      const rawScore = denominator === 0 ? 0 : numerator / denominator;

      // Normalization factor to make score readable (e.g., multiplier)
      const normalizedScore = Number((rawScore * 10).toFixed(2));

      let priority: 'Alta' | 'Média' | 'Baixa' = 'Média';
      if (normalizedScore > 7) priority = 'Alta';
      else if (normalizedScore < 4) priority = 'Baixa';

      return {
        option,
        score: normalizedScore,
        priority,
        complexityScore,
        riskScore,
        impactScore
      };
    });

    // Sort descending by score
    return ranked.sort((a, b) => b.score - a.score);
  }
}
