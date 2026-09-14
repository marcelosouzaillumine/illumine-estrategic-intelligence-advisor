// src/core/runtime/predictive-intelligence/predictive-types.ts
//
// Institutional Predictive Intelligence Framework Types

export type PredictiveSeverity =
  | 'STABLE'
  | 'ATTENTION'
  | 'HIGH_RISK'
  | 'CRITICAL'
  | 'RUPTURE_RISK'
  | 'SYSTEMIC_COLLAPSE_RISK'
  | 'INSUFFICIENT_PREDICTIVE_HISTORY';

export type PredictiveConfidence = 'LOW' | 'MEDIUM' | 'HIGH';

export type EarlyWarningClass =
  | 'Liquidity Deterioration Warning'
  | 'Governance Fatigue Escalation'
  | 'Strategic Instability Warning'
  | 'Capital Preservation Risk'
  | 'Survivability Rupture Risk'
  | 'Executive Consistency Collapse'
  | 'Institutional Drift Acceleration'
  | 'Resilience Erosion Warning'
  | 'Recovery Failure Risk';

export interface EarlyWarningSignal {
  warningClass: EarlyWarningClass;
  severity: PredictiveSeverity;
  confidence: PredictiveConfidence;
  description: string;
  triggerFactors: string[];
  timestamp: string;
}

export interface TrajectoryPoint {
  dimension: string;
  currentValue: number;
  projectedValue: number;
  velocity: number;
  acceleration: number;
  confidenceInterval: { min: number; max: number };
}

export interface PredictiveAssessmentResult {
  predictiveSeverity: PredictiveSeverity;
  predictiveConfidence: PredictiveConfidence;
  warnings: EarlyWarningSignal[];
  trajectoryForecast: TrajectoryPoint[];
  deteriorationMomentum: {
    liquidityMomentum: number;          // velocity of change
    governanceStabilityMomentum: number;
    fatigueEscalationMomentum: number;
    strategicVolatilityMomentum: number;
    driftAccelerationMomentum: number;
    survivabilityMomentum: number;
  };
  resilienceIndex: number;              // 0-100
  recoveryViabilityIndex: number;       // 0-100
  falseRecoveryRisk: boolean;
  isRuptureApproaching: boolean;
  systemicFailureProbability: number;   // 0-100
  timestamp: string;
}
