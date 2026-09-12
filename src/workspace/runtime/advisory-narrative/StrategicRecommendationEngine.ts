// src/core/runtime/advisory-narrative/StrategicRecommendationEngine.ts
//
// Strategic Recommendation Engine
// Ranks strategic alternatives and explains survivability, prioritizing preservation.

import { ScenarioCategory } from '../../core/runtime/strategic-simulation/simulation-types';

export class StrategicRecommendationEngine {
  /**
   * Formulates fiduciarily aligned recommendations and justifies the safest strategic path.
   */
  public static generateRecommendationNarrative(
    recommendedPath: ScenarioCategory,
    eligiblePaths: ScenarioCategory[],
    ineligiblePaths: ScenarioCategory[],
    candidateCategory: ScenarioCategory
  ): { narrative: string; recommendedPath: ScenarioCategory; alternatives: ScenarioCategory[] } {
    let narrative = '';
    
    // Sort alternatives to suggest preservation-first paths
    const alternatives = [...eligiblePaths].filter(p => p !== recommendedPath);

    narrative += `Diretriz Recomendada: A análise de otimização fiduciária indica que o caminho de "${recommendedPath}" é o ideal para a manutenção das salvaguardas de sobrevivência corporativa. `;

    if (recommendedPath === 'Survival Stabilization' || recommendedPath === 'Conservative Preservation') {
      narrative += `Esta rota prioriza a recomposição imediata dos saldos de caixa de livre movimentação e mitiga os riscos de ruptura estrutural. `;
    } else {
      narrative += `Este contexto concilia o crescimento disciplinado com a manutenção dos limites regulamentares e preservação do patrimônio. `;
    }

    if (ineligiblePaths.includes(candidateCategory)) {
      narrative += `AVISO DE RECOMENDAÇÃO: O plano original proposto de "${candidateCategory}" foi classificado como inelegível por reduzir métricas de sobrevivência abaixo do limite crítico constitucional de 40/100. `;
    }

    if (alternatives.length > 0) {
      narrative += `Como rotas alternativas de menor risco, apontam-se: ${alternatives.join(', ')}.`;
    }

    return {
      narrative,
      recommendedPath,
      alternatives
    };
  }
}
