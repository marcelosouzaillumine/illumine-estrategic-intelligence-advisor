import { describe, it } from 'node:test';
import assert from 'node:assert';
import { evaluateExecutiveDecision } from '../src/core/runtime/executive/ExecutiveDecisionEngine';
import { buildExecutiveDecisionInput } from '../src/core/runtime/executive/ExecutiveDecisionTypes';

describe('Executive Decision Engine', () => {
  it('should recommend the base scenario over an aggressive one with poor execution metrics', () => {
    const base = buildExecutiveDecisionInput(
      's1', 'Cenário Base', 10000000, 0, 70, 75, 20, 30, 'Moderado'
    );
    const agressive = buildExecutiveDecisionInput(
      's2', 'Cenário Agressivo', 15000000, 5000000, 70, 30, 80, 85, 'Elevado'
    );

    const result = evaluateExecutiveDecision([base, agressive], 's1');

    assert.strictEqual(result.recommendedScenario, 'Cenário Base');
    assert.strictEqual(result.recommendationLevel, '1º Recomendado');
    assert.strictEqual(result.confidenceLevel, 'Alta'); // IEI 75 (>=70) and IRG 20 (<=30)

    const baseRank = result.rankedScenarios.find(s => s.scenarioId === 's1');
    const aggRank = result.rankedScenarios.find(s => s.scenarioId === 's2');
    
    assert.ok(baseRank && aggRank);
    assert.strictEqual(baseRank.rankCategory, '1º Recomendado');
    assert.strictEqual(aggRank.rankCategory, 'Alto Risco');

    // Trade-offs should not show losses for baseline itself if recommended, but let's check it doesn't crash
    assert.strictEqual(result.tradeOffs.losses[0], 'Nenhum trade-off negativo severo identificado contra o Baseline.');
  });

  it('should recommend a conservative scenario as a safe alternative if the aggressive one is too risky', () => {
    // Both are not baseline.
    const conservative = buildExecutiveDecisionInput(
      's3', 'Conservador', 8000000, -2000000, 80, 85, 10, 10, 'Baixo'
    );
    const agressive = buildExecutiveDecisionInput(
      's4', 'Agressivo', 15000000, 5000000, 80, 40, 80, 85, 'Crítico'
    );

    const result = evaluateExecutiveDecision([conservative, agressive]);

    assert.strictEqual(result.recommendedScenario, 'Conservador');
    assert.strictEqual(result.confidenceLevel, 'Alta');
    
    const consRank = result.rankedScenarios.find(s => s.scenarioId === 's3');
    const aggRank = result.rankedScenarios.find(s => s.scenarioId === 's4');
    
    assert.ok(consRank && aggRank);
    assert.strictEqual(consRank.rankCategory, '1º Recomendado');
    assert.strictEqual(aggRank.rankCategory, 'Alto Risco');

    assert.ok(result.tradeOffs.gains.includes('Estabelece o novo patamar base de valor econômico.'));
  });

  it('should rank scenarios correctly when multiple options are valid', () => {
    const base = buildExecutiveDecisionInput(
      's1', 'Base', 10000000, 0, 70, 70, 20, 20, 'Moderado'
    );
    const moderateGrowth = buildExecutiveDecisionInput(
      's2', 'Crescimento Moderado', 12000000, 2000000, 70, 65, 30, 40, 'Moderado'
    );
    const crazyGrowth = buildExecutiveDecisionInput(
      's3', 'Agressivo Irracional', 50000000, 40000000, 70, 10, 95, 95, 'Crítico'
    );

    const result = evaluateExecutiveDecision([base, moderateGrowth, crazyGrowth], 's1');

    // Base wins because its risk is lower (IEI 70, IRG 20, GPI 20) vs Moderate (IEI 65, IRG 30, GPI 40)
    assert.strictEqual(result.recommendedScenario, 'Base');
    assert.strictEqual(result.confidenceLevel, 'Alta'); // IEI 70 (>= 70)
    
    // Tradeoffs comparing recommended (base) vs baseline (base)
    // When target === baseline, tradeOffs are neutral
    assert.ok(result.tradeOffs.losses.includes('Nenhum trade-off negativo severo identificado contra o Baseline.'));
    assert.ok(result.tradeOffs.gains.includes('Manutenção da estabilidade operacional vigente.'));
  });

  it('should throw an error if no scenarios provided', () => {
    assert.throws(() => evaluateExecutiveDecision([]), /Não há cenários disponíveis/);
  });
});
