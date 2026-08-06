// src/core/runtime/advisory-narrative/TradeoffNarrativeEngine.ts
//
// Tradeoff Narrative Engine
// Explains the core strategic tension dyads using concrete quantitative simulation deltas.

export class TradeoffNarrativeEngine {
  /**
   * Explains tension dyads based on simulation parameters and tradeoffs.
   */
  public static generateTradeoffAnalysis(
    candidatePath: any,
    baselines: {
      conservativePreservation: any;
      controlledGrowth: any;
      survivalStabilization: any;
    }
  ): string {
    let explanation = `Análise de Tensão e Tradeoffs Corporativos:\n`;

    const cComposite = candidatePath.finalSurvivabilityScores?.composite ?? 70;
    const cRunway = candidatePath.liquidityRunwayCycles ?? 12;

    // Dyad 1: Preservation vs Growth
    const pComposite = baselines.conservativePreservation?.finalSurvivabilityScores?.composite ?? 80;
    const pRunway = baselines.conservativePreservation?.liquidityRunwayCycles ?? 24;

    explanation += `- Preservação vs Crescimento: O plano de Preservação Conservadora eleva o score de sobrevivência para ${pComposite}/100 e estende o runway para ${pRunway} meses, enquanto a rota candidata projeta um score composto de ${cComposite}/100 com runway de ${cRunway} meses.\n`;

    // Dyad 2: Liquidity vs Expansion
    const gComposite = baselines.controlledGrowth?.finalSurvivabilityScores?.composite ?? 75;
    const gRunway = baselines.controlledGrowth?.liquidityRunwayCycles ?? 18;
    explanation += `- Liquidez vs Expansão: O Crescimento Controlado retém uma margem de segurança fiduciária com runway de ${gRunway} meses contra a queima acelerada do contexto candidato.\n`;

    // Dyad 3: Stabilization vs Acceleration
    const sComposite = baselines.survivalStabilization?.finalSurvivabilityScores?.composite ?? 85;
    const sRunway = baselines.survivalStabilization?.liquidityRunwayCycles ?? 30;
    explanation += `- Estabilização vs Aceleração: Em condições de volatilidade operacional, a rota de Estabilização de Sobrevivência reduz a fadiga organizacional para ${baselines.survivalStabilization?.finalFatigue?.compositeFatigue ?? 20}/100, ao passo que a aceleração do plano original eleva a fadiga para ${candidatePath.finalFatigue?.compositeFatigue ?? 50}/100.`;

    return explanation;
  }
}
