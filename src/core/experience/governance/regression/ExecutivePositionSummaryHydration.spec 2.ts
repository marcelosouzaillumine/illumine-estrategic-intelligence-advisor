import { describe, it, expect } from 'vitest';
import { BalanceSheetIntelligenceUseCase } from '../../../../capabilities/financial/application/usecases/BalanceSheetIntelligenceUseCase';

describe('ExecutivePositionSummaryHydration', () => {
  it('should generate a summary with status, strengths and attention points from raw data', () => {
    const rawData = [
      { ano: 2025, ativoTotal: 1500, passivoTotal: 750, patrimonioLiquido: 750, estoques: 450, caixaEquivalentes: 800 }
    ];

    const useCase = new BalanceSheetIntelligenceUseCase();
    const contract = useCase.analyzeBalanceSheet({ current: Array.isArray(rawData) ? rawData[rawData.length - 1] : rawData, analysisPeriod: 2024, history: Array.isArray(rawData) ? rawData : [rawData] });
    const summary = contract.pureViewModel.executiveSummary!;

    expect(contract.pureViewModel.executiveSummary!.available).toBe(true);
    expect(summary.status.classification).toBeDefined();
    expect(summary.status.narrative).toBeDefined();
    
    // It should have attention points based on the mock data
    expect(summary.attentionPoints.length).toBeGreaterThan(0);
    expect(summary.centralQuestion.question).toBeDefined();
  });
});
