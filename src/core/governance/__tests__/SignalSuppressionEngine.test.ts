import { expect, test, describe, beforeEach } from 'vitest';
import { SignalSuppressionEngine } from '../signal-hierarchy/SignalSuppressionEngine';
import { GovernanceSignal } from '../signal-hierarchy/types';

describe('SignalSuppressionEngine', () => {
  let engine: SignalSuppressionEngine;

  beforeEach(() => {
    engine = new SignalSuppressionEngine();
  });

  test('Deve suprimir alertas redundantes', () => {
    const signal: GovernanceSignal = {
      id: '1', sourceModule: 'test_module', category: 'Operational',
      severity: 'HIGH', fiduciaryCriticality: 'NO_IMPACT',
      cognitivePriority: 'BOARD_AWARENESS', escalationRequired: false, timestamp: '1',
      message: 'Same error'
    };
    
    const signalDup: GovernanceSignal = {
      id: '2', sourceModule: 'test_module', category: 'Operational',
      severity: 'HIGH', fiduciaryCriticality: 'NO_IMPACT',
      cognitivePriority: 'BOARD_AWARENESS', escalationRequired: false, timestamp: '2',
      message: 'Same error'
    };

    const res1 = engine.evaluateSignal(signal);
    expect(res1.status).toBe('READY');
    
    const res2 = engine.evaluateSignal(signalDup);
    expect(res2.status).toBe('SUPPRESSED');
  });
});
