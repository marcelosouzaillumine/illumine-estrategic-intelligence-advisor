import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { executiveRuntime } from '../src/core/runtime/executive-intelligence-runtime';

describe('Institutional Financial Operating System (EFOS) — RC-1.4 Suite', () => {

  const createBaseDataset = (overrides = {}) => {
    return {
      historicalCyclesCount: 2,
      rawFinancialData: {
        segmentoEmpresa: 'SaaS e Software de Gestão',
        bpSummary: {
          ativoTotal: 100000,
          ativoCirculante: 95000,
          ativoNaoCirculante: 5000,
          passivoTotal: 20000,
          passivoCirculante: 15000,
          passivoNaoCirculante: 5000,
          patrimonioLiquido: 80000,
          caixaEquivalentes: 85000,
          estoques: 10000,
          clientes: 10000,
          fornecedores: 5000,
          passivosFinanceiros: 5000,
          capitalSocial: 100000,
          lucrosPrejuizos: 20000,
          isBalanced: true,
          divergence: 0
        },
        ebitda: 25000,
        lucroLiquido: 15000,
        prevPl: 75000,
      },
      bpData: [
        { category: 'Ativo Total', value: 100000 },
        { category: 'Patrimônio Líquido', value: 80000 }
      ],
      dreData: [
        { id: 'RECEITA_BRUTA', category: 'RECEITA OPERACIONAL BRUTA', value: 100000 },
        { id: 'EBITDA', category: 'EBITDA', value: 25000 },
        { id: 'LUCRO_LÍQUIDO_DO_EXERCÍCIO', category: 'LUCRO LÍQUIDO DO EXERCÍCIO', value: 15000 }
      ],
      cashFlowData: [
        {
          currentCashBalance: 85000,
          monthlyCashBurnRate: 0,
          operatingCashFlow: 20000,
          debtAmortization: 0,
          fundingInflows: 0,
          partnerCapitalInjections: 0,
          receivablesAging: 30,
          overdueReceivables: 0,
          shortTermObligations: 15000,
          recurringFixedCashOutflows: 5000,
          seasonalityContext: false
        }
      ],
      dlpaData: [
        {
          distributedDividends: 5000,
          partnerCapitalInjections: 0,
          retainedEarnings: 10000,
          reserveReinforcement: 2000,
          capitalSocial: 100000,
          lucrosRetidosAcumulados: 20000
        }
      ],
      ...overrides
    };
  };

  it('1. DFC Fail-Closed Block', () => {
    // Missing DFC data
    const dataset = createBaseDataset();
    delete (dataset as any).cashFlowData;

    const report = executiveRuntime.generateExecutiveReport(dataset);
    assert.equal(report.cashFlowReport?.isAvailable, false);
    assert.equal(report.cashFlowReport?.overallNarrative, 'DFC indisponível para análise institucional.');
    assert.equal(report.cashFlowReport?.operational.narrative, 'DFC indisponível para análise institucional.');
    assert.equal(report.cashFlowReport?.treasury.narrative, 'DFC indisponível para análise institucional.');
  });

  it('2. DLPA Fail-Closed Block', () => {
    // Missing DLPA data
    const dataset = createBaseDataset();
    delete (dataset as any).dlpaData;

    const report = executiveRuntime.generateExecutiveReport(dataset);
    assert.equal(report.capitalGovernanceReport?.isAvailable, false);
    assert.equal(report.capitalGovernanceReport?.overallNarrative, 'DLPA/DMPL indisponível para análise institucional.');
    assert.equal(report.capitalGovernanceReport?.retention.narrative, 'DLPA/DMPL indisponível para análise institucional.');
    assert.equal(report.capitalGovernanceReport?.distribution.narrative, 'DLPA/DMPL indisponível para análise institucional.');
  });

  it('3. KPI Semantic Interpretation', () => {
    const dataset = createBaseDataset();
    const report = executiveRuntime.generateExecutiveReport(dataset);
    
    // Margem EBITDA is ebitdaVal (which is 25%)
    const ebitdaKpi = report.metrics.kpis.find(k => k.name === 'Margem EBITDA');
    assert.ok(ebitdaKpi);
    assert.ok((ebitdaKpi as any).semanticInterpretation);
    assert.ok((ebitdaKpi as any).fiduciaryJustification);
    assert.equal((ebitdaKpi as any).semanticInterpretation, 'Excelente eficiência operacional de margem.');
  });

  it('4. Cross-Statement Tension Detection', () => {
    // Case 1: Lucro sem caixa (Profitable DRE but negative Cash Flow)
    const dataset = createBaseDataset();
    dataset.cashFlowData[0].operatingCashFlow = -15000;

    const report = executiveRuntime.generateExecutiveReport(dataset);
    assert.ok(report.crossStatementCausality);
    
    const hasLucroSemCaixa = report.crossStatementCausality.tensions.some(t => t.id === 'LUCRO_SEM_CAIXA');
    assert.ok(hasLucroSemCaixa, 'Should detect EBITDA positive vs Operating Cash Flow negative tension.');
    assert.ok(report.crossStatementCausality.stressPatterns.includes('DESCALAS_GIRO'));
  });

  it('5. Contradiction Blocking and Priority Consolidation', () => {
    // Case 2: Payout of dividends during PL erosion
    const dataset = createBaseDataset({
      historicalCyclesCount: 5
    });
    // Simulate PL erosion/drain: dividends exceed profit
    dataset.dlpaData[0].distributedDividends = 30000;
    dataset.rawFinancialData.lucroLiquido = 10000;

    const report = executiveRuntime.generateExecutiveReport(dataset);
    assert.ok(report.advisory.actionMatrix);
    
    // Check that dividend distribution recommendation is blocked due to capital governance erosion conflict
    const hasDistributeAction = report.advisory.actionMatrix.some(a => 
      a.title.toLowerCase().includes('distribu') || a.title.toLowerCase().includes('dividendos')
    );
    assert.equal(hasDistributeAction, false, 'Dividend action must be blocked when capital governance shows erosion/drain.');
  });

  it('6. Institutional Financial Thesis Generation', () => {
    const dataset = createBaseDataset();
    const report = executiveRuntime.generateExecutiveReport(dataset);

    assert.ok(report.financialThesis);
    assert.ok(report.financialThesis.thesis);
    assert.ok(report.financialThesis.thesis.includes('viabilidade comercial'));
  });

  it('7. Executive Narrative Orchestrator Consistency', () => {
    const dataset = createBaseDataset();
    const report = executiveRuntime.generateExecutiveReport(dataset);

    assert.ok(report.orchestratedNarrative);
    assert.ok(report.orchestratedNarrative.title);
    assert.ok(report.orchestratedNarrative.leadParagraph);
    assert.ok(report.orchestratedNarrative.causalFlowSummary);
  });

  it('8. Executive Continuity & Consistency Check', () => {
    const dataset = createBaseDataset();
    const report = executiveRuntime.generateExecutiveReport(dataset);

    assert.ok(report.consistencyReport);
    assert.equal(report.consistencyReport.isValid, true);
  });

});
