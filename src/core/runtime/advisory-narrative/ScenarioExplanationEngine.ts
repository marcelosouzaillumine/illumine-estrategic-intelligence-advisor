// src/core/runtime/advisory-narrative/ScenarioExplanationEngine.ts
//
// Scenario Explanation Engine
// Explains simulations as bounded scenario projections, avoiding guarantees or probabilistic assumptions.

export class ScenarioExplanationEngine {
  /**
   * Explains scenario outcomes and clarifies that simulations are deterministic projections, not future guarantees.
   */
  public static generateScenarioExplanation(
    candidatePath: any,
    baselines: {
      conservativePreservation: any;
      controlledGrowth: any;
      survivalStabilization: any;
    }
  ): string {
    let explanation = `Comparação Preditiva de Rotas:\n`;

    explanation += `- Cenário Candidato (${candidatePath.category}): Classificação de risco ${candidatePath.classification}. Score final composto de ${candidatePath.finalSurvivabilityScores?.composite}/100.\n`;
    explanation += `- Preservação Conservadora: Classificação de risco ${baselines.conservativePreservation?.classification}. Score composto de ${baselines.conservativePreservation?.finalSurvivabilityScores?.composite}/100.\n`;
    explanation += `- Crescimento Controlado: Classificação de risco ${baselines.controlledGrowth?.classification}. Score composto de ${baselines.controlledGrowth?.finalSurvivabilityScores?.composite}/100.\n`;
    explanation += `- Estabilização de Sobrevivência: Classificação de risco ${baselines.survivalStabilization?.classification}. Score composto de ${baselines.survivalStabilization?.finalSurvivabilityScores?.composite}/100.\n\n`;

    explanation += `AVISO DE PROJEÇÃO: As trajetórias simuladas acima representam projeções de cenários limitadas (bounded scenario projections) com base em regras determinísticas e parâmetros históricos calibrados. `;
    explanation += `Tais resultados descrevem desfechos condicionados a premissas específicas e limites sistêmicos, não constituindo de forma alguma garantias de performance futura ou previsões estatísticas incondicionais.`;

    return explanation;
  }
}
