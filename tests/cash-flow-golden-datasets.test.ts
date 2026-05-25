import test from 'node:test';
import assert from 'node:assert';
import { analyzeCashFlowIntelligence, CashFlowInput } from '../src/lib/cash-flow-intelligence-engine.js';

test('CASH FLOW GOLDEN DATASETS', async (t) => {

  await t.test('[DATASET 01] Artificial Cash', () => {
    const input: CashFlowInput = {
      currentCashBalance: 1000,
      monthlyCashBurnRate: 100,
      operatingCashFlow: -50,
      debtAmortization: 0,
      fundingInflows: 1500, // Alto funding artificial superando caixa atual
      partnerCapitalInjections: 0,
      receivablesAging: 30,
      overdueReceivables: 0,
      shortTermObligations: 200,
      recurringFixedCashOutflows: 100,
      seasonalityContext: false,
      businessModelContext: 'tech'
    };

    const result = analyzeCashFlowIntelligence(input);
    
    assert.strictEqual(result.cashQuality.classification, 'CAIXA_ARTIFICIAL');
    assert.strictEqual(result.financialDependency.classification, 'crítica');
    assert.ok(result.financialDependency.causalFlags.includes('funding artificial'));
    assert.ok(result.cashQuality.blockedFalsePositives.includes('Saúde Automática pelo Saldo Bancário'));
  });

  await t.test('[DATASET 02] Runway Critico', () => {
    const input: CashFlowInput = {
      currentCashBalance: 100,
      monthlyCashBurnRate: 60, // Runway = 100/60 = 1.6 meses (< 3)
      operatingCashFlow: -10,
      debtAmortization: 0,
      fundingInflows: 0,
      partnerCapitalInjections: 0,
      receivablesAging: 30,
      overdueReceivables: 60, // > 50% do caixa
      shortTermObligations: 300, // ratio < 0.5
      recurringFixedCashOutflows: 50,
      seasonalityContext: false,
      businessModelContext: 'varejo'
    };

    const result = analyzeCashFlowIntelligence(input);
    
    assert.strictEqual(result.runway.classification, 'RUNWAY_CRITICO');
    assert.strictEqual(result.treasuryPressure.classification, 'severa');
    assert.ok(result.runway.causalFlags.includes('runway insuficiente'));
    assert.ok(result.runway.causalFlags.includes('risco de ruptura'));
    assert.ok(result.treasuryPressure.causalFlags.includes('pressão por recebíveis vencidos'));
    assert.strictEqual(result.cashQuality.classification, 'CAIXA_FRAGIL');
    assert.ok(result.cashQuality.causalFlags.includes('drenagem operacional'));
  });

  await t.test('[DATASET 03] Healthy Operational Cash Flow', () => {
    const input: CashFlowInput = {
      currentCashBalance: 1000,
      monthlyCashBurnRate: -50, // Caixa crescendo
      operatingCashFlow: 300,
      debtAmortization: 50,
      fundingInflows: 0,
      partnerCapitalInjections: 0,
      receivablesAging: 30,
      overdueReceivables: 10,
      shortTermObligations: 200,
      recurringFixedCashOutflows: 100,
      seasonalityContext: false,
      businessModelContext: 'servicos'
    };

    const result = analyzeCashFlowIntelligence(input);
    
    assert.strictEqual(result.cashQuality.classification, 'CAIXA_OPERACIONAL_SAUDAVEL');
    assert.strictEqual(result.runway.classification, 'RUNWAY_SAUDAVEL');
    assert.strictEqual(result.financialDependency.classification, 'baixa');
    assert.strictEqual(result.treasuryPressure.classification, 'baixa');
  });

  await t.test('[DATASET 04] Growth Consuming Cash', () => {
    const input: CashFlowInput = {
      currentCashBalance: 500,
      monthlyCashBurnRate: 100,
      operatingCashFlow: -50,
      debtAmortization: 0,
      fundingInflows: 0,
      partnerCapitalInjections: 0,
      receivablesAging: 30,
      overdueReceivables: 0,
      shortTermObligations: 200,
      recurringFixedCashOutflows: 100,
      seasonalityContext: false,
      businessModelContext: 'tech'
    };

    const result = analyzeCashFlowIntelligence(input);
    
    assert.strictEqual(result.cashQuality.classification, 'CAIXA_DESTRUTIVO');
    assert.ok(result.cashQuality.causalFlags.includes('crescimento consumindo caixa'));
    assert.ok(result.cashQuality.blockedFalsePositives.includes('Expansão Saudável'));
  });

  await t.test('[DATASET 05] Hospital Treasury Pressure', () => {
    const input: CashFlowInput = {
      currentCashBalance: 200,
      monthlyCashBurnRate: 50,
      operatingCashFlow: -10,
      debtAmortization: 0,
      fundingInflows: 0,
      partnerCapitalInjections: 0,
      receivablesAging: 120, // recebimento muito longo
      overdueReceivables: 150, // grande volume vencido
      shortTermObligations: 500,
      recurringFixedCashOutflows: 300,
      seasonalityContext: false,
      businessModelContext: 'hospital'
    };

    const result = analyzeCashFlowIntelligence(input);
    
    assert.strictEqual(result.treasuryPressure.classification, 'severa');
    assert.ok(result.treasuryPressure.causalFlags.includes('pressão por recebíveis vencidos'));
    assert.strictEqual(result.cashQuality.classification, 'CAIXA_FRAGIL');
  });

  await t.test('[DATASET 06] Seasonal Cash Stress', () => {
    const input: CashFlowInput = {
      currentCashBalance: 300,
      monthlyCashBurnRate: 50,
      operatingCashFlow: -20,
      debtAmortization: 0,
      fundingInflows: 0,
      partnerCapitalInjections: 0,
      receivablesAging: 30,
      overdueReceivables: 0,
      shortTermObligations: 400, // ratio < 0.8 => seria elevada
      recurringFixedCashOutflows: 100,
      seasonalityContext: true, // Sazonalidade ativa!
      businessModelContext: 'agronegocio'
    };

    const result = analyzeCashFlowIntelligence(input);
    
    // Originalmente seria elevada, mas a sazonalidade reduz para "sensível"
    assert.strictEqual(result.treasuryPressure.classification, 'sensível');
    assert.ok(result.treasuryPressure.causalFlags.includes('sazonalidade recorrente'));
  });

});
