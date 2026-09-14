import { CashExecutiveAdvisoryEngine } from '../../src/capabilities/financial/runtime/cash-intelligence/CashExecutiveAdvisoryEngine';

describe('CashExecutiveAdvisoryEngine lineage handling', () => {
  it('should produce a deterministic lineageHash', () => {
    const payload1 = CashExecutiveAdvisoryEngine.generatePayload(true, true, 'constraintA', true);
    const payload2 = CashExecutiveAdvisoryEngine.generatePayload(true, true, 'constraintA', true);
    expect(payload1.lineageHash).toBe(payload2.lineageHash);
  });

  it('should throw in test environment when lineageHash is missing', () => {
    const originalEnv = process.env.NODE_ENV;
    process.env.NODE_ENV = 'test';
    const broken = { ...CashExecutiveAdvisoryEngine.compress(true, true, 'c', true) } as any;
    const { RuntimeLineageGuard } = require('../../src/workspace/runtime/executive-consolidation/RuntimeLineageGuard');
    expect(() => RuntimeLineageGuard.validate(broken)).toThrow();
    process.env.NODE_ENV = originalEnv;
  });
});
