import { describe, it, expect, beforeEach } from 'vitest';
import { FinancialRelationshipEngine, FinancialContext } from '../FinancialRelationshipEngine';

describe('FinancialRelationshipEngine', () => {
  let engine: FinancialRelationshipEngine;

  beforeEach(() => {
    engine = new FinancialRelationshipEngine();
  });

  it('should identify a Conservative Capital Structure when liquidity is High, debt is Low, and cash concentration is High', () => {
    const context: FinancialContext = {
      liquidity: 'High',
      debt: 'Low',
      cashConcentration: 'High',
      workingCapital: 'Positive'
    };

    const relationships = engine.evaluate(context);
    expect(relationships.length).toBe(1);
    expect(relationships[0].relationship).toBe('Conservative Capital Structure');
  });

  it('should identify Heavy Operational Asset Drag when inventory concentration is High and liquidity is Medium', () => {
    const context: FinancialContext = {
      liquidity: 'Medium',
      debt: 'Low',
      cashConcentration: 'Low',
      workingCapital: 'Neutral',
      inventoryConcentration: 'High'
    };

    const relationships = engine.evaluate(context);
    expect(relationships.length).toBe(1);
    expect(relationships[0].relationship).toBe('Heavy Operational Asset Drag');
  });
});
