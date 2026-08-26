import { describe, it, expect } from 'vitest';
import { SignalIntelligenceEngine } from '../../../../capabilities/financial/intelligence/signals/SignalIntelligenceEngine';

describe('SignalIntelligenceTraceability', () => {
  it('should guarantee traceability from raw exposure to final signal', () => {
    const exposures = [{
      id: 'inventory_concentration',
      category: 'WORKING_CAPITAL',
      severity: 'HIGH',
      metric: 'Estoques / Ativo Total',
      value: 0.35,
      triggerCondition: '>= 20%',
      message: 'Concentração de estoques detectada.'
    }];

    const current = { year: 2025, assets: { total: 1000 }, liabilities: { total: 1000 }, equity: { total: 0 } } as any;
    const signals = SignalIntelligenceEngine.synthesize(exposures, [], current);

    expect(signals.length).toBe(1);
    const signal = signals[0];
    
    // Core Identity
    expect(signal.id).toBe('inventory_concentration');
    expect(signal.category).toBe('working_capital');
    expect(signal.severity).toBe('attention');

    // Qualitative Axes
    expect(signal.materiality).toBeDefined();
    expect(signal.persistence).toBeDefined();
    expect(signal.horizon).toBeDefined();
    expect(signal.confidence).toBeDefined();

    // Narrative Traceability
    expect(signal.observation.text).toBe('Concentração de estoques detectada');
    expect(signal.evidence.text).toBe('Concentração de estoques detectada.');
    expect(signal.interpretation.text).toBeDefined();

    // Metric Traceability
    expect(signal.sourceMetric?.name).toBe('Estoques / Ativo Total');
    expect(signal.sourceMetric?.value).toContain('35'); // 35.0%
  });
});
