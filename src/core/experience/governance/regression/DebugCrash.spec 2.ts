import { BalanceSheetIntelligenceUseCase } from '../../../../capabilities/financial/application/usecases/BalanceSheetIntelligenceUseCase';
import { describe, it, expect } from 'vitest';

describe('Debug Crash', () => {
  it('should not crash', () => {
    const input = {
      current: {
        ano: 2025,
        ativoTotal: 2342899.29,
        ativoCirculante: 1997906.06
      },
      history: [
        {
          ano: 2025,
          ativoTotal: 2342899.29,
          ativoCirculante: 1997906.06
        }
      ],
      analysisPeriod: 2025
    };

    const usecase = new BalanceSheetIntelligenceUseCase();
    const result = usecase.analyzeBalanceSheet(input as any);
    console.log(result.pureViewModel.overview);
  });
});
