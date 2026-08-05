import { EnterpriseInsight } from '../../models/enterprise-insight.types';

export class PriorityEngine {
  
  /**
   * Ranks a list of EnterpriseInsights based on severity, confidence, and cross-domain impact.
   */
  rankInsights(insights: EnterpriseInsight[]): EnterpriseInsight[] {
    return insights.sort((a, b) => {
      const scoreA = this.calculatePriorityScore(a);
      const scoreB = this.calculatePriorityScore(b);
      return scoreB - scoreA;
    });
  }

  private calculatePriorityScore(insight: EnterpriseInsight): number {
    let score = insight.confidenceScore * 10;
    
    switch (insight.businessImpact?.severity) {
      case 'critical': score += 100; break;
      case 'high': score += 50; break;
      case 'medium': score += 20; break;
      case 'low': score += 5; break;
    }

    score += (insight.affectedOffices?.length || 0) * 15;

    return score;
  }
}
