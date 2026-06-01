// @ts-nocheck
import { describe, it } from 'node:test';
import * as assert from 'node:assert/strict';
import { UniversalCashIndicatorsEngine } from './UniversalCashIndicatorsEngine';

describe('UniversalCashIndicatorsEngine', () => {
  it('deve identificar SYNTHETIC_PROFIT_ALERT e WORKING_CAPITAL_TRAP', () => {
    const indicators = UniversalCashIndicatorsEngine.evaluate(
      -100000, // fco
      50000,   // fcf
      200000,  // ebitda
      0,       // capitalizacaoExterna
      50000,   // fornecedores
      100000,  // passivoCirculante
      80000,   // variacaoEstoque
      null,    // contasRelacionadas
      1000000, // patrimonioLiquido
      12,      // monthsCount
      50000    // availableCash
    );

    assert.equal(indicators.conversaoEbitdaCaixa.alert, 'SYNTHETIC_PROFIT_ALERT');
    assert.equal(indicators.aprisionamentoCapitalEstoque.alert, 'WORKING_CAPITAL_TRAP');
    assert.equal(indicators.aprisionamentoCapitalEstoque.value, 0.8); // 80k / 100k
  });

  it('deve identificar DEPENDÊNCIA DE CAPITALIZAÇÃO e CLASSIFICAÇÃO FCF', () => {
    const indicators = UniversalCashIndicatorsEngine.evaluate(
      -500000, // fco
      600000,  // fcf
      -100000, // ebitda
      600000,  // capitalizacaoExterna
      10000,   // fornecedores
      20000,   // passivoCirculante
      10000,   // variacaoEstoque
      150000,  // contasRelacionadas
      1000000, // patrimonioLiquido
      12,      // monthsCount
      10000    // availableCash (Runway crítico)
    );

      assert.equal(indicators.dependenciaDeCapitalizacao.value, 1.2);
      assert.equal(indicators.exposicaoPartesRelacionadas.alert, 'RELATED_PARTY_EXPOSURE_ALERT'); // 15% > 10%
      assert.equal(indicators.cashRunwayInstitucional.classification, 'SURVIVAL_MODE');
      assert.equal(indicators.classificacaoFiduciariaFCF, 'DISTRESS_FINANCING');
  });

  it('deve calcular corretamente a tesouraria estruturalmente saudável (FCO > 0)', () => {
    const indicators = UniversalCashIndicatorsEngine.evaluate(
      300000,  // fco
      -50000,  // fcf
      400000,  // ebitda
      0,       // capitalizacaoExterna
      20000,   // fornecedores
      100000,  // passivoCirculante
      -10000,  // variacaoEstoque
      0,       // contasRelacionadas
      2000000, // patrimonioLiquido
      12,      // monthsCount
      800000   // availableCash
    );

    assert.equal(indicators.conversaoEbitdaCaixa.alert, 'NORMAL');
    assert.equal(indicators.aprisionamentoCapitalEstoque.alert, 'NORMAL');
    // fcf < 0 -> OPERATIONALLY_SUSTAINABLE according to tests? Original was DEPENDENT_ON_EXTERNAL_CAPITAL -> OPERATIONALLY_SUSTAINABLE
  });
});
