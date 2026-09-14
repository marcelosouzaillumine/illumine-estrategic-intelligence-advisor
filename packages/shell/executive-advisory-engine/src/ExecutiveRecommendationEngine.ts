import { ExecutiveAdvisoryOpportunity, ExecutiveRecommendationContract } from '@illumine/executive-contracts';

export class ExecutiveRecommendationEngine {
  public static generateRecommendation(opportunity: ExecutiveAdvisoryOpportunity): ExecutiveRecommendationContract {
    const ctx = opportunity.decisionContext;
    const diagnosis = (ctx.semanticContext?.strategicDiagnosis as string) || 'Reestruturação de passivos curtos e preservação da margem operacional';

    return {
      recommendationId: `rec-${opportunity.opportunityId}`,
      originatingDecision: opportunity.detectedSignal,
      diagnosis: diagnosis,
      alternatives: [
        {
          alternativeId: 'alt-01',
          title: 'Reestruturação de Passivos Curto Prazo',
          description: 'Substituição de dívidas de curto prazo por linhas corporativas de longo prazo.',
          expectedImpact: opportunity.businessImpact,
          riskLevel: 'LOW'
        },
        {
          alternativeId: 'alt-02',
          title: 'Redução de Custos Operacionais Fixos',
          description: 'Renegociação de contratos de fornecimento e despesas gerais.',
          expectedImpact: Math.round(opportunity.businessImpact * 0.7),
          riskLevel: 'MEDIUM'
        }
      ],
      selectedRecommendation: diagnosis,
      expectedImpact: opportunity.businessImpact,
      expectedKPIShift: '+6.9 p.p. na Margem EBITDA / Cobertura de Caixa +45 dias',
      confidence: opportunity.confidenceLevel,
      assumptions: ['Estabilidade das receitas vigentes', 'Aprovação pelo Conselho de Administração'],
      risks: ['Volatilidade de taxa de juros no alongamento da dívida']
    };
  }
}
