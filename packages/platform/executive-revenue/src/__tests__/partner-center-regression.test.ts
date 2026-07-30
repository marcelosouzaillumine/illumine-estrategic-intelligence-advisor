/// <reference types="vitest" />
import { describe, it, expect } from 'vitest';
import { ExecutivePartnerCenterEngine } from '../index';

describe('Quality Gate 7 — Executive Partner Center Test', () => {
  it('should track partner tier, active shared pipeline and accrued commissions', () => {
    const partner = ExecutivePartnerCenterEngine.getPartnerStatus('Partner Teste');

    expect(partner.tier).toBe('PLATINUM');
    expect(partner.activeSharedPipelineValue).toBeGreaterThan(0);
    expect(partner.accruedCommissionsValue).toBeGreaterThan(0);
  });
});
