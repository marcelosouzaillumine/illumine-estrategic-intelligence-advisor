import { describe, it, expect } from 'vitest';
import { FinancialPositionScoreEngine } from '../../../../capabilities/financial/intelligence/score/FinancialPositionScoreEngine';

describe('FinancialPositionScoreQuality', () => {
  it('should maintain strict factual and quantitative boundaries', () => {
    const scoreData = FinancialPositionScoreEngine.calculate(
      { 
        liquidity: [{ name: 'Liquidez Corrente', value: 1.5, status: 'GOOD', classification: 'GOOD' } as any],  
        workingCapital: [], assetQuality: [], solvencyAndCapitalStructure: []
      },
      1,
      null
    );

    const json = JSON.stringify(scoreData).toLowerCase();

    // Should NOT contain prescriptive or overly generalized statements
    const FORBIDDEN_TERMS = [
      'empresa saudável',
      'empresa ruim',
      'deve melhorar',
      'precisa reduzir',
      'recomendamos'
    ];

    FORBIDDEN_TERMS.forEach(term => {
      expect(json).not.toContain(term);
    });
    
    // Should contain strictly structural terms
    expect(json).toContain('posição');
    expect(json).toContain('cobertura');
  });
});
