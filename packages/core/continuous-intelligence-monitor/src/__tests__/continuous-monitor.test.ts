import { describe, it, expect } from 'vitest';
import { EnterpriseSignalMonitor, EnterpriseSignalEvent } from '../index';

describe('@illumine/continuous-governance-monitor (Wave 16 Phase 1 Continuous Observation)', () => {
  it('should emit and retrieve continuous enterprise signal events across corporate dimensions', () => {
    const monitor = new EnterpriseSignalMonitor();

    const signal: EnterpriseSignalEvent = {
      signalId: 'sig-ebitda-01',
      domain: 'FINANCE',
      metric: 'EBITDA_MARGIN',
      previousValue: 22.0,
      currentValue: 14.0,
      variation: -8.0,
      severity: 'HIGH',
      businessImpact: 'Compressão severa na margem operacional',
      timestamp: new Date()
    };

    monitor.emitSignal(signal);

    expect(monitor.getAllSignals().length).toBe(1);
    expect(monitor.getSignalsByDomain('FINANCE').length).toBe(1);
    expect(monitor.getSignalsByDomain('FINANCE')[0].metric).toBe('EBITDA_MARGIN');
  });
});
