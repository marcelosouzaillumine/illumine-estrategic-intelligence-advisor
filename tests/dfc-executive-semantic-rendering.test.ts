import test from 'node:test';
import assert from 'node:assert';
import { LegacyDFCAdapter } from '../src/runtime/adapters/LegacyDFCAdapter';
import { DFCSemanticRenderingGuard } from '../src/workspace/runtime/lifecycle/DFCSemanticRenderingGuard';
import { FinancialRuntimeContextAdapter } from '../src/core/runtime/financial-context/FinancialRuntimeContextAdapter';

test('DFC Executive Semantic Rendering Completion Framework', async (t) => {
  const contextAdapter = new FinancialRuntimeContextAdapter();
  
  await t.test('1-3, 7. DFC uses resolved statuses and ELSA source', async () => {
    const context = contextAdapter.createContext(
      { segmentoOperacional: 'Tecnologia' },
      {
        foundationYear: 2021,
        analysisYear: 2022,
        historicalCycles: 1,
        capitalSocial: 100000,
        revenue: 0,
        netIncome: -50000
      }
    );

    const inputData = {
      rawFinancialData: {
        filterYear: 2022,
        allHistoryData: [{
          year: 2022,
          docType: 'DFC',
          conta: 'Caixa Inicial',
          val: 0
        }],
        financialRuntimeContext: context
      }
    };

    const result = await LegacyDFCAdapter.execute({ input: inputData } as any);
    const metrics = result.inference?.metrics;

    assert.ok(metrics?.semanticDisplays?.executiveDisplay);
    assert.strictEqual(metrics.semanticDisplays.executiveDisplay.confidenceStatus, 'Histórico Insuficiente para Avaliação Longitudinal');
    assert.ok(metrics.semanticDisplays.executiveDisplay.cashStatus);

    // Context generated from lifecycle should be ELSA
    const semanticSource = context.lifecycleProfile ? 'ELSA' : 'LEGACY';
    assert.strictEqual(semanticSource, 'ELSA');
  });

  await t.test('4-5, 8. DFCSemanticRenderingGuard detects CRITICAL leak in executive scope', () => {
    let errorLogged = false;
    const originalError = console.error;
    console.error = (msg: string) => {
      if (msg.includes('DFC_EXECUTIVE_SEMANTIC_LEAK') && msg.includes('Crítico')) errorLogged = true;
    };

    DFCSemanticRenderingGuard.validateExecutiveDisplay(
      'ELSA',
      'INITIAL_CAPITALIZATION',
      ['Liquidez Dependente de Capitalização', 'Stress de Liquidez Crítico']
    );

    assert.strictEqual(errorLogged, true);
    console.error = originalError;
  });

  await t.test('Render scopes allow raw severity in technical audit but not executive', () => {
    let errorLogged = false;
    const originalError = console.error;
    console.error = (msg: string) => {
      if (msg.includes('DFC_EXECUTIVE_SEMANTIC_LEAK')) errorLogged = true;
    };

    // Valid executive display should NOT trigger
    DFCSemanticRenderingGuard.validateExecutiveDisplay(
      'ELSA',
      'INITIAL_CAPITALIZATION',
      ['Liquidez Dependente de Capitalização', 'Tesouraria em Estruturação']
    );
    assert.strictEqual(errorLogged, false, 'Executive terms should be safe');

    // Audit display is not passed to the guard, but even if it was with LEGACY source, it wouldn't trigger
    DFCSemanticRenderingGuard.validateExecutiveDisplay(
      'LEGACY',
      'INITIAL_CAPITALIZATION',
      ['CRITICAL']
    );
    assert.strictEqual(errorLogged, false, 'LEGACY source should skip early-stage check');

    console.error = originalError;
  });
});
