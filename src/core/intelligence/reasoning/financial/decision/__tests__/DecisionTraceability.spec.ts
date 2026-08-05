import { describe, it, expect } from 'vitest';
import { BalanceSheetIntelligenceUseCase } from '../../../../../../capabilities/financial/application/usecases/BalanceSheetIntelligenceUseCase';

describe('DecisionTraceability', () => {
  it('should ensure every generated decision option has traceability back to the original fact', () => {
    const useCase = new BalanceSheetIntelligenceUseCase();
    const output = useCase.analyzeBalanceSheet({});

    expect(output.financialDecisionContext).toBeDefined();
    const options = output.financialDecisionContext.options;

    // Verify traceability requirement
    for (const opt of options) {
      expect(opt.governance).toBeDefined();
      expect(opt.governance.requiresHumanApproval).toBe(true);
      expect(opt.governance.evidence).toBeDefined();
      expect(opt.governance.evidence.length).toBeGreaterThan(0);
    }
  });
});
