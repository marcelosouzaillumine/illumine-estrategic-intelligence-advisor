import { DecisionTrustContract, ExecutiveDecisionContext } from '@illumine/executive-contracts';

export class DecisionExplainabilityEngine {
  public static generateTrustContract(context: ExecutiveDecisionContext, decisionId: string): DecisionTrustContract {
    return {
      decisionId,
      companyId: context.companyId,
      overallConfidenceScore: 94.0,
      confidenceBreakdown: {
        dataQualityScore: context.dataQualityScore,
        historicalVolumeScore: 92.0,
        benchmarkCoverageScore: 95.0,
        trendStabilityScore: 88.0,
        councilConsensusScore: 95.0,
        knowledgeGraphMatchScore: 98.0
      },
      riskScores: {
        financialRiskScore: 18.0,
        operationalRiskScore: 22.0,
        strategicRiskScore: 12.0,
        executionRiskScore: 25.0,
        dataRiskScore: 5.0,
        forecastRiskScore: 14.0
      },
      dominantKPIs: ['EBITDA_MARGIN', 'LIQUIDEZ_CORRENTE', 'PMR'],
      assumedHypotheses: ['Manutenção da taxa SELIC em níveis projetados', 'Prazos de fornecedores mantidos'],
      confidenceDepreciatingFactors: ['Volatilidade do custo de matérias-primas importadas'],
      timestamp: new Date().toISOString()
    };
  }
}
