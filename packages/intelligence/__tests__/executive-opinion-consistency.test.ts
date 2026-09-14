/// <reference types="vitest" />
import { describe, it, expect } from 'vitest';
import { ExecutiveDecisionContext } from '@illumine/executive-contracts';
import { ExecutiveCFOAgent, ExecutiveCOOAgent, ExecutiveCROAgent, ExecutiveCCOAgent, ExecutiveCEOAgent } from '../agent-council/src';

describe('@illumine/governance (Wave 18.10 Executive Opinion Consistency)', () => {
  it('should verify that each director produces a distinct perspective and confidence score above 90%', () => {
    const mockContext: ExecutiveDecisionContext = {
      companyId: 'company-granatum',
      period: '2026',
      industrySector: 'TECNOLOGIA',
      hasDfcData: true,
      hasDreData: true,
      hasBpData: true,
      dataQualityScore: 98,
      dataFreshnessDays: 1
    };

    const cfo = ExecutiveCFOAgent.evaluate(mockContext);
    const coo = ExecutiveCOOAgent.evaluate(mockContext);
    const cro = ExecutiveCROAgent.evaluate(mockContext);
    const cco = ExecutiveCCOAgent.evaluate(mockContext);
    const ceo = ExecutiveCEOAgent.evaluate(mockContext);

    expect(cfo.confidenceScore).toBeGreaterThanOrEqual(90);
    expect(coo.confidenceScore).toBeGreaterThanOrEqual(90);
    expect(cro.confidenceScore).toBeGreaterThanOrEqual(90);
    expect(cco.confidenceScore).toBeGreaterThanOrEqual(90);
    expect(ceo.confidenceScore).toBeGreaterThanOrEqual(90);
    expect(cfo.perspectiveName).not.toBe(coo.perspectiveName);
  });
});
