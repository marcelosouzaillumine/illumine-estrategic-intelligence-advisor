import { Recommendation } from './recommendation-model';
import { SemanticExecutionEngine } from '../../see/src/engine/semantic-execution-engine';
import { Logger } from '../../core/src/logging/logger';

export class RecommendationService {
  public static generateRecommendation(eventContext: { domain: string; eventType: string }): Recommendation {
    Logger.info(`[RIE Engine] Processando evento empresarial: ${eventContext.eventType} no domínio: ${eventContext.domain}`);

    // Transmite compulsoriamente para avaliação do Barramento SEE Engine
    const seeResult = SemanticExecutionEngine.execute({
      intent: `Recommendation.${eventContext.eventType}`,
      actor: { userId: 'system-rie', roles: ['COGNITIVE_ENGINE'] },
      context: eventContext
    });

    const rec: Recommendation = {
      id: `rec-${Math.random().toString(36).substring(2, 9)}`,
      type: 'STRATEGIC_FINANCIAL_REVISION',
      description: 'Revisão da estrutura de custos e fornecedores recomendada devido a oscilações de margem.',
      confidence: Math.min(seeResult.confidenceScore, 0.95),
      impact: 'HIGH',
      requiresApproval: true, // Regra MUST: Aprovação Humana Obrigatória
      status: 'PENDING'
    };

    Logger.info(`[RIE Engine] Recomendação gerada: ${rec.id} | Regra Human-in-the-Loop ativa: requiresApproval = true`);
    return rec;
  }
}
