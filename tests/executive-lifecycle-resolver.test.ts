import { test, describe } from 'node:test';
import assert from 'node:assert/strict';
import { ExecutiveLifecycleContextResolver } from '../src/workspace/runtime/lifecycle/ExecutiveLifecycleContextResolver';

describe('ExecutiveLifecycleContextResolver (ELAF v1.0)', () => {
  test('1. Does not use semanticSource or canonicalRoot, strictly lifecycleStage and lifecycleLabel', () => {
    // There are no semanticSource or canonicalRoot parameters in the method signature
    const result = ExecutiveLifecycleContextResolver.resolve('INITIAL_CAPITALIZATION', 'Fase Inicial de Capitalização');
    assert.strictEqual(result.executiveTitle, 'Contexto Empresarial');
    assert.strictEqual(result.executiveBadge, 'Fase Inicial de Capitalização');
    assert.ok(result.executiveDescription.includes('fase de estruturação e tração inicial'));
  });

  test('2. Elegant fallback when no lifecycle is provided', () => {
    const result1 = ExecutiveLifecycleContextResolver.resolve(undefined, undefined);
    assert.strictEqual(result1.executiveTitle, 'Contexto Empresarial');
    assert.strictEqual(result1.executiveBadge, 'Contexto empresarial não classificado');
    assert.strictEqual(result1.executiveDescription, 'Os dados disponíveis não permitem determinar com segurança o estágio empresarial.');
    
    const result2 = ExecutiveLifecycleContextResolver.resolve('', '');
    assert.strictEqual(result2.executiveTitle, 'Contexto Empresarial');
    assert.strictEqual(result2.executiveBadge, 'Contexto empresarial não classificado');
    assert.strictEqual(result2.executiveDescription, 'Os dados disponíveis não permitem determinar com segurança o estágio empresarial.');
  });

  test('3. Maps SCALING_PHASE correctly', () => {
    const result = ExecutiveLifecycleContextResolver.resolve('SCALING_PHASE', 'Fase de Escala');
    assert.strictEqual(result.executiveBadge, 'Fase de Escala');
    assert.ok(result.executiveDescription.includes('ganho de escala operacional'));
  });

  test('4. UNKNOWN lifecycle mapping', () => {
    const result = ExecutiveLifecycleContextResolver.resolve('UNKNOWN', 'Desconhecido');
    assert.strictEqual(result.executiveBadge, 'Desconhecido');
    assert.strictEqual(result.executiveDescription, 'Estágio de maturidade atual não identificado, em zona de transição, ou com dados mistos insuficientes.');
  });
});
