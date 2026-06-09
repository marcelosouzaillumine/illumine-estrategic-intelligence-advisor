import test from 'node:test';
import assert from 'node:assert';
import { SemanticConcept } from '../../src/core/runtime/semantic-consistency/ExecutiveSemanticRegistry';
import { CrossEngineSemanticConsistencyEngine, ConflictSeverity, SemanticConsistencyStatus } from '../../src/core/runtime/semantic-consistency/CrossEngineSemanticConsistencyEngine';

test('▶ Cross-Engine Semantic Consistency Golden Tests', async (t) => {
  await t.test('✔ 1. Detects CRITICAL_CONTRADICTION correctly (Score drops to <= 70)', () => {
    const outputs = [
      { engineId: 'DFC', concept: SemanticConcept.LIQUIDITY, rawClassification: 'MUITO FORTE' }, // VERY_STRONG (5)
      { engineId: 'BP', concept: SemanticConcept.LIQUIDITY, rawClassification: 'FRACO' }        // WEAK (2) -> diff 3 = CRITICAL
    ];

    const result = CrossEngineSemanticConsistencyEngine.evaluate(outputs);
    assert.strictEqual(result.conflicts.length, 1);
    assert.strictEqual(result.conflicts[0].severity, ConflictSeverity.CRITICAL_CONTRADICTION);
    assert.strictEqual(result.score, 70); // 100 - 30
    assert.strictEqual(result.status, SemanticConsistencyStatus.CONSISTENCIA_MODERADA); // 70 is < 80, >= 60
  });

  await t.test('✔ 2. Detects MAJOR_DIVERGENCE correctly', () => {
    const outputs = [
      { engineId: 'ESG', concept: SemanticConcept.GOVERNANCE_MATURITY, rawClassification: 'STRONG' }, // 4
      { engineId: 'Governance Journey', concept: SemanticConcept.GOVERNANCE_MATURITY, rawClassification: 'WEAK' } // 2 -> diff 2 = MAJOR
    ];

    const result = CrossEngineSemanticConsistencyEngine.evaluate(outputs);
    assert.strictEqual(result.conflicts.length, 1);
    assert.strictEqual(result.conflicts[0].severity, ConflictSeverity.MAJOR_DIVERGENCE);
    assert.strictEqual(result.score, 85); // 100 - 15
  });

  await t.test('✔ 3. Detects MINOR_DIVERGENCE correctly', () => {
    const outputs = [
      { engineId: 'EFOS', concept: SemanticConcept.EXECUTION_CAPACITY, rawClassification: 'STRONG' }, // 4
      { engineId: 'Governance Journey', concept: SemanticConcept.EXECUTION_CAPACITY, rawClassification: 'MODERATE' } // 3 -> diff 1 = MINOR
    ];

    const result = CrossEngineSemanticConsistencyEngine.evaluate(outputs);
    assert.strictEqual(result.conflicts.length, 1);
    assert.strictEqual(result.conflicts[0].severity, ConflictSeverity.MINOR_DIVERGENCE);
    assert.strictEqual(result.score, 95); // 100 - 5
  });

  await t.test('✔ 4. Handles completely consistent engines', () => {
    const outputs = [
      { engineId: 'DRE', concept: SemanticConcept.GROWTH_SUSTAINABILITY, rawClassification: 'STRONG' }, // 4
      { engineId: 'ESSL', concept: SemanticConcept.GROWTH_SUSTAINABILITY, rawClassification: 'FORTE' }  // 4 -> diff 0 = CONSISTENT
    ];

    const result = CrossEngineSemanticConsistencyEngine.evaluate(outputs);
    assert.strictEqual(result.conflicts.length, 0);
    assert.strictEqual(result.score, 100);
    assert.strictEqual(result.status, SemanticConsistencyStatus.ALTA_CONSISTENCIA);
  });

  await t.test('✔ 5. Ignores unauthorized engines', () => {
    const outputs = [
      { engineId: 'BP', concept: SemanticConcept.LIQUIDITY, rawClassification: 'STRONG' }, // Allowed
      { engineId: 'ESG', concept: SemanticConcept.LIQUIDITY, rawClassification: 'WEAK' }   // NOT allowed
    ];

    const result = CrossEngineSemanticConsistencyEngine.evaluate(outputs);
    // Should not compare, only 1 valid output
    assert.strictEqual(result.conflicts.length, 0);
  });
});
