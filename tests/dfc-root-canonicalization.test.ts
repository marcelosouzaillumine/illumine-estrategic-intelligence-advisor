import { test, describe } from 'node:test';
import * as assert from 'node:assert';
import { DFCSemanticCanonicalRootResolver } from '../src/core/runtime/lifecycle/DFCSemanticCanonicalRootResolver';
import { DFCSemanticRenderingGuard } from '../src/core/runtime/lifecycle/DFCSemanticRenderingGuard';
import { LegacyDFCAdapter } from '../src/runtime/adapters/LegacyDFCAdapter';

describe('DFC Root Canonicalization Framework (DRCF)', () => {
  test('Test 1: If executiveNarrative includes "fase inicial de capitalização", canonical root must be ELSA', () => {
    const result = DFCSemanticCanonicalRootResolver.resolve({
      semanticSource: 'LEGACY',
      executiveNarrative: 'A companhia encontra-se em fase inicial de capitalização.'
    });
    assert.strictEqual(result.canonicalRoot, 'ELSA');
    assert.strictEqual(result.canonicalized, true);
  });

  test('Test 2: If cqsSemantic.lifecycleStage === INITIAL_CAPITALIZATION, canonical root must be ELSA', () => {
    const result = DFCSemanticCanonicalRootResolver.resolve({
      semanticSource: 'LEGACY',
      cqsSemantic: { lifecycleStage: 'INITIAL_CAPITALIZATION' }
    });
    assert.strictEqual(result.canonicalRoot, 'ELSA');
    assert.strictEqual(result.canonicalized, true);
  });

  test('Test 3: If eqsSemantic.lifecycleStage === INITIAL_CAPITALIZATION, canonical root must be ELSA', () => {
    const result = DFCSemanticCanonicalRootResolver.resolve({
      semanticSource: 'LEGACY',
      eqsSemantic: { lifecycleStage: 'INITIAL_CAPITALIZATION' }
    });
    assert.strictEqual(result.canonicalRoot, 'ELSA');
    assert.strictEqual(result.canonicalized, true);
  });

  test('Test 4: If semanticContext.semanticSource === ELSA, canonical root must be ELSA', () => {
    const result = DFCSemanticCanonicalRootResolver.resolve({
      semanticSource: 'LEGACY',
      semanticContext: { semanticSource: 'ELSA' }
    });
    assert.strictEqual(result.canonicalRoot, 'ELSA');
    assert.strictEqual(result.canonicalized, true);
  });

  test('Test 5: If no ELSA evidence exists, canonical root may be LEGACY', () => {
    const result = DFCSemanticCanonicalRootResolver.resolve({
      semanticSource: 'LEGACY',
      executiveNarrative: 'A companhia possui estrutura madura.'
    });
    assert.strictEqual(result.canonicalRoot, 'LEGACY');
    assert.strictEqual(result.canonicalized, false);
  });

  test('Test 6 & 7: DFC_NON_CANONICAL_ROOT warning is emitted when root differs from canonicalRoot', () => {
    const audit = {
      root: 'LEGACY',
      canonicalRoot: 'ELSA'
    };
    const violation = DFCSemanticRenderingGuard.auditSemanticRoot(audit, 'ELSA');
    assert.strictEqual(violation?.code, 'DFC_NON_CANONICAL_ROOT');
    assert.strictEqual(violation?.severity, 'WARNING');
  });

  test('Test 8: DFC_CANONICAL_ROOT_RENDER_MISMATCH is emitted when UI renders LEGACY while canonicalRoot is ELSA', () => {
    const audit = {
      root: 'ELSA',
      canonicalRoot: 'ELSA'
    };
    const violation = DFCSemanticRenderingGuard.auditSemanticRoot(audit, 'LEGACY');
    assert.strictEqual(violation?.code, 'DFC_CANONICAL_ROOT_RENDER_MISMATCH');
    assert.strictEqual(violation?.severity, 'CRITICAL');
    assert.strictEqual(violation?.blocked, true);
  });

  test('Test 9: No DFC financial metric changes after canonicalization', async () => {
    // We execute the LegacyDFCAdapter with standard input and ensure financials aren't mutated
    const mockContext = {
      input: {
        rawFinancialData: {
          filterYear: 2022,
          allHistoryData: [
            { year: 2022, docType: 'dfc', conta: 'fco liquido', val: 100 },
            { year: 2022, docType: 'dfc', conta: 'fci liquido', val: -50 },
            { year: 2022, docType: 'dfc', conta: 'fcf liquido', val: -20 },
            { year: 2022, docType: 'dre', conta: 'lucro liquido', val: 50 },
            { year: 2022, docType: 'bp', conta: 'caixa e equivalentes', val: 30 }
          ]
        }
      }
    };
    const result = await LegacyDFCAdapter.execute(mockContext as any);
    const metrics = result.inference?.metrics as any;

    assert.strictEqual(metrics.fco, 100);
    assert.strictEqual(metrics.fci, -50);
    assert.strictEqual(metrics.fcf, -20);
    
    // Test the requested fields explicitly
    assert.ok(metrics.fiduciary.fcoOperacionalReal !== undefined);
    assert.ok(metrics.fiduciary.runway !== undefined);
    assert.ok(metrics.fiduciary.cashQuality.score !== undefined);
    assert.ok(metrics.fiduciary.earningsQuality.score !== undefined);
    assert.ok(metrics.fiduciary.reconciliationGap !== undefined);
  });

  test('Test 10: Granatum 2022 DFC returns correct canonical structure', () => {
    // Testing the resolver logic equivalent to Granatum ELSA scenario
    const result = DFCSemanticCanonicalRootResolver.resolve({
      semanticSource: 'LEGACY',
      executiveNarrative: 'fase inicial de capitalização'
    });
    assert.strictEqual(result.root, 'ELSA');
    assert.strictEqual(result.canonicalRoot, 'ELSA');
    assert.strictEqual(result.resolvedRoot, 'ELSA');
    assert.strictEqual(result.canonicalized, true);
  });
});
