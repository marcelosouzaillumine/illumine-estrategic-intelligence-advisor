/// <reference types="vitest" />
import { describe, it, expect } from 'vitest';
import { EnterpriseEntityResolutionEngine } from '../enterprise-knowledge-foundation/src';

describe('@illumine/intelligence (Wave 19.2.5 Enterprise Entity Resolution Engine)', () => {
  it('should resolve heterogenous entities deterministically with 100% tax ID confidence', () => {
    const res = EnterpriseEntityResolutionEngine.resolveEntity('sap-erp', 'CUST-8812', '12345678000199');
    expect(res.matchConfidencePercent).toBe(100);
    expect(res.resolutionStrategy).toBe('EXACT_TAX_ID');
  });
});
