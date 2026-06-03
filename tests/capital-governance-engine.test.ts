import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { CapitalGovernanceAdapter } from '../src/runtime/adapters/CapitalGovernanceAdapter';
import { InstitutionalContext } from '../src/runtime/types';
import { InstitutionalBoardPackDocumentRuntime } from '../src/core/runtime/institutional-reporting/InstitutionalBoardPackDocumentRuntime';

describe('Capital Governance Engine (CGE) - Sovereign Capital & DLPA Tests', () => {

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

  it('1. Deve calcular Preservation Index (CPI) e aplicar override para evitar colapso se PL for positivo', async () => {
    // Caso em que Capital Social = 100k, mas PL Final = 1k (cpi = 0.01) -> deve ser Critical Erosion, não Capital Collapse
    const context = buildBaseContext([], {
      capitalSocial: 100000,
      bpSummary: { patrimonioLiquido: 1000, ativoTotal: 150000 },
      lucroLiquido: -20000
    });

    const result = await CapitalGovernanceAdapter.execute(context);
    assert.strictEqual(result.success, true);
    
    const metrics = result.inference?.metrics;
    assert.ok(metrics);
    assert.strictEqual(metrics.cpiStatus, 'Severe Erosion');
    assert.strictEqual(metrics.patrimonioLiquido > 0, true);
  });

  it('2. Deve marcar DDI e ERI como NOT_APPLICABLE sob prejuízo e ERI status como PREJUÍZO ACUMULADO', async () => {
    const context = buildBaseContext([], {
      capitalSocial: 100000,
      bpSummary: { patrimonioLiquido: 80000, ativoTotal: 150000 },
      lucroLiquido: -15000,
      dividendos: 0
    });

    const result = await CapitalGovernanceAdapter.execute(context);
    assert.strictEqual(result.success, true);
    
    const metrics = result.inference?.metrics;
    assert.ok(metrics);
    assert.strictEqual(metrics.ddi, 'NOT_APPLICABLE');
    assert.strictEqual(metrics.ddiStatus, 'NOT_APPLICABLE');
    assert.strictEqual(metrics.eri, 'NOT_APPLICABLE');
    assert.strictEqual(metrics.eriStatus, 'PREJUÍZO ACUMULADO');
  });

  it('3. Deve calcular CDI e aplicar override de dependência sob prejuízo e PL erodido', async () => {
    // Sem aportes declarados, mas sob prejuízo e PL (80k) < Capital Social (100k)
    // Deve aplicar o override fiduciário para HIGH/High Dependency
    const context = buildBaseContext([], {
      capitalSocial: 100000,
      bpSummary: { patrimonioLiquido: 80000, ativoTotal: 150000 },
      lucroLiquido: -20000,
      capitalInjections: 0
    });

    const result = await CapitalGovernanceAdapter.execute(context);
    assert.strictEqual(result.success, true);
    
    const metrics = result.inference?.metrics;
    assert.ok(metrics);
    assert.strictEqual(metrics.cdiStatus, 'High Dependency');
    assert.strictEqual(metrics.cdi, 0.60);
  });

  it('4. Deve classificar trajetórias corretamente (DEPENDENT vs Tendência de PL)', async () => {
    // 4.1 Trajetória DEPENDENT (aportes recorrentes em 2 ou mais anos)
    const mockHistoryRecurrent = [
      { year: 2021, category: 'Aumento de Capital', val: 10000 },
      { year: 2022, category: 'Integralização', val: 5000 },
      { year: 2023, category: 'Capitalização', val: 8000 }
    ];
    const contextRecurrent = buildBaseContext(mockHistoryRecurrent, {
      filterYear: 2023,
      capitalSocial: 100000,
      bpSummary: { patrimonioLiquido: 80000, ativoTotal: 150000 },
      lucroLiquido: -5000
    });
    const resRecurrent = await CapitalGovernanceAdapter.execute(contextRecurrent);
    assert.strictEqual(resRecurrent.inference?.metrics?.trajectory, 'DEPENDENT');

    // 4.2 Trajetória RECOVERING (PL aumentando nos últimos 3 anos)
    const mockHistoryRecovering = [
      { year: 2021, category: 'Patrimônio Líquido', val: 50000 },
      { year: 2022, category: 'Patrimônio Líquido', val: 65000 },
      { year: 2023, category: 'Patrimônio Líquido', val: 80000 }
    ];
    const contextRecovering = buildBaseContext(mockHistoryRecovering, {
      filterYear: 2023,
      capitalSocial: 100000,
      bpSummary: { patrimonioLiquido: 80000, ativoTotal: 150000 },
      lucroLiquido: 15000
    });
    const resRecovering = await CapitalGovernanceAdapter.execute(contextRecovering);
    assert.strictEqual(resRecovering.inference?.metrics?.trajectory, 'RECOVERING');
  });

  it('5. Cenário Granatum 2022 esperado', async () => {
    // Inputs:
    // Capital Social = 121.233,21
    // PL Final = 59.620,26
    // Prejuízo = -68.548,88
    const context = buildBaseContext([], {
      filterYear: 2022,
      capitalSocial: 121233.21,
      bpSummary: { patrimonioLiquido: 59620.26, ativoTotal: 200000 },
      lucroLiquido: -68548.88
    });

    const result = await CapitalGovernanceAdapter.execute(context);
    assert.strictEqual(result.success, true);

    const metrics = result.inference?.metrics;
    assert.ok(metrics);

    // CPI = 59620.26 / 121233.21 = 0.49178... (49.18% / 49.17%)
    const cpiPct = metrics.cpi * 100;
    assert.ok(cpiPct >= 49.1 && cpiPct <= 49.2, `Expected CPI around 49.17%, got ${cpiPct}%`);
    assert.strictEqual(metrics.cpiStatus, 'Severe Erosion');
    assert.notStrictEqual(metrics.cpiStatus, 'Capital Collapse');

    // DDI e ERI
    assert.strictEqual(metrics.ddi, 'NOT_APPLICABLE');
    assert.strictEqual(metrics.eri, 'NOT_APPLICABLE');
    assert.strictEqual(metrics.eriStatus, 'PREJUÍZO ACUMULADO');

    // CDI (override deve disparar pois lucroLiquido < 0 e PL < Capital Social)
    assert.strictEqual(metrics.cdiStatus, 'High Dependency');

    // CGS Score (deve estar na faixa 30-40)
    assert.ok(metrics.cgs >= 30 && metrics.cgs <= 40, `Expected score 30-40, got ${metrics.cgs}`);

    // Narrativa fiduciária esperada
    const narrativeDiag = result.inference?.narrative?.diagnostic || '';
    assert.ok(narrativeDiag.includes('A companhia apresentou prejuízo relevante no exercício'), 'Narrative mismatch');
    assert.ok(narrativeDiag.includes('patrimônio líquido permaneceu positivo, preservando a continuidade institucional'), 'Narrative mismatch');
  });

  it('6. Deve integrar todas as 6 seções CGE no Institutional Board Pack', () => {
    const mockReport: any = {
      institutionalContext: { currentCycle: '2023.Q4', tenantId: 'tenant-test' },
      inferences: {
        CapitalGovernanceAdapter: {
          metrics: {
            cgs: 32,
            cgsStatus: 'Fragile Governance',
            cpi: 0.4917,
            cpiStatus: 'High Erosion',
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
            capitalizacoesAcumuladas: 72740
          },
          narrative: {
            diagnostic: 'A companhia apresentou prejuízo relevante no exercício e dependência de reforço de capital dos sócios. Entretanto, o patrimônio líquido permaneceu positivo, preservando a continuidade institucional. O principal risco identificado é a dependência recorrente de capitalização para sustentação operacional, e não um colapso patrimonial.'
          }
        }
      }
    };

    const doc = InstitutionalBoardPackDocumentRuntime.generateDocument(mockReport, 'BOARD');
    assert.strictEqual(doc.status, 'COMPLETE');

    const sections = doc.markdownSections;
    assert.ok(sections.capitalGovernanceSummary, 'capitalGovernanceSummary missing');
    assert.ok(sections.capitalPreservationAnalysis, 'capitalPreservationAnalysis missing');
    assert.ok(sections.capitalDependencyReport, 'capitalDependencyReport missing');
    assert.ok(sections.distributionGovernanceAnalysis, 'distributionGovernanceAnalysis missing');
    assert.ok(sections.equityResilienceAssessment, 'equityResilienceAssessment missing');
    assert.ok(sections.capitalTrajectoryInterpretation, 'capitalTrajectoryInterpretation missing');

    // Valida o conteúdo de algumas seções
    assert.ok(sections.capitalGovernanceSummary.includes('Capital Governance Score (CGS)'));
    assert.ok(sections.capitalPreservationAnalysis.includes('Capital Preservation Index (CPI)'));
    assert.ok(sections.distributionGovernanceAnalysis.includes('Não Aplicável'));
    assert.ok(sections.distributionGovernanceAnalysis.includes('PREJUÍZO ACUMULADO'));
  });

});
