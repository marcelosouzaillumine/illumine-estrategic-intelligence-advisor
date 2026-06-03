import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { CapitalGovernanceAdapter } from '../src/runtime/adapters/CapitalGovernanceAdapter';
import { InstitutionalContext } from '../src/runtime/types';
import { InstitutionalBoardPackDocumentRuntime } from '../src/core/runtime/institutional-reporting/InstitutionalBoardPackDocumentRuntime';
import { scanForLegacyFormulas } from '../src/runtime/adapters/CapitalGovernanceFormulaAudit';

describe('CGE Dashboard Propagation & Legacy Formula Elimination (CGE v1.0.2)', () => {

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

  it('1. DRE Net Income = CGE Net Income = Dashboard Net Income', async () => {
    const mockHistory = [
      { year: 2022, docType: 'dre', category: 'lucroPrejuizoDoExercicio', val: -68548.88 }
    ];
    const context = buildBaseContext(mockHistory, {
      capitalSocial: 121233.21,
      bpSummary: { patrimonioLiquido: 59620.26, ativoTotal: 200000 },
      renderingPayload: {
        netIncome: -68548.88,
        capitalSocial: 121233.21
      }
    });

    const result = await CapitalGovernanceAdapter.execute(context);
    assert.strictEqual(result.success, true);
    
    const metrics = result.inference?.metrics;
    assert.ok(metrics);
    assert.strictEqual(metrics.netIncome, -68548.88);
    assert.strictEqual(metrics.lineageAudit.netIncome.consumedValue, -68548.88);
    assert.strictEqual(metrics.lineageAudit.netIncome.renderedValue, -68548.88);
    assert.strictEqual(metrics.lineageAudit.netIncome.status, 'CONSISTENT');
  });

  it('2. BP Capital Social = CGE Capital Social = Dashboard Capital Social', async () => {
    const mockHistory = [
      { year: 2022, docType: 'bp', category: 'Capital Social', val: 121233.21 }
    ];
    const context = buildBaseContext(mockHistory, {
      bpSummary: { patrimonioLiquido: 59620.26, ativoTotal: 200000 },
      lucroLiquido: -68548.88,
      renderingPayload: {
        netIncome: -68548.88,
        capitalSocial: 121233.21
      }
    });

    const result = await CapitalGovernanceAdapter.execute(context);
    assert.strictEqual(result.success, true);
    
    const metrics = result.inference?.metrics;
    assert.ok(metrics);
    assert.strictEqual(metrics.capitalSocial, 121233.21);
    assert.strictEqual(metrics.lineageAudit.capitalSocial.consumedValue, 121233.21);
    assert.strictEqual(metrics.lineageAudit.capitalSocial.renderedValue, 121233.21);
    assert.strictEqual(metrics.lineageAudit.capitalSocial.status, 'CONSISTENT');
  });

  it('3. Preservação Patrimonial matches 49.18%', async () => {
    const context = buildBaseContext([], {
      capitalSocial: 121233.21,
      bpSummary: { patrimonioLiquido: 59620.26, ativoTotal: 200000 },
      lucroLiquido: -68548.88
    });

    const result = await CapitalGovernanceAdapter.execute(context);
    assert.strictEqual(result.success, true);

    const metrics = result.inference?.metrics;
    assert.ok(metrics);
    const preservation = metrics.capitalPreservation;
    assert.ok(preservation >= 49.17 && preservation <= 49.19, `Expected ~49.18%, got ${preservation}%`);
    assert.strictEqual(metrics.capitalIntegrity, 49);
  });

  it('4. Integridade does not output extreme values', async () => {
    const contextPositive = buildBaseContext([], {
      capitalSocial: 1000,
      bpSummary: { patrimonioLiquido: 200000, ativoTotal: 300000 },
      lucroLiquido: 50000
    });

    const resultPositive = await CapitalGovernanceAdapter.execute(contextPositive);
    assert.strictEqual(resultPositive.success, true);
    const metricsPositive = resultPositive.inference?.metrics;
    assert.ok(metricsPositive);
    assert.strictEqual(metricsPositive.capitalPreservation, 1000);
    assert.strictEqual(metricsPositive.capitalIntegrity, 100);

    const contextNegative = buildBaseContext([], {
      capitalSocial: 1000,
      bpSummary: { patrimonioLiquido: -200000, ativoTotal: 10000 },
      lucroLiquido: -150000
    });

    const resultNegative = await CapitalGovernanceAdapter.execute(contextNegative);
    assert.strictEqual(resultNegative.success, true);
    const metricsNegative = resultNegative.inference?.metrics;
    assert.ok(metricsNegative);
    assert.strictEqual(metricsNegative.capitalPreservation, -100);
    assert.strictEqual(metricsNegative.capitalIntegrity, 0);
  });

  it('5. Capital Collapse status blocked when PL > 0', async () => {
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

  it('6. UI Mismatch check emits UI_RENDER_MISMATCH on mismatch', async () => {
    const mockHistory = [
      { year: 2022, docType: 'dre', category: 'lucroLiquido', val: -68548.88 }
    ];
    const context = buildBaseContext(mockHistory, {
      capitalSocial: 121233.21,
      bpSummary: { patrimonioLiquido: 59620.26, ativoTotal: 200000 },
      renderingPayload: {
        netIncome: 10000,
        capitalSocial: 121233.21
      }
    });

    const result = await CapitalGovernanceAdapter.execute(context);
    assert.strictEqual(result.success, false);
    assert.ok(result.violations?.some(v => v.rule === 'UI_RENDER_MISMATCH'));
    
    const metrics = result.inference?.metrics;
    assert.ok(metrics);
    assert.strictEqual(metrics.lineageAudit.netIncome.status, 'INCONSISTENT');
  });

  it('7. Legacy formula scanner checks forbidden variable names', () => {
    const result = scanForLegacyFormulas();
    assert.strictEqual(result, false);
  });

  it('8. Board Pack contains Auditoria de Propagação CGE section', () => {
    const mockReport: any = {
      institutionalContext: { currentCycle: '2022.Q4', tenantId: 'tenant-test' },
      inferences: {
        CapitalGovernanceAdapter: {
          metrics: {
            cgs: 32,
            cgsStatus: 'Fragile Governance',
            cpi: 0.4918,
            cpiStatus: 'Severe Erosion',
            cdi: 0.60,
            cdiStatus: 'High Dependency',
            ddi: 'NOT_APPLICABLE',
            ddiStatus: 'NOT_APPLICABLE',
            eri: 'NOT_APPLICABLE',
            eriStatus: 'PREJUÍZO ACUMULADO',
            erir: 0.25,
            erirStatus: 'Moderate',
            cmi: 35,
            trajectory: 'DEPENDENT',
            capitalSocial: 121233.21,
            patrimonioLiquido: 59620.26,
            lucroLiquido: -68548.88,
            dividendos: 0,
            capitalInjections: 0,
            capitalizacoesAcumuladas: 72740,
            capitalSocialTrace: {
              sourceValue: 121233.21,
              consumedValue: 121233.21,
              status: 'CONSISTENT'
            },
            lineageAudit: {
              netIncome: {
                 source: 'DRE',
                 sourceValue: -68548.88,
                 consumedValue: -68548.88,
                 renderedValue: -68548.88,
                 status: 'CONSISTENT'
              },
              capitalSocial: {
                 source: 'BP',
                 sourceValue: 121233.21,
                 consumedValue: 121233.21,
                 renderedValue: 121233.21,
                 status: 'CONSISTENT'
              }
            }
          },
          narrative: {
            diagnostic: 'A companhia apresentou prejuízo relevante no exercício.'
          }
        }
      }
    };

    const doc = InstitutionalBoardPackDocumentRuntime.generateDocument(mockReport, 'BOARD');
    assert.strictEqual(doc.status, 'COMPLETE');

    const sections = doc.markdownSections;
    assert.ok(sections.capitalGovernancePropagationAudit, 'capitalGovernancePropagationAudit section missing');
    assert.ok(sections.capitalGovernancePropagationAudit.includes('Auditoria de Propagação CGE'));
    assert.ok(sections.capitalGovernancePropagationAudit.includes('LEGACY_CAPITAL_FORMULA_DETECTED: Não'));
  });

});
