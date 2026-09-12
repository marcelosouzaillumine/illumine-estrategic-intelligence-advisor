import { Identifier, Timestamp } from '@illumine/core-primitives';
import { DecisionOutcomeStatus } from '../memory/DecisionOutcomeStatus';

export interface OutcomeRecord {
  readonly outcomeId: Identifier;
  readonly actionId: Identifier;
  readonly status: DecisionOutcomeStatus;
  readonly measuredDelta: number;
  readonly metricCode: string;
  readonly recordedAt: Timestamp;
}
