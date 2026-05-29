import { expect, test, describe, beforeEach } from 'vitest';
import { CognitiveLoadGovernor } from '../executive-attention/CognitiveLoadGovernor';
import { GovernanceSignal } from '../signal-hierarchy/types';

describe('CognitiveLoadGovernor', () => {
  let governor: CognitiveLoadGovernor;

  beforeEach(() => {
    governor = new CognitiveLoadGovernor();
  });

  test('Excesso de sinais de baixa prioridade sofre throttle', () => {
    const signal: GovernanceSignal = {
      id: 'op1', sourceModule: 'op_mod', category: 'Operational', severity: 'LOW', fiduciaryCriticality: 'NO_IMPACT', cognitivePriority: 'BACKGROUND_LOG', escalationRequired: false, timestamp: '1'
    };
    
    for (let i = 0; i < 6; i++) {
      governor.throttle(signal);
    }
    
    const res = governor.throttle(signal);
    expect(res.status).toBe('SUPPRESSED');
  });

  test('Sinais CRITICAL nunca sofrem throttle', () => {
    const signal: GovernanceSignal = {
      id: 'op1', sourceModule: 'op_mod', category: 'Operational', severity: 'LOW', fiduciaryCriticality: 'NO_IMPACT', cognitivePriority: 'BACKGROUND_LOG', escalationRequired: false, timestamp: '1'
    };
    
    for (let i = 0; i < 6; i++) {
      governor.throttle(signal);
    }
    
    const criticalSignal: GovernanceSignal = {
      id: 'crit1', sourceModule: 'op_mod', category: 'Operational', severity: 'CRITICAL', fiduciaryCriticality: 'SEVERE_BREACH', cognitivePriority: 'IMMEDIATE_ACTION', escalationRequired: true, timestamp: '2'
    };
    
    const res = governor.throttle(criticalSignal);
    expect(res.status).toBe('READY');
  });
});
