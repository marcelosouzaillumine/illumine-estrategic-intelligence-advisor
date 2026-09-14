import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { CapitalGovernanceAdapter } from '../src/runtime/adapters/CapitalGovernanceAdapter';
import { InstitutionalContext } from '../src/runtime/types';
import { InstitutionalBoardPackDocumentRuntime } from '../src/capabilities/runtime/institutional-reporting/InstitutionalBoardPackDocumentRuntime';
import { PatrimonialIntegrityEngine } from '../src/capabilities/runtime/governance/dlpa/PatrimonialIntegrityEngine';

describe('Capital Governance & DLPA Stabilization v1.0.3 Tests', () => {

  const buildBaseContext = (mockHistory: any[], inputData: any = {}): InstitutionalContext => {
    return {
      input: {
        rawFinancialData: {
          filterYear: 2022,
          allHistoryData: mockHistory,
          ...inputData
        },
        historicalCyclesCount: 3,
        isMockData: false
      },
      normalizedData: {},
      inferences: {},
      globalConfidence: 'HIGH',
      violations: [],
      executedEngines: [],
      executionStatus: 'PENDING'
    };
  };

  it('1. PL > 0 blocks CAPITAL_COLLAPSE / CAPITAL_UNDER_COLLAPSE', async () => {
    const context = buildBaseContext([], {
      capitalSocial: 100000,
      bpSummary: { patrimonioLiquido: 5000, ativoTotal: 120000 },
      lucroLiquido: -25000
    });

    const result = await CapitalGovernanceAdapter.execute(context);
    assert.strictEqual(result.success, true);
    
    const metrics = result.inference?.metrics;
    assert.ok(metrics);
    assert.notStrictEqual(metrics.cpiStatus, 'Capital Collapse');
    assert.strictEqual(metrics.cpiStatus, 'Severe Erosion');

    // Also check the legacy engine
    const legacyReport = PatrimonialIntegrityEngine.evaluate({
      startingEquity: 100000,
      endingEquity: 5000,
      capitalSocial: 100000,
      netIncome: -25000,
      lucrosPrejuizos: -95000
    });
    assert.notStrictEqual(legacyReport.preservationStatus, 'CAPITAL_COLLAPSE_RISK');
    assert.notStrictEqual(legacyReport.capitalProtectionStatus, 'CAPITAL_UNDER_COLLAPSE');
    assert.strictEqual(legacyReport.preservationStatus, 'SEVERELY_ERODED');
    assert.strictEqual(legacyReport.capitalProtectionStatus, 'WEAK_CAPITAL_PROTECTION');
  });

  it('2. Granatum 2022 scenario returns Severe Erosion (Erosão Patrimonial Elevada)', async () => {
    const context = buildBaseContext([], {
      capitalSocial: 121233.21,
      bpSummary: { patrimonioLiquido: 59620.26, ativoTotal: 200000 },
      lucroLiquido: -68548.88
    });

    const result = await CapitalGovernanceAdapter.execute(context);
    assert.strictEqual(result.success, true);
    
    const metrics = result.inference?.metrics;
    assert.ok(metrics);
    assert.strictEqual(metrics.cpiStatus, 'Severe Erosion');
  });

  it('3. capitalSocial > 0 suppresses CAPITAL_SOCIAL_MISSING warning', async () => {
    const context = buildBaseContext([], {
      capitalSocial: 121233.21,
      bpSummary: { patrimonioLiquido: 59620.26, ativoTotal: 200000 },
      lucroLiquido: -68548.88
    });

    context.violations = [
      { rule: 'CAPITAL_SOCIAL_MISSING', severity: 'HIGH', message: 'Capital Social ausente ou inválido no Balanço Patrimonial.', blocked: false }
    ];

    const result = await CapitalGovernanceAdapter.execute(context);
    assert.strictEqual(result.success, true);
    
    const hasMissingWarning = context.violations.some(v => v.rule === 'CAPITAL_SOCIAL_MISSING');
    assert.strictEqual(hasMissingWarning, false);
    
    const hasFalseAlert = (result.violations || []).some(v => v.rule === 'CAPITAL_SOCIAL_FALSE_MISSING_ALERT');
    assert.strictEqual(hasFalseAlert, false);
  });

  it('4. capitalPreservation equals 49.18 and capitalIntegrity score equals 49', async () => {
    const context = buildBaseContext([], {
      capitalSocial: 121233.21,
      bpSummary: { patrimonioLiquido: 59620.26, ativoTotal: 200000 },
      lucroLiquido: -68548.88
    });

    const result = await CapitalGovernanceAdapter.execute(context);
    assert.strictEqual(result.success, true);
    
    const metrics = result.inference?.metrics;
    assert.ok(metrics);
    assert.strictEqual(metrics.capitalPreservation, 49.18);
    assert.strictEqual(metrics.capitalIntegrity, 49);
  });

  it('5. capitalErosion equals 50.82', async () => {
    const context = buildBaseContext([], {
      capitalSocial: 121233.21,
      bpSummary: { patrimonioLiquido: 59620.26, ativoTotal: 200000 },
      lucroLiquido: -68548.88
    });

    const result = await CapitalGovernanceAdapter.execute(context);
    assert.strictEqual(result.success, true);
    
    const metrics = result.inference?.metrics;
    assert.ok(metrics);
    assert.strictEqual(metrics.capitalErosion, 50.82);
  });

  it('6. Extreme percentage of -888.3% can never be rendered', async () => {
    // Under extreme initial equity of 0, cpi falls back to 1.0 (100%), not -888% or similar
    const context = buildBaseContext([], {
      capitalSocial: 0,
      bpSummary: { patrimonioLiquido: -50000, ativoTotal: 10000 },
      lucroLiquido: -150000
    });

    const result = await CapitalGovernanceAdapter.execute(context);
    assert.strictEqual(result.success, true);
    
    const metrics = result.inference?.metrics;
    assert.ok(metrics);
    assert.ok(metrics.capitalPreservation >= -100 && metrics.capitalPreservation <= 1000);
  });

  it('7. foundationYear = 2021, analysisYear = 2022, historicalCycles = 1 returns INITIAL_CAPITALIZATION', async () => {
    const context = buildBaseContext([], {
      filterYear: 2022,
      foundationYear: 2021,
      historicalCyclesCount: 1,
      capitalSocial: 120000,
      bpSummary: { patrimonioLiquido: 60000, ativoTotal: 150000 },
      lucroLiquido: -50000
    });

    const result = await CapitalGovernanceAdapter.execute(context);
    assert.strictEqual(result.success, true);
    
    const metrics = result.inference?.metrics;
    assert.ok(metrics);
    assert.strictEqual(metrics.lifecycleStage, 'INITIAL_CAPITALIZATION');
  });

});
