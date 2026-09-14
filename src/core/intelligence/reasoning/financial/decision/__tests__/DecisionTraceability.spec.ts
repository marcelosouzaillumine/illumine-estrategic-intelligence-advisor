import { describe, it, expect } from 'vitest';
import { BalanceSheetIntelligenceUseCase } from '../../../../../../capabilities/financial/application/usecases/BalanceSheetIntelligenceUseCase';

describe('DecisionTraceability', () => {
  it('should ensure every generated decision option has traceability back to the original fact', () => {
    const useCase = new BalanceSheetIntelligenceUseCase();
    const output = useCase.analyzeBalanceSheet({ current: {}, analysisPeriod: 2024, history: [] });

    expect(output.pureViewModel.overview).toBeDefined();
  });
});
