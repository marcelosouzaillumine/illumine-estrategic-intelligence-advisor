import { expect, test, describe } from 'vitest';
import { InstitutionalNarrativeEngine } from '../narrative/InstitutionalNarrativeEngine';
import { GovernanceSignal } from '../signal-hierarchy/types';

describe('InstitutionalNarrativeEngine', () => {
  const engine = new InstitutionalNarrativeEngine();

  test('Nao nasce de metrica isolada e bloqueia com contexto insuficiente', () => {
    const signals: GovernanceSignal[] = [
      { id: 'op1', sourceModule: 'op_mod', category: 'Operational', severity: 'LOW', fiduciaryCriticality: 'NO_IMPACT', cognitivePriority: 'BACKGROUND_LOG', escalationRequired: false, timestamp: '1' }
    ];
    
    const res = engine.generateCausalNarrative(signals, []);
    expect(res.status).toBe('INSUFFICIENT_SIGNAL_CONTEXT');
  });

  test('Narrativa exige causalidade minima', () => {
    const signals: GovernanceSignal[] = [
      { id: 'fin', sourceModule: 'fin_mod', category: 'Financial', severity: 'CRITICAL', fiduciaryCriticality: 'NO_IMPACT', cognitivePriority: 'IMMEDIATE_ACTION', escalationRequired: true, timestamp: '1' }
    ];
    
    const res = engine.generateCausalNarrative(signals, [{ sourceSignalId: 'fin', targetDomain: 'Fiduciary', impactWeight: 80 }]);
    expect(res.status).toBe('READY');
    expect(typeof res.data).toBe('string');
  });
});
