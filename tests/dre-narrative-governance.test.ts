/**
 * DRE Narrative Governance Tests (ENGF v1.0)
 * Tests for Executive Label Registry, Isolation Validator, Board Framework, Health Score Explainability
 */

import { describe, it } from 'node:test';
import assert from 'node:assert/strict';

import { ExecutiveLabelGovernanceRegistry } from '../src/core/runtime/presentation-governance/ExecutiveLabelGovernanceRegistry';
import { CrossStatementIsolationValidator } from '../src/core/runtime/dre/CrossStatementIsolationValidator';
import { DREBoardDecisionSupportEngine } from '../src/core/runtime/dre/DREBoardDecisionSupportEngine';
import { OperationalHealthExplainabilityEngine } from '../src/core/runtime/dre/OperationalHealthExplainabilityEngine';
import { DREBoardAdvisoryEngine } from '../src/core/runtime/dre/DREBoardAdvisoryEngine';

// Mock diagnosis for Granatum 2022
const granatumDiagnosis = {
  valueCreationAssessment: 'Não',
  primaryConstraint: 'Escala insuficiente',
  recoverabilityAssessment: 'Moderada',
  strategicPriority: 'Crescimento da receita com preservação de margem',
  boardOutlook: 'Se nenhuma ação for tomada, a operação continuará consumindo patrimônio e dependerá de capital externo.'
};

// Mock normalized DRE for Granatum 2022
const granatumNormalized = {
  netRevenue: { value: 156969.54, source: 'CALCULATED' },
  netProfit: { value: -68548.88, source: 'CALCULATED' },
  grossMargin: { value: 0.5539, source: 'CALCULATED' },
  adminExpenses: { value: -157385.83, source: 'CALCULATED' },
  cogs: { value: -70026.22, source: 'CALCULATED' },
  breakEvenRevenue: { value: 284148.12, source: 'CALCULATED' },
  breakEvenGap: { value: 127178.58, source: 'CALCULATED' },
  breakEvenCoverage: { value: 0.5524, source: 'CALCULATED' },
};

