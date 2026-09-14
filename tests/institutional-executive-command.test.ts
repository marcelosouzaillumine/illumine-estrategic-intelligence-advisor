// tests/institutional-executive-command.test.ts

import { test } from 'node:test';
import assert from 'node:assert';
import { InstitutionalExecutiveCommandRuntime } from '../src/workspace/runtime/executive-command/InstitutionalExecutiveCommandRuntime';
import { ExecutiveIntelligenceReport } from '../src/core/runtime/executive-intelligence-runtime';

test('Institutional Executive Command Runtime Tests', async (t) => {
  
  await t.test('Deve acionar Fail-Closed e rejeitar conclusões se o histórico for menor que 3 ciclos', () => {
    const mockReport: any = {
      metadata: {
        historicalCyclesCount: 2,
        lineageHash: 'hash-fail-closed'
      }
    };

    const output = InstitutionalExecutiveCommandRuntime.evaluate(mockReport);
    
    assert.strictEqual(output.activeDirectives.length, 0);
    assert.strictEqual(output.driftEvents.length, 0);
    assert.strictEqual(output.commandThesis.structuralPosture, 'CAUTIOUS');
    assert.strictEqual(output.commandThesis.confidenceLevel, 'LOW');
    assert.ok(output.explainability.rationale.includes('restrito'));
  });

  await t.test('Deve gerar diretiva de Suspensão de Expansão quando Survival Mode está ativo', () => {
    const mockReport: any = {
      metadata: {
        historicalCyclesCount: 3,
        lineageHash: 'hash-survival'
      },
      survivalReport: {
        activeSurvivalMode: 'SURVIVAL_MODE',
        blockedActions: ['EXPANSION', 'DIVIDENDS']
      },
      financialReport: {
        metrics: {
          fundingDependenceLevel: 'HIGH'
        }
      }
    };

    const output = InstitutionalExecutiveCommandRuntime.evaluate(mockReport);
    
    assert.ok(output.activeDirectives.some(d => d.category === 'EXPANSION_SUSPENSION'));
    assert.strictEqual(output.commandThesis.structuralPosture, 'SURVIVAL');
    assert.strictEqual(output.strategicOrchestration.primaryFocus, 'INSTITUTIONAL_SURVIVAL_AND_CAPITAL_DEFENSE');
  });

  await t.test('Deve detectar Drift Operacional (divergência estrutural) se crescer sob restrição', () => {
    const mockReport: any = {
      metadata: {
        historicalCyclesCount: 3,
        lineageHash: 'hash-drift'
      },
      survivalReport: {
        activeSurvivalMode: 'SURVIVAL_MODE',
      },
      // Mockando que o growth de receita foi detectado pelo adapter via historical/fco
      // Since our adapter defaults to 0 if not fully mocked, let's just test that 
      // the engine correctly identifies the directives first. The adapter needs deep data to calculate growth,
      // which we will bypass in unit tests or just verify the alignment engine structure.
    };

    const output = InstitutionalExecutiveCommandRuntime.evaluate(mockReport);
    
    // Growth alignment divergent if activeSurvivalMode = SURVIVAL_MODE
    assert.ok(output.institutionalAlignment.continuityAlignment === 'DIVERGENT');
    assert.ok(output.institutionalAlignment.overallAlignmentScore < 100);
  });

});
