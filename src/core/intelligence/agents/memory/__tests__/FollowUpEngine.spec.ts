import { describe, it, expect, beforeEach } from 'vitest';
import { ExecutiveFollowUpEngine } from '../ExecutiveFollowUpEngine';

describe('ExecutiveFollowUpEngine', () => {
  let engine: ExecutiveFollowUpEngine;

  beforeEach(() => {
    engine = new ExecutiveFollowUpEngine();
  });

  it('should suggest follow-up based on memory matching current risk', () => {
    const memory: any = {
      type: 'RISK',
      content: 'Risco de liquidez pelo alto capital de giro'
    };
    const currentContext: any = {
      financialHealthProfile: 'STRESS',
      criticalFindings: [{ finding: 'WORKING_CAPITAL_PRESSURE' }]
    };

    const message = engine.generateFollowUp(memory, currentContext);
    expect(message).toBeDefined();
    expect(message).toContain('cenário persiste');
  });
});
