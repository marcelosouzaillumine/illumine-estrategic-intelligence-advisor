import { expect, test, describe } from 'vitest';
import { SignalPriorityEngine } from '../signal-hierarchy/SignalPriorityEngine';
import { GovernanceSignal } from '../signal-hierarchy/types';

describe('SignalPriorityEngine', () => {
  const engine = new SignalPriorityEngine();

  test('Deve priorizar sinal fiduciario sobre operacional', () => {
    const fidSignal: GovernanceSignal = {
      id: '1', sourceModule: 'mod', category: 'Fiduciary',
      severity: 'CRITICAL', fiduciaryCriticality: 'SEVERE_BREACH',
      cognitivePriority: 'IMMEDIATE_ACTION', escalationRequired: true, timestamp: '1'
    };
    
    const opSignal: GovernanceSignal = {
      id: '2', sourceModule: 'mod', category: 'Operational',
      severity: 'CRITICAL', fiduciaryCriticality: 'NO_IMPACT',
      cognitivePriority: 'IMMEDIATE_ACTION', escalationRequired: true, timestamp: '1'
    };
    
    const resFid = engine.calculatePriority(fidSignal);
    const resOp = engine.calculatePriority(opSignal);
    
    expect(resFid.status).toBe('READY');
    expect(resOp.status).toBe('READY');
    expect(resFid.data).toBeGreaterThan(resOp.data as number);
  });

  test('Cross-Tenant Leakage deve ser CRITICAL', () => {
    const leakSignal: GovernanceSignal = {
      id: '3', sourceModule: 'mod', category: 'Tenant_Security',
      severity: 'CRITICAL', fiduciaryCriticality: 'SEVERE_BREACH',
      cognitivePriority: 'IMMEDIATE_ACTION', escalationRequired: true, timestamp: '1'
    };
    const res = engine.calculatePriority(leakSignal);
    expect(res.data).toBe(200); // 100 for CRITICAL + 100 for SEVERE_BREACH
  });
});
