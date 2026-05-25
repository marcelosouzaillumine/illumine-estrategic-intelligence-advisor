import test from 'node:test';
import assert from 'node:assert';
import { analyzeOperationalIntelligence, OperationalInput } from '../src/lib/operational-intelligence-engine.js';

test('OPERATIONAL GOLDEN DATASETS', async (t) => {

  await t.test('[DATASET 01] Growth Destroying Cash', () => {
    const input: OperationalInput = {
      receitaLiquida: 1000,
      custosVariaveis: 400,
      custosFixos: 300,
      despesasOperacionais: 100,
      ebitda: 200, // EBITDA Positivo
      lucroLiquido: 100,
      saldoTesouraria: -50, // Caixa deteriorando
      necessidadeCapitalGiro: 300, // Necessidade crescente, > 20% da receita
      crescimentoReceita: 0.15, // Forte crescimento
      crescimentoDespesas: 0.10,
      segmentoEmpresarial: 'varejo',
      historicoSazonal: false,
      diasRecebimento: 30
    };

    const result = analyzeOperationalIntelligence(input);
    
    // Result expected:
    assert.ok(result.growthDestroyingCash, 'Deve detectar Growth Destroying Cash');
    assert.strictEqual(result.growthDestroyingCash?.classification, 'Crescimento Destrutivo');
    assert.strictEqual(result.ebitdaQuality.classification, 'EBITDA Destrutivo');
    
    // Proibição:
    assert.ok(result.growthDestroyingCash?.blockedFalsePositives.includes('Crescimento Saudável'), 'Deve bloquear falso positivo: Crescimento Saudável');
  });

  await t.test('[DATASET 02] Artificial EBITDA', () => {
    const input: OperationalInput = {
      receitaLiquida: 1000,
      custosVariaveis: 500,
      custosFixos: 200,
      despesasOperacionais: 50,
      ebitda: 250, // Positivo
      lucroLiquido: -300, // Prejuizo gigante (despesas n operacionais etc)
      saldoTesouraria: -100, // Baixa conversão
      necessidadeCapitalGiro: 100,
      crescimentoReceita: 0.05,
      crescimentoDespesas: -0.15, // Cortes temporários (artificial)
      segmentoEmpresarial: 'servicos',
      historicoSazonal: false,
      diasRecebimento: 30
    };

    const result = analyzeOperationalIntelligence(input);
    
    assert.ok(result.artificialEbitda, 'Deve detectar Artificial EBITDA');
    assert.strictEqual(result.ebitdaQuality.classification, 'EBITDA Artificial');
    assert.ok(result.artificialEbitda?.blockedFalsePositives.includes('EBITDA Isolado Positivo'), 'Deve bloquear "EBITDA Isolado Positivo"');
  });

  await t.test('[DATASET 03] Strong Operational Core', () => {
    const input: OperationalInput = {
      receitaLiquida: 1000,
      custosVariaveis: 400,
      custosFixos: 200, // Custos Fixos = 20% (< 35%), logo Operação Elástica
      despesasOperacionais: 100,
      ebitda: 300,
      lucroLiquido: 200,
      saldoTesouraria: 100, // Forte geração
      necessidadeCapitalGiro: 100,
      crescimentoReceita: 0.10,
      crescimentoDespesas: 0.05,
      segmentoEmpresarial: 'tech',
      historicoSazonal: false,
      diasRecebimento: 30
    };

    const result = analyzeOperationalIntelligence(input);
    
    assert.strictEqual(result.ebitdaQuality.classification, 'EBITDA Saudável');
    assert.strictEqual(result.elasticity.classification, 'Operação Elástica');
    assert.strictEqual(result.cashConversion.classification, 'Conversão Saudável');
    assert.strictEqual(result.growthDestroyingCash, null);
    assert.strictEqual(result.revenueWithoutMargin, null);
  });

  await t.test('[DATASET 04] Revenue Without Margin', () => {
    const input: OperationalInput = {
      receitaLiquida: 1500,
      custosVariaveis: 900,
      custosFixos: 400,
      despesasOperacionais: 150,
      ebitda: 50, // Margem comprimida
      lucroLiquido: 10,
      saldoTesouraria: 20,
      necessidadeCapitalGiro: 100,
      crescimentoReceita: 0.20, // Receita subindo 20%
      crescimentoDespesas: 0.35, // Despesas subindo 35% -> Perdendo margem!
      segmentoEmpresarial: 'logistica',
      historicoSazonal: false,
      diasRecebimento: 30
    };

    const result = analyzeOperationalIntelligence(input);
    
    assert.ok(result.revenueWithoutMargin, 'Deve detectar Revenue Without Margin');
    assert.strictEqual(result.revenueWithoutMargin?.classification, 'Crescimento Improdutivo');
    assert.ok(result.revenueWithoutMargin?.blockedFalsePositives.includes('Crescimento de Receita como Sucesso Automático'));
  });

  await t.test('[DATASET 05] Hospital Operational Pressure', () => {
    const input: OperationalInput = {
      receitaLiquida: 2000,
      custosVariaveis: 600,
      custosFixos: 900, // Alto custo fixo (> 40%)
      despesasOperacionais: 300,
      ebitda: 200,
      lucroLiquido: 50,
      saldoTesouraria: -150, // Pressão de caixa
      necessidadeCapitalGiro: 500,
      crescimentoReceita: 0.05,
      crescimentoDespesas: 0.05,
      segmentoEmpresarial: 'hospitalar',
      historicoSazonal: false,
      diasRecebimento: 120 // Longo prazo
    };

    const result = analyzeOperationalIntelligence(input);
    
    assert.ok(result.hospitalPressure, 'Deve detectar Hospital Pressure');
    assert.strictEqual(result.hospitalPressure?.classification, 'Dependência Operacional Hospitalar');
    assert.strictEqual(result.ebitdaQuality.classification, 'EBITDA Frágil', 'Ebitda tem que ser fragil devido a pressão do hospital');
    assert.ok(result.hospitalPressure?.blockedFalsePositives.includes('Faturamento = Caixa'));
  });

  await t.test('[DATASET 06] Seasonal Operational Business', () => {
    const input: OperationalInput = {
      receitaLiquida: 500,
      custosVariaveis: 200,
      custosFixos: 300,
      despesasOperacionais: 50,
      ebitda: -50,
      lucroLiquido: -100,
      saldoTesouraria: -50,
      necessidadeCapitalGiro: 50,
      crescimentoReceita: -0.20,
      crescimentoDespesas: 0.00,
      segmentoEmpresarial: 'agronegocio',
      historicoSazonal: true, // SAZONAL
      diasRecebimento: 30
    };

    const result = analyzeOperationalIntelligence(input);
    
    assert.ok(result.seasonality, 'Deve detectar Sazonalidade');
    assert.strictEqual(result.seasonality?.classification, 'Sazonalidade Operacional');
    assert.ok(result.seasonality?.blockedFalsePositives.includes('Colapso Prematuro'));
  });
});
