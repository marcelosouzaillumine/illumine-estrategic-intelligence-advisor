export type ConfidenceLevel = 'LOW' | 'MODERATE' | 'HIGH' | 'INSUFFICIENT_HISTORY';

export interface PredictiveBase {
  confidenceLevel: ConfidenceLevel;
  confidenceReason: string;
}

export type TrajectoryDirection = 'IMPROVING' | 'STABLE' | 'DETERIORATING';

export interface InstitutionalSnapshot {
  id: string;
  timestamp: string; // ISO format
  governanceScore: number;
  cescfScore: number;
  bpHealth: number;
  dfcHealth: number;
  dreHealth: number;
  esgMaturity: number;
}
