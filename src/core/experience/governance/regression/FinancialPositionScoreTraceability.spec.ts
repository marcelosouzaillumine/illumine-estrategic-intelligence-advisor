import { describe, it, expect } from 'vitest';
import { FinancialPositionScoreEngine } from '../../../../capabilities/financial/intelligence/score/FinancialPositionScoreEngine';

describe('FinancialPositionScoreTraceability', () => {
  it('should guarantee that every dimension is backed by a metric evidence', () => {
    const scoreData = FinancialPositionScoreEngine.calculate(
      { 
        liquidity: [{ name: 'Current Ratio', value: 1.5, status: 'GOOD' } as any],  
        workingCapital: [{ name: 'Working Capital', value: 1000, status: 'GOOD' } as any], 
        assetQuality: [{ name: 'Asset Turnover', value: 2, status: 'GOOD' } as any], 
        solvencyAndCapitalStructure: [{ name: 'Debt to Equity', value: 0.5, status: 'GOOD' } as any],  
      },
      3,
      null
    );

    const dimensions = Object.values(scoreData.dimensions);

    dimensions.forEach(dim => {
      // Must have at least one trace origin metric
      expect(dim.evidence).toBeDefined();
      expect(dim.evidence.metrics.length).toBeGreaterThan(0);
      
      // Must explicitly declare confidence level
      expect(dim.confidence).toBeDefined();
      expect(['LOW', 'MEDIUM', 'HIGH']).toContain(dim.confidence);
    });

    // High level traceability logic
    expect(scoreData.methodology.calculatedAt).toBeDefined();
    expect(scoreData.methodology.dataPeriods).toBe(3);
  });
});
