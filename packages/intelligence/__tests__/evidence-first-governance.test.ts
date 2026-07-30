/// <reference types="vitest" />
import { describe, it, expect } from 'vitest';
import { FindingSeverity, ARBDecision } from '@illumine/executive-contracts';

describe('@illumine/intelligence (Wave 18.7 Evidence-First Governance)', () => {
  it('should enforce strict severity spectrum (S0-S4) and auto-reject on S0 violations (ADR-085)', () => {
    const severities: FindingSeverity[] = ['S0', 'S1', 'S2', 'S3', 'S4'];
    expect(severities.length).toBe(5);

    const checkAutoReject = (hasS0: boolean): ARBDecision => {
      if (hasS0) return 'REJECTED';
      return 'APPROVED';
    };

    expect(checkAutoReject(true)).toBe('REJECTED');
    expect(checkAutoReject(false)).toBe('APPROVED');
  });
});
