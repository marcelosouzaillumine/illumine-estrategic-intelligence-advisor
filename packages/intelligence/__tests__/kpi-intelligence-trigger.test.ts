import { describe, it, expect } from 'vitest';
import { KPIIntelligenceTrigger } from '@illumine/contextual-kpi-intelligence';

describe('@illumine/governance (Wave 17.6 Phase 5 KPI Governance Activation)', () => {
  it('should trigger 3-layer explanation when KPI interaction is activated', () => {
    const result = KPIIntelligenceTrigger.triggerForKPI('NET_MARGIN', 18.5);

    expect(result.summary).toContain('NET_MARGIN');
    expect(result.evidences.length).toBeGreaterThan(0);
    expect(result.recommendations.length).toBeGreaterThan(0);
  });
});
