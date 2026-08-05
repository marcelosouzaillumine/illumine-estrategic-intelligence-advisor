import { DiagnosticExecutionContext, MaturityLevel } from '../core/diagnostic-types';
import { DiagnosticScore } from '../core/scoring-engine';
import { FinancialIntelligenceProfile } from './financial-profile';
import { FINANCIAL_DOMAIN } from './financial-model.v1';
import { FINANCIAL_QUESTIONS_V1 } from './financial-questions.v1';

export class FinancialDiagnosticEvaluator {

  public async calculateScores(context: DiagnosticExecutionContext): Promise<DiagnosticScore> {
    const dimensionScores: Record<string, number> = {};
    let totalScore = 0;
    let answeredQuestions = 0;

    for (const response of context.responses) {
      const question = FINANCIAL_QUESTIONS_V1.find(q => q.id === response.questionId);
      if (!question) continue;

      const option = question.options.find(o => o.id === response.selectedOptionId);
      if (!option) continue;

      const weight = option.weight;
      totalScore += weight;
      answeredQuestions++;

      dimensionScores[question.dimensionId] = (dimensionScores[question.dimensionId] || 0) + weight;
    }

    // Average score 1 to 5 (mapped to 0-100 internally if needed, but we keep 1-5 for maturity)
    const overallScore = answeredQuestions > 0 ? (totalScore / answeredQuestions) : 1;
    const maturityLevel = this.evaluateMaturity(overallScore);

    return {
      dimensionScores,
      overallScore,
      maturityLevel
    };
  }

  public evaluateMaturity(overallScore: number): MaturityLevel {
    if (overallScore >= 4.5) return 'excellence';
    if (overallScore >= 3.5) return 'advanced';
    if (overallScore >= 2.5) return 'structured';
    if (overallScore >= 1.5) return 'developing';
    return 'initial';
  }

  public async generateInterpretation(
    context: DiagnosticExecutionContext, 
    score: DiagnosticScore
  ): Promise<FinancialIntelligenceProfile> {
    
    const strengths: string[] = [];
    const attentionPoints: string[] = [];
    const recommendedActions: string[] = [];

    // Proprietary mapping logic
    // This translates raw metrics into executive insights.
    
    if (score.overallScore >= 2.5) {
      strengths.push("Disciplina operacional e controles financeiros básicos estabelecidos.");
    } else {
      attentionPoints.push("Elevada dependência de controles manuais e falta de visibilidade histórica.");
      recommendedActions.push("Estruturação imediata de fluxo de caixa e rotinas de fechamento.");
    }

    if (score.dimensionScores['dim_planning'] >= 3) {
      strengths.push("Capacidade de planejamento financeiro ativo.");
    } else {
      attentionPoints.push("Baixa capacidade preditiva, gestão focada apenas no retrovisor (DRE histórico).");
      recommendedActions.push("Implantação de planejamento orçamentário (budget) e acompanhamento de variações.");
    }

    if (score.dimensionScores['dim_working_capital'] >= 4) {
      strengths.push("Otimização avançada de capital de giro e ciclo financeiro.");
    } else {
      attentionPoints.push("Possível ineficiência no ciclo de conversão de caixa, retendo capital na operação.");
    }

    const executiveInsights = [
      `A organização opera atualmente num estágio de maturidade ${score.maturityLevel.toUpperCase()}.`,
      "O foco deve ser a evolução contínua da matriz de previsibilidade financeira para mitigar riscos de liquidez."
    ];

    return {
      domain: FINANCIAL_DOMAIN,
      maturityLevel: score.maturityLevel,
      strengths,
      attentionPoints,
      executiveInsights,
      recommendedActions
    };
  }
}
