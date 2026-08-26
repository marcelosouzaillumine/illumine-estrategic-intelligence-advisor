import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import assert from 'node:assert';
import { ExecutiveSemanticRegistry } from '../../../src/core/runtime/executive-consolidation/ExecutiveSemanticRegistry';

describe('BP v7.18 - Semantic Matrix Isolation', () => {
  it('Should block expansion terms in CRITICAL_LIQUIDITY_STRESS', () => {
    const rawText = 'A empresa precisa focar em otimização, dividendos e expansão do capital ocioso.';
    const result = ExecutiveSemanticRegistry.enforceSemanticMatrix(rawText, 'CRITICAL_LIQUIDITY_STRESS', true);
    
    assert.strictEqual(result.violations.length > 0, true);
    assert.strictEqual(result.text.includes('expansão'), false);
    assert.strictEqual(result.text.includes('otimização'), false);
    assert.strictEqual(result.text.includes('dividendos'), false);
  });

  it('Should block excess terms in EXPANSION_WITH_DISCIPLINE', () => {
    const rawText = 'O excesso estrutural de liquidez permite otimização de capital excedente com recompra.';
    const result = ExecutiveSemanticRegistry.enforceSemanticMatrix(rawText, 'EXPANSION_WITH_DISCIPLINE', true);
    
    assert.strictEqual(result.violations.length > 0, true);
    assert.strictEqual(result.text.includes('excesso estrutural de liquidez'), false);
    assert.strictEqual(result.text.includes('recompra'), false);
  });

  it('Should traverse ViewModel and log violations in test mode', () => {
    const vm = {
      executiveOpinion: 'A empresa tem excesso de liquidez e expansão agressiva',
      nested: {
        text: 'A asfixia do caixa é total'
      }
    };
    const sanitized = ExecutiveSemanticRegistry.enforceViewModelSemanticMatrix(vm, 'EXCESS_LIQUIDITY_OPTIMIZATION', true);
    
    assert.strictEqual(sanitized._semanticViolations !== undefined, true);
    assert.strictEqual(sanitized.executiveOpinion.includes('asfixia'), false);
    assert.strictEqual(sanitized.nested.text.includes('asfixia'), false);
  });
});
