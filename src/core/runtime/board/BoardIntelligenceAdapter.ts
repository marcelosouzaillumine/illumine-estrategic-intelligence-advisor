export interface BoardIntelligenceInput {
  scenarioId: string;
  scenarioName: string;
  isBaseline: boolean;
  enterpriseValue: number;
  valueDelta: number;
  efosScore: number;
  ieiScore: number;
  irgScore: number;
  gpiScore: number;
  executionRisk: string;
  executiveRecommendation: string; // '1º Recomendado', '2º Alternativo', 'Alto Risco'
  longTermRoadmapItemsCount: number;
}

export function buildBoardIntelligenceInput(
  scenarioId: string,
  scenarioName: string,
  isBaseline: boolean,
  enterpriseValue: number,
  valueDelta: number,
  efosScore: number,
  ieiScore: number,
  irgScore: number,
  gpiScore: number,
  executionRisk: string,
  executiveRecommendation: string,
  longTermRoadmapItemsCount: number
): BoardIntelligenceInput {
  return {
    scenarioId,
    scenarioName,
    isBaseline,
    enterpriseValue,
    valueDelta,
    efosScore,
    ieiScore,
    irgScore,
    gpiScore,
    executionRisk,
    executiveRecommendation,
    longTermRoadmapItemsCount
  };
}
