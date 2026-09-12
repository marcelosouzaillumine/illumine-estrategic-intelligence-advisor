import { describe, it } from 'node:test';
import assert from 'node:assert';
import { ExecutiveSignalPriorityEngine } from '../src/workspace/runtime/executive-orchestration/cognitive/ExecutiveSignalPriorityEngine';
import { NarrativeCompressionEngine } from '../src/workspace/runtime/executive-orchestration/cognitive/NarrativeCompressionEngine';
import { DecisionFatigueProtectionEngine } from '../src/workspace/runtime/executive-orchestration/cognitive/DecisionFatigueProtectionEngine';
import { ExecutiveNarrativeHierarchyEngine } from '../src/workspace/runtime/executive-orchestration/cognitive/ExecutiveNarrativeHierarchyEngine';
import { CognitiveSignal, PrioritizedAttentionItem } from '../src/workspace/runtime/executive-orchestration/cognitive/types';
import { ExecutiveIntelligenceReport } from '../src/core/runtime/executive-intelligence-runtime';

describe('Executive Cognitive Orchestration Module Tests', () => {

  it('1. ExecutiveSignalPriorityEngine prioritiza e ordena sinais por peso fiduciário', () => {
    const signals: CognitiveSignal[] = [
      {
        id: 'sig-low',
        sourceModule: 'Test',
        title: 'Sinal Baixo',
        description: 'Descrição de sinalização menor',
        timestamp: new Date().toISOString(),
        rawSeverity: 'INFO'
      },
      {
        id: 'sig-fid',
        sourceModule: 'Fiduciary',
        title: 'Bloqueio de Partes Relacionadas',
        description: 'Impedimento societário na transação',
        timestamp: new Date().toISOString(),
        rawSeverity: 'CRITICAL',
        fiduciaryEscalation: true
      },
      {
        id: 'sig-warn',
        sourceModule: 'Operations',
        title: 'Alerta Operacional',
        description: 'Aviso de performance',
        timestamp: new Date().toISOString(),
        rawSeverity: 'WARNING'
      }
    ];

    const result = ExecutiveSignalPriorityEngine.prioritize(signals);
    assert.strictEqual(result.length, 3);
    // João Silva (CFO) is immediate focus (sig-fid)
    assert.strictEqual(result[0].signal.id, 'sig-fid');
    assert.strictEqual(result[0].priority, 'IMMEDIATE');
    assert.strictEqual(result[0].urgency, 'BOARD_INTERVENTION');

    // Warning is critical priority
    assert.strictEqual(result[1].signal.id, 'sig-warn');
    assert.strictEqual(result[1].priority, 'CRITICAL');
  });

  it('2. NarrativeCompressionEngine comprime insumos preservando significados críticos', () => {
    const input = {
      summary: 'Resumo Geral',
      insights: ['Insight 1', 'Insight 2', 'Insight 3', 'Insight 4'],
      violations: ['Restrição de governança A'],
      missingDependencies: ['Fiduciary Rules Matrix'],
      fiduciaryBlockers: ['Impedimento sociométrico'],
      confidenceLabel: 'HIGH_CONFIDENCE'
    };

    // Board mode: máximo 2 insights
    const outputBoard = NarrativeCompressionEngine.compress(input, 'board');
    assert.strictEqual(outputBoard.compressionMode, 'CRITICAL_ONLY');
    assert.ok(outputBoard.narratives.length <= 4); // Summary + 2 insights + 1 violation
    assert.ok(outputBoard.preservedFiduciaryBlockers.includes('Impedimento sociométrico'));
    assert.ok(outputBoard.preservedDependencies.includes('Fiduciary Rules Matrix'));

    // Operational mode: sem limite
    const outputOp = NarrativeCompressionEngine.compress(input, 'operational');
    assert.strictEqual(outputOp.compressionMode, 'FULL');
    assert.ok(outputOp.narratives.includes('Insight 4'));
  });

  it('3. DecisionFatigueProtectionEngine mitiga alertas concorrentes sem ocultar intervenções', () => {
    // Generate 20 low/moderate alerts and 1 critical fiduciary intervention
    const items: PrioritizedAttentionItem[] = Array.from({ length: 20 }, (_, i) => ({
      signal: {
        id: `sig-${i}`,
        sourceModule: 'Performance',
        title: `Alerta secundário ${i}`,
        description: 'Descrição simples',
        timestamp: new Date().toISOString(),
        rawSeverity: 'INFO'
      },
      priority: 'LOW',
      urgency: 'MONITOR',
      focusWeight: 0.15,
      deferred: false
    }));

    // Insert fiduciary blocker
    items.unshift({
      signal: {
        id: 'fiduciary-block',
        sourceModule: 'Compliance',
        title: 'Bloqueio de Conformidade',
        description: 'Impedimento crítico',
        timestamp: new Date().toISOString(),
        rawSeverity: 'CRITICAL',
        fiduciaryEscalation: true
      },
      priority: 'IMMEDIATE',
      urgency: 'BOARD_INTERVENTION',
      focusWeight: 1.0,
      deferred: false
    });

    const { items: protectedItems, loadLevel, signalDensity } = DecisionFatigueProtectionEngine.protect(items);
    assert.strictEqual(loadLevel, 'SATURATED');
    assert.strictEqual(signalDensity, 'OVERLOADED');

    // Fiduciary blocker must NEVER be deferred
    const blockItem = protectedItems.find(item => item.signal.id === 'fiduciary-block');
    assert.ok(blockItem);
    assert.strictEqual(blockItem.deferred, false);

    // Low alerts should be deferred
    const deferredCount = protectedItems.filter(item => item.deferred).length;
    assert.ok(deferredCount > 0);
  });

  it('4. ExecutiveNarrativeHierarchyEngine cria fluxo de storytelling de 5 níveis', () => {
    const mockReport = {
      severity: { level: 'ESTRESSADO', justification: 'Fator de liquidez sob stresse' },
      causality: {
        rootCause: 'Causa A',
        financialPropagation: 'Propagação B',
        strategicImpact: 'Impacto C',
        insights: []
      },
      advisory: {
        executiveSummary: 'Resumo executivo',
        actionMatrix: ['Ação 1', 'Ação 2'],
        priorityFocus: 'Foco prioritário'
      },
      compliance: {
        confidenceLevel: 'HIGH_CONFIDENCE'
      }
    } as any as ExecutiveIntelligenceReport;

    const block = ExecutiveNarrativeHierarchyEngine.buildBlock(mockReport);
    assert.strictEqual(block.level1, 'ESTRESSADO: Foco prioritário');
    assert.strictEqual(block.level2, 'Causa A');
    assert.strictEqual(block.level3, 'Propagação B');
    assert.strictEqual(block.level4, 'Impacto C');
    assert.strictEqual(block.level5, 'Ação 1 | Ação 2');
  });

});
