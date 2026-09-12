export interface ExecutiveDecisionInput {
  scenarioId: string;
  scenarioName: string;
  enterpriseValue: number;
  valueDelta: number;
  efosScore: number;
  ieiScore: number;
  irgScore: number;
  gpiScore: number;
  executionRisk: string;
}

export function buildExecutiveDecisionInput(
  scenarioId: string,
  scenarioName: string,
  enterpriseValue: number,
  valueDelta: number,
  efosScore: number,
  ieiScore: number,
  irgScore: number,
  gpiScore: number,
  executionRisk: string
): ExecutiveDecisionInput {
  return {
    scenarioId,
    scenarioName,
    enterpriseValue,
    valueDelta,
    efosScore,
    ieiScore,
    irgScore,
    gpiScore,
    executionRisk
  };
}
