import { describe, it, expect } from 'vitest';
import { BalanceSheetIntelligenceUseCase } from '../../../capabilities/financial/application/usecases/BalanceSheetIntelligenceUseCase';

describe('BalanceSheetReasoning Integration', () => {
  it('should return excessive liquidity strengths and attentions given extreme metrics', () => {
    const useCase = new BalanceSheetIntelligenceUseCase();
    
    // Simulating the inputs: Current Ratio = 11.97, Cash/Assets = 54.5%
    const mockData = {
       indicators: [
         { name: 'current_ratio', value: 11.97 },
         { name: 'cash_to_assets', value: 0.545 }
       ]
    };

    const output = useCase.analyzeBalanceSheet(mockData);

    expect(output).toBeDefined();
    expect(output.financialInsights).toBeDefined();
    
    // Strengths
    const strengths = output.financialInsights.strengths;
    expect(strengths.some(s => s.includes('Alta autonomia financeira'))).toBe(true);

    // Attention Points
    const attentions = output.financialInsights.attentionPoints;
    expect(attentions.some(a => a.includes('Capital possivelmente subutilizado'))).toBe(true);
    
    // Confidence
    expect(output.governance.confidence.score).toBeGreaterThan(90);
  });
});
