import { test as it, describe } from 'node:test';
import assert from 'node:assert/strict';
import { EconomicValueIntelligenceEngine } from '../src/core/runtime/governance/dre/EconomicValueIntelligenceEngine';
import { EarningsCompositionEngine } from '../src/core/runtime/governance/dre/EarningsCompositionEngine';
import { InstitutionalConfidenceEngine } from '../src/core/runtime/confidence/InstitutionalConfidenceEngine';

describe('DRE Executive Intelligence Pack', () => {
  describe('EconomicValueIntelligenceEngine', () => {
    it('should classify as VALUE_DESTROYING when EBITDA < 0, Lucro < 0 and scale < 0.8', () => {
      const result = EconomicValueIntelligenceEngine.evaluate(100000, -20000, -10000, 200000);
      assert.strictEqual(result.classification, 'VALUE_DESTROYING');
      assert.strictEqual(result.economicScaleRatio, 0.5); // 100k / 200k
    });

    it('should NOT classify as VALUE_CREATING if profit is positive but revenue is below PE', () => {
      // Teste 1: Lucro = R$ 5.000, PE = R$ 500.000, Receita = R$ 420.000
      // economicScaleRatio = 420.000 / 500.000 = 0.84 (>= 0.8 is considered OK for VALUE_CREATING if EBITDA/Lucro > 0)
      // Wait, the rule says < 0.8 is not VALUE_CREATING. Let's make it 300.000
      const result1 = EconomicValueIntelligenceEngine.evaluate(300000, 5000, 10000, 500000);
      assert.strictEqual(result1.classification, 'VALUE_NEUTRAL');
      assert.strictEqual(result1.economicScaleRatio, 0.6); // < 0.8
    });

    it('should classify as VALUE_CREATING when EBITDA > 0, Lucro > 0 and scale >= 0.8', () => {
      const result = EconomicValueIntelligenceEngine.evaluate(600000, 50000, 60000, 500000);
      assert.strictEqual(result.classification, 'VALUE_CREATING');
      assert.strictEqual(result.economicScaleRatio, 1.2);
    });
  });

  describe('EarningsCompositionEngine', () => {
    it('should classify as LOW_QUALITY_EARNINGS when profit is driven by non-operating revenue', () => {
      // Teste 2: Operação = negativa, Venda de ativo (não operacional) = positiva, Lucro final = positivo
      // Receita Liquida = 500.000
      // Outras Receitas = 200.000
      // Resultado Financeiro = 0
      // Lucro Liquido = 50.000
      // Lucro Bruto (Operacao base proxy) = -50.000
      const result = EarningsCompositionEngine.evaluate(500000, 200000, 0, 50000, -50000, false);
      assert.strictEqual(result.classification, 'LOW_QUALITY_EARNINGS');
      // Total Effect = |-50k| + |200k| = 250k
      // Non-Recurring Weight = 200k / 250k = 80%
      assert.strictEqual(result.nonRecurringWeight, 80);
    });

    it('should classify as HIGH_QUALITY_EARNINGS when profit is purely operational', () => {
      const result = EarningsCompositionEngine.evaluate(500000, 0, -10000, 50000, 100000, false);
      assert.strictEqual(result.classification, 'HIGH_QUALITY_EARNINGS');
      // Total Effect = |100k| + |-10k| = 110k
      // Recurring Weight = 100k / 110k = ~90.9%
      assert.ok(result.recurringRevenueWeight > 90);
    });

    it('should classify as UNDETERMINED_EARNINGS_QUALITY when chart of accounts is simplified', () => {
      const result = EarningsCompositionEngine.evaluate(500000, 0, -10000, 50000, 100000, true);
      assert.strictEqual(result.classification, 'UNDETERMINED_EARNINGS_QUALITY');
    });
  });

  describe('InstitutionalConfidenceEngine', () => {
    it('should classify as HIGH_CONFIDENCE when all conditions are optimal', () => {
      const result = InstitutionalConfidenceEngine.evaluate(true, true, 3, false, false);
      assert.strictEqual(result.classification, 'HIGH_CONFIDENCE');
      assert.strictEqual(result.score, 100);
    });

    it('should classify as MODERATE_CONFIDENCE when missing history', () => {
      const result = InstitutionalConfidenceEngine.evaluate(true, true, 1, false, false);
      assert.strictEqual(result.classification, 'MODERATE_CONFIDENCE');
      assert.strictEqual(result.score, 80); // 25 + 25 + 0 + 15 + 15
    });

    it('should classify as LOW_CONFIDENCE when lacking reconciliations and history', () => {
      const result = InstitutionalConfidenceEngine.evaluate(false, false, 1, true, true);
      assert.strictEqual(result.classification, 'LOW_CONFIDENCE');
      assert.strictEqual(result.score, 0);
    });
  });
});
