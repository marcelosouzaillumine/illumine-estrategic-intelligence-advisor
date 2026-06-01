// src/core/runtime/shared/fail-closed-types.ts

export type FailClosedState =
  | 'NOT_AVAILABLE'
  | 'INSUFFICIENT_DATA'
  | 'EMPTY_CYCLE'
  | 'HISTORICAL_LIMITATION'
  | 'INVALID_CALCULATION'
  | 'FIDUCIARY_RESTRICTION'
  | 'RUNTIME_BLOCKED';

export type FailClosedSeverity = 
  | 'WARNING'
  | 'ERROR'
  | 'CRITICAL_BLOCK';

export interface FailClosedReason {
  code: string;
  description: string;
  triggeringEngine: string;
  severity: FailClosedSeverity;
}

export interface FailClosedDisclosure {
  disclosureId: string;
  statement: string;
  isAcknowledged: boolean;
}

export interface FailClosedOutput {
  state: FailClosedState;
  reasons: FailClosedReason[];
  disclosures: FailClosedDisclosure[];
  blockedOutputs: string[];
}

export interface InsufficientDataState extends FailClosedOutput {
  state: 'INSUFFICIENT_DATA';
  missingDataPoints: string[];
}

export interface HistoricalLimitationState extends FailClosedOutput {
  state: 'HISTORICAL_LIMITATION';
  requiredCycles: number;
  availableCycles: number;
}

export interface RestrictedInferenceState extends FailClosedOutput {
  state: 'FIDUCIARY_RESTRICTION' | 'RUNTIME_BLOCKED';
  restrictionSource: string;
}
