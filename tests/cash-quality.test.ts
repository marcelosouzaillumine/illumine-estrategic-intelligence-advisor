import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { LegacyDFCAdapter } from '../src/runtime/adapters/LegacyDFCAdapter';
import { InstitutionalContext } from '../src/runtime/types';

describe('Cash Quality Score (CQS) - Engine & Integrity Tests', () => {

  it('1. Deve calcular pontuação alta para empresa saudável autônoma (Institutional Grade)', async () => {
    const mockHistory = [
      // DFC Oficial do Exercício 2023
      { year: 2023, docType: 'dfc', conta: 'Recebimento de Clientes', val: 120000 },
      { year: 2023, docType: 'dfc', conta: 'Pagamento a Fornecedores', val: -40000 },
      { year: 2023, docType: 'dfc', conta: 'Fluxo de Caixa das Atividades Operacionais (FCO)', val: 80000 },
      
      // Balanço Patrimonial de 2023 (Sem estoques, sem socios, liquidez excelente)
      { year: 2023, docType: 'bp', type: 'ativo', category: 'Ativo Circulante', val: 200000 },
      { year: 2023, docType: 'bp', type: 'ativo', category: 'Caixa e Equivalentes', val: 100000 },
      { year: 2023, docType: 'bp', type: 'ativo', category: 'Estoques', val: 10000 },
      { year: 2023, docType: 'bp', type: 'passivo', category: 'Passivo Circulante', val: 50000 },
      { year: 2023, docType: 'bp', type: 'ativo', category: 'Ativo Total', val: 500000 },
      
      // Balanço Patrimonial de 2022 (Ano anterior)
      { year: 2022, docType: 'bp', type: 'ativo', category: 'Caixa e Equivalentes', val: 50000 },
      
      // DRE de 2023 (EBITDA saudável de 100000)
      { year: 2023, docType: 'dre', category: 'EBITDA', val: 100000 },
      { year: 2023, docType: 'dre', category: 'Lucro Líquido', val: 70000 }
    ];

    const context: InstitutionalContext = {
      input: {
        rawFinancialData: {
          filterYear: 2023,
          allHistoryData: mockHistory
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

    const result = await LegacyDFCAdapter.execute(context);
    assert.strictEqual(result.success, true);
    
    const cqs = result.inference?.metrics.fiduciary.cashQuality;
    assert.ok(cqs);
    
    // Deve pontuar alto
    assert.ok(cqs.score >= 85, `Score esperado >= 85, obtido: ${cqs.score}`);
    assert.strictEqual(cqs.level, 'Institutional Grade Cash');
    assert.strictEqual(cqs.alerts.length, 0);
  });

  it('2. Deve disparar todos os 4 alertas sob severa quebra de limites e degradar score', async () => {
    const mockHistory = [
      // DFC Oficial do Exercício 2023
      { year: 2023, docType: 'dfc', conta: 'Recebimento de Clientes', val: 20000 },
      { year: 2023, docType: 'dfc', conta: 'Pagamento a Fornecedores', val: -50000 },
      { year: 2023, docType: 'dfc', conta: 'Conta Corrente Sócios', val: -60000 }, // RP flow
      { year: 2023, docType: 'dfc', conta: 'Fluxo de Caixa das Atividades Operacionais (FCO)', val: -90000 }, // FCO Contábil
      
      // Balanço Patrimonial de 2023
      { year: 2023, docType: 'bp', type: 'ativo', category: 'Ativo Circulante', val: 200000 },
      { year: 2023, docType: 'bp', type: 'ativo', category: 'Caixa e Equivalentes', val: 5000 }, // Caixa baixo -> runway curta
      { year: 2023, docType: 'bp', type: 'ativo', category: 'Estoques', val: 140000 }, // estoques altos -> liquidez real baixa
      { year: 2023, docType: 'bp', type: 'ativo', category: 'Créditos com Sócios (Circulante)', val: 50000 }, // mútuos com socios -> liquidez real mais baixa ainda
      { year: 2023, docType: 'bp', type: 'passivo', category: 'Passivo Circulante', val: 100000 }, // CR = 2.0, Real Liq = (200k - 140k - 50k) / 100k = 0.1x
      { year: 2023, docType: 'bp', type: 'ativo', category: 'Ativo Total', val: 500000 },
      
      // Balanço Patrimonial de 2022
      { year: 2022, docType: 'bp', type: 'ativo', category: 'Caixa e Equivalentes', val: 4000 },
      
      // DRE de 2023 (EBITDA positivo de 50000 mas FCO real negativo de -30000)
      { year: 2023, docType: 'dre', category: 'EBITDA', val: 50000 },
      { year: 2023, docType: 'dre', category: 'Lucro Líquido', val: 20000 }
    ];

    const context: InstitutionalContext = {
      input: {
        rawFinancialData: {
          filterYear: 2023,
          allHistoryData: mockHistory
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

    const result = await LegacyDFCAdapter.execute(context);
    assert.strictEqual(result.success, true);
    
    const cqs = result.inference?.metrics.fiduciary.cashQuality;
    assert.ok(cqs);
    
    // Score deve estar na faixa crítica
    assert.ok(cqs.score < 30, `Score esperado < 30, obtido: ${cqs.score}`);
    assert.strictEqual(cqs.level, 'Critical Cash Integrity Risk');
    
    // Verifica os alertas disparados
    assert.ok(cqs.alerts.includes("A continuidade operacional demonstra dependência elevada de liquidez suportada pelos sócios."));
    assert.ok(cqs.alerts.includes("A estrutura de liquidez declarada depende materialmente de ativos de baixa conversão."));
    assert.ok(cqs.alerts.includes("A lucratividade contábil não está se convertendo em geração operacional de caixa."));
    assert.ok(cqs.alerts.includes("O horizonte de sobrevivência da tesouraria está criticamente comprimido."));
  });

  it('3. Deve atenuar penalidade de capitalização em empresas early-stage e sanitizar termos de colapso', async () => {
    const mockHistory = [
      // DFC Oficial do Exercício 2023
      { year: 2023, docType: 'dfc', conta: 'Recebimento de Clientes', val: 30000 },
      { year: 2023, docType: 'dfc', conta: 'Pagamento a Fornecedores', val: -40000 },
      { year: 2023, docType: 'dfc', conta: 'Integralização de Capital', val: 100000 }, // Capitalization injection
      { year: 2023, docType: 'dfc', conta: 'Fluxo de Caixa das Atividades Operacionais (FCO)', val: -10000 },
      
      // Balanço Patrimonial de 2023
      { year: 2023, docType: 'bp', type: 'ativo', category: 'Ativo Circulante', val: 150000 },
      { year: 2023, docType: 'bp', type: 'ativo', category: 'Caixa e Equivalentes', val: 90000 },
      { year: 2023, docType: 'bp', type: 'ativo', category: 'Estoques', val: 50000 },
      { year: 2023, docType: 'bp', type: 'passivo', category: 'Passivo Circulante', val: 60000 },
      { year: 2023, docType: 'bp', type: 'ativo', category: 'Ativo Total', val: 300000 },
      
      // DRE de 2023
      { year: 2023, docType: 'dre', category: 'EBITDA', val: -5000 },
      { year: 2023, docType: 'dre', category: 'Lucro Líquido', val: -8000 }
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
    
    const cqs = result.inference?.metrics.fiduciary.cashQuality;
    assert.ok(cqs);
    
    // A dedução por aporte de capitalização deve ser de apenas 1 ponto (sustainability = 9/10)
    assert.strictEqual(cqs.dimensions.sustainability.score, 9);
    
    // A narrativa gerada não pode conter termos como colapso irreversível ou insolvência definitiva
    const diag = result.inference?.narrative?.diagnostic || '';
    assert.ok(!diag.includes('colapso irreversível'));
    assert.ok(!diag.includes('insolvência definitiva'));
    assert.ok(!diag.includes('irreversible collapse'));
    assert.ok(!diag.includes('terminal insolvency'));
  });

});
