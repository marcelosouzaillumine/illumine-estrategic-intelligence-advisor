import { PredictiveBase, InstitutionalSnapshot } from './PredictiveTypes';
import { EmergingRiskCategory, PredictiveRiskEngine } from './PredictiveRiskEngine';

export interface PredictiveRecommendation {
  riskCategory: EmergingRiskCategory;
  preventiveAction: string;
}

export interface RecommendationOutput extends PredictiveBase {
  recommendations: PredictiveRecommendation[];
}

export class PredictiveRecommendationEngine {
  public static generateRecommendations(snapshots: InstitutionalSnapshot[]): RecommendationOutput {
    if (!snapshots || snapshots.length < 3) {
      return {
        confidenceLevel: 'INSUFFICIENT_HISTORY',
        confidenceReason: 'Histórico insuficiente para gerar recomendações preventivas baseadas em risco.',
        recommendations: []
      };
    }

    const riskOutput = PredictiveRiskEngine.evaluateRisks(snapshots);
    const recommendations: PredictiveRecommendation[] = [];

    riskOutput.emergingRisks.forEach(risk => {
      if (risk.category === EmergingRiskCategory.LIQUIDITY_RISK) {
        recommendations.push({
          riskCategory: risk.category,
          preventiveAction: 'Existe uma tendência provável de deterioração do capital de giro nos próximos ciclos. Recomenda-se revisão imediata das políticas de recebimento e alongamento de passivos.'
        });
      }
      if (risk.category === EmergingRiskCategory.GOVERNANCE_RISK) {
        recommendations.push({
          riskCategory: risk.category,
          preventiveAction: 'Sinal preditivo de queda de maturidade de governança em instâncias executivas. Recomenda-se auditoria em processos de decisão recentes.'
        });
      }
    });

    return {
      confidenceLevel: riskOutput.confidenceLevel,
      confidenceReason: 'Recomendações fiduciárias preventivas mapeadas a partir de riscos emergentes identificados.',
      recommendations
    };
  }
}
