import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import assert from 'node:assert';
import { BalanceSheetExecutiveNarrativeEngine } from '../../capabilities/runtime/governance/bp/BalanceSheetExecutiveNarrativeEngine';

describe('BalanceSheetYearlyNarrativeCalibration', () => {
  it('Should emit exact causal string when reserves are consumed and liquidity is reduced', () => {
    const indicators = [
      { metricName: 'Crescimento do PL', value: -0.15 },
      { metricName: 'Liquidez Real', value: 0.8 },
      { metricName: 'Liquidez Instantânea Real', value: 0.4 }
    ];

    const summary = {
      patrimonioLiquido: 5000,
      ativoTotal: 10000,
      caixaEquivalentes: 100,
      passivoCirculante: 500
    };

    const result = BalanceSheetExecutiveNarrativeEngine.generate(indicators, summary, 2024, 'hash');
    
    // BP should not emit "deterioração das margens"
    assert.strictEqual(result.text.includes('deterioração das margens'), false);

    // BP should emit the exact strings
    assert.ok(result.text.includes('Consumo de reservas impactou o PL em -15,0%.'));
    assert.ok(result.text.includes('Compressão de caixa reduziu liquidez para 0,80.'));
  });
});
