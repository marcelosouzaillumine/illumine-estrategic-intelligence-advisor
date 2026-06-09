export interface GovernanceJourneyContext {
  scenarioId: string;
  enterpriseValue: number;
  valueDelta: number;
  efosScore: number;
  ieiScore: number;
  executionRisk: string;
  governancePressureIndex: number;
}

export function buildGovernanceJourneyContext(
  scenarioId: string,
  enterpriseValue: number,
  valueDelta: number,
  efosScore: number,
  ieiScore: number,
  executionRisk: string,
  governancePressureIndex: number
): GovernanceJourneyContext {
  return {
    scenarioId,
    enterpriseValue,
    valueDelta,
    efosScore,
    ieiScore,
    executionRisk,
    governancePressureIndex
  };
}
