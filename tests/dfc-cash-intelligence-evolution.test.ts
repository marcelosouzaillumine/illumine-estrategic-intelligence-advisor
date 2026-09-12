import { describe, it } from 'node:test';
import * as assert from 'node:assert/strict';
import { CashFlowCausalIntelligenceEngine } from '../src/capabilities/financial/runtime/cash-causal-intelligence/CashFlowCausalIntelligenceEngine';
import { CashFlowScenarioEngine } from '../src/capabilities/financial/runtime/cash-scenario-intelligence/CashFlowScenarioEngine';
import { TreasuryEarlyWarningEngine } from '../src/core/runtime/treasury-early-warning/TreasuryEarlyWarningEngine';
import { TreasurySustainabilityEngine } from '../src/core/runtime/treasury-sustainability/TreasurySustainabilityEngine';
import { FiduciaryCashIntelligenceRuntime } from '../src/capabilities/financial/runtime/cash-intelligence/FiduciaryCashIntelligenceRuntime';
import { PRESENTATION_POLICIES } from '../src/workspace/runtime/presentation-governance/ExecutivePresentationPolicyRegistry';

describe('DFC Cash Flow Governance Roadmap v1.0', () => {

  describe('1. CashFlowCausalGovernanceEngine', () => {
    it('should correctly calculate driver impact percentages and rank them', () => {
      // FCO = -100
      // Drivers: netIncome = -50, varClientes = -20, varEstoque = -30, varFornecedores = 10, other obligations = -10
      const result = CashFlowCausalIntelligenceEngine.evaluate(
        -100, // FCO
        -50,  // Net Income
        -20,  // Clientes
        -30,  // Estoques
        10    // Fornecedores
      );

      assert.equal(result.fco, -100);
      assert.equal(result.fcoBasis, 'OFFICIAL_FCO');
      
      // Drivers list check
      assert.equal(result.drivers.length, 5);

      // Sorting check (Net Income should be first, impact = 50%)
      const first = result.executiveOutput.ranking[0];
      assert.equal(first.name, 'Estrutura Operacional Deficitária');
      assert.equal(first.impactPercent, 50);
      assert.equal(first.category, 'Estrutura');
      assert.equal(first.severity, 'HIGH');

      // Estoques should be second, impact = 30%
      const second = result.executiveOutput.ranking[1];
      assert.equal(second.name, 'Formação de Estoque');
      assert.equal(second.impactPercent, 30);
      assert.equal(second.category, 'Estoque');
      assert.equal(second.severity, 'MODERATE');

      // Board direct answer check
      assert.ok(result.boardOutput.answer.includes('Estrutura Operacional Deficitária'));
      assert.ok(result.boardOutput.answer.includes('Formação de Estoque'));
    });
  });

  describe('2. CashFlowScenarioEngine', () => {
    it('should simulate scenarios isolated from current state and handle positive FCO runway', () => {
      // Current available cash = 10000, current FCO = -1000, inventory = 5000, overhead = 8000, netRevenue = 20000, equityFunding = 200, monthsCount = 12
      const result = CashFlowScenarioEngine.evaluate(
        -1200, // currentFCO
        1000,  // availableCash
        1000,  // receivables
        2000,  // inventory
        5000,  // overhead
        24000, // netRevenue
        100,   // equityFunding
        12     // monthsCount
      );

      // Verify no mutation of inputs
      assert.equal(result.currentRunway, 10.0); // 1000 / (1200 / 12) = 10 months

      // Scenario 1: Redução de Estoques (simulations should have 10%, 20%, 30%)
      const stockGroup = result.scenarios[0];
      assert.equal(stockGroup.scenarioName, 'Redução de Estoques');
      assert.equal(stockGroup.simulations.length, 3);
      
      const stock30 = stockGroup.simulations[2]; // 30% reduction
      assert.equal(stock30.parameter, '-30%');
      // cashRelease = 0.3 * 2000 = 600
      // fcoSimulated = -1200 + 600 = -600
      // cashSimulated = 1000 + 600 = 1600
      // monthlyBurn = 600 / 12 = 50
      // runwaySimulated = 1600 / 50 = 32 months
      assert.equal(stock30.fcoSimulated, -600);
      assert.equal(stock30.cashSimulated, 1600);
      assert.equal(stock30.runwaySimulated, 32.0);
      assert.equal(stock30.runwayDisplay, '32.0 meses');

      // Scenario 3: PMR reduction (-30 days)
      const pmrGroup = result.scenarios[2];
      // cashRelease = min(1000, (30/360) * 24000) = min(1000, 2000) = 1000
      // fcoSimulated = -1200 + 1000 = -200
      // cashSimulated = 1000 + 1000 = 2000
      // monthlyBurn = 200 / 12 = 16.666
      // runwaySimulated = 2000 / 16.666 = 120 (capped at 99 in display logic for positive, wait, FCO is still -200)
      const pmr30 = pmrGroup.simulations[2];
      assert.equal(pmr30.fcoSimulated, -200);
      assert.equal(pmr30.cashSimulated, 2000);
      assert.equal(pmr30.runwaySimulated, 120.0);
    });
  });

  describe('3. TreasuryEarlyWarningEngine', () => {
    it('should trigger correct warning statuses and flag critical survivability threat', () => {
       // Test Survivability Threat (< 1 month runway)
      const stResult = TreasuryEarlyWarningEngine.evaluate(
        -1000, // FCO
        0.5, // runway
        1,   // negative FCO cycles
        0.1, // funding ratio
        false,
        false
      );
      assert.equal(stResult.hasSurvivabilityThreat, true);
      assert.equal(stResult.alerts[0].status, 'SURVIVABILITY_THREAT');

      // Test Watch Runway
      const watchResult = TreasuryEarlyWarningEngine.evaluate(
        1000, // FCO
        8.5,
        1,
        0.1,
        false,
        false
      );
      assert.equal(watchResult.hasSurvivabilityThreat, false);
      assert.equal(watchResult.alerts[0].status, 'WATCH');

      // Test FCO negative cycles (3 cycles -> WARNING)
      const warningFCO = TreasuryEarlyWarningEngine.evaluate(
        -1000, // FCO
        15,
        3,
        0.1,
        false,
        false
      );
      assert.equal(warningFCO.alerts[1].status, 'WARNING');

      // Test Funding Ratio (> 70% -> CRITICAL)
      const criticalFunding = TreasuryEarlyWarningEngine.evaluate(
        -1000, // FCO
        15,
        0,
        0.75,
        false,
        false
      );
      assert.equal(criticalFunding.alerts[2].status, 'CRITICAL');

      // Test Working Capital growths exceeding revenue
      const wcAlert = TreasuryEarlyWarningEngine.evaluate(
        -1000, // FCO
        15,
        0,
        0.1,
        true, // inventory growth > revenue growth
        true  // receivables growth > revenue growth
      );
      assert.equal(wcAlert.alerts[3].status, 'ALERT');
      assert.equal(wcAlert.alerts[4].status, 'ALERT');
    });
  });

  describe('4. TreasurySustainabilityEngine', () => {
    it('should calculate accurate EFSI score and mission capacity answers', () => {
      // Case 1: Healthy treasury
      const healthy = TreasurySustainabilityEngine.evaluate(
        5000,  // positive FCO
        -1000, // FCI
        15,    // runway (100 pts)
        0.05   // funding ratio (100 pts)
      );
      // FCO positive -> 100 pts (weight 35%)
      // Runway >= 12 -> 100 pts (weight 35%)
      // Funding <= 0.1 -> 100 pts (weight 15%)
      // Reinvestment rate = 1000 / 5000 = 20% (between 10% and 50%) -> 100 pts (weight 15%)
      assert.equal(healthy.efsiScore, 100);
      assert.equal(healthy.boardOutput.answer, 'Sim');

      // Case 2: Inadequate/Fragile
      const fragile = TreasurySustainabilityEngine.evaluate(
        -1000, // negative FCO
        -200,
        2.5,   // runway (40 pts)
        0.6    // funding ratio (20 pts)
      );
      // FCO negative, runway 2.5 -> 10 pts (weight 35%)
      // Runway 2.5 -> 15 pts (weight 35%)
      // Funding 0.6 -> 20 pts (weight 15%)
      // Reinvestment negative FCO -> 10 pts (weight 15%)
      // EFSI = 0.35 * 10 + 0.35 * 15 + 0.15 * 20 + 0.15 * 10 = 3.5 + 5.25 + 3.0 + 1.5 = 13.25 -> 13
      assert.equal(fragile.efsiScore, 13);
      assert.equal(fragile.boardOutput.answer, 'Não');
    });
  });

  describe('5. FiduciaryCashGovernanceRuntime Integration & Registry', () => {
    it('should return all roadmap outputs and respect visibility registry', () => {
      // Mock evaluating healthy scenario
      const result = FiduciaryCashIntelligenceRuntime.evaluate(
        [{ id: 1 }], // dfcData
        100000, // net income
        150000, // ebitda
        50000,
        120000, // bpCashEquivalentsEnd (50000 + 120000 - 30000 - 20000 = 120000)
        120000, // fco
        -30000, // fci
        -20000, // fcf
        0,
        30000,  // receivables
        20000,  // inventory
        100000, // available cash
        0,
        0,
        4,
        12,
        10000,
        20000,
        0,
        500000,
        undefined,
        undefined,
        200000, // netRevenue
        -5000,  // varClientes (inflow/outflow?)
        -2000,  // varEstoque
        5000,   // varFornecedores
        30000,  // overhead
        0,      // negative cycles
        false,  // inventory growth
        false   // receivables growth
      );

      assert.ok(result.causalIntelligence);
      assert.ok(result.scenarioIntelligence);
      assert.ok(result.earlyWarningSystem);
      assert.ok(result.treasurySustainability);

      // Registry visibilities
      const causalPolicy = PRESENTATION_POLICIES.find(p => p.section === 'DFC_CAUSAL_GOVERNANCE');
      assert.ok(causalPolicy);
      assert.strictEqual(causalPolicy.visibleIn.includes('BOARD'), false);
      assert.ok(causalPolicy.visibleIn.includes('EXECUTIVE'));
      assert.ok(causalPolicy.visibleIn.includes('TECHNICAL'));

      const sustainabilityPolicy = PRESENTATION_POLICIES.find(p => p.section === 'DFC_EFSI');
      assert.ok(sustainabilityPolicy);
      assert.strictEqual(sustainabilityPolicy.visibleIn.includes('BOARD'), false);
      assert.ok(sustainabilityPolicy.visibleIn.includes('EXECUTIVE'));
      assert.ok(sustainabilityPolicy.visibleIn.includes('TECHNICAL'));
    });

    it('should fail-closed correctly when reconcilability check is BLOCKED', () => {
      // BP variation is 100000 - 50000 = 50000, but FCO+FCI+FCF = -100000. Big divergence!
      const result = FiduciaryCashIntelligenceRuntime.evaluate(
        [{ id: 1 }], 
        10000, 
        20000, 
        50000, 
        100000, 
        -100000, 
        0, 
        0, 
        0, 
        10000, 
        10000, 
        50000, 
        0, 
        0, 
        1, 
        12, 
        5000, 
        10000, 
        0, 
        100000
      );

      assert.equal(result.confidenceLevel, 'BLOCKED');
      assert.equal(result.reconciliationAlerts.reconciliationStatus, 'CASH_RECONCILIATION_FAIL_CLOSED');
      // New engines should not run in blocked context
      assert.equal(result.causalIntelligence, undefined);
    });

    it('should distinct official FCO and adjusted burn rate and propagate fcoBasis lineage fields', () => {
      const result = FiduciaryCashIntelligenceRuntime.evaluate(
        [{ id: 1 }], 
        100000, 
        150000, 
        50000, 
        120000, 
        120000, // fco
        -30000, 
        -20000, 
        0, 
        30000, 
        20000, 
        100000, 
        0, 
        10000, 
        4, 
        12, 
        10000, 
        20000, 
        30000, // contasRelacionadas -> adjusted FCO = 90000
        500000, 
        undefined, 
        undefined, 
        200000, 
        -5000, 
        -2000, 
        5000, 
        30000, 
        0, 
        false, 
        false
      );

      assert.equal(result.causalIntelligence?.fcoBasis, 'OFFICIAL_FCO');
      assert.equal(result.earlyWarningSystem?.fcoBasis, 'ADJUSTED_OPERATIONAL_BURN');
      assert.equal(result.treasurySustainability?.fcoBasis, 'ADJUSTED_OPERATIONAL_BURN');
      assert.equal(result.continuityRisk.fcoBasis, 'ADJUSTED_OPERATIONAL_BURN');
      assert.equal(result.liquidityClassification.fcoBasis, 'ADJUSTED_OPERATIONAL_BURN');
    });
  });

});
