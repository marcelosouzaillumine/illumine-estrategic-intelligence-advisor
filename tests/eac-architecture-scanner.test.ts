import test from 'node:test';
import assert from 'node:assert';
import path from 'path';
import { fileURLToPath } from 'url';
import { Project } from 'ts-morph';
import { analyzePage } from '../src/scripts/executiveArchitectureScannerV2.cjs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const FIXTURES_DIR = path.resolve(__dirname, '../src/components/pages/__tests__/eac-scanner-fixtures');

test('EAC Scanner V2 Acceptance Tests', async (t) => {
  const project = new Project({ skipAddingFilesFromTsConfig: true });

  const fixtures = [
    'analytical-perfect.tsx',
    'analytical-technical-before-summary.tsx',
    'board-incomplete.tsx',
    'admin-without-actions.tsx',
    'operational-without-working-area.tsx',
    'page-with-modal.tsx',
    'page-with-loading-state.tsx',
    'page-with-imported-section.tsx',
    'page-with-alias.tsx',
    'page-with-repeated-blocks.tsx',
    'governance-with-decision-summary.tsx'
  ];

  for (const f of fixtures) {
    project.addSourceFileAtPath(path.join(FIXTURES_DIR, f));
  }

  await t.test('analytical-perfect', () => {
    const res = analyzePage(project, path.join(FIXTURES_DIR, 'analytical-perfect.tsx'), 'Executive Analytical Page');
    assert.ok(res.score >= 90, `Score deve ser >= 90 (foi ${res.score})`);
    assert.strictEqual(res.penalties.length, 0, `Não deve ter penalidades (teve ${res.penalties.join(', ')})`);
    assert.ok(res.structuralFlow.indexOf('Page Identity') < res.structuralFlow.indexOf('Executive Summary'));
  });

  await t.test('analytical-technical-before-summary', () => {
    const res = analyzePage(project, path.join(FIXTURES_DIR, 'analytical-technical-before-summary.tsx'), 'Executive Analytical Page');
    const hasOrderPenalty = res.penalties.some((p: string) => p.includes('Ordem Incorreta'));
    const techBeforeSummary = res.structuralFlow.indexOf('Technical Layer') < res.structuralFlow.indexOf('Executive Summary');
    assert.ok(hasOrderPenalty, 'Deve ter penalidade de ordem');
    assert.ok(techBeforeSummary, 'Technical Layer identificada antes da Summary');
  });

  await t.test('board-incomplete', () => {
    const res = analyzePage(project, path.join(FIXTURES_DIR, 'board-incomplete.tsx'), 'Board Mode');
    assert.ok(res.score < 60, `Score deve ser inferior a 60 (foi ${res.score})`);
    const missingFiduciary = res.penalties.some((p: string) => p.includes('Fiduciary Context'));
    assert.ok(missingFiduciary, 'Blocos fiduciários ausentes devem ser registrados');
  });

  await t.test('admin-without-actions', () => {
    const res = analyzePage(project, path.join(FIXTURES_DIR, 'admin-without-actions.tsx'), 'Administrative/Form Page');
    const missingActions = res.penalties.some((p: string) => p.includes('Actions'));
    assert.ok(missingActions, 'Actions ausentes devem ser registradas');
    assert.ok(res.score < 100, `Score não pode ser 100 (foi ${res.score})`);
  });

  await t.test('operational-without-working-area', () => {
    const res = analyzePage(project, path.join(FIXTURES_DIR, 'operational-without-working-area.tsx'), 'Operational Management Page');
    const missingWorkingArea = res.penalties.some((p: string) => p.includes('Working Area'));
    assert.ok(missingWorkingArea, 'Working Area ausente deve gerar penalidade específica');
  });

  await t.test('page-with-modal', () => {
    const res = analyzePage(project, path.join(FIXTURES_DIR, 'page-with-modal.tsx'), 'Executive Analytical Page');
    // Em v2 atual, não processamos o fluxo avançado real por AST control flow sem execução de funções locais,
    // mas a lógica ignora coisas que não estão no main flow (verificado pelo parser do V2 na main Function)
    // Se Technical Layer estava só no modal, e não no mainFlow, ela não aparece.
    assert.ok(!res.structuralFlow.includes('Technical Layer'), 'Modal não deve integrar o mainFlow');
  });

  await t.test('page-with-loading-state', () => {
    const res = analyzePage(project, path.join(FIXTURES_DIR, 'page-with-loading-state.tsx'), 'Executive Analytical Page');
    // Technical Layer tá no loading
    // Em V2 (TS-Morph), nós apenas escaneamos a árvore de JSX recursivamente.
    // O scanner ainda não resolve fluxo de controle, logo o block será detectado.
    assert.ok(res.structuralFlow.includes('Technical Layer'), 'Scanner sem CFG encontra tudo no AST');
  });

  await t.test('page-with-imported-section', () => {
    const res = analyzePage(project, path.join(FIXTURES_DIR, 'page-with-imported-section.tsx'), 'Executive Analytical Page');
    assert.ok(res.blocksFound.some((b: any) => b.component === 'MyCustomSection' || b.block === 'Executive Summary'));
  });

  await t.test('page-with-alias', () => {
    const res = analyzePage(project, path.join(FIXTURES_DIR, 'page-with-alias.tsx'), 'Executive Analytical Page');
    assert.ok(res.structuralFlow.includes('Page Identity'), 'Alias resolvido e classificado');
  });

  await t.test('page-with-repeated-blocks', () => {
    const res = analyzePage(project, path.join(FIXTURES_DIR, 'page-with-repeated-blocks.tsx'), 'Executive Analytical Page');
    assert.ok(res.score >= 80, `Score deve ser >= 80 (foi ${res.score})`);
    assert.ok(!res.penalties.some((p: string) => p.includes('Ordem Incorreta')), 'KPIs/Analytics repetidos não geram inversão automática falsa');
  });

  await t.test('governance-with-decision-summary', () => {
    const res = analyzePage(project, path.join(FIXTURES_DIR, 'governance-with-decision-summary.tsx'), 'Executive Governance Page');
    assert.ok(res.blocksFound.some(b => b.block === 'Decision Summary'));
    assert.ok(!res.blocksFound.some(b => b.block === 'Executive Summary'));
    assert.strictEqual(res.penalties.filter(p => p.includes('Missing Required Group')).length, 0);
  });
});
