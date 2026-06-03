import { test, describe } from 'node:test';
import * as assert from 'node:assert';
import { BoardPackExecutiveRenderingGuard } from '../src/core/runtime/lifecycle/BoardPackExecutiveRenderingGuard';

describe('Board Pack ELSA Executive Consistency Framework (BPEECF) v1.0', () => {

  test('Test 1: Allow valid rendering when semanticSource is ELSA', () => {
    const validContent = JSON.stringify({
      capitalStatus: 'Base de Capital em Expansão',
      governanceStatus: 'Governança em Consolidação',
      score: 100
    });

    assert.doesNotThrow(() => {
      BoardPackExecutiveRenderingGuard.validate('ELSA', validContent);
    });
  });

  test('Test 2: Throw when WEAK CAPITAL PROTECTION leaks under ELSA', () => {
    const invalidContent = JSON.stringify({
      capitalStatus: 'WEAK CAPITAL PROTECTION',
      score: 40
    });

    assert.throws(
      () => BoardPackExecutiveRenderingGuard.validate('ELSA', invalidContent),
      /\[BOARD_PACK_EXECUTIVE_LEGACY_LABEL_LEAK\] CRITICAL/
    );
  });

  test('Test 3: Throw when HIGH CAPITAL EROSION leaks under ELSA', () => {
    const invalidContent = JSON.stringify({
      capitalStatus: 'High Capital Erosion'
    });

    assert.throws(
      () => BoardPackExecutiveRenderingGuard.validate('ELSA', invalidContent),
      /\[BOARD_PACK_EXECUTIVE_LEGACY_LABEL_LEAK\] CRITICAL/
    );
  });

  test('Test 4: Throw when Governança Crítica leaks under ELSA', () => {
    const invalidContent = JSON.stringify({
      governanceStatus: 'Governança Crítica'
    });

    assert.throws(
      () => BoardPackExecutiveRenderingGuard.validate('ELSA', invalidContent),
      /\[BOARD_PACK_EXECUTIVE_LEGACY_LABEL_LEAK\] CRITICAL/
    );
  });

  test('Test 5: Allow legacy labels when semanticSource is LEGACY', () => {
    const validLegacyContent = JSON.stringify({
      capitalStatus: 'WEAK CAPITAL PROTECTION',
      governanceStatus: 'Governança Crítica'
    });

    assert.doesNotThrow(() => {
      BoardPackExecutiveRenderingGuard.validate('LEGACY', validLegacyContent);
    });
  });

});
