import { describe, it, expect } from 'vitest';
import { BalanceSheetIntelligenceUseCase } from '../../../../capabilities/financial/application/usecases/BalanceSheetIntelligenceUseCase';

describe('FinancialPositionSignalContinuity', () => {
  it('should have signals when there are material exposures', () => {
    const rawData = [
      { 
        ano: 2025, 
        ativoTotal: 1500, 
        estoques: 450, // 30% -> Medium
        caixaEquivalentes: 800 // 53.3% -> Medium
      }
    ];

    const useCase = new BalanceSheetIntelligenceUseCase();
    const contract = useCase.analyzeBalanceSheet({ current: Array.isArray(rawData) ? rawData[rawData.length - 1] : rawData, analysisPeriod: 2024, history: Array.isArray(rawData) ? rawData : [rawData] });

    expect(contract.pureViewModel.signals.available).toBe(true);
    expect(contract.pureViewModel.signals.items.length).toBeGreaterThan(0);
    expect(contract.pureViewModel.executiveQuestions.length).toBeGreaterThan(0);
  });
});
