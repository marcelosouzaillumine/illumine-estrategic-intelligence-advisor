// tests/governance/dlpa/dlpa-governance.test.ts
//
// Ref: Governance Runtime Correction — DLPA Fiduciary Interpretation Refactor

import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { DLPAFiduciaryInterpretationEngine } from '../../../src/core/runtime/governance/dlpa/DLPAFiduciaryInterpretationEngine';
import { FinancialRuntimeContextAdapter } from '../../../src/core/runtime/financial-context/FinancialRuntimeContextAdapter';
import { InstitutionalBusinessProfile } from '../../../src/core/runtime/institutional-identity/InstitutionalBusinessProfile';
import { CapitalGovernanceAdapter } from '../../../src/core/runtime/capital-governance/capital-governance-adapter';

describe('DLPA Fiduciary Governance Refactor Suite', () => {

  const createContext = (segment = 'Default SaaS') => {
    const adapter = new FinancialRuntimeContextAdapter();
    const profile: InstitutionalBusinessProfile = {
      segmentoOperacional: segment,
      intensidadeCapital: 'LIGHT',
      perfilCicloFinanceiro: 'SHORT'
    };
    return adapter.createContext(profile);
  };

  // 1. Negative profit blocks "conservative" classification (Fail-Closed)
  it('1. Negative profit blocks conservative/strategic classifications', () => {
    const context = createContext();
    const output = DLPAFiduciaryInterpretationEngine.evaluate({
      context,
      dlpaData: [{ year: 2026, capitalSocial: 100000, lucrosRetidosAcumulados: 0 }],
      netIncome: -5000, // Prejuízo
      retainedEarnings: -5000,
      totalDistributed: 0,
      startingEquity: 100000,
      endingEquity: 95000,
      capitalInjections: 0,
      operatingCashFlow: 5000,
      capitalSocial: 100000,
      lucrosPrejuizos: -5000,
      historicalCycles: []
    });

    assert.equal(output.distributionEligibility.eligible, false);
    assert.equal(output.retentionClassification, 'FORCED_RETENTION');
    assert.ok(output.blockedConclusions.includes('CONSERVATIVE_GOVERNANCE_INFERENCE'));
    assert.ok(output.blockedConclusions.includes('STRATEGIC_RETENTION_INFERENCE'));
    assert.ok(output.governanceNarrative.includes('A ausência de distribuições está primariamente associada à inexistência de superávit'));
  });

  // 2. PL erosion triggers emergency retention
  it('2. PL erosion triggers emergency retention', () => {
    const context = createContext();
    const output = DLPAFiduciaryInterpretationEngine.evaluate({
      context,
      dlpaData: [{ year: 2026, capitalSocial: 100000, lucrosRetidosAcumulados: 10000 }],
      netIncome: 1000,
      retainedEarnings: 1000,
      totalDistributed: 0,
      startingEquity: 100000,
      endingEquity: 45000, // plFinal / plInicial = 0.45 (< 0.50, PRESSURED/SEVERELY_ERODED)
      capitalInjections: 0,
      operatingCashFlow: -2000, // negative cash flow too
      capitalSocial: 100000,
      lucrosPrejuizos: 10000,
      historicalCycles: []
    });

    assert.equal(output.patrimonialIntegrityStatus, 'SEVERELY_ERODED');
    assert.equal(output.retentionClassification, 'EMERGENCY_CAPITAL_PRESERVATION');
    assert.ok(output.blockedConclusions.includes('CONSERVATIVE_GOVERNANCE_INFERENCE'));
    assert.equal(output.institutionalStage, 'EMERGENCY_CAPITAL_PRESERVATION');
  });

  // 3. Near-zero denominator blocks explosive ratios
  it('3. Near-zero starting PL blocks explosive ratio calculation', () => {
    const context = createContext();
    const output = DLPAFiduciaryInterpretationEngine.evaluate({
      context,
      dlpaData: [{ year: 2026, capitalSocial: 100, lucrosRetidosAcumulados: 100 }],
      netIncome: 5000,
      retainedEarnings: 5000,
      totalDistributed: 0,
      startingEquity: 0.5, // nearZeroThreshold is 1.0, this is below it
      endingEquity: 20000,
      capitalInjections: 0,
      operatingCashFlow: 10000,
      capitalSocial: 100,
      lucrosPrejuizos: 100,
      historicalCycles: []
    });

    assert.equal(output.preservationRatio, null);
    assert.equal(output.preservationRatioReliability, 'INSUFFICIENT_PATRIMONIAL_BASE');
    assert.ok(output.fiduciaryWarnings.some(w => w.includes('Base patrimonial inicial insuficiente')));
  });

  // 4. Positive profit + no distribution + healthy cash = Strategic Retention
  it('4. Positive profit + no distribution + healthy cash results in Strategic Retention', () => {
    const context = createContext();
    const output = DLPAFiduciaryInterpretationEngine.evaluate({
      context,
      dlpaData: [{ year: 2026, capitalSocial: 100000, lucrosRetidosAcumulados: 20000 }],
      netIncome: 15000,
      retainedEarnings: 15000,
      totalDistributed: 0,
      startingEquity: 100000,
      endingEquity: 115000, // preserved
      capitalInjections: 0,
      operatingCashFlow: 12000, // positive
      capitalSocial: 100000,
      lucrosPrejuizos: 20000,
      historicalCycles: []
    });

    assert.equal(output.retentionClassification, 'STRATEGIC_RETENTION');
    assert.equal(output.distributionEligibility.eligible, true);
    assert.ok(output.allowedConclusions.includes('STANDARD_RETENTION_INTERPRETATION'));
    assert.ok(output.governanceNarrative.includes('A ausência de distribuição de lucros reflete uma decisão deliberada e planejada de reinvestimento'));
  });

  // 5. Repeated losses across years = Structural Fragility
  it('5. Repeated losses across years triggers persistent structural fragility', () => {
    const context = createContext();
    const historicalCycles = [
      { year: 2023, netIncome: -1000, totalDistributed: 0, startingEquity: 10000, endingEquity: 9000, operatingCashFlow: -500 },
      { year: 2024, netIncome: -2000, totalDistributed: 0, startingEquity: 9000, endingEquity: 7000, operatingCashFlow: -800 },
      { year: 2025, netIncome: -1500, totalDistributed: 0, startingEquity: 7000, endingEquity: 5500, operatingCashFlow: -200 }
    ];

    const output = DLPAFiduciaryInterpretationEngine.evaluate({
      context,
      dlpaData: [{ year: 2026, capitalSocial: 5000, lucrosRetidosAcumulados: 500 }],
      netIncome: 1000, // profit in current year, but history has repeated losses
      retainedEarnings: 1000,
      totalDistributed: 0,
      startingEquity: 5500,
      endingEquity: 6500,
      capitalInjections: 0,
      operatingCashFlow: 1000,
      capitalSocial: 5000,
      lucrosPrejuizos: 500,
      historicalCycles
    });

    assert.ok(output.blockedConclusions.includes('CONSERVATIVE_GOVERNANCE_INFERENCE'));
    assert.ok(output.causalDrivers.includes('FRAGILIDADE_LONGITUDINAL_ESTRUTURAL'));
  });

  // 6. Missing context = Fail-Closed interpretation
  it('6. Missing context causes fail-closed warnings and LOW confidence', () => {
    const output = DLPAFiduciaryInterpretationEngine.evaluate({
      context: undefined, // missing context
      dlpaData: [{ year: 2026, capitalSocial: 100000, lucrosRetidosAcumulados: 10000 }],
      netIncome: 10000,
      retainedEarnings: 10000,
      totalDistributed: 0,
      startingEquity: 100000,
      endingEquity: 110000,
      capitalInjections: 0,
      operatingCashFlow: 5000,
      capitalSocial: 100000,
      lucrosPrejuizos: 10000,
      historicalCycles: []
    });

    assert.equal(output.contextCompleteness, 'PARTIAL');
    assert.equal(output.confidenceLevel, 'LOW');
    assert.ok(output.fiduciaryWarnings.includes('FinancialRuntimeContext incompleto'));
  });

  // 7. UI receives already-classified deterministic outputs only (Adapter check)
  it('7. CapitalGovernanceAdapter process returns fully classified and safe metrics', () => {
    const rawCapitalGov = CapitalGovernanceAdapter.process(
      [{ year: 2026, capitalSocial: 100000, lucrosRetidosAcumulados: 20000 }],
      15000, // netIncome
      15000, // retainedEarnings
      0, // totalDistributed
      100000, // startingEquity
      115000, // endingEquity
      0, // capitalInjections
      undefined,
      [{ year: 2026, netIncome: 15000, totalDistributed: 0, startingEquity: 100000, endingEquity: 115000, operatingCashFlow: 12000 }]
    );

    assert.ok(rawCapitalGov.diagnostics.isAvailable);
    assert.ok(rawCapitalGov.diagnostics.retention);
    assert.ok(rawCapitalGov.diagnostics.distribution);
    assert.ok(rawCapitalGov.diagnostics.preservation);
    assert.ok(rawCapitalGov.diagnostics.fiduciaryOutput);
    assert.equal(rawCapitalGov.diagnostics.retention.retentionStatus, 'STRATEGIC_RETENTION');
    assert.equal(rawCapitalGov.diagnostics.preservation.preservationStatus, 'PRESERVED');
  });

  // 8. Case Granatum 2022
  it('8. Case Granatum 2022 produces correct fiduciary readings', () => {
    const context = createContext('SaaS e Gestão');
    const output = DLPAFiduciaryInterpretationEngine.evaluate({
      context,
      dlpaData: [{ year: 2022, capitalSocial: 128169.14, lucrosRetidosAcumulados: -68548.88 }],
      netIncome: -68548.88,
      retainedEarnings: -68548.88,
      totalDistributed: 0,
      startingEquity: 128169.14,
      endingEquity: 59620.26, // preservation = 0.465, severely eroded
      capitalInjections: 0,
      operatingCashFlow: 0,
      capitalSocial: 128169.14,
      lucrosPrejuizos: -68548.88,
      historicalCycles: []
    });

    assert.equal(output.distributionEligibility.eligible, false);
    assert.equal(output.retentionClassification, 'FORCED_RETENTION');
    assert.equal(output.patrimonialIntegrityStatus, 'SEVERELY_ERODED');
    assert.equal(output.institutionalStage, 'SURVIVAL_STAGE_CAPITAL_STRUCTURE');
    assert.equal(output.capitalProtectionStatus, 'WEAK_CAPITAL_PROTECTION');
    assert.ok(output.governanceNarrative.includes('falta de superávit econômico distribuível e à fragilidade patrimonial observada, em vez de representar uma retenção estratégica deliberada'));
  });

});
