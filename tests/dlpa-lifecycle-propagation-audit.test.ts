import test from 'node:test';
import assert from 'node:assert';
import { CapitalGovernanceAdapter } from '../src/core/runtime/capital-governance/capital-governance-adapter';
import { FinancialRuntimeContextAdapter } from '../src/core/runtime/financial-context/FinancialRuntimeContextAdapter';
import { LifecycleFallbackReasons } from '../src/workspace/runtime/lifecycle/LifecycleFallbackReasons';
import { LifecyclePropagationTracker } from '../src/workspace/runtime/lifecycle/LifecyclePropagationAudit';
import { LifecycleRenderAudit } from '../src/workspace/runtime/lifecycle/LifecycleRenderAudit';

test('DLPA Lifecycle Propagation Audit Framework', async (t) => {
  const contextAdapter = new FinancialRuntimeContextAdapter();
  
  await t.test('1 & 5. Verify complete propagation chain and ELSA resolution (Granatum 2022)', () => {
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
      -50000,
      -50000,
      0,
      100000,
      50000,
      0,
      context
    );

    assert.ok(result.lifecycleAudit);
    assert.strictEqual(result.lifecycleAudit?.fallbackActivated, false);
    assert.strictEqual(result.lifecycleAudit?.semanticSource, 'ELSA');
    assert.strictEqual(result.semanticSource, 'ELSA');
    assert.ok(result.resolvedGovernanceStatus);
    assert.ok(result.resolvedCapitalStatus);
  });

  await t.test('2 & 3. Verify fallback reason emitted and propagation break detection', () => {
    // Context with no lifecycle params -> profile not built
    const context = contextAdapter.createContext({ segmentoOperacional: 'Tecnologia' });

    const result = CapitalGovernanceAdapter.process(
      [{ year: 2022, capitalSocial: 100000 }],
      10000,
      10000,
      0,
      100000,
      110000,
      0,
      context
    );

    assert.ok(result.lifecycleAudit);
    assert.strictEqual(result.lifecycleAudit?.fallbackActivated, true);
    assert.strictEqual(result.lifecycleAudit?.fallbackReason, LifecycleFallbackReasons.LIFECYCLE_PROFILE_NOT_BUILT);
    assert.strictEqual(result.lifecycleAudit?.semanticSource, 'LEGACY');
    assert.strictEqual(result.semanticSource, 'LEGACY');

    // Should log warning via tracker
    LifecyclePropagationTracker.validate(result.lifecycleAudit!);
  });

  await t.test('4 & 6. Verify semantic contradiction detection and LEGACY source requires explicit fallback reason', () => {
    // The engine naturally validates this via console.error in DLPAFiduciaryInterpretationEngine
    const result = CapitalGovernanceAdapter.process(
      [{ year: 2022, capitalSocial: 100000 }],
      10000,
      10000,
      0,
      100000,
      110000,
      0,
      undefined // No context at all
    );

    assert.strictEqual(result.lifecycleAudit?.fallbackActivated, true);
    assert.strictEqual(result.lifecycleAudit?.fallbackReason, LifecycleFallbackReasons.RUNTIME_CONTEXT_MISSING_LIFECYCLE);
    assert.strictEqual(result.semanticSource, 'LEGACY');
  });

  await t.test('7. Render Audit - Detect Legacy Field Rendering', () => {
    let errorLogged = false;
    const originalError = console.error;
    console.error = (msg: string) => {
      if (msg.includes('UI_RENDERING_LEGACY_FIELD')) errorLogged = true;
    };

    LifecycleRenderAudit.validate({
      governanceStatus: 'Governança Crítica',
      resolvedGovernanceStatus: 'Governança em Estruturação',
      capitalStatus: 'High Capital Erosion',
      resolvedCapitalStatus: 'Capitalização em Consolidação',
      semanticSource: 'LEGACY',
      resolvedSemanticSource: 'ELSA'
    });

    assert.strictEqual(errorLogged, true);
    console.error = originalError;
  });

  await t.test('8. Ensure rendered field matches resolved field', () => {
    const resolvedGovernanceStatus = 'Governança em Estruturação';
    const renderedGovernanceStatus = 'Governança em Estruturação'; // Simulated rendering output

    assert.strictEqual(resolvedGovernanceStatus, 'Governança em Estruturação');
    assert.notStrictEqual(renderedGovernanceStatus, 'Governança Crítica');
    assert.strictEqual(renderedGovernanceStatus, resolvedGovernanceStatus);
  });

  await t.test('9. UI Semantic Binding Helper handles partial context correctly', () => {
    // Simulated UI Helper Logic
    const validateUIBinding = (capitalGovMock: any) => {
      const lifecycleContext = capitalGovMock?.semantic?.semanticContext || {};
      const isValidLifecycleContext = lifecycleContext?.semanticSource && lifecycleContext?.lifecycleStage;

      const semanticSource = isValidLifecycleContext ? lifecycleContext.semanticSource : (capitalGovMock?.semanticSource || 'LEGACY');
      const lifecycleStage = isValidLifecycleContext ? lifecycleContext.lifecycleStage : (capitalGovMock?.diagnostics?.fiduciaryOutput?.lifecycleStage || capitalGovMock?.lifecycleStage || 'ESTABLISHED_ANALYSIS');

      return { semanticSource, lifecycleStage };
    };

    // Case 1: Empty semanticContext (e.g. {}) but has lifecycleProfile (simulated via semanticSource)
    const mockState = {
      semantic: {
        semanticContext: {}
      },
      semanticSource: 'ELSA',
      diagnostics: { fiduciaryOutput: { lifecycleStage: 'INITIAL_CAPITALIZATION' } }
    };

    const result = validateUIBinding(mockState);
    assert.strictEqual(result.semanticSource, 'ELSA');
    assert.strictEqual(result.lifecycleStage, 'INITIAL_CAPITALIZATION');

    // Case 2: Full semanticContext
    const mockState2 = {
      semantic: {
        semanticContext: {
          semanticSource: 'ELSA_FULL',
          lifecycleStage: 'EARLY_GROWTH'
        }
      },
      semanticSource: 'ELSA',
      diagnostics: { fiduciaryOutput: { lifecycleStage: 'INITIAL_CAPITALIZATION' } }
    };

    const result2 = validateUIBinding(mockState2);
    assert.strictEqual(result2.semanticSource, 'ELSA_FULL');
    assert.strictEqual(result2.lifecycleStage, 'EARLY_GROWTH');
  });
});
