import { StrategicSimulationResult } from './StrategicSimulationTypes';

export class DecisionRiskBalancer {
  static analyzeBalance(simResult: StrategicSimulationResult): { isSustainable: boolean; fragilityScore: number } {
    // Analisa as projeções de risco vs trade-offs
    const fragilityScore = simResult.risks.reduce((acc, curr) => acc + (curr.probability * curr.impact), 0);
    return {
      isSustainable: fragilityScore < 0.6,
      fragilityScore
    };
  }
}
