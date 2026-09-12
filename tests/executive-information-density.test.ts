import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { ExecutiveInformationDensityFramework } from '../src/workspace/runtime/presentation-governance/ExecutiveInformationDensityFramework';
import { TemporalIntegrityValidator } from '../src/workspace/runtime/presentation-governance/TemporalIntegrityValidator';
import { DLPATemporalIntegrityGuard } from '../src/core/runtime/governance/dlpa/DLPATemporalIntegrityGuard';
import { PatrimonialRecoveryHorizonEngine } from '../src/core/runtime/governance/dlpa/PatrimonialRecoveryHorizonEngine';
import { InstitutionalBoardPackRuntime } from '../src/core/runtime/institutional-reporting/InstitutionalBoardPackRuntime';
import { ExecutivePriorityResolver } from '../src/core/runtime/decision-intelligence/ExecutivePriorityResolver';
import { executiveRuntime } from '../src/core/runtime/executive-intelligence-runtime';

const createBasePayload = (analysisYear: number) => ({
  isMockData: true,
  featureFlags: {
    showTechnicalAudit: true
  },
  rawFinancialData: {
    filterYear: analysisYear,
    allHistoryData: [
      { year: 2020, val: 100000, category: 'Receita', type: 'DRE' },
      { year: 2021, val: 120000, category: 'Receita', type: 'DRE' },
      { year: 2022, val: 150000, category: 'Receita', type: 'DRE' }
    ]
  },
  historicalSeries: [
    { year: 2020, val: 100000 },
    { year: 2021, val: 120000 },
    { year: 2022, val: 150000 }
  ],
  bpData: [
    { year: 2020, category: 'caixaEquivalentes', type: 'ativo', value: 80000, val: 80000 },
    { year: 2021, category: 'caixaEquivalentes', type: 'ativo', value: 100000, val: 100000 },
    { year: 2022, category: 'caixaEquivalentes', type: 'ativo', value: 120000, val: 120000 },
    { year: 2022, category: 'ativoTotal', type: 'ativo', value: 500000, val: 500000 },
    { year: 2022, category: 'passivoCirculanteEmprestimos', type: 'passivo', value: 30000, val: 30000 },
    { year: 2022, category: 'patrimonioLiquido', type: 'pl', value: 200000, val: 200000 }
  ],
  dreData: [
    { year: 2020, category: 'receitaLiquida', type: 'dre', value: 100000, val: 100000 },
    { year: 2021, category: 'receitaLiquida', type: 'dre', value: 120000, val: 120000 },
    { year: 2022, category: 'receitaLiquida', type: 'dre', value: 150000, val: 150000 },
    { year: 2022, category: 'ebitda', type: 'dre', value: 35000, val: 35000 },
    { year: 2022, category: 'lucroLiquido', type: 'dre', value: 20000, val: 20000 },
    { year: 2022, category: 'LUCRO LÍQUIDO DO EXERCÍCIO', type: 'dre', value: 20000, val: 20000 }
  ],
  dfcData: [
    { year: 2022, category: 'Atividades Operacionais', amount: 25000 }
  ],
  dlpaData: [
    { year: 2022, category: 'Capital Social', value: 100000, val: 100000 },
    { year: 2022, category: 'Lucros ou Prejuízos Acumulados', value: 100000, val: 100000 }
  ],
  historicalCyclesCount: 3,
  metadata: {
    lineageHash: 'CONST-SEED-VALID-HASH',
    tenantId: 'tenant-1',
    cycleReference: '2022'
  }
});

