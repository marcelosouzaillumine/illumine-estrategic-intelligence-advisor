import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { LegacyDFCAdapter } from '../src/runtime/adapters/LegacyDFCAdapter';
import { InstitutionalContext } from '../src/runtime/types';
import { InstitutionalSurvivabilityEngine } from '../src/capabilities/runtime/decision-intelligence/InstitutionalSurvivabilityEngine';

describe('Earnings Quality Engine (EQE) - Integrity & Calibration Tests', () => {

  it('1. Deve calcular pontuação excelente para lucros recorrentes e caixa-conversível (Institutional Grade)', async () => {
    const mockHistory = [
      // DFC Oficial do Exercício 2023
      { year: 2023, docType: 'dfc', conta: 'Recebimento de Clientes', val: 120000 },
      { year: 2023, docType: 'dfc', conta: 'Pagamento a Fornecedores', val: -40000 },
      { year: 2023, docType: 'dfc', conta: 'Fluxo de Caixa das Atividades Operacionais (FCO)', val: 80000 },
      
      // Balanço Patrimonial de 2023
      { year: 2023, docType: 'bp', type: 'ativo', category: 'Ativo Circulante', val: 200000 },
      { year: 2023, docType: 'bp', type: 'ativo', category: 'Caixa e Equivalentes', val: 100000 },
      { year: 2023, docType: 'bp', type: 'passivo', category: 'Passivo Circulante', val: 50000 },
      { year: 2023, docType: 'bp', type: 'ativo', category: 'Ativo Total', val: 500000 },
      { year: 2023, docType: 'bp', type: 'ativo', category: 'Imobilizado', val: 100000 },
      
      // Balanço Patrimonial de 2022 (Ano anterior)
      { year: 2022, docType: 'bp', type: 'ativo', category: 'Caixa e Equivalentes', val: 50000 },
      
      // DRE de 2023
      { year: 2023, docType: 'dre', category: 'Receita Líquida', val: 200000 },
      { year: 2023, docType: 'dre', category: 'EBITDA', val: 100000 },
      { year: 2023, docType: 'dre', category: 'Lucro Líquido', val: 70000 },
      { year: 2023, docType: 'dre', category: 'Depreciação e Amortização', val: 10000 },
      { year: 2023, docType: 'dre', category: 'Receitas Não Recorrentes', val: 0 }
    ];

    const context: InstitutionalContext = {
      input: {
        rawFinancialData: {
          filterYear: 2023,
          allHistoryData: mockHistory
        },
        historicalCyclesCount: 4, // HIGH_CONFIDENCE
        isMockData: false
      },
      normalizedData: {},
      inferences: {},
      globalConfidence: 'HIGH',
      violations: [],
      executedEngines: [],
      executionStatus: 'PENDING'
    };

    const result = await LegacyDFCAdapter.execute(context);
    assert.strictEqual(result.success, true);
    
    const eqe = result.inference?.metrics.fiduciary.earningsQuality;
    assert.ok(eqe);
    
    // Deve pontuar alto (Institutional Grade)
    assert.ok(eqe.pureViewModel.score >= 85, `Score esperado >= 85, obtido: ${eqe.pureViewModel.score}`);
    assert.strictEqual(eqe.level, 'Institutional Grade Earnings');
    assert.strictEqual(eqe.confidence, 'HIGH_CONFIDENCE');
    assert.strictEqual(eqe.alerts.length, 0);
  });

  it('2. Deve disparar alertas e degradar score para lucros de baixa qualidade', async () => {
    const mockHistory = [
      // DFC Oficial do Exercício 2023 (FCO Real Negativo -50k, suporte de sócios 60k)
      { year: 2023, docType: 'dfc', conta: 'Recebimento de Clientes', val: 20000 },
      { year: 2023, docType: 'dfc', conta: 'Pagamento a Fornecedores', val: -70000 },
      { year: 2023, docType: 'dfc', conta: 'Conta Corrente Sócios', val: 60000 }, 
      { year: 2023, docType: 'dfc', conta: 'Fluxo de Caixa das Atividades Operacionais (FCO)', val: 10000 }, 
      
      // Balanço Patrimonial de 2023
      { year: 2023, docType: 'bp', type: 'ativo', category: 'Ativo Circulante', val: 200000 },
      { year: 2023, docType: 'bp', type: 'ativo', category: 'Caixa e Equivalentes', val: 5000 }, 
      { year: 2023, docType: 'bp', type: 'passivo', category: 'Passivo Circulante', val: 100000 }, 
      { year: 2023, docType: 'bp', type: 'ativo', category: 'Ativo Total', val: 500000 },
      { year: 2023, docType: 'bp', type: 'ativo', category: 'Imobilizado', val: 200000 }, // Heavy asset
      
      // DRE de 2023 (Lucro líquido 40k, EBITDA 50k, mas receitas não recorrentes 45k)
      { year: 2023, docType: 'dre', category: 'Receita Líquida', val: 200000 },
      { year: 2023, docType: 'dre', category: 'EBITDA', val: 50000 },
      { year: 2023, docType: 'dre', category: 'Lucro Líquido', val: 40000 },
      { year: 2023, docType: 'dre', category: 'Depreciação e Amortização', val: 1000 }, // Low depreciation on 200k asset
      { year: 2023, docType: 'dre', category: 'Ganho não recorrente', val: 45000 }
    ];

    const context: InstitutionalContext = {
      input: {
        rawFinancialData: {
          filterYear: 2023,
          allHistoryData: mockHistory
        },
        historicalCyclesCount: 3, // MODERATE_CONFIDENCE
        isMockData: false
      },
      normalizedData: {},
      inferences: {},
      globalConfidence: 'HIGH',
      violations: [],
      executedEngines: [],
      executionStatus: 'PENDING'
    };

    const result = await LegacyDFCAdapter.execute(context);
    assert.strictEqual(result.success, true);
    
    const eqe = result.inference?.metrics.fiduciary.earningsQuality;
    assert.ok(eqe);
    
    // Score deve estar na faixa crítica
    assert.ok(eqe.pureViewModel.score < 50, `Score esperado < 50, obtido: ${eqe.pureViewModel.score}`);
    assert.strictEqual(eqe.confidence, 'HIGH_CONFIDENCE');
    
    // Alertas disparados
    assert.ok(eqe.alerts.includes("A lucratividade contábil não é suportada pela geração de caixa operacional."));
    assert.ok(eqe.alerts.includes("Eventos não recorrentes relevantes impactam materialmente a interpretação dos lucros."));
    assert.ok(eqe.alerts.includes("A continuidade operacional demonstra dependência parcial de liquidez suportada pelos sócios."));
    assert.ok(eqe.alerts.includes("A estrutura contábil apresenta indicadores de elevada sensibilidade de accrual ou capitalização."));
  });

  it('3. Deve aplicar a proteção early-stage no suporte dos sócios e agravar se for recorrente', async () => {
    const mockHistory = [
      // DFC Oficial do Exercício 2023
      { year: 2023, docType: 'dfc', conta: 'Recebimento de Clientes', val: 20000 },
      { year: 2023, docType: 'dfc', conta: 'Pagamento a Fornecedores', val: -40000 },
      { year: 2023, docType: 'dfc', conta: 'Conta Corrente Sócios', val: 80000 }, // Heavy RP support
      { year: 2023, docType: 'dfc', conta: 'Fluxo de Caixa das Atividades Operacionais (FCO)', val: 40000 },
      
      // Balanço Patrimonial de 2023
      { year: 2023, docType: 'bp', type: 'ativo', category: 'Caixa e Equivalentes', val: 50000 },
      { year: 2023, docType: 'bp', type: 'ativo', category: 'Ativo Total', val: 300000 },
      
      // DRE de 2023
      { year: 2023, docType: 'dre', category: 'Receita Líquida', val: 100000 },
      { year: 2023, docType: 'dre', category: 'EBITDA', val: 10000 },
      { year: 2023, docType: 'dre', category: 'Lucro Líquido', val: 5000 },

      // Ciclo histórico anterior com aporte
      { year: 2022, docType: 'dfc', conta: 'Conta Corrente Sócios', val: 30000 }
    ];

    const context: InstitutionalContext = {
      input: {
        rawFinancialData: {
          filterYear: 2023,
          allHistoryData: mockHistory
        },
        historicalCyclesCount: 2, // Early-stage
        isMockData: false
      },
      normalizedData: {},
      inferences: {},
      globalConfidence: 'HIGH',
      violations: [],
      executedEngines: [],
      executionStatus: 'PENDING'
    };

    const result = await LegacyDFCAdapter.execute(context);
    assert.strictEqual(result.success, true);
    
    const eqe = result.inference?.metrics.fiduciary.earningsQuality;
    assert.ok(eqe);
    
    // Support ratio is 80k / 10k = 8.0 (>0.5), which normally gives a deduction of 13.
    // However, isEarlyStage is active, so the deduction is capped at 50% of maximum deduction (6.5).
    // Also, because there is 1 previous cycle with support, we add progressive severity: +2 * 1 = +2.
    // Total deduction = 6.5 + 2 = 8.5.
    // Support score = 15 - 8.5 = 6.5.
    assert.strictEqual(eqe.dimensions.shareholderSupport.pureViewModel.score, 6.5);
  });

  it('4. Deve sanitizar termos proibidos em diagnósticos fiduciários e DFC', async () => {
    const mockHistory = [
      { year: 2023, docType: 'dfc', conta: 'Fraude de Vendas', val: -10000 },
      { year: 2023, docType: 'dfc', conta: 'Manipulação de Resultado', val: 50000 },
      { year: 2023, docType: 'dfc', conta: 'Lucros Falsos Estimados', val: 40000 },
      { year: 2023, docType: 'dfc', conta: 'Colapso Irreversível de Caixa', val: -80000 },
      
      // Balanço Patrimonial de 2023
      { year: 2023, docType: 'bp', type: 'ativo', category: 'Caixa e Equivalentes', val: 2000 },
      { year: 2023, docType: 'bp', type: 'ativo', category: 'Ativo Total', val: 100000 },
      
      // DRE de 2023
      { year: 2023, docType: 'dre', category: 'EBITDA', val: -20000 },
      { year: 2023, docType: 'dre', category: 'Lucro Líquido', val: -25000 }
    ];

    const context: InstitutionalContext = {
      input: {
        rawFinancialData: {
          filterYear: 2023,
          allHistoryData: mockHistory
        },
        historicalCyclesCount: 2, // Early-stage
        isMockData: false
      },
      normalizedData: {},
      inferences: {},
      globalConfidence: 'HIGH',
      violations: [],
      executedEngines: [],
      executionStatus: 'PENDING'
    };

    const result = await LegacyDFCAdapter.execute(context);
    assert.strictEqual(result.success, true);
    
    // O texto do diagnóstico deve ser totalmente limpo de termos forensic-speculative
    const diag = result.inference?.narrative?.diagnostic || '';
    assert.ok(!diag.toLowerCase().includes('fraude'));
    assert.ok(!diag.toLowerCase().includes('manipulacao'));
    assert.ok(!diag.toLowerCase().includes('manipulação'));
    assert.ok(!diag.toLowerCase().includes('lucro falso'));
    assert.ok(!diag.toLowerCase().includes('lucros falsos'));
    assert.ok(!diag.toLowerCase().includes('colapso irreversivel'));
    assert.ok(!diag.toLowerCase().includes('colapso irreversível'));
  });

  it('5. Deve testar a integração com o InstitutionalSurvivabilityEngine', () => {
    // Caso A: EQS < 50 mas sem gatilhos ativos -> Nenhuma penalidade
    const reportA = {
      scores: { financial: 70, operational: 80, governance: 80, structural: 80, composite: 75 },
      ebitda: 10000,
      runway: 12,
      inferences: {
        LegacyDFCAdapter: {
          metrics: {
            fiduciary: {
              fcoOperacionalReal: 5000,
              runway: 12,
              intensidadePartesRelacionadas: 0.1,
              earningsQuality: { score: 45 }
            }
          }
        }
      }
    };
    const resA = InstitutionalSurvivabilityEngine.calculate(reportA);
    assert.strictEqual(resA.operational, 80); // operational score remains intact

    // Caso B: EQS < 50 E EBITDA Margin < 0 (ebitda < 0) -> Aplica 15 pontos de penalidade no score operacional
    const reportB = {
      scores: { financial: 70, operational: 80, governance: 80, structural: 80, composite: 75 },
      ebitda: -1000, // EBITDA < 0 trigger
      runway: 12,
      inferences: {
        LegacyDFCAdapter: {
          metrics: {
            fiduciary: {
              fcoOperacionalReal: 5000,
              runway: 12,
              intensidadePartesRelacionadas: 0.1,
              earningsQuality: { score: 45 }
            }
          }
        }
      }
    };
    const resB = InstitutionalSurvivabilityEngine.calculate(reportB);
    // Operational survivability has base 80.
    // -25 for negative EBITDA (ebitda < 0).
    // -15 for EQS < 50 with negative EBITDA trigger.
    // Math.max(10, 80 - 25 - 15) = 40.
    assert.strictEqual(resB.operational, 40);
  });

});
