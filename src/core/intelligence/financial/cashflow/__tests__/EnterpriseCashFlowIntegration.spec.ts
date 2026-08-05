import { describe, it, expect } from 'vitest';
import { CashFlowDiagnosticEngine } from '../engines/CashFlowDiagnosticEngine';
import { FinancialPerformanceContext } from '../../performance/context/FinancialPerformanceContext';
import { FinancialStatementContext } from '../../context/FinancialStatementContext';
import { CashFlowIntelligenceContext } from '../context/CashFlowIntelligenceContext';
import { CashGenerationProfile } from '../context/CashGenerationProfile';

describe('EnterpriseCashFlowIntegration', () => {
  it('should synthesize the final reality of cash based on all engines', () => {
    const diagEngine = new CashFlowDiagnosticEngine();

    const fullContext = {
      incomeStatement: { revenue: { net: 1000 }, margins: { net: 10 } },
      balanceSheet: { assets: { receivables: 400 } },
      cashFlow: { operatingCashFlow: -50, financingCashFlow: 100, investingCashFlow: -150 }
    } as FinancialStatementContext;

    const perfContext = {
      revenueGrowth: 40
    } as FinancialPerformanceContext;

    const cashContext = {
      cashGenerationProfile: { type: 'GROWTH_CONSUMER' } as CashGenerationProfile
    } as CashFlowIntelligenceContext;

    const output = diagEngine.synthesize(perfContext, fullContext, cashContext);

    // Assert that the Working Capital Pressure rule cascaded into the final output
    expect(output.signals.attentionPoints).toContain('Crescimento pressionando capital de giro');
    // Assert Profit Without Cash
    expect(output.signals.attentionPoints).toContain('Lucro não convertido em caixa');
    // Assert Cash Dependency Risk
    expect(output.signals.attentionPoints).toContain('Dependência de financiamento externo');
    
    // Check if CFO questions were formed
    expect(output.strategicQuestions.length).toBeGreaterThan(0);
    expect(output.strategicQuestions).toContain('O crescimento comercial está sendo financiado pela operação ou pelo caixa acumulado?');
  });
});
