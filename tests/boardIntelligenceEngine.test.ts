import { describe, it } from 'node:test';
import assert from 'node:assert';
import { buildBoardIntelligenceInput } from '../src/core/runtime/board/BoardIntelligenceAdapter';
import { assessFiduciaryRisks } from '../src/core/runtime/board/FiduciaryRiskEngine';
import { generateAttentionItems } from '../src/core/runtime/board/BoardAttentionEngine';
import { generateBoardResolutions } from '../src/core/runtime/board/BoardResolutionLayer';
import { generateBoardAgenda } from '../src/core/runtime/board/BoardAgendaGenerator';

describe('Board Governance Layer (BIL)', () => {
  it('should identify high risk when IRG is > 60 and escalate', () => {
    const input = buildBoardIntelligenceInput(
      's1', 'Draft Agressivo', false, 50000000, 10000000, 40, 30, 80, 50, 'Crítico', 'Alto Risco', 5
    );

    const risks = assessFiduciaryRisks(input);
    assert.strictEqual(risks.governanceRisk.level, 'Crítico');
    assert.strictEqual(risks.overallRisk, 'Crítico');

    const attentionItems = generateAttentionItems(input);
    const escalarItems = attentionItems.filter(i => i.category === 'Escalar');
    assert.ok(escalarItems.length >= 1);
    assert.ok(escalarItems.find(i => i.id === 'escalar-irg'));

    const resolutions = generateBoardResolutions(input, attentionItems);
    assert.ok(resolutions.some(r => r.action === 'Aprovação Emergencial'));
  });

  it('should recommend deliberation for a 1º Recomendado scenario', () => {
    const input = buildBoardIntelligenceInput(
      's2', 'Draft Equilibrado', false, 30000000, 5000000, 70, 75, 20, 20, 'Baixo', '1º Recomendado', 1
    );

    const attentionItems = generateAttentionItems(input);
    assert.ok(attentionItems.find(i => i.id === 'deliberar-scenario'));

    const resolutions = generateBoardResolutions(input, attentionItems);
    assert.ok(resolutions.some(r => r.action === 'Deliberar' && r.topic.includes('Draft Equilibrado')));
  });

  it('should generate a structured agenda based on insights', () => {
    const input = buildBoardIntelligenceInput(
      's3', 'Baseline Oficial', true, 20000000, 0, 80, 85, 10, 10, 'Baixo', '1º Recomendado', 2
    );

    const risks = assessFiduciaryRisks(input);
    const attentionItems = generateAttentionItems(input);
    const resolutions = generateBoardResolutions(input, attentionItems);
    const agenda = generateBoardAgenda(input, attentionItems, risks, resolutions);

    // Should include strategy follow-up
    assert.ok(agenda.estrategia.items.some(i => i.includes('Baseline')));
    
    // Should include long term roadmap tracking in governance
    assert.ok(agenda.governanca.items.some(i => i.includes('Longo Prazo')));
    
    // Risks should be standard tracking
    assert.ok(agenda.riscos.items.some(i => i.includes('padrão')));
  });
});
