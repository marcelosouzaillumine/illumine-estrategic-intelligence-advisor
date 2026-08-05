import { describe, it, expect, beforeEach } from 'vitest';
import { ExecutiveResponseEngine } from '../ExecutiveResponseEngine';

describe('ExecutiveResponseEngine', () => {
  let engine: ExecutiveResponseEngine;

  beforeEach(() => {
    engine = new ExecutiveResponseEngine();
  });

  it('should format retrieved context into the standard output contract', () => {
    const context = {
      profile: 'GROWTH',
      criticalFindings: [{ finding: 'BURN_RATE', severity: 'HIGH', origin: 'Cash', period: '2025' }]
    };

    const response = engine.synthesize(context, "A resposta base.");
    
    expect(response.answer).toBe("A resposta base.");
    expect(response.evidence.length).toBe(2); // 1 profile + 1 finding
    expect(response.insights.length).toBe(1);
  });
});
