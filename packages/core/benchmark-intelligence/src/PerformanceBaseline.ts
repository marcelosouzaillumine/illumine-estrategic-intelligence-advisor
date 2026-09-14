import { Identifier } from '@illumine/core-primitives';

export interface PerformanceBaseline {
  readonly baselineId: Identifier;
  readonly metricCode: string;
  readonly historicalAverage: number;
  readonly strategicTarget: number;
  readonly period: string;
}
