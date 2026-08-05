import { describe, it, expect } from 'vitest';
import { BalanceSheetIntelligenceUseCase } from '../../../../../capabilities/financial/application/usecases/BalanceSheetIntelligenceUseCase';

describe('BalanceSheetDiagnosticIntegration', () => {
  it('should ensure the diagnostic flow injects financialDiagnosis containing CFO questions', () => {
    const useCase = new BalanceSheetIntelligenceUseCase();
    const output = useCase.analyzeBalanceSheet({});

    expect(output).toBeDefined();
    expect(output.financialDiagnosis).toBeDefined();
    expect(output.financialDiagnosis.diagnosis).toBeDefined();
    
    // Verifying CFO Questions are generated and passed to the artifact
    expect(output.financialDiagnosis.cfoQuestions.length).toBeGreaterThan(0);
    expect(output.financialDiagnosis.cfoQuestions[0]).toContain('plano de crescimento');
  });
});
