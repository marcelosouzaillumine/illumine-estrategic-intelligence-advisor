import { test, describe } from 'node:test';
import * as assert from 'node:assert';
import { EarlyStageSemanticEngine } from '../src/core/runtime/semantic/EarlyStageSemanticEngine';
import { RunwayAuditEngine } from '../src/core/runtime/semantic/RunwayAuditEngine';

describe('Early Stage Semantic Governance Framework (ESGF)', () => {
  describe('Lifecycle Classification', () => {
    test('classifies companies properly', () => {
      const result = EarlyStageSemanticEngine.evaluateContext({
        foundationYear: 2021,
        analysisYear: 2022,
        historicalCycles: 1
      });

      assert.strictEqual(result.lifecycleStage, 'INITIAL_CAPITALIZATION');
      assert.strictEqual(result.semanticContext.isEarlyStage, true);
    });
  });

  describe('EarlyStageNarrativeEngine', () => {
    test('overrides narrative for INITIAL_CAPITALIZATION', () => {
      const narrative = EarlyStageSemanticEngine.generateNarrative(
        'INITIAL_CAPITALIZATION',
        'Default generic narrative.',
        true
      );
      
      assert.ok(narrative.includes('A companhia encontra-se em fase inicial de capitalização'));
      assert.ok(narrative.includes('patrimônio líquido permanece positivo'));
    });

    test('preserves default narrative for MATURE_STABLE', () => {
      const narrative = EarlyStageSemanticEngine.generateNarrative(
        'MATURE_STABLE' as any,
        'Default generic narrative.',
        true
      );
      
      assert.strictEqual(narrative, 'Default generic narrative.');
    });
  });

  describe('EarlyStageConsistencyValidator', () => {
    test('throws on semantic contradictions for early stage', () => {
      assert.throws(() => {
        EarlyStageSemanticEngine.validateNarrative(
          'INITIAL_CAPITALIZATION',
          'A empresa apresenta deterioração histórica grave.'
        );
      }, /EARLY_STAGE_SEMANTIC_CONTRADICTION/);
    });

    test('passes for non-contradictory narratives', () => {
      assert.doesNotThrow(() => {
        EarlyStageSemanticEngine.validateNarrative(
          'INITIAL_CAPITALIZATION',
          'A operação consome caixa para investimento.'
        );
      });
    });
  });

  describe('RunwayAuditEngine', () => {
    test('calculates runway properly when burning cash', () => {
      const result = RunwayAuditEngine.calculate(100000, -120000, 'Exercício 2022');
      
      assert.strictEqual(result.consumoMensalMedio, 10000);
      assert.strictEqual(result.runwayMeses, 10);
      assert.strictEqual(result.periodoBase, 'Exercício 2022');
    });

    test('handles positive cash flow with infinite runway', () => {
      const result = RunwayAuditEngine.calculate(100000, 50000, '12 meses');
      
      assert.strictEqual(result.consumoMensalMedio, 0);
      assert.strictEqual(result.runwayMeses, Infinity);
    });
  });
});
