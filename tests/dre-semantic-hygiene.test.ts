import test from 'node:test';
import assert from 'node:assert';
import { DreContractGuard } from '../src/core/runtime/dre/DreContractGuard';
import { DreExecutiveViewModel } from '../src/core/runtime/dre/DreExecutiveViewModelBuilder';
import { DreEconomicScenario } from '../src/core/runtime/dre/DreScenarioClassifier';

test('DRE Semantic Hygiene', async (t) => {
  const createQ = (resp: string) => ({ title: 'Test', response: resp, rationale: 'Test', recommendation: 'Test' });

  const baseValidViewModel: DreExecutiveViewModel = {
    isValid: true,
    scenario: DreEconomicScenario.PROFITABLE_SCALE,
    executiveMetrics: {
      receitaLiquida: 1000,
      lucroBruto: 0,
      margemBruta: 0,
      margemContrib: 600,
      indiceMargemContrib: 0.6,
      ebitda: 300,
      margemEbitda: 0.3,
      ebit: 0,
      margemEbit: 0,
      lucroLiq: 200,
      margemLiquida: 0.2,
      pontoEquilibrio: 500,
      margemSegurancaValor: 500,
      coberturaBreakEven: 2.0
    },
    facts: {
      grossRevenue: 1000, deductions: 0, netRevenue: 1000, cogs: 400,
      contributionMarginValue: 600, contributionMarginRate: 0.6,
      fixedExpenses: 300, ebitda: 300, grossProfit: 0, grossMargin: 0, ebit: 0, ebitMargin: 0, ebitdaMargin: 0.3,
      netIncome: 200, netMargin: 0.2, breakEvenRevenue: 500,
      breakEvenCoverage: 2.0, breakEvenDistance: 500, safetyMargin: 0.5,
      revenueGrowth: 0, ebitdaGrowth: 0, netIncomeGrowth: 0,
      operatingResultQuality: 0.66, extraordinaryResultShare: 0,
      fixedCostAbsorption: 3.33, operatingLeverageRisk: 0.3,
      hasMeaningfulHistory: false, historyMessage: null
    },
    policy: {
      economicPositioning: "Escala Rentável",
      healthIndex: 80,
      confidenceScore: 100,
      executiveDiagnosis: {
        currentSituation: "Tudo bem", strategicPriority: "Manter",
        operationalOutlook: "Otimista", primaryRecommendation: "Continuar",
        primaryEconomicDriver: "Margem",
        severityState: "healthy",
        recommendationPriority: "low",
        dominantStrength: "Margem de Contribuição",
        secondaryAttention: "Eficiência de Despesas Fixas"
      },
      boardQuestions: {
        p1ValueCreation: createQ("Cria"), p2StructureSupport: createQ("Sustenta"),
        p3EconomicEquilibrium: createQ("Equilibrado"), p4PrimaryConstraint: createQ("Nenhuma"),
        p5EconomicOpportunity: createQ("Crescer"), p6InactionRisk: createQ("Estagnar"), p7BoardPriority: createQ("Investir")
      },
      executivePlan: { shortTerm: "A", mediumTerm: "B", longTerm: "C" },
      historicalIntelligence: { message: "Ok" }
    },
    economicBreakdown: {
      structureVM: { available: true },
      burnRateVM: { available: true, hasBurn: false },
      breakEvenVM: { available: true }
    },
    technicalLayer: {
      rows: []
    }
  };

  await t.test('throws error if patrimônio líquido is present', () => {
    const vm = JSON.parse(JSON.stringify(baseValidViewModel));
    vm.policy.executiveDiagnosis.currentSituation = 'Temos um patrimônio líquido forte';
    assert.throws(() => DreContractGuard.audit(vm), /Vazamento semântico/);
  });

  await t.test('throws error if N/A is present', () => {
    const vm = JSON.parse(JSON.stringify(baseValidViewModel));
    vm.policy.boardQuestions.p4PrimaryConstraint.response = 'N/A';
    assert.throws(() => DreContractGuard.audit(vm), /vazio ou ser nulo/);
  });

  await t.test('throws error if proteção fiduciária is present', () => {
    const vm = JSON.parse(JSON.stringify(baseValidViewModel));
    vm.policy.executivePlan.shortTerm = 'Garantir a proteção fiduciária';
    assert.throws(() => DreContractGuard.audit(vm), /Vazamento semântico/);
  });

  await t.test('throws error if caixa livre is present', () => {
    const vm = JSON.parse(JSON.stringify(baseValidViewModel));
    vm.policy.executivePlan.shortTerm = 'Geração de caixa livre';
    assert.throws(() => DreContractGuard.audit(vm), /Vazamento semântico/);
  });

  await t.test('throws error if market share is present', () => {
    const vm = JSON.parse(JSON.stringify(baseValidViewModel));
    vm.policy.executivePlan.shortTerm = 'Aumentar market share';
    assert.throws(() => DreContractGuard.audit(vm), /Vazamento semântico/);
  });

  await t.test('passes audit for clean text', () => {
    assert.doesNotThrow(() => DreContractGuard.audit(baseValidViewModel));
  });
});