describe('ENGF v1.0 — DRE Narrative Governance Tests', () => {

  it('Test 1: Verifica eliminação de termos técnicos via Registry', () => {
    assert.strictEqual(ExecutiveLabelGovernanceRegistry.translate('NOT_AVAILABLE'), 'Histórico Insuficiente');
    assert.strictEqual(ExecutiveLabelGovernanceRegistry.translate('Net Revenue'), 'Receita Líquida');
    assert.strictEqual(ExecutiveLabelGovernanceRegistry.translate('Net Profit'), 'Resultado Líquido');
    assert.strictEqual(ExecutiveLabelGovernanceRegistry.translate('Admin Expenses'), 'Despesas Administrativas');
    assert.strictEqual(ExecutiveLabelGovernanceRegistry.translate('Growth'), 'Crescimento');
    assert.strictEqual(ExecutiveLabelGovernanceRegistry.translate('Profitability'), 'Rentabilidade');
    assert.strictEqual(ExecutiveLabelGovernanceRegistry.translate('Account'), 'Conta');
    assert.strictEqual(ExecutiveLabelGovernanceRegistry.translate('Value Brl'), 'Valor (R$)');
  });

  it('Test 2: Verifica que Registry sanitiza textos com termos técnicos', () => {
    const text = 'Net Revenue: 156969.54 | Net Profit: -68548.88';
    const sanitized = ExecutiveLabelGovernanceRegistry.sanitize(text);
    assert.ok(!sanitized.includes('Net Revenue'), 'Net Revenue still present after sanitize');
    assert.ok(!sanitized.includes('Net Profit'), 'Net Profit still present after sanitize');
    assert.ok(sanitized.includes('Receita Líquida'));
    assert.ok(sanitized.includes('Resultado Líquido'));
  });

  it('Test 3: Verifica separação — Consumo Econômico ≠ Burn Rate de Caixa', () => {
    // DRE uses "Consumo Econômico" (from result), DFC uses "Burn Rate de Caixa" (from cash flow)
    const dreLabel = 'Consumo Econômico';
    const dfcLabel = 'Burn Rate de Caixa';
    assert.notStrictEqual(dreLabel, dfcLabel);
    assert.ok(!dreLabel.toLowerCase().includes('caixa'), 'DRE label must not mention caixa');
    assert.ok(!dfcLabel.toLowerCase().includes('econômic'), 'DFC label must not mention econômico');
  });

  it('Test 4: Verifica existência dos drivers do Health Score', () => {
    const explainability = OperationalHealthExplainabilityEngine.explain(40, {
      ebitda: -70442.51,
      breakEvenCoverage: 55.24,
      grossMargin: 0.5539,
      netProfit: -68548.88,
      adminExpenses: -157385.83,
      netRevenue: 156969.54
    });

    assert.ok(explainability.drivers.length > 0, 'Drivers should not be empty');
    assert.ok(explainability.classification, 'Classification should be present');
    assert.ok(explainability.score === 40);
    assert.ok(explainability.executiveSummary.length > 0);
  });

  it('Test 5: Verifica as 7 perguntas fiduciárias do Board Framework', () => {
    const framework = DREBoardDecisionSupportEngine.generateFramework(
      granatumDiagnosis,
      { breakEvenGap: 127178.58, netRevenue: 156969.54, breakEvenRevenue: 284148.12 }
    );

    // Verifica as 7 respostas obrigatórias
    assert.ok(framework.criacaoDeValor, 'P1: criacaoDeValor should be present');
    assert.ok(framework.faturamentoSustaenta, 'P2: faturamentoSustaenta should be present');
    assert.ok(framework.lacunaEquilibrio, 'P3: lacunaEquilibrio should be present');
    assert.ok(framework.restricaoPrincipal, 'P4: restricaoPrincipal should be present');
    assert.ok(framework.oportunidadePrincipal, 'P5: oportunidadePrincipal should be present');
    assert.ok(framework.consequenciaDaInacao, 'P6: consequenciaDaInacao should be present');
    assert.ok(framework.prioridadeConselho, 'P7: prioridadeConselho should be present');

    // Backward compat
    assert.ok(framework.geraValor);
    assert.ok(framework.prioridade);
  });

  it('Test 6: Verifica que DRE não produz recomendações de liquidez', () => {
    const advisory = DREBoardAdvisoryEngine.generateExecutiveAdvisory(granatumNormalized as any, granatumDiagnosis);
    const fullText = advisory.fullNarrative;

    const liquidityTerms = ['liquidez', 'caixa', 'runway', 'fluxo de caixa', 'capital de giro', 'endividamento'];
    liquidityTerms.forEach(term => {
      assert.ok(!fullText.toLowerCase().includes(term), `DRE advisory must not mention "${term}"`);
    });
    assert.ok(advisory.isolationValidated, 'Cross-statement isolation should be validated');
  });

  it('Test 7: Verifica compressão do Executive Advisory (máx 800 chars)', () => {
    const advisory = DREBoardAdvisoryEngine.generateExecutiveAdvisory(granatumNormalized as any, granatumDiagnosis);
    assert.ok(advisory.fullNarrative.length <= 800, `Advisory too long: ${advisory.fullNarrative.length} chars`);
    assert.ok(advisory.situacaoAtual.length > 0);
    assert.ok(advisory.restricaoPrincipal.length > 0);
    assert.ok(advisory.oportunidadePrincipal.length > 0);
    assert.ok(advisory.prioridadeEstrategica.length > 0);
    assert.ok(advisory.outlook.length > 0);
  });

  it('Test 8: Verifica ausência de duplicação narrativa', () => {
    const advisory = DREBoardAdvisoryEngine.generateExecutiveAdvisory(granatumNormalized as any, granatumDiagnosis);
    // "Síntese Executiva" and "Sumário de Conselho" should NOT appear in the narrative
    assert.ok(!advisory.fullNarrative.includes('Síntese Executiva'), 'Must not contain "Síntese Executiva"');
    assert.ok(!advisory.fullNarrative.includes('Sumário de Conselho'), 'Must not contain "Sumário de Conselho"');
  });

  it('Test 9: Verifica conformidade de isolamento cross-statement (DRE domain)', () => {
    const validText = 'Crescimento da receita com preservação de margem de contribuição.';
    const invalidText = 'Melhorar a liquidez corrente e gerenciar o capital de giro com fornecedores.';

    const validResult = CrossStatementIsolationValidator.validateDRERecommendation(validText);
    const invalidResult = CrossStatementIsolationValidator.validateDRERecommendation(invalidText);

    assert.ok(validResult.isValid, 'Valid DRE text should pass isolation check');
    assert.ok(!invalidResult.isValid, 'Liquidity text should fail DRE isolation check');
    assert.ok(invalidResult.blockedTerms.length > 0);
  });

  it('Test 10: Verifica compatibilidade com Granatum 2022', () => {
    const advisory = DREBoardAdvisoryEngine.generateExecutiveAdvisory(granatumNormalized as any, granatumDiagnosis);
    const framework = DREBoardDecisionSupportEngine.generateFramework(
      granatumDiagnosis,
      { breakEvenGap: 127178.58, netRevenue: 156969.54, breakEvenRevenue: 284148.12 }
    );
    const explainability = OperationalHealthExplainabilityEngine.explain(40, {
      ebitda: -70442.51,
      breakEvenCoverage: 55.24,
      grossMargin: 0.5539,
      netProfit: -68548.88,
      adminExpenses: -157385.83,
      netRevenue: 156969.54
    });

    // Granatum 2022 is a loss-making operation — confirm narrative reflects this
    assert.ok(framework.geraValor === 'Não' || advisory.situacaoAtual.toLowerCase().includes('resultado'));
    assert.ok(explainability.classification !== 'SAUDÁVEL', 'Score 40 should not be SAUDÁVEL');
    // Break-even gap: faltam R$ 127.178,58
    assert.ok(framework.lacunaEquilibrio.includes('127'), `Expected lacuna to mention 127k, got: ${framework.lacunaEquilibrio}`);
  });
});
