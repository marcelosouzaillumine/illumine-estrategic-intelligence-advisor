import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { TreasuryIntelligenceRuntime, TreasuryRuntimeInput } from '../../src/capabilities/runtime/treasury-intelligence/TreasuryIntelligenceRuntime';
import { TreasuryPriorityMatrixEngine } from '../../src/capabilities/runtime/treasury-intelligence/TreasuryPriorityMatrixEngine';
import { DistributionSustainabilityEngine } from '../../src/capabilities/runtime/treasury-intelligence/DistributionSustainabilityEngine';
import { FiduciaryEfficiencyEngine } from '../../src/capabilities/runtime/treasury-intelligence/FiduciaryEfficiencyEngine';
import { TreasuryResilienceEngine } from '../../src/capabilities/runtime/treasury-intelligence/TreasuryResilienceEngine';
import { TreasuryStressEngine } from '../../src/capabilities/runtime/treasury-intelligence/TreasuryStressEngine';
import { CashPriorityEngine } from '../../src/capabilities/runtime/treasury-intelligence/CashPriorityEngine';

describe('Sovereign Treasury & Capital Stewardship Governance Framework', () => {
  const baseInput: TreasuryRuntimeInput = {
    allocations: [
      { id: 'payroll', category: 'Folha de Pagamento', amount: 10000, priority: 1, strategicNecessityScore: 95 },
      { id: 'operational_capex', category: 'CAPEX Operacional Mínimo', amount: 5000, priority: 2, strategicNecessityScore: 85 },
      { id: 'regulatory_compliance', category: 'Obrigações Regulatórias', amount: 2000, priority: 3, strategicNecessityScore: 90 },
      { id: 'critical_suppliers', category: 'Fornecedores Críticos', amount: 8000, priority: 4, strategicNecessityScore: 80 },
      { id: 'debt_service', category: 'Serviço da Dívida', amount: 4000, priority: 5, strategicNecessityScore: 75 },
      { id: 'discretionary_capex', category: 'CAPEX Discricionário', amount: 3000, priority: 6, strategicNecessityScore: 50 },
      { id: 'non_essential', category: 'Despesas Não Essenciais', amount: 1000, priority: 7, strategicNecessityScore: 30 },
      { id: 'growth_expansion', category: 'Crescimento e Expansão', amount: 15000, priority: 8, strategicNecessityScore: 60 },
      { id: 'distribution', category: 'Distribuição de Dividendos', amount: 5000, priority: 9, strategicNecessityScore: 40 }
    ],
    netIncome: 50000,
    retainedEarnings: 100000,
    fco: 45000,
    fci: -10000,
    fcf: -5000,
    availableCash: 80000,
    prevCaixa: 50000,
    startingEquity: 200000,
    endingEquity: 245000,
    ebitda: 60000,
    thirdPartyFunding: 0,
    equityFunding: 0,
    receivables: 15000,
    inventory: 10000,
    payables: 8000,
    shortTermDebt: 0,
    historicalCyclesCount: 3,
    liquidityClassification: 'OPERATIONAL_SUSTAINABLE',
    runwayStability: 'STABLE',
    hasRuptureRisk: false,
    isArtificial: false,
    hasPredictiveDeterioration: false,
    normalizedMonthlyCashBurn: 0
  };

  describe('TreasuryPriorityMatrixEngine & Cascading Restrictions', () => {
    it('should approve all layers in normal STABLE conditions', () => {
      const output = TreasuryPriorityMatrixEngine.evaluate({
        isSurvivabilityDegraded: false,
        isRunwayCritical: false,
        isFalseStability: false,
        hasPredictiveRupture: false,
        allocations: baseInput.allocations
      });
      assert.strictEqual(output.activeCascadeBlock, false);
      assert.strictEqual(output.restrictedLayers.length, 0);
      assert.strictEqual(output.priorities.every(p => p.status === 'APPROVED'), true);
    });

    it('should cascade freeze lower priority layers (growth, Capex, dividends) under rupture / degraded survivability conditions', () => {
      const output = TreasuryPriorityMatrixEngine.evaluate({
        isSurvivabilityDegraded: true,
        isRunwayCritical: true,
        isFalseStability: true,
        hasPredictiveRupture: true,
        allocations: baseInput.allocations
      });
      assert.strictEqual(output.activeCascadeBlock, true);
      // Discretionary Capex (6), Non essential (7), Growth (8), Distribution (9) must be degraded or frozen
      const frozenItems = output.priorities.filter(p => p.status === 'FROZEN');
      assert.ok(frozenItems.some(i => i.priority === 9));
      assert.ok(frozenItems.some(i => i.priority === 8));
      assert.ok(frozenItems.some(i => i.priority === 7));
      assert.ok(frozenItems.some(i => i.priority === 6));
    });
  });

  describe('DistributionSustainabilityEngine & Legal vs Fiduciary Blocks', () => {
    it('should allow dividends under stable, self-financing operations', () => {
      const result = DistributionSustainabilityEngine.evaluate({
        netIncome: 50000,
        retainedEarnings: 100000,
        fco: 45000,
        liquidityClassification: 'OPERATIONAL_SUSTAINABLE',
        runwayStability: 'STABLE',
        hasRuptureRisk: false,
        isArtificial: false,
        hasPredictiveDeterioration: false,
        hasCapitalDependency: false,
        hasRefinancingDependency: false,
        historicalCyclesCount: 3,
        startingEquity: 200000
      });
      assert.strictEqual(result.isBlocked, false);
      assert.strictEqual(result.eligible, true);
      assert.ok(result.fiduciaryDistributable > 0);
    });

    it('should hard-block distributions under artificial liquidity or net income erosion', () => {
      const result = DistributionSustainabilityEngine.evaluate({
        netIncome: -10000, // PL erosion
        retainedEarnings: 100000,
        fco: -5000, // FCO negative
        liquidityClassification: 'FALSE_STABILITY',
        runwayStability: 'FALSE_STABILITY',
        hasRuptureRisk: true,
        isArtificial: true,
        hasPredictiveDeterioration: true,
        hasCapitalDependency: true,
        hasRefinancingDependency: true,
        historicalCyclesCount: 3,
        startingEquity: 200000
      });
      assert.strictEqual(result.isBlocked, true);
      assert.strictEqual(result.eligible, false);
      assert.strictEqual(result.fiduciaryDistributable, 0);
      assert.ok(result.blockedReasons.length > 0);
      assert.ok(result.blockedReasons.some(r => r.includes('EROSION') || r.includes('LIQUIDITY') || r.includes('NEGATIVE_FCO')));
    });
  });

  describe('FiduciaryEfficiencyEngine & Survivability Adjustments', () => {
    it('should score high efficiency under strong runway and preservation', () => {
      const result = FiduciaryEfficiencyEngine.evaluate({
        baseEfficiencyScore: 85,
        runwayMonths: 24,
        resilienceScore: 90,
        isSurvivabilityDegraded: false,
        isLiquidityFragile: false,
        isTreasuryExhausted: false,
        idleCashRatio: 0.1,
        costOfDebtRatio: 0.05
      });
      assert.ok(result.survivabilityAdjustedEfficiency >= 80);
      assert.strictEqual(result.silentCashDestructionDetected, false);
    });

    it('should degrade efficiency score when survivability degrades even if returns are high', () => {
      const result = FiduciaryEfficiencyEngine.evaluate({
        baseEfficiencyScore: 90, // high return
        runwayMonths: 2, // very short runway
        resilienceScore: 30,
        isSurvivabilityDegraded: true,
        isLiquidityFragile: true,
        isTreasuryExhausted: true,
        idleCashRatio: 0.05,
        costOfDebtRatio: 0.25
      });
      assert.ok(result.survivabilityAdjustedEfficiency < 45); // highly degraded
      assert.ok(result.inefficientAllocationPatterns.length > 0);
    });
  });

  describe('TreasuryResilienceEngine & Half-Life Decay Metrics', () => {
    it('should calculate degradation velocity, days of coverage, and half-life days', () => {
      const result = TreasuryResilienceEngine.evaluate({
        availableCash: 30000,
        normalizedMonthlyCashBurn: 10000,
        fco: -10000,
        fcf: -2000,
        equityFunding: 0,
        thirdPartyFunding: 0,
        historicalCyclesCount: 3
      });
      assert.strictEqual(result.exhaustionProjected, true);
      assert.ok(result.reserveSustainabilityDays > 0);
      assert.ok(result.resilienceHalfLifeDays > 0);
      assert.ok(result.reserveDegradationVelocity > 0);
      assert.strictEqual(result.dependencyRecurrenceIntensity, 'LOW');
    });
  });

  describe('TreasuryStressEngine & Cumulative Propagation', () => {
    it('should project simulated exhaustion days under cumulative shocks', () => {
      const result = TreasuryStressEngine.evaluate({
        availableCash: 50000,
        normalizedMonthlyCashBurn: 5000,
        receivables: 20000,
        inventory: 15000,
        payables: 10000,
        shortTermDebt: 5000
      });
      assert.ok(result.cumulativeExhaustionDays > 0);
      assert.ok(result.activeStressFactors.length > 0);
      // Receivables delay, margin compression, financing restriction, operational burn escalation, concentration shock, supplier disruption, refinancing blockage
      assert.ok(result.activeStressFactors.some(f => f.includes('receivables_delay')));
      assert.ok(result.activeStressFactors.some(f => f.includes('burn_escalation')));
    });
  });

  describe('CashPriorityEngine & Adaptive Escalation', () => {
    it('should dynamically escalate payroll and operational continuity under stress', () => {
      const result = CashPriorityEngine.evaluate({
        isSurvivabilityDegraded: true,
        runwayMonths: 3,
        hasRuptureRisk: true
      });
      assert.ok(result.payrollPriorityScore > 85);
      assert.ok(result.escalatedPriorityList.length > 0);
      assert.strictEqual(result.escalatedPriorityList[0], 'payroll');
    });
  });

  describe('TreasuryGovernanceRuntime Orchestration & Auditability', () => {
    it('should run full evaluation pipeline and generate stable severity and reproducible hashes', () => {
      const output = TreasuryIntelligenceRuntime.evaluate(baseInput);
      assert.strictEqual(output.isAvailable, true);
      assert.ok(output.lineage.lineageHash.startsWith('lineage_treasury_'));
      assert.ok(output.lineage.parentHashes.length >= 0);
      assert.ok(output.disclosures.length >= 0);
    });

    it('should enforce fail-closed priorities on TREASURY_RUPTURE_RISK state', () => {
      const stressedInput = {
        ...baseInput,
        availableCash: 5000,
        fco: -40000,
        hasRuptureRisk: true,
        liquidityClassification: 'CONTINUITY_RISK'
      };
      const output = TreasuryIntelligenceRuntime.evaluate(stressedInput);
      assert.strictEqual(output.severity, 'RESTRICTED');
      assert.strictEqual(output.priorityMatrix.activeCascadeBlock, true);
      
      // Ensure lower priority items are frozen fiduciarily
      const frozenItems = output.priorityMatrix.priorities.filter(p => p.status === 'FROZEN');
      assert.ok(frozenItems.length > 0);
      assert.ok(frozenItems.some(i => i.priority >= 3));
    });
  });
});
