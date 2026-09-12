import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { ExecutiveExecutionAdapter, ExecutionDecisionRecord } from '../src/runtime/adapters/ExecutiveExecutionAdapter';
import { SovereignDecisionAdapter } from '../src/runtime/adapters/SovereignDecisionAdapter';
import { CreditCommitteeSimulatorAdapter } from '../src/runtime/adapters/CreditCommitteeSimulatorAdapter';
import { LegacyFinancialAdapter } from '../src/runtime/adapters/LegacyFinancialAdapter';
import { LegacyDREAdapter } from '../src/runtime/adapters/LegacyDREAdapter';
import { LegacyDFCAdapter } from '../src/runtime/adapters/LegacyDFCAdapter';
import { EconomicNormalizationAdapter } from '../src/runtime/adapters/EconomicNormalizationAdapter';
import { StressTestAdapter } from '../src/runtime/adapters/StressTestAdapter';
import { ExecutiveDecisionAdapter } from '../src/runtime/adapters/ExecutiveDecisionAdapter';
import { InstitutionalMemoryAdapter } from '../src/runtime/adapters/InstitutionalMemoryAdapter';
import { BoardRiskMatrixAdapter } from '../src/runtime/adapters/BoardRiskMatrixAdapter';
import { InstitutionalContext, EngineExecutionResult } from '../src/runtime/types';
import { InstitutionalBoardPackDocumentRuntime } from '../src/capabilities/runtime/institutional-reporting/InstitutionalBoardPackDocumentRuntime';
import { buildBPHierarchy } from '../src/lib/bpEngine';

