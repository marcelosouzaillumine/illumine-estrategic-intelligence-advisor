import test from 'node:test';
import assert from 'node:assert';
import { NarrativeConsistencyEngine, NarrativeStatus } from '../../src/core/runtime/semantic-consistency/NarrativeConsistencyEngine';

test('▶ Narrative Consistency Golden Tests', async (t) => {
  await t.test('✔ 1. Identifies compatible positive narratives', () => {
    const narratives = [
      'A empresa demonstra forte capacidade de crescimento.',
      'O cenário é de excelente solidez.'
    ];
    const status = NarrativeConsistencyEngine.evaluate(narratives);
    assert.strictEqual(status, NarrativeStatus.COMPATIBLE);
  });

  await t.test('✔ 2. Identifies conflicting narratives', () => {
    const narratives = [
      'A empresa demonstra forte capacidade de crescimento.',
      'A organização enfrenta limitações severas para expansão.'
    ];
    const status = NarrativeConsistencyEngine.evaluate(narratives);
    assert.strictEqual(status, NarrativeStatus.NARRATIVE_CONFLICT);
  });

  await t.test('✔ 3. Identifies compatible negative narratives', () => {
    const narratives = [
      'A organização enfrenta risco crítico de insolvência.',
      'O estágio atual apresenta fraqueza operacional.'
    ];
    // Both negative, no conflict
    const status = NarrativeConsistencyEngine.evaluate(narratives);
    assert.strictEqual(status, NarrativeStatus.COMPATIBLE);
  });
});
