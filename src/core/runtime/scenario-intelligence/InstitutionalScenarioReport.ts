import { ScenarioComparison } from './ScenarioComparisonEngine';

export interface InstitutionalScenarioReport {
  scenarioId: string;
  scenarioName: string;
  constitutionalStatus: string;
  survivabilityStatus: string;
  overallImpact: string;
  baselineHash: string;
  scenarioHash: string;
  impactMatrix: ScenarioComparison[];
  lineageHash: string;
}
