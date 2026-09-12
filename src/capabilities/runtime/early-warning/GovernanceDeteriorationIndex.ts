import { GovernanceRiskTrend } from './EarlyWarningTypes';

export class GovernanceDeteriorationIndex {
  static calculateIndex(tenantId: string, riskScore: number): GovernanceRiskTrend {
    // Mocking historical trend
    const historical = [Math.max(0, riskScore - 0.2), Math.max(0, riskScore - 0.1), riskScore];
    const trendType = historical[2] > historical[0] ? 'WORSENING' : 'STABLE';

    return {
      trendId: 'TREND-' + Date.now(),
      tenantId,
      currentScore: riskScore,
      historicalScores: historical,
      trendDirection: trendType
    };
  }
}
