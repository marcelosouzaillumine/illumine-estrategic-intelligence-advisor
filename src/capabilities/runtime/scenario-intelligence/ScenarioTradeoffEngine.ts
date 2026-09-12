// src/core/runtime/scenario-intelligence/ScenarioTradeoffEngine.ts
import { InstitutionalScenarioResult } from './scenario-types';
import { ScenarioTradeoffProfile, ScenarioTradeoffEdge } from '../../capabilities/financial/runtime/board-decision/board-decision-types';

export class ScenarioTradeoffEngine {
  /**
   * Compares an array of valid Institutional Scenarios and computes structural tradeoffs.
   * Does not generate AI opinions. Only uses mathematical/structural edges.
   */
  public static compare(scenarios: InstitutionalScenarioResult[]): ScenarioTradeoffProfile {
    if (!scenarios || scenarios.length < 2) {
      throw new Error('TRADE_OFF_ERROR: Comparison requires at least two scenarios.');
    }

    const validScenarios = scenarios.filter(s => s.validation.status === 'VALID' && s.propagationProfile);
    if (validScenarios.length < 2) {
      throw new Error('TRADE_OFF_ERROR: Insufficient valid scenarios for tradeoff comparison.');
    }

    const edges: ScenarioTradeoffEdge[] = [];
    const criticalTensions: string[] = [];

    // Compare A vs B (pairwise for the first two for simplicity in this implementation)
    const sA = validScenarios[0];
    const sB = validScenarios[1];

    const pA = sA.propagationProfile!;
    const pB = sB.propagationProfile!;

    // 1. DFC Comparison (Caixa Operacional)
    const dfcNodeA = pA.nodes.find(n => n.dimension === 'DFC' && n.metric === 'Caixa Operacional');
    const dfcNodeB = pB.nodes.find(n => n.dimension === 'DFC' && n.metric === 'Caixa Operacional');

    if (dfcNodeA && dfcNodeB) {
      if (dfcNodeA.impactDirection === 'NEGATIVE' && dfcNodeB.impactDirection !== 'NEGATIVE') {
        edges.push({
          scenarioAId: sA.id,
          scenarioBId: sB.id,
          dimension: 'DFC (Caixa Operacional)',
          winnerId: sB.id,
          tradeoffRationale: 'contexto B protege o fluxo de caixa operacional, enquanto o contexto A induz deterioração direta.'
        });
      } else if (dfcNodeB.impactDirection === 'NEGATIVE' && dfcNodeA.impactDirection !== 'NEGATIVE') {
        edges.push({
          scenarioAId: sA.id,
          scenarioBId: sB.id,
          dimension: 'DFC (Caixa Operacional)',
          winnerId: sA.id,
          tradeoffRationale: 'contexto A protege o fluxo de caixa operacional, enquanto o contexto B induz deterioração direta.'
        });
      }
    }

    // 2. Systemic Severity
    const severityLevels = { 'BAIXA': 1, 'MODERADA': 2, 'ALTA': 3, 'CRÍTICA': 4 };
    const sevA = severityLevels[pA.systemicSeverity] || 0;
    const sevB = severityLevels[pB.systemicSeverity] || 0;

    if (sevA > sevB) {
      edges.push({
        scenarioAId: sA.id,
        scenarioBId: sB.id,
        dimension: 'Risco Sistêmico',
        winnerId: sB.id,
        tradeoffRationale: `contexto B apresenta menor risco sistêmico (${pB.systemicSeverity}) comparado ao contexto A (${pA.systemicSeverity}).`
      });
      criticalTensions.push(`contexto A submete a arquitetura de capital a um estresse sistêmico de nível ${pA.systemicSeverity}.`);
    } else if (sevB > sevA) {
      edges.push({
        scenarioAId: sA.id,
        scenarioBId: sB.id,
        dimension: 'Risco Sistêmico',
        winnerId: sA.id,
        tradeoffRationale: `contexto A apresenta menor risco sistêmico (${pA.systemicSeverity}) comparado ao contexto B (${pB.systemicSeverity}).`
      });
      criticalTensions.push(`contexto B submete a arquitetura de capital a um estresse sistêmico de nível ${pB.systemicSeverity}.`);
    }

    // 3. Structural Integrity Score
    if (Math.abs(pA.structuralIntegrityScore - pB.structuralIntegrityScore) > 10) {
      const winner = pA.structuralIntegrityScore > pB.structuralIntegrityScore ? sA : sB;
      const loser = pA.structuralIntegrityScore > pB.structuralIntegrityScore ? sB : sA;
      edges.push({
        scenarioAId: sA.id,
        scenarioBId: sB.id,
        dimension: 'Integridade Estrutural',
        winnerId: winner.id,
        tradeoffRationale: `contexto ${winner.id} retém margem de segurança estrutural superior (${winner.propagationProfile!.structuralIntegrityScore} vs ${loser.propagationProfile!.structuralIntegrityScore}).`
      });
    }

    // If edges are completely empty, they are structurally equivalent
    if (edges.length === 0) {
      edges.push({
        scenarioAId: sA.id,
        scenarioBId: sB.id,
        dimension: 'Geral',
        winnerId: null,
        tradeoffRationale: 'contextos apresentam impactos estruturais equivalentes, sem divergência material na arquitetura de capital.'
      });
    }

    return {
      id: `TRADEOFF_${Date.now()}`,
      comparisonTimestamp: new Date().toISOString(),
      scenarios: validScenarios,
      edges,
      criticalTensions
    };
  }
}