describe('Executive Execution Engine (E3) Tests', () => {

  const buildBaseContext = (mockHistory: any[], cyclesCount = 4, rawFinancialDataOverrides = {}): InstitutionalContext => {
    const bpRows = mockHistory.filter(d => d.docType === 'bp' || d.type === 'bp');
    const dreRows = mockHistory.filter(d => d.docType === 'dre' || d.type === 'dre');
    
    const bpResultHierarchy = buildBPHierarchy(bpRows);
    const bpSummary = bpResultHierarchy.summary;
    
    const ebitdaRow = dreRows.find(d => (d.category || d.conta || '').toLowerCase().includes('ebitda'));
    const ebitda = ebitdaRow?.val ?? 0;
    
    const llRow = dreRows.find(d => {
      const cat = (d.category || d.conta || '').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
      return cat.includes('lucro liquido') || cat.includes('resultado liquido') || cat.includes('prejuizo');
    });
    const lucroLiquido = llRow?.val ?? 0;
    
    const prevBpRows = mockHistory.filter(d => (d.docType === 'bp' || d.type === 'bp') && d.year === 2022);
    const prevBpSummary = buildBPHierarchy(prevBpRows).summary;
    const prevPl = prevBpSummary?.patrimonioLiquido || 0;
    const prevCaixa = prevBpSummary?.caixaEquivalentes || 0;
    
    const prevDreRows = mockHistory.filter(d => (d.docType === 'dre' || d.type === 'dre') && d.year === 2022);
    const prevEbitdaRow = prevDreRows.find(d => (d.category || d.conta || '').toLowerCase().includes('ebitda'));
    const prevEbitda = prevEbitdaRow?.val || 0;

    return {
      input: {
        rawFinancialData: {
          filterYear: 2023,
          allHistoryData: mockHistory,
          bpSummary,
          ebitda,
          lucroLiquido,
          industry: 'Geral',
          prevPl,
          prevEbitda,
          prevCaixa,
          dreDataLength: dreRows.length,
          historicalCyclesCount: cyclesCount,
          ...rawFinancialDataOverrides
        },
        dreData: dreRows,
        historicalCyclesCount: cyclesCount,
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

  const runAllEngines = async (context: InstitutionalContext): Promise<Record<string, EngineExecutionResult>> => {
    const finRes = await LegacyFinancialAdapter.execute(context);
    if (finRes.success && finRes.inference) {
      context.inferences['LegacyFinancialAdapter'] = finRes.inference;
    }

    const dreRes = await LegacyDREAdapter.execute(context);
    if (dreRes.success && dreRes.inference) {
      context.inferences['LegacyDREAdapter'] = dreRes.inference;
    }

    const dfcRes = await LegacyDFCAdapter.execute(context);
    if (dfcRes.success && dfcRes.inference) {
      context.inferences['LegacyDFCAdapter'] = dfcRes.inference;
    }

    const eneRes = await EconomicNormalizationAdapter.execute(context);
    if (eneRes.success && eneRes.inference) {
      context.inferences['EconomicNormalizationAdapter'] = eneRes.inference;
    }

    const stressRes = await StressTestAdapter.execute(context);
    if (stressRes.success && stressRes.inference) {
      context.inferences['StressTestAdapter'] = stressRes.inference;
    }

    const execRes = await ExecutiveDecisionAdapter.execute(context);
    if (execRes.success && execRes.inference) {
      context.inferences['ExecutiveDecisionEngine'] = execRes.inference;
    }

    const imeRes = await InstitutionalMemoryAdapter.execute(context);
    if (imeRes.success && imeRes.inference) {
      context.inferences['InstitutionalMemoryEngine'] = imeRes.inference;
    }

    const brmRes = await BoardRiskMatrixAdapter.execute(context);
    if (brmRes.success && brmRes.inference) {
      context.inferences['BoardRiskMatrixAdapter'] = brmRes.inference;
    }

    const ccsRes = await CreditCommitteeSimulatorAdapter.execute(context);
    if (ccsRes.success && ccsRes.inference) {
      context.inferences['CreditCommitteeSimulatorEngine'] = ccsRes.inference;
    }

    const sdeRes = await SovereignDecisionAdapter.execute(context);
    if (sdeRes.success && sdeRes.inference) {
      context.inferences['SovereignDecisionEngine'] = sdeRes.inference;
    }

    const e3Res = await ExecutiveExecutionAdapter.execute(context);
    if (e3Res.success && e3Res.inference) {
      context.inferences['ExecutiveExecutionEngine'] = e3Res.inference;
    }

    return {
      LegacyFinancialAdapter: finRes,
      LegacyDREAdapter: dreRes,
      LegacyDFCAdapter: dfcRes,
      EconomicNormalizationAdapter: eneRes,
      StressTestAdapter: stressRes,
      ExecutiveDecisionEngine: execRes,
      InstitutionalMemoryEngine: imeRes,
      BoardRiskMatrixAdapter: brmRes,
      CreditCommitteeSimulatorEngine: ccsRes,
      SovereignDecisionEngine: sdeRes,
      ExecutiveExecutionEngine: e3Res
    };
  };

  const mockHistory = [
    { year: 2023, docType: 'bp', type: 'ativo', category: 'Ativo Circulante', val: 5000000 },
    { year: 2023, docType: 'bp', type: 'ativo', category: 'Caixa e Equivalentes', val: 2000000 },
    { year: 2023, docType: 'bp', type: 'ativo', category: 'Ativo Total', val: 10000000 },
    { year: 2023, docType: 'bp', type: 'passivo', category: 'Passivo Circulante', val: 1000000 },
    { year: 2023, docType: 'bp', type: 'passivo', category: 'Bancos e Financiamentos', val: 300000 },
    { year: 2023, docType: 'bp', type: 'passivo', category: 'Patrimônio Líquido', val: 8000000 },
    { year: 2023, docType: 'bp', type: 'passivo', category: 'Passivo Total', val: 10000000 },
    { year: 2022, docType: 'bp', type: 'ativo', category: 'Caixa e Equivalentes', val: 1800000 },
    { year: 2022, docType: 'bp', type: 'ativo', category: 'Ativo Total', val: 9500000 },
    { year: 2022, docType: 'bp', type: 'passivo', category: 'Patrimônio Líquido', val: 7800000 },
    { year: 2023, docType: 'dre', category: 'Receita Líquida', val: 10000000 },
    { year: 2023, docType: 'dre', category: 'EBITDA', val: 3000000 },
    { year: 2023, docType: 'dre', category: 'Lucro Líquido', val: 2000000 },
    { year: 2023, docType: 'dfc', conta: 'Fluxo de Caixa das Atividades Operacionais (FCO)', val: 2500000 }
  ];

  it('1. Compiles, registers, and executes E3 and validates overall metrics structures', async () => {
    const context = buildBaseContext(mockHistory, 5);
    const results = await runAllEngines(context);

    assert.strictEqual(results.ExecutiveExecutionEngine.success, true);
    const e3Metrics = results.ExecutiveExecutionEngine.inference?.metrics;
    assert.ok(e3Metrics);

    assert.ok(e3Metrics.eesScore >= 0 && e3Metrics.eesScore <= 100);
    assert.ok(e3Metrics.compliance >= 0 && e3Metrics.compliance <= 100);
    assert.ok(e3Metrics.velocity >= 0 && e3Metrics.velocity <= 100);
    assert.ok(e3Metrics.dvrs >= 0 && e3Metrics.dvrs <= 100);
    assert.ok(e3Metrics.accountabilityScore >= 0 && e3Metrics.accountabilityScore <= 100);
    assert.ok(e3Metrics.alignmentScore >= 0 && e3Metrics.alignmentScore <= 100);
    assert.ok(e3Metrics.learningScore >= 0 && e3Metrics.learningScore <= 100);
    assert.ok(e3Metrics.dphs >= 0 && e3Metrics.dphs <= 100);
    assert.ok(e3Metrics.iddsScore >= 0 && e3Metrics.iddsScore <= 100);
    assert.ok(['LOW', 'MODERATE', 'HIGH', 'CRITICAL'].includes(e3Metrics.iddsLevel));
    assert.ok(['HIGH', 'MODERATE', 'LOW', 'CRITICAL'].includes(e3Metrics.capacityForecast));
    assert.ok(e3Metrics.decisions.length > 0);
  });

  it('2. Enforces controlled lifecycle transitions: blocks invalid PROPOSED to COMPLETED transition and reverts', async () => {
    const invalidRecord: ExecutionDecisionRecord = {
      decisionId: 'test_invalid_transition',
      origin: 'Board',
      title: 'Decisão de Transição Inválida',
      description: 'Tentativa de pular aprovação e execução.',
      owner: 'CFO',
      approvalDate: '2023-01-10',
      targetDate: '2023-05-15',
      priority: 2,
      previousStatus: 'PROPOSED',
      status: 'COMPLETED',
      evidence: [],
      effectivenessSource: 'MANUAL'
    };

    const context = buildBaseContext(mockHistory, 5, {
      executionRecords: [invalidRecord]
    });
    const results = await runAllEngines(context);

    const e3Metrics = results.ExecutiveExecutionEngine.inference?.metrics;
    const validatedDec = e3Metrics.decisions.find((d: any) => d.decisionId === 'test_invalid_transition');
    
    assert.ok(validatedDec);
    // Should be reverted to PROPOSED
    assert.strictEqual(validatedDec.status, 'PROPOSED');
    
    // Violation must be emitted
    const violations = results.ExecutiveExecutionEngine.violations || [];
    assert.ok(violations.some(v => v.rule === 'INVALID_LIFECYCLE_TRANSITION'));
  });

  it('3. Enforces Evidence Gate: forces COMPLETED to PARTIALLY_COMPLETED when evidence is missing', async () => {
    const missingEvidenceRecord: ExecutionDecisionRecord = {
      decisionId: 'test_missing_evidence',
      origin: 'Board',
      title: 'Decisão sem Evidência',
      description: 'Esta decisão foi finalizada mas o owner esqueceu de anexar atas de conselho.',
      owner: 'CEO',
      approvalDate: '2023-01-10',
      targetDate: '2023-04-10',
      priority: 1,
      previousStatus: 'IN_PROGRESS',
      status: 'COMPLETED',
      evidence: [],
      effectivenessSource: 'KPI'
    };

    const context = buildBaseContext(mockHistory, 5, {
      executionRecords: [missingEvidenceRecord]
    });
    const results = await runAllEngines(context);

    const e3Metrics = results.ExecutiveExecutionEngine.inference?.metrics;
    const validatedDec = e3Metrics.decisions.find((d: any) => d.decisionId === 'test_missing_evidence');

    assert.ok(validatedDec);
    // Forced to PARTIALLY_COMPLETED
    assert.strictEqual(validatedDec.status, 'PARTIALLY_COMPLETED');
    
    // Violation emitted
    const violations = results.ExecutiveExecutionEngine.violations || [];
    assert.ok(violations.some(v => v.rule === 'EXECUTION_EVIDENCE_MISSING'));
  });

  it('4. Attenuates accountability score penalties by 50% for early-stage or small entities but retains owner warning', async () => {
    const badRecord: ExecutionDecisionRecord = {
      decisionId: 'test_bad_rec',
      origin: 'Board',
      title: 'Decisão Sem Owner',
      description: 'Decisão sem responsável atribuído.',
      owner: '', // Trigger penalty
      approvalDate: '2023-01-10',
      targetDate: '2023-04-10',
      priority: 1,
      previousStatus: 'APPROVED',
      status: 'IN_PROGRESS',
      evidence: [],
      effectivenessSource: 'KPI'
    };

    // cyclesCount = 1 (Early Stage)
    const context = buildBaseContext(mockHistory, 1, {
      executionRecords: [badRecord]
    });
    const results = await runAllEngines(context);

    const e3Metrics = results.ExecutiveExecutionEngine.inference?.metrics;
    assert.ok(e3Metrics);
    
    // Base penalty is -15. Attenuated by 50% => -7.5 rounded. Score should be around 88 due to overdue delay.
    assert.ok(e3Metrics.accountabilityScore >= 80 && e3Metrics.accountabilityScore < 100);
    
    // Missing owner warning should still be apparent (owner field is still empty)
    const dec = e3Metrics.decisions.find((d: any) => d.decisionId === 'test_bad_rec');
    assert.strictEqual(dec.owner, '');
  });

  it('5. Evaluates EES Ceilings: Over 30% critical abandoned caps EES to 55', async () => {
    const abandonedCriticalRecords: ExecutionDecisionRecord[] = [
      {
        decisionId: 'c1',
        origin: 'SDE',
        title: 'Critical 1',
        description: 'Critical',
        targetDate: '2023-12-31',
        priority: 1,
        status: 'ABANDONED',
        evidence: [],
        abandonmentJustification: { reason: 'Valuation issues', approvingAuthority: 'Board' }
      },
      {
        decisionId: 'c2',
        origin: 'SDE',
        title: 'Critical 2',
        description: 'Critical',
        targetDate: '2023-12-31',
        priority: 1,
        status: 'COMPLETED',
        evidence: [{ type: 'board_minutes', description: 'evidence' }],
        effectivenessSource: 'BOARD_VALIDATED'
      }
    ];

    const context = buildBaseContext(mockHistory, 5, {
      executionRecords: abandonedCriticalRecords
    });
    const results = await runAllEngines(context);

    const e3Metrics = results.ExecutiveExecutionEngine.inference?.metrics;
    assert.ok(e3Metrics);
    assert.ok(e3Metrics.ceilingsApplied.includes('OVER_30_PCT_CRITICAL_ABANDONED'));
    assert.ok(e3Metrics.eesScore <= 55);
  });

  it('6. Detects portfolio imbalance and degrades DPHS', async () => {
    // SDE decisions classifications can be mapped to check portfolio. 
    // Create execution list with a single decision representing high concentration
    const concentratedRecords: ExecutionDecisionRecord[] = [
      {
        decisionId: 'preserve_cash', // SDE maps this to STABILIZE classification
        origin: 'SDE',
        title: 'Preservar Caixa',
        description: 'Cortes',
        targetDate: '2023-12-31',
        priority: 1,
        status: 'IN_PROGRESS',
        evidence: []
      }
    ];

    const context = buildBaseContext(mockHistory, 5, {
      executionRecords: concentratedRecords
    });
    const results = await runAllEngines(context);

    const e3Metrics = results.ExecutiveExecutionEngine.inference?.metrics;
    assert.ok(e3Metrics);
    assert.ok(e3Metrics.dphs < 100);
    
    const violations = results.ExecutiveExecutionEngine.violations || [];
    assert.ok(violations.some(v => v.rule === 'EXECUTION_PORTFOLIO_IMBALANCE'));
  });

  it('7. Activates Critical Decision Escalation Protocol up to Level 4 for high age overdue decisions', async () => {
    // Current cycle default date is 2023-12-31. Set target date to 2023-08-01 (150 days overdue)
    const severeOverdueRecord: ExecutionDecisionRecord = {
      decisionId: 'esc_test',
      origin: 'Board',
      title: 'Critical Overdue Action',
      description: 'Severe delay',
      targetDate: '2023-08-01',
      priority: 1,
      status: 'IN_PROGRESS',
      evidence: []
    };

    const context = buildBaseContext(mockHistory, 5, {
      executionRecords: [severeOverdueRecord]
    });
    const results = await runAllEngines(context);

    const e3Metrics = results.ExecutiveExecutionEngine.inference?.metrics;
    assert.ok(e3Metrics);
    assert.ok(e3Metrics.escalations.some((e: any) => e.decisionId === 'esc_test' && e.level === 'LEVEL_4'));
  });

  it('8. Generates Board Pack reports including Evidence & Accountability Register table', () => {
    const simulatedReport: any = {
      inferences: {
        ExecutiveExecutionEngine: {
          metrics: {
            eesScore: 85,
            eesClassification: 'Execution Excellence',
            dvrs: 90,
            dvrClassification: 'HIGH_VALUE_REALIZATION',
            iddsScore: 10,
            iddsLevel: 'LOW',
            capacityForecast: 'HIGH',
            decisions: [
              {
                title: 'Preservar Caixa',
                owner: 'Carlos CFO',
                status: 'COMPLETED',
                evidence: [{ type: 'board_minutes', description: 'minutes' }],
                targetDate: '2023-03-31',
                completionDate: '2023-03-28',
                expectedValue: 100,
                realizedValue: 90,
                effectivenessSource: 'KPI',
                rootFriction: undefined
              }
            ]
          }
        }
      }
    };

    const docOutput = InstitutionalBoardPackDocumentRuntime.generateDocument(simReportWrapper(simulatedReport), 'BOARD');
    assert.strictEqual(docOutput.status, 'COMPLETE');

    const md = docOutput.markdownSections;
    assert.ok(md.executiveEvidenceAccountabilityRegister);
    assert.ok(md.executiveEvidenceAccountabilityRegister.includes('| Preservar Caixa |'));
    assert.ok(md.decisionValueRealizationReport);
    assert.ok(md.decisionValueRealizationReport.includes('Decision Value Realization Score'));
    assert.ok(md.decisionDebtAnalysis);
    assert.ok(md.decisionDebtAnalysis.includes('Decision Debt Analysis'));
    assert.ok(md.executionCapacityForecast);
    assert.ok(md.executionCapacityForecast.includes('Execution Capacity Forecast'));
  });

  it('9. Automatically logs Execution Memory Records for completed decisions', async () => {
    const context = buildBaseContext(mockHistory, 5);
    const results = await runAllEngines(context);

    const e3Metrics = results.ExecutiveExecutionEngine.inference?.metrics;
    assert.ok(e3Metrics);
    
    // Default fallback records have preserve_cash completed. It should produce memory records.
    assert.ok(e3Metrics.executionMemoryRecords.length > 0);
    const memRec = e3Metrics.executionMemoryRecords[0];
    assert.ok(memRec.decisionId);
    assert.ok(memRec.cycle);
    assert.ok(memRec.effectiveness);
    assert.ok(memRec.valueRealization);
  });

  // Helper function to wrap mock report to full ExecutiveIntelligenceReport
  function simReportWrapper(obj: any): any {
    return {
      context: { segment: 'Geral', businessModel: 'Asset Light', capitalIntensity: 'Leve', stage: 'Maturity', operationalProfile: 'Normal' },
      institutionalContext: { tenantId: 'TENANT-A', currentCycle: '2023' },
      scores: { financial: 80, operational: 80, governance: 80, structural: 80, composite: 80 },
      compliance: { confidenceLevel: 'HIGH_CONFIDENCE' },
      ...obj
    };
  }

});
