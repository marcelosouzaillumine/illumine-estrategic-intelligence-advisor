/// <reference types="vitest" />
import { describe, it, expect } from 'vitest';
import { RevenueSharingLedgerEngine } from '../platform-distribution/src';

describe('@illumine/intelligence (Wave 19.2 Revenue Sharing Ledger Engine)', () => {
  it('should calculate audit-ready multi-party revenue splits with ledger hashes', () => {
    const split = RevenueSharingLedgerEngine.calculateSplit(10000);
    expect(split.platformRoyaltyAmount).toBe(1500);
    expect(split.partnerCommissionAmount).toBe(5000);
    expect(split.advisorShareAmount).toBe(2500);
    expect(split.holdingOverrideAmount).toBe(1000);
    expect(split.ledgerHash).toBeDefined();
  });
});
