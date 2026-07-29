import { describe, it, expect } from 'vitest';
import { ForecastModel, ScenarioModel, PredictionExplanation, PredictionCalibration } from '../index';
import { Confidence, Score } from '@illumine/core-primitives';

describe('@illumine/predictive-engine (Phase 4 Predictive Engine)', () => {
  it('should construct ForecastModel with mandatory PredictionExplanation and PredictionCalibration', () => {
    const explanation: PredictionExplanation = {
      primaryDrivers: ['Aumento de vendas no e-commerce', 'Redução de frete'],
      identifiedRisks: ['Risco cambial na importação'],
      confidence: Confidence.create(0.88),
      explainabilityScore: Score.create(95),
      narrativeSummary: 'Projeção otimista impulsionada pela eficiência operacional'
    };

    const calibration: PredictionCalibration = {
      calibrationId: 'cal-1',
      forecastId: 'forecast-ebitda',
      predictedValue: 10.0,
      actualValue: 9.8,
      deviation: 0.2,
      confidenceAdjustment: -0.02
    };

    const forecast: ForecastModel = {
      forecastId: 'forecast-ebitda',
      metricCode: 'EBITDA',
      expectedValue: 10.0,
      pessimisticValue: 8.5,
      optimisticValue: 12.0,
      explanation,
      calibration
    };

    const scenario: ScenarioModel = {
      scenarioId: 'scen-base',
      name: 'Cenário Base 2026',
      type: 'BASE_CASE',
      forecasts: [forecast]
    };

    expect(scenario.forecasts.length).toBe(1);
    expect(scenario.forecasts[0].explanation.primaryDrivers).toContain('Aumento de vendas no e-commerce');
    expect(scenario.forecasts[0].calibration?.deviation).toBe(0.2);
  });
});
