import { describe, it, expect } from 'vitest';
import { BalanceSheetIntelligenceUseCase } from '../../../../capabilities/financial/application/usecases/BalanceSheetIntelligenceUseCase';

describe('TraceabilityChain', () => {
  it('should link Question -> Signal -> Interpretation -> Evidence -> Metric -> Source', () => {
    const rawData = [
      { ano: 2025, estoques: 3000, ativoTotal: 10000 }
    ];
    
    const useCase = new BalanceSheetIntelligenceUseCase();
    const result = useCase.analyzeBalanceSheet({ current: Array.isArray(rawData) ? rawData[rawData.length - 1] : rawData, analysisPeriod: 2024, history: Array.isArray(rawData) ? rawData : [rawData] });
    
    const signals = result.pureViewModel.signals.items;
    const signal = signals.find(s => s.id === 'inventory_concentration_monitor');
    expect(signal).toBeDefined();
    
    // Check Interpretation
    expect(signal?.interpretation?.text).toBeDefined();
    
    // Check Traceability Evidence
    expect(signal?.traceability).toBeDefined();
    expect(signal?.traceability?.metric?.name).toBeDefined();
    expect(signal?.traceability?.sourceType).toBe('balance_sheet');
    
    // Check Questions
    const questionId = signal?.relatedQuestion;
    const question = result.pureViewModel.executiveQuestions.find(q => q.id === questionId);
    expect(question).toBeDefined();
  });
});
