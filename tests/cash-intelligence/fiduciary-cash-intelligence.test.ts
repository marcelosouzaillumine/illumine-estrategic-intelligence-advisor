// @ts-nocheck
import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { FiduciaryCashIntelligenceRuntime } from '../../src/capabilities/financial/runtime/cash-intelligence/FiduciaryCashIntelligenceRuntime';

describe('Fiduciary Cash Governance System - Protocol Scenarios', () => {
  
  it('1. Falso Caixa Positivo - deve barrar conclusões saudáveis', () => {
    // FCO negativo, FCF positivo grande, resultando em caixa positivo final alto.
    // DFC: FCO = -500.000, FCI = 0, FCF = 10.500.000 (Variação DFC = +10.000.000)
    // BP Caixa: Inicial = 0, Final = 10.000.000 (Variação BP = +10.000.000)
    const report = FiduciaryCashIntelligenceRuntime.evaluate(
      [{ grupo: 'Atividades Operacionais', val: -500000 }, { grupo: 'Atividades de Financiamento', val: 10500000 }],
      -100000, // Net Income < 0
      0,       // EBITDA
      0,       // BP Caixa Inicial
      10000000, // BP Caixa Final
      -500000,  // FCO
      0,        // FCI
      10500000, // FCF
      0, 0, 0,
      10000000, // availableCash
      10500000, // thirdPartyFunding
      0,        // equityFunding
      2,        // cycles
      12, 0, 0, null, 0 // monthsCount, fornecedores, passivoCirculante, contasRelacionadas, patrimonioLiquido
    );

    assert.strictEqual(report.isAvailable, true);
    assert.strictEqual(report.artificialLiquidityDetected.isArtificial, true);
    assert.ok(report.blockedConclusions.includes('HEALTHY_LIQUIDITY'));
    assert.ok(report.blockedConclusions.includes('SUSTAINABLE_GROWTH'));
    assert.ok(report.artificialLiquidityDetected.diagnoses.includes('EXTERNAL_SURVIVAL_SUPPORT'));
  });

  it('2. Sobrevivência Financiada - classificação dependente de capital', () => {
    const report = FiduciaryCashIntelligenceRuntime.evaluate(
      [{ grupo: 'Atividades Operacionais', val: -100000 }, { grupo: 'Atividades de Financiamento', val: 150000 }],
      -50000,
      0,
      10000,
      60000,
      -100000, // FCO < 0
      0,
      150000,  // FCF > 0 (mascara queima)
      0, 0, 0,
      60000,   // availableCash
      150000,
      0,
      2,
      12, 0, 0, null, 0
    );

    assert.strictEqual(report.liquidityClassification.classification, 'ARTIFICIAL_LIQUIDITY');
    assert.strictEqual(report.liquidityClassification.severity, 'ESTRESSADO');
    assert.ok(report.continuityRisk.liquidityDependency);
  });

  it('3. Divergência BP x DFC - deve emitir alerta e bloquear acima de 10%', () => {
    // DFC: FCO = -50.000, FCI = 0, FCF = 0 (Variação DFC = -50.000)
    // BP Caixa: Inicial = 100.000, Final = 10.000 (Variação BP = -90.000)
    // Divergência de 40.000 em relação à variação de 90.000 (44.4% > 10%)
    const report = FiduciaryCashIntelligenceRuntime.evaluate(
      [{ grupo: 'Atividades Operacionais', val: -50000 }],
      10000,
      20000,
      100000, // BP Inicial
      10000,  // BP Final (Variação = -90.000)
      -50000, // FCO
      0,
      0, 0, 0,
      10000,
      0, 0, 2,
      12, 0, 0, null, 0
    );

    assert.strictEqual(report.isAvailable, false);
    assert.strictEqual(report.reconciliationAlerts.reconciliationStatus, 'BLOCKED');
    assert.strictEqual(report.reconciliationAlerts.temporalSeverity, 'CRITICAL');
    assert.ok(report.reconciliationAlerts.alerts.includes('ALERTA_FIDUCIARIO_RECONCILIACAO'));
  });

  it('4. Liquidez Artificial - detecção automática de distorções', () => {
    const report = FiduciaryCashIntelligenceRuntime.evaluate(
      [{ grupo: 'Atividades Operacionais', val: -20000 }, { grupo: 'Atividades de Financiamento', val: 50000 }],
      -10000,
      0,
      5000,
      35000,
      -20000, // FCO
      0,
      50000,  // FCF > ABS(FCO)
      0, 0, 0,
      35000,
      50000,
      0,
      2,
      12, 0, 0, null, 0
    );

    assert.strictEqual(report.artificialLiquidityDetected.isArtificial, true);
    assert.ok(report.artificialLiquidityDetected.liquidityDistortionFactors.includes('debt_dependency'));
  });

  it('5. Sustentabilidade Operacional - autofinanciamento e consistência', () => {
    const report = FiduciaryCashIntelligenceRuntime.evaluate(
      [{ grupo: 'Atividades Operacionais', val: 500000 }],
      300000, // lucro positivo
      400000, // ebitda positivo
      100000,
      600000,
      500000, // FCO > 0
      -50000, // reinvestimento
      0,
      0, 0, 0,
      600000,
      0, 0, 3,
      12, 0, 0, null, 0
    );

    assert.strictEqual(report.distributionSustainability.isSustained, true);
    assert.strictEqual(report.distributionSustainability.selfFinancingCapacity, 'HIGH');
    assert.strictEqual(report.distributionSustainability.operationalCashConsistency, 'HIGH_CONSISTENCY');
    assert.strictEqual(report.distributionSustainability.operationalFragilityIndex, 0);
  });

  it('6. Continuidade Institucional - risco de ruptura e runway', () => {
    // FCO negativo (-120.000) -> Consumo de caixa = 120.000 anual -> 10.000 mensal.
    // Caixa = 30.000 -> Runway esperado de 3 meses (< 6 meses -> Risco Crítico).
    const report = FiduciaryCashIntelligenceRuntime.evaluate(
      [{ grupo: 'Atividades Operacionais', val: -120000 }],
      -50000,
      0,
      150000,
      30000,
      -120000, // FCO
      0,
      0,
      0, 0, 0,
      30000,
      0, 0, 2,
      12, 0, 0, null, 0
    );

    assert.strictEqual(report.continuityRisk.continuityRisk, 'CRITICAL');
    assert.strictEqual(report.continuityRisk.hasRuptureRisk, true);
    assert.strictEqual(report.continuityRisk.projectedRunwayMonths, 3.0);
    assert.strictEqual(report.continuityRisk.runwayStability, 'COLLAPSING');
    assert.ok(report.continuityRisk.continuityRiskDrivers.includes('recurring_negative_fco'));
    assert.ok(report.continuityRisk.continuityRiskDrivers.includes('short_runway'));
    assert.ok(report.continuityRisk.recommendedActions.includes('Suspender preventivamente novos Capex operacionais.'));
  });

});
