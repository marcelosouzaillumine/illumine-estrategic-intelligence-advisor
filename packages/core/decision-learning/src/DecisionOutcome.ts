import { OutcomeRecord } from '@illumine/organizational-memory';
import { ForecastModel } from '@illumine/predictive-engine';

export interface DecisionOutcomeComparison {
  readonly forecast: ForecastModel;
  readonly outcome: OutcomeRecord;
  readonly absoluteDeviation: number;
}
