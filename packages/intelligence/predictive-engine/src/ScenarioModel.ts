import { Identifier } from '@illumine/core-primitives';
import { ForecastModel } from './ForecastModel';

export interface ScenarioModel {
  readonly scenarioId: Identifier;
  readonly name: string;
  readonly type: 'BASE_CASE' | 'PESSIMISTIC' | 'OPTIMISTIC' | 'STRESS_TEST';
  readonly forecasts: ForecastModel[];
}
