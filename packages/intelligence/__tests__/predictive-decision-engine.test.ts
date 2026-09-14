/// <reference types="vitest" />
import { describe, it, expect } from 'vitest';
import { ForecastEngine, TrendAnalyzer, PredictionExplainer } from '../predictive-decision-engine/src';

describe('@illumine/governance (Wave 18.9 Predictive Decision Governance Engine)', () => {
  it('should forecast KPI trajectory for 30/60/90/180/365-day horizons with confidence intervals (PDI v1.0)', () => {
    const forecast90 = ForecastEngine.forecastKPI('EBITDA_MARGIN', 12.4, 90);
    expect(forecast90.horizonDays).toBe(90);
    expect(forecast90.expectedValue).toBe(10.8);
    expect(forecast90.probabilityPercent).toBe(82.0);
    expect(forecast90.confidenceScore).toBe(94.0);
    expect(forecast90.confidenceInterval.min).toBeLessThan(forecast90.expectedValue);
  });

  it('should analyze time series trend and generate human-readable prediction explanation', () => {
    const trend = TrendAnalyzer.analyzeTrend([10.0, 11.2, 12.4]);
    expect(trend.trend).toBe('UPWARD');

    const forecast = ForecastEngine.forecastKPI('EBITDA_MARGIN', 12.4, 90);
    const explanation = PredictionExplainer.explainPrediction(forecast);
    expect(explanation).toContain('EBITDA_MARGIN');
    expect(explanation).toContain('90 dias');
  });
});