describe('Executive Information Density Framework (EIDF) - Fiduciary & Presentation Governance', () => {
  it('Test 1: BOARD mode oculta seções técnicas', () => {
    assert.strictEqual(ExecutiveInformationDensityFramework.isSectionVisible('DFC_EARLY_WARNING', 'BOARD'), false);
    assert.strictEqual(ExecutiveInformationDensityFramework.isSectionVisible('DFC_SCENARIO_SIMULATION', 'BOARD'), false);
    assert.strictEqual(ExecutiveInformationDensityFramework.isSectionVisible('DFC_TECHNICAL_LAYER', 'BOARD'), false);
    assert.strictEqual(ExecutiveInformationDensityFramework.isSectionVisible('DFC_EQE_LINEAGE', 'BOARD'), false);
    assert.strictEqual(ExecutiveInformationDensityFramework.isSectionVisible('DFC_CONTEXT', 'BOARD'), false);
  });

  it('Test 2: EXECUTIVE mode exibe indicadores operacionais e oculta técnicas', () => {
    assert.strictEqual(ExecutiveInformationDensityFramework.isSectionVisible('DFC_SHAREHOLDER_DEPENDENCY', 'EXECUTIVE'), true);
    assert.strictEqual(ExecutiveInformationDensityFramework.isSectionVisible('DFC_REVENUE_CASH_CONVERSION', 'EXECUTIVE'), true);
    assert.strictEqual(ExecutiveInformationDensityFramework.isSectionVisible('DFC_TECHNICAL_LAYER', 'EXECUTIVE'), false);
  });

  it('Test 3: TECHNICAL mode expõe todas as seções e auditorias', () => {
    assert.strictEqual(ExecutiveInformationDensityFramework.isSectionVisible('DFC_TECHNICAL_LAYER', 'TECHNICAL'), true);
    assert.strictEqual(ExecutiveInformationDensityFramework.isSectionVisible('DFC_EQE_LINEAGE', 'TECHNICAL'), true);
    assert.strictEqual(ExecutiveInformationDensityFramework.isSectionVisible('DFC_EARLY_WARNING', 'TECHNICAL'), true);
    assert.strictEqual(ExecutiveInformationDensityFramework.isSectionVisible('DFC_SCENARIO_SIMULATION', 'TECHNICAL'), true);
  });

  it('Test 4: Reconciliação detalhada/técnica oculta em modo BOARD', () => {
    assert.strictEqual(ExecutiveInformationDensityFramework.isSectionVisible('DFC_TECHNICAL_LAYER', 'BOARD'), false);
  });

  it('Test 5: Linhagem do EQE oculta em modo BOARD', () => {
    assert.strictEqual(ExecutiveInformationDensityFramework.isSectionVisible('DFC_EQE_LINEAGE', 'BOARD'), false);
  });

  it('Test 6: TemporalIntegrityValidator bloqueia contaminação futura', () => {
    assert.doesNotThrow(() => {
      TemporalIntegrityValidator.validate(2022, 2021);
    });
    assert.throws(() => {
      TemporalIntegrityValidator.validate(2022, 2023);
    }, /TEMPORAL_CONTAMINATION_DETECTED/);
  });

  it('Test 7: DLPA 2022 não utiliza ciclos de 2023+', () => {
    const historicalCycles = [
      { year: 2020, netIncome: 10000 },
      { year: 2021, netIncome: 15000 },
      { year: 2022, netIncome: 20000 },
      { year: 2023, netIncome: 30000 },
      { year: 2024, netIncome: 40000 }
    ];
    assert.throws(() => {
      DLPATemporalIntegrityGuard.filterHistoricalCycles(historicalCycles, 2022);
    }, /TEMPORAL_CONTAMINATION_DETECTED/);
  });

  it('Test 8: Horizonte de recuperação indeterminado sem histórico positivo', () => {
    const result = PatrimonialRecoveryHorizonEngine.evaluate(
      -50000, 
      -10000, 
      [
        { year: 2020, netIncome: -5000 },
        { year: 2021, netIncome: -10000 }
      ],
      2022
    );
    assert.strictEqual(result.status, 'INDETERMINATE');
    assert.strictEqual(result.confidence, 'LOW');
    assert.strictEqual(result.value, null);
  });

  it('Test 9: Board Pack renderiza abstração executiva', () => {
    const payload = createBasePayload(2022);
    const report = executiveRuntime.generateExecutiveReport(payload);
    const boardPack = InstitutionalBoardPackRuntime.generate(report);

    assert.ok(boardPack.executiveView);
    assert.ok(boardPack.executiveView.contextoEmpresarial);
    assert.ok(Array.isArray(boardPack.executiveView.principaisRiscos));
    assert.ok(Array.isArray(boardPack.executiveView.prioridades));
    assert.ok(Array.isArray(boardPack.executiveView.decisoesConstitucionais));
  });

  it('Test 10: Apêndice técnico de auditoria mantido disponível', () => {
    const payload = createBasePayload(2022);
    const report = executiveRuntime.generateExecutiveReport(payload);
    const boardPack = InstitutionalBoardPackRuntime.generate(report);

    assert.ok(boardPack.technicalAppendix);
    assert.ok(boardPack.technicalAppendix.lineage);
    assert.ok(Array.isArray(boardPack.technicalAppendix.constitutionalAudit));
  });
});
