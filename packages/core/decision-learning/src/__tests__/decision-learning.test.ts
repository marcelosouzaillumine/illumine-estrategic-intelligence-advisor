import { describe, it, expect } from 'vitest';
import { DecisionEvaluator } from '../index';
import { ForecastModel } from '@illumine/predictive-engine';
import { OutcomeRecord, DecisionOutcomeStatus } from '@illumine/organizational-memory';
import { Confidence, Score } from '@illumine/core-primitives';

describe('@illumine/decision-learning (Phase 5 Decision Learning Loop)', () => {
  it('should generate ModelImprovementRequest when forecast deviation exceeds threshold', () => {
    const forecast: ForecastModel = {
      forecastId: 'fc-1',
      metricCode: 'ROIC',
      expectedValue: 15.0,
      pessimisticValue: 12.0,
      optimisticValue: 18.0,
      explanation: {
        primaryDrivers: ['Drivers'],
        identifiedRisks: ['Risks'],
        confidence: Confidence.create(0.9),
        explainabilityScore: Score.create(90),
        narrativeSummary: 'Summary'
      }
    };

    const outcome: OutcomeRecord = {
      outcomeId: 'out-1',
      actionId: 'act-1',
      status: DecisionOutcomeStatus.PARTIALLY_ACHIEVED,
      measuredDelta: 12.0, // Desvio de 3.0 (> 1.0)
      metricCode: 'ROIC',
      recordedAt: '2026-07-28T00:00:00Z'
    };

    const request = DecisionEvaluator.evaluateAndRequestImprovement(forecast, outcome);
    expect(request).not.toBeNull();
    expect(request?.status).toBe('PENDING_REVIEW');
    expect(request?.metricCode).toBe('ROIC');
    expect(request?.provenance.lineageHash).toBe('hash-eval-out-1');
  });

  it('should return null when forecast deviation is within acceptable limits', () => {
    const forecast: ForecastModel = {
      forecastId: 'fc-2',
      metricCode: 'ROIC',
      expectedValue: 15.0,
      pessimisticValue: 12.0,
      optimisticValue: 18.0,
      explanation: {
        primaryDrivers: [],
        identifiedRisks: [],
        confidence: Confidence.create(0.9),
        explainabilityScore: Score.create(90),
        narrativeSummary: 'Summary'
      }
    };

    const outcome: OutcomeRecord = {
      outcomeId: 'out-2',
      actionId: 'act-2',
      status: DecisionOutcomeStatus.EXPECTED,
      measuredDelta: 14.8, // Desvio de 0.2 (<= 1.0)
      metricCode: 'ROIC',
      recordedAt: '2026-07-28T00:00:00Z'
    };

    const request = DecisionEvaluator.evaluateAndRequestImprovement(forecast, outcome);
    expect(request).toBeNull();
  });
});
