import { test, describe } from 'node:test';
import * as assert from 'node:assert';
import { ExecutiveLifecycleContextResolver } from '../src/core/runtime/lifecycle/ExecutiveLifecycleContextResolver';
import { LegacyDFCAdapter } from '../src/runtime/adapters/LegacyDFCAdapter';
import { DFCSemanticCanonicalRootResolver } from '../src/core/runtime/lifecycle/DFCSemanticCanonicalRootResolver';

describe('Executive Lifecycle Abstraction Framework (ELAF) v1.0', () => {

  test('Test 1 & 2 & 3: Executive UI payloads do not expose ELSA, LEGACY, or canonicalRoot', () => {
    const context = ExecutiveLifecycleContextResolver.resolve(
      'INITIAL_CAPITALIZATION',
      'Fase Inicial de Capitalização'
    );

    const contextString = JSON.stringify(context);
    assert.ok(!contextString.includes('ELSA'));
    assert.ok(!contextString.includes('LEGACY'));
    assert.ok(!contextString.includes('canonicalRoot'));
  });

  test('Test 4 & 5: Executive UI renders "Fase Inicial de Capitalização" and human-readable description', () => {
    const context = ExecutiveLifecycleContextResolver.resolve(
      'INITIAL_CAPITALIZATION',
      'Fase Inicial de Capitalização'
    );

    assert.strictEqual(context.executiveBadge, 'Fase Inicial de Capitalização');
    assert.strictEqual(context.executiveDescription, 'A instituição encontra-se em fase de estruturação e tração inicial, com elevada dependência de capital para sustentar operações e formação de caixa.');
    assert.strictEqual(context.executiveTitle, 'Contexto Empresarial');
  });

  test('Test 6: verify semanticAudit remains available (LegacyDFCAdapter integration)', async () => {
    const mockContext = {
      input: {
        rawFinancialData: {
          filterYear: 2022,
          allHistoryData: [
            { year: 2022, docType: 'dfc', conta: 'fco liquido', val: 100 },
            { year: 2022, docType: 'dre', conta: 'lucro liquido', val: 50 },
            { year: 2022, docType: 'bp', conta: 'caixa e equivalentes', val: 30 }
          ]
        }
      }
    };
    const result = await LegacyDFCAdapter.execute(mockContext as any);
    
    // Validate audit preservation
    assert.ok(result.inference?.semanticAudit !== undefined);
    assert.strictEqual(result.inference?.semanticAudit?.root, 'ELSA'); 
    
    // Validate executive abstraction presence
    assert.ok(result.inference?.executiveLifecycleContext !== undefined);
  });

  test('Test 7: Verify no financial metric changes occur during abstraction injection', async () => {
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
  });

  test('Test 8: Granatum 2022 equivalent fallback correctly renders executive context', () => {
    // Equivalent logic resolving phase
    const canonical = DFCSemanticCanonicalRootResolver.resolve({
      semanticSource: 'LEGACY',
      executiveNarrative: 'fase inicial de capitalização'
    });

    const context = ExecutiveLifecycleContextResolver.resolve(
      canonical.lifecycleStage,
      canonical.lifecycleLabel
    );

    assert.strictEqual(context.executiveTitle, 'Contexto Empresarial');
    assert.strictEqual(context.executiveBadge, 'Fase Inicial de Capitalização');
    assert.strictEqual(context.executiveDescription, 'A instituição encontra-se em fase de estruturação e tração inicial, com elevada dependência de capital para sustentar operações e formação de caixa.');
  });
  
  test('Test 9: Unknown states provide an elegant fallback', () => {
    const context = ExecutiveLifecycleContextResolver.resolve(
      'UNKNOWN_STAGE',
      'Desconhecido'
    );

    assert.strictEqual(context.executiveBadge, 'Desconhecido');
    assert.strictEqual(context.executiveDescription, 'Estágio de maturidade atual não identificado, em zona de transição, ou com dados mistos insuficientes.');
  });
});
