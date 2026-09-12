import test from 'node:test';
import assert from 'node:assert';
import { DLPALegacyLabelScanner } from '../src/workspace/runtime/lifecycle/DLPALegacyLabelScanner';
import { CapitalGovernanceAdapter } from '../src/core/runtime/capital-governance/capital-governance-adapter';
import { FinancialRuntimeContextAdapter } from '../src/core/runtime/financial-context/FinancialRuntimeContextAdapter';

test('DLPA Final Legacy Label Elimination Framework (DLPA-FLLEF) v1.0', async (t) => {
  await t.test('Test 1: Verify semanticSource === ELSA', () => {
    const contextAdapter = new FinancialRuntimeContextAdapter();
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

    const result = CapitalGovernanceAdapter.process(
      [{ year: 2022, capitalSocial: 100000 }],
      -50000, -50000, 0, 100000, 50000, 0, context
    );

    assert.strictEqual(result.semanticSource, 'ELSA');
    assert.strictEqual(result.semantic?.semanticSource, 'ELSA');
  });

  await t.test('Test 2, 3, 5: Verify DLPA_EXECUTIVE_LEGACY_LABEL_LEAK triggers when a raw label reaches executive rendering', () => {
    assert.throws(() => {
      DLPALegacyLabelScanner.scanRenderedLabels('ELSA', ['WEAK CAPITAL PROTECTION']);
    }, /DLPA_EXECUTIVE_LEGACY_LABEL_LEAK/);
    
    assert.throws(() => {
      DLPALegacyLabelScanner.scanRenderedLabels('ELSA', ['HIGH CAPITAL EROSION']);
    }, /DLPA_EXECUTIVE_LEGACY_LABEL_LEAK/);
    
    assert.throws(() => {
      DLPALegacyLabelScanner.scanRenderedLabels('ELSA', ['Governança Crítica']);
    }, /DLPA_EXECUTIVE_LEGACY_LABEL_LEAK/);
  });

  await t.test('Test 4: Verify resolvedCapitalStatus is rendered cleanly (no throw)', () => {
    assert.doesNotThrow(() => {
      DLPALegacyLabelScanner.scanRenderedLabels('ELSA', ['Base de Capital em Expansão', 'Estrutura Patrimonial em Consolidação']);
    });
  });
});
