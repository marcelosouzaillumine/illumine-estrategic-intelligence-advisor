import { describe, it, expect, beforeEach } from 'vitest';
import { FinancialPerformanceDiagnosticEngine } from '../FinancialPerformanceDiagnosticEngine';
import { FinancialPerformanceContext } from '../../context/FinancialPerformanceContext';
import { FinancialStatementContext } from '../../../context/FinancialStatementContext';

describe('FinancialPerformanceDiagnosticEngine', () => {
  let engine: FinancialPerformanceDiagnosticEngine;

  beforeEach(() => {
    engine = new FinancialPerformanceDiagnosticEngine();
  });

  it('should generate a diagnosis with attention points if low cash conversion is detected', () => {
    const perfContext = {
      revenueGrowth: 2, // stable
      ebitdaMargin: 15 // stable
    } as FinancialPerformanceContext;

    const fullContext = {
      incomeStatement: { margins: { net: 10 } },
      cashFlow: { operatingCashFlow: -50 } // negative -> LOW_CASH_CONVERSION
    } as FinancialStatementContext;

    const output = engine.synthesize(perfContext, fullContext);
    
    expect(output.signals.attentionPoints).toContain("Lucro sem conversão em caixa");
  });
});
