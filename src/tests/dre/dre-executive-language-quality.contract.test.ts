import test from 'node:test';
import assert from 'node:assert';
import { DreDecisionPolicyLayer, BoardQuestion } from '../../core/runtime/dre/DreDecisionPolicyLayer';
import { DreExecutiveFacts } from '../../core/runtime/dre/DreExecutiveFactsBuilder';
import { DreEconomicScenario } from '../../core/runtime/dre/DreScenarioClassifier';
import { DreExecutiveLanguageCompiler } from '../../core/runtime/dre/DreExecutiveLanguageCompiler';

const createBaseFacts = (): DreExecutiveFacts => ({
  grossRevenue: 1000, deductions: 0, netRevenue: 1000, cogs: 400,
  contributionMarginValue: 600, contributionMarginRate: 0.6,
  fixedExpenses: 300, ebitda: 300, grossProfit: 0, grossMargin: 0, ebit: 0, ebitMargin: 0, ebitdaMargin: 0.3,
  netIncome: 200, netMargin: 0.2, breakEvenRevenue: 500,
  breakEvenCoverage: 2.0, breakEvenDistance: 500, safetyMargin: 0.5,
  revenueGrowth: 0, ebitdaGrowth: 0, netIncomeGrowth: 0,
  operatingResultQuality: 0.66, extraordinaryResultShare: 0,
  fixedCostAbsorption: 3.33, operatingLeverageRisk: 0.3,
  hasMeaningfulHistory: true, historyMessage: 'Mock History'
});

test('DRE Executive Language Quality Contract', async (t) => {
  await t.test('Nenhum painel pode usar linguagem robótica ou de debug', () => {
    const facts = createBaseFacts();
    const policy = DreDecisionPolicyLayer.generatePolicy(facts, DreEconomicScenario.PROFITABLE_SCALE);

    const questions = Object.values(policy.boardQuestions) as BoardQuestion[];
    const allText = JSON.stringify(questions) + JSON.stringify(policy.executiveDiagnosis) + JSON.stringify(policy.executivePlan);
    
    assert.ok(!allText.includes('Análise fundamentada pela métrica'), `Vazamento de debug (Análise fundamentada): ${allText}`);
    assert.ok(!allText.includes('dados não atingem limiares'), `Linguagem robótica detectada (dados não atingem): ${allText}`);
    assert.ok(!allText.includes('O indicador') || !allText.includes('demonstra que'), `Template legado detectado (O indicador X demonstra que): ${allText}`);
    assert.ok(!allText.includes('Sem histórico conclusivo'), `Texto legado detectado (Sem histórico conclusivo): ${allText}`);
    assert.ok(!allText.includes('Driver dominante'), `Template legado detectado (Driver dominante): ${allText}`);
    assert.ok(!allText.includes('Break-even constraint'), `Template legado detectado (Break-even constraint): ${allText}`);
    assert.ok(!allText.includes('Principal Driver'), `Template legado detectado (Principal Driver genérico): ${allText}`);
  });

  await t.test('Nenhuma recomendação pode aparecer repetida', () => {
    const facts = createBaseFacts();
    const policy = DreDecisionPolicyLayer.generatePolicy(facts, DreEconomicScenario.PROFITABLE_SCALE);

    const recommendations = (Object.values(policy.boardQuestions) as BoardQuestion[]).map(q => q.recommendation);
    const unique = new Set(recommendations);
    
    assert.strictEqual(unique.size, recommendations.length, 'Recomendações duplicadas encontradas.');
  });

  await t.test('Inteligência longitudinal - 2022 não usa linguagem de pânico', () => {
    const facts = createBaseFacts();
    facts.netMargin = -0.15;
    facts.breakEvenCoverage = 0.8;
    
    const compiler = new DreExecutiveLanguageCompiler();
    const diag = compiler.compileLongitudinalIntelligence(facts, 2022);
    
    assert.ok(!diag.includes('insolvência'), 'Termo alarmista "insolvência" encontrado');
    assert.ok(!diag.includes('crise'), 'Termo alarmista "crise" encontrado');
    assert.ok(diag.includes('necessidade aguda de turnaround'), 'Faltou contexto executivo de estresse');
  });

  await t.test('Inteligência longitudinal - 2023 viável mas no limite, nunca robusto', () => {
    const facts = createBaseFacts();
    facts.netMargin = 0.02;
    facts.breakEvenCoverage = 1.1;
    
    const compiler = new DreExecutiveLanguageCompiler();
    const diag = compiler.compileLongitudinalIntelligence(facts, 2023);
    
    assert.ok(!diag.toLowerCase().includes('robusta'), '2023 classificado indevidamente como robusto');
    assert.ok(diag.includes('viabilidade em patamar crítico'), 'Faltou contexto de viável no limite');
  });

  await t.test('Inteligência longitudinal - 2024 e 2025 não podem ter o mesmo diagnóstico', () => {
    // 2024
    const facts24 = createBaseFacts();
    facts24.netMargin = 0.08;
    facts24.revenueGrowth = 0.15;
    facts24.breakEvenCoverage = 1.6;
    
    // 2025
    const facts25 = createBaseFacts();
    facts25.netMargin = 0.04; 
    facts25.revenueGrowth = 0.05;
    facts25.breakEvenCoverage = 1.3; 

    const compiler = new DreExecutiveLanguageCompiler();
    const diag24 = compiler.compileLongitudinalIntelligence(facts24, 2024);
    const diag25 = compiler.compileLongitudinalIntelligence(facts25, 2025);

    assert.notStrictEqual(diag24, diag25, 'Diagnósticos de 2024 e 2025 estão idênticos');
    assert.ok(diag24.includes('salto consistente'), '2024 sem contexto de salto');
    assert.ok(diag25.includes('manutenção'), '2025 sem contexto de manutenção');
  });
  
  await t.test('Compiler garante as 3 camadas: quantitativo, executivo, implicação', () => {
    const compiler = new DreExecutiveLanguageCompiler();
    const facts = createBaseFacts();
    facts.netMargin = 0.15;

    const fragment = {
      intent: 'VALUE_CREATION' as any,
      severity: 'STRONG' as any,
      causalCore: 'capacidade de retenção econômica confirmada',
      executiveImplication: 'teste implicacao',
      boardMandate: 'teste mandato',
      recommendedAction: 'Acelerar expansão'
    };

    const compiled = compiler.compilePanelResponse('VALUE_CREATION', fragment, 'STRONG');

    assert.ok(compiled.response === 'teste implicacao', 'Falta de fato e interpretação na resposta');
    assert.ok(compiled.recommendation === 'Acelerar expansão', 'Falta de implicação decisória clara');
  });
});
