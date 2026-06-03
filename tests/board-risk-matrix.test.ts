import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { BoardRiskMatrixAdapter } from '../src/runtime/adapters/BoardRiskMatrixAdapter';
import { LegacyDFCAdapter } from '../src/runtime/adapters/LegacyDFCAdapter';
import { LegacyFinancialAdapter } from '../src/runtime/adapters/LegacyFinancialAdapter';
import { LegacyDREAdapter } from '../src/runtime/adapters/LegacyDREAdapter';
import { StressTestAdapter } from '../src/runtime/adapters/StressTestAdapter';
import { InstitutionalContext } from '../src/runtime/types';
import { InstitutionalBoardPackDocumentRuntime } from '../src/core/runtime/institutional-reporting/InstitutionalBoardPackDocumentRuntime';
import { ExecutiveIntelligenceReport } from '../src/core/runtime/executive-intelligence-runtime';

describe('Board Risk Matrix (BRM) - Engine & Report Integration Tests', () => {

  const setupMockContext = async (mockHistory: any[], cycles = 3): Promise<InstitutionalContext> => {
    const bpRows = mockHistory.filter(d => d.docType === 'bp' || d.type === 'bp');
    const dreRows = mockHistory.filter(d => d.docType === 'dre' || d.type === 'dre');
    
    const { buildBPHierarchy } = await import('../src/lib/bpEngine');
    const bpResultHierarchy = buildBPHierarchy(bpRows);
    const bpSummary = bpResultHierarchy.summary;
    
    const ebitdaRow = dreRows.find(d => (d.category || d.conta || '').toLowerCase().includes('ebitda'));
    const ebitda = ebitdaRow?.val || 0;
    
    const llRow = dreRows.find(d => {
      const cat = (d.category || d.conta || '').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
      return cat.includes('lucro liquido') || cat.includes('resultado liquido') || cat.includes('prejuizo');
    });
    const lucroLiquido = llRow?.val || 0;
    
    const prevBpRows = mockHistory.filter(d => (d.docType === 'bp' || d.type === 'bp') && d.year === 2022);
    const { summary: prevBpSummary } = buildBPHierarchy(prevBpRows);
    const prevPl = prevBpSummary?.patrimonioLiquido || 0;
    const prevCaixa = prevBpSummary?.caixaEquivalentes || 0;
    
    const prevDreRows = mockHistory.filter(d => (d.docType === 'dre' || d.type === 'dre') && d.year === 2022);
    const prevEbitdaRow = prevDreRows.find(d => (d.category || d.conta || '').toLowerCase().includes('ebitda'));
    const prevEbitda = prevEbitdaRow?.val || 0;

    const context: InstitutionalContext = {
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
          historicalCyclesCount: cycles
        },
        dreData: dreRows,
        historicalCyclesCount: cycles,
        isMockData: false
      },
      normalizedData: {},
      inferences: {},
      globalConfidence: 'HIGH',
      violations: [],
      executedEngines: [],
      executionStatus: 'PENDING'
    };

    // Run dependencies
    const bpResult = await LegacyFinancialAdapter.execute(context);
    if (bpResult.success && bpResult.inference) {
      context.inferences['LegacyFinancialAdapter'] = bpResult.inference;
      context.inferences['Balanço Patrimonial e Saúde Financeira'] = bpResult.inference;
    }

    const dreResult = await LegacyDREAdapter.execute(context);
    if (dreResult.success && dreResult.inference) {
      context.inferences['LegacyDREAdapter'] = dreResult.inference;
      context.inferences['DRE e Performance Operacional'] = dreResult.inference;
    }

    const dfcResult = await LegacyDFCAdapter.execute(context);
    if (dfcResult.success && dfcResult.inference) {
      context.inferences['LegacyDFCAdapter'] = dfcResult.inference;
      context.inferences['Inteligência de Caixa (DFC)'] = dfcResult.inference;
    }

    const stressResult = await StressTestAdapter.execute(context);
    if (stressResult.success && stressResult.inference) {
      context.inferences['StressTestAdapter'] = stressResult.inference;
    }

    return context;
  };

  it('1. Deve calcular pontuação de resiliência estável para empresa saudável', async () => {
    const mockHistory = [
      { year: 2023, docType: 'dfc', conta: 'Recebimento de Clientes', val: 120000 },
      { year: 2023, docType: 'dfc', conta: 'Pagamento a Fornecedores', val: -40000 },
      { year: 2023, docType: 'dfc', conta: 'Fluxo de Caixa das Atividades Operacionais (FCO)', val: 80000 },
      
      { year: 2023, docType: 'bp', type: 'ativo', category: 'Ativo Circulante', val: 200000 },
      { year: 2023, docType: 'bp', type: 'ativo', category: 'Caixa e Equivalentes', val: 100000 },
      { year: 2023, docType: 'bp', type: 'ativo', category: 'Estoques', val: 10000 },
      { year: 2023, docType: 'bp', type: 'passivo', category: 'Passivo Circulante', val: 50000 },
      { year: 2023, docType: 'bp', type: 'ativo', category: 'Ativo Total', val: 500000 },
      { year: 2023, docType: 'bp', type: 'passivo', category: 'Patrimônio Líquido', val: 400000 },
      { year: 2023, docType: 'bp', type: 'passivo', category: 'Passivos Financeiros', val: 20000 },
      { year: 2023, docType: 'bp', type: 'passivo', category: 'Passivo Total', val: 100000 },
      
      { year: 2022, docType: 'bp', type: 'ativo', category: 'Caixa e Equivalentes', val: 50000 },
      { year: 2022, docType: 'bp', type: 'passivo', category: 'Patrimônio Líquido', val: 350000 },
      
      { year: 2023, docType: 'dre', category: 'EBITDA', val: 100000 },
      { year: 2023, docType: 'dre', category: 'Lucro Líquido', val: 70000 },
      { year: 2023, docType: 'dre', category: 'Receita Líquida', val: 500000 }
    ];

    const context = await setupMockContext(mockHistory, 3);
    const result = await BoardRiskMatrixAdapter.execute(context);

    assert.strictEqual(result.success, true);
    const metrics = result.inference?.metrics;
    assert.ok(metrics);
    assert.ok(metrics.boardRiskScore >= 85, `Board Risk Score deve ser >= 85, obteve: ${metrics.boardRiskScore}`);
    assert.strictEqual(metrics.institutionalIntegrityLevel, 'Institutional Resilience');
    assert.strictEqual(metrics.bankingReadinessScore, 100);
    assert.strictEqual(metrics.bankingReadinessLevel, 'Institutional Banking Grade');
    assert.strictEqual(metrics.alerts.length, 0);
  });

  it('2. Deve disparar alertas e degradar scores sob estresse e alta dependência societária', async () => {
    const mockHistory = [
      { year: 2023, docType: 'dfc', conta: 'Recebimento de Clientes', val: 20000 },
      { year: 2023, docType: 'dfc', conta: 'Pagamento a Fornecedores', val: -50000 },
      { year: 2023, docType: 'dfc', conta: 'Conta Corrente Sócios', val: -60000 }, 
      { year: 2023, docType: 'dfc', conta: 'Fluxo de Caixa das Atividades Operacionais (FCO)', val: -90000 },
      
      { year: 2023, docType: 'bp', type: 'ativo', category: 'Ativo Circulante', val: 200000 },
      { year: 2023, docType: 'bp', type: 'ativo', category: 'Caixa e Equivalentes', val: 5000 }, 
      { year: 2023, docType: 'bp', type: 'ativo', category: 'Estoques', val: 140000 }, 
      { year: 2023, docType: 'bp', type: 'passivo', category: 'Passivo Circulante', val: 350000 }, 
      { year: 2023, docType: 'bp', type: 'ativo', category: 'Ativo Total', val: 500000 },
      { year: 2023, docType: 'bp', type: 'passivo', category: 'Patrimônio Líquido', val: 30000 }, 
      { year: 2023, docType: 'bp', type: 'passivo', category: 'Empréstimos', val: 300000 }, 
      { year: 2023, docType: 'bp', type: 'passivo', category: 'Passivo Total', val: 470000 },
      
      { year: 2022, docType: 'bp', type: 'ativo', category: 'Caixa e Equivalentes', val: 4000 },
      { year: 2022, docType: 'dre', category: 'Lucro Líquido', val: -10000 },
      { year: 2021, docType: 'dre', category: 'Lucro Líquido', val: -10000 },
      { year: 2023, docType: 'dre', category: 'Receita Operacional Bruta', val: 100000 },
      { year: 2023, docType: 'dre', category: 'Custo Mercadorias/Produtos/Serviços Vendidos', val: 40000 },
      { year: 2023, docType: 'dre', category: 'Despesas Gerais', val: 70000 },
      { year: 2023, docType: 'dre', category: 'Resultado Financeiro', val: -20000 }
    ];

    const context = await setupMockContext(mockHistory, 3);
    const result = await BoardRiskMatrixAdapter.execute(context);

    assert.strictEqual(result.success, true);
    const metrics = result.inference?.metrics;
    assert.ok(metrics);
    assert.ok(metrics.boardRiskScore < 50, `Board Risk Score esperado < 50 sob estresse severo, obteve: ${metrics.boardRiskScore}`);
    assert.strictEqual(metrics.institutionalIntegrityLevel, 'Critical Fiduciary Risk');
    assert.ok(metrics.bankingReadinessScore < 50, `Banking Readiness esperado < 50, obteve: ${metrics.bankingReadinessScore}`);
    
    // Alertas que devem disparar
    assert.ok(metrics.alerts.includes('Treasury survivability horizon is critically compressed.'));
    assert.ok(metrics.alerts.includes('Operational profitability quality presents structural fragility.'));
    assert.ok(metrics.alerts.includes('Operational continuity demonstrates elevated dependency on shareholder-supported structures.'));
    assert.ok(metrics.alerts.includes('Capital structure presents elevated short-term refinancing pressure.'));
    assert.ok(metrics.alerts.includes('Institutional structure presents restricted banking-grade sustainability.'));
  });

  it('3. Deve atenuar nota e narrativas sob proteção de empresas early-stage', async () => {
    const mockHistory = [
      { year: 2023, docType: 'dfc', conta: 'Recebimento de Clientes', val: 20000 },
      { year: 2023, docType: 'dfc', conta: 'Pagamento a Fornecedores', val: -22000 },
      { year: 2023, docType: 'dfc', conta: 'Fluxo de Caixa das Atividades Operacionais (FCO)', val: -2000 },
      
      { year: 2023, docType: 'bp', type: 'ativo', category: 'Ativo Total', val: 100000 },
      { year: 2023, docType: 'bp', type: 'passivo', category: 'Patrimônio Líquido', val: 80000 },
      
      { year: 2023, docType: 'dre', category: 'EBITDA', val: -1000 },
      { year: 2023, docType: 'dre', category: 'Lucro Líquido', val: -2000 }
    ];

    const context = await setupMockContext(mockHistory, 2); // 2 cycles = early-stage
    const result = await BoardRiskMatrixAdapter.execute(context);

    assert.strictEqual(result.success, true);
    const metrics = result.inference?.metrics;
    assert.strictEqual(metrics.dimensions.stability, 80); // Stability score set to 80 under protection
    
    const diag = result.inference?.narrative?.diagnostic || '';
    assert.ok(diag.includes('Contexto de scale-up e formação de capital atenuado'));
    assert.ok(!diag.includes('collapse'));
    assert.ok(!diag.includes('fraud'));
  });

  it('4. Deve gerar as 6 seções requeridas no Board Pack markdown quando os dados da BRM estão presentes', () => {
    const mockReport: any = {
      institutionalContext: {
        tenantId: 'TENANT_TEST',
        currentCycle: '2023-Q4'
      } as any,
      runtimeMetadata: {
        lineageHash: 'HASH_BRM_123',
        auditTrail: ['Event A']
      } as any,
      compliance: {
        fiduciaryEnforcement: {
          complianceStatus: 'VALIDATED'
        }
      } as any,
      strategicIntelligence: {
        thesis: {
          unifiedThesisStatement: 'Demonstração de estabilidade operacional.'
        }
      } as any,
      inferences: {
        'BoardRiskMatrixAdapter': {
          metrics: {
            boardRiskScore: 88,
            institutionalIntegrityLevel: 'Institutional Resilience',
            bankingReadinessScore: 95,
            bankingReadinessLevel: 'Institutional Banking Grade',
            alerts: ['Alert 1'],
            explainability: {
              treasury: { formula: 'CQS', rationale: 'Quality check', lineage: 'Lineage test' }
            },
            auditability: {
              reconstructionTrace: 'Trace Mutuo'
            },
            dimensions: {
              treasury: 90,
              earnings: 85,
              survivability: 95,
              governance: 80,
              capital: 90,
              stability: 90
            },
            divergence: { cqs: 90, eqs: 85, divergenceScore: 5 }
          }
        }
      }
    };

    const documentResult = InstitutionalBoardPackDocumentRuntime.generateDocument(mockReport as ExecutiveIntelligenceReport, 'BOARD');
    
    assert.strictEqual(documentResult.status, 'COMPLETE');
    
    // Assert 6 required sections
    assert.ok(documentResult.markdownSections.executiveFiduciarySummary);
    assert.ok(documentResult.markdownSections.riskHeatmap);
    assert.ok(documentResult.markdownSections.treasuryRisk);
    assert.ok(documentResult.markdownSections.earningsIntegrity);
    assert.ok(documentResult.markdownSections.bankingReadiness);
    assert.ok(documentResult.markdownSections.governanceDependency);

    // Verify sections contain expected text
    assert.ok(documentResult.markdownSections.executiveFiduciarySummary.includes('Board Risk Score**: 88/100'));
    assert.ok(documentResult.markdownSections.riskHeatmap.includes('| Treasury Integrity | 90 | ESTÁVEL |'));
    assert.ok(documentResult.markdownSections.treasuryRisk.includes('- **Treasury Integrity Score**: 90/100'));
    assert.ok(documentResult.markdownSections.bankingReadiness.includes('- **Banking Readiness Score**: 95/100 (Institutional Banking Grade)'));
    assert.ok(documentResult.markdownSections.governanceDependency.includes('- **Governance Exposure Score**: 80/100'));
  });

});
