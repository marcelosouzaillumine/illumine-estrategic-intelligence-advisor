/// <reference types="vitest" />
import { describe, it, expect } from 'vitest';
import { ExecutiveRevenueObservabilityEngine } from '../index';

describe('Quality Gate 6 — Executive Revenue Score Test', () => {
  it('should calculate ERS Score, MRR, ARR and CAC Payback', () => {
    const ers = ExecutiveRevenueObservabilityEngine.calculateERSScore('empresa-ers');

    expect(ers.ersOverallScore).toBe(97.0);
    expect(ers.arrValue).toBe(ers.mrrValue * 12);
    expect(ers.cacPaybackMonths).toBeLessThan(6);
  });
});
