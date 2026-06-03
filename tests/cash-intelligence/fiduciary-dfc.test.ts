import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { LegacyDFCAdapter } from '../../src/runtime/adapters/LegacyDFCAdapter';
import { InstitutionalContext } from '../../src/runtime/types';

describe('DFC Fiduciária Ajustada - Engine & Reclassification Tests', () => {

  it('1. Deve calcular FCO Operacional Real de forma sign-safe (Exemplo Granatum)', async () => {
    // FCO Contábil = -113736.44
    // Conta Corrente Sócios = -38203.28 (dentro do FCO)
    // FCO Real = FCO Contábil - RP_effects = -113736.44 - (-38203.28) = -75533.16
    const mockHistory = [
      // DFC Oficial do Exercício 2023
      { year: 2023, docType: 'dfc', conta: 'Recebimento de Clientes', val: 200000 },
      { year: 2023, docType: 'dfc', conta: 'Pagamento a Fornecedores', val: -275533.16 },
      { year: 2023, docType: 'dfc', conta: 'Conta Corrente Sócios', val: -38203.28 }, // RP inside FCO
      { year: 2023, docType: 'dfc', conta: 'Fluxo de Caixa das Atividades Operacionais (FCO)', val: -113736.44 },
      
      // Balanço Patrimonial de 2023
      { year: 2023, docType: 'bp', type: 'ativo', category: 'Ativo Circulante', val: 200000 },
      { year: 2023, docType: 'bp', type: 'ativo', category: 'Caixa e Equivalentes', val: 50000 },
      { year: 2023, docType: 'bp', type: 'ativo', category: 'Estoques', val: 70000 },
      { year: 2023, docType: 'bp', type: 'passivo', category: 'Passivo Circulante', val: 80000 },
      { year: 2023, docType: 'bp', type: 'ativo', category: 'Ativo Total', val: 500000 },
      { year: 2023, docType: 'bp', type: 'ativo', category: 'Mútuos com Sócios (Não Circulante)', val: 20000 },
      
      // DRE de 2023
      { year: 2023, docType: 'dre', category: 'Receita Líquida', val: 300000 },
      { year: 2023, docType: 'dre', category: 'Lucro Líquido', val: -50000 }
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
    if (!result.success) {
      console.log('TEST 1 FAILED. RESULT:', JSON.stringify(result, null, 2));
    }
    assert.strictEqual(result.success, true);
    
    const fid = result.inference?.metrics.fiduciary;
    assert.ok(fid);
    
    // Verificações Matemáticas
    assert.ok(Math.abs(fid.fcoOperacionalReal - (-75533.16)) < 0.01, `FCO Real esperado -75533.16, obtido: ${fid.fcoOperacionalReal}`);
    assert.strictEqual(fid.fluxoPartesRelacionadas, -38203.28);
    assert.strictEqual(fid.saidasParaPartesRelacionadas, -38203.28);
  });

  it('2. Deve disparar alertas de governança sob limites violados', async () => {
    // Alerta 1: Créditos com Sócios > 20% do Ativo
    // Alerta 2: Fluxo Societário > EBITDA Absoluto
    // Alerta 3: FCO Real < 0 e dependência de capitalização
    const mockHistory = [
      { year: 2023, docType: 'dfc', conta: 'Pagamento Operacional', val: -150000 },
      { year: 2023, docType: 'dfc', conta: 'Conta Corrente Sócios', val: -60000 }, // RP inside FCO
      { year: 2023, docType: 'dfc', conta: 'Aumento de Capital', val: 200000 }, // Capitalization
      
      { year: 2023, docType: 'bp', type: 'ativo', category: 'Ativo Circulante', val: 200000 },
      { year: 2023, docType: 'bp', type: 'ativo', category: 'Caixa e Equivalentes', val: 50000 },
      { year: 2023, docType: 'bp', type: 'ativo', category: 'Estoques', val: 30000 },
      { year: 2023, docType: 'bp', type: 'passivo', category: 'Passivo Circulante', val: 80000 },
      { year: 2023, docType: 'bp', type: 'ativo', category: 'Ativo Total', val: 250000 },
      { year: 2023, docType: 'bp', type: 'ativo', category: 'Mútuos com Sócios (Não Circulante)', val: 55000 }, // 55k / 250k = 22% (> 20%)
      
      { year: 2023, docType: 'dre', category: 'Lucro Líquido', val: -40000 } // EBITDA será baixo ou negativo
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
    
    const warnings = result.inference?.metrics.fiduciary.governanceWarnings;
    assert.ok(warnings);
    assert.ok(warnings.includes("Relevant shareholder dependency identified."));
    assert.ok(warnings.includes("Related-party flows exceed operational cash generation capacity."));
    assert.ok(warnings.includes("The financial continuity of the exercise depended predominantly on external or shareholder support."));
  });

  it('3. Deve sanitizar termos proibidos na narrativa e proteger early-stage', async () => {
    // Simula uma empresa early-stage (historicalCyclesCount = 2)
    // O diagnóstico gerado conteria "colapso" e "insolvência estrutural", mas devem ser atenuados.
    const mockHistory = [
      { year: 2023, docType: 'dfc', conta: 'Pagamento Operacional', val: -150000 },
      { year: 2023, docType: 'dfc', conta: 'Conta Corrente Sócios', val: 50000 }, // socio
      
      { year: 2023, docType: 'bp', type: 'ativo', category: 'Ativo Circulante', val: 100000 },
      { year: 2023, docType: 'bp', type: 'ativo', category: 'Caixa e Equivalentes', val: 10000 },
      { year: 2023, docType: 'bp', type: 'ativo', category: 'Estoques', val: 40000 }, // estoque / ac = 40% (> 30%)
      { year: 2023, docType: 'bp', type: 'passivo', category: 'Passivo Circulante', val: 80000 },
      { year: 2023, docType: 'bp', type: 'ativo', category: 'Ativo Total', val: 200000 },
      { year: 2023, docType: 'bp', type: 'ativo', category: 'Mútuos Sócios', val: 10000 },
      
      { year: 2023, docType: 'dre', category: 'Lucro Líquido', val: -50000 }
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
    if (!result.success) {
      console.log('TEST 3 FAILED. RESULT:', JSON.stringify(result, null, 2));
    } else {
      console.log('TEST 3 DIAGNOSTIC:', result.inference?.narrative?.diagnostic);
    }
    assert.strictEqual(result.success, true);
    
    const diag = result.inference?.narrative?.diagnostic || '';
    assert.ok(diag.includes('A estrutura de liquidez corrente apresenta dependência relevante da conversão de estoques.'));
    assert.ok(diag.includes('A operação demonstrou dependência parcial de suporte societário para sustentabilidade de caixa.'));
    
    // Testa sanitizações
    const strToTest = "Houve colapso irreversível e insolvência definitiva.";
    // O adapter possui o helper cleanNarrativeText exposto na narrativa
    const rawDiag = result.inference?.narrative?.diagnostic || '';
    assert.ok(!rawDiag.includes('colapso irreversível'));
    assert.ok(!rawDiag.includes('insolvência definitiva'));
  });

  it('4. Deve calcular Liquidez Operacional Real corretamente', async () => {
    // Liquidez Operacional Real = (Ativo Circulante - Estoques - Créditos com Sócios Circulantes) / Passivo Circulante
    // Exemplo do prompt/sugestão do usuário:
    // AC = 102421.97, Estoques = 71549.05, Creditos Socios Circulantes = 0, PC = 81399.99
    // Liquidez Real = (102421.97 - 71549.05 - 0) / 81399.99 = 0.38x
    const mockHistory = [
      { year: 2023, docType: 'dfc', conta: 'Dummy Official Flow', val: 0 },
      { year: 2023, docType: 'bp', type: 'ativo', category: 'Ativo Circulante', val: 102421.97 },
      { year: 2023, docType: 'bp', type: 'ativo', category: 'Caixa e Equivalentes', val: 30872.92 },
      { year: 2023, docType: 'bp', type: 'ativo', category: 'Estoques', val: 71549.05 },
      { year: 2023, docType: 'bp', type: 'passivo', category: 'Passivo Circulante', val: 81399.99 },
      { year: 2023, docType: 'bp', type: 'ativo', category: 'Ativo Total', val: 141020.25 },
      { year: 2023, docType: 'bp', type: 'ativo', category: 'Mútuos Sócios (Não Circulante)', val: 20000 } // Não circulante!
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
    if (!result.success) {
      console.log('TEST 4 FAILED. RESULT:', JSON.stringify(result, null, 2));
    } else {
      console.log('TEST 4 FIDUCIARY METRICS:', JSON.stringify(result.inference?.metrics.fiduciary, null, 2));
    }
    assert.strictEqual(result.success, true);
    
    const fid = result.inference?.metrics.fiduciary;
    assert.ok(fid);
    
    // Liquidez Operacional Real calculada
    const expectedLiq = (102421.97 - 71549.05 - 0) / 81399.99;
    assert.ok(Math.abs(fid.liquidezOperacionalReal - expectedLiq) < 0.01, `Liquidez esperada: ${expectedLiq}, obtida: ${fid.liquidezOperacionalReal}`);
  });

  it('5. Deve validar hierarquia de classificação econômica, capitalização e variação de caixa', async () => {
    const mockHistory = [
      { year: 2023, docType: 'dfc', conta: 'Aporte de Sócios', val: 100000 },
      { year: 2023, docType: 'dfc', conta: 'Empréstimo Sócios', val: -20000 },
      { year: 2023, docType: 'dfc', conta: 'Integralização de Capital Social', val: 50000 },
      { year: 2023, docType: 'dfc', conta: 'Fluxo de Caixa das Atividades Operacionais (FCO)', val: -20000 },
      
      // Balanço 2023
      { year: 2023, docType: 'bp', type: 'ativo', category: 'Ativo Circulante', val: 100000 },
      { year: 2023, docType: 'bp', type: 'ativo', category: 'Caixa e Equivalentes', val: 14037.70 },
      { year: 2023, docType: 'bp', type: 'ativo', category: 'Estoques', val: 20000 },
      { year: 2023, docType: 'bp', type: 'passivo', category: 'Passivo Circulante', val: 50000 },
      { year: 2023, docType: 'bp', type: 'ativo', category: 'Ativo Total', val: 200000 },
      
      // Balanço 2022 (Ano anterior)
      { year: 2022, docType: 'bp', type: 'ativo', category: 'Ativo Circulante', val: 80000 },
      { year: 2022, docType: 'bp', type: 'ativo', category: 'Caixa e Equivalentes', val: 6935.93 },
      { year: 2022, docType: 'bp', type: 'ativo', category: 'Estoques', val: 15000 },
      { year: 2022, docType: 'bp', type: 'passivo', category: 'Passivo Circulante', val: 40000 },
      { year: 2022, docType: 'bp', type: 'ativo', category: 'Ativo Total', val: 180000 }
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
    
    const fid = result.inference?.metrics.fiduciary;
    assert.ok(fid);
    
    // Variação Conciliada deve ser Caixa Final - Caixa Inicial
    // 14037.70 - 6935.93 = 7101.77
    assert.ok(Math.abs(fid.variacaoLiquidaConciliada - 7101.77) < 0.01, `Variação esperada 7101.77, obtida: ${fid.variacaoLiquidaConciliada}`);
    
    // Fluxo de Capitalização deve somar os aportes/integralizações (150000)
    assert.strictEqual(fid.fluxoCapitalizacao, 150000);
    
    // Fluxo com Partes Relacionadas deve somar apenas empréstimo de sócios (-20000)
    assert.strictEqual(fid.fluxoPartesRelacionadas, -20000);
    assert.strictEqual(fid.saidasParaPartesRelacionadas, -20000);
    
    // Drenagem Societária deve ser abs(saídas) / Ativo Total
    // 20000 / 200000 = 0.1 (10%)
    assert.ok(Math.abs(fid.drenagemSocietaria - 0.1) < 0.01, `Drenagem societária esperada 0.1, obtida: ${fid.drenagemSocietaria}`);

    // Verifica presença das novas seções de Investimento e Financiamento Fiduciário
    const itemNames = fid.tableRows.map((r: any) => r.item);
    assert.ok(itemNames.includes('Fluxo de Investimento Fiduciário'), "Deve conter a seção de Investimento Fiduciário");
    assert.ok(itemNames.includes('Fluxo de Financiamento Fiduciário (Outros)'), "Deve conter a seção de Financiamento Fiduciário (Outros)");
  });

});
