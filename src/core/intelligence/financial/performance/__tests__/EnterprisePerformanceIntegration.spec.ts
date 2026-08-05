import { describe, it, expect } from 'vitest';
import { FinancialIntelligenceContextBuilder } from '../../builder/FinancialIntelligenceContextBuilder';
import { FinancialPerformanceDiagnosticEngine } from '../engines/FinancialPerformanceDiagnosticEngine';
import { FinancialPerformanceContext } from '../context/FinancialPerformanceContext';

describe('EnterprisePerformanceIntegration', () => {
  it('should unify statements context and run performance engines to yield the final narrative', () => {
    const builder = new FinancialIntelligenceContextBuilder();
    
    // Simulate fetching full context
    const fullContext = builder.buildContext(
      'tenant', 'comp', '2025', 
      {}, 
      { margins: { net: 10 } }, 
      { operatingCashFlow: -50 }, 
      []
    );

    const perfContext = {
      revenueGrowth: 20, // growing
      ebitdaMargin: 5 // falling
    } as FinancialPerformanceContext;

    const diagEngine = new FinancialPerformanceDiagnosticEngine();
    const output = diagEngine.synthesize(perfContext, fullContext);

    // Should detect VALUE_DESTRUCTION_RISK (growing rev, falling margin, negative cash)
    expect(output.diagnosis).toContain("expansão comercial");
    expect(output.diagnosis).toContain("deterioração");
    expect(output.signals.attentionPoints).toContain("Lucro sem conversão em caixa");
  });
});
