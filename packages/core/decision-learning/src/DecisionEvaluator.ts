import { ForecastModel } from '@illumine/predictive-engine';
import { OutcomeRecord } from '@illumine/organizational-memory';
import { ModelImprovementRequest } from './ModelImprovementRequest';

export class DecisionEvaluator {
  public static evaluateAndRequestImprovement(
    forecast: ForecastModel,
    outcome: OutcomeRecord
  ): ModelImprovementRequest | null {
    const deviation = Math.abs(forecast.expectedValue - outcome.measuredDelta);

    // Se o desvio for maior que 10%, gera uma solicitacao imutavel de melhoria de modelo
    if (deviation > 1.0) {
      return {
        requestId: `req-imp-${forecast.forecastId}`,
        targetCapabilityId: 'financial-governance',
        metricCode: forecast.metricCode,
        proposedAdjustment: `Ajustar ponderacao do modelo preditivo para a métrica ${forecast.metricCode} devido a desvio medido de ${deviation}`,
        justification: `Desvio medido de ${deviation} entre valor previsto (${forecast.expectedValue}) e valor real (${outcome.measuredDelta}).`,
        provenance: { sourceId: outcome.outcomeId, evidenceIds: [], lineageHash: `hash-eval-${outcome.outcomeId}` },
        status: 'PENDING_REVIEW',
        requestedAt: new Date().toISOString()
      };
    }

    return null;
  }
}
