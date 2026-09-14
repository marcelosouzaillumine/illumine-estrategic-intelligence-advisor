/// <reference types="vitest" />
import { describe, it, expect } from 'vitest';
import { PartnerDistributionEngine } from '../platform-distribution/src';

describe('@illumine/governance (Wave 19.2 Partner Distribution Matching Engine)', () => {
  it('should match partner automatically based on specialty, geo and industry vertical (PDN v1.0)', () => {
    const dist = PartnerDistributionEngine.matchPartner('partner-01', 'company-granatum', 'FINANCIAL');
    expect(dist.matchedSpecialty).toBe('FINANCIAL');
    expect(dist.matchingScore).toBeGreaterThan(95);
    expect(dist.status).toBe('ACTIVE');
  });
});
