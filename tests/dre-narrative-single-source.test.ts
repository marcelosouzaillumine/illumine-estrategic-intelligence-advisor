/**
 * DRE Narrative Single Source Tests (ENGF v1.1)
 * Validates retirement of legacy narrative blocks and single-source compliance.
 */

import { describe, it } from 'node:test';
import assert from 'node:assert/strict';

import { ExecutiveNarrativeSingleSourceValidator } from '../src/core/runtime/presentation-governance/ExecutiveNarrativeSingleSourceValidator';
import { DREBoardAdvisoryEngine } from '../src/core/runtime/dre/DREBoardAdvisoryEngine';
import { DREBoardDecisionSupportEngine } from '../src/core/runtime/dre/DREBoardDecisionSupportEngine';

// Granatum 2022
const granatumDiagnosis = {
  valueCreationAssessment: 'Não',
  primaryConstraint: 'Escala insuficiente',
  recoverabilityAssessment: 'Moderada',
  strategicPriority: 'Crescimento da receita com preservação de margem',
  boardOutlook: 'Se nenhuma ação for tomada, a operação continuará consumindo patrimônio e dependerá de capital externo.'
};

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

// Simulated "correct" DRE executive page content (post-ENGF v1.0)
const compliantPageContent = `
  Executive Advisory
  Situação Atual
  A companhia encerrou o exercício com receita líquida de R$ 157,0 mil e resultado líquido negativo.
  Principal Restrição
  Escala insuficiente
  Principal Oportunidade
  Alavancagem de volume — a estrutura existente permite absorver mais receita.
  Prioridade Estratégica
  Crescimento da receita com preservação de margem
  Outlook
  A recuperabilidade é Moderada.
`;

// Simulated "non-compliant" page content (legacy block still present)
const nonCompliantPageContent = `
  Síntese Executiva para Tomada de Decisão
  Parecer analítico fiduciário para o Conselho
  Insira aqui as observações críticas, variações relevantes...
`;

describe('ENGF v1.1 — DRE Narrative Single Source Retirement', () => {

  it('Test 1: Verifica existência de apenas um bloco Executive Advisory', () => {
    const advisory = DREBoardAdvisoryEngine.generateExecutiveAdvisory(granatumNormalized as any, granatumDiagnosis);
    // The advisory produces a single unified block with 5 structured fields
    assert.ok(advisory.situacaoAtual, 'situacaoAtual must be present');
    assert.ok(advisory.restricaoPrincipal, 'restricaoPrincipal must be present');
    assert.ok(advisory.oportunidadePrincipal, 'oportunidadePrincipal must be present');
    assert.ok(advisory.prioridadeEstrategica, 'prioridadeEstrategica must be present');
    assert.ok(advisory.outlook, 'outlook must be present');
    // Single fullNarrative — not split into multiple separate blocks
    assert.ok(advisory.fullNarrative.length > 0, 'fullNarrative must be present');
    assert.ok(advisory.fullNarrative.length <= 800, 'fullNarrative must be compressed to ≤800 chars');
  });

  it('Test 2: Verifica inexistência de "Síntese Executiva para Tomada de Decisão"', () => {
    // In the compliant post-ENGF page, the legacy title must not appear
    const audit = ExecutiveNarrativeSingleSourceValidator.validate(compliantPageContent);
    assert.ok(
      !audit.legacyNarrativesDetected.includes('Síntese Executiva para Tomada de Decisão'),
      `Legacy narrative "Síntese Executiva" should not be in compliant content`
    );
    // Verify the validator catches it in non-compliant content
    const nonCompliantAudit = ExecutiveNarrativeSingleSourceValidator.validate(nonCompliantPageContent);
    assert.ok(
      nonCompliantAudit.legacyNarrativesDetected.includes('Síntese Executiva para Tomada de Decisão'),
      'Validator must detect legacy block in non-compliant content'
    );
  });

  it('Test 3: Verifica inexistência de "Insira aqui as observações críticas"', () => {
    // Compliant content must have no placeholder
    const audit = ExecutiveNarrativeSingleSourceValidator.validate(compliantPageContent);
    assert.ok(
      !audit.placeholdersDetected.includes('Insira aqui'),
      'Compliant content must not contain placeholder'
    );
    // Non-compliant content must be detected
    const nonCompliantAudit = ExecutiveNarrativeSingleSourceValidator.validate(nonCompliantPageContent);
    assert.ok(
      nonCompliantAudit.placeholdersDetected.includes('Insira aqui'),
      'Validator must detect placeholder in non-compliant content'
    );
    assert.ok(!nonCompliantAudit.isCompliant, 'Non-compliant content must fail validation');
  });

  it('Test 4: Verifica que Board Framework permanece funcional', () => {
    const framework = DREBoardDecisionSupportEngine.generateFramework(
      granatumDiagnosis,
      { breakEvenGap: 127178.58, netRevenue: 156969.54, breakEvenRevenue: 284148.12 }
    );
    // All 7 questions still answered
    assert.ok(framework.criacaoDeValor, 'P1 must still be present');
    assert.ok(framework.faturamentoSustaenta, 'P2 must still be present');
    assert.ok(framework.lacunaEquilibrio, 'P3 must still be present');
    assert.ok(framework.restricaoPrincipal, 'P4 must still be present');
    assert.ok(framework.oportunidadePrincipal, 'P5 must still be present');
    assert.ok(framework.consequenciaDaInacao, 'P6 must still be present');
    assert.ok(framework.prioridadeConselho, 'P7 must still be present');
    // Backward compat preserved
    assert.ok(framework.geraValor === 'Não');
    assert.ok(framework.prioridade === granatumDiagnosis.strategicPriority);
  });

  it('Test 5: Verifica compatibilidade com Granatum 2022 — single source produces real data', () => {
    const advisory = DREBoardAdvisoryEngine.generateExecutiveAdvisory(granatumNormalized as any, granatumDiagnosis);
    const audit = ExecutiveNarrativeSingleSourceValidator.validate(
      `Executive Advisory\nSituação Atual\n${advisory.situacaoAtual}\nPrincipal Restrição\n${advisory.restricaoPrincipal}`
    );

    // The ENGF advisory is the official narrative — it must pass single-source validation
    assert.ok(audit.officiaNarrativePresent, 'Official narrative must be detected');
    assert.ok(audit.legacyNarrativesDetected.length === 0, 'No legacy narratives in official content');
    assert.ok(audit.placeholdersDetected.length === 0, 'No placeholders in official content');
    assert.ok(audit.isCompliant, 'Granatum 2022 advisory must be fully compliant');

    // Data sanity: must reference real numbers, not placeholders
    assert.ok(advisory.situacaoAtual.includes('157'), `Expected R$ 157k in narrative, got: ${advisory.situacaoAtual}`);
    assert.ok(!advisory.fullNarrative.includes('Insira aqui'), 'No legacy placeholder in official narrative');
    assert.ok(!advisory.fullNarrative.includes('Síntese Executiva'), 'No legacy title in official narrative');
  });
});
