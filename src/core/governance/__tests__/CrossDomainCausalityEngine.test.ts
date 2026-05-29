import { expect, test, describe } from 'vitest';
import { CrossDomainCausalityEngine } from '../causality/CrossDomainCausalityEngine';
import { GovernanceSignal } from '../signal-hierarchy/types';

describe('CrossDomainCausalityEngine', () => {
  const engine = new CrossDomainCausalityEngine();

  test('Liquidez deteriorada + Risco fiduciario devem gerar relacao causal', () => {
    const signals: GovernanceSignal[] = [
      { id: 'fin', sourceModule: 'fin_mod', category: 'Financial', severity: 'CRITICAL', fiduciaryCriticality: 'NO_IMPACT', cognitivePriority: 'IMMEDIATE_ACTION', escalationRequired: true, timestamp: '1' },
      { id: 'fid', sourceModule: 'fid_mod', category: 'Fiduciary', severity: 'HIGH', fiduciaryCriticality: 'ELEVATED_RISK', cognitivePriority: 'BOARD_AWARENESS', escalationRequired: true, timestamp: '2' }
    ];

    const res = engine.correlate(signals);
    expect(res.status).toBe('READY');
    expect(res.data?.length).toBe(1);
    expect(res.data?.[0].targetDomain).toBe('Fiduciary');
  });

  test('Falta de causalidade deve gerar bloqueio', () => {
    const signals: GovernanceSignal[] = [
      { id: 'op1', sourceModule: 'op_mod', category: 'Operational', severity: 'LOW', fiduciaryCriticality: 'NO_IMPACT', cognitivePriority: 'BACKGROUND_LOG', escalationRequired: false, timestamp: '1' }
    ];
    
    const res = engine.correlate(signals);
    expect(res.status).toBe('INSUFFICIENT_SIGNAL_CONTEXT');
  });
});
