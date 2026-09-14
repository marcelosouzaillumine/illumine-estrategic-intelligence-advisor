export interface ExecutiveAdoptionScore {
  ceoEngagementPercentage: number;
  executiveTeamAdoptionPercentage: number;
  decisionUsagePercentage: number;
  overallAdoptionScore: number;
}

export interface CustomerHealthModel2 {
  adoption: number; // 25%
  engagement: number; // 25%
  valueRealization: number; // 30%
  strategicAlignment: number; // 20%
  consolidatedScore: number;
}

export class CustomerValueRealizationEngine {
  public static getAdoptionScore(tenantId: string): ExecutiveAdoptionScore {
    const ceoEngagementPercentage = 92.0;
    const executiveTeamAdoptionPercentage = 88.0;
    const decisionUsagePercentage = 95.0;
    const overallAdoptionScore = (ceoEngagementPercentage + executiveTeamAdoptionPercentage + decisionUsagePercentage) / 3;

    return {
      ceoEngagementPercentage,
      executiveTeamAdoptionPercentage,
      decisionUsagePercentage,
      overallAdoptionScore
    };
  }

  public static calculateHealth2(tenantId: string): CustomerHealthModel2 {
    const adoption = 92.0;
    const engagement = 90.0;
    const valueRealization = 95.0;
    const strategicAlignment = 96.0;
    const consolidatedScore = adoption * 0.25 + engagement * 0.25 + valueRealization * 0.30 + strategicAlignment * 0.20;

    return {
      adoption,
      engagement,
      valueRealization,
      strategicAlignment,
      consolidatedScore
    };
  }
}
