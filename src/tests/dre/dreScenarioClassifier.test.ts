import { describe, it } from 'node:test';
import { DreScenarioClassifier, DreEconomicScenario } from '../../core/runtime/dre/DreScenarioClassifier';
import { DreExecutiveFacts } from '../../core/runtime/dre/DreExecutiveFactsBuilder';

describe('DreScenarioClassifier', () => {
  const baseFacts: DreExecutiveFacts = {
    grossRevenue: 1000,
    deductions: 0,
    netRevenue: 1000,
    cogs: 400,
    contributionMarginValue: 600,
    contributionMarginRate: 0.6,
    fixedExpenses: 300,
    ebitda: 300,
    grossProfit: 0, grossMargin: 0, ebit: 0, ebitMargin: 0, ebitdaMargin: 0.3,
    netIncome: 200,
    netMargin: 0.2,
    breakEvenRevenue: 500,
    breakEvenCoverage: 2.0,
    breakEvenDistance: 500,
    safetyMargin: 0.5,
    revenueGrowth: 0.1,
    ebitdaGrowth: 0.2,
    netIncomeGrowth: 0.2,
    operatingResultQuality: 0.66,
    extraordinaryResultShare: 0,
    fixedCostAbsorption: 3.33,
    operatingLeverageRisk: 0.3,
    hasMeaningfulHistory: true,
    historyMessage: null
  };

  it('classifies ECONOMIC_STRESS when EBITDA is negative', () => {
    const facts = { ...baseFacts, ebitda: -50 };
    expect(DreScenarioClassifier.classify(facts)).toBe(DreEconomicScenario.ECONOMIC_STRESS);
  });

  it('classifies ECONOMIC_STRESS when Net Income is negative', () => {
    const facts = { ...baseFacts, netIncome: -10 };
    expect(DreScenarioClassifier.classify(facts)).toBe(DreEconomicScenario.ECONOMIC_STRESS);
  });

  it('classifies STRUCTURE_ABSORPTION_RISK when break even coverage < 1.0', () => {
    const facts = { ...baseFacts, breakEvenCoverage: 0.9, ebitda: 10, netIncome: 5 };
    expect(DreScenarioClassifier.classify(facts)).toBe(DreEconomicScenario.STRUCTURE_ABSORPTION_RISK);
  });

  it('classifies ACCELERATED_VALUE_CREATION', () => {
    const facts = { ...baseFacts, grossProfit: 0, grossMargin: 0, ebit: 0, ebitMargin: 0, ebitdaMargin: 0.25, netIncome: 100, breakEvenCoverage: 1.6, contributionMarginRate: 0.5 };
    expect(DreScenarioClassifier.classify(facts)).toBe(DreEconomicScenario.ACCELERATED_VALUE_CREATION);
  });

  it('classifies PROFITABLE_SCALE', () => {
    // Meets profitable scale but not accelerated value creation (e.g., coverage is 1.3, not 1.5)
    const facts = { ...baseFacts, breakEvenCoverage: 1.3 };
    expect(DreScenarioClassifier.classify(facts)).toBe(DreEconomicScenario.PROFITABLE_SCALE);
  });

  it('classifies MARGIN_COMPRESSION when revenue grows but EBITDA falls', () => {
    const facts = { ...baseFacts, revenueGrowth: 0.1, ebitdaGrowth: -0.05 };
    expect(DreScenarioClassifier.classify(facts)).toBe(DreEconomicScenario.MARGIN_COMPRESSION);
  });

  it('classifies PROFITABLE_SCALE when falling back with positive EBITDA and coverage >= 1.0', () => {
    // Should fallback to PROFITABLE_SCALE instead of UNCATEGORIZED or HISTORICAL
    const facts = { ...baseFacts, breakEvenCoverage: 1.1, grossProfit: 0, grossMargin: 0, ebit: 0, ebitMargin: 0, ebitdaMargin: 0.15, hasMeaningfulHistory: false };
    expect(DreScenarioClassifier.classify(facts)).toBe(DreEconomicScenario.PROFITABLE_SCALE);
  });
});
