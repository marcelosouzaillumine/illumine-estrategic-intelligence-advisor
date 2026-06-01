import { describe, it } from 'node:test';
import * as assert from 'node:assert/strict';
import { FiduciaryCashIntelligenceRuntime } from './FiduciaryCashIntelligenceRuntime';

describe('FiduciaryCashIntelligenceRuntime - Stress Tests Institucionais', () => {

  it('Cenário 1: Lucro Contábil sem Caixa', () => {
    // EBITDA positivo, Lucro positivo, mas FCO negativo. Aumento de estoque e clientes.
    const result = FiduciaryCashIntelligenceRuntime.evaluate(
      [{ id: 1 }], // dfcData simulado (reconciliação mockada/assumida sem bloqueio pra fins de teste de runtime)
      500000, // dreNetIncome
      800000, // dreEbitda
      100000, // bpCashEquivalentsStart
      100000, // bpCashEquivalentsEnd (reconcilia var zero, assume fcf e fci cobrem fco)
      -400000, // fco
      0, // fci
      400000, // fcf
      200000, // workingCapitalVariation
      300000, // receivables
      200000, // inventory
      100000, // availableCash
      400000, // thirdPartyFunding
      0, // equityFunding
      3, // historicalCyclesCount
      12, // monthsCount
      50000, // fornecedores
      100000, // passivoCirculante
      0, // contasRelacionadas
      1000000 // patrimonioLiquido
    );

    // Validações marginais
    assert.equal(result.universalIndicators.conversaoEbitdaCaixa.alert, 'SYNTHETIC_PROFIT_ALERT');
    assert.ok(result.blockedConclusions.includes('HEALTHY_LIQUIDITY'));
    assert.equal(result.fiduciaryOperationalSustainabilityAssessment.classification, 'DEPENDENT_ON_EXTERNAL_CAPITAL');
    // Não pode permitir fortes conclusões
    assert.ok(result.blockedConclusions.includes('STRONG_OPERATIONAL_GENERATION'));
  });

  it('Cenário 2: Crescimento Tóxico', () => {
    // FCO consumido por estoque e clientes (working capital trap)
    const result = FiduciaryCashIntelligenceRuntime.evaluate(
      [{ id: 1 }],
      100000, // dreNetIncome
      200000, // dreEbitda
      50000,
      10000,
      -300000, // fco
      0,
      260000, // fcf (não cobriu tudo, consumiu caixa)
      350000, // workingCapitalVariation (dreno gigante)
      200000,
      150000,
      10000, // availableCash
      260000, // thirdPartyFunding
      0,
      2,
      12,
      100000,
      200000,
      0,
      500000
    );

    assert.equal(result.universalIndicators.aprisionamentoCapitalEstoque.alert, 'WORKING_CAPITAL_TRAP');
    assert.equal(result.universalIndicators.cashRunwayInstitucional.classification, 'SURVIVAL_MODE');
    assert.ok(result.blockedConclusions.includes('HEALTHY_LIQUIDITY'));
  });

  it('Cenário 3: Liquidez Artificial por Endividamento', () => {
    // FCO negativo, FCF muito positivo, caixa alto
    const result = FiduciaryCashIntelligenceRuntime.evaluate(
      [{ id: 1 }],
      -100000,
      -50000,
      100000,
      1000000, // Caixa inflado por dívida
      -200000, // fco
      0,
      1100000, // fcf
      50000,
      50000,
      50000,
      1000000, // availableCash
      1100000, // thirdPartyFunding
      0,
      2,
      12,
      50000,
      1200000,
      0,
      500000
    );
    assert.equal(result.isAvailable, true);
    assert.equal(result.liquidityClassification.classification, 'ARTIFICIAL_LIQUIDITY');
    assert.equal(result.artificialLiquidityDetected.isArtificial, true);
    assert.ok(result.artificialLiquidityDetected.diagnoses.includes('EXTERNAL_SURVIVAL_SUPPORT'));
  });

  it('Cenário 4: Empresa Saudável', () => {
    // Reinvestimento operacional com FCO robusto
    const result = FiduciaryCashIntelligenceRuntime.evaluate(
      [{ id: 1 }],
      500000,
      700000,
      200000,
      300000,
      800000, // fco
      -400000, // fci (investimentos)
      -300000, // fcf (pagando dívida)
      10000,
      100000,
      50000,
      300000,
      0,
      0,
      5, // historicalCyclesCount longo
      12,
      50000,
      100000,
      0,
      1500000,
      {
        industrySegment: 'SAAS',
        businessModel: 'B2B',
        maturityStage: 'EXPANSION',
        inventoryIntensity: 'LOW',
        capitalIntensity: 'LOW',
        revenueModel: 'RECURRING',
        workingCapitalProfile: 'MODERATE'
      }
    );

    assert.equal(result.fiduciaryOperationalSustainabilityAssessment.classification, 'OPERATIONALLY_SUSTAINABLE');
    assert.equal(result.liquidityClassification.classification, 'REINVESTIMENTO_OPERACIONAL_SAUDAVEL');
    assert.ok(result.allowedConclusions.includes('HEALTHY_LIQUIDITY'));
    assert.equal(result.blockedConclusions.includes('HEALTHY_LIQUIDITY'), false);
  });

  it('Cenário 5: Dados Incompletos', () => {
    const result = FiduciaryCashIntelligenceRuntime.evaluate(
      [{ id: 1 }],
      100000,
      150000,
      50000,
      60000,
      20000,
      -10000,
      0,
      5000,
      10000,
      5000,
      60000,
      0,
      0,
      2,
      12,
      5000,
      15000,
      null, // Ausência de partes relacionadas
      50000
    );

    assert.equal(result.universalIndicators.exposicaoPartesRelacionadas.alert, 'NOT_AVAILABLE');
    assert.equal(result.universalIndicators.exposicaoPartesRelacionadas.value, 'NOT_AVAILABLE');
  });

});
