import { ExecutiveDecisionPackage } from '../contracts/ExecutiveDecisionPackage';

export interface ExecutiveScenario {
  id: string;
  description: string;
  probability: number;
  assumptions: string[];
  expectedImpact: string[];
  risks: string[];
  opportunities: string[];
  earlySignals: string[];
  reversalConditions: string[];
}

export class ExecutiveScenarioService {
  generateScenarios(pkg: ExecutiveDecisionPackage): ExecutiveDecisionPackage {
    const scenarios: ExecutiveScenario[] = [
      {
        id: 'A',
        description: 'Investimento agressivo',
        probability: 35,
        assumptions: [],
        expectedImpact: ['Alta expansão'],
        risks: ['Capital pressure'],
        opportunities: [],
        earlySignals: [],
        reversalConditions: []
      },
      {
        id: 'B',
        description: 'Crescimento orgânico',
        probability: 55,
        assumptions: [],
        expectedImpact: ['Menor risco'],
        risks: [],
        opportunities: [],
        earlySignals: [],
        reversalConditions: []
      }
    ];
    return { ...pkg, state: 'SCENARIO_ANALYZED', scenarios };
  }
}

