import { Identifier } from '@illumine/core-primitives';

export interface SimulationScenario {
  readonly id: Identifier;
  readonly name: string;
  readonly businessContext: string;
  readonly initialState: Record<string, unknown>;
  readonly availableSignals: string[];
  readonly expectedOutcomes: string[];
  readonly evaluationCriteria: string[];
}
