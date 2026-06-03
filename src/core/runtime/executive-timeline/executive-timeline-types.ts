// src/core/runtime/executive-timeline/executive-timeline-types.ts

export type TrajectoryClassification =
  | 'IMPROVING'
  | 'RECOVERING'
  | 'STABLE'
  | 'PLATEAUED'
  | 'DETERIORATING'
  | 'STRUCTURALLY_DETERIORATING'
  | 'CONSTITUTIONALLY_RESTRICTED'
  | 'INSUFFICIENT_EVIDENCE';

export type AccelerationState =
  | 'POSITIVE_ACCELERATION'
  | 'NEGATIVE_ACCELERATION'
  | 'NEUTRAL_ACCELERATION';

export type TimelineConfidence =
  | 'HIGH_CONFIDENCE'
  | 'MEDIUM_CONFIDENCE'
  | 'LOW_CONFIDENCE'
  | 'FAIL_CLOSED';

export interface TimelineInflectionPoint {
  cycleReference: string;
  metricName: string;
  previousValue: number | string;
  newValue: number | string;
  direction: 'UP' | 'DOWN';
  fiduciaryImpact: 'POSITIVE' | 'NEGATIVE' | 'NEUTRAL';
}

export interface TimelineEvent {
  cycleReference: string;
  eventType:
    | 'TREASURY_RUPTURE'
    | 'LIQUIDITY_RECOVERY'
    | 'CAPITAL_EROSION'
    | 'EBITDA_INFLECTION'
    | 'DEBT_ACCELERATION'
    | 'WORKING_CAPITAL_INVERSION'
    | 'CONSTITUTIONAL_RESTRICTION';
  description: string;
  severity: 'INFO' | 'WARNING' | 'CRITICAL' | 'RESTRICTIVE';
  lineageHash: string;
}

export interface HistoricalRuntimeCycle {
  cycleReference: string;
  compositeScore: number;
  ebitda: number;
  netIncome: number;
  ocf: number;
  cashEquivalents: number;
  equity: number;
  totalDebt: number;
  workingCapital: number;
  fiduciaryClassification: string; // e.g. "HEALTHY", "WARNING", "CRITICAL", etc.
  lineageHash: string;
  isQuarantined: boolean;
  isRestricted: boolean;
}

export interface ExecutiveTimelineOutput {
  trajectoryClassification: TrajectoryClassification;
  accelerationState: AccelerationState;
  confidenceLevel: TimelineConfidence;
  inflectionPoints: TimelineInflectionPoint[];
  timelineEvents: TimelineEvent[];
  executiveNarrative: string;
  lineageHash: string;
}
