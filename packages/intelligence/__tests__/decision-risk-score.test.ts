/// <reference types="vitest" />
import { describe, it, expect } from 'vitest';
import { DecisionRiskEngine } from '../decision-trust-governance/src';

describe('@illumine/governance (Wave 18.10.5 Decision Risk Score Engine)', () => {
  it('should calculate composite decision risk score across 6 risk dimensions', () => {
    const riskScores = {
      financialRiskScore: 18.0,
      operationalRiskScore: 22.0,
      strategicRiskScore: 12.0,
      executionRiskScore: 25.0,
      dataRiskScore: 5.0,
      forecastRiskScore: 14.0
    };

    const composite = DecisionRiskEngine.calculateCompositeRiskScore(riskScores);
    expect(composite).toBe(16.0);
  });
});
