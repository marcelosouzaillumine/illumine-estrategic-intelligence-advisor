import { describe, it, expect } from 'vitest';
import { AdvisoryTriggerEngine } from '../index';
import { EnterpriseSignalEvent } from '@illumine/continuous-intelligence-monitor';

describe('@illumine/advisory-trigger-engine (Wave 16 Phase 2 Trigger Engine)', () => {
  it('should evaluate HIGH severity signal and generate pro-active AdvisoryTrigger', () => {
    const signal: EnterpriseSignalEvent = {
      signalId: 'sig-01',
      domain: 'FINANCE',
      metric: 'CASH_RESERVE',
      previousValue: 10000000,
      currentValue: 6500000,
      variation: -35.0,
      severity: 'HIGH',
      businessImpact: 'Queda acentuada na liquidez',
      timestamp: new Date()
    };

    const trigger = AdvisoryTriggerEngine.evaluateSignal(signal);
    expect(trigger).toBeDefined();
    expect(trigger?.urgency).toBe('HIGH');
    expect(trigger?.recommendedAgents).toContain('cfo-governance-agent');
  });

  it('should return null for LOW severity signals', () => {
    const signal: EnterpriseSignalEvent = {
      signalId: 'sig-02',
      domain: 'OPERATIONS',
      metric: 'PRINT_PAPER',
      previousValue: 100,
      currentValue: 98,
      variation: -2.0,
      severity: 'LOW',
      businessImpact: 'Variação irrelevante',
      timestamp: new Date()
    };

    const trigger = AdvisoryTriggerEngine.evaluateSignal(signal);
    expect(trigger).toBeNull();
  });
});
