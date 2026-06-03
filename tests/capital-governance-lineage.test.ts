import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { CapitalGovernanceAdapter } from '../src/runtime/adapters/CapitalGovernanceAdapter';
import { InstitutionalContext } from '../src/runtime/types';
import { InstitutionalBoardPackDocumentRuntime } from '../src/core/runtime/institutional-reporting/InstitutionalBoardPackDocumentRuntime';

describe('Capital Governance Lineage & Stabilization Tests (CGE v1.0.1)', () => {

  const buildBaseContext = (mockHistory: any[], inputData: any = {}): InstitutionalContext => {
    return {
      input: {
        rawFinancialData: {
          filterYear: 2023,
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

  it('1. Deve extrair lucro líquido utilizando aliases homologados', async () => {
    const mockHistory = [
      { year: 2023, docType: 'dre', category: 'lucroPrejuizoDoExercicio', val: -50000 }
    ];
    const context = buildBaseContext(mockHistory, {
      capitalSocial: 100000,
      bpSummary: { patrimonioLiquido: 80000, ativoTotal: 150000 }
    });

    const result = await CapitalGovernanceAdapter.execute(context);
    assert.strictEqual(result.success, true);
    assert.strictEqual(result.inference?.metrics?.netIncome, -50000);
  });

  it('2. Deve preservar o prejuízo líquido negativo em -68.548,88 (sem truncar para 0.00)', async () => {
    const context = buildBaseContext([], {
      lucroLiquido: -68548.88,
      capitalSocial: 121233.21,
      bpSummary: { patrimonioLiquido: 59620.26, ativoTotal: 200000 }
    });

    const result = await CapitalGovernanceAdapter.execute(context);
    assert.strictEqual(result.success, true);
    assert.strictEqual(result.inference?.metrics?.netIncome, -68548.88);
  });

  it('3. Deve extrair Capital Social do BP aceitando o alias "Capital Subscrito"', async () => {
    const mockHistory = [
      { year: 2023, docType: 'bp', category: 'CAPITAL SUBSCRITO', val: 121233.21 }
    ];
    const context = buildBaseContext(mockHistory, {
      bpSummary: { patrimonioLiquido: 59620.26, ativoTotal: 200000 },
      lucroLiquido: -68548.88
    });

    const result = await CapitalGovernanceAdapter.execute(context);
    assert.strictEqual(result.success, true);
    assert.strictEqual(result.inference?.metrics?.capitalSocial, 121233.21);
    assert.strictEqual(result.inference?.metrics?.capitalSocialTrace?.status, 'CONSISTENT');
  });

  it('4. Deve suprimir avisos de Capital Social ausente quando o mesmo for maior que zero', async () => {
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
    
    const hasWarning = context.violations.some(v => v.message.includes('Capital Social ausente ou inválido'));
    assert.strictEqual(hasWarning, false);
  });

  it('5. Deve validar cálculo de Preservação e Erosão Patrimonial para o cenário Granatum 2022', async () => {
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

    const erosion = metrics.patrimonialErosion;
    assert.ok(erosion >= -50.83 && erosion <= -50.81, `Expected ~-50.82%, got ${erosion}%`);
    
    assert.strictEqual(metrics.cpiStatus, 'Severe Erosion');
  });

  it('6. Deve validar integridade de linhagem DRE -> DLPA -> CGE (CONSISTENT vs CGE_NET_INCOME_LINEAGE_BREAK)', async () => {
    // Caso Consistente
    const mockHistoryOk = [
      { year: 2023, docType: 'dre', category: 'lucroLiquido', val: 50000 }
    ];
    const contextOk = buildBaseContext(mockHistoryOk, {
      capitalSocial: 100000,
      bpSummary: { patrimonioLiquido: 80000, ativoTotal: 150000 }
    });
    contextOk.inferences['LegacyDREAdapter'] = {
      domain: 'DRE',
      metrics: { lucroLiq: 50000 },
      confidence: 'HIGH',
      evidenceLevel: 'DRE',
      score: 80
    } as any;

    const resultOk = await CapitalGovernanceAdapter.execute(contextOk);
    assert.strictEqual(resultOk.success, true);
    assert.strictEqual(resultOk.violations, undefined);

    // Caso de Inconsistência (Lineage Break)
    const mockHistoryBreak = [
      { year: 2023, docType: 'dre', category: 'lucroLiquido', val: 30000 }
    ];
    const contextBreak = buildBaseContext(mockHistoryBreak, {
      capitalSocial: 100000,
      bpSummary: { patrimonioLiquido: 80000, ativoTotal: 150000 }
    });
    contextBreak.inferences['LegacyDREAdapter'] = {
      domain: 'DRE',
      metrics: { lucroLiq: 50000 },
      confidence: 'HIGH',
      evidenceLevel: 'DRE',
      score: 80
    } as any;

    const resultBreak = await CapitalGovernanceAdapter.execute(contextBreak);
    assert.strictEqual(resultBreak.success, false);
    assert.ok(resultBreak.violations?.some(v => v.rule === 'CGE_NET_INCOME_LINEAGE_BREAK'));
  });

  it('7. Deve aplicar clamper de preservação e emitir alerta CAPITAL_RATIO_OUTLIER_SUPPRESSED para valores extremos', async () => {
    const context = buildBaseContext([], {
      capitalSocial: 1000,
      bpSummary: { patrimonioLiquido: 200000, ativoTotal: 300000 },
      lucroLiquido: 50000
    });

    const result = await CapitalGovernanceAdapter.execute(context);
    assert.strictEqual(result.success, true);
    assert.strictEqual(result.inference?.metrics?.capitalPreservation, 1000);
    assert.ok(result.violations?.some(v => v.rule === 'CAPITAL_RATIO_OUTLIER_SUPPRESSED'));
  });

  it('8. Deve conter linhagem da governança no Board Pack', () => {
    const mockReport: any = {
      institutionalContext: { currentCycle: '2023.Q4', tenantId: 'tenant-test' },
      inferences: {
        CapitalGovernanceAdapter: {
          metrics: {
            cgs: 32,
            cgsStatus: 'Fragile Governance',
            cpi: 0.4917,
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
    assert.ok(sections.capitalGovernanceIntegrity, 'capitalGovernanceIntegrity missing');
    assert.ok(sections.capitalGovernanceIntegrity.includes('Linhagem DRE → CGE'));
    assert.ok(sections.capitalGovernanceIntegrity.includes('Linhagem BP → CGE'));
  });

});
