import { RecommendationService } from '../../packages/recommendation/src/index';

export function testRecommendationFlow(): boolean {
  const rec = RecommendationService.generateRecommendation({
    domain: 'Finance',
    eventType: 'MarginDropDetected'
  });

  if (!rec.requiresApproval || rec.status !== 'PENDING') {
    throw new Error('Falha no teste da regra Human-in-the-Loop do motor de recomendação');
  }

  if (rec.confidence < 0.90) {
    throw new Error('Falha no teste de Confidence Score mínimo do RIE');
  }

  return true;
}
