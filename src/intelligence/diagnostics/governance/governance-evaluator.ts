import { DiagnosticExecutionContext, MaturityLevel } from '../core/diagnostic-types';
import { DiagnosticScore } from '../core/scoring-engine';
import { GovernanceIntelligenceProfile } from './governance-profile';
import { GOVERNANCE_DOMAIN } from './governance-model.v1';
import { GOVERNANCE_QUESTIONS } from './governance-questions.v1';

export class GovernanceDiagnosticEvaluator {

  public async calculateScores(context: DiagnosticExecutionContext): Promise<DiagnosticScore> {
    const dimensionScores: Record<string, number> = {};
    let totalScore = 0;
    let answeredQuestions = 0;

    for (const response of context.responses) {
      const question = GOVERNANCE_QUESTIONS.find(q => q.id === response.questionId);
      if (!question) continue;

      const option = question.options.find(o => o.id === response.selectedOptionId);
      if (!option) continue;

      const weight = option.weight;
      totalScore += weight;
      answeredQuestions++;

      dimensionScores[question.dimensionId] = (dimensionScores[question.dimensionId] || 0) + weight;
    }

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
  ): Promise<GovernanceIntelligenceProfile> {
    
    const signature = this.generateSignature(score.maturityLevel);

    return {
      domain: GOVERNANCE_DOMAIN,
      maturityLevel: score.maturityLevel,
      signature: signature,
      // Mapping to base ExecutiveIntelligenceProfile
      strengths: signature.identifiedCapabilities,
      attentionPoints: ["Foco em evolução de accountability estrutural e inteligência decisória integrados."],
      executiveInsights: [signature.institutionalCapacity],
      recommendedActions: signature.evolutionVectors
    };
  }

  private generateSignature(maturityLevel: string) {
    if (maturityLevel === 'developing' || maturityLevel === 'initial') {
      return {
        predominantProfile: 'Governança em Formação',
        institutionalCapacity: 'A organização está iniciando a estruturação de seus mecanismos formais de liderança e decisão.',
        identifiedCapabilities: [
          'Reconhecimento da necessidade de estruturação',
          'Rituais iniciais de acompanhamento'
        ],
        evolutionVectors: [
          'Definir claramente papéis e responsabilidades',
          'Criar fóruns decisórios regulares'
        ]
      };
    }

    if (maturityLevel === 'structured') {
      return {
        predominantProfile: 'Governança em Consolidação',
        institutionalCapacity: 'A organização possui mecanismos formais de liderança e decisão, porém ainda existem oportunidades para ampliar integração entre estratégia, execução e responsabilidade.',
        identifiedCapabilities: [
          'Estrutura de liderança definida',
          'Processos decisórios existentes'
        ],
        evolutionVectors: [
          'Fortalecer accountability executivo',
          'Criar maior integração Conselho-Liderança-Dados'
        ]
      };
    }

    return {
      predominantProfile: 'Governança Estratégica',
      institutionalCapacity: 'Sistema robusto de governança que impulsiona a estratégia e garante resiliência competitiva.',
      identifiedCapabilities: [
        'Conselho atuante e estratégico',
        'Gestão de riscos integrada'
      ],
      evolutionVectors: [
        'Manter vanguarda em inteligência decisória',
        'Expandir influência da cultura institucional'
      ]
    };
  }
}
