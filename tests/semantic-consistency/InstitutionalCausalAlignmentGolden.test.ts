import test from 'node:test';
import assert from 'node:assert';
import { InstitutionalCausalAlignmentEngine } from '../../src/core/runtime/semantic-consistency/InstitutionalCausalAlignmentEngine';
import { ConflictSeverity } from '../../src/core/runtime/semantic-consistency/CrossEngineSemanticConsistencyEngine';
import { SemanticConcept } from '../../src/core/runtime/semantic-consistency/ExecutiveSemanticRegistry';

test('▶ Institutional Causal Alignment Golden Tests', async (t) => {
  await t.test('✔ 1. Generates causal explanation for Execution Capacity conflict', () => {
    const conflicts = [
      {
        concept: SemanticConcept.EXECUTION_CAPACITY,
        severity: ConflictSeverity.CRITICAL_CONTRADICTION,
        engines: ['EFOS', 'Governance Journey'],
        details: 'EFOS (STRONG) vs Governance Journey (VERY_WEAK)'
      }
    ];

    const exp = InstitutionalCausalAlignmentEngine.generateCausalExplanation(conflicts);
    assert.ok(exp.includes('restrições operacionais que limitam severamente'));
  });

  await t.test('✔ 2. Generates default success message when no conflicts', () => {
    const exp = InstitutionalCausalAlignmentEngine.generateCausalExplanation([]);
    assert.strictEqual(exp, 'A organização apresenta consistência em todas as perspectivas avaliadas.');
  });
});
