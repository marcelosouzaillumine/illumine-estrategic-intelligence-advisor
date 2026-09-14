import { ScenarioMutation } from './ScenarioMutation';

export interface InstitutionalScenario {
  scenarioId: string;
  scenarioName: string;
  scenarioType: string;
  baselineHash: string;
  mutations: ScenarioMutation[];
  constitutionalStatus: string;
}
