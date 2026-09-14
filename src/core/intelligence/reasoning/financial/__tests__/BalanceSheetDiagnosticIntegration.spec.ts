import { describe, it, expect } from 'vitest';
import { BalanceSheetIntelligenceUseCase } from '../../../../../capabilities/financial/application/usecases/BalanceSheetIntelligenceUseCase';

describe('BalanceSheetDiagnosticIntegration', () => {
  it('should ensure the diagnostic flow injects financialDiagnosis containing CFO questions', () => {
    const useCase = new BalanceSheetIntelligenceUseCase();
    const output: any = useCase.analyzeBalanceSheet({
      current: { ano: 2025, ativoTotal: 1000, estoques: 600, passivoTotal: 500, patrimonioLiquido: 500 },
      analysisPeriod: 2025,
      history: [
        { ano: 2024, ativoTotal: 1000, estoques: 600, passivoTotal: 500, patrimonioLiquido: 500 },
        { ano: 2025, ativoTotal: 1000, estoques: 600, passivoTotal: 500, patrimonioLiquido: 500 }
      ]
    } as any);

    expect(output).toBeDefined();
    expect(output.pureViewModel.diagnosis).toBeDefined();
    expect(output.pureViewModel.executiveQuestions).toBeDefined();
    
    // Verifying Executive Questions are generated and passed to the artifact
    expect(output.pureViewModel.executiveQuestions.length).toBeGreaterThan(0);
  });
});
