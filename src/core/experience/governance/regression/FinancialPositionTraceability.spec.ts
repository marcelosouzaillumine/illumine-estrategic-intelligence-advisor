import { describe, it, expect } from 'vitest';
import { BalanceSheetIntelligenceUseCase } from '../../../../capabilities/financial/application/usecases/BalanceSheetIntelligenceUseCase';

describe('FinancialPositionTraceability', () => {
  it('should ensure trace chain: Question -> Signal -> Interpretation -> Evidence -> SourceMetric', () => {
    const useCase = new BalanceSheetIntelligenceUseCase();
    
    // We pass a mock raw data to ensure signals are generated
    const rawData = {
      assets: { current: 100, nonCurrent: 200 },
      liabilities: { current: 150, nonCurrent: 150, equity: 0 }
    };

    const output = useCase.analyzeBalanceSheet({ current: Array.isArray(rawData) ? rawData[rawData.length - 1] : rawData, analysisPeriod: 2024, history: Array.isArray(rawData) ? rawData : [rawData] });
    
    if (output.pureViewModel.signals.available) {
      for (const signal of output.pureViewModel.signals.items) {
        expect(signal.sourceMetric).toBeDefined();
        expect(signal.evidence).toBeDefined();
        expect(signal.interpretation).toBeDefined();
        expect(signal.relatedQuestion).toBeDefined();

        // Must exist a question matching this signal
        const question = output.pureViewModel.executiveQuestions.find(q => q.id === signal.relatedQuestion);
        expect(question).toBeDefined();
        expect(question?.originSignalId).toBe(signal.id);
      }
    }
  });
});
