import { ExecutiveAdvisoryOpportunity } from '@illumine/executive-contracts';

export class ExecutiveDecisionPrioritizer {
  public static calculatePriorityScore(opportunity: ExecutiveAdvisoryOpportunity): number {
    // Priority Score = Impacto Financeiro + Urgência + Confiança + Alinhamento Estratégico
    const financialScore = Math.min(opportunity.businessImpact / 100000, 40); // Max 40 pts
    const urgencyScore = opportunity.urgency === 'HIGH' ? 30 : opportunity.urgency === 'MEDIUM' ? 20 : 10;
    const confidenceScore = (opportunity.confidenceLevel / 100) * 20; // Max 20 pts
    const strategicAlignmentScore = 10; // Fixed alignment bonus

    return Math.round(financialScore + urgencyScore + confidenceScore + strategicAlignmentScore);
  }

  public static rankOpportunities(opportunities: readonly ExecutiveAdvisoryOpportunity[]): readonly ExecutiveAdvisoryOpportunity[] {
    return [...opportunities].sort((a, b) => this.calculatePriorityScore(b) - this.calculatePriorityScore(a));
  }
}
