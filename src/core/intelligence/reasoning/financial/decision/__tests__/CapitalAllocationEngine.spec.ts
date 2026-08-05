import { describe, it, expect, beforeEach } from 'vitest';
import { CapitalAllocationEngine, CapitalAllocationContext } from '../CapitalAllocationEngine';

describe('CapitalAllocationEngine', () => {
  let engine: CapitalAllocationEngine;

  beforeEach(() => {
    engine = new CapitalAllocationEngine();
  });

  it('should generate capital allocation alternatives when Cash Available > Operational Requirement', () => {
    const context: CapitalAllocationContext = {
      liquidityLevel: 'High',
      cashAvailable: 50,
      operationalRequirement: 20,
      debtLevel: 'Low',
      growthOpportunity: true
    };

    const options = engine.evaluateOptions(context);
    
    expect(options.length).toBeGreaterThan(0);
    expect(options.some(o => o.category === 'GROWTH')).toBe(true);
    expect(options.some(o => o.category === 'CAPITAL_ALLOCATION')).toBe(true);
  });

  it('should not suggest debt reduction if debt level is not High', () => {
    const context: CapitalAllocationContext = {
      liquidityLevel: 'High',
      cashAvailable: 50,
      operationalRequirement: 20,
      debtLevel: 'Low',
      growthOpportunity: false
    };

    const options = engine.evaluateOptions(context);
    expect(options.some(o => o.category === 'DEBT_MANAGEMENT')).toBe(false);
  });
});
