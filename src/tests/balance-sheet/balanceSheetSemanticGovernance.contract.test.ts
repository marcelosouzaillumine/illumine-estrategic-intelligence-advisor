// @ts-nocheck
import { describe, it } from 'node:test';
import * as assert from 'node:assert';
import { ExecutiveSemanticRegistry } from '../../core/runtime/executive-consolidation/ExecutiveSemanticRegistry';

describe('BalanceSheetSemanticGovernance v7.16', () => {
  it('Should block expansion terms in CRITICAL_LIQUIDITY_STRESS', () => {
    const raw = 'Temos posição confortável e ampla liquidez para lidar com a crise, com estrutura blindada.';
    const sanitized = ExecutiveSemanticRegistry.sanitizeNarrative(raw, 'CRITICAL_LIQUIDITY_STRESS');
    
    assert.ok(!sanitized.includes('posição confortável'));
    assert.ok(!sanitized.includes('ampla liquidez'));
    assert.ok(sanitized.includes('proteção fiduciária e continuidade'));
  });

  it('Should block maturity terms in EXPANSION_WITH_DISCIPLINE', () => {
    const raw = 'O capital parado e a liquidez ociosa permitem recompras e dividendos extraordinários.';
    const sanitized = ExecutiveSemanticRegistry.sanitizeNarrative(raw, 'EXPANSION_WITH_DISCIPLINE');
    
    assert.ok(!sanitized.includes('capital parado'));
    assert.ok(!sanitized.includes('liquidez ociosa'));
    assert.ok(!sanitized.includes('dividendos extraordinários'));
    assert.ok(sanitized.includes('liquidez estratégica alocada'));
  });
});
