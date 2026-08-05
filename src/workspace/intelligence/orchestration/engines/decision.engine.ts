import { EnterpriseInsight, DecisionRecommendation } from '../../models/enterprise-insight.types';
import { ImpactChain } from './impact-propagation.engine';

export interface DecisionObject {
  problem: string;
  evidence: string[];
  affectedOffices: string[];
  financialImpact?: string;
  strategicImpact?: string;
  recommendedActions: DecisionRecommendation[];
  confidence: number;
}

export class DecisionIntelligenceEngine {
  
  /**
   * Evaluates a complex cross-office insight to generate a structured DecisionObject.
   */
  generateDecisionContext(insight: EnterpriseInsight, impactChain: ImpactChain): DecisionObject {
    const recommendations: DecisionRecommendation[] = [];

    if (impactChain.urgency === 'critical' || impactChain.overallSeverity === 'critical') {
      recommendations.push({
        id: `rec-board-${insight.id}`,
        action: 'Acionar comitê executivo e avaliar plano de contingência estratégico.',
        expectedOutcome: 'Mitigação rápida do risco sistêmico propagado.',
        targetOffice: 'ceo',
        priority: 'critical'
      });
    }

    if (insight.affectedOffices.includes('cfo')) {
      recommendations.push({
        id: `rec-cfo-${insight.id}`,
        action: 'Revisar projeção de fluxo de caixa e OPEX para o trimestre.',
        expectedOutcome: 'Ajuste de margem defensivo.',
        targetOffice: 'cfo',
        priority: 'high'
      });
    }

    return {
      problem: insight.title,
      evidence: insight.evidence.map(e => `${e.metricName}: ${e.value}`),
      affectedOffices: insight.affectedOffices,
      financialImpact: insight.businessImpact.estimatedFinancialValue ? `$${insight.businessImpact.estimatedFinancialValue}` : 'TBD',
      strategicImpact: insight.businessImpact.description,
      recommendedActions: recommendations,
      confidence: insight.confidenceScore
    };
  }
}

