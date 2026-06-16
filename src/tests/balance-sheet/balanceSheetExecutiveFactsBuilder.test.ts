import test from 'node:test';
import assert from 'node:assert';
import { BalanceSheetExecutiveFactsBuilder } from '../../core/runtime/executive-consolidation/BalanceSheetExecutiveFactsBuilder';

test('BalanceSheetExecutiveFactsBuilder', async (t) => {
  await t.test('must extract strict quantitative values for Granatum 2025', () => {
    const mockReport = {
      context: { analysisYear: 2025 },
      patrimonialIntelligenceReport: {
        bpSummary: {
          patrimonioLiquido: 1000000,
          capitalGiroLiquido: 1830998,
          saldoTesouraria: 1231692
        }
      }
    };
    const mockIndicators = [
      { metricName: 'Liquidez Corrente', value: '11.97' },
      { metricName: 'Liquidez Imediata', value: '7.65' },
      { metricName: 'Autonomia Financeira', value: '92.9' },
      { metricName: 'Endividamento Geral', value: '7.1' },
      { metricName: 'Relação Dívida / Patrimônio Líquido', value: '0.08' }
    ];

    const facts = BalanceSheetExecutiveFactsBuilder.build(mockReport, mockIndicators);
    
    assert.strictEqual(facts.year, 2025);
    assert.strictEqual(facts.workingCapital, 1830998);
    assert.strictEqual(facts.treasuryBalance, 1231692);
    assert.strictEqual(facts.liquidityCurrent, 11.97);
    assert.strictEqual(facts.liquidityImmediate, 7.65);
    assert.strictEqual(facts.financialAutonomy, 92.9);
    assert.strictEqual(facts.debtRatio, 7.1);
    assert.strictEqual(facts.debtToEquity, 0.08);
  });
});
