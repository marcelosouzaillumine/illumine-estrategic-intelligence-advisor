/// <reference types="vitest" />
import { describe, it, expect } from 'vitest';
import { DecisionDriftMonitor } from '../decision-trust-governance/src';

describe('@illumine/governance (Wave 18.10.5 Decision Drift Monitor)', () => {
  it('should monitor forecast drift against historical errors', () => {
    const report = DecisionDriftMonitor.evaluateDrift([1.2, 2.1, 1.8]);
    expect(report.isHealthy).toBe(true);
    expect(report.modelDriftPercent).toBe(1.7);
  });
});
